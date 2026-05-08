import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Share,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Rect, Path } from 'react-native-svg';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

// Simplified QR visual using SVG blocks (decorative — use expo-qrcode in production)
function QRGraphic({ id }: { id: string }) {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Background */}
      <Rect x="0" y="0" width="200" height="200" rx="8" fill="white" />

      {/* Top-left position block */}
      <Rect x="12" y="12" width="56" height="56" rx="6" fill={Colors.primary} />
      <Rect x="22" y="22" width="36" height="36" rx="3" fill="white" />
      <Rect x="30" y="30" width="20" height="20" rx="2" fill={Colors.primary} />

      {/* Top-right position block */}
      <Rect x="132" y="12" width="56" height="56" rx="6" fill={Colors.primary} />
      <Rect x="142" y="22" width="36" height="36" rx="3" fill="white" />
      <Rect x="150" y="30" width="20" height="20" rx="2" fill={Colors.primary} />

      {/* Bottom-left position block */}
      <Rect x="12" y="132" width="56" height="56" rx="6" fill={Colors.primary} />
      <Rect x="22" y="142" width="36" height="36" rx="3" fill="white" />
      <Rect x="30" y="150" width="20" height="20" rx="2" fill={Colors.primary} />

      {/* Data modules (decorative) */}
      <Rect x="80" y="12" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="96" y="12" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="112" y="12" width="10" height="10" rx="2" fill={Colors.primary} />

      <Rect x="80" y="28" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="96" y="28" width="10" height="10" rx="2" fill={Colors.primary} />

      <Rect x="80" y="44" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="112" y="44" width="10" height="10" rx="2" fill={Colors.primaryDeep} />

      <Rect x="80" y="80" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="96" y="80" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="112" y="80" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="128" y="80" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="144" y="80" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="160" y="80" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="176" y="80" width="10" height="10" rx="2" fill={Colors.primary} />

      <Rect x="80" y="96" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="112" y="96" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="144" y="96" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="176" y="96" width="10" height="10" rx="2" fill={Colors.primary} />

      <Rect x="80" y="112" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="96" y="112" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="128" y="112" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="160" y="112" width="10" height="10" rx="2" fill={Colors.primaryDeep} />

      <Rect x="80" y="128" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="96" y="128" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="112" y="128" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="144" y="128" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="176" y="128" width="10" height="10" rx="2" fill={Colors.primaryDeep} />

      <Rect x="80" y="144" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="128" y="144" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="160" y="144" width="10" height="10" rx="2" fill={Colors.primary} />

      <Rect x="80" y="160" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="96" y="160" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="112" y="160" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="144" y="160" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="176" y="160" width="10" height="10" rx="2" fill={Colors.primaryDeep} />

      <Rect x="80" y="176" width="10" height="10" rx="2" fill={Colors.primary} />
      <Rect x="128" y="176" width="10" height="10" rx="2" fill={Colors.primaryDeep} />
      <Rect x="160" y="176" width="10" height="10" rx="2" fill={Colors.primary} />
    </Svg>
  );
}

export default function QRCodeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const passportId = id ?? '0042';
  const url = `https://minitrace.app/passport/${passportId}`;

  const handleShare = async () => {
    await Share.share({ message: `View this verified product passport: ${url}` });
  };

  const handleDownload = () => {
    Alert.alert('Download QR', 'QR image saved to your photo library.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.navBack}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>QR Code</Text>
        <Text style={styles.subtitle}>
          Scan this code to view the full product passport instantly.
        </Text>

        {/* QR Card */}
        <View style={styles.qrCard}>

          <Text style={styles.passportLabel}>Ceramic Mug — #MT-{passportId}</Text>

          <View style={styles.qrWrap}>
            <QRGraphic id={passportId} />
          </View>

          <Text style={styles.qrUrl}>{url}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
              <Text style={styles.downloadBtnText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.shareBtnText}>Share link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Usage tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Where to use your QR code</Text>
          {[
            '🏷️  Print on product tags or labels',
            '📦  Add to packaging inserts',
            '📸  Include in Etsy / Shopify listing photos',
            '📱  Display at craft markets or pop-ups',
          ].map((tip) => (
            <Text key={tip} style={styles.tipItem}>{tip}</Text>
          ))}
        </View>

        {/* Badge section */}
        <View style={styles.badgeSection}>
          <Text style={styles.badgeTitle}>Verified provenance badge</Text>
          <Text style={styles.badgeSub}>
            Add this badge to your listings to signal trust before buyers even scan.
          </Text>
          <View style={styles.badgePreview}>
            <View style={styles.badgeIcon}>
              <Text style={styles.badgeIconText}>✓</Text>
            </View>
            <View>
              <Text style={styles.badgeName}>MiniTrace Verified</Text>
              <Text style={styles.badgeDesc}>Authentic handmade product</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.copyBadgeBtn}>
            <Text style={styles.copyBadgeBtnText}>Copy badge code</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl },
  nav: { marginBottom: Spacing.lg },
  navBack: { fontSize: Typography.base, color: Colors.primary },
  title: { fontSize: Typography.xxl, fontWeight: '700', color: Colors.black, marginBottom: Spacing.xs },
  subtitle: { fontSize: Typography.base, color: Colors.gray600, lineHeight: 22, marginBottom: Spacing.xl },
  qrCard: {
    backgroundColor: Colors.gray50,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passportLabel: { fontSize: Typography.base, fontWeight: '600', color: Colors.black, marginBottom: Spacing.lg },
  qrWrap: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  qrUrl: { fontSize: Typography.xs, color: Colors.gray400, fontFamily: 'monospace', marginBottom: Spacing.lg },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, width: '100%' },
  downloadBtn: {
    flex: 1,
    height: 46,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnText: { fontSize: Typography.base, fontWeight: '600', color: Colors.gray600 },
  shareBtn: {
    flex: 1,
    height: 46,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: { fontSize: Typography.base, fontWeight: '600', color: Colors.white },
  tipCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  tipTitle: { fontSize: Typography.base, fontWeight: '700', color: Colors.primaryDark, marginBottom: Spacing.md },
  tipItem: { fontSize: Typography.sm, color: Colors.primaryDark, lineHeight: 24 },
  badgeSection: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  badgeTitle: { fontSize: Typography.base, fontWeight: '700', color: Colors.black, marginBottom: Spacing.xs },
  badgeSub: { fontSize: Typography.sm, color: Colors.gray400, lineHeight: 20, marginBottom: Spacing.lg },
  badgePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.gray50,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  badgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIconText: { color: Colors.white, fontSize: Typography.base, fontWeight: '700' },
  badgeName: { fontSize: Typography.base, fontWeight: '600', color: Colors.black },
  badgeDesc: { fontSize: Typography.xs, color: Colors.gray400 },
  copyBadgeBtn: {
    height: 46,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyBadgeBtnText: { fontSize: Typography.base, fontWeight: '600', color: Colors.primary },
});
