export interface Quote {
  text: { en: string; es: string };
  author: string;
}

export const QUOTES: Quote[] = [
  // Stoic philosophy
  { text: { en: 'We suffer more in imagination than in reality.', es: 'Sufrimos mas en la imaginacion que en la realidad.' }, author: 'Seneca' },
  { text: { en: 'The impediment to action advances action. What stands in the way becomes the way.', es: 'El obstaculo a la accion impulsa la accion. Lo que se interpone se convierte en el camino.' }, author: 'Marcus Aurelius' },
  { text: { en: 'No man is free who is not master of himself.', es: 'Ningun hombre es libre si no es dueno de si mismo.' }, author: 'Epictetus' },
  { text: { en: 'Waste no more time arguing about what a good man should be. Be one.', es: 'No pierdas mas tiempo discutiendo que debe ser un buen hombre. Se uno.' }, author: 'Marcus Aurelius' },
  { text: { en: 'He who fears death will never do anything worthy of a living man.', es: 'Quien teme a la muerte nunca hara nada digno de un hombre vivo.' }, author: 'Seneca' },
  { text: { en: 'First say to yourself what you would be; and then do what you have to do.', es: 'Primero dite a ti mismo lo que serias; y luego haz lo que tengas que hacer.' }, author: 'Epictetus' },
  { text: { en: 'The soul becomes dyed with the color of its thoughts.', es: 'El alma se tine del color de sus pensamientos.' }, author: 'Marcus Aurelius' },
  { text: { en: 'Difficulties strengthen the mind, as labor does the body.', es: 'Las dificultades fortalecen la mente, como el trabajo fortalece el cuerpo.' }, author: 'Seneca' },
  { text: { en: 'It is not that we have a short time to live, but that we waste a lot of it.', es: 'No es que tengamos poco tiempo de vida, sino que desperdiciamos mucho.' }, author: 'Seneca' },
  { text: { en: 'You have power over your mind, not outside events. Realize this and you will find strength.', es: 'Tienes poder sobre tu mente, no sobre los eventos externos. Entiende esto y encontraras fuerza.' }, author: 'Marcus Aurelius' },

  // Andrew Tate - motivational
  { text: { en: "Arrogance is the cause of most first-world problems. Humility and hard work fix everything.", es: 'La arrogancia es la causa de la mayoria de los problemas. La humildad y el trabajo duro arreglan todo.' }, author: 'Andrew Tate' },
  { text: { en: 'The man who goes to the gym every single day regardless of how he feels will always beat the man who goes to the gym when he feels like going.', es: 'El hombre que va al gimnasio todos los dias sin importar como se sienta siempre superara al que va cuando tiene ganas.' }, author: 'Andrew Tate' },
  { text: { en: 'Your mind must be stronger than your feelings.', es: 'Tu mente debe ser mas fuerte que tus sentimientos.' }, author: 'Andrew Tate' },
  { text: { en: "Discipline is the key. You can't win the war against the world if you can't win the war against your own mind.", es: 'La disciplina es la clave. No puedes ganar la guerra contra el mundo si no puedes ganar la guerra contra tu propia mente.' }, author: 'Andrew Tate' },
  { text: { en: 'Close your eyes. Focus on making yourself feel excited, powerful. Visualize yourself conquering.', es: 'Cierra los ojos. Concentrate en sentirte emocionado, poderoso. Visualizate conquistando.' }, author: 'Andrew Tate' },

  // Fitness legends
  { text: { en: 'The last three or four reps is what makes the muscle grow.', es: 'Las ultimas tres o cuatro repeticiones son las que hacen crecer el musculo.' }, author: 'Arnold Schwarzenegger' },
  { text: { en: 'Everybody wants to be a bodybuilder, but nobody wants to lift no heavy weights.', es: 'Todos quieren ser fisicoculturistas, pero nadie quiere levantar pesos pesados.' }, author: 'Ronnie Coleman' },
  { text: { en: 'The only place where success comes before work is in the dictionary.', es: 'El unico lugar donde el exito viene antes que el trabajo es en el diccionario.' }, author: 'Vidal Sassoon' },
  { text: { en: 'The pain of discipline is nothing like the pain of disappointment.', es: 'El dolor de la disciplina no es nada comparado con el dolor de la decepcion.' }, author: 'Justin Langer' },
  { text: { en: 'Strength does not come from physical capacity. It comes from an indomitable will.', es: 'La fuerza no viene de la capacidad fisica. Viene de una voluntad indomable.' }, author: 'Mahatma Gandhi' },
];

export function getDailyQuote(): Quote {
  // Same quote all day, changes daily
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export function getGreeting(lang: 'en' | 'es'): string {
  const hour = new Date().getHours();
  if (lang === 'es') {
    if (hour < 12) return 'Buenos dias';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
