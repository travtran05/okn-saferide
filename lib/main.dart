import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:camera/camera.dart';
import 'package:permission_handler/permission_handler.dart';
import 'dart:async';
import 'dart:math' as math;

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const OKNSafeRideApp());
}

class OKNSafeRideApp extends StatelessWidget {
  const OKNSafeRideApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OKN SafeRide',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
        brightness: Brightness.light,
      ),
      home: const TestScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class TestScreen extends StatefulWidget {
  const TestScreen({super.key});

  @override
  State<TestScreen> createState() => _TestScreenState();
}

class _TestScreenState extends State<TestScreen> with TickerProviderStateMixin {
  // Test phases
  String _testPhase = 'idle'; // 'idle', 'positioning', 'okn-test', 'results'
  
  // Camera
  CameraController? _cameraController;
  List<CameraDescription>? _cameras;
  bool _cameraInitialized = false;
  
  // Face tracking simulation (MediaPipe would be integrated here)
  bool _faceDetected = false;
  bool _faceCentered = false;
  double _faceDistance = 0.0; // 0.0 = too close, 1.0 = perfect, 2.0 = too far
  double _eyeX = 0.0;
  double _eyeY = 0.0;
  
  // OKN Test
  late AnimationController _stripeController;
  late Animation<double> _stripeAnimation;
  Timer? _testTimer;
  int _testDuration = 10; // seconds
  int _timeRemaining = 10;
  
  // OKN Algorithm Data
  List<double> _eyeXData = [];
  List<double> _eyeYData = [];
  List<double> _timeData = [];
  double _oknGain = 0.0;
  
