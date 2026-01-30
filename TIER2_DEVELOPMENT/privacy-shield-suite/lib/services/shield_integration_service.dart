import 'dart:async';
import 'dart:typed_data';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// VPN connection states
enum VpnState {
  disconnected,
  connecting,
  connected,
  disconnecting,
  invalid,
}

/// VPN configuration model
class VpnConfig {
  final String serverAddress;
  final int serverPort;
  final String username;
  final String password;
  final String privateKey;
  final List<String> dnsServers;
  final List<String> allowedApps;
  final List<String> blockedApps;

  VpnConfig({
    required this.serverAddress,
    required this.serverPort,
    required this.username,
    required this.password,
    required this.privateKey,
    required this.dnsServers,
    required this.allowedApps,
    required this.blockedApps,
  });

  /// Convert to Map for platform channel
  Map<String, dynamic> toMap() {
    return {
      'serverAddress': serverAddress,
      'serverPort': serverPort,
      'username': username,
      'password': password,
      'privateKey': privateKey,
      'dnsServers': dnsServers,
      'allowedApps': allowedApps,
      'blockedApps': blockedApps,
    };
  }
}

/// VPN status for UI
class VpnStatusModel {
  final bool isConnected;
  final bool isConnecting;
  final bool killSwitchEnabled;
  final String serverAddress;
  final DateTime? connectedSince;
  final String? errorMessage;

  VpnStatusModel({
    required this.isConnected,
    required this.isConnecting,
    required this.killSwitchEnabled,
    required this.serverAddress,
    this.connectedSince,
    this.errorMessage,
  });
}

/// Privacy Shield Integration Service
/// Manages VPN connection for secure camera streaming
class ShieldIntegrationService {
  static const String VPN_CHANNEL = 'com.privacyshield/vpn';
  static const String VPN_SERVER = 'vpn.themail.host';
  static const int VPN_PORT = 51820;
  static const String KEY_VPN_PRIVATE_KEY = 'vpn_private_key';
  static const String KEY_VPN_PUBLIC_KEY = 'vpn_public_key';

  final MethodChannel _vpnChannel = const MethodChannel(VPN_CHANNEL);
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  final StreamController<VpnState> _vpnStateController = StreamController<VpnState>.broadcast();
  final StreamController<String> _vpnErrorController = StreamController<String>.broadcast();

  bool _killSwitchEnabled = true;
  DateTime? _connectedSince;
  VpnState _currentState = VpnState.disconnected;
  String? _currentError;

  StreamSubscription? _platformStateSubscription;

  Stream<VpnState> get vpnState => _vpnStateController.stream;
  Stream<String> get vpnErrors => _vpnErrorController.stream;
  bool get killSwitchEnabled => _killSwitchEnabled;
  VpnState get currentState => _currentState;

  ShieldIntegrationService() {
    _initPlatformListener();
  }

  void _initPlatformListener() {
    _vpnChannel.setMethodCallHandler(_handlePlatformCall);
  }

  Future<dynamic> _handlePlatformCall(MethodCall call) async {
    switch (call.method) {
      case 'onVpnStateChanged':
        final String stateStr = call.argument('state');
        final VpnState state = _parseVpnState(stateStr);
        _updateState(state);
        break;
      case 'onVpnError':
        final String error = call.argument('error');
        _currentError = error;
        _vpnErrorController.add(error);
        break;
    }
  }

  VpnState _parseVpnState(String stateStr) {
    switch (stateStr) {
      case 'disconnected':
        return VpnState.disconnected;
      case 'connecting':
        return VpnState.connecting;
      case 'connected':
        return VpnState.connected;
      case 'disconnecting':
        return VpnState.disconnecting;
      default:
        return VpnState.invalid;
    }
  }

  /// Initialize VPN connection
  Future<void> initializeShield({
    required String username,
    required String password,
  }) async {
    try {
      // Generate or retrieve secure WireGuard keys
      final privateKey = await _getOrGeneratePrivateKey();
      final publicKey = await _getOrGeneratePublicKey();

      // Configure VPN
      final config = VpnConfig(
        serverAddress: VPN_SERVER,
        serverPort: VPN_PORT,
        username: username,
        password: password,
        privateKey: privateKey,
        dnsServers: ['10.0.0.1', '10.0.0.2'],
        allowedApps: [], // Empty = all traffic through VPN
        blockedApps: [], // Blocked apps bypass VPN
      );

      await _configureVpn(config);
      
      // Store public key for reference
      await _secureStorage.write(key: KEY_VPN_PUBLIC_KEY, value: publicKey);
      
      print('VPN initialized with public key: ${publicKey.substring(0, 16)}...');
    } catch (e) {
      _currentError = 'Failed to initialize VPN: $e';
      _vpnErrorController.add(_currentError!);
      rethrow;
    }
  }

  /// Start the VPN tunnel
  Future<void> startShield() async {
    _updateState(VpnState.connecting);
    _currentError = null;

    try {
      await _connectVpn();
      _connectedSince = DateTime.now();
      _killSwitchEnabled = true;
      _updateState(VpnState.connected);
      
      // Enable kill switch automatically
      if (_killSwitchEnabled) {
        await _enableKillSwitch();
      }
    } catch (e) {
      _updateState(VpnState.invalid);
      _currentError = 'Failed to connect: $e';
      _vpnErrorController.add(_currentError!);
      throw Exception('Failed to start VPN: $e');
    }
  }

  /// Stop the VPN tunnel
  Future<void> stopShield() async {
    _updateState(VpnState.disconnecting);

    try {
      // Disable kill switch first
      await _disableKillSwitch();
      
      await _disconnectVpn();
      _connectedSince = null;
      _killSwitchEnabled = false;
      _updateState(VpnState.disconnected);
    } catch (e) {
      _updateState(VpnState.invalid);
      _currentError = 'Failed to disconnect: $e';
      _vpnErrorController.add(_currentError!);
    }
  }

