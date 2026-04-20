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

// Quotes for women — Serena Williams, Ronda Rousey, Michelle Obama, Oprah
export const FEMALE_QUOTES: Quote[] = [
  { text: { en: 'I am lucky that whatever fear I have inside me, my desire to win is always stronger.', es: 'Tengo suerte de que sin importar el miedo que sienta, mi deseo de ganar siempre es mas fuerte.' }, author: 'Serena Williams' },
  { text: { en: 'I am not looking to escape the pressure. I am embracing it. Pressure is what builds up in the chamber behind a bullet before it explodes out of the gun.', es: 'No estoy tratando de escapar de la presion. La estoy abrazando. La presion es lo que se acumula en la camara detras de una bala antes de explotar.' }, author: 'Ronda Rousey' },
  { text: { en: 'There is power in allowing yourself to be known and heard, in owning your unique story, in using your authentic voice.', es: 'Hay poder en permitirse ser conocida y escuchada, en ser duena de tu historia unica, en usar tu voz autentica.' }, author: 'Michelle Obama' },
  { text: { en: 'The success of every woman should be the inspiration to another. We should raise each other up.', es: 'El exito de cada mujer debe ser inspiracion para otra. Deberiamos levantarnos mutuamente.' }, author: 'Serena Williams' },
  { text: { en: 'I am scared all the time. You have to have fear in order to have courage. I am courageous because I am a scared person.', es: 'Tengo miedo todo el tiempo. Tienes que tener miedo para tener coraje. Soy valiente porque soy una persona asustada.' }, author: 'Ronda Rousey' },
  { text: { en: 'Self-esteem comes from being able to define the world in your own terms and refusing to abide by the judgments of others.', es: 'La autoestima viene de poder definir el mundo en tus propios terminos y rechazar los juicios de otros.' }, author: 'Oprah Winfrey' },
  { text: { en: 'When someone is cruel or acts like a bully, you do not stoop to their level. When they go low, we go high.', es: 'Cuando alguien es cruel o actua como un maton, no te rebajas a su nivel. Cuando bajan, nosotras subimos.' }, author: 'Michelle Obama' },
  { text: { en: 'To be a fighter, you have to be passionate. That passion escapes as tears from my eyes, sweat from my pores, blood from my veins.', es: 'Para ser luchadora, tienes que ser apasionada. Esa pasion escapa como lagrimas de mis ojos, sudor de mis poros, sangre de mis venas.' }, author: 'Ronda Rousey' },
  { text: { en: 'Only when you require no approval from outside yourself can you own yourself.', es: 'Solo cuando no requieres aprobacion de otros puedes ser duena de ti misma.' }, author: 'Oprah Winfrey' },
  { text: { en: 'I am strong, and I am powerful, and I am beautiful at the same time.', es: 'Soy fuerte, soy poderosa, y soy hermosa al mismo tiempo.' }, author: 'Serena Williams' },
];

// Quotes for men — Tate, Goggins, Jocko, Stoics
export const MALE_QUOTES: Quote[] = [
  { text: { en: 'I do not believe in motivation. I believe in discipline. The man who goes to the gym every single day regardless of how he feels will always beat the man who goes when he feels like going.', es: 'No creo en la motivacion. Creo en la disciplina. El hombre que va al gimnasio todos los dias sin importar como se sienta siempre vencera al que va cuando le da la gana.' }, author: 'Andrew Tate' },
  { text: { en: 'The only way you gain mental toughness is to do things you are not happy doing. If you continue doing things that make you happy, you are not getting stronger.', es: 'La unica forma de ganar dureza mental es hacer cosas que no te hacen feliz. Si continuas haciendo solo lo que te hace feliz, no te estas fortaleciendo.' }, author: 'David Goggins' },
  { text: { en: 'When you think that you are done, you are only 40 percent into what your body is capable of doing.', es: 'Cuando crees que has terminado, solo has llegado al 40% de lo que tu cuerpo es capaz de hacer.' }, author: 'David Goggins' },
  { text: { en: 'Discipline equals freedom. Do not expect to be motivated every day. Count on discipline.', es: 'La disciplina es igual a la libertad. No esperes estar motivado todos los dias. Confia en la disciplina.' }, author: 'Jocko Willink' },
  { text: { en: 'The hallmark of a real man is controlling himself, controlling his emotions, and acting appropriately regardless of how he feels.', es: 'La marca de un verdadero hombre es controlarse a si mismo, controlar sus emociones y actuar apropiadamente sin importar como se sienta.' }, author: 'Andrew Tate' },
  { text: { en: 'Do not fight stress. Embrace it. Use it to make yourself sharper, smarter, and more effective.', es: 'No luches contra el estres. Abrazalo. Usalo para hacerte mas agudo, inteligente y efectivo.' }, author: 'Jocko Willink' },
  { text: { en: 'Suffering is a test. That is all it is. Pain unlocks a secret doorway in the mind that leads to peak performance.', es: 'El sufrimiento es una prueba. Eso es todo. El dolor abre una puerta secreta en la mente que lleva al maximo rendimiento.' }, author: 'David Goggins' },
  { text: { en: 'I judge you unfortunate because you have never lived through misfortune. No one can know what you are capable of without an opponent.', es: 'Te juzgo desafortunado porque nunca has vivido la adversidad. Nadie puede saber de que eres capaz sin un oponente.' }, author: 'Seneca' },
  { text: { en: 'Hard times create strong men. Strong men create good times. Good times create weak men. Weak men create hard times.', es: 'Los tiempos dificiles crean hombres fuertes. Los hombres fuertes crean buenos tiempos. Los buenos tiempos crean hombres debiles. Los hombres debiles crean tiempos dificiles.' }, author: 'G. Michael Hopf' },
  { text: { en: 'The iron never lies to you. Two hundred pounds is always two hundred pounds.', es: 'El hierro nunca te miente. Doscientas libras siempre son doscientas libras.' }, author: 'Henry Rollins' },
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
