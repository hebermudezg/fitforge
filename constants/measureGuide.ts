import type { BodyPartKey } from '@/types/bodyParts';

// Short, practical "how to measure" tips shown in the measurement entry screen.
// Goal: remove the #1 friction — people not knowing where/how to place the tape.
// Bilingual (es default, en). Keep each tip to one clear sentence.
type Guide = { es: string; en: string };

export const MEASURE_GUIDE: Partial<Record<BodyPartKey, Guide>> = {
  neck: {
    es: 'Rodea la base del cuello, justo por debajo de la nuez. Cinta ajustada pero sin apretar.',
    en: 'Wrap around the base of the neck, just below the Adam’s apple. Snug, not tight.',
  },
  deltoids: {
    es: 'Mide alrededor de la parte más ancha de los hombros, pasando por la punta de cada hombro. Brazos relajados a los lados.',
    en: 'Measure around the widest part of the shoulders, over the tips of both shoulders. Arms relaxed at your sides.',
  },
  chest: {
    es: 'Rodea el pecho a la altura de los pezones, con los brazos abajo. Respira normal, no infles el pecho.',
    en: 'Wrap around the chest at nipple level, arms down. Breathe normally — don’t puff up.',
  },
  biceps: {
    es: 'Mide la parte más gruesa del brazo. Para flexionado: contrae el bíceps. Sé consistente: siempre igual.',
    en: 'Measure the thickest part of the upper arm. For flexed: contract the biceps. Be consistent every time.',
  },
  forearms: {
    es: 'Mide la parte más gruesa del antebrazo, con el brazo extendido y relajado.',
    en: 'Measure the thickest part of the forearm, arm extended and relaxed.',
  },
  gluteal: {
    es: 'Rodea la parte más prominente de los glúteos, de pie con los pies juntos.',
    en: 'Wrap around the fullest part of the glutes, standing with feet together.',
  },
  quadriceps: {
    es: 'Mide la parte más gruesa del muslo, justo debajo del glúteo. Marca la altura para repetir igual.',
    en: 'Measure the thickest part of the thigh, just below the glute. Note the height to repeat consistently.',
  },
  calves: {
    es: 'Mide la parte más gruesa de la pantorrilla, de pie con el peso repartido.',
    en: 'Measure the thickest part of the calf, standing with weight evenly distributed.',
  },
  weight: {
    es: 'Pésate en ayunas, por la mañana, después de ir al baño y antes de comer o beber.',
    en: 'Weigh yourself first thing in the morning, after the bathroom and before eating or drinking.',
  },
  bodyFat: {
    es: 'Usa una báscula de bioimpedancia, calibrador o las medidas. Mismo método y hora siempre.',
    en: 'Use a smart scale, caliper, or tape-based method. Same method and time every time.',
  },
  waist: {
    es: 'Rodea la cintura a la altura del ombligo. De pie, relajado, sin meter la barriga.',
    en: 'Wrap around the waist at navel level. Stand relaxed — don’t suck in your stomach.',
  },
  hips: {
    es: 'Rodea la parte más ancha de las caderas/glúteos, de pie con los pies juntos.',
    en: 'Wrap around the widest part of the hips/glutes, standing with feet together.',
  },
};

// Universal tip shown alongside any measurement.
export const MEASURE_TIP_GENERAL: Guide = {
  es: 'Mide a la misma hora (idealmente en la mañana), antes de entrenar. Cinta firme sin marcar la piel. Mide 2 veces y usa el promedio.',
  en: 'Measure at the same time (ideally morning), before training. Tape firm but not denting the skin. Measure twice and average.',
};
