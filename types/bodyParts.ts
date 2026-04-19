export const BODY_PARTS = {
  neck: { label: 'Neck', unit: 'cm', category: 'upper' },
  shoulders: { label: 'Shoulders', unit: 'cm', category: 'upper' },
  chest: { label: 'Chest', unit: 'cm', category: 'upper' },
  biceps: { label: 'Biceps', unit: 'cm', category: 'upper' },
  forearms: { label: 'Forearms', unit: 'cm', category: 'upper' },
  waist: { label: 'Waist', unit: 'cm', category: 'core' },
  hips: { label: 'Hips', unit: 'cm', category: 'core' },
  thighs: { label: 'Thighs', unit: 'cm', category: 'lower' },
  calves: { label: 'Calves', unit: 'cm', category: 'lower' },
  weight: { label: 'Weight', unit: 'kg', category: 'general' },
  bodyFat: { label: 'Body Fat', unit: '%', category: 'general' },
} as const;

export type BodyPartKey = keyof typeof BODY_PARTS;

export const BODY_PART_KEYS = Object.keys(BODY_PARTS) as BodyPartKey[];

export type BodyPartCategory = 'upper' | 'core' | 'lower' | 'general';
