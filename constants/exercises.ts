export interface Exercise {
  id: string;
  name: { en: string; es: string };
  muscleGroup: string;
  muscles: string[];
  sets: number;
  reps: string;
  restSec: number;
  description: { en: string; es: string };
  tips: { en: string; es: string };
}

export interface WorkoutDay {
  dayKey: string;
  label: { en: string; es: string };
  muscleGroup: string;
  icon: string;
  exercises: Exercise[];
}

const EXERCISES: Record<string, Exercise[]> = {
  chest: [
    {
      id: 'bench_press', muscleGroup: 'chest', muscles: ['chest', 'triceps', 'deltoids'],
      name: { en: 'Bench Press', es: 'Press de Banca' },
      sets: 4, reps: '8-12', restSec: 90,
      description: { en: 'Lie on a bench, lower the bar to your chest, press up.', es: 'Acuestate en un banco, baja la barra al pecho, empuja hacia arriba.' },
      tips: { en: 'Keep feet flat on floor, retract shoulder blades.', es: 'Manten los pies en el suelo, retrae las escapulas.' },
    },
    {
      id: 'incline_db_press', muscleGroup: 'chest', muscles: ['chest', 'deltoids'],
      name: { en: 'Incline Dumbbell Press', es: 'Press Inclinado con Mancuernas' },
      sets: 3, reps: '10-12', restSec: 75,
      description: { en: 'On an incline bench (30-45°), press dumbbells up from chest level.', es: 'En banco inclinado (30-45°), empuja las mancuernas desde el pecho.' },
      tips: { en: 'Control the descent, squeeze at the top.', es: 'Controla el descenso, aprieta arriba.' },
    },
    {
      id: 'chest_fly', muscleGroup: 'chest', muscles: ['chest'],
      name: { en: 'Cable Chest Fly', es: 'Aperturas en Polea' },
      sets: 3, reps: '12-15', restSec: 60,
      description: { en: 'Stand between cables, bring hands together in front of chest.', es: 'De pie entre poleas, junta las manos frente al pecho.' },
      tips: { en: 'Slight bend in elbows, feel the stretch.', es: 'Leve flexion de codos, siente el estiramiento.' },
    },
    {
      id: 'pushups', muscleGroup: 'chest', muscles: ['chest', 'triceps', 'deltoids'],
      name: { en: 'Push-Ups', es: 'Flexiones de Pecho' },
      sets: 3, reps: '15-20', restSec: 60,
      description: { en: 'Hands shoulder-width, lower body to floor, push up.', es: 'Manos al ancho de hombros, baja el cuerpo al suelo, empuja.' },
      tips: { en: 'Keep core tight, full range of motion.', es: 'Manten el core apretado, rango completo.' },
    },
  ],
  shoulders: [
    {
      id: 'ohp', muscleGroup: 'shoulders', muscles: ['deltoids', 'triceps'],
      name: { en: 'Overhead Press', es: 'Press Militar' },
      sets: 4, reps: '8-10', restSec: 90,
      description: { en: 'Press barbell overhead from shoulder level.', es: 'Empuja la barra sobre la cabeza desde los hombros.' },
      tips: { en: 'Brace your core, dont arch your back.', es: 'Aprieta el core, no arquees la espalda.' },
    },
    {
      id: 'lateral_raise', muscleGroup: 'shoulders', muscles: ['deltoids'],
      name: { en: 'Lateral Raises', es: 'Elevaciones Laterales' },
      sets: 3, reps: '12-15', restSec: 60,
      description: { en: 'Raise dumbbells to sides until arms are parallel to floor.', es: 'Levanta mancuernas a los lados hasta quedar paralelo al suelo.' },
      tips: { en: 'Lead with elbows, control the weight.', es: 'Guia con los codos, controla el peso.' },
    },
    {
      id: 'face_pull', muscleGroup: 'shoulders', muscles: ['deltoids', 'trapezius'],
      name: { en: 'Face Pulls', es: 'Jalon a la Cara' },
      sets: 3, reps: '15-20', restSec: 60,
      description: { en: 'Pull cable rope towards face at eye level.', es: 'Jala la cuerda hacia la cara a nivel de los ojos.' },
      tips: { en: 'Squeeze shoulder blades together.', es: 'Aprieta las escapulas juntas.' },
    },
  ],
  back: [
    {
      id: 'deadlift', muscleGroup: 'back', muscles: ['lower-back', 'hamstring', 'gluteal', 'trapezius'],
      name: { en: 'Deadlift', es: 'Peso Muerto' },
      sets: 4, reps: '6-8', restSec: 120,
      description: { en: 'Lift barbell from floor by extending hips and knees.', es: 'Levanta la barra del suelo extendiendo caderas y rodillas.' },
      tips: { en: 'Keep back straight, drive through heels.', es: 'Manten la espalda recta, empuja con los talones.' },
    },
    {
      id: 'pullups', muscleGroup: 'back', muscles: ['upper-back', 'biceps'],
      name: { en: 'Pull-Ups', es: 'Dominadas' },
      sets: 4, reps: '6-10', restSec: 90,
      description: { en: 'Hang from bar, pull yourself up until chin over bar.', es: 'Cuelgate de la barra, sube hasta que la barbilla pase la barra.' },
      tips: { en: 'Full range of motion, avoid swinging.', es: 'Rango completo, evita balancearte.' },
    },
    {
      id: 'bent_row', muscleGroup: 'back', muscles: ['upper-back', 'biceps'],
      name: { en: 'Bent-Over Row', es: 'Remo con Barra' },
      sets: 4, reps: '8-12', restSec: 90,
      description: { en: 'Bend at hips, row barbell to lower chest.', es: 'Inclinate en las caderas, rema la barra al pecho bajo.' },
      tips: { en: 'Keep back flat, squeeze at the top.', es: 'Espalda plana, aprieta arriba.' },
    },
  ],
  biceps: [
    {
      id: 'barbell_curl', muscleGroup: 'biceps', muscles: ['biceps'],
      name: { en: 'Barbell Curl', es: 'Curl con Barra' },
      sets: 3, reps: '10-12', restSec: 60,
      description: { en: 'Curl barbell up while keeping elbows fixed.', es: 'Sube la barra manteniendo los codos fijos.' },
      tips: { en: 'Dont swing, control the negative.', es: 'No balancees, controla la bajada.' },
    },
    {
      id: 'hammer_curl', muscleGroup: 'biceps', muscles: ['biceps', 'forearm'],
      name: { en: 'Hammer Curls', es: 'Curl Martillo' },
      sets: 3, reps: '10-12', restSec: 60,
      description: { en: 'Curl dumbbells with neutral grip (palms facing each other).', es: 'Sube mancuernas con agarre neutro (palmas enfrentadas).' },
      tips: { en: 'Works both biceps and forearms.', es: 'Trabaja biceps y antebrazos.' },
    },
  ],
  triceps: [
    {
      id: 'tricep_pushdown', muscleGroup: 'triceps', muscles: ['triceps'],
      name: { en: 'Tricep Pushdown', es: 'Extension de Triceps en Polea' },
      sets: 3, reps: '12-15', restSec: 60,
      description: { en: 'Push cable bar down by extending elbows.', es: 'Empuja la barra hacia abajo extendiendo los codos.' },
      tips: { en: 'Keep elbows close to body.', es: 'Manten los codos cerca del cuerpo.' },
    },
    {
      id: 'skull_crusher', muscleGroup: 'triceps', muscles: ['triceps'],
      name: { en: 'Skull Crushers', es: 'Rompecraneos' },
      sets: 3, reps: '10-12', restSec: 75,
      description: { en: 'Lower barbell to forehead, then extend arms.', es: 'Baja la barra a la frente, luego extiende los brazos.' },
      tips: { en: 'Only forearms move, upper arms stay fixed.', es: 'Solo los antebrazos se mueven.' },
    },
  ],
  legs: [
    {
      id: 'squat', muscleGroup: 'legs', muscles: ['quadriceps', 'gluteal', 'hamstring'],
      name: { en: 'Barbell Squat', es: 'Sentadilla con Barra' },
      sets: 4, reps: '8-10', restSec: 120,
      description: { en: 'Bar on upper back, squat down until thighs parallel, stand up.', es: 'Barra en la espalda alta, baja hasta muslos paralelos, sube.' },
      tips: { en: 'Knees track over toes, chest up.', es: 'Rodillas siguen los pies, pecho arriba.' },
    },
    {
      id: 'leg_press', muscleGroup: 'legs', muscles: ['quadriceps', 'gluteal'],
      name: { en: 'Leg Press', es: 'Prensa de Pierna' },
      sets: 4, reps: '10-12', restSec: 90,
      description: { en: 'Push platform away by extending knees and hips.', es: 'Empuja la plataforma extendiendo rodillas y caderas.' },
      tips: { en: 'Dont lock knees at top, full range.', es: 'No bloquees rodillas arriba, rango completo.' },
    },
    {
      id: 'lunges', muscleGroup: 'legs', muscles: ['quadriceps', 'gluteal', 'hamstring'],
      name: { en: 'Walking Lunges', es: 'Zancadas Caminando' },
      sets: 3, reps: '12 each leg', restSec: 75,
      description: { en: 'Step forward, lower back knee to floor, push off.', es: 'Paso al frente, baja la rodilla trasera al suelo, empuja.' },
      tips: { en: 'Keep torso upright, long steps.', es: 'Torso recto, pasos largos.' },
    },
    {
      id: 'rdl', muscleGroup: 'legs', muscles: ['hamstring', 'gluteal', 'lower-back'],
      name: { en: 'Romanian Deadlift', es: 'Peso Muerto Rumano' },
      sets: 3, reps: '10-12', restSec: 90,
      description: { en: 'Hinge at hips, lower bar along legs, feel hamstring stretch.', es: 'Bisagra en caderas, baja la barra por las piernas, siente el estiramiento.' },
      tips: { en: 'Soft knees, push hips back.', es: 'Rodillas suaves, empuja caderas atras.' },
    },
    {
      id: 'calf_raise', muscleGroup: 'legs', muscles: ['calves'],
      name: { en: 'Calf Raises', es: 'Elevaciones de Pantorrilla' },
      sets: 4, reps: '15-20', restSec: 45,
      description: { en: 'Rise up on toes, pause at top, lower slowly.', es: 'Sube en puntas, pausa arriba, baja lentamente.' },
      tips: { en: 'Full range — stretch at bottom, squeeze at top.', es: 'Rango completo — estira abajo, aprieta arriba.' },
    },
  ],
  core: [
    {
      id: 'plank', muscleGroup: 'core', muscles: ['abs', 'obliques'],
      name: { en: 'Plank', es: 'Plancha' },
      sets: 3, reps: '45-60 sec', restSec: 45,
      description: { en: 'Hold push-up position on forearms, body straight.', es: 'Manten posicion de flexion en antebrazos, cuerpo recto.' },
      tips: { en: 'Dont let hips sag or pike up.', es: 'No dejes caer ni subir las caderas.' },
    },
    {
      id: 'cable_crunch', muscleGroup: 'core', muscles: ['abs'],
      name: { en: 'Cable Crunches', es: 'Crunch en Polea' },
      sets: 3, reps: '15-20', restSec: 45,
      description: { en: 'Kneel before cable, crunch down bringing elbows to knees.', es: 'Arrodillate frente a la polea, baja los codos a las rodillas.' },
      tips: { en: 'Round your spine, dont just bend at hips.', es: 'Redondea la columna, no solo dobles caderas.' },
    },
    {
      id: 'hanging_leg_raise', muscleGroup: 'core', muscles: ['abs', 'obliques'],
      name: { en: 'Hanging Leg Raises', es: 'Elevaciones de Piernas Colgando' },
      sets: 3, reps: '10-15', restSec: 60,
      description: { en: 'Hang from bar, raise legs to 90 degrees.', es: 'Cuelgate de la barra, sube las piernas a 90 grados.' },
      tips: { en: 'Control the movement, dont swing.', es: 'Controla el movimiento, no te balancees.' },
    },
  ],
};

