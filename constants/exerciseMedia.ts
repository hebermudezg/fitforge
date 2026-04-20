/**
 * Exercise media — GIF URLs from free open-source sources
 * Source: ExerciseDB (exercisedb.io) — free public assets
 *
 * These are direct URLs to exercise demonstration GIFs.
 * In production, these should be cached/hosted on your own CDN.
 */

// Base URL for ExerciseDB GIFs (public CDN)
const EXERCISEDB_BASE = 'https://v2.exercisedb.io/image';

// Mapping of our exercise IDs to known ExerciseDB GIF URLs
// Using the public bodypart-based URL pattern
export const EXERCISE_GIFS: Record<string, string> = {
  // Chest
  bench_press: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif',
  incline_db_press: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif',
  chest_fly: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif',
  pushups: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif',

  // Shoulders
  ohp: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Overhead-Press.gif',
  lateral_raise: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif',
  face_pull: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',

  // Back
  deadlift: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif',
  pullups: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-Up.gif',
  bent_row: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif',

  // Biceps
  barbell_curl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
  hammer_curl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',

  // Triceps
  tricep_pushdown: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif',
  skull_crusher: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Triceps-Extension.gif',

  // Legs
  squat: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif',
  leg_press: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif',
  lunges: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunges.gif',
  rdl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Romanian-Deadlift.gif',
  calf_raise: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Calf-Raise.gif',

  // Glutes (female priority)
  hip_thrust: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Hip-Thrust.gif',
  glute_bridge: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge.gif',
  sumo_deadlift: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Sumo-Deadlift.gif',
  cable_kickback: 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Cable-Glute-Kickback.gif',
  step_up: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Step-Up.gif',

  // Core
  plank: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Front-Plank.gif',
  cable_crunch: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crunch.gif',
  hanging_leg_raise: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Leg-Raise.gif',
};

export function getExerciseGif(exerciseId: string): string | null {
  return EXERCISE_GIFS[exerciseId] || null;
}
