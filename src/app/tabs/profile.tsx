import React from 'react';
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

const menuItems = [
  { emoji: '🏪', label: 'Shop settings' },
  { emoji: '🔗', label: 'Connected platforms' },
  { emoji: '💳', label: 'Subscription & billing' },
  { emoji: '🔔', label: 'Notifications' },
  { emoji: '🔒', label: 'Privacy & security' },
  { emoji: '❓', label: 'Help & support' },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Avatar card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MS</Text>
          </View>
          <View>
            <Text style={styles.name}>Maria Santos</Text>
            <Text style={styles.shopName}>Maria's Ceramics</Text>
            <View style={styles.verifiedRow}>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified Maker</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { num: '12', label: 'Passports' },
            { num: '48', label: 'Scans' },
            { num: '4.8', label: 'Eco avg.' },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statNum}>{s.num}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                i < menuItems.length - 1 && styles.menuItemBorder,
              ]}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => router.replace('/auth/login')}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>MiniTrace v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    backgroundColor: Colors.gray50,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  name: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
  },
  shopName: {
    fontSize: Typography.sm,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  verifiedRow: { flexDirection: 'row' },
  verifiedBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  verifiedText: {
    fontSize: Typography.xs,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.gray50,
    borderRadius: Radius.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statNum: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
  menu: {
    backgroundColor: Colors.gray50,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuEmoji: { fontSize: 18, width: 24 },
  menuLabel: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.black,
  },
  menuChevron: {
    fontSize: Typography.xl,
    color: Colors.gray400,
  },
  signOutBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  signOutText: {
    fontSize: Typography.base,
    color: Colors.gray600,
    fontWeight: '500',
  },
  version: {
    textAlign: 'center',
    fontSize: Typography.xs,
    color: Colors.gray400,
  },
});
