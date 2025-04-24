import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import BookingForm from '../../components/BookingForm';
import OrderCard from '../../components/OrderCard';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { orders, getCustomerOrders } = useOrder();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState('en');
  const [recentOrders, setRecentOrders] = useState([]);
  
  useEffect(() => {
    // Check for language preference in localStorage
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    
    // Load customer orders
    if (user && user.id) {
      const loadOrders = async () => {
        try {
          await getCustomerOrders(user.id);
        } catch (err) {
          console.error('Error loading orders:', err);
        }
      };
      
      loadOrders();
    }
  }, [isAuthenticated, loading, router, user, getCustomerOrders]);
  
  // Update recent orders when orders change
  useEffect(() => {
    if (orders && orders.length > 0) {
      // Sort by created date (most recent first) and take the first 3
      const sorted = [...orders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 3);
      
      setRecentOrders(sorted);
    }
  }, [orders]);
  
  // Navigation items
  const navItems = [
    { id: 'dashboard', label: language === 'en' ? 'Dashboard' : 'لوحة التحكم', icon: '📊' },
    { id: 'book', label: language === 'en' ? 'Book Service' : 'حجز الخدمة', icon: '📝' },
    { id: 'orders', label: language === 'en' ? 'My Orders' : 'طلباتي', icon: '📦' },
    { id: 'profile', label: language === 'en' ? 'Profile' : 'الملف الشخصي', icon: '👤' }
  ];
  
  if (loading || !user) {
    return (
      <Layout title={language === 'en' ? 'Loading... | Bedding Laundry' : 'جاري التحميل... | غسيل المفارش'}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={language === 'en' ? 'Dashboard | Bedding Laundry' : 'لوحة التحكم | غسيل المفارش'}>
      <div className="bg-gray-50 min-h-screen pb-12">
        <div className="bg-primary-700 text-white pt-8 pb-24">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">
              {language === 'en' ? 'Customer Dashboard' : 'لوحة تحكم العميل'}
            </h1>
            <p className="mt-2">
              {language === 'en' ? `Welcome back, ${user.name}` : `مرحباً بعودتك، ${user.name}`}
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 -mt-16">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-64 flex-shrink-0">
              <Sidebar 
                navItems={navItems} 
                activeItem={activeTab} 
                setActiveItem={setActiveTab} 
                language={language}
                userType="customer"
              />
            </div>
            
            {/* Main content */}
            <div className="flex-grow">
              {/* Dashboard tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            {language === 'en' ? 'Total Orders' : 'إجمالي الطلبات'}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {orders ? orders.length : 0}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 text-green-600 p-3 rounded-full">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            {language === 'en' ? 'Completed Orders' : 'الطلبات المكتملة'}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {orders ? orders.filter(o => o.status === 'delivered').length : 0}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            {language === 'en' ? 'Loyalty Points' : 'نقاط الولاء'}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {orders
                              ? orders.reduce((total, order) => total + (order.loyaltyPoints || 0), 0)
                              : 0
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent orders */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">
                        {language === 'en' ? 'Recent Orders' : 'الطلبات الأخيرة'}
                      </h2>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {language === 'en' ? 'View All' : 'عرض الكل'}
                      </button>
                    </div>
                    
                    {recentOrders.length > 0 ? (
                      <div className="space-y-4">
                        {recentOrders.map(order => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            language={language}
                            userType="customer"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                        <p className="text-gray-500">
                          {language === 'en' 
                            ? 'You have no orders yet. Start by booking a service!' 
                            : 'ليس لديك طلبات بعد. ابدأ بحجز خدمة!'
                          }
                        </p>
                        <button
                          onClick={() => setActiveTab('book')}
                          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          {language === 'en' ? 'Book a Service' : 'حجز خدمة'}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Quick actions */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button
                        onClick={() => setActiveTab('book')}
                        className="flex flex-col items-center justify-center p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span className="text-sm font-medium">
                          {language === 'en' ? 'New Order' : 'طلب جديد'}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="flex flex-col items-center justify-center p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <span className="text-sm font-medium">
                          {language === 'en' ? 'Track Orders' : 'تتبع الطلبات'}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('profile')}
                        className="flex flex-col items-center justify-center p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span className="text-sm font-medium">
                          {language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
                        </span>
                      </button>
                      
                      <button
                        className="flex flex-col items-center justify-center p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-sm font-medium">
                          {language === 'en' ? 'Get Help' : 'الحصول على المساعدة'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Book service tab */}
              {activeTab === 'book' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {language === 'en' ? 'Book a Service' : 'حجز خدمة'}
                  </h2>
                  <BookingForm language={language} />
                </div>
              )}
              
              {/* Orders tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {language === 'en' ? 'My Orders' : 'طلباتي'}
                  </h2>
                  
                  {orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {[...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => (
                        <OrderCard 
                          key={order.id} 
                          order={order} 
                          language={language}
                          userType="customer"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      <p className="text-gray-500">
                        {language === 'en' 
                          ? 'You have no orders yet. Start by booking a service!' 
                          : 'ليس لديك طلبات بعد. ابدأ بحجز خدمة!'
                        }
                      </p>
                      <button
                        onClick={() => setActiveTab('book')}
                        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {language === 'en' ? 'Book a Service' : 'حجز خدمة'}
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Profile tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {language === 'en' ? 'My Profile' : 'ملفي الشخصي'}
                  </h2>
                  
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <div className="bg-primary-100 text-primary-600 p-6 rounded-full mr-4">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h4 className="text-lg font-semibold mb-4">
                        {language === 'en' ? 'Personal Information' : 'المعلومات الشخصية'}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                          </label>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            {user.name}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                          </label>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            {user.email}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                          </label>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            {user.phone}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'en' ? 'Address' : 'العنوان'}
                          </label>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            {user.address || (language === 'en' ? 'Not provided' : 'غير متوفر')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                          {language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h4 className="text-lg font-semibold mb-4">
                        {language === 'en' ? 'Account Settings' : 'إعدادات الحساب'}
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium text-gray-800">
                              {language === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {language === 'en' 
                                ? 'Update your password regularly to keep your account secure' 
                                : 'قم بتحديث كلمة المرور بانتظام للحفاظ على أمان حسابك'
                              }
                            </p>
                          </div>
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            {language === 'en' ? 'Update' : 'تحديث'}
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium text-gray-800">
                              {language === 'en' ? 'Notification Preferences' : 'تفضيلات الإشعارات'}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {language === 'en' 
                                ? 'Manage how we contact you about your orders and account' 
                                : 'إدارة كيفية اتصالنا بك بخصوص طلباتك وحسابك'
                              }
                            </p>
                          </div>
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            {language === 'en' ? 'Manage' : 'إدارة'}
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium text-gray-800">
                              {language === 'en' ? 'Delete Account' : 'حذف الحساب'}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {language === 'en' 
                                ? 'Permanently delete your account and all data' 
                                : 'حذف حسابك وجميع البيانات نهائيًا'
                              }
                            </p>
                          </div>
                          <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            {language === 'en' ? 'Delete' : 'حذف'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}