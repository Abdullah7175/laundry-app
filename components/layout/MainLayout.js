import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import Notification from '../ui/Notification';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const { notifications } = useNotification();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <a className="text-2xl font-bold text-blue-600">{t('app_name')}</a>
                </Link>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/">
                  <a className={`${router.pathname === '/' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    {t('nav.home')}
                  </a>
                </Link>
                <Link href="/customer/service">
                  <a className={`${router.pathname === '/customer/service' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    {t('nav.services')}
                  </a>
                </Link>
                {user && (
                  <Link href="/customer/orders">
                    <a className={`${router.pathname === '/customer/orders' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                      {t('nav.orders')}
                    </a>
                  </Link>
                )}
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={toggleLanguage}
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              {user ? (
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-4">
                    {user.role === 'admin' && (
                      <Link href="/admin/dashboard">
                        <a className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          {t('admin.dashboard')}
                        </a>
                      </Link>
                    )}
                    {user.role === 'vendor' && (
                      <Link href="/vendor/dashboard">
                        <a className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          {t('vendor.dashboard')}
                        </a>
                      </Link>
                    )}
                    {user.role === 'delivery' && (
                      <Link href="/delivery/dashboard">
                        <a className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          {t('delivery.dashboard')}
                        </a>
                      </Link>
                    )}
                    {user.role === 'laundry' && (
                      <Link href="/laundry/dashboard">
                        <a className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          {t('laundry.dashboard')}
                        </a>
                      </Link>
                    )}
                    <Link href="/customer/profile">
                      <a className="text-sm font-medium text-gray-700 hover:text-gray-800">
                        {user.name}
                      </a>
                    </Link>
                    <button
                      type="button"
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      onClick={handleLogout}
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/login">
                    <a className="text-sm font-medium text-gray-700 hover:text-gray-800">
                      {t('nav.login')}
                    </a>
                  </Link>
                  <Link href="/auth/register">
                    <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      {t('nav.register')}
                    </a>
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link href="/">
                <a className={`${router.pathname === '/' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                  {t('nav.home')}
                </a>
              </Link>
              <Link href="/customer/service">
                <a className={`${router.pathname === '/customer/service' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                  {t('nav.services')}
                </a>
              </Link>
              {user && (
                <Link href="/customer/orders">
                  <a className={`${router.pathname === '/customer/orders' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                    {t('nav.orders')}
                  </a>
                </Link>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{user.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {user.role === 'admin' && (
                      <Link href="/admin/dashboard">
                        <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                          {t('admin.dashboard')}
                        </a>
                      </Link>
                    )}
                    {user.role === 'vendor' && (
                      <Link href="/vendor/dashboard">
                        <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                          {t('vendor.dashboard')}
                        </a>
                      </Link>
                    )}
                    {user.role === 'delivery' && (
                      <Link href="/delivery/dashboard">
                        <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                          {t('delivery.dashboard')}
                        </a>
                      </Link>
                    )}
                    {user.role === 'laundry' && (
                      <Link href="/laundry/dashboard">
                        <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                          {t('laundry.dashboard')}
                        </a>
                      </Link>
                    )}
                    <Link href="/customer/profile">
                      <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                        {t('nav.profile')}
                      </a>
                    </Link>
                    <button
                      type="button"
                      className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-1">
                  <Link href="/auth/login">
                    <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                      {t('nav.login')}
                    </a>
                  </Link>
                  <Link href="/auth/register">
                    <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                      {t('nav.register')}
                    </a>
                  </Link>
                </div>
              )}
              <div className="mt-3 px-4">
                <button
                  type="button"
                  className="w-full text-left block py-2 text-base font-medium text-gray-500 hover:text-gray-800"
                  onClick={toggleLanguage}
                >
                  {language === 'en' ? 'العربية' : 'English'}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-xl font-bold text-blue-600">{t('app_name')}</span>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} {t('app_name')}. {t('tagline')}
              </p>
            </div>
          </div>
        </div>
      </footer>

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

export default MainLayout;
