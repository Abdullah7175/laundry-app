import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    // Check for language preference in localStorage
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // If user is already authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      redirectToDashboard();
    }
  }, [isAuthenticated]);
  
  const redirectToDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      switch (user.type) {
        case 'customer':
          router.push('/dashboard');
          break;
        case 'admin':
          router.push('/admin');
          break;
        case 'vendor':
          router.push('/vendor');
          break;
        case 'delivery':
          router.push('/delivery');
          break;
        case 'laundry':
          router.push('/laundry');
          break;
        default:
          router.push('/dashboard');
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(language === 'en' ? 'Please fill all fields' : 'يرجى ملء جميع الحقول');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const success = await login(email, password, userType);
      
      if (success) {
        // Remove demo credentials after successful login
        setEmail('');
        setPassword('');
        
        // Redirect to appropriate dashboard
        redirectToDashboard();
      } else {
        setError(language === 'en' ? 'Invalid credentials' : 'بيانات اعتماد غير صالحة');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(language === 'en' ? 'Failed to login' : 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };
  
  // For demo purposes, let's add quick login buttons for different user types
  const setDemoCredentials = (userType) => {
    switch (userType) {
      case 'customer':
        setEmail('customer@example.com');
        setPassword('customer123');
        setUserType('customer');
        break;
      case 'admin':
        setEmail('admin@example.com');
        setPassword('admin123');
        setUserType('admin');
        break;
      case 'vendor':
        setEmail('vendor@example.com');
        setPassword('vendor123');
        setUserType('vendor');
        break;
      case 'delivery':
        setEmail('delivery@example.com');
        setPassword('delivery123');
        setUserType('delivery');
        break;
      case 'laundry':
        setEmail('laundry@example.com');
        setPassword('laundry123');
        setUserType('laundry');
        break;
    }
  };
  
  return (
    <Layout title={language === 'en' ? 'Login | Nasi` Cleanings' : 'تسجيل الدخول | تنظيف الأرز'}>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-blue-800">
              {language === 'en' ? 'Sign in to your account' : 'تسجيل الدخول إلى حسابك'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {language === 'en' ? 'Or ' : 'أو '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                {language === 'en' ? 'create a new account' : 'إنشاء حساب جديد'}
              </Link>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  {language === 'en' ? 'Email address' : 'البريد الإلكتروني'}
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={language === 'en' ? 'Email address' : 'البريد الإلكتروني'}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={language === 'en' ? 'Password' : 'كلمة المرور'}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="user-type" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Login as' : 'تسجيل الدخول كـ'}
              </label>
              <select
                id="user-type"
                name="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="customer">{language === 'en' ? 'Customer' : 'عميل'}</option>
                <option value="admin">{language === 'en' ? 'Admin' : 'مدير'}</option>
                <option value="vendor">{language === 'en' ? 'Vendor' : 'بائع'}</option>
                <option value="delivery">{language === 'en' ? 'Delivery' : 'توصيل'}</option>
                <option value="laundry">{language === 'en' ? 'Laundry' : 'غسيل'}</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {language === 'en' ? 'Remember me' : 'تذكرني'}
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  {language === 'en' ? 'Forgot your password?' : 'نسيت كلمة المرور؟'}
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  language === 'en' ? 'Signing in...' : 'جاري تسجيل الدخول...'
                ) : (
                  language === 'en' ? 'Sign in' : 'تسجيل الدخول'
                )}
              </button>
            </div>
          </form>
          
          {/* Demo shortcuts for quick login - for development purposes */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {language === 'en' ? 'Quick login for demo' : 'تسجيل دخول سريع للعرض التوضيحي'}
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDemoCredentials('customer')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {language === 'en' ? 'Customer' : 'عميل'}
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {language === 'en' ? 'Admin' : 'مدير'}
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('vendor')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {language === 'en' ? 'Vendor' : 'بائع'}
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('delivery')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {language === 'en' ? 'Delivery' : 'توصيل'}
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('laundry')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 col-span-2"
              >
                {language === 'en' ? 'Laundry' : 'غسيل'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}