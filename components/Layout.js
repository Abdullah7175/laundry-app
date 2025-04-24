import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Layout({ children, title = 'Bedding Laundry Service' }) {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    // Check for language preference in localStorage
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);
  
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };
  
  return (
    <div className={language === 'ar' ? 'rtl' : ''}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Bedding laundry and dry cleaning service for all your bedding needs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-blue-800 text-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold cursor-pointer" onClick={() => router.push('/')}>
              {language === 'en' ? 'Bedding Laundry' : 'غسيل المفارش'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded text-sm"
              onClick={toggleLanguage}
            >
              {language === 'en' ? 'العربية' : 'English'}
            </button>
            
            {router.pathname !== '/login' && router.pathname !== '/register' && !router.pathname.includes('/dashboard') && (
              <button 
                className="bg-white text-blue-800 hover:bg-blue-100 px-4 py-2 rounded-md font-medium"
                onClick={() => router.push('/login')}
              >
                {language === 'en' ? 'Login' : 'تسجيل الدخول'}
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{language === 'en' ? 'Bedding Laundry' : 'غسيل المفارش'}</h3>
              <p className="text-gray-300">
                {language === 'en' 
                  ? 'Professional laundry service for all your bedding needs.' 
                  : 'خدمة غسيل احترافية لجميع احتياجات مفارش السرير الخاصة بك.'
                }
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3">{language === 'en' ? 'Quick Links' : 'روابط سريعة'}</h4>
              <ul className="space-y-2">
                <li>
                  <button className="text-gray-300 hover:text-white" onClick={() => router.push('/')}>
                    {language === 'en' ? 'Home' : 'الرئيسية'}
                  </button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-white" onClick={() => router.push('/services')}>
                    {language === 'en' ? 'Services' : 'الخدمات'}
                  </button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-white" onClick={() => router.push('/about')}>
                    {language === 'en' ? 'About Us' : 'من نحن'}
                  </button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-white" onClick={() => router.push('/contact')}>
                    {language === 'en' ? 'Contact' : 'اتصل بنا'}
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3">{language === 'en' ? 'Contact Us' : 'اتصل بنا'}</h4>
              <address className="not-italic text-gray-300">
                <p className="mb-2">
                  {language === 'en' ? 'Address: King Fahd Road, Riyadh, Saudi Arabia' : 'العنوان: طريق الملك فهد، الرياض، المملكة العربية السعودية'}
                </p>
                <p className="mb-2">
                  {language === 'en' ? 'Email: info@beddinglaundry.sa' : 'البريد الإلكتروني: info@beddinglaundry.sa'}
                </p>
                <p>
                  {language === 'en' ? 'Phone: +966 50 123 4567' : 'الهاتف: +966 50 123 4567'}
                </p>
              </address>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} {language === 'en' ? 'Bedding Laundry. All rights reserved.' : 'غسيل المفارش. جميع الحقوق محفوظة.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}