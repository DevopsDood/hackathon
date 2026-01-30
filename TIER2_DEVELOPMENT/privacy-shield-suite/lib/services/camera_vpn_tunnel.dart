import 'dart:async';
import 'dart:typed_data';
import 'package:camera/camera.dart';
import 'package:encrypt/encrypt.dart' as encrypt;
import 'package:crypto/crypto.dart';
import 'dart:convert';
import 'shield_integration_service.dart';

/// Encrypted camera frame
class EncryptedFrame {
  final Uint8List data;
  final DateTime timestamp;
  final int size;

  EncryptedFrame({
    required this.data,
    required this.timestamp,
    required this.size,
  });
}

/// Session encryption key
class EncryptionKey {
  final Uint8List sessionKey;
  
  EncryptionKey(this.sessionKey);
}

/// Exception thrown when VPN is not connected
class VpnNotConnectedException implements Exception {
  final String message;
  VpnNotConnectedException(this.message);
  
  @override
  String toString() => 'VpnNotConnectedException: $message';
}

/// Camera VPN Tunnel
/// Encrypts and streams camera data through VPN tunnel
class CameraVpnTunnel {
  final ShieldIntegrationService _shield;
  final StreamController<EncryptedFrame> _encryptedFrames = StreamController.broadcast();
  StreamSubscription<CameraImage>? _cameraSubscription;
  bool _isStreaming = false;

  CameraVpnTunnel(this._shield);

  Stream<EncryptedFrame> get encryptedFrames => _encryptedFrames.stream;
  bool get isStreaming => _isStreaming;

  /// Start encrypted camera streaming through VPN
  Future<void> startEncryptedStream({
    required CameraController cameraController,
    required String targetUrl,
    required EncryptionKey key,
  }) async {
    // Ensure VPN is connected before streaming
    if (!_shield.canSendCameraData()) {
      throw VpnNotConnectedException('VPN must be connected for encrypted streaming');
    }

    _isStreaming = true;

    // Start camera stream
    await cameraController.startImageStream((CameraImage image) async {
      if (!_isStreaming) return;
      
      try {
        // Convert camera image to bytes
        final frameData = await _convertCameraImageToBytes(image);
        
        // Encrypt frame with session key
        final encrypted = await _encryptFrame(frameData, key);
        
        // Send through VPN tunnel
        await _sendThroughVpn(targetUrl, encrypted);
        
        // Emit for UI preview
        _encryptedFrames.add(EncryptedFrame(
          data: encrypted,
          timestamp: DateTime.now(),
          size: encrypted.length,
        ));
      } catch (e) {
        print('Frame encryption failed: $e');
      }
    });
  }

  /// Stop encrypted streaming
  Future<void> stopEncryptedStream(CameraController cameraController) async {
    _isStreaming = false;
    await _cameraSubscription?.cancel();
    await cameraController.stopImageStream();
  }

  /// Convert camera image to bytes
  Future<Uint8List> _convertCameraImageToBytes(CameraImage image) async {
    // Combine YUV planes or use JPEG encoding
    final WriteBuffer allBytes = WriteBuffer();
    for (final Plane plane in image.planes) {
      allBytes.putUint8List(plane.bytes);
    }
    return allBytes.done().buffer.asUint8List();
  }

  /// Encrypt frame using ChaCha20-Poly1305
  Future<Uint8List> _encryptFrame(Uint8List frameData, EncryptionKey key) async {
    // Use ChaCha20-Poly1305 for streaming encryption
    final iv = encrypt.IV.fromSecureRandom(12);
    final encrypter = encrypt.Encrypter(
      encrypt.ChaCha20Poly1305(encrypt.Key(key.sessionKey)),
    );
    
    final encrypted = encrypter.encryptBytes(frameData, iv: iv);
    
    // Prepend IV for decryption
    final result = Uint8List(iv.bytes.length + encrypted.bytes.length);
    result.setRange(0, iv.bytes.length, iv.bytes);
    result.setRange(iv.bytes.length, result.length, encrypted.bytes);
    
    return result;
  }

  /// Send encrypted data through VPN tunnel
  Future<void> _sendThroughVpn(String url, Uint8List encrypted) async {
    // In production, this would use an HTTP client configured to route through VPN
    // The VPN tunnel ensures all traffic goes through the encrypted tunnel
    print('Sending ${encrypted.length} bytes through VPN tunnel to $url');
  }

  void dispose() {
    _encryptedFrames.close();
  }
}

/// WriteBuffer helper for combining bytes
class WriteBuffer {
  final _buffer = BytesBuilder();

  void putUint8List(Uint8List list) {
    _buffer.add(list);
  }

  ByteData done() {
    final bytes = _buffer.toBytes();
    return ByteData.sublistView(Uint8List.fromList(bytes));
  }
}