// Weekly workout plan (Push/Pull/Legs split)
export const WEEKLY_PLAN: WorkoutDay[] = [
  {
    dayKey: 'monday',
    label: { en: 'Push Day', es: 'Dia de Empuje' },
    muscleGroup: 'push',
    icon: 'barbell-outline',
    exercises: [...EXERCISES.chest, ...EXERCISES.shoulders, ...EXERCISES.triceps.slice(0, 1)],
  },
  {
    dayKey: 'tuesday',
    label: { en: 'Pull Day', es: 'Dia de Jalon' },
    muscleGroup: 'pull',
    icon: 'fitness-outline',
    exercises: [...EXERCISES.back, ...EXERCISES.biceps],
  },
  {
    dayKey: 'wednesday',
    label: { en: 'Leg Day', es: 'Dia de Piernas' },
    muscleGroup: 'legs',
    icon: 'walk-outline',
    exercises: [...EXERCISES.legs],
  },
  {
    dayKey: 'thursday',
    label: { en: 'Push Day', es: 'Dia de Empuje' },
    muscleGroup: 'push',
    icon: 'barbell-outline',
    exercises: [...EXERCISES.chest.slice(0, 2), ...EXERCISES.shoulders, ...EXERCISES.triceps],
  },
  {
    dayKey: 'friday',
    label: { en: 'Pull Day', es: 'Dia de Jalon' },
    muscleGroup: 'pull',
    icon: 'fitness-outline',
    exercises: [...EXERCISES.back, ...EXERCISES.biceps],
  },
  {
    dayKey: 'saturday',
    label: { en: 'Legs + Core', es: 'Piernas + Core' },
    muscleGroup: 'legs',
    icon: 'body-outline',
    exercises: [...EXERCISES.legs.slice(0, 3), ...EXERCISES.core],
  },
  {
    dayKey: 'sunday',
    label: { en: 'Rest Day', es: 'Dia de Descanso' },
    muscleGroup: 'rest',
    icon: 'bed-outline',
    exercises: [],
  },
];

