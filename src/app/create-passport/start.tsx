import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { StepIndicator } from '../../components/StepIndicator';

const CATEGORIES = [
  { id: 'ceramics', label: 'Ceramics', emoji: '🏺' },
  { id: 'jewelry', label: 'Jewelry', emoji: '💍' },
  { id: 'clothing', label: 'Clothing', emoji: '👗' },
  { id: 'woodwork', label: 'Woodwork', emoji: '🪵' },
  { id: 'textiles', label: 'Textiles', emoji: '🧵' },
  //{ id: 'candles', label: 'Candles', emoji: '🕯️' },
  { id: 'accessories', label: 'Accessories', emoji: '💅🏻'},
  { id: 'leather', label: 'Leather', emoji: '👜' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

export default function CreatePassportStartScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>✕ Cancel</Text>
        </TouchableOpacity>

        <StepIndicator current={1} total={5} />

        <Text style={styles.stepLabel}>Step 1 of 5</Text>
        <Text style={styles.title}>New passport</Text>
        <Text style={styles.subtitle}>What type of product are you listing?</Text>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catCard, selected === cat.id && styles.catCardActive]}
              onPress={() => setSelected(cat.id)}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={[styles.catLabel, selected === cat.id && styles.catLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !selected && styles.nextBtnDisabled]}
          disabled={!selected}
          onPress={() => router.push('/create-passport/photos')}
        >
          <Text style={styles.nextBtnText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: 100 },
  cancelBtn: { marginBottom: Spacing.xl },
  cancelText: { fontSize: Typography.base, color: Colors.gray400 },
  stepLabel: { fontSize: Typography.xs, color: Colors.gray400, marginBottom: Spacing.xs },
  title: { fontSize: Typography.xxl, fontWeight: '700', color: Colors.black, marginBottom: Spacing.xs },
  subtitle: { fontSize: Typography.base, color: Colors.gray600, marginBottom: Spacing.xl, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  catCard: {
    width: '47%',
    backgroundColor: Colors.gray50,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  catCardActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  catEmoji: { fontSize: 30, marginBottom: Spacing.sm },
  catLabel: { fontSize: Typography.base, fontWeight: '500', color: Colors.gray600 },
  catLabelActive: { color: Colors.primaryDark },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  nextBtn: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnDisabled: { backgroundColor: Colors.gray200 },
  nextBtnText: { color: Colors.white, fontSize: Typography.base, fontWeight: '700' },
});
