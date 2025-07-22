import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';

export default function DeliveryLayout({ children, title }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { notifications, removeNotification } = useNotification();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Function to determine the active tab
  function getActiveTab() {
    const path = router.pathname;
    if (path === '/delivery') return 'dashboard';
    if (path === '/delivery/orders') return 'orders';
    if (path === '/delivery/history') return 'history';
    if (path === '/delivery/earnings') return 'earnings';
    if (path === '/delivery/profile') return 'profile';
    return '';
  }
  
  const activeTab = getActiveTab();
  
  // Navigation items with icons
  const navItems = [
    {
      id: 'dashboard',
      href: '/delivery',
      label: language === 'en' ? 'Dashboard' : 'لوحة التحكم',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'orders',
      href: '/delivery/orders',
      label: language === 'en' ? 'Active Orders' : 'الطلبات النشطة',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      id: 'history',
      href: '/delivery/history',
      label: language === 'en' ? 'History' : 'السجل',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'earnings',
      href: '/delivery/earnings',
      label: language === 'en' ? 'Earnings' : 'الأرباح',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'profile',
      href: '/delivery/profile',
      label: language === 'en' ? 'My Profile' : 'ملفي الشخصي',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Head>
        <title>{title ? `${title} | CLEANING` : 'Nasi` Cleanings Delivery App'}</title>
        <meta name="description" content="Nasi` Cleanings - Delivery App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-md ${
              notification.type === 'success' ? 'bg-green-50 text-green-800 border-green-500' :
              notification.type === 'error' ? 'bg-red-50 text-red-800 border-red-500' :
              notification.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border-yellow-500' :
              'bg-blue-50 text-blue-800 border-blue-500'
            } border-l-4 flex items-start justify-between`}
          >
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Mobile Header */}
      <header className="bg-white shadow-sm lg:hidden">
        <div className="px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="text-center">
            <h1 className="text-lg font-bold text-primary-600">
              {language === 'en' ? 'Delivery App' : 'تطبيق التوصيل'}
            </h1>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="font-medium text-sm">
                {language === 'en' ? 'AR' : 'EN'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-md border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-600">
                {language === 'en' ? 'Nasi` Cleanings' : 'تنظيف ناسي'}
                </h1>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Delivery App' : 'تطبيق التوصيل'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="px-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.id} href={item.href} legacyBehavior>
                  <a className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === item.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    <span className={`${activeTab === item.id ? 'text-primary-600' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    <span className="ml-3">{item.label}</span>
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-primary-100 p-2 rounded-full">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Delivery User'}</p>
                <p className="text-xs text-gray-500">
                  {language === 'en' ? 'Delivery Personnel' : 'موظف توصيل'}
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-3">
              <button
                onClick={toggleLanguage}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
            
            <div className="relative flex flex-col w-80 max-w-xs bg-white h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-600 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h1 className="text-lg font-bold text-primary-600">
                      {language === 'en' ? 'Nasi` Cleanings' : 'تنظيف ناسي'}
                    </h1>
                  </div>
                  
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 py-6 overflow-y-auto">
                <nav className="px-4 space-y-2">
                  {navItems.map((item) => (
                    <Link key={item.id} href={item.href} legacyBehavior>
                      <a 
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                          activeTab === item.id
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className={`${activeTab === item.id ? 'text-primary-600' : 'text-gray-500'}`}>
                          {item.icon}
                        </span>
                        <span className="ml-3">{item.label}</span>
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Delivery User'}</p>
                    <p className="text-xs text-gray-500">
                      {language === 'en' ? 'Delivery Personnel' : 'موظف توصيل'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={toggleLanguage}
                    className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {language === 'en' ? 'العربية' : 'English'}
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {title && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 hidden lg:block">{title}</h1>
              </div>
            )}
            
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border-t border-gray-200 fixed bottom-0 inset-x-0 z-30">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} legacyBehavior>
              <a className={`flex flex-col items-center justify-center ${
                activeTab === item.id ? 'text-primary-600' : 'text-gray-500'
              }`}>
                <span>{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}