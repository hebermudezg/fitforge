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
  trapezius:  { male: [38, 42, 52], female: [32, 36, 42] },
  deltoids:   { male: [40, 45, 55], female: [34, 38, 46] },
  chest:      { male: [88, 100, 120], female: [80, 90, 100] },
  biceps:     { male: [28, 34, 44], female: [22, 27, 34] },
  triceps:    { male: [26, 32, 42], female: [20, 25, 32] },
  forearms:   { male: [24, 29, 36], female: [19, 23, 28] },
  abs:        { male: [78, 84, 92], female: [64, 72, 80] },
  obliques:   { male: [75, 82, 90], female: [62, 70, 78] },
  upperBack:  { male: [38, 44, 52], female: [32, 38, 44] },
  lowerBack:  { male: [32, 36, 42], female: [28, 32, 36] },
  gluteal:    { male: [88, 96, 108], female: [88, 98, 112] },
  quadriceps: { male: [48, 56, 68], female: [44, 52, 62] },
  hamstring:  { male: [44, 52, 62], female: [40, 48, 58] },
  adductors:  { male: [44, 52, 60], female: [42, 50, 58] },
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
