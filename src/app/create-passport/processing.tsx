import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { StepIndicator } from '../../components/StepIndicator';

const STEPS = [
  'Scanning materials',
  'Identifying textures',
  'Generating description',
  'Scoring sustainability',
  'Building passport',
];

export default function ProcessingScreen() {
  const router = useRouter();
  const [completed, setCompleted] = useState(0);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setCompleted(i + 1);
          if (i === STEPS.length - 1) {
            setTimeout(() => router.push('/create-passport/review'), 600);
          }
        }, (i + 1) * 1100)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <StepIndicator current={3} total={5} />

        <Text style={styles.stepLabel}>Step 3 of 5</Text>
        <Text style={styles.title}>Analyzing your product</Text>
        <Text style={styles.subtitle}>
          Our AI is reading your photos and building your passport. This takes about 10–20 seconds.
        </Text>

        {/* Spinner */}
        <View style={styles.spinnerWrap}>
          <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]} />
          <View style={styles.spinnerCore}>
            <Text style={styles.spinnerEmoji}>✨</Text>
          </View>
        </View>

        {/* Checklist */}
        <View style={styles.checklist}>
          {STEPS.map((step, i) => {
            const done = i < completed;
            const active = i === completed;
            return (
              <View key={step} style={styles.row}>
                <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
                  {done && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={[
                  styles.stepText,
                  done && styles.stepDone,
                  active && styles.stepActive,
                ]}>
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  stepLabel: { fontSize: Typography.xs, color: Colors.gray400, marginBottom: Spacing.xs },
  title: { fontSize: Typography.xxl, fontWeight: '700', color: Colors.black, marginBottom: Spacing.xs },
  subtitle: { fontSize: Typography.base, color: Colors.gray600, lineHeight: 22, marginBottom: 40 },
  spinnerWrap: {
    width: 88,
    height: 88,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  spinnerRing: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: Colors.borderLight,
    borderTopColor: Colors.primary,
  },
  spinnerCore: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerEmoji: { fontSize: 24 },
  checklist: {
    backgroundColor: Colors.gray50,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dotActive: { borderColor: Colors.primary },
  check: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  stepText: { fontSize: Typography.base, color: Colors.gray400 },
  stepDone: { color: Colors.black, fontWeight: '500' },
  stepActive: { color: Colors.primary, fontWeight: '500' },
});
