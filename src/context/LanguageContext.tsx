import React, { createContext, useState, useContext } from 'react';

interface LanguageContextType {
  language: string;
  changeLanguage: (newLanguage: string) => void;
  getTexts: () => Record<string, string>;
}

interface CustomizeConfigurationType {
  language?: Record<string, Record<string, string>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


const defaultLanguageData = {
  en: {
    headerText: 'Knovvu',
    bottomInputText: 'Please write a message',
    closeModalText: 'Are you sure you want to exit chat?',
    closeModalYesButtonText: 'Yes',
    closeModalNoButtonText: 'No',
  },
};

export const LanguageProvider: React.FC<{ customizeConfiguration?: CustomizeConfigurationType }> = ({
  children,
  customizeConfiguration,
}) => {
  let languages = customizeConfiguration?.language ?? {};

  if (Object.keys(languages).length === 0) {
    languages = defaultLanguageData;
  }

  const languageKeys = Object.keys(languages);
  const defaultLanguage = languageKeys.length > 0 ? languageKeys[0] : 'EN';

  const [language, setLanguage] = useState(defaultLanguage);
  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const getTexts = () => languages[language];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, getTexts }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
