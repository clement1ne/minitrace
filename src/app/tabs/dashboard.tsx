import React, { Activity, useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useUserStore } from '@/store/useUserStore';
import { getLatestPassports } from '@/lib/supabase/functions';

const STATS = [
    { num: '12', label: 'Passports' },
    { num: '48', label: 'QR Scans' },
    { num: '4.8', label: 'Eco avg.' },
    { num: '+18%', label: 'Order value' },
];

export default function DashboardScreen() {
    const router = useRouter();
    const currentName = useUserStore((s) => s.currentName);
    const currentUser = useUserStore((s) => s.currentUser)
    const [latestPassports, setLatestPassports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!currentUser) return;
            const data = await getLatestPassports(currentUser.id);
            const mapped = data?.map((p) => ({
                id: String(p.passport_id).padStart(4, '0'),
                name: p.product_name,
                date: new Date(p.created_at).toLocaleDateString(),
                scans: p.scans ?? 0,
                color: p.status === 'Draft' ? Colors.gray200
                    : p.status === 'Verified' ? '#9FE1CB'
                        : '#B5D4F4',
            })) ?? [];
            setLatestPassports(mapped);
            setLoading(false);
        }
        load();
    }, [currentUser]);

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {currentName}  👋</Text>
                        <Text style={styles.greetingSub}>Here's your maker overview</Text>
                    </View>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>MS</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.ctaCard}
                    onPress={() => router.push('/create-passport/start')}
                >
                    <View>
                        <Text style={styles.ctaTitle}>+ New Passport</Text>
                        <Text style={styles.ctaSub}>Generate in under 60 seconds</Text>
                    </View>
                    <View style={styles.ctaArrow}>
                        <Text style={styles.ctaArrowText}>→</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.statsGrid}>
                    {STATS.map((s) => (
                        <View key={s.label} style={styles.statCard}>
                            <Text style={styles.statNum}>{s.num}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent passports</Text>
                    <TouchableOpacity onPress={() => router.push('/tabs/my-passports')}>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator color={Colors.primary} />
                ) : latestPassports.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No passports yet — create your first one!</Text>
                    </View>
                ) : (
                    latestPassports.map((p) => (
                        <TouchableOpacity
                            key={p.id}
                            style={styles.passportRow}

                            onPress={() => {
                                console.log(p);
                                router.push(`/passport/${p.id}`)
                            }}
                        >
                            <View style={[styles.thumb, { backgroundColor: p.color }]} />
                            <View style={styles.passportInfo}>
                                <Text style={styles.passportName}>{p.name}</Text>
                                <Text style={styles.passportMeta}>{p.date} · {p.scans} scans</Text>
                            </View>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>✓ Verified</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.white },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
    emptyText: { fontSize: 16, color: Colors.gray400, textAlign: 'center' },
    container: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: 100 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
    greeting: { fontSize: Typography.xl, fontWeight: '700', color: Colors.black },
    greetingSub: { fontSize: Typography.sm, color: Colors.gray400, marginTop: 2 },
    avatar: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: Typography.sm, fontWeight: '700', color: Colors.primaryDark },
    ctaCard: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.lg,
        padding: Spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    ctaTitle: { fontSize: Typography.md, fontWeight: '700', color: Colors.white, marginBottom: 4 },
    ctaSub: { fontSize: Typography.sm, color: Colors.primaryMid },
    ctaArrow: { width: 36, height: 36, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    ctaArrowText: { color: Colors.white, fontSize: Typography.lg },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
    statCard: { flex: 1, minWidth: '44%', backgroundColor: Colors.gray50, borderRadius: Radius.md, padding: Spacing.lg },
    statNum: { fontSize: Typography.xl, fontWeight: '700', color: Colors.black, marginBottom: 2 },
    statLabel: { fontSize: Typography.xs, color: Colors.gray400 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    sectionTitle: { fontSize: Typography.base, fontWeight: '600', color: Colors.black },
    seeAll: { fontSize: Typography.sm, color: Colors.primary },
    passportRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray50, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md },
    thumb: { width: 46, height: 46, borderRadius: Radius.sm },
    passportInfo: { flex: 1 },
    passportName: { fontSize: Typography.base, fontWeight: '500', color: Colors.black },
    passportMeta: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 2 },
    badge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.sm },
    badgeText: { fontSize: Typography.xs, color: Colors.primaryDark, fontWeight: '500' },
});
