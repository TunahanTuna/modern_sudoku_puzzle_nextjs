import enTranslations from './dictionaries/en.json';
import trTranslations from './dictionaries/tr.json';

type TranslationDictionary = typeof enTranslations;

const translations: { [key: string]: TranslationDictionary } = {
  en: enTranslations,
  tr: trTranslations,
};

export function getTranslation(language: string, key: string): string {
  const keys = key.split('.');
  let translation: any = translations[language];

  for (const k of keys) {
    if (!translation || typeof translation !== 'object') {
      return key;
    }
    translation = translation[k];
  }

  return translation || key;
}

export function useTranslation(language: string) {
  return (key: string) => getTranslation(language, key);
}