import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { login } from '../../lib/supabase/auth';
import { useUserStore } from '@/store/useUserStore';
import { getCurrentUserName } from '@/lib/supabase/functions';
import { getCurrentUser } from '@/lib/supabase/functions';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const setName = useUserStore((s) => s.setName);
    const setCurrentUser = useUserStore((s) => s.setCurrentUser);


    const handleSignIn = async () => {
        console.log("sign-in clicked")
        if (!email.includes('@')) {
            console.log("no email")
            setEmailError('Please enter a valid email address.');
            return;
        }
        if (!email) {
            console.log("no email")
            setEmailError('Email address needed.');
            return;
        }
        try {
            const result = await login(email, password)

            if (result.success) {
                const user = await getCurrentUser();
                const userName = await getCurrentUserName();

                setName(userName);
                setCurrentUser(user);

                console.log("moving to dashboard");
                router.replace('/tabs/dashboard');
            }
        } catch (err: any) {
            console.error(err.message);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo */}
                    <View style={styles.logoSection}>
                        <View style={styles.logoIcon}>
                            <Text style={styles.logoIconText}>MT</Text>
                        </View>
                        <Text style={styles.logoText}>MiniTrace</Text>
                        <Text style={styles.tagline}>Prove what you make.</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Text style={styles.label}>Email address</Text>
                        <TextInput
                            style={[styles.input, emailError ? styles.inputError : null]}
                            placeholder="you@example.com"
                            placeholderTextColor={Colors.gray400}
                            value={email}
                            onChangeText={(v) => { setEmail(v); setEmailError(''); }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={Colors.gray400}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <TouchableOpacity style={styles.forgotWrap}>
                            <Text style={styles.forgotText}>Forgot password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.primaryBtn} onPress={handleSignIn}>
                            <Text style={styles.primaryBtnText}>Sign in</Text>
                        </TouchableOpacity>

                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity style={styles.ghostBtn}>
                            <Text style={styles.googleG}>G</Text>
                            <Text style={styles.ghostBtnText}>Continue with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                            <Text style={styles.footerLink}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.white },
    flex: { flex: 1 },
    container: {
        flexGrow: 1,
        paddingHorizontal: Spacing.xl,
        paddingTop: 64,
        paddingBottom: Spacing.xxl,
    },
    logoSection: { alignItems: 'center', marginBottom: 48 },
    logoIcon: {
        width: 64,
        height: 64,
        borderRadius: Radius.lg,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoIconText: {
        color: Colors.white,
        fontSize: Typography.lg,
        fontWeight: '800',
        letterSpacing: 1,
    },
    logoText: {
        fontSize: Typography.xxl,
        fontWeight: '700',
        color: Colors.black,
        marginBottom: Spacing.xs,
    },
    tagline: { fontSize: Typography.base, color: Colors.gray400 },
    form: { marginBottom: Spacing.xl },
    label: {
        fontSize: Typography.sm,
        fontWeight: '600',
        color: Colors.gray600,
        marginBottom: Spacing.xs,
        marginTop: Spacing.md,
    },
    input: {
        height: 50,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.lg,
        fontSize: Typography.base,
        color: Colors.black,
        backgroundColor: Colors.gray50,
    },
    inputError: { borderColor: Colors.danger },
    errorText: { fontSize: Typography.xs, color: Colors.danger, marginTop: 4 },
    forgotWrap: {
        alignSelf: 'flex-end',
        marginTop: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    forgotText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: '500' },
    primaryBtn: {
        height: 52,
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    primaryBtnText: { color: Colors.white, fontSize: Typography.base, fontWeight: '700' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
    dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
    dividerText: { marginHorizontal: Spacing.md, fontSize: Typography.sm, color: Colors.gray400 },
    ghostBtn: {
        height: 52,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    googleG: { fontSize: Typography.md, fontWeight: '700', color: '#4285F4' },
    ghostBtnText: { color: Colors.gray600, fontSize: Typography.base, fontWeight: '500' },
    footer: { flexDirection: 'row', justifyContent: 'center', paddingTop: Spacing.xl },
    footerText: { fontSize: Typography.base, color: Colors.gray600 },
    footerLink: { fontSize: Typography.base, color: Colors.primary, fontWeight: '700' },
});
