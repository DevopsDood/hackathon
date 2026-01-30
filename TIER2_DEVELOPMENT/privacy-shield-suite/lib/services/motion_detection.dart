import 'dart:async';
import 'dart:typed_data';
import 'package:camera/camera.dart';

/// Motion detection configuration
class MotionConfig {
  /// Sensitivity threshold (0.0 - 100.0)
  final double sensitivity;

  /// Minimum motion pixels required to trigger detection
  final int minMotionPixels;

  /// Cooldown between motion events (milliseconds)
  final int cooldownMs;

  /// Whether to enable noise reduction
  final bool noiseReduction;

  MotionConfig({
    this.sensitivity = 50.0,
    this.minMotionPixels = 100,
    this.cooldownMs = 1000,
    this.noiseReduction = true,
  });
}

/// Motion detection result
class MotionResult {
  final bool motionDetected;
  final double motionScore;
  final int changedPixels;
  final DateTime timestamp;

  MotionResult({
    required this.motionDetected,
    required this.motionScore,
    required this.changedPixels,
    required this.timestamp,
  });
}

/// Motion detection service
/// Uses frame differencing algorithm to detect motion
class MotionDetectionService {
  MotionConfig _config;
  Uint8List? _previousFrame;
  int _frameWidth = 0;
  int _frameHeight = 0;
  DateTime? _lastMotionTime;

  final _motionController = StreamController<MotionResult>.broadcast();
  Stream<MotionResult> get motionStream => _motionController.stream;

  /// Current configuration
  MotionConfig get config => _config;

  MotionDetectionService({MotionConfig? config})
      : _config = config ?? MotionConfig();

  /// Update configuration
  void updateConfig(MotionConfig config) {
    _config = config;
    _previousFrame = null; // Reset on config change
  }

  /// Process a camera frame and detect motion
  Future<MotionResult> processFrame(CameraImage image) async {
    // Convert YUV to grayscale
    final grayscale = await _convertToGrayscale(image);

    // Initialize frame dimensions on first frame
    if (_frameWidth == 0 || _frameHeight == 0) {
      _frameWidth = image.width;
      _frameHeight = image.height;
    }

    // Skip if previous frame is null or different size
    if (_previousFrame == null || _previousFrame!.length != grayscale.length) {
      _previousFrame = grayscale;
      return MotionResult(
        motionDetected: false,
        motionScore: 0.0,
        changedPixels: 0,
        timestamp: DateTime.now(),
      );
    }

    // Calculate motion
    final result = _calculateMotion(grayscale, _previousFrame!);

    // Update previous frame
    _previousFrame = grayscale;

    // Emit result if motion detected and not in cooldown
    final now = DateTime.now();
    if (result.motionDetected) {
      if (_lastMotionTime == null ||
          now.difference(_lastMotionTime!).inMilliseconds > _config.cooldownMs) {
        _lastMotionTime = now;
        _motionController.add(result);
      }
    }

    return result;
  }

  /// Convert YUV camera image to grayscale
  Future<Uint8List> _convertToGrayscale(CameraImage image) async {
    final result = Uint8List(image.width * image.height);

    // YUV420 planar format
    final yPlane = image.planes[0].bytes;
    final uvPlane = image.planes[1].bytes;

    for (int y = 0; y < image.height; y++) {
      for (int x = 0; x < image.width; x++) {
        final yIndex = y * image.planes[0].bytesPerRow + x;
        final uvIndex = (y ~/ 2) * image.planes[1].bytesPerRow + (x ~/ 2) * 2;

        final yValue = yPlane[yIndex];
        final uValue = uvPlane[uvIndex];
        final vValue = uvPlane[uvIndex + 1];

        // Simple YUV to RGB conversion, then to grayscale
        // Y' = 0.299*R + 0.587*G + 0.114*B
        // Using simplified formula: Y' = Y
        result[y * image.width + x] = yValue;
      }
    }

    // Apply noise reduction if enabled
    if (_config.noiseReduction) {
      return _applyNoiseReduction(result, image.width, image.height);
    }

    return result;
  }

