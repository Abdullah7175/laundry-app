import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Layout({ children, title = 'Bedding Laundry Service' }) {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    <div className={`${language === 'ar' ? 'rtl' : ''} min-h-screen flex flex-col`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Bedding laundry and dry cleaning service for all your bedding needs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-primary-700 text-white shadow-md relative z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => router.push('/')} className="flex items-center space-x-2">
              <span className="text-2xl md:text-3xl font-bold">
                {language === 'en' ? 'Bedding Laundry' : 'غسيل المفارش'}
              </span>
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-white hover:bg-primary-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-primary-100 transition-colors font-medium">
              {language === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <Link href="/services" className="text-white hover:text-primary-100 transition-colors font-medium">
              {language === 'en' ? 'Services' : 'الخدمات'}
            </Link>
            <Link href="/about" className="text-white hover:text-primary-100 transition-colors font-medium">
              {language === 'en' ? 'About' : 'عن الشركة'}
            </Link>
            <Link href="/contact" className="text-white hover:text-primary-100 transition-colors font-medium">
              {language === 'en' ? 'Contact' : 'اتصل بنا'}
            </Link>
            
            <button 
              className="bg-primary-800 hover:bg-primary-900 px-3 py-1 rounded text-sm transition-colors"
              onClick={toggleLanguage}
            >
              {language === 'en' ? 'العربية' : 'English'}
            </button>
            
            {router.pathname !== '/login' && router.pathname !== '/register' && !router.pathname.includes('/dashboard') && (
              <button 
                className="bg-white text-primary-700 hover:bg-primary-50 px-4 py-2 rounded-lg font-bold shadow-sm transition-colors"
                onClick={() => router.push('/login')}
              >
                {language === 'en' ? 'Login' : 'تسجيل الدخول'}
              </button>
            )}
          </nav>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary-800 py-2">
            <div className="container mx-auto px-4 space-y-1">
              <Link 
                href="/" 
                className="block py-2 px-3 rounded-lg text-white hover:bg-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === 'en' ? 'Home' : 'الرئيسية'}
              </Link>
              <Link 
                href="/services" 
                className="block py-2 px-3 rounded-lg text-white hover:bg-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === 'en' ? 'Services' : 'الخدمات'}
              </Link>
              <Link 
                href="/about" 
                className="block py-2 px-3 rounded-lg text-white hover:bg-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === 'en' ? 'About' : 'عن الشركة'}
              </Link>
              <Link 
                href="/contact" 
                className="block py-2 px-3 rounded-lg text-white hover:bg-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === 'en' ? 'Contact' : 'اتصل بنا'}
              </Link>
              
              <div className="flex flex-col sm:flex-row sm:justify-between pt-2 space-y-2 sm:space-y-0 sm:space-x-2 border-t border-primary-600 mt-2">
                <button 
                  className="py-2 px-3 rounded-lg font-medium bg-primary-600 hover:bg-primary-500 transition-colors"
                  onClick={toggleLanguage}
                >
                  {language === 'en' ? 'العربية' : 'English'}
                </button>
                
                {router.pathname !== '/login' && router.pathname !== '/register' && !router.pathname.includes('/dashboard') && (
                  <button 
                    className="py-2 px-3 rounded-lg font-medium bg-white text-primary-700 hover:bg-primary-50 transition-colors"
                    onClick={() => {
                      router.push('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {language === 'en' ? 'Login' : 'تسجيل الدخول'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{language === 'en' ? 'Bedding Laundry' : 'غسيل المفارش'}</h3>
              <p className="text-gray-300 mb-4">
                {language === 'en' 
                  ? 'Professional laundry service for all your bedding needs.' 
                  : 'خدمة غسيل احترافية لجميع احتياجات مفارش السرير الخاصة بك.'
                }
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{language === 'en' ? 'Quick Links' : 'روابط سريعة'}</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    {language === 'en' ? 'Home' : 'الرئيسية'}
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                    {language === 'en' ? 'Services' : 'الخدمات'}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    {language === 'en' ? 'About Us' : 'من نحن'}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    {language === 'en' ? 'Contact' : 'اتصل بنا'}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                    {language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{language === 'en' ? 'Services' : 'الخدمات'}</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/services#bed-sheets" className="text-gray-300 hover:text-white transition-colors">
                    {language === 'en' ? 'Bed Sheets' : 'ملاءات السرير'}
                  </Link>
                </li>
                <li>
                  <Link href="/services#pillowcases" className="text-gray-300 hover:text-white transition-colors">
                    {language === 'en' ? 'Pillowcases' : 'أكياس الوسائد'}
                  </Link>
                </li>
                <li>
                  <Link href="/services#duvet-covers" className="text-gray-300 hover:text-white transition-colors">
                    {language === 'en' ? 'Duvet Covers' : 'أغطية اللحاف'}
                  </Link>
                </li>
                <li>
                  <Link href="/services#blankets" className="text-gray-300 hover:text-white transition-colors">
                    {language === 'en' ? 'Blankets' : 'البطانيات'}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{language === 'en' ? 'Contact Us' : 'اتصل بنا'}</h4>
              <address className="not-italic text-gray-300 space-y-3">
                <p className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    {language === 'en' ? 'King Fahd Road, Riyadh, Saudi Arabia' : 'طريق الملك فهد، الرياض، المملكة العربية السعودية'}
                  </span>
                </p>
                <p className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@beddinglaundry.sa</span>
                </p>
                <p className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+966 50 123 4567</span>
                </p>
              </address>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} {language === 'en' ? 'Bedding Laundry. All rights reserved.' : 'غسيل المفارش. جميع الحقوق محفوظة.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}