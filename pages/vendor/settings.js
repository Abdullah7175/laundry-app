import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function VendorSettings() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('settings');
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();

  // Vendor navigation items
  const navItems = [
    { id: 'dashboard', label: language === 'en' ? 'Dashboard' : 'لوحة القيادة', icon: '📊' },
    { id: 'orders', label: language === 'en' ? 'Orders' : 'الطلبات', icon: '📦' },
    { id: 'pricing', label: language === 'en' ? 'Pricing' : 'التسعير', icon: '💰' },
    { id: 'analytics', label: language === 'en' ? 'Analytics' : 'التحليلات', icon: '📈' },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'الإعدادات', icon: '⚙️' }
  ];

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user && user.type !== 'vendor') {
      router.push('/');
      return;
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
        <Sidebar 
          navItems={navItems} 
          activeItem={activeTab} 
          setActiveItem={(item) => {
            setActiveTab(item);
            if (item === 'dashboard') {
              router.push('/vendor');
            } else {
              router.push(`/vendor/${item}`);
            }
          }} 
          language={language}
          userType="vendor"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              {language === 'en' ? 'Settings' : 'الإعدادات'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' ? 'Manage your vendor account settings here.' : 'إدارة إعدادات حساب البائع هنا.'}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              {language === 'en' ? 'Account Settings' : 'إعدادات الحساب'}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                {language === 'en' ? 'Vendor Name' : 'اسم البائع'}
              </label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-md p-3" 
                value="Nasi` Vendor" 
                readOnly 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                {language === 'en' ? 'Contact Email' : 'البريد الإلكتروني للتواصل'}
              </label>
              <input 
                type="email" 
                className="w-full border border-gray-300 rounded-md p-3" 
                value="vendor@nasicleanings.com" 
                readOnly 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                {language === 'en' ? 'Default Language' : 'اللغة الافتراضية'}
              </label>
              <select 
                className="w-full border border-gray-300 rounded-md p-3" 
                value="en" 
                readOnly
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 w-full" 
              disabled
            >
              {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 