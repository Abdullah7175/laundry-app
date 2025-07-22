import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const sampleOrders = [
  { id: 101, customer: 'Ahmed Mohammed', date: '2024-06-01', status: 'Pending', total: '120.00' },
  { id: 102, customer: 'Sara Abdullah', date: '2024-06-02', status: 'Delivered', total: '95.00' },
  { id: 103, customer: 'Khalid Al-Harbi', date: '2024-06-03', status: 'Processing', total: '75.00' },
];

export default function VendorOrders() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('orders');
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
              {language === 'en' ? 'Orders' : 'الطلبات'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' ? 'View and manage your recent orders here.' : 'عرض وإدارة طلباتك الحديثة هنا.'}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              {language === 'en' ? 'Recent Orders' : 'الطلبات الحديثة'}
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Order ID' : 'رقم الطلب'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Customer' : 'العميل'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Date' : 'التاريخ'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Status' : 'الحالة'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Total (SAR)' : 'الإجمالي (ريال)'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleOrders.map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-800">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{order.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
} 