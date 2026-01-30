import 'dart:async';
import 'package:flutter/services.dart';
import 'shield_integration_service.dart';

/// Notification severity levels
enum NotificationSeverity {
  info,
  warning,
  critical,
}

/// Privacy alert notification
class PrivacyAlert {
  final String title;
  final String message;
  final NotificationSeverity severity;
  final DateTime timestamp;

  PrivacyAlert({
    required this.title,
    required this.message,
    this.severity = NotificationSeverity.info,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  bool get isCritical => severity == NotificationSeverity.critical;
}

/// Notification service for kill switch events
class PrivacyNotificationService {
  static const String NOTIFICATION_CHANNEL = 'com.privacyshield/notifications';
  static const int PRIVACY_ALERT_NOTIFICATION_ID = 1001;

  final MethodChannel _notificationChannel = const MethodChannel(NOTIFICATION_CHANNEL);
  final StreamController<PrivacyAlert> _alertController = StreamController<PrivacyAlert>.broadcast();

  Stream<PrivacyAlert> get alerts => _alertController.stream;

  /// Show privacy alert notification
  Future<void> showAlert(PrivacyAlert alert) async {
    // Emit to stream for UI updates
    _alertController.add(alert);

    try {
      await _notificationChannel.invokeMethod('showNotification', {
        'id': PRIVACY_ALERT_NOTIFICATION_ID,
        'title': alert.title,
        'message': alert.message,
        'severity': alert.severity.index,
        'isCritical': alert.isCritical,
      });
    } on PlatformException catch (e) {
      print('Failed to show notification: ${e.message}');
    }
  }

  /// Show critical VPN disconnect alert
  Future<void> showVpnDisconnectAlert() async {
    await showAlert(PrivacyAlert(
      title: 'VPN Disconnected',
      message: 'Camera network access has been blocked for privacy protection.',
      severity: NotificationSeverity.critical,
    ));
  }

  /// Show VPN connect confirmation
  Future<void> showVpnConnectedAlert() async {
    await showAlert(PrivacyAlert(
      title: 'VPN Connected',
      message: 'Camera streaming is now enabled through secure tunnel.',
      severity: NotificationSeverity.info,
    ));
  }

  /// Show kill switch status change
  Future<void> showKillSwitchStatusChange(bool enabled) async {
    await showAlert(PrivacyAlert(
      title: enabled ? 'Kill Switch Enabled' : 'Kill Switch Disabled',
      message: enabled
          ? 'Camera network access will be blocked if VPN disconnects.'
          : 'Camera network access will be allowed if VPN disconnects.',
      severity: enabled ? NotificationSeverity.info : NotificationSeverity.warning,
    ));
  }
}
