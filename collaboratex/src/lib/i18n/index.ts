import { ptBR } from './pt-BR';

// Default language
export const defaultLanguage = 'pt-BR';

// Available languages
export const languages = {
  'pt-BR': ptBR,
};

// Get translations for a specific language
export function getTranslations(language = defaultLanguage) {
  return languages[language as keyof typeof languages] || languages[defaultLanguage];
}

// Current translations (can be enhanced with context in a real app)
export const t = getTranslations(); 