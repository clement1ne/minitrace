import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import { getPolygonScanUrl } from '../../lib/blockchain/config';
import { getPassportById } from '../../lib/supabase/functions';
import { useUserStore } from '@/store/useUserStore';

export default function PassportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const currentName = useUserStore((s) => s.currentName);
  const [passport, setPassport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getPassportById(id);
        setPassport(data);
      } catch (err: any) {
        console.log('Failed to load passport:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const sd = passport?.sustainability_data;
  const contentHash = passport?.passport_anchors?.[0]?.content_hash;
  const blockchainTxHash = passport?.blockchain_tx_hash;

  const infoRows = [
    { key: 'Material', value: sd?.material ?? '-' },
    { key: 'Made in', value: sd?.origin ?? '-' },
    { key: 'Method', value: passport?.production_method ?? '-' },
    { key: 'Passport ID', value: id ? `${id.slice(0, 16)}...` : '-' },
    { key: 'Created', value: passport?.created_at ? new Date(passport.created_at).toLocaleDateString() : '-' },
  ];

  const handleShare = async () => {
    await Share.share({
      message: `Check out this verified product passport for ${passport?.product_name}: https://minitrace.app/passport/${id}`,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!passport) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.notFoundText}>Passport not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const score = sd?.sustainability_score ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Nav */}
        <View style={[styles.nav, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.navBack}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <Text style={styles.navShare}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Product image */}
        <View style={[styles.productImage, { backgroundColor: Colors.primaryLight }]}>
          <Text style={styles.productImageLabel}>Product photo</Text>
        </View>

        {/* Name + verified */}
        <Text style={styles.name}>{passport.product_name}</Text>
        <View style={styles.makerRow}>
          <Text style={styles.makerText}>by {currentName ?? 'Maker'}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{passport.description ?? '-'}</Text>

        <View style={styles.divider} />

        {/* Info rows */}
        <Text style={styles.sectionTitle}>Product details</Text>
        {infoRows.map((row, i) => (
          <View
            key={row.key}
            style={[styles.infoRow, i < infoRows.length - 1 && styles.infoRowBorder]}
          >
            <Text style={styles.infoKey}>{row.key}</Text>
            <Text style={styles.infoVal}>{row.value}</Text>
          </View>
        ))}

        {contentHash ? (
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Text style={styles.infoKey}>Content fingerprint</Text>
            <Text style={styles.hashVal} numberOfLines={1} ellipsizeMode="tail">{contentHash.slice(0, 16)}...</Text>
          </View>
        ) : null}

        {blockchainTxHash ? (
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Text style={styles.infoKey}>Blockchain tx</Text>
            <TouchableOpacity onPress={() => Linking.openURL(getPolygonScanUrl(blockchainTxHash))}>
              <Text style={styles.blockchainLink}>{blockchainTxHash.slice(0, 10)}...</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {blockchainTxHash ? (
          <View style={styles.blockchainBadge}>
            <Text style={styles.blockchainBadgeText}>✓ Verified on Polygon</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        {/* Sustainability score */}
        <Text style={styles.sectionTitle}>Sustainability score</Text>
        <View style={styles.scoreRow}>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>{score}/10</Text>
          </View>
          <View style={styles.scoreBarWrap}>
            <View style={[styles.scoreBarFill, { width: `${(score / 10) * 100}%` }]} />
          </View>
        </View>

        <View style={styles.divider} />

        {/* About the maker */}
        <Text style={styles.sectionTitle}>About the maker</Text>
        <View style={styles.makerCard}>
          <View style={styles.makerAvatar}>
            <Text style={styles.makerAvatarText}>{currentName?.slice(0, 2).toUpperCase() ?? 'MK'}</Text>
          </View>
          <View style={styles.makerInfo}>
            <Text style={styles.makerName}>{currentName ?? 'Maker'}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.qrBtn}
          onPress={() => router.push(`/passport/qr/${id}`)}
        >
          <Text style={styles.qrBtnText}>View QR code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>Share passport</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: Typography.base, color: Colors.gray400 },
  container: { paddingHorizontal: Spacing.xl, paddingBottom: 110 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  navBack: { fontSize: Typography.base, color: Colors.primary },
  navShare: { fontSize: Typography.base, color: Colors.primary, fontWeight: '600' },
  productImage: {
    width: '100%',
    height: 220,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  productImageLabel: { fontSize: Typography.sm, color: Colors.primaryDark },
  name: { fontSize: Typography.xl, fontWeight: '700', color: Colors.black, marginBottom: Spacing.sm },
  makerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  makerText: { fontSize: Typography.base, color: Colors.gray600 },
  verifiedBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.sm },
  verifiedText: { fontSize: Typography.xs, fontWeight: '600', color: Colors.primaryDark },
  description: { fontSize: Typography.base, color: Colors.gray600, lineHeight: 22, marginBottom: Spacing.xl },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.lg },
  sectionTitle: { fontSize: Typography.base, fontWeight: '700', color: Colors.black, marginBottom: Spacing.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  infoKey: { fontSize: Typography.base, color: Colors.gray400, marginRight: Spacing.sm },
  infoVal: { flex: 1, flexShrink: 1, fontSize: Typography.base, fontWeight: '600', color: Colors.black, textAlign: 'right' },
  hashVal: { fontSize: Typography.xs, fontWeight: '500', color: Colors.gray600, maxWidth: 160 },
  blockchainLink: { fontSize: Typography.xs, fontWeight: '500', color: Colors.primary, maxWidth: 160 },
  blockchainBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  blockchainBadgeText: { fontSize: Typography.xs, fontWeight: '600', color: Colors.primaryDark },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  scoreBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.sm },
  scoreBadgeText: { fontSize: Typography.base, fontWeight: '700', color: Colors.primaryDark },
  scoreBarWrap: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  scoreBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  makerCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  makerAvatar: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  makerAvatarText: { fontSize: Typography.sm, fontWeight: '700', color: Colors.primaryDark },
  makerInfo: { flex: 1 },
  makerName: { fontSize: Typography.base, fontWeight: '600', color: Colors.black },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    padding: Spacing.xl,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  qrBtn: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBtnText: { fontSize: Typography.base, fontWeight: '600', color: Colors.gray600 },
  shareBtn: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: { color: Colors.white, fontSize: Typography.base, fontWeight: '700' },
});
