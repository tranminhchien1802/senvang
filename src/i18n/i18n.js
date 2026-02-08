import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import vi from './locales/vi/translation.json';

// Configure i18n
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      vi: {
        translation: vi
      }
    },
    lng: 'vi', // Only Vietnamese language
    debug: false,

    interpolation: {
      escapeValue: false // React already protects against XSS
    }
  });

export default i18n;