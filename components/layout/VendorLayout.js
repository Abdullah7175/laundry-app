import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import Notification from '../ui/Notification';

const VendorLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const { notifications } = useNotification();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Redirect if not vendor
    if (user && user.type !== 'vendor') {
      router.push('/');
    } else if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user || user.type !== 'vendor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-blue-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-white text-2xl font-bold">{t('app_name')}</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
                              <Link href="/vendor" className={`${router.pathname === '/vendor' || router.pathname === '/vendor/dashboard' ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                  <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t('vendor.dashboard')}
                </Link>
              <Link href="/vendor/orders" className={`${router.pathname === '/vendor/orders' ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {t('vendor.orders')}
              </Link>
              <Link href="/vendor/services" className={`${router.pathname === '/vendor/services' ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t('vendor.services')}
              </Link>
              <Link href="/vendor/analytics" className={`${router.pathname === '/vendor/analytics' ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t('vendor.analytics')}
              </Link>
              <div className="pt-4 mt-4 border-t border-blue-800">
                <Link href="/" className="text-white hover:bg-blue-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('nav.home')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-white hover:bg-blue-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('nav.logout')}
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <div className={`${isSidebarOpen ? 'fixed inset-0 z-40 flex' : 'hidden'}`}>
          <div className={`${isSidebarOpen ? 'fixed inset-0' : 'hidden'}`}>
            <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={toggleSidebar}></div>
          </div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-700">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-white text-2xl font-bold">{t('app_name')}</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                <Link href="/vendor" className={`${router.pathname === '/vendor' || router.pathname === '/vendor/dashboard' ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                  <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t('vendor.dashboard')}
                </Link>
                <Link href="/vendor/orders" className={`${router.pathname === '/vendor/orders' ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                  <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {t('vendor.orders')}
                </Link>
                <Link href="/vendor/services" className={`${router.pathname === '/vendor/services' ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                  <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('vendor.services')}
                </Link>
                <Link href="/vendor/analytics" className={`${router.pathname === '/vendor/analytics' ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                  <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {t('vendor.analytics')}
                </Link>
                <Link href="/vendor/pricing" className={`${router.pathname === '/vendor/pricing' ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                  <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('vendor.pricing')}
                </Link>

                <div className="pt-4 mt-4 border-t border-blue-800">
                  <Link href="/" className="text-white hover:bg-blue-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                    <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('nav.home')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-white hover:bg-blue-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  >
                    <svg className="mr-3 h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('nav.logout')}
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Display notifications */}
      <div className="fixed bottom-0 right-0 p-6 z-50">
        {notifications.map((notification) => (
          <Notification 
            key={notification.id} 
            id={notification.id}
            type={notification.type} 
            message={notification.message} 
          />
        ))}
      </div>
    </div>
  );
};

export default VendorLayout;
