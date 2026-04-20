export interface Achievement {
  id: string;
  icon: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalMeasurements: number;
  musclesMeasured: number;
  streakDays: number;
  totalWorkouts: number;
  daysActive: number;
  weightChange: number; // negative = lost weight
  maxMuscleGrowth: number; // biggest cm gain in any muscle
}

export const ACHIEVEMENTS: Achievement[] = [
  // Measurement milestones
  {
    id: 'first_measure',
    icon: 'ribbon',
    name: { en: 'First Step', es: 'Primer Paso' },
    description: { en: 'Record your first measurement', es: 'Registra tu primera medida' },
    condition: (s) => s.totalMeasurements >= 1,
  },
  {
    id: 'measure_10',
    icon: 'medal',
    name: { en: 'Getting Serious', es: 'Poniendose Serio' },
    description: { en: 'Record 10 measurements', es: 'Registra 10 medidas' },
    condition: (s) => s.totalMeasurements >= 10,
  },
  {
    id: 'measure_50',
    icon: 'trophy',
    name: { en: 'Data Driven', es: 'Datos al Poder' },
    description: { en: 'Record 50 measurements', es: 'Registra 50 medidas' },
    condition: (s) => s.totalMeasurements >= 50,
  },
  {
    id: 'measure_100',
    icon: 'diamond',
    name: { en: 'Measurement Machine', es: 'Maquina de Medidas' },
    description: { en: 'Record 100 measurements', es: 'Registra 100 medidas' },
    condition: (s) => s.totalMeasurements >= 100,
  },

  // Body coverage
  {
    id: 'full_body',
    icon: 'body',
    name: { en: 'Full Body Scan', es: 'Escaneo Completo' },
    description: { en: 'Measure all 16 muscle groups', es: 'Mide los 16 grupos musculares' },
    condition: (s) => s.musclesMeasured >= 16,
  },
  {
    id: 'half_body',
    icon: 'fitness',
    name: { en: 'Half Way There', es: 'A Mitad de Camino' },
    description: { en: 'Measure 8 muscle groups', es: 'Mide 8 grupos musculares' },
    condition: (s) => s.musclesMeasured >= 8,
  },

  // Streaks
  {
    id: 'streak_3',
    icon: 'flame',
    name: { en: '3 Day Streak', es: 'Racha de 3 Dias' },
    description: { en: 'Measure 3 days in a row', es: 'Mide 3 dias seguidos' },
    condition: (s) => s.streakDays >= 3,
  },
  {
    id: 'streak_7',
    icon: 'flame',
    name: { en: 'Week Warrior', es: 'Guerrero Semanal' },
    description: { en: '7 day measurement streak', es: 'Racha de medidas de 7 dias' },
    condition: (s) => s.streakDays >= 7,
  },
  {
    id: 'streak_30',
    icon: 'flame',
    name: { en: 'Monthly Beast', es: 'Bestia Mensual' },
    description: { en: '30 day measurement streak', es: 'Racha de medidas de 30 dias' },
    condition: (s) => s.streakDays >= 30,
  },
  {
    id: 'streak_90',
    icon: 'flame',
    name: { en: 'Iron Discipline', es: 'Disciplina de Hierro' },
    description: { en: '90 day streak — unstoppable', es: 'Racha de 90 dias — imparable' },
    condition: (s) => s.streakDays >= 90,
  },

  // Workouts
  {
    id: 'first_workout',
    icon: 'barbell',
    name: { en: 'First Workout', es: 'Primer Entrenamiento' },
    description: { en: 'Complete your first workout', es: 'Completa tu primer entrenamiento' },
    condition: (s) => s.totalWorkouts >= 1,
  },
  {
    id: 'workout_5',
    icon: 'barbell',
    name: { en: '5 Workouts', es: '5 Entrenamientos' },
    description: { en: 'Complete 5 workouts', es: 'Completa 5 entrenamientos' },
    condition: (s) => s.totalWorkouts >= 5,
  },
  {
    id: 'workout_20',
    icon: 'barbell',
    name: { en: 'Gym Rat', es: 'Rata de Gym' },
    description: { en: 'Complete 20 workouts', es: 'Completa 20 entrenamientos' },
    condition: (s) => s.totalWorkouts >= 20,
  },
  {
    id: 'workout_50',
    icon: 'diamond',
    name: { en: 'Iron Addict', es: 'Adicto al Hierro' },
    description: { en: 'Complete 50 workouts', es: 'Completa 50 entrenamientos' },
    condition: (s) => s.totalWorkouts >= 50,
  },

  // Progress
  {
    id: 'muscle_growth',
    icon: 'trending-up',
    name: { en: 'Gains!', es: 'Ganancias!' },
    description: { en: 'Grow any muscle by 2+ cm', es: 'Crece cualquier musculo 2+ cm' },
    condition: (s) => s.maxMuscleGrowth >= 2,
  },
  {
    id: 'muscle_growth_5',
    icon: 'rocket',
    name: { en: 'Beast Mode', es: 'Modo Bestia' },
    description: { en: 'Grow any muscle by 5+ cm', es: 'Crece cualquier musculo 5+ cm' },
    condition: (s) => s.maxMuscleGrowth >= 5,
  },

  // Activity
  {
    id: 'active_7',
    icon: 'calendar',
    name: { en: 'First Week', es: 'Primera Semana' },
    description: { en: '7 days using FitForge', es: '7 dias usando FitForge' },
    condition: (s) => s.daysActive >= 7,
  },
  {
    id: 'active_30',
    icon: 'star',
    name: { en: 'One Month Strong', es: 'Un Mes Fuerte' },
    description: { en: '30 days using FitForge', es: '30 dias usando FitForge' },
    condition: (s) => s.daysActive >= 30,
  },
];

export function getUnlockedAchievements(stats: UserStats): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.condition(stats));
}

export function getNextAchievements(stats: UserStats, limit: number = 3): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !a.condition(stats)).slice(0, limit);
}
