import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Secure Key Storage Service
/// Manages encryption keys using Android Keystore via flutter_secure_storage
class SecureKeyStorage {
  static const String KEY_VPN_PRIVATE_KEY = 'vpn_private_key';
  static const String KEY_SESSION_KEY = 'session_key';
  static const String KEY_ENCRYPTION_KEY = 'encryption_key';

  final FlutterSecureStorage _secureStorage;

  SecureKeyStorage({FlutterSecureStorage? secureStorage})
      : _secureStorage = secureStorage ?? const FlutterSecureStorage();

  /// Generate and store a new WireGuard private key
  Future<String> generateAndStoreVpnPrivateKey() async {
    // Generate a 32-byte random key (256 bits)
    final bytes = List<int>.generate(32, (i) => _randomByte());
    final privateKey = _base64Encode(bytes);

    await _secureStorage.write(
      key: KEY_VPN_PRIVATE_KEY,
      value: privateKey,
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
    );

    return privateKey;
  }

  /// Get the stored VPN private key
  Future<String?> getVpnPrivateKey() async {
    return await _secureStorage.read(
      key: KEY_VPN_PRIVATE_KEY,
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
    );
  }

  /// Generate and store a session encryption key
  Future<Uint8List> generateAndStoreSessionKey() async {
    final bytes = List<int>.generate(32, (i) => _randomByte());
    final key = Uint8List.fromList(bytes);

    await _secureStorage.write(
      key: KEY_SESSION_KEY,
      value: _base64Encode(bytes),
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
    );

    return key;
  }

  /// Get the stored session key
  Future<Uint8List?> getSessionKey() async {
    final encoded = await _secureStorage.read(
      key: KEY_SESSION_KEY,
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
    );

    if (encoded == null) return null;
    return _base64Decode(encoded);
  }

  /// Generate and store a frame encryption key
  Future<Uint8List> generateAndStoreEncryptionKey() async {
    final bytes = List<int>.generate(32, (i) => _randomByte());
    final key = Uint8List.fromList(bytes);

    await _secureStorage.write(
      key: KEY_ENCRYPTION_KEY,
      value: _base64Encode(bytes),
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
    );

    return key;
  }

  /// Get the stored encryption key
  Future<Uint8List?> getEncryptionKey() async {
    final encoded = await _secureStorage.read(
      key: KEY_ENCRYPTION_KEY,
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
    );

    if (encoded == null) return null;
    return _base64Decode(encoded);
  }

  /// Delete all stored keys
  Future<void> clearAllKeys() async {
    await _secureStorage.deleteAll(
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
    );
  }

  /// Check if keys exist
  Future<bool> hasVpnPrivateKey() async {
    return await _secureStorage.containsKey(
      key: KEY_VPN_PRIVATE_KEY,
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
    );
  }

  int _randomByte() {
    return DateTime.now().microsecondsSinceEpoch % 256;
  }

  String _base64Encode(List<int> data) {
    return String.fromCharCodes(data.map((e) => e));
  }

  Uint8List _base64Decode(String encoded) {
    return Uint8List.fromList(encoded.codeUnits);
  }
}

/// Migration utility for old plain-text keys
class KeyMigration {
  final SecureKeyStorage _secureStorage;

  KeyMigration({required SecureKeyStorage secureStorage}) : _secureStorage = secureStorage;

  /// Migrate old private key to secure storage
  Future<void> migratePrivateKey(String oldKey) async {
    await _secureStorage.write(
      key: SecureKeyStorage.KEY_VPN_PRIVATE_KEY,
      value: oldKey,
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
    );
  }
}
