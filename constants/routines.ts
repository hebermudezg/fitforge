/**
 * Science-Based Workout Routines
 *
 * References:
 * - Schoenfeld BJ et al. (2016). Effects of Resistance Training Frequency.
 *   Sports Medicine. DOI: 10.1007/s40279-016-0543-8
 *   → Training each muscle 2x/week is superior to 1x/week
 *
 * - Schoenfeld BJ et al. (2017). Dose-response relationship between weekly
 *   resistance training volume and increases in muscle mass.
 *   Medicine & Science in Sports & Exercise. DOI: 10.1249/MSS.0000000000001764
 *   → 10-20 sets per muscle group per week for optimal hypertrophy
 *
 * - Rhea MR & Alderman BL (2004). A meta-analysis of periodized versus
 *   nonperiodized strength and power training programs.
 *   Research Quarterly for Exercise and Sport.
 *   → Periodized training is superior to non-periodized
 *
 * - Pritchard HJ et al. (2015). Tapering practices of New Zealand's elite
 *   raw powerlifters. Journal of Strength & Conditioning Research.
 *   → Deload every 4-6 weeks for recovery and continued progress
 *
 * - ACSM (2009). Position Stand on Progression Models in Resistance Training.
 *   → Rep ranges: 1-5 strength, 6-12 hypertrophy, 15+ endurance
 *
 * - de Salles BF et al. (2009). Rest interval between sets in strength training.
 *   Sports Medicine. DOI: 10.2165/11315230
 *   → 2-5min for strength, 60-90s for hypertrophy
 */

export interface RoutineExercise {
  name: { en: string; es: string };
  sets: number;
  reps: string;
  restSec: number;
  rpe: string; // Rate of Perceived Exertion
  notes: { en: string; es: string };
  muscles: string[];
}

export interface RoutineDay {
  name: { en: string; es: string };
  focus: { en: string; es: string };
  icon: string;
  exercises: RoutineExercise[];
}

export interface RoutinePhase {
  name: { en: string; es: string };
  weeks: number;
  description: { en: string; es: string };
  goal: { en: string; es: string };
  days: RoutineDay[];
}

export interface RoutineProgram {
  id: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  totalWeeks: number;
  scienceBasis: { en: string; es: string };
  references: string[];
  phases: RoutinePhase[];
}