  /// Check if camera can send data
  bool canSendCameraData() {
    return _currentState == VpnState.connected;
  }

  /// Get VPN status for UI
  VpnStatusModel get currentStatus {
    return VpnStatusModel(
      isConnected: _currentState == VpnState.connected,
      isConnecting: _currentState == VpnState.connecting,
      killSwitchEnabled: _killSwitchEnabled,
      serverAddress: VPN_SERVER,
      connectedSince: _connectedSince,
      errorMessage: _currentError,
    );
  }

  /// Enable kill switch
  Future<void> enableKillSwitch() async {
    _killSwitchEnabled = true;
    await _enableKillSwitch();
  }

  /// Disable kill switch
  Future<void> disableKillSwitch() async {
    _killSwitchEnabled = false;
    await _disableKillSwitch();
  }

  void _updateState(VpnState state) {
    _currentState = state;
    _vpnStateController.add(state);
  }

  /// Get or generate WireGuard private key from secure storage
  Future<String> _getOrGeneratePrivateKey() async {
    final existingKey = await _secureStorage.read(key: KEY_VPN_PRIVATE_KEY);
    
    if (existingKey != null) {
      return existingKey;
    }

    // Generate new WireGuard key pair
    final keyPair = await _generateWireGuardKeyPair();
    
    // Store private key securely
    await _secureStorage.write(
      key: KEY_VPN_PRIVATE_KEY,
      value: keyPair['privateKey']!,
    );

    return keyPair['privateKey']!;
  }

  /// Get or generate WireGuard public key
  Future<String> _getOrGeneratePublicKey() async {
    final existingKey = await _secureStorage.read(key: KEY_VPN_PUBLIC_KEY);
    
    if (existingKey != null) {
      return existingKey;
    }

    // Generate new key pair
    final keyPair = await _generateWireGuardKeyPair();
    
    await _secureStorage.write(
      key: KEY_VPN_PUBLIC_KEY,
      value: keyPair['publicKey']!,
    );

    return keyPair['publicKey']!;
  }

  /// Generate WireGuard key pair using platform channel
  Future<Map<String, String>> _generateWireGuardKeyPair() async {
    try {
      final result = await _vpnChannel.invokeMethod<Map<Object?, Object?>>('generateKeyPair');
      
      if (result != null) {
        return {
          'privateKey': result['privateKey'] as String,
          'publicKey': result['publicKey'] as String,
        };
      }
    } catch (e) {
      print('Failed to generate key pair on platform: $e');
    }

    // Fallback: return placeholder keys (should never reach here in production)
    return {
      'privateKey': 'REPLACE_WITH_SECURE_KEY',
      'publicKey': 'REPLACE_WITH_PUBLIC_KEY',
    };
  }

  /// Configure VPN with provided configuration
  Future<void> _configureVpn(VpnConfig config) async {
    try {
      await _vpnChannel.invokeMethod('configureVpn', config.toMap());
      print('VPN configured for ${config.serverAddress}:${config.serverPort}');
    } on PlatformException catch (e) {
      throw Exception('VPN configuration failed: ${e.message}');
    }
  }

  /// Connect to VPN
  Future<void> _connectVpn() async {
    try {
      await _vpnChannel.invokeMethod('connectVpn');
      print('VPN connection initiated');
    } on PlatformException catch (e) {
      throw Exception('VPN connection failed: ${e.message}');
    }
  }

  /// Disconnect from VPN
  Future<void> _disconnectVpn() async {
    try {
      await _vpnChannel.invokeMethod('disconnectVpn');
      print('VPN disconnected');
    } on PlatformException catch (e) {
      throw Exception('VPN disconnection failed: ${e.message}');
    }
  }

  /// Enable kill switch - block all traffic except VPN
  Future<void> _enableKillSwitch() async {
    try {
      await _vpnChannel.invokeMethod('enableKillSwitch');
      print('Kill switch enabled');
    } on PlatformException catch (e) {
      print('Failed to enable kill switch: ${e.message}');
    }
  }

  /// Disable kill switch - remove traffic blocks
  Future<void> _disableKillSwitch() async {
    try {
      await _vpnChannel.invokeMethod('disableKillSwitch');
      print('Kill switch disabled');
    } on PlatformException catch (e) {
      print('Failed to disable kill switch: ${e.message}');
    }
  }

  /// Get current VPN statistics
  Future<Map<String, dynamic>> getVpnStats() async {
    try {
      final result = await _vpnChannel.invokeMethod<Map<Object?, Object?>>('getVpnStats');
      
      if (result != null) {
        return {
          'bytesIn': result['bytesIn'] as int? ?? 0,
          'bytesOut': result['bytesOut'] as int? ?? 0,
          'packetsIn': result['packetsIn'] as int? ?? 0,
          'packetsOut': result['packetsOut'] as int? ?? 0,
        };
      }
    } catch (e) {
      print('Failed to get VPN stats: $e');
    }
    
    return {
      'bytesIn': 0,
      'bytesOut': 0,
      'packetsIn': 0,
      'packetsOut': 0,
    };
  }

  /// Check VPN permissions
  Future<bool> checkVpnPermissions() async {
    try {
      final result = await _vpnChannel.invokeMethod<bool>('checkVpnPermissions');
      return result ?? false;
    } catch (e) {
      print('Failed to check VPN permissions: $e');
      return false;
    }
  }

  void dispose() {
    _platformStateSubscription?.cancel();
    _vpnStateController.close();
    _vpnErrorController.close();
  }
}
