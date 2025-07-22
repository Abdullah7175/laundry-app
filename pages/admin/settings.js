import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSettings() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('settings');
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();

  // Admin navigation items
  const navItems = [
    { id: 'dashboard', label: language === 'en' ? 'Dashboard' : 'لوحة القيادة', icon: '📊' },
    { id: 'orders', label: language === 'en' ? 'Orders' : 'الطلبات', icon: '📦' },
    { id: 'users', label: language === 'en' ? 'Users' : 'المستخدمين', icon: '👥' },
    { id: 'vendor', label: language === 'en' ? 'Vendors' : 'البائعين', icon: '🏢' },
    { id: 'assign-rider', label: language === 'en' ? 'Riders' : 'الراكبين', icon: '🏍️' },
    { id: 'customers', label: language === 'en' ? 'Customers' : 'العملاء', icon: '👥' },
    { id: 'analytics', label: language === 'en' ? 'Analytics' : 'التحليلات', icon: '📈' },
    { id: 'pricing', label: language === 'en' ? 'Pricing' : 'التسعير', icon: '💰' },
    { id: 'areas', label: language === 'en' ? 'Service Areas' : 'مناطق الخدمة', icon: '🗺️' },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'الإعدادات', icon: '⚙️' }
  ];

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user && user.type !== 'admin') {
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
              router.push('/admin');
            } else {
              router.push(`/admin/${item}`);
            }
          }} 
          language={language}
          userType="admin"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              {language === 'en' ? 'Admin Settings' : 'إعدادات المسؤول'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Manage your platform settings and preferences here.' 
                : 'إدارة إعدادات المنصة وتفضيلاتك هنا.'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-blue-800 mb-6">
              {language === 'en' ? 'General Settings' : 'الإعدادات العامة'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {language === 'en' ? 'Platform Name' : 'اسم المنصة'}
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-50" 
                  value="Nasi` Cleanings" 
                  readOnly 
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {language === 'en' ? 'Support Email' : 'البريد الإلكتروني للدعم'}
                </label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-50" 
                  value="support@nasicleanings.com" 
                  readOnly 
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {language === 'en' ? 'Default Language' : 'اللغة الافتراضية'}
                </label>
                <select className="w-full border border-gray-300 rounded-md p-3 bg-gray-50" value="en" readOnly>
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {language === 'en' ? 'Platform Currency' : 'عملة المنصة'}
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-50" 
                  value="SAR (Saudi Riyal)" 
                  readOnly 
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {language === 'en' ? 'Service Areas' : 'مناطق الخدمة'}
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-50" 
                  value="Riyadh, Jeddah, Dammam" 
                  readOnly 
                />
              </div>
              
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 w-full opacity-50 cursor-not-allowed" 
                disabled
              >
                {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 