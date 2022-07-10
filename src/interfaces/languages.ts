import type en from '../server/i18n/en/translation.json';

export type TranslationKeys = keyof typeof en;

export enum Languages {
  en = 'en',
}
