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

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join thousands of makers who verify their craft.</Text>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="Maria Santos"
              placeholderTextColor={Colors.gray400}
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={Colors.gray400}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 8 characters"
              placeholderTextColor={Colors.gray400}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.label}>Shop / brand name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Maria's Ceramics"
              placeholderTextColor={Colors.gray400}
              value={shopName}
              onChangeText={setShopName}
            />

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.replace('/tabs/dashboard')}
            >
              <Text style={styles.primaryBtnText}>Create account</Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerLink}>Sign in</Text>
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  backBtn: { marginBottom: Spacing.xl },
  backText: { fontSize: Typography.base, color: Colors.primary },
  title: {
    fontSize: Typography.xxl,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.gray600,
    marginBottom: Spacing.xxl,
  },
  form: { marginBottom: Spacing.xl },
  label: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray600,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.base,
    color: Colors.black,
    backgroundColor: Colors.gray50,
  },
  primaryBtn: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: '600',
  },
  terms: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: { color: Colors.primary },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: Spacing.xl,
  },
  footerText: { fontSize: Typography.base, color: Colors.gray600 },
  footerLink: { fontSize: Typography.base, color: Colors.primary, fontWeight: '600' },
});
