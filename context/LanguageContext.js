import { createContext, useContext, useState, useEffect } from 'react';

// Create the language context
const LanguageContext = createContext();

// Translation dictionaries
const translations = {
  en: {
    admin: {
      users: "Users",
      user_management: "User Management",
      all_users: "All Users",
      manage_user_roles_and_permissions: "Manage user roles and permissions",
      search_users: "Search users...",
      name: "Name",
      email: "Email",
      role: "Role",
      status: "Status",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
      edit: "Edit",
      delete: "Delete",
      no_users_found: "No users found",
      
      vendors: "Vendors",
      vendor_management: "Vendor Management",
      all_vendors: "All Vendors",
      manage_vendors_and_restaurants: "Manage vendors and restaurants",
      search_vendors: "Search vendors...",
      vendor: "Vendor",
      contact: "Contact",
      cuisine: "Cuisine",
      rating: "Rating",
      add_vendor: "Add Vendor",
      no_vendors_found: "No vendors found",
      vendor_name: "Vendor Name",
      phone: "Phone",
      address: "Address",
      cuisine_type: "Cuisine Type",
      select_cuisine: "Select Cuisine",
      cancel: "Cancel",
      add_new_vendor: "Add New Vendor",
      activate: "Activate",
      deactivate: "Deactivate"
    }
  },
  ar: {
    admin: {
      users: "المستخدمين",
      user_management: "إدارة المستخدمين",
      all_users: "جميع المستخدمين",
      manage_user_roles_and_permissions: "إدارة أدوار المستخدمين والأذونات",
      search_users: "بحث المستخدمين...",
      name: "الاسم",
      email: "البريد الإلكتروني",
      role: "الدور",
      status: "الحالة",
      actions: "الإجراءات",
      active: "نشط",
      inactive: "غير نشط",
      edit: "تعديل",
      delete: "حذف",
      no_users_found: "لا يوجد مستخدمون",
      
      vendors: "البائعون",
      vendor_management: "إدارة البائعين",
      all_vendors: "جميع البائعين",
      manage_vendors_and_restaurants: "إدارة البائعين والمطاعم",
      search_vendors: "بحث البائعين...",
      vendor: "البائع",
      contact: "الاتصال",
      cuisine: "المطبخ",
      rating: "التقييم",
      add_vendor: "إضافة بائع",
      no_vendors_found: "لا يوجد بائعون",
      vendor_name: "اسم البائع",
      phone: "الهاتف",
      address: "العنوان",
      cuisine_type: "نوع المطبخ",
      select_cuisine: "اختر المطبخ",
      cancel: "إلغاء",
      add_new_vendor: "إضافة بائع جديد",
      activate: "تفعيل",
      deactivate: "تعطيل"
    }
  }
};

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
  const t = (key) => {
    // Split the key by dots to navigate the translation object
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Return the last key if translation not found (for debugging)
        console.warn(`Translation missing for key: ${key}`);
        return keys[keys.length - 1];
      }
    }
    
    return value;
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