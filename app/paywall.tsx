import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { useSubscription, type PlanTier } from '@/contexts/SubscriptionContext';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

interface PlanConfig {
  tier: PlanTier;
  name: string;
  price: { en: string; es: string };
  period: { en: string; es: string };
  features: { en: string; es: string }[];
  highlighted: boolean;
}

const PLANS: PlanConfig[] = [
  {
    tier: 'free',
    name: 'Free',
    price: { en: '$0', es: '$0' },
    period: { en: 'forever', es: 'para siempre' },
    highlighted: false,
    features: [
      { en: '3 muscle measurements', es: '3 medidas de musculos' },
      { en: 'Basic body model', es: 'Modelo corporal basico' },
      { en: '1 workout routine', es: '1 rutina de entrenamiento' },
      { en: 'Daily motivational quotes', es: 'Frases motivacionales diarias' },
    ],
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: { en: '$4.99', es: '$4.99' },
    period: { en: '/month', es: '/mes' },
    highlighted: true,
    features: [
      { en: 'ALL muscle measurements', es: 'TODAS las medidas de musculos' },
      { en: 'Dynamic body model', es: 'Modelo corporal dinamico' },
      { en: 'Advanced progress charts', es: 'Graficas de progreso avanzadas' },
      { en: 'All workout routines', es: 'Todas las rutinas' },
      { en: 'Full exercise library', es: 'Libreria completa de ejercicios' },
      { en: 'Export data (CSV/PDF)', es: 'Exportar datos (CSV/PDF)' },
      { en: 'Workout history', es: 'Historial de entrenamientos' },
      { en: 'Body comparison over time', es: 'Comparacion corporal en el tiempo' },
    ],
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: { en: '$29.99', es: '$29.99' },
    period: { en: '/year', es: '/ano' },
    highlighted: false,
    features: [
      { en: 'Everything in Pro', es: 'Todo en Pro' },
      { en: 'AI Coach (personalized)', es: 'Coach IA (personalizado)' },
      { en: 'Nutrition tracking', es: 'Seguimiento de nutricion' },
      { en: 'Custom routine builder', es: 'Constructor de rutinas' },
      { en: 'Priority support', es: 'Soporte prioritario' },
    ],
  },
];

export default function PaywallScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { lang } = useI18n();
  const { tier: currentTier, upgradeTo } = useSubscription();

  const handleSelect = (tier: PlanTier) => {
    // In production: trigger RevenueCat purchase flow
    // For demo: simulate upgrade
    upgradeTo(tier);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </Pressable>
        </View>

        <Text style={[styles.title, { color: colors.accent }]}>
          {lang === 'es' ? 'Desbloquea Tu Potencial' : 'Unlock Your Potential'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {lang === 'es'
            ? 'Elige el plan que se ajuste a tu camino fitness'
            : 'Choose the plan that fits your fitness journey'}
        </Text>

        {/* Plans */}
        {PLANS.map((plan) => {
          const isCurrentPlan = currentTier === plan.tier;
          const isHighlighted = plan.highlighted;

          return (
            <Pressable
              key={plan.tier}
              onPress={() => handleSelect(plan.tier)}
              style={[
                styles.planCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isHighlighted ? colors.accent : colors.border,
                  borderWidth: isHighlighted ? 2 : 1,
                },
              ]}
            >
              {isHighlighted && (
                <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.popularText}>
                    {lang === 'es' ? 'MAS POPULAR' : 'MOST POPULAR'}
                  </Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <Text style={[styles.planName, { color: colors.textPrimary }]}>{plan.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.planPrice, { color: colors.accent }]}>{plan.price[lang]}</Text>
                  <Text style={[styles.planPeriod, { color: colors.textMuted }]}>{plan.period[lang]}</Text>
                </View>
              </View>

              <View style={styles.featuresList}>
                {plan.features.map((feat, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                    <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                      {feat[lang]}
                    </Text>
                  </View>
                ))}
              </View>

              {isCurrentPlan ? (
                <View style={[styles.currentBadge, { borderColor: colors.accent }]}>
                  <Text style={[styles.currentText, { color: colors.accent }]}>
                    {lang === 'es' ? 'Plan Actual' : 'Current Plan'}
                  </Text>
                </View>
              ) : (
                <Pressable onPress={() => handleSelect(plan.tier)}>
                  <LinearGradient
                    colors={isHighlighted
                      ? [colors.gradientPrimary[0], colors.gradientPrimary[1]] as [string, string]
                      : [colors.surfaceLight, colors.surfaceLight] as [string, string]}
                    style={styles.selectBtn}
                  >
                    <Text style={[styles.selectBtnText, {
                      color: isHighlighted ? '#0D0D0D' : colors.textPrimary,
                    }]}>
                      {lang === 'es' ? 'Seleccionar' : 'Select'}
                    </Text>
                  </LinearGradient>
                </Pressable>
              )}
            </Pressable>
          );
        })}

        <Text style={[styles.legal, { color: colors.textMuted }]}>
          {lang === 'es'
            ? 'Los pagos se procesan a traves de App Store / Google Play. Puedes cancelar en cualquier momento.'
            : 'Payments are processed through App Store / Google Play. You can cancel anytime.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Layout.screenPadding, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: Layout.spacing.md },
  closeBtn: { padding: 4 },
  title: { ...Typography.h1, textAlign: 'center', marginBottom: Layout.spacing.xs },
  subtitle: { ...Typography.body, textAlign: 'center', marginBottom: Layout.spacing.xl },

  planCard: {
    borderRadius: 16, padding: Layout.cardPadding, marginBottom: Layout.spacing.md,
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute', top: 0, right: 0,
    paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 12,
  },
  popularText: { fontSize: 10, fontWeight: '800', color: '#0D0D0D', letterSpacing: 1 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  planName: { ...Typography.h2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  planPrice: { ...Typography.h2, fontWeight: '800' },
  planPeriod: { ...Typography.caption },
  featuresList: { gap: 8, marginBottom: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { ...Typography.bodySmall },
  selectBtn: { alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  selectBtnText: { ...Typography.body, fontWeight: '700' },
  currentBadge: {
    alignItems: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1,
  },
  currentText: { ...Typography.body, fontWeight: '600' },
  legal: { ...Typography.caption, textAlign: 'center', marginTop: Layout.spacing.md, lineHeight: 18 },
});