  // Animation for stripes
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _initializeCamera();
  }

  void _initializeAnimations() {
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    
    _stripeController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );
    
    _stripeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _stripeController,
      curve: Curves.linear,
    ));
  }

  Future<void> _initializeCamera() async {
    try {
      final cameras = await availableCameras();
      if (cameras.isNotEmpty) {
        _cameras = cameras;
        final frontCamera = cameras.firstWhere(
          (camera) => camera.lensDirection == CameraLensDirection.front,
          orElse: () => cameras.first,
        );
        
        _cameraController = CameraController(
          frontCamera,
          ResolutionPreset.high,
          enableAudio: false,
        );
        
        await _cameraController!.initialize();
        setState(() {
          _cameraInitialized = true;
        });
        
        // Start face detection simulation
        _startFaceDetection();
      }
    } catch (e) {
      print('Camera initialization error: $e');
    }
  }

  void _startFaceDetection() {
    // Simulate MediaPipe face detection
    Timer.periodic(const Duration(milliseconds: 100), (timer) {
      if (_testPhase == 'positioning' && mounted) {
        // Simulate face detection and distance calculation
        _simulateFaceDetection();
      } else if (_testPhase != 'positioning') {
        timer.cancel();
      }
    });
  }

  void _simulateFaceDetection() {
    // Simulate face detection with random variations
    setState(() {
      _faceDetected = math.Random().nextDouble() > 0.1; // 90% detection rate
      if (_faceDetected) {
        _faceCentered = math.Random().nextDouble() > 0.3; // 70% centered
        _faceDistance = 0.5 + math.Random().nextDouble(); // 0.5 to 1.5
        _eyeX = (math.Random().nextDouble() - 0.5) * 0.2; // -0.1 to 0.1
        _eyeY = (math.Random().nextDouble() - 0.5) * 0.2; // -0.1 to 0.1
      }
    });
  }

  void _startTest() async {
    // Request camera permission
    final status = await Permission.camera.request();
    if (status != PermissionStatus.granted) {
      _showErrorDialog('Camera permission is required for the test.');
      return;
    }

    // Force landscape orientation
    await SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.landscapeRight,
    ]);

    setState(() {
      _testPhase = 'positioning';
    });
  }

  void _startOKNTest() {
    setState(() {
      _testPhase = 'okn-test';
      _timeRemaining = _testDuration;
    });

    // Start stripe animation
    _stripeController.repeat();
    
    // Start test timer
    _testTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _timeRemaining--;
      });
      
      if (_timeRemaining <= 0) {
        timer.cancel();
        _completeTest();
      }
    });

    // Start eye tracking data collection
    _startEyeTracking();
  }

  void _startEyeTracking() {
    Timer.periodic(const Duration(milliseconds: 50), (timer) {
      if (_testPhase == 'okn-test' && mounted) {
        // Collect eye tracking data
        _eyeXData.add(_eyeX);
        _eyeYData.add(_eyeY);
        _timeData.add((_testDuration - _timeRemaining) + (_timeRemaining / 10.0));
        
        // Simulate eye movement following stripes
        _simulateEyeMovement();
      } else if (_testPhase != 'okn-test') {
        timer.cancel();
      }
    });
  }

  void _simulateEyeMovement() {
    // Simulate eye following the moving stripes
    final stripePhase = _stripeAnimation.value * 2 * math.pi;
    setState(() {
      _eyeX = math.sin(stripePhase) * 0.3; // Eye follows horizontal movement
      _eyeY = math.sin(stripePhase * 0.5) * 0.1; // Slight vertical movement
    });
  }

  void _completeTest() {
    _stripeController.stop();
    _testTimer?.cancel();
    
    // Calculate OKN gain using the algorithm
    _calculateOKNGain();
    
    setState(() {
      _testPhase = 'results';
    });
    
    // Return to portrait orientation
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
  }

  void _calculateOKNGain() {
    if (_eyeXData.length < 10) {
      _oknGain = 0.0;
      return;
    }

    // OKN Algorithm Implementation
    const double STRIPE_WIDTH = 44.0;
    const double STRIPE_GAP = 44.0;
    const double STRIPE_PERIOD = STRIPE_WIDTH + STRIPE_GAP;
    const double STRIPE_SPEED = 0.1; // degrees per second
    
    // Calculate stimulus velocity
    double stimulusVelocity = STRIPE_SPEED;
    
    // Calculate eye velocity using numerical differentiation
    List<double> eyeVelocities = [];
    for (int i = 1; i < _eyeXData.length; i++) {
      double velocity = (_eyeXData[i] - _eyeXData[i-1]) / 0.05; // 50ms intervals
      eyeVelocities.add(velocity);
    }
    
    // Calculate OKN gain as ratio of eye velocity to stimulus velocity
    if (eyeVelocities.isNotEmpty) {
      double avgEyeVelocity = eyeVelocities.reduce((a, b) => a + b) / eyeVelocities.length;
      _oknGain = (avgEyeVelocity / stimulusVelocity).abs();
    } else {
      _oknGain = 0.0;
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    _animationController.dispose();
    _stripeController.dispose();
    _testTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: _buildCurrentPhase(),
    );
  }

  Widget _buildCurrentPhase() {
    switch (_testPhase) {
      case 'idle':
        return _buildIdleScreen();
      case 'positioning':
        return _buildPositioningScreen();
      case 'okn-test':
        return _buildOKNTestScreen();
      case 'results':
        return _buildResultsScreen();
      default:
        return _buildIdleScreen();
    }
  }

  Widget _buildIdleScreen() {
    return Container(
      color: Colors.black,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.remove_red_eye,
              size: 80,
              color: Colors.white,
            ),
            const SizedBox(height: 20),
            const Text(
              'OKN SafeRide',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Impairment Detection Test',
              style: TextStyle(
                fontSize: 18,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: _startTest,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                textStyle: const TextStyle(fontSize: 18),
              ),
              child: const Text('START TEST'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPositioningScreen() {
    return Stack(
      children: [
        // Full screen camera
        if (_cameraInitialized && _cameraController != null)
          SizedBox(
            width: double.infinity,
            height: double.infinity,
            child: CameraPreview(_cameraController!),
          ),
        
        // Overlay with instructions
        Container(
          color: Colors.black.withOpacity(0.3),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Face detection status
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: _faceDetected ? Colors.green : Colors.red,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    _faceDetected ? 'FACE DETECTED' : 'NO FACE DETECTED',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                
                const SizedBox(height: 30),
                
                // Distance instructions
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    children: [
                      Text(
                        _getDistanceInstruction(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Keep your face centered and at the right distance',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 16,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 30),
                
                // Start OKN test button (only when face is properly positioned)
                if (_faceDetected && _faceCentered && _faceDistance > 0.8 && _faceDistance < 1.2)
                  ElevatedButton(
                    onPressed: _startOKNTest,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                      textStyle: const TextStyle(fontSize: 18),
                    ),
                    child: const Text('START OKN TEST'),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  String _getDistanceInstruction() {
    if (!_faceDetected) {
      return 'Move closer to the camera';
    } else if (_faceDistance < 0.8) {
      return 'Move closer to the camera';
    } else if (_faceDistance > 1.2) {
      return 'Move farther from the camera';
    } else {
      return 'Perfect distance!';
    }
  }

  Widget _buildOKNTestScreen() {
    return Stack(
      children: [
        // Full screen camera
        if (_cameraInitialized && _cameraController != null)
          SizedBox(
            width: double.infinity,
            height: double.infinity,
            child: CameraPreview(_cameraController!),
          ),
        
        // OKN Stripes Animation
        AnimatedBuilder(
          animation: _stripeAnimation,
          builder: (context, child) {
            return CustomPaint(
              painter: OKNStripesPainter(_stripeAnimation.value),
              size: Size.infinite,
            );
          },
        ),
        
        // Test timer and instructions
        Container(
          color: Colors.black.withOpacity(0.3),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Timer
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(50),
                  ),
                  child: Text(
                    '$_timeRemaining',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                
                const SizedBox(height: 30),
                
                // Instructions
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Text(
                    'Follow the moving stripes with your eyes\nKeep your head still',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildResultsScreen() {
    return Container(
      color: Colors.black,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.analytics,
                size: 80,
                color: Colors.white,
              ),
              const SizedBox(height: 20),
              const Text(
                'Test Complete',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 30),
              
              // OKN Gain Result
              Container(
                padding: const EdgeInsets.all(30),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(15),
                  border: Border.all(color: Colors.white.withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    const Text(
                      'OKN Gain',
                      style: TextStyle(
                        fontSize: 24,
                        color: Colors.white70,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      _oknGain.toStringAsFixed(3),
                      style: const TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      _getOKNInterpretation(),
                      style: TextStyle(
                        fontSize: 18,
                        color: _getOKNColor(),
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 40),
              
              // Restart button
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _testPhase = 'idle';
                    _eyeXData.clear();
                    _eyeYData.clear();
                    _timeData.clear();
                    _oknGain = 0.0;
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                  textStyle: const TextStyle(fontSize: 18),
                ),
                child: const Text('START NEW TEST'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getOKNInterpretation() {
    if (_oknGain >= 1.0) {
      return 'Unlikely Impaired\nSafe to drive';
    } else if (_oknGain >= 0.75) {
      return 'Possible Impairment\nUse caution';
    } else {
      return 'Likely Impaired\nDo not drive';
    }
  }

  Color _getOKNColor() {
    if (_oknGain >= 1.0) {
      return Colors.green;
    } else if (_oknGain >= 0.75) {
      return Colors.orange;
    } else {
      return Colors.red;
    }
  }
}

// Custom painter for OKN stripes
class OKNStripesPainter extends CustomPainter {
  final double animationValue;
  
  OKNStripesPainter(this.animationValue);
  
  @override
  void paint(Canvas canvas, Size size) {
    const double stripeWidth = 44.0;
    const double stripeGap = 44.0;
    const double period = stripeWidth + stripeGap;
    
    // Calculate phase based on animation
    final phase = animationValue * 2 * math.pi;
    
    final paint = Paint()
      ..color = const Color(0xFF101318)
      ..style = PaintingStyle.fill;
    
    // Draw stripes
    final columns = (size.width / period).ceil() + 2;
    
    for (int i = -1; i < columns; i++) {
      final x = -phase * 50 + i * period; // 50 pixels per radian movement
      canvas.drawRect(
        Rect.fromLTWH(x, 0, stripeWidth, size.height),
        paint,
      );
    }
  }
  
  @override
  bool shouldRepaint(OKNStripesPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}