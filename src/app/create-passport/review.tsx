import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { StepIndicator } from '../../components/StepIndicator';
import { usePassportStore } from '../../store/usePassportStore';


export default function ReviewScreen() {
    const response = usePassportStore((s) => s.response);
    const setEditedResponse = usePassportStore((s) => s.setEditedResponse);
    const router = useRouter();
    const [productName, setProductName] = useState(response?.name ?? '-');
    const [materials, setMaterials] = useState(response?.material ?? '-');
    const [description, setDescription] = useState(response?.description ?? '-');
    const [origin, setOrigin] = useState(response?.origin ?? '-');
    const [method, setMethod] = useState(response?.production_method ?? '-');
    const [SCORE, setScore] = useState(Number(response?.sustainability_score) ?? 0);

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <StepIndicator current={4} total={5} />

                <Text style={styles.stepLabel}>Step 4 of 5</Text>
                <Text style={styles.title}>Review & edit</Text>
                <Text style={styles.subtitle}>
                    AI has filled these from your photos. Tap any field to make changes.
                </Text>

                <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>✨ AI-generated — edit anything that looks off</Text>
                </View>

                {/* Fields */}
                {[
                    { label: 'Product name', value: productName, setter: setProductName, placeholder: 'Enter product name' },
                    { label: 'Materials detected', value: materials, setter: setMaterials, placeholder: 'e.g. Stoneware, natural glaze' },
                    { label: 'Made in', value: origin, setter: setOrigin, placeholder: 'City, Country' },
                    { label: 'Production method', value: method, setter: setMethod, placeholder: 'e.g. Hand-thrown, hand-stitched' },
                ].map((f) => (
                    <View key={f.label} style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>{f.label}</Text>
                        <TextInput
                            style={styles.input}
                            value={f.value}
                            onChangeText={f.setter}
                            placeholder={f.placeholder}
                            placeholderTextColor={Colors.gray400}
                        />
                    </View>
                ))}

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Product description</Text>
                    <TextInput
                        style={[styles.input, styles.inputMulti]}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        placeholder="Describe your product..."
                        placeholderTextColor={Colors.gray400}
                        textAlignVertical="top"
                    />
                </View>

                {/* Sustainability score */}
                <View style={styles.scoreCard}>
                    <View style={styles.scoreHeader}>
                        <View>
                            <Text style={styles.scoreTitle}>Sustainability score</Text>
                            <Text style={styles.scoreSubtitle}>Based on detected materials</Text>
                        </View>
                        <View style={styles.scoreBadge}>
                            <Text style={styles.scoreBadgeText}>{SCORE}/10</Text>
                        </View>
                    </View>
                    <View style={styles.scoreBar}>
                        <View style={[styles.scoreBarFill, { width: `${(SCORE / 10) * 100}%` }]} />
                    </View>
                    <Text style={styles.scoreTip}>
                        Add more context in the description to improve accuracy.
                    </Text>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={() => {
                        setEditedResponse({
                            name: productName,
                            material: materials,
                            origin: origin,
                            production_method: method,
                            sustainability_score: Number(SCORE),
                            description: description,
                        })
                        router.push('/create-passport/preview')
                    }
                    }
                >
                    <Text style={styles.nextBtnText}>Preview passport →</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.white },
    container: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: 100 },
    backBtn: { marginBottom: Spacing.xl },
    backText: { fontSize: Typography.base, color: Colors.primary },
    stepLabel: { fontSize: Typography.xs, color: Colors.gray400, marginBottom: Spacing.xs },
    title: { fontSize: Typography.xxl, fontWeight: '700', color: Colors.black, marginBottom: Spacing.xs },
    subtitle: { fontSize: Typography.base, color: Colors.gray600, lineHeight: 22, marginBottom: Spacing.lg },
    aiBadge: {
        backgroundColor: '#FFFBEB',
        borderRadius: Radius.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        alignSelf: 'flex-start',
        marginBottom: Spacing.xl,
    },
    aiBadgeText: { fontSize: Typography.xs, color: '#92400E' },
    fieldGroup: { marginBottom: Spacing.lg },
    fieldLabel: { fontSize: Typography.sm, fontWeight: '600', color: Colors.gray600, marginBottom: Spacing.xs },
    input: {
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        fontSize: Typography.base,
        color: Colors.black,
        backgroundColor: Colors.gray50,
    },
    inputMulti: { minHeight: 96, paddingTop: Spacing.md },
    scoreCard: {
        backgroundColor: Colors.gray50,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
    scoreTitle: { fontSize: Typography.base, fontWeight: '600', color: Colors.black, marginBottom: 2 },
    scoreSubtitle: { fontSize: Typography.xs, color: Colors.gray400 },
    scoreBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.sm },
    scoreBadgeText: { fontSize: Typography.base, fontWeight: '700', color: Colors.primaryDark },
    scoreBar: { height: 8, backgroundColor: Colors.border, borderRadius: 4, marginBottom: Spacing.sm, overflow: 'hidden' },
    scoreBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
    scoreTip: { fontSize: Typography.xs, color: Colors.gray400, lineHeight: 16 },
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
    nextBtnText: { color: Colors.white, fontSize: Typography.base, fontWeight: '700' },
});
