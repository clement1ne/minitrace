import { getPassports } from '@/lib/supabase/functions';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import { useUserStore } from '@/store/useUserStore';

type Filter = 'All' | 'Verified' | 'Drafts';

export default function MyPassportsScreen() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<Filter>('All');
    const filters: Filter[] = ['All', 'Verified', 'Drafts'];
    const [passports, setPassports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const filtered = passports.filter((p) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Verified') return p.status === 'Verified';
        if (activeFilter === 'Drafts') return p.status === 'Draft';
        return true;
    });
    const currentUser = useUserStore((s) => s.currentUser);

    useEffect(() => {
        async function load() {
            if (!currentUser) return;
            const data = await getPassports(currentUser.id);

            // Map DB columns → your display format
            const mapped = data?.map((p) => ({
                id: String(p.id).padStart(4, '0'),
                name: p.product_name,
                meta: p.status === 'Draft'
                    ? 'Draft · not published'
                    : `${p.created_at} · _____ scans`, // adjust to your columns
                status: p.status,                           // 'Verified' | 'Draft'
                color: p.status === 'Draft' ? Colors.gray200
                    : p.status === 'Verified' ? '#9FE1CB'
                        : '#B5D4F4',
            })) ?? [];

            setPassports(mapped);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <SafeAreaView style={styles.safe}>

            <View style={styles.header}>
                <Text style={styles.title}>My Passports</Text>
                <TouchableOpacity
                    style={styles.newBtn}
                    onPress={() => router.push('/create-passport/start')}
                >
                    <Text style={styles.newBtnText}>+ New</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
            >
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.chip, activeFilter === f && styles.chipActive]}
                        onPress={() => setActiveFilter(f)}
                    >
                        <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {filtered.map((p) => (
                    <TouchableOpacity
                        key={p.id}
                        style={[styles.card, p.status === 'Draft' && styles.cardDraft]}
                        onPress={() => p.status !== 'Draft' && router.push(`/passport/${p.id}`)}
                        activeOpacity={p.status === 'Draft' ? 1 : 0.7}
                    >
                        <View style={[styles.thumb, { backgroundColor: p.color }]} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{p.name}</Text>
                            <Text style={styles.meta}>{p.meta}</Text>
                            <View style={[styles.badge, p.status === 'Draft' ? styles.badgeDraft : styles.badgeVerified]}>
                                <Text style={[styles.badgeText, p.status === 'Draft' ? styles.badgeTextDraft : styles.badgeTextVerified]}>
                                    {p.status === 'Verified' ? '✓ Verified' : 'Draft'}
                                </Text>
                            </View>
                        </View>
                        {p.status !== 'Draft' && (
                            <Text style={styles.chevron}>›</Text>
                        )}
                    </TouchableOpacity>
                ))}

                {filtered.length === 0 && (
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyTitle}>Nothing here yet</Text>
                        <Text style={styles.emptyText}>Create your first Digital Product Passport to get started.</Text>
                        <TouchableOpacity
                            style={styles.emptyBtn}
                            onPress={() => router.push('/create-passport/start')}
                        >
                            <Text style={styles.emptyBtnText}>Create passport</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.white },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.md,
    },
    title: { fontSize: Typography.xl, fontWeight: '700', color: Colors.black },
    newBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
    },
    newBtnText: { color: Colors.white, fontSize: Typography.sm, fontWeight: '600' },
    filterRow: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.md,
        gap: Spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
    },
    chip: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.border,
        alignSelf: 'flex-start',
    },
    chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    chipText: { fontSize: Typography.sm, color: Colors.gray600 },
    chipTextActive: { color: Colors.white, fontWeight: '600' },
    list: { paddingHorizontal: Spacing.xl, paddingBottom: 100, gap: Spacing.sm },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray50,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        gap: Spacing.md,
    },
    cardDraft: { opacity: 0.6 },
    thumb: { width: 52, height: 52, borderRadius: Radius.sm },
    info: { flex: 1 },
    name: { fontSize: Typography.base, fontWeight: '500', color: Colors.black, marginBottom: 2 },
    meta: { fontSize: Typography.xs, color: Colors.gray400, marginBottom: Spacing.xs },
    badge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.sm },
    badgeVerified: { backgroundColor: Colors.primaryLight },
    badgeDraft: { backgroundColor: Colors.gray100 },
    badgeText: { fontSize: Typography.xs, fontWeight: '500' },
    badgeTextVerified: { color: Colors.primaryDark },
    badgeTextDraft: { color: Colors.gray600 },
    chevron: { fontSize: Typography.xl, color: Colors.gray400 },
    empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: Spacing.xl },
    emptyIcon: { fontSize: 40, marginBottom: Spacing.lg },
    emptyTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.black, marginBottom: Spacing.sm },
    emptyText: { fontSize: Typography.base, color: Colors.gray400, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
    emptyBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.md },
    emptyBtnText: { color: Colors.white, fontSize: Typography.base, fontWeight: '600' },
});