// Lose Fat routine — Full body + cardio
const LOSE_FAT_PLAN: WorkoutDay[] = [
  { dayKey: 'monday', label: { en: 'Full Body A', es: 'Cuerpo Completo A' }, muscleGroup: 'fullBody', icon: 'body-outline',
    exercises: [EXERCISES.legs[0], EXERCISES.chest[0], EXERCISES.back[1], EXERCISES.shoulders[1], EXERCISES.core[0]] },
  { dayKey: 'tuesday', label: { en: 'Cardio + Core', es: 'Cardio + Core' }, muscleGroup: 'cardio', icon: 'bicycle-outline',
    exercises: [...EXERCISES.core] },
  { dayKey: 'wednesday', label: { en: 'Full Body B', es: 'Cuerpo Completo B' }, muscleGroup: 'fullBody', icon: 'body-outline',
    exercises: [EXERCISES.legs[1], EXERCISES.chest[1], EXERCISES.back[2], EXERCISES.biceps[0], EXERCISES.triceps[0]] },
  { dayKey: 'thursday', label: { en: 'Cardio + Core', es: 'Cardio + Core' }, muscleGroup: 'cardio', icon: 'bicycle-outline',
    exercises: [...EXERCISES.core] },
  { dayKey: 'friday', label: { en: 'Full Body C', es: 'Cuerpo Completo C' }, muscleGroup: 'fullBody', icon: 'body-outline',
    exercises: [EXERCISES.legs[3], EXERCISES.chest[2], EXERCISES.back[0], EXERCISES.shoulders[0], EXERCISES.core[2]] },
  { dayKey: 'saturday', label: { en: 'Active Recovery', es: 'Recuperacion Activa' }, muscleGroup: 'cardio', icon: 'walk-outline', exercises: [] },
  { dayKey: 'sunday', label: { en: 'Rest Day', es: 'Dia de Descanso' }, muscleGroup: 'rest', icon: 'bed-outline', exercises: [] },
];

