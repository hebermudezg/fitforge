/**
 * Exercise GIF URLs — only verified working URLs
 * Last verified: 2026-04-20
 * Broken URLs removed to avoid empty spaces
 */

export const EXERCISE_GIFS: Record<string, string> = {
  // Chest (verified working)
  bench_press: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif',
  incline_db_press: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif',
  chest_fly: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif',
  pushups: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif',

  // Shoulders
  lateral_raise: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif',
  face_pull: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',

  // Back
  deadlift: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif',
  bent_row: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif',

  // Biceps
  barbell_curl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
  hammer_curl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',

  // Triceps
  tricep_pushdown: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif',

  // Legs
  squat: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif',
  rdl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Romanian-Deadlift.gif',
  calf_raise: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Calf-Raise.gif',
  step_up: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Step-up.gif',

  // Glutes
  hip_thrust: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Hip-Thrust.gif',
  cable_kickback: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Hip-Extension.gif',

  // Note: The following exercises don't have working GIF URLs yet:
  // ohp, pullups, skull_crusher, leg_press, lunges, glute_bridge,
  // sumo_deadlift, plank, cable_crunch, hanging_leg_raise
  // TODO: Host own GIFs or find alternative CDN
};

export function getExerciseGif(exerciseId: string): string | null {
  return EXERCISE_GIFS[exerciseId] || null;
}
