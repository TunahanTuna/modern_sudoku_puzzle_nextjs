import en from './en.json';
import tr from './tr.json';

export const dictionaries = {
  en,
  tr,
} as const;

export type Dictionary = typeof dictionaries.en;

export async function getDictionary(locale: keyof typeof dictionaries) {
  return dictionaries[locale];
}