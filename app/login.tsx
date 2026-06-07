import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { useDatabase } from '@/contexts/DatabaseContext';
import { loginUser, createUser, getUserByEmail } from '@/database/userQueries';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

// Web client ID from Google Cloud Console → OAuth 2.0 → Web application client
const GOOGLE_WEB_CLIENT_ID = '876055816203-g750d87b4hvscns3fc3uma503jun.apps.googleusercontent.com';

// Configure once at module load — before any component renders
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { lang } = useI18n();
  const db = useDatabase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const isES = lang === 'es';

  const handleGoogleSignIn = async () => {
    setLoginError('');
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) return; // user cancelled — no error

      const { user } = response.data;
      if (!user.email) return;

      let dbUser = await getUserByEmail(db, user.email);
      if (!dbUser) {
        dbUser = await createUser(db, {
          name: user.name || '',
          email: user.email,
          password: `google_${user.id}`,
          gender: 'male',
        });
      }

      await AsyncStorage.setItem('user_session', JSON.stringify({
        userId: dbUser.id, email: dbUser.email, loggedIn: true,
      }));
      await AsyncStorage.setItem('onboarding_complete', 'true');
      await AsyncStorage.setItem('active_user_id', dbUser.id.toString());

      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setLoginError(isES ? 'Google Play Services no disponible' : 'Google Play Services not available');
      } else if (
        error.code !== statusCodes.SIGN_IN_CANCELLED &&
        error.code !== statusCodes.IN_PROGRESS
      ) {
        setLoginError(isES ? 'Error con Google. Intenta de nuevo.' : 'Google sign-in failed. Try again.');
      }
    }
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      setLoginError(isES ? 'Ingresa tu email' : 'Enter your email');
      return;
    }
    if (!password.trim()) {
      setLoginError(isES ? 'Ingresa tu contrasena' : 'Enter your password');
      return;
    }

    const user = await loginUser(db, email.trim().toLowerCase(), password);
    if (!user) {
      setLoginError(isES ? 'Email o contrasena incorrectos' : 'Wrong email or password');
      return;
    }

    await AsyncStorage.setItem('user_session', JSON.stringify({
      userId: user.id, email: user.email, loggedIn: true,
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
            <Text style={[styles.logoText, { color: colors.accent }]}>BodySync</Text>
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
                placeholder="Email"
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
              <Pressable
                style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={handleGoogleSignIn}
              >
                <Ionicons name="logo-google" size={22} color="#DB4437" />
                <Text style={[styles.socialText, { color: colors.textPrimary }]}>Google</Text>
              </Pressable>
              <Pressable
                style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setLoginError(isES ? 'Proximamente' : 'Coming soon')}
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

  signupSection: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signupText: { ...Typography.body },
  signupLink: { ...Typography.body, fontWeight: '700' },
});
