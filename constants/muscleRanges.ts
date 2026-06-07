import type { MuscleKey } from '@/types/bodyParts';

// Reference ranges for muscle measurements (cm)
// Used to calculate intensity for body model visualization
// Range: [low_untrained, average, high_trained]
interface MuscleRange {
  male: [number, number, number];
  female: [number, number, number];
}

export const MUSCLE_RANGES: Partial<Record<MuscleKey, MuscleRange>> = {
  neck:       { male: [35, 38, 45], female: [28, 32, 36] },
  deltoids:   { male: [40, 45, 55], female: [34, 38, 46] },
  chest:      { male: [88, 100, 120], female: [80, 90, 100] },
  biceps:     { male: [28, 34, 44], female: [22, 27, 34] },
  forearms:   { male: [24, 29, 36], female: [19, 23, 28] },
  gluteal:    { male: [88, 96, 108], female: [88, 98, 112] },
  quadriceps: { male: [48, 56, 68], female: [44, 52, 62] },
  calves:     { male: [34, 38, 46], female: [30, 34, 40] },
};

/**
 * Calculate intensity (0-3) for body model visualization
 * 0 = not measured, 1 = below average, 2 = average, 3 = above average/trained
 */
export function getMuscleIntensity(
  muscle: MuscleKey,
  value: number,
  gender: 'male' | 'female'
): number {
  const range = MUSCLE_RANGES[muscle];
  if (!range) return 1;

  const [low, avg, high] = range[gender];

  if (value <= low) return 1;
  if (value <= avg) return 1;
  if (value <= (avg + high) / 2) return 2;
  return 3;
}
