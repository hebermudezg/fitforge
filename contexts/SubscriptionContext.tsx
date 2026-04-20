import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PlanTier = 'free' | 'pro' | 'premium';

interface SubscriptionContextType {
  tier: PlanTier;
  isPro: boolean;
  isPremium: boolean;
  canAccess: (feature: FeatureKey) => boolean;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  // For demo: simulate upgrade
  upgradeTo: (tier: PlanTier) => void;
}

// Features gated by tier
export type FeatureKey =
  | 'unlimited_measurements'  // Free: 3 muscles, Pro: all
  | 'progress_charts'         // Free: basic, Pro: advanced
  | 'export_data'             // Pro+
  | 'custom_routines'         // Pro+
  | 'all_exercises'           // Free: 5, Pro: all
  | 'ai_coach'                // Premium only
  | 'nutrition_tracking'      // Premium only
  | 'body_comparison'         // Pro+
  | 'workout_history';        // Pro+

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
const SUB_KEY = 'fitforge_subscription';

const SubscriptionContext = createContext<SubscriptionContextType>({
  tier: 'free',
  isPro: false,
  isPremium: false,
  canAccess: () => false,
  showPaywall: false,
  setShowPaywall: () => {},
  upgradeTo: () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<PlanTier>('free');
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SUB_KEY).then((saved) => {
      if (saved === 'pro' || saved === 'premium') setTier(saved);
    });
  }, []);

  const isPro = TIER_LEVELS[tier] >= TIER_LEVELS.pro;
  const isPremium = tier === 'premium';

  const canAccess = useCallback((feature: FeatureKey) => {
    const required = FEATURE_TIERS[feature];
    return TIER_LEVELS[tier] >= TIER_LEVELS[required];
  }, [tier]);

  const upgradeTo = useCallback((newTier: PlanTier) => {
    setTier(newTier);
    AsyncStorage.setItem(SUB_KEY, newTier);
    setShowPaywall(false);
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      tier, isPro, isPremium, canAccess, showPaywall, setShowPaywall, upgradeTo,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
