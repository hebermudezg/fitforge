/**
 * Fitness Glossary — Educational content for users
 * Helps people understand training terminology
 */

export interface GlossaryTerm {
  id: string;
  term: { en: string; es: string };
  definition: { en: string; es: string };
  example: { en: string; es: string };
  icon: string;
  category: 'movement' | 'training' | 'nutrition' | 'anatomy';
}

export const GLOSSARY: GlossaryTerm[] = [
  // Movement phases
  {
    id: 'concentric',
    term: { en: 'Concentric Phase', es: 'Fase Concentrica' },
    definition: {
      en: 'The phase of a movement where the muscle shortens under tension. This is the "lifting" part — when you push the bar up in a bench press or curl the dumbbell up.',
      es: 'La fase del movimiento donde el musculo se acorta bajo tension. Es la parte de "levantar" — cuando empujas la barra hacia arriba en press de banca o subes la mancuerna en un curl.',
    },
    example: { en: 'Pushing up in a push-up, standing up from a squat', es: 'Empujar hacia arriba en una flexion, pararse de una sentadilla' },
    icon: 'arrow-up-circle-outline',
    category: 'movement',
  },
  {
    id: 'eccentric',
    term: { en: 'Eccentric Phase', es: 'Fase Excentrica' },
    definition: {
      en: 'The phase where the muscle lengthens under tension. This is the "lowering" part — the controlled descent. Eccentric training causes MORE muscle damage and growth than concentric.',
      es: 'La fase donde el musculo se alarga bajo tension. Es la parte de "bajar" — el descenso controlado. El entrenamiento excentrico causa MAS dano muscular y crecimiento que el concentrico.',
    },
    example: { en: 'Lowering the bar in bench press, going down in a squat', es: 'Bajar la barra en press de banca, bajar en una sentadilla' },
    icon: 'arrow-down-circle-outline',
    category: 'movement',
  },
  {
    id: 'isometric',
    term: { en: 'Isometric Contraction', es: 'Contraccion Isometrica' },
    definition: {
      en: 'Holding a position without moving — the muscle contracts but doesnt change length. Great for building stability and strength at specific joint angles.',
      es: 'Mantener una posicion sin moverse — el musculo se contrae pero no cambia de longitud. Excelente para construir estabilidad y fuerza en angulos articulares especificos.',
    },
    example: { en: 'Holding a plank, wall sit, pausing at the bottom of a squat', es: 'Mantener una plancha, sentadilla en pared, pausar al fondo de una sentadilla' },
    icon: 'pause-circle-outline',
    category: 'movement',
  },

  // Training concepts
  {
    id: 'rpe',
    term: { en: 'RPE (Rate of Perceived Exertion)', es: 'RPE (Escala de Esfuerzo Percibido)' },
    definition: {
      en: 'A scale from 1-10 measuring how hard a set feels. RPE 7 = you could do 3 more reps. RPE 8 = 2 more reps. RPE 9 = 1 more rep. RPE 10 = absolute failure.',
      es: 'Una escala del 1 al 10 que mide que tan dificil se siente una serie. RPE 7 = podrias hacer 3 reps mas. RPE 8 = 2 reps mas. RPE 9 = 1 rep mas. RPE 10 = fallo absoluto.',
    },
    example: { en: 'Squat 100kg x 8 at RPE 8 means you could have done 2 more reps', es: 'Sentadilla 100kg x 8 a RPE 8 significa que podrias haber hecho 2 reps mas' },
    icon: 'speedometer-outline',
    category: 'training',
  },
  {
    id: 'progressive_overload',
    term: { en: 'Progressive Overload', es: 'Sobrecarga Progresiva' },
    definition: {
      en: 'The #1 principle of training: gradually increase the demands on your muscles over time. Add weight, reps, sets, or reduce rest. Without this, muscles have no reason to grow.',
      es: 'El principio #1 del entrenamiento: aumentar gradualmente las demandas sobre tus musculos con el tiempo. Agregar peso, reps, series, o reducir descanso. Sin esto, los musculos no tienen razon para crecer.',
    },
    example: { en: 'Week 1: 60kg x 10. Week 2: 60kg x 11. Week 3: 62.5kg x 10', es: 'Semana 1: 60kg x 10. Semana 2: 60kg x 11. Semana 3: 62.5kg x 10' },
    icon: 'trending-up-outline',
    category: 'training',
  },
  {
    id: 'periodization',
    term: { en: 'Periodization', es: 'Periodizacion' },
    definition: {
      en: 'Structured variation of training variables (volume, intensity, exercises) over time. Prevents plateaus and reduces injury risk. Typically in 4-6 week blocks.',
      es: 'Variacion estructurada de variables de entrenamiento (volumen, intensidad, ejercicios) a lo largo del tiempo. Previene estancamientos y reduce riesgo de lesion. Tipicamente en bloques de 4-6 semanas.',
    },
    example: { en: 'Weeks 1-4: High volume. Weeks 5-8: Heavy weight. Week 9: Deload', es: 'Semanas 1-4: Alto volumen. Semanas 5-8: Peso pesado. Semana 9: Descarga' },
    icon: 'calendar-outline',
    category: 'training',
  },
  {
    id: 'deload',
    term: { en: 'Deload Week', es: 'Semana de Descarga' },
    definition: {
      en: 'A planned week of reduced training volume (50% less) to allow your body to fully recover, repair, and come back stronger. Essential every 4-6 weeks.',
      es: 'Una semana planificada de volumen reducido (50% menos) para permitir que tu cuerpo se recupere completamente, repare, y regrese mas fuerte. Esencial cada 4-6 semanas.',
    },
    example: { en: 'Normal: 4 sets x 10 reps. Deload: 2 sets x 10 reps, same weight', es: 'Normal: 4 series x 10 reps. Descarga: 2 series x 10 reps, mismo peso' },
    icon: 'bed-outline',
    category: 'training',
  },
  {
    id: 'compound',
    term: { en: 'Compound Exercise', es: 'Ejercicio Compuesto' },
    definition: {
      en: 'An exercise that works multiple joints and muscle groups at once. These are the most efficient exercises for building overall strength and muscle.',
      es: 'Un ejercicio que trabaja multiples articulaciones y grupos musculares a la vez. Son los ejercicios mas eficientes para construir fuerza y musculo en general.',
    },
    example: { en: 'Squat (knees + hips), Bench Press (shoulders + elbows), Deadlift', es: 'Sentadilla (rodillas + caderas), Press de Banca (hombros + codos), Peso Muerto' },
    icon: 'layers-outline',
    category: 'training',
  },
  {
    id: 'isolation',
    term: { en: 'Isolation Exercise', es: 'Ejercicio de Aislamiento' },
    definition: {
      en: 'An exercise that targets a single muscle group through one joint. Used to bring up weak points or add extra volume to specific muscles.',
      es: 'Un ejercicio que trabaja un solo grupo muscular a traves de una articulacion. Se usa para mejorar puntos debiles o agregar volumen extra a musculos especificos.',
    },
    example: { en: 'Bicep curl (only elbow), Lateral raise (only shoulder), Leg curl', es: 'Curl de biceps (solo codo), Elevacion lateral (solo hombro), Curl de pierna' },
    icon: 'locate-outline',
    category: 'training',
  },
  {
    id: 'hypertrophy',
    term: { en: 'Hypertrophy', es: 'Hipertrofia' },
    definition: {
      en: 'The scientific term for muscle growth. Occurs when muscle fibers increase in size through training and proper nutrition. Optimal rep range: 6-12 reps per set.',
      es: 'El termino cientifico para crecimiento muscular. Ocurre cuando las fibras musculares aumentan de tamano a traves del entrenamiento y nutricion adecuada. Rango optimo: 6-12 reps por serie.',
    },
    example: { en: '3-4 sets of 8-12 reps at RPE 8 with 60-90s rest', es: '3-4 series de 8-12 reps a RPE 8 con 60-90s de descanso' },
    icon: 'resize-outline',
    category: 'training',
  },
  {
    id: 'volume',
    term: { en: 'Training Volume', es: 'Volumen de Entrenamiento' },
    definition: {
      en: 'Total number of challenging sets per muscle group per week. Research shows 10-20 sets per muscle per week is optimal for growth. More isnt always better.',
      es: 'Numero total de series desafiantes por grupo muscular por semana. La investigacion muestra que 10-20 series por musculo por semana es optimo para crecimiento. Mas no siempre es mejor.',
    },
    example: { en: 'Chest: 4 sets bench + 3 sets incline + 3 sets fly = 10 sets/week', es: 'Pecho: 4 series press + 3 series inclinado + 3 series apertura = 10 series/semana' },
    icon: 'bar-chart-outline',
    category: 'training',
  },
  {
    id: 'time_under_tension',
    term: { en: 'Time Under Tension (TUT)', es: 'Tiempo Bajo Tension (TBT)' },
    definition: {
      en: 'The total time a muscle is under load during a set. Slowing down the eccentric (lowering) phase increases TUT and can enhance muscle growth.',
      es: 'El tiempo total que un musculo esta bajo carga durante una serie. Desacelerar la fase excentrica (bajada) aumenta el TBT y puede mejorar el crecimiento muscular.',
    },
    example: { en: '3 seconds down, 1 second pause, 2 seconds up = 6 sec per rep', es: '3 segundos bajando, 1 segundo pausa, 2 segundos subiendo = 6 seg por rep' },
    icon: 'time-outline',
    category: 'training',
  },
  {
    id: 'mind_muscle',
    term: { en: 'Mind-Muscle Connection', es: 'Conexion Mente-Musculo' },
    definition: {
      en: 'Focusing your attention on the specific muscle being worked during an exercise. Research shows this increases muscle activation and growth, especially for isolation exercises.',
      es: 'Enfocar tu atencion en el musculo especifico que se trabaja durante un ejercicio. La investigacion muestra que esto aumenta la activacion muscular y el crecimiento, especialmente para ejercicios de aislamiento.',
    },
    example: { en: 'During bicep curls, mentally focus on squeezing the bicep, not just moving the weight', es: 'Durante curls de biceps, enfocarse mentalmente en apretar el biceps, no solo mover el peso' },
    icon: 'bulb-outline',
    category: 'training',
  },

  // Nutrition basics
  {
    id: 'caloric_surplus',
    term: { en: 'Caloric Surplus', es: 'Superavit Calorico' },
    definition: {
      en: 'Eating more calories than your body burns. Required for building muscle efficiently. A surplus of 200-500 calories above maintenance is recommended.',
      es: 'Comer mas calorias de las que tu cuerpo quema. Necesario para construir musculo eficientemente. Un superavit de 200-500 calorias sobre mantenimiento es recomendado.',
    },
    example: { en: 'Maintenance: 2500 cal. Surplus: 2700-3000 cal', es: 'Mantenimiento: 2500 cal. Superavit: 2700-3000 cal' },
    icon: 'add-circle-outline',
    category: 'nutrition',
  },
  {
    id: 'caloric_deficit',
    term: { en: 'Caloric Deficit', es: 'Deficit Calorico' },
    definition: {
      en: 'Eating fewer calories than your body burns. Required for fat loss. A deficit of 300-500 calories is sustainable and preserves muscle mass.',
      es: 'Comer menos calorias de las que tu cuerpo quema. Necesario para perder grasa. Un deficit de 300-500 calorias es sostenible y preserva masa muscular.',
    },
    example: { en: 'Maintenance: 2500 cal. Deficit: 2000-2200 cal', es: 'Mantenimiento: 2500 cal. Deficit: 2000-2200 cal' },
    icon: 'remove-circle-outline',
    category: 'nutrition',
  },
  {
    id: 'protein',
    term: { en: 'Protein Intake', es: 'Ingesta de Proteina' },
    definition: {
      en: 'The building block of muscle. Research recommends 1.6-2.2g per kg of bodyweight per day for muscle growth. Spread across 3-5 meals.',
      es: 'El bloque constructor del musculo. La investigacion recomienda 1.6-2.2g por kg de peso corporal al dia para crecimiento muscular. Distribuir en 3-5 comidas.',
    },
    example: { en: '80kg person: 128-176g protein/day (e.g., chicken, eggs, whey)', es: 'Persona de 80kg: 128-176g proteina/dia (ej. pollo, huevos, whey)' },
    icon: 'nutrition-outline',
    category: 'nutrition',
  },
];

export function getGlossaryByCategory(category: string): GlossaryTerm[] {
  return GLOSSARY.filter((term) => term.category === category);
}
