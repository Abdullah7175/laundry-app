import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    
    // Validate inputs
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError(language === 'en' ? 'Please fill all fields' : 'يرجى ملء جميع الحقول');
      return;
    }
    
    if (password !== confirmPassword) {
      setError(language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const success = await register(name, email, phone, password, userType);
      
      if (success) {
        // Clear form
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to appropriate dashboard
        redirectToDashboard();
      } else {
        setError(language === 'en' ? 'Failed to register' : 'فشل في التسجيل');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(language === 'en' ? 'Failed to register' : 'فشل في التسجيل');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout title={language === 'en' ? 'Register | Bedding Laundry' : 'التسجيل | غسيل المفارش'}>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-blue-800">
              {language === 'en' ? 'Create a new account' : 'إنشاء حساب جديد'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {language === 'en' ? 'Or ' : 'أو '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                {language === 'en' ? 'sign in to your account' : 'تسجيل الدخول إلى حسابك'}
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
                <label htmlFor="name" className="sr-only">
                  {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                />
              </div>
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={language === 'en' ? 'Email address' : 'البريد الإلكتروني'}
                />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">
                  {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={language === 'en' ? 'Password' : 'كلمة المرور'}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  {language === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={language === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="user-type" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Register as' : 'التسجيل كـ'}
              </label>
              <select
                id="user-type"
                name="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="customer">{language === 'en' ? 'Customer' : 'عميل'}</option>
                <option value="vendor">{language === 'en' ? 'Vendor' : 'بائع'}</option>
                <option value="delivery">{language === 'en' ? 'Delivery' : 'توصيل'}</option>
                <option value="laundry">{language === 'en' ? 'Laundry' : 'غسيل'}</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {language === 'en' 
                  ? 'Note: Admin accounts can only be created by existing admins.' 
                  : 'ملاحظة: يمكن إنشاء حسابات المسؤول فقط من قبل المسؤولين الحاليين.'
                }
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                {language === 'en' 
                  ? 'I agree to the Terms of Service and Privacy Policy' 
                  : 'أوافق على شروط الخدمة وسياسة الخصوصية'
                }
              </label>
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
                  language === 'en' ? 'Registering...' : 'جاري التسجيل...'
                ) : (
                  language === 'en' ? 'Register' : 'تسجيل'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}