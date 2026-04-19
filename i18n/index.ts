import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en';
import es from './es';

export type Language = 'en' | 'es';
type Translations = typeof en;

const translations: Record<Language, Translations> = { en, es: es as any };

interface I18nContextType {
  t: Translations;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const I18nContext = createContext<I18nContextType>({
  t: en,
  lang: 'en',
  setLang: () => {},
});

const LANG_KEY = 'fitforge_lang';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('es');

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((saved) => {
      if (saved === 'en' || saved === 'es') setLangState(saved);
    });
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    AsyncStorage.setItem(LANG_KEY, newLang);
  }, []);

  const t = translations[lang];

  return React.createElement(
    I18nContext.Provider,
    { value: { t, lang, setLang } },
    children
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
