import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { lang } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const isES = lang === 'es';

  const handleLogin = async () => {
    if (!email.trim()) {
      setLoginError(isES ? 'Ingresa tu email o telefono' : 'Enter your email or phone');
      return;
    }
    // For now: local session. In production: Firebase/API auth
    await AsyncStorage.setItem('user_session', JSON.stringify({
      email: email.trim(),
      loggedIn: true,
      loginAt: new Date().toISOString(),
    }));
    await AsyncStorage.setItem('onboarding_complete', 'true');
    router.replace('/(tabs)');
  };

  const handleCreateAccount = () => {
    router.push('/onboarding');
  };

  const handleGoogleLogin = async () => {
    // Placeholder for Google Sign-In
    await AsyncStorage.setItem('user_session', JSON.stringify({
      provider: 'google',
      loggedIn: true,
      loginAt: new Date().toISOString(),
    }));
    await AsyncStorage.setItem('onboarding_complete', 'true');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.accent + '15' }]}>
            <Ionicons name="fitness" size={48} color={colors.accent} />
          </View>
          <Text style={[styles.logoText, { color: colors.accent }]}>FitForge</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            {isES ? 'Tu cuerpo. Tu progreso. Tu fuerza.' : 'Your body. Your progress. Your strength.'}
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formSection}>
          <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              value={email}
              onChangeText={(v) => { setEmail(v); setLoginError(''); }}
              placeholder={isES ? 'Email o telefono' : 'Email or phone'}
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              value={password}
              onChangeText={(v) => { setPassword(v); setLoginError(''); }}
              placeholder={isES ? 'Contrasena' : 'Password'}
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          {loginError ? (
            <Text style={[styles.errorText, { color: colors.error }]}>{loginError}</Text>
          ) : null}

          <Pressable onPress={() => {}} style={styles.forgotBtn}>
            <Text style={[styles.forgotText, { color: colors.accent }]}>
              {isES ? 'Olvidaste tu contrasena?' : 'Forgot password?'}
            </Text>
          </Pressable>

          {/* Login button */}
          <Pressable onPress={handleLogin} style={styles.loginBtn}>
            <LinearGradient
              colors={[colors.gradientPrimary[0], colors.gradientPrimary[1]] as [string, string]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.loginGradient}
            >
              <Text style={styles.loginBtnText}>
                {isES ? 'Iniciar Sesion' : 'Log In'}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>
              {isES ? 'o continua con' : 'or continue with'}
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Social login */}
          <View style={styles.socialRow}>
            <Pressable
              style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handleGoogleLogin}
            >
              <Ionicons name="logo-google" size={22} color="#DB4437" />
              <Text style={[styles.socialText, { color: colors.textPrimary }]}>Google</Text>
            </Pressable>
            <Pressable
              style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handleGoogleLogin}
            >
              <Ionicons name="logo-apple" size={22} color={colors.textPrimary} />
              <Text style={[styles.socialText, { color: colors.textPrimary }]}>Apple</Text>
            </Pressable>
          </View>
        </View>

        {/* Create account */}
        <View style={styles.signupSection}>
          <Text style={[styles.signupText, { color: colors.textMuted }]}>
            {isES ? 'No tienes cuenta?' : "Don't have an account?"}
          </Text>
          <Pressable onPress={handleCreateAccount}>
            <Text style={[styles.signupLink, { color: colors.accent }]}>
              {isES ? ' Crear cuenta' : ' Sign up'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: Layout.screenPadding, justifyContent: 'center' },

  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  logoText: { ...Typography.h1, fontSize: 36 },
  tagline: { ...Typography.bodySmall, marginTop: 4 },

  formSection: { gap: 12 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1,
  },
  input: { ...Typography.body, flex: 1 },
  errorText: { ...Typography.caption, marginLeft: 4 },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { ...Typography.bodySmall, fontWeight: '600' },

  loginBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 4 },
  loginGradient: { alignItems: 'center', paddingVertical: 16 },
  loginBtnText: { ...Typography.body, color: '#0D0D0D', fontWeight: '800', fontSize: 16 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { ...Typography.caption },

  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1,
  },
  socialText: { ...Typography.body, fontWeight: '600' },

  signupSection: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  signupText: { ...Typography.body },
  signupLink: { ...Typography.body, fontWeight: '700' },
});
