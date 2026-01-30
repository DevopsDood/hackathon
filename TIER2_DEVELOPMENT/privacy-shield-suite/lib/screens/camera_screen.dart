import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'dart:typed_data';
import '../services/shield_integration_service.dart';
import '../services/camera_vpn_tunnel.dart';
import '../services/camera_kill_switch.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  CameraController? _cameraController;
  late ShieldIntegrationService _shieldService;
  late CameraVpnTunnel _cameraTunnel;
  late CameraKillSwitch _killSwitch;
  
  bool _isCameraInitialized = false;
  bool _isStreaming = false;
  bool _vpnConnected = false;

  @override
  void initState() {
    super.initState();
    _initializeServices();
    _initializeCamera();
  }

  Future<void> _initializeServices() async {
    _shieldService = ShieldIntegrationService();
    _cameraTunnel = CameraVpnTunnel(_shieldService);
    _killSwitch = CameraKillSwitch(_shieldService);

    _shieldService.vpnState.listen((state) {
      setState(() => _vpnConnected = state == VpnState.connected);
    });

    await _shieldService.initializeShield(username: 'user', password: 'pass');
  }

  Future<void> _initializeCamera() async {
    final cameras = await availableCameras();
    if (cameras.isEmpty) return;

    _cameraController = CameraController(
      cameras.first,
      ResolutionPreset.medium,
      enableAudio: false,
    );

    await _cameraController!.initialize();
    setState(() => _isCameraInitialized = true);
  }

  Future<void> _startStreaming() async {
    if (!_vpnConnected) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('VPN must be connected to stream')),
      );
      return;
    }

    final key = EncryptionKey(Uint8List(32));
    
    await _cameraTunnel.startEncryptedStream(
      cameraController: _cameraController!,
      targetUrl: 'https://secure.themail.host/upload',
      key: key,
    );

    setState(() => _isStreaming = true);
  }

  Future<void> _stopStreaming() async {
    await _cameraTunnel.stopEncryptedStream(_cameraController!);
    setState(() => _isStreaming = false);
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    _cameraTunnel.dispose();
    _shieldService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Shield Camera'),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: _vpnConnected ? Colors.green : Colors.red,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  _vpnConnected ? Icons.vpn_lock : Icons.vpn_key_off,
                  color: Colors.white,
                  size: 16,
                ),
                const SizedBox(width: 4),
                Text(
                  _vpnConnected ? 'VPN ON' : 'VPN OFF',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: _isCameraInitialized
                ? AspectRatio(
                    aspectRatio: _cameraController!.value.aspectRatio,
                    child: CameraPreview(_cameraController!),
                  )
                : const Center(child: CircularProgressIndicator()),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  onPressed: _vpnConnected ? _shieldService.stopShield : _shieldService.startShield,
                  icon: Icon(_vpnConnected ? Icons.stop : Icons.play_arrow),
                  label: Text(_vpnConnected ? 'Disconnect VPN' : 'Connect VPN'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _vpnConnected ? Colors.red : Colors.green,
                    foregroundColor: Colors.white,
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: _isStreaming ? _stopStreaming : _startStreaming,
                  icon: Icon(_isStreaming ? Icons.stop : Icons.videocam),
                  label: Text(_isStreaming ? 'Stop Stream' : 'Start Stream'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isStreaming ? Colors.orange : Colors.blue,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _killSwitch.enabled ? Icons.shield : Icons.shield_outlined,
                  color: _killSwitch.enabled ? Colors.green : Colors.grey,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  'Kill Switch: ${_killSwitch.enabled ? 'Enabled' : 'Disabled'}',
                  style: TextStyle(
                    color: _killSwitch.enabled ? Colors.green : Colors.grey,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}