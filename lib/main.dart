import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
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
      home: const HomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isTestRunning = false;
  bool _testCompleted = false;
  double _progress = 0.0;
  String _timeLeft = '10.0';
  
  // Test results
  String? _resultLabel;
  Color? _resultColor;
  String? _resultDetail;
  double? _gain;
  double? _r2;
  double? _quality;
  int? _frames;

  void _startTest() {
    setState(() {
      _isTestRunning = true;
      _testCompleted = false;
      _progress = 0.0;
      _timeLeft = '10.0';
      _resultLabel = null;
    });

    // Simulate 10-second test
    _simulateTest();
  }

  void _simulateTest() {
    const steps = 100;
    const stepDuration = Duration(milliseconds: 100);

    int currentStep = 0;

    Future.doWhile(() async {
      await Future.delayed(stepDuration);
      
      if (!_isTestRunning) return false;

      currentStep++;
      setState(() {
        _progress = currentStep / steps;
        _timeLeft = ((steps - currentStep) * 0.1).toStringAsFixed(1);
      });

      if (currentStep >= steps) {
        _completeTest();
        return false;
      }
      return true;
    });
  }

  void _stopTest() {
    setState(() {
      _isTestRunning = false;
      _progress = 0.0;
      _timeLeft = '10.0';
    });
  }

  void _completeTest() {
    // Simulate results (in real app, this would be actual calculations)
    setState(() {
      _isTestRunning = false;
      _testCompleted = true;
      
      // Demo results - you'll replace with actual OKN calculations
      _gain = 0.85;
      _r2 = 0.92;
      _quality = 0.78;
      _frames = 285;
      
      if (_gain! >= 1.0) {
        _resultLabel = 'Unlikely impaired';
        _resultColor = Colors.green;
        _resultDetail = 'Your estimated OKN gain is ≥ 1.0, which indicates low likelihood of impairment.';
      } else if (_gain! >= 0.75) {
        _resultLabel = 'Possible impairment';
        _resultColor = Colors.orange;
        _resultDetail = 'Your estimated OKN gain is between 0.75 and 1.0. Use caution and consider not driving.';
      } else {
        _resultLabel = 'Likely impaired';
        _resultColor = Colors.red;
        _resultDetail = 'Your estimated OKN gain is < 0.75. Do not drive.';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F7FB),
      appBar: AppBar(
        title: const Text('OKN SafeRide'),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black87,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header Card
                _buildHeaderCard(),
                const SizedBox(height: 16),
                
                // Stimulus Display Area
                _buildStimulusArea(),
                const SizedBox(height: 16),
                
                // Progress Ring
                if (_isTestRunning) _buildProgressRing(),
                
                // Control Buttons
                _buildControlButtons(),
                const SizedBox(height: 16),
                
                // Results Card
                if (_testCompleted) _buildResultsCard(),
                
                // Metrics Card
                if (_testCompleted) _buildMetricsCard(),
                
                // Assistance Card
                if (_testCompleted && _resultLabel != 'Unlikely impaired') 
                  _buildAssistanceCard(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderCard() {
    return Card(
      elevation: 0,
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.remove_red_eye, color: Colors.blue.shade700),
                const SizedBox(width: 8),
                Text(
                  'Impairment Detection',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'This test uses optokinetic nystagmus (OKN) and eye tracking to estimate impairment. Follow the moving stripes with your eyes while keeping your head still.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.black54,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.amber.shade200),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.warning_amber, size: 16, color: Colors.amber.shade900),
                  const SizedBox(width: 6),
                  Flexible(
                    child: Text(
                      'Demo only - Not for medical use',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.amber.shade900,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStimulusArea() {
    return Card(
      elevation: 0,
      color: Colors.white,
      child: Container(
        height: 250,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: _isTestRunning
              ? _buildAnimatedStripes()
              : Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.play_circle_outline,
                      size: 64,
                      color: Colors.grey.shade400,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Press START to begin test',
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildAnimatedStripes() {
    return Container(
      color: const Color(0xFFF6F7FB),
      child: CustomPaint(
        painter: StripePainter(progress: _progress),
        child: const Center(
          child: Text(
            '👁️ Follow the stripes',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProgressRing() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            SizedBox(
              width: 120,
              height: 120,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  SizedBox(
                    width: 120,
                    height: 120,
                    child: CircularProgressIndicator(
                      value: _progress,
                      strokeWidth: 8,
                      backgroundColor: Colors.grey.shade200,
                      valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
                    ),
                  ),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _timeLeft,
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Text(
                        'seconds',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlButtons() {
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: _isTestRunning ? null : _startTest,
            icon: const Icon(Icons.play_arrow),
            label: const Text('START TEST'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: ElevatedButton.icon(
            onPressed: _isTestRunning ? _stopTest : null,
            icon: const Icon(Icons.stop),
            label: const Text('STOP'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.grey.shade200,
              foregroundColor: Colors.black87,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildResultsCard() {
    return Card(
      elevation: 2,
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _resultColor?.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: _resultColor ?? Colors.grey),
              ),
              child: Text(
                _resultLabel ?? '',
                style: TextStyle(
                  color: _resultColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              _resultDetail ?? '',
              style: const TextStyle(fontSize: 15),
            ),
            const SizedBox(height: 8),
            Text(
              'This is a demo only.',
              style: TextStyle(
                fontSize: 13,
                color: Colors.grey.shade600,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricsCard() {
    return Card(
      elevation: 0,
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Test Metrics',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            _buildMetricRow('OKN Gain', _gain?.toStringAsFixed(2) ?? '—'),
            _buildMetricRow('R² (fit quality)', _r2?.toStringAsFixed(2) ?? '—'),
            _buildMetricRow('Data quality', '${(_quality! * 100).toStringAsFixed(0)}%'),
            _buildMetricRow('Frames analyzed', _frames?.toString() ?? '—'),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.black54),
          ),
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAssistanceCard() {
    return Card(
      elevation: 2,
      color: Colors.blue.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.local_taxi, color: Colors.blue.shade700),
                const SizedBox(width: 8),
                Text(
                  'Get Home Safely',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Text(
              'Consider using a safe ride option:',
              style: TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 12),
            _buildRideButton('Uber', Icons.directions_car, Colors.black),
            const SizedBox(height: 8),
            _buildRideButton('Lyft', Icons.local_taxi, Colors.pink),
            const SizedBox(height: 8),
            _buildRideButton('Find Taxi', Icons.search, Colors.orange),
            const SizedBox(height: 8),
            _buildRideButton('Public Transit', Icons.train, Colors.green),
          ],
        ),
      ),
    );
  }

  Widget _buildRideButton(String label, IconData icon, Color color) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: () {
          // TODO: Open respective app/service
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Opening $label... (not implemented in demo)')),
          );
        },
        icon: Icon(icon, color: color),
        label: Text(label),
        style: OutlinedButton.styleFrom(
          foregroundColor: color,
          side: BorderSide(color: color),
          padding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }
}

// Custom painter for animated stripes
class StripePainter extends CustomPainter {
  final double progress;
  
  StripePainter({required this.progress});
  
  @override
  void paint(Canvas canvas, Size size) {
    const stripeWidth = 44.0;
    const stripeGap = 44.0;
    const period = stripeWidth + stripeGap;
    
    // Animate the phase based on progress
    final phase = (progress * 1000) % period;
    
    final paint = Paint()
      ..color = const Color(0xFF101318)
      ..style = PaintingStyle.fill;
    
    final columns = (size.width / period).ceil() + 2;
    
    for (int i = -1; i < columns; i++) {
      final x = -phase + i * period;
      canvas.drawRect(
        Rect.fromLTWH(x, 0, stripeWidth, size.height),
        paint,
      );
    }
  }
  
  @override
  bool shouldRepaint(StripePainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}