// Upper/Lower for recomp
const RECOMP_PLAN: WorkoutDay[] = [
  { dayKey: 'monday', label: { en: 'Upper Body', es: 'Tren Superior' }, muscleGroup: 'upper', icon: 'barbell-outline',
    exercises: [...EXERCISES.chest.slice(0, 2), ...EXERCISES.back.slice(1), ...EXERCISES.shoulders.slice(0, 2), EXERCISES.biceps[0], EXERCISES.triceps[0]] },
  { dayKey: 'tuesday', label: { en: 'Lower Body', es: 'Tren Inferior' }, muscleGroup: 'lower', icon: 'walk-outline',
    exercises: [...EXERCISES.legs, ...EXERCISES.core.slice(0, 1)] },
  { dayKey: 'wednesday', label: { en: 'Rest', es: 'Descanso' }, muscleGroup: 'rest', icon: 'bed-outline', exercises: [] },
  { dayKey: 'thursday', label: { en: 'Upper Body', es: 'Tren Superior' }, muscleGroup: 'upper', icon: 'barbell-outline',
    exercises: [EXERCISES.chest[0], EXERCISES.chest[2], ...EXERCISES.back.slice(0, 2), EXERCISES.shoulders[2], EXERCISES.biceps[1], EXERCISES.triceps[1]] },
  { dayKey: 'friday', label: { en: 'Lower Body + Core', es: 'Tren Inferior + Core' }, muscleGroup: 'lower', icon: 'walk-outline',
    exercises: [...EXERCISES.legs.slice(0, 4), ...EXERCISES.core] },
  { dayKey: 'saturday', label: { en: 'Active Recovery', es: 'Recuperacion Activa' }, muscleGroup: 'cardio', icon: 'walk-outline', exercises: [] },
  { dayKey: 'sunday', label: { en: 'Rest Day', es: 'Dia de Descanso' }, muscleGroup: 'rest', icon: 'bed-outline', exercises: [] },
];