  /// Apply simple noise reduction using Gaussian blur approximation
  Uint8List _applyNoiseReduction(Uint8List input, int width, int height) {
    final result = Uint8List(input.length);
    final kernelSize = 3;
    final halfKernel = kernelSize ~/ 2;

    for (int y = halfKernel; y < height - halfKernel; y++) {
      for (int x = halfKernel; x < width - halfKernel; x++) {
        int sum = 0;
        int count = 0;

        for (int ky = -halfKernel; ky <= halfKernel; ky++) {
          for (int kx = -halfKernel; kx <= halfKernel; kx++) {
            final pixel = input[(y + ky) * width + (x + kx)];
            sum += pixel;
            count++;
          }
        }

        result[y * width + x] = (sum / count).round();
      }
    }

    return result;
  }

  /// Calculate motion between two frames
  MotionResult _calculateMotion(Uint8List current, Uint8List previous) {
    assert(current.length == previous.length, 'Frame sizes must match');

    int changedPixels = 0;
    int totalDiff = 0;

    // Downsample for faster processing
    final blockSize = 4;
    final width = _frameWidth;
    final height = _frameHeight;
    final downsampledWidth = width ~/ blockSize;
    final downsampledHeight = height ~/ blockSize;

    for (int y = 0; y < downsampledHeight; y++) {
      for (int x = 0; x < downsampledWidth; x++) {
        int blockDiff = 0;

        // Compare 4x4 blocks
        for (int by = 0; by < blockSize; by++) {
          for (int bx = 0; bx < blockSize; bx++) {
            final py = y * blockSize + by;
            final px = x * blockSize + bx;
            final currentIdx = py * width + px;
            final prevIdx = currentIdx;

            if (currentIdx < current.length && prevIdx < previous.length) {
              final diff = (current[currentIdx] - previous[prevIdx]).abs();
              blockDiff += diff;
              totalDiff += diff;
            }
          }
        }

        // Average block difference
        final avgBlockDiff = blockDiff / (blockSize * blockSize);

        // Threshold based on sensitivity
        final threshold = 255 * (_config.sensitivity / 100.0);

        if (avgBlockDiff > threshold) {
          changedPixels++;
        }
      }
    }

    // Calculate motion score (0.0 - 1.0)
    final totalBlocks = downsampledWidth * downsampledHeight;
    final motionScore = changedPixels / totalBlocks;

    // Check if motion is significant
    final motionDetected = changedPixels >= _config.minMotionPixels;

    return MotionResult(
      motionDetected: motionDetected,
      motionScore: motionScore,
      changedPixels: changedPixels * blockSize * blockSize,
      timestamp: DateTime.now(),
    );
  }

  /// Reset motion detection state
  void reset() {
    _previousFrame = null;
    _lastMotionTime = null;
  }

  /// Dispose resources
  void dispose() {
    _motionController.close();
  }
}

/// Motion detection controller for UI
class MotionDetector {
  final MotionDetectionService _detectionService;
  bool _isEnabled = false;
  bool _isPaused = false;

  MotionDetector({MotionDetectionService? detectionService})
      : _detectionService = detectionService ?? MotionDetectionService();

  bool get isEnabled => _isEnabled;
  bool get isPaused => _isPaused;

  /// Enable motion detection
  void enable() {
    _isEnabled = true;
    _isPaused = false;
  }

  /// Disable motion detection
  void disable() {
    _isEnabled = false;
    _isPaused = false;
  }

  /// Pause motion detection (keeps state)
  void pause() {
    _isPaused = true;
  }

  /// Resume motion detection
  void resume() {
    _isPaused = false;
  }

  /// Process a frame if enabled and not paused
  Future<MotionResult?> processFrameIfEnabled(CameraImage image) async {
    if (!_isEnabled || _isPaused) return null;
    return await _detectionService.processFrame(image);
  }

  /// Update sensitivity
  void setSensitivity(double sensitivity) {
    _detectionService.updateConfig(
      MotionConfig(sensitivity: sensitivity),
    );
  }

  /// Stream of motion events
  Stream<MotionResult> get motionStream => _detectionService.motionStream;

  /// Dispose
  void dispose() {
    _detectionService.dispose();
  }
}
