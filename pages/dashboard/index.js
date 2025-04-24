import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import BookingForm from '../../components/BookingForm';
import OrderCard from '../../components/OrderCard';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';

export default function CustomerDashboard() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { orders, getCustomerOrders } = useOrder();
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    loyaltyPoints: 0,
    savedAmount: 0
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'customer') {
      // Redirect to the appropriate dashboard based on user type
      router.push(`/${user.type}`);
    }

    if (isAuthenticated && user && user.type === 'customer') {
      getCustomerOrders(user.id).then((fetchedOrders) => {
        // Set recent orders (last 3)
        setRecentOrders(fetchedOrders.slice(0, 3));
        
        // Calculate statistics
        const active = fetchedOrders.filter(order => order.status !== 'delivered').length;
        const completed = fetchedOrders.filter(order => order.status === 'delivered').length;
        const points = fetchedOrders.reduce((total, order) => total + (order.loyaltyPoints || 0), 0);
        const saved = fetchedOrders.reduce((total, order) => total + (order.discount || 0), 0);
        
        setStats({
          activeOrders: active,
          completedOrders: completed,
          loyaltyPoints: points,
          savedAmount: saved
        });
      });
    }
  }, [loading, isAuthenticated, user, router, getCustomerOrders]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  // Customer navigation items
  const navItems = [
    { id: 'dashboard', label: language === 'en' ? 'Dashboard' : 'لوحة التحكم', icon: '📊' },
    { id: 'orders', label: language === 'en' ? 'My Orders' : 'طلباتي', icon: '📦' },
    { id: 'book', label: language === 'en' ? 'New Order' : 'طلب جديد', icon: '➕' },
    { id: 'profile', label: language === 'en' ? 'Profile' : 'الملف الشخصي', icon: '👤' },
    { id: 'support', label: language === 'en' ? 'Support' : 'الدعم', icon: '🔧' }
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
        <Sidebar 
          navItems={navItems} 
          activeItem={activeTab} 
          setActiveItem={setActiveTab} 
          language={language}
          userType="customer"
        />
        
        <div className="flex-1 p-4 md:p-8">
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-blue-800 mb-6">
                {language === 'en' ? 'Customer Dashboard' : 'لوحة تحكم العميل'}
              </h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {language === 'en' ? 'Active Orders' : 'الطلبات النشطة'}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.activeOrders}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {language === 'en' ? 'Completed Orders' : 'الطلبات المكتملة'}
                  </h3>
                  <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {language === 'en' ? 'Loyalty Points' : 'نقاط الولاء'}
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">{stats.loyaltyPoints}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {language === 'en' ? 'Total Savings' : 'إجمالي التوفير'}
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">{stats.savedAmount} SAR</p>
                </div>
              </div>
              
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-blue-800">
                    {language === 'en' ? 'Recent Orders' : 'الطلبات الأخيرة'}
                  </h2>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {language === 'en' ? 'View All' : 'عرض الكل'}
                  </button>
                </div>
                
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <OrderCard key={order.id} order={order} language={language} userType="customer" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {language === 'en' ? "You don't have any orders yet." : "ليس لديك أي طلبات حتى الآن."}
                    </p>
                    <button
                      onClick={() => setActiveTab('book')}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                    >
                      {language === 'en' ? 'Book Your First Order' : 'احجز طلبك الأول'}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold text-blue-800 mb-4">
                  {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('book')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
                  >
                    <span className="text-2xl mb-2">📦</span>
                    <span className="text-sm font-medium">
                      {language === 'en' ? 'New Order' : 'طلب جديد'}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
                  >
                    <span className="text-2xl mb-2">🔍</span>
                    <span className="text-sm font-medium">
                      {language === 'en' ? 'Track Order' : 'تتبع الطلب'}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
                  >
                    <span className="text-2xl mb-2">👤</span>
                    <span className="text-sm font-medium">
                      {language === 'en' ? 'Update Profile' : 'تحديث الملف الشخصي'}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('support')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
                  >
                    <span className="text-2xl mb-2">🔧</span>
                    <span className="text-sm font-medium">
                      {language === 'en' ? 'Get Support' : 'الحصول على الدعم'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h1 className="text-2xl font-bold text-blue-800 mb-6">
                {language === 'en' ? 'My Orders' : 'طلباتي'}
              </h1>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} language={language} userType="customer" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow-md">
                  <p className="text-gray-500">
                    {language === 'en' ? "You don't have any orders yet." : "ليس لديك أي طلبات حتى الآن."}
                  </p>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                  >
                    {language === 'en' ? 'Book Your First Order' : 'احجز طلبك الأول'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'book' && (
            <div>
              <h1 className="text-2xl font-bold text-blue-800 mb-6">
                {language === 'en' ? 'Book New Order' : 'حجز طلب جديد'}
              </h1>
              <BookingForm language={language} />
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h1 className="text-2xl font-bold text-blue-800 mb-6">
                {language === 'en' ? 'My Profile' : 'ملفي الشخصي'}
              </h1>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                    <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="mb-4">
                      <label className="block text-gray-500 text-sm mb-1">
                        {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                      </label>
                      <p className="text-lg font-medium">{user?.name || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-500 text-sm mb-1">
                        {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                      </label>
                      <p className="text-lg font-medium">{user?.email || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-500 text-sm mb-1">
                        {language === 'en' ? 'Phone' : 'رقم الهاتف'}
                      </label>
                      <p className="text-lg font-medium">{user?.phone || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-500 text-sm mb-1">
                        {language === 'en' ? 'Loyalty Points' : 'نقاط الولاء'}
                      </label>
                      <p className="text-lg font-medium">{stats.loyaltyPoints}</p>
                    </div>
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                      {language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div>
              <h1 className="text-2xl font-bold text-blue-800 mb-6">
                {language === 'en' ? 'Support & Help' : 'الدعم والمساعدة'}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-blue-800 mb-4">
                    {language === 'en' ? 'Contact Us' : 'اتصل بنا'}
                  </h2>
                  <div className="mb-4">
                    <label className="block text-gray-500 text-sm mb-1">
                      {language === 'en' ? 'Phone' : 'الهاتف'}
                    </label>
                    <p className="text-lg font-medium">+966 12 345 6789</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-500 text-sm mb-1">
                      {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                    </label>
                    <p className="text-lg font-medium">support@laundryapp.com</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-500 text-sm mb-1">
                      {language === 'en' ? 'Working Hours' : 'ساعات العمل'}
                    </label>
                    <p className="text-lg font-medium">
                      {language === 'en' ? '9:00 AM - 10:00 PM, Every day' : '9:00 ص - 10:00 م، كل يوم'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-blue-800 mb-4">
                    {language === 'en' ? 'Send Message' : 'إرسال رسالة'}
                  </h2>
                  <form>
                    <div className="mb-4">
                      <label className="block text-gray-500 text-sm mb-1">
                        {language === 'en' ? 'Subject' : 'الموضوع'}
                      </label>
                      <input 
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder={language === 'en' ? 'Enter subject' : 'أدخل الموضوع'}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-500 text-sm mb-1">
                        {language === 'en' ? 'Message' : 'الرسالة'}
                      </label>
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="5"
                        placeholder={language === 'en' ? 'How can we help you?' : 'كيف يمكننا مساعدتك؟'}
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                    >
                      {language === 'en' ? 'Send' : 'إرسال'}
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-blue-800 mb-4">
                  {language === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">
                      {language === 'en' 
                        ? 'How do I place a new order?' 
                        : 'كيف أضع طلبًا جديدًا؟'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'Click on the "New Order" button on your dashboard, select the items you want to clean, choose pick-up and delivery times, and complete your payment.'
                        : 'انقر على زر "طلب جديد" في لوحة التحكم الخاصة بك، وحدد العناصر التي تريد تنظيفها، واختر أوقات الاستلام والتسليم، وأكمل الدفع.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">
                      {language === 'en' 
                        ? 'What payment methods do you accept?' 
                        : 'ما هي طرق الدفع التي تقبلونها؟'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'We accept cash on delivery, credit/debit cards, Apple Pay, and STC Pay.'
                        : 'نقبل الدفع عند الاستلام، وبطاقات الائتمان/الخصم، وApple Pay، وSTC Pay.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">
                      {language === 'en' 
                        ? 'How long does the cleaning process take?' 
                        : 'كم من الوقت تستغرق عملية التنظيف؟'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'Typically, our service takes 24-48 hours depending on the type and number of items.'
                        : 'عادة، تستغرق خدمتنا 24-48 ساعة حسب نوع وعدد العناصر.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">
                      {language === 'en' 
                        ? 'How do I track my order?' 
                        : 'كيف يمكنني تتبع طلبي؟'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'You can track your order in real-time by going to the "My Orders" section in your dashboard.'
                        : 'يمكنك تتبع طلبك في الوقت الفعلي من خلال الانتقال إلى قسم "طلباتي" في لوحة التحكم الخاصة بك.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
