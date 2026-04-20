import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { useDatabase } from '@/contexts/DatabaseContext';
import { loginUser, getUserByEmail, getAllUsers } from '@/database/userQueries';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { lang } = useI18n();
  const db = useDatabase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const isES = lang === 'es';

  const handleLogin = async () => {
    if (!email.trim()) {
      setLoginError(isES ? 'Ingresa tu email' : 'Enter your email');
      return;
    }
    if (!password.trim()) {
      setLoginError(isES ? 'Ingresa tu contrasena' : 'Enter your password');
      return;
    }

    let user = await loginUser(db, email.trim().toLowerCase(), password);
    // Fallback: email-only
    if (!user) {
      user = await getUserByEmail(db, email.trim().toLowerCase());
    }
    if (!user) {
      setLoginError(isES ? 'Email o contrasena incorrectos' : 'Wrong email or password');
      return;
    }

    await AsyncStorage.setItem('user_session', JSON.stringify({
      userId: user.id,
      email: user.email,
      loggedIn: true,
    }));
    await AsyncStorage.setItem('onboarding_complete', 'true');
    await AsyncStorage.setItem('active_user_id', user.id.toString());
    if (user.gender) await AsyncStorage.setItem('fitness_goal', 'build');
    if (Platform.OS === 'web') {
      window.location.href = '/';
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    // Try login by email+password
    let user = await loginUser(db, demoEmail, demoPass);

    // Fallback: find by email only
    if (!user) {
      user = await getUserByEmail(db, demoEmail);
    }

    if (!user) return;

    await AsyncStorage.setItem('user_session', JSON.stringify({
      userId: user.id, email: user.email || demoEmail, loggedIn: true,
    }));
    await AsyncStorage.setItem('onboarding_complete', 'true');
    await AsyncStorage.setItem('active_user_id', user.id.toString());
    // Force full reload to pick up new user in all contexts
    if (Platform.OS === 'web') {
      window.location.href = '/';
    } else {
      router.replace('/(tabs)');
    }
  };

  const DEMO_PROFILES = [
    {
      email: 'test1@fitforge.com', pass: 'test1',
      name: 'Diego Torres', desc: isES ? 'Hombre musculoso' : 'Muscular man',
      icon: 'barbell', color: '#FFD200',
    },
    {
      email: 'test2@fitforge.com', pass: 'test2',
      name: 'Valentina Rojas', desc: isES ? 'Mujer fit' : 'Fit woman',
      icon: 'fitness', color: '#FF6B81',
    },
    {
      email: 'test3@fitforge.com', pass: 'test3',
      name: 'Andres Medina', desc: isES ? 'Hombre normal' : 'Average man',
      icon: 'person', color: '#60A5FA',
    },
    {
      email: 'test4@fitforge.com', pass: 'test4',
      name: 'Camila Vargas', desc: isES ? 'Mujer normal' : 'Average woman',
      icon: 'person', color: '#4ADE80',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
            <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: loginError ? colors.error : colors.border }]}>
              <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={email} onChangeText={(v) => { setEmail(v); setLoginError(''); }}
                placeholder={isES ? 'Email' : 'Email'}
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address" autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: loginError ? colors.error : colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={password} onChangeText={(v) => { setPassword(v); setLoginError(''); }}
                placeholder={isES ? 'Contrasena' : 'Password'}
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
              </Pressable>
            </View>

            {loginError ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{loginError}</Text>
              </View>
            ) : null}

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

            {/* Social */}
            <View style={styles.socialRow}>
              <Pressable style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="logo-google" size={22} color="#DB4437" />
                <Text style={[styles.socialText, { color: colors.textPrimary }]}>Google</Text>
              </Pressable>
              <Pressable style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="logo-apple" size={22} color={colors.textPrimary} />
                <Text style={[styles.socialText, { color: colors.textPrimary }]}>Apple</Text>
              </Pressable>
            </View>
          </View>

          {/* Demo profiles */}
          <Pressable onPress={() => setShowDemo(!showDemo)} style={styles.demoToggle}>
            <Ionicons name="people-outline" size={18} color={colors.accent} />
            <Text style={[styles.demoToggleText, { color: colors.accent }]}>
              {isES ? 'Perfiles de prueba' : 'Demo profiles'}
            </Text>
            <Ionicons name={showDemo ? 'chevron-up' : 'chevron-down'} size={16} color={colors.accent} />
          </Pressable>

          {showDemo && (
            <View style={styles.demoGrid}>
              {DEMO_PROFILES.map((profile) => (
                <Pressable
                  key={profile.email}
                  style={[styles.demoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => handleDemoLogin(profile.email, profile.pass)}
                >
                  <View style={[styles.demoIcon, { backgroundColor: profile.color + '20' }]}>
                    <Ionicons name={profile.icon as any} size={22} color={profile.color} />
                  </View>
                  <Text style={[styles.demoName, { color: colors.textPrimary }]}>{profile.name}</Text>
                  <Text style={[styles.demoDesc, { color: colors.textMuted }]}>{profile.desc}</Text>
                  <Text style={[styles.demoEmail, { color: colors.textMuted }]}>{profile.email}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Create account */}
          <View style={styles.signupSection}>
            <Text style={[styles.signupText, { color: colors.textMuted }]}>
              {isES ? 'No tienes cuenta?' : "Don't have an account?"}
            </Text>
            <Pressable onPress={() => router.push('/onboarding')}>
              <Text style={[styles.signupLink, { color: colors.accent }]}>
                {isES ? ' Crear cuenta' : ' Sign up'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1 },
  inner: { flex: 1, padding: Layout.screenPadding, justifyContent: 'center' },

  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoText: { ...Typography.h1, fontSize: 36 },
  tagline: { ...Typography.bodySmall, marginTop: 4 },

  formSection: { gap: 12 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1,
  },
  input: { ...Typography.body, flex: 1 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorText: { ...Typography.caption },

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

  // Demo profiles
  demoToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 20, paddingVertical: 8,
  },
  demoToggleText: { ...Typography.bodySmall, fontWeight: '600' },
  demoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  demoCard: {
    width: '48%', borderRadius: 12, borderWidth: 1, padding: 12,
    alignItems: 'center', gap: 4,
  },
  demoIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  demoName: { ...Typography.bodySmall, fontWeight: '700', marginTop: 4 },
  demoDesc: { ...Typography.caption },
  demoEmail: { ...Typography.caption, fontSize: 10 },

  signupSection: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signupText: { ...Typography.body },
  signupLink: { ...Typography.body, fontWeight: '700' },
});
