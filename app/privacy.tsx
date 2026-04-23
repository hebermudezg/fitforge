import React from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { lang } = useI18n();
  const isES = lang === 'es';

  const sections = isES ? [
    {
      title: 'Datos que Recopilamos',
      body: 'BodySync almacena toda tu informacion localmente en tu dispositivo. No enviamos tus datos personales, medidas corporales ni informacion de entrenamiento a ningun servidor externo. Los unicos datos que se comparten son con Apple/Google para procesar pagos de suscripcion.',
    },
    {
      title: 'Informacion de la Cuenta',
      body: 'Al crear una cuenta, recopilamos tu nombre, email y contrasena. Esta informacion se almacena localmente en tu dispositivo y se utiliza unicamente para la autenticacion dentro de la aplicacion.',
    },
    {
      title: 'Datos de Salud y Fitness',
      body: 'Las medidas corporales, historial de entrenamientos, metas y fotos de progreso se almacenan exclusivamente en tu dispositivo. No tenemos acceso a estos datos.',
    },
    {
      title: 'Compras y Suscripciones',
      body: 'Los pagos se procesan a traves de Apple App Store o Google Play Store. No almacenamos informacion de tarjetas de credito ni datos bancarios. RevenueCat, nuestro proveedor de suscripciones, puede recibir un identificador anonimo para gestionar tu suscripcion.',
    },
    {
      title: 'Notificaciones',
      body: 'Si aceptas recibir notificaciones, se programan recordatorios locales de entrenamiento y medicion. No utilizamos notificaciones push remotas ni rastreamos tu actividad.',
    },
    {
      title: 'Tus Derechos',
      body: 'Puedes eliminar tu cuenta y todos tus datos en cualquier momento desinstalando la aplicacion. Como los datos se almacenan localmente, la desinstalacion elimina permanentemente toda tu informacion.',
    },
    {
      title: 'Contacto',
      body: 'Para preguntas sobre privacidad, contactanos en: hebermudezg@gmail.com',
    },
  ] : [
    {
      title: 'Data We Collect',
      body: 'BodySync stores all your information locally on your device. We do not send your personal data, body measurements, or workout information to any external server. The only data shared externally is with Apple/Google for processing subscription payments.',
    },
    {
      title: 'Account Information',
      body: 'When creating an account, we collect your name, email, and password. This information is stored locally on your device and used solely for authentication within the app.',
    },
    {
      title: 'Health & Fitness Data',
      body: 'Body measurements, workout history, goals, and progress photos are stored exclusively on your device. We have no access to this data.',
    },
    {
      title: 'Purchases & Subscriptions',
      body: 'Payments are processed through Apple App Store or Google Play Store. We do not store credit card or banking information. RevenueCat, our subscription provider, may receive an anonymous identifier to manage your subscription.',
    },
    {
      title: 'Notifications',
      body: 'If you accept notifications, local workout and measurement reminders are scheduled. We do not use remote push notifications or track your activity.',
    },
    {
      title: 'Your Rights',
      body: 'You can delete your account and all data at any time by uninstalling the app. Since data is stored locally, uninstalling permanently removes all your information.',
    },
    {
      title: 'Contact',
      body: 'For privacy questions, contact us at: hebermudezg@gmail.com',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {isES ? 'Politica de Privacidad' : 'Privacy Policy'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.updated, { color: colors.textMuted }]}>
          {isES ? 'Ultima actualizacion: Abril 2026' : 'Last updated: April 2026'}
        </Text>

        {sections.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accent }]}>{section.title}</Text>
            <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: Layout.screenPadding, paddingBottom: 8,
  },
  backBtn: { padding: 4 },
  title: { ...Typography.h2 },
  content: { padding: Layout.screenPadding, paddingBottom: 40 },
  updated: { ...Typography.caption, marginBottom: Layout.spacing.lg },
  section: { marginBottom: Layout.spacing.lg },
  sectionTitle: { ...Typography.h3, marginBottom: Layout.spacing.xs },
  sectionBody: { ...Typography.body, lineHeight: 22 },
});
