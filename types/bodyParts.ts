// Muscles that map to body model SVG regions (interactive)
export const MUSCLE_PARTS = {
  // Upper body - Front
  neck: { label: 'Neck', unit: 'cm', category: 'upper', side: 'front' },
  trapezius: { label: 'Trapezius', unit: 'cm', category: 'upper', side: 'both' },
  deltoids: { label: 'Deltoids', unit: 'cm', category: 'upper', side: 'both' },
  chest: { label: 'Chest', unit: 'cm', category: 'upper', side: 'front' },
  biceps: { label: 'Biceps', unit: 'cm', category: 'upper', side: 'front' },
  triceps: { label: 'Triceps', unit: 'cm', category: 'upper', side: 'back' },
  forearms: { label: 'Forearms', unit: 'cm', category: 'upper', side: 'both' },

  // Core
  abs: { label: 'Abs (Six Pack)', unit: 'cm', category: 'core', side: 'front' },
  obliques: { label: 'Obliques', unit: 'cm', category: 'core', side: 'front' },
  upperBack: { label: 'Upper Back', unit: 'cm', category: 'core', side: 'back' },
  lowerBack: { label: 'Lower Back', unit: 'cm', category: 'core', side: 'back' },

  // Lower body
  gluteal: { label: 'Glutes', unit: 'cm', category: 'lower', side: 'back' },
  quadriceps: { label: 'Quadriceps', unit: 'cm', category: 'lower', side: 'front' },
  hamstring: { label: 'Hamstrings', unit: 'cm', category: 'lower', side: 'back' },
  adductors: { label: 'Adductors', unit: 'cm', category: 'lower', side: 'front' },
  calves: { label: 'Calves', unit: 'cm', category: 'lower', side: 'both' },
} as const;

// General metrics (NOT mapped to body model)
export const GENERAL_METRICS = {
  weight: { label: 'Weight', unit: 'kg', category: 'general' },
  bodyFat: { label: 'Body Fat', unit: '%', category: 'general' },
  waist: { label: 'Waist', unit: 'cm', category: 'general' },
  hips: { label: 'Hips', unit: 'cm', category: 'general' },
} as const;

// Combined for backward compatibility
export const BODY_PARTS = {
  ...MUSCLE_PARTS,
  ...GENERAL_METRICS,
} as const;

export type MuscleKey = keyof typeof MUSCLE_PARTS;
export type GeneralMetricKey = keyof typeof GENERAL_METRICS;
export type BodyPartKey = keyof typeof BODY_PARTS;

export const MUSCLE_KEYS = Object.keys(MUSCLE_PARTS) as MuscleKey[];
export const GENERAL_METRIC_KEYS = Object.keys(GENERAL_METRICS) as GeneralMetricKey[];
export const BODY_PART_KEYS = Object.keys(BODY_PARTS) as BodyPartKey[];

export type BodyPartCategory = 'upper' | 'core' | 'lower' | 'general';
