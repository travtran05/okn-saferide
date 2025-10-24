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
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import Svg, { Rect } from 'react-native-svg';

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

export default function App() {
  // Lock orientation to portrait
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('10.0');
  const [results, setResults] = useState<TestResults | null>(null);
  const [resultInfo, setResultInfo] = useState<ResultInfo | null>(null);

  const animatedProgress = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setIsTestRunning(true);
    setTestCompleted(false);
    setProgress(0);
    setTimeLeft('10.0');
    setResults(null);
    setResultInfo(null);
    animatedProgress.setValue(0);

    simulateTest();
  };

  const simulateTest = () => {
    const steps = 100;
    const stepDuration = 100; // ms
    let currentStep = 0;

    intervalRef.current = setInterval(() => {
      currentStep++;
      const newProgress = currentStep / steps;
      setProgress(newProgress);
      setTimeLeft(((steps - currentStep) * 0.1).toFixed(1));

      if (currentStep >= steps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        completeTest();
      }
    }, stepDuration);
  };

  const stopTest = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTestRunning(false);
    setProgress(0);
    setTimeLeft('10.0');
    animatedProgress.setValue(0);
  };

  const completeTest = () => {
    setIsTestRunning(false);
    setTestCompleted(true);

    // Demo results - replace with actual OKN calculations
    const testResults: TestResults = {
      gain: 0.85,
      r2: 0.92,
      quality: 0.78,
      frames: 285,
    };
    setResults(testResults);

    let info: ResultInfo;
    if (testResults.gain >= 1.0) {
      info = {
        label: 'Unlikely impaired',
        color: '#4CAF50',
        detail: 'Your estimated OKN gain is ≥ 1.0, which indicates low likelihood of impairment.',
      };
    } else if (testResults.gain >= 0.75) {
      info = {
        label: 'Possible impairment',
        color: '#FF9800',
        detail: 'Your estimated OKN gain is between 0.75 and 1.0. Use caution and consider not driving.',
      };
    } else {
      info = {
        label: 'Likely impaired',
        color: '#F44336',
        detail: 'Your estimated OKN gain is < 0.75. Do not drive.',
      };
    }
    setResultInfo(info);
  };

  const handleRideButton = (service: string) => {
    Alert.alert('Opening ' + service, 'Not implemented in demo', [{ text: 'OK' }]);
  };

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
            {isTestRunning ? (
              <AnimatedStripes progress={progress} />
            ) : (
              <View style={styles.stimulusPlaceholder}>
                <Text style={styles.playIcon}>▶️</Text>
                <Text style={styles.placeholderText}>Press START to begin test</Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress Ring */}
        {isTestRunning && (
          <View style={styles.progressContainer}>
            <View style={styles.progressRing}>
              <Text style={styles.progressTime}>{timeLeft}</Text>
              <Text style={styles.progressLabel}>seconds</Text>
            </View>
          </View>
        )}

        {/* Control Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.startButton, isTestRunning && styles.buttonDisabled]}
            onPress={startTest}
            disabled={isTestRunning}
          >
            <Text style={styles.buttonText}>▶️ START TEST</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.stopButton, !isTestRunning && styles.buttonDisabled]}
            onPress={stopTest}
            disabled={!isTestRunning}
          >
            <Text style={[styles.buttonText, styles.stopButtonText]}>⏹️ STOP</Text>
          </TouchableOpacity>
        </View>

        {/* Results Card */}
        {testCompleted && resultInfo && (
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
        {testCompleted && results && (
          <View style={styles.card}>
            <Text style={styles.metricsTitle}>Test Metrics</Text>
            <MetricRow label="OKN Gain" value={results.gain.toFixed(2)} />
            <MetricRow label="R² (fit quality)" value={results.r2.toFixed(2)} />
            <MetricRow label="Data quality" value={`${(results.quality * 100).toFixed(0)}%`} />
            <MetricRow label="Frames analyzed" value={results.frames.toString()} />
          </View>
        )}

        {/* Assistance Card */}
        {testCompleted && resultInfo && resultInfo.label !== 'Unlikely impaired' && (
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

