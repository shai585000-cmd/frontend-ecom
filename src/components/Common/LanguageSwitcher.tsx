import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'fr';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 hover:border-red-500 hover:text-red-600 transition-colors text-sm font-medium text-gray-600"
      title={currentLang === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <span className="text-base leading-none">
        {currentLang === 'fr' ? '🇫🇷' : '🇬🇧'}
      </span>
      <span className="hidden sm:inline uppercase text-xs font-bold">
        {currentLang === 'fr' ? 'FR' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
