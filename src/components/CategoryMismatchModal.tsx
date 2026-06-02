import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
//import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { Colors, Typography, Spacing, Radius } from '../app/constants/theme';

interface CategoryMismatchModalProps {
  visible: boolean;
  category: string;
  message: string;
  onRetake: () => void;
  onChangeCategory: () => void;
}

export function CategoryMismatchModal({
  visible,
  category,
  message,
  onRetake,
  onChangeCategory,
}: CategoryMismatchModalProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        {/* Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Icon */}
          <View style={styles.iconWrap}>
            <Text style={styles.iconEmoji}>⚠️</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Wrong category</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            The photo doesn't match your selected category
          </Text>

          {/* Category pill */}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{category}</Text>
          </View>

          {/* Message from AI */}
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* What to do label */}
          <Text style={styles.actionLabel}>What would you like to do?</Text>

          {/* Primary CTA — retake */}
          <TouchableOpacity style={styles.retakeBtn} onPress={onRetake} activeOpacity={0.85}>
            <Text style={styles.retakeBtnIcon}>📷</Text>
            <View>
              <Text style={styles.retakeBtnTitle}>Retake photos</Text>
              <Text style={styles.retakeBtnSub}>Use a photo that matches "{category}"</Text>
            </View>
          </TouchableOpacity>

          {/* Secondary CTA — change category */}
          <TouchableOpacity
            style={styles.changeCategoryBtn}
            onPress={onChangeCategory}
            activeOpacity={0.75}
          >
            <Text style={styles.changeCategoryBtnText}>Change category instead</Text>
          </TouchableOpacity>

        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF8E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  iconEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  categoryPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginBottom: Spacing.lg,
  },
  categoryPillText: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  messageBox: {
    backgroundColor: '#FFF8E6',
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: '#F5A623',
  },
  messageText: {
    fontSize: Typography.sm,
    color: '#92400E',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  actionLabel: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.gray400,
    marginBottom: Spacing.md,
    alignSelf: 'flex-start',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  retakeBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  retakeBtnIcon: {
    fontSize: 24,
  },
  retakeBtnTitle: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  retakeBtnSub: {
    fontSize: Typography.xs,
    color: Colors.primaryMid,
  },
  changeCategoryBtn: {
    width: '100%',
    height: 50,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  changeCategoryBtnText: {
    fontSize: Typography.base,
    fontWeight: '500',
    color: Colors.gray600,
  },
});
