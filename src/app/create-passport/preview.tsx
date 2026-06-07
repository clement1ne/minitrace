import React, { useState, useEffect } from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { StepIndicator } from '../../components/StepIndicator';
import { usePassportStore } from '../../store/usePassportStore';
import { useUserStore } from '@/store/useUserStore';
import { askAIOnNewScore } from '@/lib/ai/huggingface';
import { createPassport, getCurrentUser } from '../../lib/supabase/functions';

export default function PreviewScreen() {
    const response = usePassportStore((s) => s.editedResponse);
    const hash = usePassportStore((s) => s.hash);
    const blockchainTxHash = usePassportStore((s) => s.blockchainTxHash);
    const originalResponse = usePassportStore((s) => s.response);
    const [SCORE, setScore] = useState(response?.sustainability_score ?? '-');
    const [isCalculatingScore, setIsCalculatingScore] = useState(false);
    useEffect(() => {
        async function computeNewScore() {
            if (JSON.stringify(response) !== JSON.stringify(originalResponse)) {
                setIsCalculatingScore(true);
                try {
                    const scoreObj = await askAIOnNewScore(response);
                    await new Promise(resolve => setTimeout(resolve, 900));
                    setScore(scoreObj.sustainability_score);
                } catch (err: any) {
                    console.error("Failed to compute new Score: ", err.message);
                    setScore('-');
                } finally {
                    setIsCalculatingScore(false);
                }
            }
        }
        if (response && originalResponse) {
            computeNewScore();
        }
    }, [response, originalResponse]);

    const uris = usePassportStore((s) => s.uris);
    const currentName = useUserStore((s) => s.currentName);
    console.log("preview response: ", response);

    const PASSPORT = {
        id: response?.id ?? '-',
        name: response?.name ?? '-',
        maker: currentName,
        material: response?.material ?? '-',
        origin: response?.origin ?? '-',
        method: response?.method ?? '-',
        score: SCORE ?? '-',
        description: response?.description ?? '-',
    };
    const DETAILS = [
        { key: 'Material', value: PASSPORT.material },
        { key: 'Made in', value: PASSPORT.origin },
        { key: 'Method', value: PASSPORT.method },
        { key: 'Passport ID', value: `#MT-${PASSPORT.id}` },
    ];
    const router = useRouter();

    const handlePublish = () => {
        Alert.alert(
            'Publish passport?',
            'This will make your passport publicly accessible via QR code.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Publish',
                    onPress: async () => {
                        const user = await getCurrentUser();
                        if (!user) return;
                        await createPassport({
                            user_id: user.id,
                            product_name: PASSPORT.name,
                            material: PASSPORT.material,
                            origin: PASSPORT.origin,
                            method: PASSPORT.method,
                            sustainability_score: Number(PASSPORT.score) || 0,
                            description: PASSPORT.description,
                            content_hash: hash,
                            blockchain_tx_hash: blockchainTxHash,
                        });
                        router.replace(`/passport/${PASSPORT.id}`);
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <StepIndicator current={5} total={5} />

                <Text style={styles.stepLabel}>Step 5 of 5</Text>
                <Text style={styles.title}>Preview & confirm</Text>
                <Text style={styles.subtitle}>
                    This is what buyers will see when they scan your QR code.
                </Text>

                {/* Passport card preview */}
                <View style={styles.passportCard}>

                    {/* Product image placeholder */}
                    <View style={styles.productImage}>
                        <Image source={{ uri: uris[0] }} style={styles.productImage} />
                    </View>

                    {/* Product name + maker */}
                    <Text style={styles.passportName}>{PASSPORT.name}</Text>
                    <View style={styles.makerRow}>
                        <Text style={styles.makerText}>by {PASSPORT.maker}</Text>
                        <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓ Verified Maker</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>{PASSPORT.description}</Text>

                    <View style={styles.divider} />

                    {/* Details */}
                    {DETAILS.map((d, i) => (
                        <View key={d.key} style={[styles.detailRow, i < DETAILS.length - 1 && styles.detailRowBorder]}>
                            <Text style={styles.detailKey}>{d.key}</Text>
                            <Text style={styles.detailVal}>{d.value ?? '-'}</Text>
                        </View>
                    ))}

                    <View style={styles.divider} />

                    {/* Eco score */}
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreLabel}>Eco score</Text>
                        <View style={styles.scoreBadge}>
                            {isCalculatingScore ? (<Text style={styles.scoreBadgeText}>Calculating...</Text>
                            ) : (
                                <Text style={styles.scoreBadgeText}>
                                    {PASSPORT.score}/10
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.scoreBar}>
                        <View style={[styles.scoreBarFill, { width: `${(PASSPORT.score / 10) * 100}%` }]} />
                    </View>

                </View>

            </ScrollView>

            {/* Footer buttons */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => router.back()}
                >
                    <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.publishBtn,
                        isCalculatingScore && styles.publishBtnDisabled  // ← Add this
                    ]}
                    onPress={handlePublish}
                    disabled={isCalculatingScore}   // ← This is the key
                >
                    {isCalculatingScore ? (
                        <>
                            <ActivityIndicator size="small" color="#fff" />
                            <Text style={styles.publishBtnText}>Calculating Score...</Text>
                        </>
                    ) : (
                        <Text style={styles.publishBtnText}>Publish Passport</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.white },
    container: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: 110 },
    backBtn: { marginBottom: Spacing.xl },
    backText: { fontSize: Typography.base, color: Colors.primary },
    stepLabel: { fontSize: Typography.xs, color: Colors.gray400, marginBottom: Spacing.xs },
    title: { fontSize: Typography.xxl, fontWeight: '700', color: Colors.black, marginBottom: Spacing.xs },
    subtitle: { fontSize: Typography.base, color: Colors.gray600, lineHeight: 22, marginBottom: Spacing.xl },
    passportCard: {
        backgroundColor: Colors.white,
        borderRadius: Radius.xl,
        borderWidth: 1.5,
        borderColor: Colors.border,
        overflow: 'hidden',
        padding: Spacing.xl,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    productImage: {
        width: '100%',
        height: 180,
        backgroundColor: Colors.primaryLight,
        borderRadius: Radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    publishBtnDisabled: { backgroundColor: '#A0D8A0', opacity: 0.7, },
    productImageLabel: { fontSize: Typography.sm, color: Colors.primaryDark },
    passportName: { fontSize: Typography.lg, fontWeight: '700', color: Colors.black, marginBottom: Spacing.xs },
    makerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
    makerText: { fontSize: Typography.sm, color: Colors.gray600 },
    verifiedBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.sm },
    verifiedText: { fontSize: Typography.xs, color: Colors.primaryDark, fontWeight: '500' },
    description: { fontSize: Typography.sm, color: Colors.gray600, lineHeight: 20, marginBottom: Spacing.lg },
    divider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.md },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
    detailRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
    detailKey: { fontSize: Typography.sm, color: Colors.gray400 },
    detailVal: { fontSize: Typography.sm, fontWeight: '600', color: Colors.black },
    scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    scoreLabel: { fontSize: Typography.sm, fontWeight: '600', color: Colors.black },
    scoreBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.md, paddingVertical: 3, borderRadius: Radius.sm },
    scoreBadgeText: { fontSize: Typography.sm, fontWeight: '700', color: Colors.primaryDark },
    scoreBar: { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
    scoreBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
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
    editBtn: {
        flex: 1,
        height: 52,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editBtnText: { fontSize: Typography.base, fontWeight: '600', color: Colors.gray600 },
    publishBtn: {
        flex: 2,
        height: 52,
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    publishBtnText: { color: Colors.white, fontSize: Typography.base, fontWeight: '700' },
});
