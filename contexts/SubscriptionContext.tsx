import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

export type PlanTier = 'free' | 'pro' | 'premium';

interface SubscriptionContextType {
  tier: PlanTier;
  isPro: boolean;
  isPremium: boolean;
  canAccess: (feature: FeatureKey) => boolean;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  packages: PurchasesPackage[];
  restore: () => Promise<void>;
}

export type FeatureKey =
  | 'unlimited_measurements'
  | 'progress_charts'
  | 'export_data'
  | 'custom_routines'
  | 'all_exercises'
  | 'ai_coach'
  | 'nutrition_tracking'
  | 'body_comparison'
  | 'workout_history';

const FEATURE_TIERS: Record<FeatureKey, PlanTier> = {
  unlimited_measurements: 'pro',
  progress_charts: 'pro',
  export_data: 'pro',
  custom_routines: 'pro',
  all_exercises: 'pro',
  ai_coach: 'premium',
  nutrition_tracking: 'premium',
  body_comparison: 'pro',
  workout_history: 'pro',
};

const TIER_LEVELS: Record<PlanTier, number> = { free: 0, pro: 1, premium: 2 };

// TODO: Replace with your RevenueCat API keys from https://app.revenuecat.com
const RC_API_KEY_APPLE = 'appl_YOUR_REVENUECAT_APPLE_KEY';
const RC_API_KEY_GOOGLE = 'goog_YOUR_REVENUECAT_GOOGLE_KEY';

// RevenueCat entitlement IDs (configure these in RevenueCat dashboard)
const ENTITLEMENT_PRO = 'pro';
const ENTITLEMENT_PREMIUM = 'premium';

function tierFromCustomerInfo(info: CustomerInfo): PlanTier {
  if (info.entitlements.active[ENTITLEMENT_PREMIUM]) return 'premium';
  if (info.entitlements.active[ENTITLEMENT_PRO]) return 'pro';
  return 'free';
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  tier: 'free',
  isPro: false,
  isPremium: false,
  canAccess: () => false,
  showPaywall: false,
  setShowPaywall: () => {},
  purchase: async () => false,
  packages: [],
  restore: async () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<PlanTier>('free');
  const [showPaywall, setShowPaywall] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const apiKey = Platform.OS === 'ios' ? RC_API_KEY_APPLE : RC_API_KEY_GOOGLE;

    // Only configure if real keys are set
    if (apiKey.includes('YOUR_REVENUECAT')) return;

    Purchases.configure({ apiKey });

    // Get current subscription status
    Purchases.getCustomerInfo().then((info) => {
      setTier(tierFromCustomerInfo(info));
    });

    // Load available packages
    Purchases.getOfferings().then((offerings) => {
      if (offerings.current) {
        setPackages(offerings.current.availablePackages);
      }
    });

    // Listen for subscription changes
    Purchases.addCustomerInfoUpdateListener((info) => {
      setTier(tierFromCustomerInfo(info));
    });
  }, []);

  const isPro = TIER_LEVELS[tier] >= TIER_LEVELS.pro;
  const isPremium = tier === 'premium';

  const canAccess = useCallback((feature: FeatureKey) => {
    const required = FEATURE_TIERS[feature];
    return TIER_LEVELS[tier] >= TIER_LEVELS[required];
  }, [tier]);

  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      setTier(tierFromCustomerInfo(customerInfo));
      setShowPaywall(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  const restore = useCallback(async () => {
    try {
      const info = await Purchases.restorePurchases();
      setTier(tierFromCustomerInfo(info));
    } catch {}
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      tier, isPro, isPremium, canAccess, showPaywall, setShowPaywall,
      purchase, packages, restore,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
