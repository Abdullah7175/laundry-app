import { createContext, useContext, useState, useEffect } from 'react';

// Create the language context
const LanguageContext = createContext();

// Language provider component
export function LanguageProvider({ children }) {
  // Default language is English
  const [language, setLanguage] = useState('en');
  
  // Check if localStorage is available (not during SSR)
  const isClient = typeof window !== 'undefined';
  
  useEffect(() => {
    // Get stored language preference if available
    if (isClient) {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    }
  }, [isClient]);
  
  // Toggle between English and Arabic
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    
    // Store preference in localStorage
    if (isClient) {
      localStorage.setItem('language', newLanguage);
      
      // Update document direction for RTL/LTR
      if (newLanguage === 'ar') {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
      } else {
        document.documentElement.dir = 'ltr';
        document.body.classList.remove('rtl');
      }
    }
  };
  
  // Set language explicitly (useful for language selection menus)
  const setLanguageExplicitly = (lang) => {
    if (lang !== language && (lang === 'en' || lang === 'ar')) {
      setLanguage(lang);
      
      // Store preference in localStorage
      if (isClient) {
        localStorage.setItem('language', lang);
        
        // Update document direction for RTL/LTR
        if (lang === 'ar') {
          document.documentElement.dir = 'rtl';
          document.body.classList.add('rtl');
        } else {
          document.documentElement.dir = 'ltr';
          document.body.classList.remove('rtl');
        }
      }
    }
  };
  
  // Get text based on current language
  const t = (en, ar) => {
    return language === 'en' ? en : ar;
  };
  
  // Update document direction on initial load
  useEffect(() => {
    if (isClient && language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
    }
  }, [isClient, language]);
  
  // Expose language state and functions to consumers
  const value = {
    language,
    toggleLanguage,
    setLanguage: setLanguageExplicitly,
    t,
    isRTL: language === 'ar'
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for using the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;