// ============================================================
// PROGRAM 1: BEGINNER FULL BODY (12 weeks, 3 days/week)
// Based on: Schoenfeld 2016 — Full body 3x/week optimal for beginners
// ============================================================
const BEGINNER_FULL_BODY: RoutineProgram = {
  id: 'beginner_full_body',
  name: { en: 'Beginner Full Body', es: 'Cuerpo Completo Principiante' },
  description: {
    en: 'Perfect for beginners. Train 3 days per week with full body sessions. Progressive overload with increasing intensity every 4 weeks.',
    es: 'Perfecto para principiantes. Entrena 3 dias por semana con sesiones de cuerpo completo. Sobrecarga progresiva con intensidad creciente cada 4 semanas.',
  },
  level: 'beginner',
  daysPerWeek: 3,
  totalWeeks: 12,
  scienceBasis: {
    en: 'Research shows beginners respond best to full-body training 3x/week, hitting each muscle group with moderate volume across the week (Schoenfeld et al., 2016). This program uses linear periodization, increasing intensity every 4 weeks.',
    es: 'La investigacion muestra que los principiantes responden mejor al entrenamiento de cuerpo completo 3x/semana, trabajando cada grupo muscular con volumen moderado a lo largo de la semana (Schoenfeld et al., 2016). Este programa usa periodizacion lineal, aumentando intensidad cada 4 semanas.',
  },
  references: [
    'Schoenfeld BJ et al. (2016). Sports Medicine, 46(11), 1689-1697',
    'ACSM (2009). Medicine & Science in Sports & Exercise, 41(3), 687-708',
  ],
  phases: [
    {
      name: { en: 'Phase 1: Foundation', es: 'Fase 1: Fundamentos' },
      weeks: 4,
      description: {
        en: 'Learn proper form, build mind-muscle connection. Light to moderate weights.',
        es: 'Aprende la forma correcta, construye conexion mente-musculo. Pesos ligeros a moderados.',
      },
      goal: { en: 'Learn movement patterns, 12-15 rep range', es: 'Aprender patrones de movimiento, rango de 12-15 reps' },
      days: [
        {
          name: { en: 'Day A', es: 'Dia A' },
          focus: { en: 'Full Body - Push emphasis', es: 'Cuerpo Completo - Enfasis empuje' },
          icon: 'barbell-outline',
          exercises: [
            { name: { en: 'Goblet Squat', es: 'Sentadilla Goblet' }, sets: 3, reps: '12-15', restSec: 90, rpe: '6-7', notes: { en: 'Hold dumbbell at chest. Sit back and down.', es: 'Sostener mancuerna en el pecho. Sentar atras y abajo.' }, muscles: ['quadriceps', 'gluteal'] },
            { name: { en: 'Dumbbell Bench Press', es: 'Press con Mancuernas' }, sets: 3, reps: '12-15', restSec: 90, rpe: '6-7', notes: { en: 'Control the weight down, press up explosively.', es: 'Controlar el peso al bajar, empujar explosivamente.' }, muscles: ['chest', 'deltoids', 'triceps'] },
            { name: { en: 'Lat Pulldown', es: 'Jalon al Pecho' }, sets: 3, reps: '12-15', restSec: 90, rpe: '6-7', notes: { en: 'Pull bar to upper chest, squeeze back muscles.', es: 'Jalar barra al pecho alto, apretar musculos de la espalda.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Dumbbell Shoulder Press', es: 'Press de Hombro con Mancuernas' }, sets: 2, reps: '12-15', restSec: 75, rpe: '6-7', notes: { en: 'Press overhead, dont arch back excessively.', es: 'Empujar sobre la cabeza, no arquear excesivamente.' }, muscles: ['deltoids', 'triceps'] },
            { name: { en: 'Plank', es: 'Plancha' }, sets: 3, reps: '30-45 sec', restSec: 45, rpe: '7', notes: { en: 'Keep body straight, core tight.', es: 'Mantener cuerpo recto, core apretado.' }, muscles: ['abs', 'obliques'] },
          ],
        },
        {
          name: { en: 'Day B', es: 'Dia B' },
          focus: { en: 'Full Body - Pull emphasis', es: 'Cuerpo Completo - Enfasis jalon' },
          icon: 'fitness-outline',
          exercises: [
            { name: { en: 'Romanian Deadlift', es: 'Peso Muerto Rumano' }, sets: 3, reps: '12-15', restSec: 90, rpe: '6-7', notes: { en: 'Hinge at hips, feel hamstring stretch. Back straight.', es: 'Bisagra en caderas, sentir estiramiento de isquiotibiales. Espalda recta.' }, muscles: ['hamstring', 'gluteal', 'lower-back'] },
            { name: { en: 'Dumbbell Row', es: 'Remo con Mancuerna' }, sets: 3, reps: '12-15', restSec: 90, rpe: '6-7', notes: { en: 'Pull to hip, squeeze shoulder blade back.', es: 'Jalar a la cadera, apretar escapula atras.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Leg Press', es: 'Prensa de Pierna' }, sets: 3, reps: '12-15', restSec: 90, rpe: '6-7', notes: { en: 'Full range of motion, dont lock knees.', es: 'Rango completo de movimiento, no bloquear rodillas.' }, muscles: ['quadriceps', 'gluteal'] },
            { name: { en: 'Cable Face Pull', es: 'Jalon a la Cara' }, sets: 2, reps: '15-20', restSec: 60, rpe: '6', notes: { en: 'Great for shoulder health and posture.', es: 'Excelente para salud del hombro y postura.' }, muscles: ['deltoids', 'trapezius'] },
            { name: { en: 'Dead Bug', es: 'Bicho Muerto' }, sets: 3, reps: '10 each side', restSec: 45, rpe: '6', notes: { en: 'Keep lower back pressed to floor.', es: 'Mantener espalda baja presionada al suelo.' }, muscles: ['abs'] },
          ],
        },
        {
          name: { en: 'Day C', es: 'Dia C' },
          focus: { en: 'Full Body - Balanced', es: 'Cuerpo Completo - Equilibrado' },
          icon: 'body-outline',
          exercises: [
            { name: { en: 'Walking Lunges', es: 'Zancadas Caminando' }, sets: 3, reps: '10 each leg', restSec: 90, rpe: '6-7', notes: { en: 'Long steps, knee tracks over toes.', es: 'Pasos largos, rodilla sigue los pies.' }, muscles: ['quadriceps', 'gluteal', 'hamstring'] },
            { name: { en: 'Incline Dumbbell Press', es: 'Press Inclinado con Mancuernas' }, sets: 3, reps: '12-15', restSec: 90, rpe: '6-7', notes: { en: 'Bench at 30-45 degrees for upper chest.', es: 'Banco a 30-45 grados para pecho superior.' }, muscles: ['chest', 'deltoids'] },
            { name: { en: 'Seated Cable Row', es: 'Remo Sentado en Polea' }, sets: 3, reps: '12-15', restSec: 90, rpe: '6-7', notes: { en: 'Pull to belly button, chest up.', es: 'Jalar al ombligo, pecho arriba.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Lateral Raises', es: 'Elevaciones Laterales' }, sets: 2, reps: '15-20', restSec: 60, rpe: '7', notes: { en: 'Lead with elbows, slight forward lean.', es: 'Guiar con codos, leve inclinacion hacia adelante.' }, muscles: ['deltoids'] },
            { name: { en: 'Calf Raises', es: 'Elevaciones de Pantorrilla' }, sets: 3, reps: '15-20', restSec: 45, rpe: '7', notes: { en: 'Full stretch at bottom, pause at top.', es: 'Estiramiento completo abajo, pausa arriba.' }, muscles: ['calves'] },
          ],
        },
      ],
    },
    {
      name: { en: 'Phase 2: Hypertrophy', es: 'Fase 2: Hipertrofia' },
      weeks: 4,
      description: {
        en: 'Increase volume and intensity. Focus on the 8-12 rep range for maximum muscle growth.',
        es: 'Aumentar volumen e intensidad. Enfocarse en el rango de 8-12 reps para maximo crecimiento muscular.',
      },
      goal: { en: 'Build muscle mass, 8-12 rep range, increase weight', es: 'Construir masa muscular, rango 8-12 reps, aumentar peso' },
      days: [
        {
          name: { en: 'Day A', es: 'Dia A' },
          focus: { en: 'Full Body - Heavy compound', es: 'Cuerpo Completo - Compuestos pesados' },
          icon: 'barbell-outline',
          exercises: [
            { name: { en: 'Barbell Back Squat', es: 'Sentadilla con Barra' }, sets: 4, reps: '8-10', restSec: 120, rpe: '7-8', notes: { en: 'Bar on upper back. Depth: thighs parallel minimum.', es: 'Barra en espalda alta. Profundidad: muslos paralelos minimo.' }, muscles: ['quadriceps', 'gluteal', 'hamstring'] },
            { name: { en: 'Barbell Bench Press', es: 'Press de Banca con Barra' }, sets: 4, reps: '8-10', restSec: 120, rpe: '7-8', notes: { en: 'Retract shoulder blades, arch slightly, feet firm.', es: 'Retraer escapulas, arquear levemente, pies firmes.' }, muscles: ['chest', 'deltoids', 'triceps'] },
            { name: { en: 'Barbell Row', es: 'Remo con Barra' }, sets: 4, reps: '8-10', restSec: 120, rpe: '7-8', notes: { en: 'Torso at ~45 degrees, pull to lower chest.', es: 'Torso a ~45 grados, jalar al pecho bajo.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Dumbbell Lateral Raise', es: 'Elevacion Lateral' }, sets: 3, reps: '12-15', restSec: 60, rpe: '8', notes: { en: 'Control the weight, no swinging.', es: 'Controlar el peso, sin balanceo.' }, muscles: ['deltoids'] },
            { name: { en: 'Hanging Leg Raise', es: 'Elevacion de Piernas Colgado' }, sets: 3, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'Control the movement, avoid swinging.', es: 'Controlar el movimiento, evitar balanceo.' }, muscles: ['abs'] },
          ],
        },
        {
          name: { en: 'Day B', es: 'Dia B' },
          focus: { en: 'Full Body - Posterior chain', es: 'Cuerpo Completo - Cadena posterior' },
          icon: 'fitness-outline',
          exercises: [
            { name: { en: 'Conventional Deadlift', es: 'Peso Muerto Convencional' }, sets: 3, reps: '6-8', restSec: 150, rpe: '7-8', notes: { en: 'Drive through heels, keep back neutral.', es: 'Empujar con talones, mantener espalda neutra.' }, muscles: ['hamstring', 'gluteal', 'lower-back', 'quadriceps'] },
            { name: { en: 'Overhead Press', es: 'Press Militar' }, sets: 4, reps: '8-10', restSec: 120, rpe: '7-8', notes: { en: 'Strict press, no leg drive. Brace core.', es: 'Press estricto, sin impulso de piernas. Apretar core.' }, muscles: ['deltoids', 'triceps'] },
            { name: { en: 'Pull-Ups or Lat Pulldown', es: 'Dominadas o Jalon al Pecho' }, sets: 4, reps: '8-12', restSec: 90, rpe: '7-8', notes: { en: 'Full range of motion. Use assistance if needed.', es: 'Rango completo. Usar asistencia si es necesario.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Bulgarian Split Squat', es: 'Sentadilla Bulgara' }, sets: 3, reps: '10-12 each', restSec: 90, rpe: '8', notes: { en: 'Rear foot elevated on bench. Great for balance.', es: 'Pie trasero elevado en banco. Excelente para equilibrio.' }, muscles: ['quadriceps', 'gluteal'] },
            { name: { en: 'Cable Crunch', es: 'Crunch en Polea' }, sets: 3, reps: '12-15', restSec: 45, rpe: '8', notes: { en: 'Round your spine downward, dont bend at hips.', es: 'Redondear columna hacia abajo, no doblar caderas.' }, muscles: ['abs'] },
          ],
        },
        {
          name: { en: 'Day C', es: 'Dia C' },
          focus: { en: 'Full Body - Volume', es: 'Cuerpo Completo - Volumen' },
          icon: 'body-outline',
          exercises: [
            { name: { en: 'Leg Press', es: 'Prensa de Pierna' }, sets: 4, reps: '10-12', restSec: 90, rpe: '8', notes: { en: 'Feet shoulder width, full depth.', es: 'Pies al ancho de hombros, profundidad completa.' }, muscles: ['quadriceps', 'gluteal'] },
            { name: { en: 'Incline Barbell Press', es: 'Press Inclinado con Barra' }, sets: 3, reps: '8-10', restSec: 90, rpe: '8', notes: { en: 'Bench at 30 degrees for upper chest.', es: 'Banco a 30 grados para pecho superior.' }, muscles: ['chest', 'deltoids'] },
            { name: { en: 'Chest Supported Row', es: 'Remo con Apoyo en Pecho' }, sets: 3, reps: '10-12', restSec: 90, rpe: '8', notes: { en: 'Eliminates lower back fatigue. Pure back work.', es: 'Elimina fatiga de espalda baja. Trabajo puro de espalda.' }, muscles: ['upper-back'] },
            { name: { en: 'Dumbbell Curl', es: 'Curl con Mancuerna' }, sets: 3, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'Supinate at the top for peak contraction.', es: 'Supinar arriba para maxima contraccion.' }, muscles: ['biceps'] },
            { name: { en: 'Tricep Pushdown', es: 'Extension de Triceps' }, sets: 3, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'Elbows pinned to sides, full extension.', es: 'Codos pegados a los lados, extension completa.' }, muscles: ['triceps'] },
            { name: { en: 'Calf Raises', es: 'Elevaciones de Pantorrilla' }, sets: 4, reps: '12-15', restSec: 45, rpe: '8', notes: { en: 'Slow eccentric (3 seconds down).', es: 'Eccentrica lenta (3 segundos bajando).' }, muscles: ['calves'] },
          ],
        },
      ],
    },
    {
      name: { en: 'Phase 3: Strength + Deload', es: 'Fase 3: Fuerza + Descarga' },
      weeks: 4,
      description: {
        en: 'Weeks 9-11: Heavy weights, lower reps for strength. Week 12: Deload at 50% volume for recovery.',
        es: 'Semanas 9-11: Pesos pesados, menos reps para fuerza. Semana 12: Descarga al 50% de volumen para recuperacion.',
      },
      goal: { en: 'Build strength (weeks 9-11), then deload week 12', es: 'Construir fuerza (semanas 9-11), luego semana de descarga 12' },
      days: [
        {
          name: { en: 'Day A - Strength', es: 'Dia A - Fuerza' },
          focus: { en: 'Heavy compounds', es: 'Compuestos pesados' },
          icon: 'barbell-outline',
          exercises: [
            { name: { en: 'Barbell Back Squat', es: 'Sentadilla con Barra' }, sets: 5, reps: '5', restSec: 180, rpe: '8-9', notes: { en: 'Heavy. Rest fully between sets. Focus on form.', es: 'Pesado. Descansar completamente entre series. Enfoque en forma.' }, muscles: ['quadriceps', 'gluteal'] },
            { name: { en: 'Barbell Bench Press', es: 'Press de Banca' }, sets: 5, reps: '5', restSec: 180, rpe: '8-9', notes: { en: 'Controlled descent, explosive press.', es: 'Descenso controlado, empuje explosivo.' }, muscles: ['chest', 'triceps'] },
            { name: { en: 'Barbell Row', es: 'Remo con Barra' }, sets: 4, reps: '6-8', restSec: 120, rpe: '8', notes: { en: 'Heavier than phase 2, maintain form.', es: 'Mas pesado que fase 2, mantener forma.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Plank', es: 'Plancha' }, sets: 3, reps: '45-60 sec', restSec: 45, rpe: '7', notes: { en: 'Core stability for heavy lifts.', es: 'Estabilidad del core para levantamientos pesados.' }, muscles: ['abs'] },
          ],
        },
        {
          name: { en: 'Day B - Strength', es: 'Dia B - Fuerza' },
          focus: { en: 'Heavy posterior chain', es: 'Cadena posterior pesada' },
          icon: 'fitness-outline',
          exercises: [
            { name: { en: 'Deadlift', es: 'Peso Muerto' }, sets: 4, reps: '5', restSec: 180, rpe: '8-9', notes: { en: 'Reset each rep from the floor. No bouncing.', es: 'Resetear cada rep desde el suelo. Sin rebote.' }, muscles: ['hamstring', 'gluteal', 'lower-back'] },
            { name: { en: 'Overhead Press', es: 'Press Militar' }, sets: 4, reps: '5-6', restSec: 150, rpe: '8-9', notes: { en: 'Strict press. No leg drive.', es: 'Press estricto. Sin impulso de piernas.' }, muscles: ['deltoids', 'triceps'] },
            { name: { en: 'Weighted Pull-Ups', es: 'Dominadas con Peso' }, sets: 4, reps: '5-8', restSec: 120, rpe: '8', notes: { en: 'Add weight with belt or dumbbell between feet.', es: 'Agregar peso con cinturon o mancuerna entre pies.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Ab Rollout', es: 'Rueda Abdominal' }, sets: 3, reps: '8-10', restSec: 60, rpe: '8', notes: { en: 'Extend as far as you can maintain control.', es: 'Extender tan lejos como puedas mantener control.' }, muscles: ['abs'] },
          ],
        },
        {
          name: { en: 'Day C - Strength', es: 'Dia C - Fuerza' },
          focus: { en: 'Accessory + volume', es: 'Accesorios + volumen' },
          icon: 'body-outline',
          exercises: [
            { name: { en: 'Front Squat', es: 'Sentadilla Frontal' }, sets: 4, reps: '6-8', restSec: 120, rpe: '8', notes: { en: 'Bar on front delts, elbows high. Upright torso.', es: 'Barra en deltoides frontales, codos altos. Torso erguido.' }, muscles: ['quadriceps', 'gluteal'] },
            { name: { en: 'Close Grip Bench Press', es: 'Press de Banca Agarre Cerrado' }, sets: 4, reps: '6-8', restSec: 90, rpe: '8', notes: { en: 'Hands shoulder width. Great tricep builder.', es: 'Manos al ancho de hombros. Gran constructor de triceps.' }, muscles: ['triceps', 'chest'] },
            { name: { en: 'Dumbbell Row', es: 'Remo con Mancuerna' }, sets: 3, reps: '8-10 each', restSec: 90, rpe: '8', notes: { en: 'Heavy single arm rowing. Brace core.', es: 'Remo pesado con un brazo. Apretar core.' }, muscles: ['upper-back'] },
            { name: { en: 'Hammer Curl', es: 'Curl Martillo' }, sets: 3, reps: '10-12', restSec: 60, rpe: '7', notes: { en: 'Neutral grip works biceps and forearms.', es: 'Agarre neutro trabaja biceps y antebrazos.' }, muscles: ['biceps', 'forearm'] },
            { name: { en: 'Calf Raises', es: 'Elevaciones de Pantorrilla' }, sets: 3, reps: '15-20', restSec: 45, rpe: '7', notes: { en: 'High reps for calves respond well.', es: 'Altas reps porque las pantorrillas responden bien.' }, muscles: ['calves'] },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// PROGRAM 2: INTERMEDIATE PPL (16 weeks, 6 days/week)
// Based on: Schoenfeld 2017 — Volume dose-response for hypertrophy
// ============================================================
const INTERMEDIATE_PPL: RoutineProgram = {
  id: 'intermediate_ppl',
  name: { en: 'Push/Pull/Legs (PPL)', es: 'Empuje/Jalon/Piernas (PPL)' },
  description: {
    en: '6-day split hitting each muscle group twice per week. Optimal for intermediate lifters seeking maximum muscle growth.',
    es: 'Split de 6 dias entrenando cada grupo muscular dos veces por semana. Optimo para intermedios buscando maximo crecimiento muscular.',
  },
  level: 'intermediate',
  daysPerWeek: 6,
  totalWeeks: 16,
  scienceBasis: {
    en: 'Training frequency of 2x per muscle group per week produces superior hypertrophy compared to 1x (Schoenfeld et al., 2016). Volume of 10-20 sets per muscle per week is the evidence-based sweet spot (Schoenfeld et al., 2017). This program varies intensity across 4-week blocks.',
    es: 'La frecuencia de entrenamiento de 2x por grupo muscular por semana produce hipertrofia superior comparada con 1x (Schoenfeld et al., 2016). El volumen de 10-20 series por musculo por semana es el punto optimo basado en evidencia (Schoenfeld et al., 2017). Este programa varia la intensidad en bloques de 4 semanas.',
  },
  references: [
    'Schoenfeld BJ et al. (2016). Sports Medicine, 46(11), 1689-1697',
    'Schoenfeld BJ et al. (2017). Med Sci Sports Exerc, 49(11), 2324-2331',
    'Pritchard HJ et al. (2015). J Strength Cond Res, 29(7), 1865-1869',
  ],
  phases: [
    {
      name: { en: 'Phase 1: Volume Accumulation', es: 'Fase 1: Acumulacion de Volumen' },
      weeks: 4,
      description: { en: 'Moderate weights, higher volume. Build work capacity.', es: 'Pesos moderados, mayor volumen. Construir capacidad de trabajo.' },
      goal: { en: '10-12 reps, RPE 7-8, focus on mind-muscle connection', es: '10-12 reps, RPE 7-8, enfoque en conexion mente-musculo' },
      days: [
        {
          name: { en: 'Push A', es: 'Empuje A' },
          focus: { en: 'Chest, Shoulders, Triceps', es: 'Pecho, Hombros, Triceps' },
          icon: 'barbell-outline',
          exercises: [
            { name: { en: 'Bench Press', es: 'Press de Banca' }, sets: 4, reps: '8-10', restSec: 120, rpe: '7-8', notes: { en: 'Main chest movement. Progressive overload.', es: 'Movimiento principal de pecho. Sobrecarga progresiva.' }, muscles: ['chest', 'triceps'] },
            { name: { en: 'Incline DB Press', es: 'Press Inclinado Mancuernas' }, sets: 3, reps: '10-12', restSec: 90, rpe: '8', notes: { en: '30 degree incline for upper chest.', es: 'Inclinacion de 30 grados para pecho superior.' }, muscles: ['chest', 'deltoids'] },
            { name: { en: 'Overhead Press', es: 'Press Militar' }, sets: 4, reps: '8-10', restSec: 120, rpe: '7-8', notes: { en: 'Standing or seated. Full range.', es: 'De pie o sentado. Rango completo.' }, muscles: ['deltoids', 'triceps'] },
            { name: { en: 'Lateral Raises', es: 'Elevaciones Laterales' }, sets: 3, reps: '12-15', restSec: 60, rpe: '8', notes: { en: 'Slight lean forward, lead with elbows.', es: 'Leve inclinacion adelante, guiar con codos.' }, muscles: ['deltoids'] },
            { name: { en: 'Tricep Pushdown', es: 'Extension de Triceps' }, sets: 3, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'Elbows tight, full extension.', es: 'Codos pegados, extension completa.' }, muscles: ['triceps'] },
            { name: { en: 'Overhead Tricep Extension', es: 'Extension de Triceps Sobre Cabeza' }, sets: 3, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'Targets the long head of triceps.', es: 'Trabaja la cabeza larga del triceps.' }, muscles: ['triceps'] },
          ],
        },
        {
          name: { en: 'Pull A', es: 'Jalon A' },
          focus: { en: 'Back, Biceps, Rear Delts', es: 'Espalda, Biceps, Deltoides Posteriores' },
          icon: 'fitness-outline',
          exercises: [
            { name: { en: 'Barbell Row', es: 'Remo con Barra' }, sets: 4, reps: '8-10', restSec: 120, rpe: '7-8', notes: { en: 'Main back thickness builder.', es: 'Principal constructor de grosor de espalda.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Pull-Ups', es: 'Dominadas' }, sets: 4, reps: '6-10', restSec: 90, rpe: '8', notes: { en: 'Wide grip for lat width. Use band if needed.', es: 'Agarre ancho para ancho de dorsales. Usar banda si es necesario.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Face Pull', es: 'Jalon a la Cara' }, sets: 3, reps: '15-20', restSec: 60, rpe: '7', notes: { en: 'External rotation at the top. Shoulder health.', es: 'Rotacion externa arriba. Salud del hombro.' }, muscles: ['deltoids', 'trapezius'] },
            { name: { en: 'Barbell Curl', es: 'Curl con Barra' }, sets: 3, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'EZ bar or straight bar. No swinging.', es: 'Barra EZ o recta. Sin balanceo.' }, muscles: ['biceps'] },
            { name: { en: 'Hammer Curl', es: 'Curl Martillo' }, sets: 3, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'Works brachialis for arm thickness.', es: 'Trabaja braquial para grosor del brazo.' }, muscles: ['biceps', 'forearm'] },
          ],
        },
        {
          name: { en: 'Legs A', es: 'Piernas A' },
          focus: { en: 'Quads, Hamstrings, Glutes, Calves', es: 'Cuadriceps, Isquiotibiales, Gluteos, Pantorrillas' },
          icon: 'walk-outline',
          exercises: [
            { name: { en: 'Barbell Squat', es: 'Sentadilla con Barra' }, sets: 4, reps: '8-10', restSec: 150, rpe: '8', notes: { en: 'King of exercises. Full depth.', es: 'Rey de los ejercicios. Profundidad completa.' }, muscles: ['quadriceps', 'gluteal', 'hamstring'] },
            { name: { en: 'Romanian Deadlift', es: 'Peso Muerto Rumano' }, sets: 4, reps: '10-12', restSec: 90, rpe: '8', notes: { en: 'Hamstring and glute focused. Soft knees.', es: 'Enfocado en isquiotibiales y gluteos. Rodillas suaves.' }, muscles: ['hamstring', 'gluteal'] },
            { name: { en: 'Leg Press', es: 'Prensa de Pierna' }, sets: 3, reps: '10-12', restSec: 90, rpe: '8', notes: { en: 'Feet high for glutes, low for quads.', es: 'Pies altos para gluteos, bajos para cuadriceps.' }, muscles: ['quadriceps', 'gluteal'] },
            { name: { en: 'Leg Curl', es: 'Curl de Pierna' }, sets: 3, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'Slow eccentric for hamstring growth.', es: 'Eccentrica lenta para crecimiento de isquiotibiales.' }, muscles: ['hamstring'] },
            { name: { en: 'Calf Raises', es: 'Elevaciones de Pantorrilla' }, sets: 4, reps: '12-15', restSec: 45, rpe: '8', notes: { en: 'Standing and seated variations alternate.', es: 'Alternar variaciones de pie y sentado.' }, muscles: ['calves'] },
            { name: { en: 'Plank', es: 'Plancha' }, sets: 3, reps: '45-60 sec', restSec: 45, rpe: '7', notes: { en: 'Core stability essential for squats.', es: 'Estabilidad del core esencial para sentadillas.' }, muscles: ['abs'] },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// PROGRAM 3: UPPER/LOWER (12 weeks, 4 days/week)
// Based on: Balanced approach, ideal for body recomposition
// ============================================================
const UPPER_LOWER: RoutineProgram = {
  id: 'upper_lower',
  name: { en: 'Upper/Lower Split', es: 'Split Superior/Inferior' },
  description: {
    en: '4-day split alternating upper and lower body. Perfect balance of volume and recovery for recomposition.',
    es: 'Split de 4 dias alternando tren superior e inferior. Balance perfecto de volumen y recuperacion para recomposicion.',
  },
  level: 'intermediate',
  daysPerWeek: 4,
  totalWeeks: 12,
  scienceBasis: {
    en: 'Upper/lower splits allow 2x frequency per muscle group with adequate recovery between sessions (48-72h). Combined with caloric cycling, this is ideal for body recomposition (Barakat et al., 2020). Each session hits ~10 sets per major muscle group.',
    es: 'Los splits superior/inferior permiten frecuencia 2x por grupo muscular con recuperacion adecuada entre sesiones (48-72h). Combinado con ciclado calorico, esto es ideal para recomposicion corporal (Barakat et al., 2020). Cada sesion alcanza ~10 series por grupo muscular principal.',
  },
  references: [
    'Barakat C et al. (2020). Body Recomposition: Can Trained Individuals Build Muscle and Lose Fat at the Same Time? Strength Cond J.',
    'Schoenfeld BJ et al. (2016). Sports Medicine, 46(11), 1689-1697',
  ],
  phases: [
    {
      name: { en: 'Phase 1: Base Building', es: 'Fase 1: Construccion de Base' },
      weeks: 4,
      description: { en: 'Establish baseline strength with compound lifts.', es: 'Establecer fuerza base con levantamientos compuestos.' },
      goal: { en: '8-12 reps, learn RPE management', es: '8-12 reps, aprender manejo de RPE' },
      days: [
        {
          name: { en: 'Upper A - Strength', es: 'Superior A - Fuerza' },
          focus: { en: 'Heavy upper body compounds', es: 'Compuestos pesados tren superior' },
          icon: 'barbell-outline',
          exercises: [
            { name: { en: 'Bench Press', es: 'Press de Banca' }, sets: 4, reps: '6-8', restSec: 150, rpe: '8', notes: { en: 'Primary pushing strength.', es: 'Fuerza principal de empuje.' }, muscles: ['chest', 'triceps'] },
            { name: { en: 'Barbell Row', es: 'Remo con Barra' }, sets: 4, reps: '6-8', restSec: 150, rpe: '8', notes: { en: 'Match your bench press weight over time.', es: 'Igualar tu peso de press de banca con el tiempo.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Overhead Press', es: 'Press Militar' }, sets: 3, reps: '8-10', restSec: 120, rpe: '8', notes: { en: 'Strict form, no leg drive.', es: 'Forma estricta, sin impulso de piernas.' }, muscles: ['deltoids', 'triceps'] },
            { name: { en: 'Pull-Ups', es: 'Dominadas' }, sets: 3, reps: '8-12', restSec: 90, rpe: '8', notes: { en: 'Add weight when bodyweight becomes easy.', es: 'Agregar peso cuando el peso corporal sea facil.' }, muscles: ['upper-back', 'biceps'] },
            { name: { en: 'Dumbbell Curl', es: 'Curl con Mancuerna' }, sets: 2, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'Supinate at top for peak contraction.', es: 'Supinar arriba para contraccion maxima.' }, muscles: ['biceps'] },
            { name: { en: 'Tricep Dips or Pushdown', es: 'Fondos o Extension de Triceps' }, sets: 2, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'Choose based on shoulder comfort.', es: 'Elegir basado en comodidad del hombro.' }, muscles: ['triceps'] },
          ],
        },
        {
          name: { en: 'Lower A - Strength', es: 'Inferior A - Fuerza' },
          focus: { en: 'Heavy lower body compounds', es: 'Compuestos pesados tren inferior' },
          icon: 'walk-outline',
          exercises: [
            { name: { en: 'Barbell Squat', es: 'Sentadilla con Barra' }, sets: 4, reps: '6-8', restSec: 180, rpe: '8', notes: { en: 'Deep squat. Hips below knee crease.', es: 'Sentadilla profunda. Caderas debajo del pliegue de rodilla.' }, muscles: ['quadriceps', 'gluteal'] },
            { name: { en: 'Romanian Deadlift', es: 'Peso Muerto Rumano' }, sets: 4, reps: '8-10', restSec: 120, rpe: '8', notes: { en: 'Feel hamstring stretch at bottom.', es: 'Sentir estiramiento de isquiotibiales abajo.' }, muscles: ['hamstring', 'gluteal'] },
            { name: { en: 'Walking Lunges', es: 'Zancadas Caminando' }, sets: 3, reps: '10 each', restSec: 90, rpe: '7', notes: { en: 'Long steps for glutes.', es: 'Pasos largos para gluteos.' }, muscles: ['quadriceps', 'gluteal'] },
            { name: { en: 'Leg Curl', es: 'Curl de Pierna' }, sets: 3, reps: '10-12', restSec: 60, rpe: '8', notes: { en: 'Slow eccentric.', es: 'Eccentrica lenta.' }, muscles: ['hamstring'] },
            { name: { en: 'Calf Raises', es: 'Elevaciones de Pantorrilla' }, sets: 4, reps: '12-15', restSec: 45, rpe: '8', notes: { en: 'Full range of motion.', es: 'Rango completo de movimiento.' }, muscles: ['calves'] },
            { name: { en: 'Hanging Leg Raise', es: 'Elevacion de Piernas Colgado' }, sets: 3, reps: '10-12', restSec: 60, rpe: '7', notes: { en: 'Control the movement.', es: 'Controlar el movimiento.' }, muscles: ['abs'] },
          ],
        },
      ],
    },
  ],
};

// All programs
export const ROUTINE_PROGRAMS: RoutineProgram[] = [
  BEGINNER_FULL_BODY,
  INTERMEDIATE_PPL,
  UPPER_LOWER,
];

export function getRoutineById(id: string): RoutineProgram | undefined {
  return ROUTINE_PROGRAMS.find((r) => r.id === id);
}

export function getRoutinesByLevel(level: string): RoutineProgram[] {
  return ROUTINE_PROGRAMS.filter((r) => r.level === level);
}

// Periodization recommendation
export function getRecommendedVariation(currentWeek: number, totalWeeks: number): {
  en: string; es: string;
} {
  if (currentWeek >= totalWeeks) {
    return {
      en: 'Time to switch to a new program! Your body has adapted to this routine. Choose a different program to continue progressing.',
      es: 'Es hora de cambiar a un nuevo programa! Tu cuerpo se ha adaptado a esta rutina. Elige un programa diferente para seguir progresando.',
    };
  }
  if (currentWeek % 4 === 0 && currentWeek > 0) {
    return {
      en: 'Deload week recommended! Reduce volume by 50% this week to allow recovery and prevent overtraining.',
      es: 'Semana de descarga recomendada! Reduce el volumen al 50% esta semana para permitir recuperacion y prevenir sobreentrenamiento.',
    };
  }
  return { en: '', es: '' };
}
