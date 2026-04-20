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

// Quotes specifically for women — empowerment, confidence, self-love
export const FEMALE_QUOTES: Quote[] = [
  { text: { en: 'She believed she could, so she did.', es: 'Ella creyo que podia, y lo hizo.' }, author: 'R.S. Grey' },
  { text: { en: 'A strong woman looks a challenge in the eye and gives it a wink.', es: 'Una mujer fuerte mira al desafio a los ojos y le guina.' }, author: 'Gina Carey' },
  { text: { en: 'The most beautiful thing a woman can wear is confidence.', es: 'Lo mas hermoso que una mujer puede usar es la confianza.' }, author: 'Blake Lively' },
  { text: { en: 'Strong women dont have attitudes. They have standards.', es: 'Las mujeres fuertes no tienen actitudes. Tienen estandares.' }, author: 'Marilyn Monroe' },
  { text: { en: 'You are more powerful than you know; you are beautiful just as you are.', es: 'Eres mas poderosa de lo que sabes; eres hermosa tal como eres.' }, author: 'Melissa Etheridge' },
  { text: { en: 'I am not afraid of storms, for I am learning how to sail my ship.', es: 'No le temo a las tormentas, porque estoy aprendiendo a navegar mi barco.' }, author: 'Louisa May Alcott' },
  { text: { en: 'The question isnt who is going to let me; its who is going to stop me.', es: 'La pregunta no es quien me va a dejar; es quien me va a detener.' }, author: 'Ayn Rand' },
  { text: { en: 'Every woman that finally figured out her worth, has picked up her suitcases of pride and boarded a flight to freedom.', es: 'Toda mujer que finalmente descubrio su valor, recogio sus maletas de orgullo y abordo un vuelo a la libertad.' }, author: 'Shannon L. Alder' },
];

// Quotes specifically for men — discipline, provider mindset, Tate, stoic warriors
export const MALE_QUOTES: Quote[] = [
  { text: { en: 'A mans only duty is to provide, protect, and conquer. Everything else is noise.', es: 'El unico deber de un hombre es proveer, proteger y conquistar. Todo lo demas es ruido.' }, author: 'Andrew Tate' },
  { text: { en: 'Hard times create strong men. Strong men create good times.', es: 'Los tiempos dificiles crean hombres fuertes. Los hombres fuertes crean buenos tiempos.' }, author: 'G. Michael Hopf' },
  { text: { en: 'Suffer the pain of discipline or suffer the pain of regret.', es: 'Sufre el dolor de la disciplina o sufre el dolor del arrepentimiento.' }, author: 'Andrew Tate' },
  { text: { en: 'A man who conquers himself is greater than one who conquers a thousand men in battle.', es: 'Un hombre que se conquista a si mismo es mas grande que uno que conquista a mil hombres en batalla.' }, author: 'Buddha' },
  { text: { en: 'Cost of being a man: nobody cares about your problems, work anyway.', es: 'El costo de ser hombre: a nadie le importan tus problemas, trabaja de todos modos.' }, author: 'Andrew Tate' },
  { text: { en: 'The iron never lies. 200 pounds is always 200 pounds.', es: 'El hierro nunca miente. 200 libras siempre son 200 libras.' }, author: 'Henry Rollins' },
  { text: { en: 'Pain is temporary. Quitting lasts forever.', es: 'El dolor es temporal. Rendirse dura para siempre.' }, author: 'Lance Armstrong' },
  { text: { en: 'You were born to be a warrior. Train like one.', es: 'Naciste para ser un guerrero. Entrena como uno.' }, author: 'David Goggins' },
];

export function getDailyQuote(gender?: string): Quote {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Mix: 50% general/stoic, 50% gender-specific
  if (gender && dayOfYear % 2 === 0) {
    const genderQuotes = gender === 'female' ? FEMALE_QUOTES : MALE_QUOTES;
    return genderQuotes[Math.floor(dayOfYear / 2) % genderQuotes.length];
  }

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
