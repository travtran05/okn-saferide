import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Svg, { Rect } from 'react-native-svg';

// OKN Algorithm Constants
const DURATION_MS = 10_000;
const STIM_SPEED = 220; // px/s stimulus drift speed
const STRIPE_WIDTH = 44;
const STRIPE_GAP = 44;
const EYE_SMOOTH = 0.25; // EMA smoothing factor
const QUALITY_MIN_FRAC = 0.6;
const SLOW_PHASE_ACCEL_THR = 6000; // px/s^2 threshold to reject saccades
const FPS_TARGET = 30;

interface TestResults {
  gain: number;
  r2: number;
  quality: number;
  frames: number;
}

interface ResultInfo {
  label: string;
  color: string;
  detail: string;
}

interface Sample {
  t: number;
  stimX: number;
  stimV: number;
  eyeX: number;
  eyeV: number;
  usable: boolean;
}

export default function App() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [testPhase, setTestPhase] = useState<'idle' | 'positioning' | 'okn-test' | 'results'>('idle');
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('10.0');
  const [results, setResults] = useState<TestResults | null>(null);
  const [resultInfo, setResultInfo] = useState<ResultInfo | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');

  const animatedProgress = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const samplesRef = useRef<Sample[]>([]);
  const eyeEmaRef = useRef<number>(0);
  const haveEmaRef = useRef<boolean>(false);
  const usableFramesRef = useRef<number>(0);
  const stimPhaseRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const startedAtRef = useRef<number>(0);

  // OKN Analysis Algorithm (from original code)
  const analyzeOKN = (samples: Sample[]): { gain: number; r2: number; quality: number; passQuality: boolean; decision: string; label: string; color: string; detail: string } => {
    const stimV: number[] = [];
    const eyeV: number[] = [];
    let usable = 0;

    for (let i = 1; i < samples.length; i++) {
      const s = samples[i];
      if (!s.usable) continue;
      
      const dv = s.eyeV - (samples[i - 1].eyeV || 0);
      const dt = (s.t - samples[i - 1].t) / 1000;
      const acc = Math.abs(dv / (dt || 1 / 30));
      
      if (acc > SLOW_PHASE_ACCEL_THR) continue; // remove saccades
      
      stimV.push(s.stimV);
      eyeV.push(s.eyeV);
      usable++;
    }

    const quality = usable / Math.max(1, samples.length - 1);
    const passQuality = quality >= QUALITY_MIN_FRAC;

    let g = NaN, r2 = NaN;
    if (stimV.length >= 6 && passQuality) {
      let sx2 = 0, sxy = 0, sy2 = 0;
      for (let i = 0; i < stimV.length; i++) {
        const x = stimV[i], y = eyeV[i];
        sx2 += x * x;
        sxy += x * y;
        sy2 += y * y;
      }
      g = sxy / (sx2 || 1);
      r2 = (sxy * sxy) / ((sx2 || 1) * (sy2 || 1));
    }

    let decision = 'insufficient', label = 'Insufficient data', color = 'warn', 
        detail = 'Not enough good-quality data was captured. Please retry in better lighting and hold the phone steady.';
    
    if (isFinite(g)) {
      if (g >= 1.0) {
        decision = 'unlikely'; label = 'Unlikely impaired'; color = 'ok';
        detail = 'Your estimated OKN gain is ≥ 1.0, which indicates low likelihood of impairment.';
      } else if (g >= 0.75) {
        decision = 'possible'; label = 'Possible impairment'; color = 'warn';
        detail = 'Your estimated OKN gain is between 0.75 and 1.0. Use caution and consider not driving.';
      } else {
        decision = 'likely'; label = 'Likely impaired'; color = 'bad';
        detail = 'Your estimated OKN gain is < 0.75. Do not drive.';
      }
    }

    return { gain: g, r2, quality, passQuality, decision, label, color, detail };
  };

  const startTest = async () => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert('Camera Permission', 'Camera access is required for eye tracking.');
        return;
      }
    }

    // Step 1: Switch to landscape and start positioning phase
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    setOrientation('landscape');
    setTestPhase('positioning');
    setIsTestRunning(true);
  };

  const startOKNTest = () => {
    // Step 2: Switch to OKN test phase
    setTestPhase('okn-test');
    setProgress(0);
    setTimeLeft('10.0');
    setResults(null);
    setResultInfo(null);
    animatedProgress.setValue(0);

    // Reset tracking variables
    samplesRef.current = [];
    eyeEmaRef.current = 0;
    haveEmaRef.current = false;
    usableFramesRef.current = 0;
    stimPhaseRef.current = 0;
    lastTsRef.current = 0;
    startedAtRef.current = Date.now();

    runOKNTest();
  };

  const runOKNTest = () => {
    const startTime = Date.now();
    startedAtRef.current = startTime;

    const testLoop = () => {
      if (testPhase !== 'okn-test') return;

      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      
      setProgress(progress);
      setTimeLeft(((DURATION_MS - elapsed) / 1000).toFixed(1));

      // Simulate eye tracking data (in real implementation, this would come from camera)
      const dt = (now - lastTsRef.current) / 1000;
      lastTsRef.current = now;

      // Update stimulus phase
      stimPhaseRef.current += STIM_SPEED * dt;
      const period = STRIPE_WIDTH + STRIPE_GAP;
      stimPhaseRef.current = stimPhaseRef.current % period;

      // Simulate eye position (in real app, this would be from face detection)
      const eyeXNorm = Math.sin(elapsed / 1000) * 0.5; // Simulated eye movement
      const EYE_PIX_SCALE = Dimensions.get('window').width * 0.35;
      const eyeXpx = eyeXNorm * EYE_PIX_SCALE;

      // EMA smoothing
      if (!haveEmaRef.current) {
        eyeEmaRef.current = eyeXpx;
        haveEmaRef.current = true;
      } else {
        eyeEmaRef.current = eyeEmaRef.current + EYE_SMOOTH * (eyeXpx - eyeEmaRef.current);
      }

      // Calculate velocity
      let eyeV = 0;
      if (samplesRef.current.length > 0) {
        const prev = samplesRef.current[samplesRef.current.length - 1];
        eyeV = (eyeEmaRef.current - prev.eyeX) / (dt || 1 / 30);
      }

      // Quality gate
      let usable = true;
      if (samplesRef.current.length > 1) {
        const prev = samplesRef.current[samplesRef.current.length - 1];
        const prev2 = samplesRef.current[samplesRef.current.length - 2] || prev;
        const acc = Math.abs(((eyeV || 0) - (prev.eyeV || 0)) / (dt || 1 / 30));
        if (acc > SLOW_PHASE_ACCEL_THR) usable = false;
      }

      const sample: Sample = {
        t: elapsed,
        stimX: stimPhaseRef.current,
        stimV: STIM_SPEED,
        eyeX: eyeEmaRef.current,
        eyeV: eyeV,
        usable: usable
      };

      samplesRef.current.push(sample);
      if (usable) usableFramesRef.current++;

      if (elapsed >= DURATION_MS) {
        completeTest();
        return;
      }

      setTimeout(testLoop, 1000 / FPS_TARGET);
    };

    testLoop();
  };


  const stopTest = () => {
    setIsTestRunning(false);
    setProgress(0);
    setTimeLeft('10.0');
    animatedProgress.setValue(0);
  };

  const completeTest = async () => {
    setIsTestRunning(false);
    setTestCompleted(true);
    setTestPhase('results');

    // Analyze OKN data
    const analysis = analyzeOKN(samplesRef.current);
    
    const testResults: TestResults = {
      gain: analysis.gain,
      r2: analysis.r2,
      quality: analysis.quality,
      frames: samplesRef.current.length,
    };
    setResults(testResults);

    const info: ResultInfo = {
      label: analysis.label,
      color: analysis.color === 'ok' ? '#4CAF50' : analysis.color === 'bad' ? '#F44336' : '#FF9800',
      detail: analysis.detail + ' This is a demo only.',
    };
    setResultInfo(info);

    // Switch back to portrait for results
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    setOrientation('portrait');
  };

  const handleRideButton = (service: string) => {
    Alert.alert('Opening ' + service, 'Not implemented in demo', [{ text: 'OK' }]);
  };

  // Render different phases
  if (testPhase === 'positioning') {
    return (
      <View style={styles.fullScreen}>
        <ExpoStatusBar style="light" />
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.positioningOverlay}>
            <View style={styles.positioningContent}>
              <Text style={styles.positioningTitle}>Position Your Face</Text>
              <Text style={styles.positioningSubtitle}>
                Hold the phone at arm's length and center your face in the circle
              </Text>
              
              <View style={styles.faceGuide}>
                <View style={styles.faceCircle} />
                <View style={styles.faceCrosshair} />
              </View>
              
              <TouchableOpacity
                style={styles.positioningButton}
                onPress={startOKNTest}
              >
                <Text style={styles.positioningButtonText}>Start OKN Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  if (testPhase === 'okn-test') {
    return (
      <View style={styles.fullScreen}>
        <ExpoStatusBar style="light" />
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        
        <View style={styles.oknContainer}>
          <AnimatedStripes progress={progress} />
          
          <View style={styles.oknOverlay}>
            <View style={styles.oknProgress}>
              <Text style={styles.oknTime}>{timeLeft}</Text>
              <Text style={styles.oknLabel}>seconds</Text>
            </View>
            
            <Text style={styles.oknInstruction}>
              👁️ Follow the moving stripes with your eyes
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (testPhase === 'results') {
    return (
      <SafeAreaView style={styles.container}>
        <ExpoStatusBar style="dark" />
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>OKN SafeRide</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Results Card */}
          {resultInfo && (
            <View style={styles.card}>
              <View style={[styles.resultBadge, { backgroundColor: resultInfo.color + '20', borderColor: resultInfo.color }]}>
                <Text style={[styles.resultLabel, { color: resultInfo.color }]}>
                  {resultInfo.label}
                </Text>
              </View>
              <Text style={styles.resultDetail}>{resultInfo.detail}</Text>
              <Text style={styles.resultDisclaimer}>This is a demo only.</Text>
            </View>
          )}

          {/* Metrics Card */}
          {results && (
            <View style={styles.card}>
              <Text style={styles.metricsTitle}>Test Metrics</Text>
              <MetricRow label="OKN Gain" value={results.gain.toFixed(2)} />
              <MetricRow label="R² (fit quality)" value={results.r2.toFixed(2)} />
              <MetricRow label="Data quality" value={`${(results.quality * 100).toFixed(0)}%`} />
              <MetricRow label="Frames analyzed" value={results.frames.toString()} />
            </View>
          )}

          {/* Assistance Card */}
          {resultInfo && resultInfo.label !== 'Unlikely impaired' && (
            <View style={[styles.card, styles.assistanceCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.taxiIcon}>🚕</Text>
                <Text style={styles.cardTitle}>Get Home Safely</Text>
              </View>
              <Text style={styles.assistanceText}>Consider using a safe ride option:</Text>
              
              <RideButton label="Uber" icon="🚗" onPress={() => handleRideButton('Uber')} />
              <RideButton label="Lyft" icon="🚕" onPress={() => handleRideButton('Lyft')} />
              <RideButton label="Find Taxi" icon="🔍" onPress={() => handleRideButton('Taxi')} />
              <RideButton label="Public Transit" icon="🚊" onPress={() => handleRideButton('Public Transit')} />
            </View>
          )}

          {/* Retry Button */}
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={() => {
              setTestPhase('idle');
              setTestCompleted(false);
              setResults(null);
              setResultInfo(null);
            }}
          >
            <Text style={styles.buttonText}>🔄 Retry Test</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Default idle phase
  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OKN SafeRide</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.eyeIcon}>👁️</Text>
            <Text style={styles.cardTitle}>Impairment Detection</Text>
          </View>
          <Text style={styles.cardDescription}>
            This test uses optokinetic nystagmus (OKN) and eye tracking to estimate impairment. 
            Follow the moving stripes with your eyes while keeping your head still.
          </Text>
          <View style={styles.warningBadge}>
            <Text style={styles.warningText}>⚠️ Demo only - Not for medical use</Text>
          </View>
        </View>

        {/* Stimulus Display Area */}
        <View style={styles.card}>
          <View style={styles.stimulusArea}>
            <View style={styles.stimulusPlaceholder}>
              <Text style={styles.playIcon}>▶️</Text>
              <Text style={styles.placeholderText}>Press START to begin test</Text>
            </View>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={startTest}
          >
            <Text style={styles.buttonText}>▶️ START TEST</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Components
const AnimatedStripes: React.FC<{ progress: number }> = ({ progress }) => {
  const stripeWidth = 44;
  const stripeGap = 44;
  const period = stripeWidth + stripeGap;
  const phase = (progress * 1000) % period;

  const stripes = [];
  const numStripes = 10;

  for (let i = -1; i < numStripes; i++) {
    const x = -phase + i * period;
    stripes.push(
      <Rect
        key={i}
        x={x}
        y={0}
        width={stripeWidth}
        height={250}
        fill="#101318"
      />
    );
  }

  return (
    <View style={styles.stripesContainer}>
      <Svg height="250" width="100%" style={styles.svg}>
        {stripes}
      </Svg>
      <View style={styles.stripesOverlay}>
        <Text style={styles.stripesText}>👁️ Follow the stripes</Text>
      </View>
    </View>
  );
};

const MetricRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const RideButton: React.FC<{ label: string; icon: string; onPress: () => void }> = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.rideButton} onPress={onPress}>
    <Text style={styles.rideIcon}>{icon}</Text>
    <Text style={styles.rideLabel}>{label}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  positioningOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positioningContent: {
    alignItems: 'center',
    padding: 20,
  },
  positioningTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  positioningSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  faceGuide: {
    width: 200,
    height: 200,
    position: 'relative',
    marginBottom: 40,
  },
  faceCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  faceCrosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    marginTop: -10,
    marginLeft: -10,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#4CAF50',
  },
  positioningButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  positioningButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  oknContainer: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  oknOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oknProgress: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  oknTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  oknLabel: {
    fontSize: 12,
    color: '#fff',
  },
  oknInstruction: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eyeIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  taxiIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  warningBadge: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFD54F',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  warningText: {
    fontSize: 12,
    color: '#F57F17',
    fontWeight: '500',
  },
  stimulusArea: {
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F6F7FB',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stimulusPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  stripesContainer: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  stripesOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stripesText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  progressTime: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#2196F3',
  },
  stopButton: {
    backgroundColor: '#e0e0e0',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stopButtonText: {
    color: '#000',
  },
  resultBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  resultDetail: {
    fontSize: 15,
    color: '#000',
    marginBottom: 8,
  },
  resultDisclaimer: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  assistanceCard: {
    backgroundColor: '#E3F2FD',
  },
  assistanceText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 12,
  },
  rideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  rideIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  rideLabel: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500',
  },
});

