import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { StepIndicator } from '../../components/StepIndicator';

const MAX_PHOTOS = 3;

export default function PhotosScreen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);

  const handleAddPhoto = () => {
    Alert.alert('Add Photo', 'Choose a source', [
      { text: 'Camera', onPress: () => addSimulated() },
      { text: 'Gallery', onPress: () => addSimulated() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const addSimulated = () => {
    if (photos.length < MAX_PHOTOS) {
      setPhotos((prev) => [...prev, `photo_${prev.length + 1}`]);
    }
  };

  const removePhoto = (i: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  };

  const thumbColors = ['#9FE1CB', '#B5D4F4', '#FAC775'];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <StepIndicator current={2} total={5} />

        <Text style={styles.stepLabel}>Step 2 of 5</Text>
        <Text style={styles.title}>Add photos</Text>
        <Text style={styles.subtitle}>
          Take 1–3 clear photos of your product. AI will analyze materials and details from the images.
        </Text>

        <TouchableOpacity style={styles.dropZone} onPress={handleAddPhoto}>
          <Text style={styles.dropIcon}>📷</Text>
          <Text style={styles.dropLabel}>Tap to take a photo</Text>
          <Text style={styles.dropSub}>or upload from gallery</Text>
        </TouchableOpacity>

        <Text style={styles.thumbLabel}>
          Added photos ({photos.length}/{MAX_PHOTOS})
        </Text>

        <View style={styles.thumbRow}>
          {photos.map((_, i) => (
            <View key={i} style={styles.thumbWrap}>
              <View style={[styles.thumb, { backgroundColor: thumbColors[i] }]} />
              <TouchableOpacity style={styles.removeBtn} onPress={() => removePhoto(i)}>
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < MAX_PHOTOS && (
            <TouchableOpacity style={styles.addThumb} onPress={handleAddPhoto}>
              <Text style={styles.addThumbText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tip}>
          <Text style={styles.tipText}>
            💡 Include a close-up of materials and a full product shot for best results.
          </Text>
        </View>

      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, photos.length === 0 && styles.nextBtnDisabled]}
          disabled={photos.length === 0}
          onPress={() => router.push('/create-passport/processing')}
        >
          <Text style={styles.nextBtnText}>Analyze photos →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  backBtn: { marginBottom: Spacing.xl },
  backText: { fontSize: Typography.base, color: Colors.primary },
  stepLabel: { fontSize: Typography.xs, color: Colors.gray400, marginBottom: Spacing.xs },
  title: { fontSize: Typography.xxl, fontWeight: '700', color: Colors.black, marginBottom: Spacing.xs },
  subtitle: { fontSize: Typography.base, color: Colors.gray600, lineHeight: 22, marginBottom: Spacing.xl },
  dropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    backgroundColor: Colors.gray50,
  },
  dropIcon: { fontSize: 32, marginBottom: Spacing.sm },
  dropLabel: { fontSize: Typography.base, fontWeight: '500', color: Colors.gray600 },
  dropSub: { fontSize: Typography.sm, color: Colors.gray400, marginTop: 4 },
  thumbLabel: { fontSize: Typography.sm, color: Colors.gray400, marginBottom: Spacing.sm },
  thumbRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  thumbWrap: { position: 'relative' },
  thumb: { width: 80, height: 80, borderRadius: Radius.sm },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.gray600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { color: Colors.white, fontSize: 9, fontWeight: '700' },
  addThumb: {
    width: 80,
    height: 80,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addThumbText: { fontSize: Typography.xxl, color: Colors.gray400 },
  tip: {
    backgroundColor: Colors.gray50,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  tipText: { fontSize: Typography.sm, color: Colors.gray400, lineHeight: 20 },
  footer: {
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
