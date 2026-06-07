// All muscles map 1:1 to a body model SVG region (interactive + educational).
// `measurable: true`  → people realistically take this girth with a tape (entry enabled).
// `measurable: false` → shown for anatomy/education only; tapping shows info, no entry.
export const MUSCLE_PARTS = {
  // Upper body
  neck: { label: 'Neck', unit: 'cm', category: 'upper', side: 'front', measurable: true },
  trapezius: { label: 'Trapezius', unit: 'cm', category: 'upper', side: 'both', measurable: false },
  deltoids: { label: 'Shoulders', unit: 'cm', category: 'upper', side: 'both', measurable: true },
  chest: { label: 'Chest', unit: 'cm', category: 'upper', side: 'front', measurable: true },
  biceps: { label: 'Arm (Biceps)', unit: 'cm', category: 'upper', side: 'front', measurable: true },
  triceps: { label: 'Triceps', unit: 'cm', category: 'upper', side: 'back', measurable: false },
  forearms: { label: 'Forearm', unit: 'cm', category: 'upper', side: 'both', measurable: true },

  // Core (informational — measure Waist instead)
  abs: { label: 'Abs', unit: 'cm', category: 'core', side: 'front', measurable: false },
  obliques: { label: 'Obliques', unit: 'cm', category: 'core', side: 'front', measurable: false },
  upperBack: { label: 'Upper Back', unit: 'cm', category: 'core', side: 'back', measurable: false },
  lowerBack: { label: 'Lower Back', unit: 'cm', category: 'core', side: 'back', measurable: false },

  // Lower body
  gluteal: { label: 'Glutes', unit: 'cm', category: 'lower', side: 'back', measurable: true },
  quadriceps: { label: 'Thigh', unit: 'cm', category: 'lower', side: 'front', measurable: true },
  hamstring: { label: 'Hamstrings', unit: 'cm', category: 'lower', side: 'back', measurable: false },
  adductors: { label: 'Adductors', unit: 'cm', category: 'lower', side: 'front', measurable: false },
  calves: { label: 'Calf', unit: 'cm', category: 'lower', side: 'both', measurable: true },
} as const;

// General metrics (NOT mapped to body model) — all measurable
export const GENERAL_METRICS = {
  weight: { label: 'Weight', unit: 'kg', category: 'general', measurable: true },
  bodyFat: { label: 'Body Fat', unit: '%', category: 'general', measurable: true },
  waist: { label: 'Waist', unit: 'cm', category: 'general', measurable: true },
  hips: { label: 'Hips', unit: 'cm', category: 'general', measurable: true },
} as const;

/** True if this body part can be measured with a tape (vs. info-only). */
export function isMeasurable(key: BodyPartKey): boolean {
  return (BODY_PARTS[key] as { measurable?: boolean }).measurable !== false;
}

/** Muscle keys the user can actually measure. */
export const MEASURABLE_MUSCLE_KEYS = (Object.keys(MUSCLE_PARTS) as MuscleKey[])
  .filter((k) => MUSCLE_PARTS[k].measurable);
/** Muscle keys shown for education only. */
export const INFO_MUSCLE_KEYS = (Object.keys(MUSCLE_PARTS) as MuscleKey[])
  .filter((k) => !MUSCLE_PARTS[k].measurable);

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
