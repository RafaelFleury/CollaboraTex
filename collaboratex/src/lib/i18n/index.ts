import { ptBR } from './pt-BR';
import { enUS } from './en-US';

// Default language
export const defaultLanguage = 'en-US';

// Available languages
export const languages = {
  'pt-BR': ptBR,
  'en-US': enUS,
};

// Get translations for a specific language
export function getTranslations(language = defaultLanguage) {
  return languages[language as keyof typeof languages] || languages[defaultLanguage];
}

// Current translations (can be enhanced with context in a real app)
export const t = getTranslations(); 