// Maintain — Full body 3x/week
const MAINTAIN_PLAN: WorkoutDay[] = [
  { dayKey: 'monday', label: { en: 'Full Body', es: 'Cuerpo Completo' }, muscleGroup: 'fullBody', icon: 'body-outline',
    exercises: [EXERCISES.legs[0], EXERCISES.chest[0], EXERCISES.back[1], EXERCISES.shoulders[0], EXERCISES.biceps[0], EXERCISES.core[0]] },
  { dayKey: 'tuesday', label: { en: 'Rest / Cardio', es: 'Descanso / Cardio' }, muscleGroup: 'rest', icon: 'bed-outline', exercises: [] },
  { dayKey: 'wednesday', label: { en: 'Full Body', es: 'Cuerpo Completo' }, muscleGroup: 'fullBody', icon: 'body-outline',
    exercises: [EXERCISES.legs[1], EXERCISES.chest[1], EXERCISES.back[2], EXERCISES.shoulders[1], EXERCISES.triceps[0], EXERCISES.core[1]] },
  { dayKey: 'thursday', label: { en: 'Rest / Cardio', es: 'Descanso / Cardio' }, muscleGroup: 'rest', icon: 'bed-outline', exercises: [] },
  { dayKey: 'friday', label: { en: 'Full Body', es: 'Cuerpo Completo' }, muscleGroup: 'fullBody', icon: 'body-outline',
    exercises: [EXERCISES.legs[3], EXERCISES.chest[2], EXERCISES.back[0], EXERCISES.shoulders[2], EXERCISES.biceps[1], EXERCISES.core[2]] },
  { dayKey: 'saturday', label: { en: 'Active Recovery', es: 'Recuperacion Activa' }, muscleGroup: 'cardio', icon: 'walk-outline', exercises: [] },
  { dayKey: 'sunday', label: { en: 'Rest Day', es: 'Dia de Descanso' }, muscleGroup: 'rest', icon: 'bed-outline', exercises: [] },
];

const ROUTINES: Record<string, WorkoutDay[]> = {
  build: WEEKLY_PLAN,      // PPL 6 days
  lose: LOSE_FAT_PLAN,     // Full body 3x + cardio 2x
  recomp: RECOMP_PLAN,     // Upper/Lower 4x
  maintain: MAINTAIN_PLAN, // Full body 3x
};

export function getRoutineForGoal(goal: string): WorkoutDay[] {
  return ROUTINES[goal] || WEEKLY_PLAN;
}

export function getTodayWorkout(goal?: string): WorkoutDay {
  const plan = goal ? getRoutineForGoal(goal) : WEEKLY_PLAN;
  const dayIndex = new Date().getDay();
  const planIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return plan[planIndex];
}

export function getWeeklyPlan(goal?: string): WorkoutDay[] {
  return goal ? getRoutineForGoal(goal) : WEEKLY_PLAN;
}

export function getExercisesByMuscle(): Record<string, Exercise[]> {
  return EXERCISES;
}
