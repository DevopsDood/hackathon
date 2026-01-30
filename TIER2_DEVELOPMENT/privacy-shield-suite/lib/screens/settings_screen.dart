import 'package:flutter/material.dart';
import '../services/shield_integration_service.dart';
import '../services/camera_kill_switch.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _shieldService = ShieldIntegrationService();
  late CameraKillSwitch _killSwitch;
  bool _killSwitchEnabled = true;

  @override
  void initState() {
    super.initState();
    _killSwitch = CameraKillSwitch(_shieldService);
    _killSwitchEnabled = _killSwitch.enabled;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Shield Settings'),
      ),
      body: ListView(
        children: [
          const ListTile(
            title: Text('VPN Settings', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          ListTile(
            leading: const Icon(Icons.vpn_key),
            title: const Text('VPN Server'),
            subtitle: const Text('vpn.themail.host:51820'),
          ),
          ListTile(
            leading: const Icon(Icons.dns),
            title: const Text('DNS Servers'),
            subtitle: const Text('10.0.0.1, 10.0.0.2'),
          ),
          const Divider(),
          const ListTile(
            title: Text('Security', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          SwitchListTile(
            secondary: const Icon(Icons.shield),
            title: const Text('Kill Switch'),
            subtitle: const Text('Block camera if VPN disconnects'),
            value: _killSwitchEnabled,
            onChanged: (value) async {
              setState(() => _killSwitchEnabled = value);
              if (value) {
                await _killSwitch.enableKillSwitch();
              } else {
                await _killSwitch.disableKillSwitch();
              }
            },
          ),
          const Divider(),
          const ListTile(
            title: Text('About', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          const ListTile(
            leading: Icon(Icons.info),
            title: Text('Version'),
            subtitle: Text('1.0.0'),
          ),
          const ListTile(
            leading: Icon(Icons.security),
            title: Text('Encryption'),
            subtitle: Text('ChaCha20-Poly1305 + Kyber-768'),
          ),
        ],
      ),
    );
  }
}