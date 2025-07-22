import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const analytics = {
  totalOrders: 120,
  totalRevenue: 3500,
  completionRate: 92,
};

export default function VendorAnalytics() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('analytics');
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
              {language === 'en' ? 'Analytics' : 'التحليلات'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' ? 'View your business analytics and performance here.' : 'عرض تحليلات أعمالك وأدائك هنا.'}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              {language === 'en' ? 'Overview' : 'نظرة عامة'}
            </h2>
            <ul className="space-y-4">
              <li className="flex justify-between text-lg">
                <span>{language === 'en' ? 'Total Orders:' : 'إجمالي الطلبات:'}</span>
                <span className="font-bold text-blue-700">{analytics.totalOrders}</span>
              </li>
              <li className="flex justify-between text-lg">
                <span>{language === 'en' ? 'Total Revenue (SAR):' : 'إجمالي الإيرادات (ريال):'}</span>
                <span className="font-bold text-green-700">{analytics.totalRevenue}</span>
              </li>
              <li className="flex justify-between text-lg">
                <span>{language === 'en' ? 'Completion Rate:' : 'معدل الإنجاز:'}</span>
                <span className="font-bold text-purple-700">{analytics.completionRate}%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
} 