import React, { createContext, useState } from "react";
import { translations } from "./translations";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children}) => {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'de' : 'en'));
    };

    return (
        <LanguageContext.Provider 
        value={{ 
            language, 
            translations: translations[language], 
            toggleLanguage }}>
            {children}
            </LanguageContext.Provider>
    );
};