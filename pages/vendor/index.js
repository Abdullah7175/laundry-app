import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import VendorDeliveryManagement from '../../components/vendor/VendorDeliveryManagement';

export default function VendorDashboard() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { getVendorOrders } = useOrder();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0
  });

  // Define fetchOrders before it's used in useEffect
  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getVendorOrders(user.id);
      setOrders(fetchedOrders);
      calculateStats(fetchedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const calculateStats = (orderData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const pendingOrders = orderData.filter(order => 
      ['pending', 'confirmed', 'pickup', 'processing', 'readyForDelivery', 'delivery'].includes(order.status)
    ).length;
    
    const completedOrders = orderData.filter(order => order.status === 'delivered').length;
    const cancelledOrders = orderData.filter(order => order.status === 'cancelled').length;
    
    const totalRevenue = orderData
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);
    
    const dailyRevenue = orderData
      .filter(order => order.status === 'delivered' && new Date(order.createdAt) >= today)
      .reduce((sum, order) => sum + order.total, 0);
    
    const weeklyRevenue = orderData
      .filter(order => order.status === 'delivered' && new Date(order.createdAt) >= oneWeekAgo)
      .reduce((sum, order) => sum + order.total, 0);
    
    const monthlyRevenue = orderData
      .filter(order => order.status === 'delivered' && new Date(order.createdAt) >= oneMonthAgo)
      .reduce((sum, order) => sum + order.total, 0);

    setStats({
      totalOrders: orderData.length,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue
    });
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'vendor') {
      router.push(`/${user.type}`);
    }

    if (isAuthenticated && user && user.type === 'vendor') {
      fetchOrders();
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

  // Vendor navigation items
  const navItems = [
    { id: 'dashboard', label: language === 'en' ? 'Dashboard' : 'لوحة القيادة', icon: '📊' },
    { id: 'orders', label: language === 'en' ? 'Orders' : 'الطلبات', icon: '📦' },
    { id: 'pricing', label: language === 'en' ? 'Pricing' : 'التسعير', icon: '💰' },
    { id: 'analytics', label: language === 'en' ? 'Analytics' : 'التحليلات', icon: '📈' },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'الإعدادات', icon: '⚙️' }
  ];

  // Get recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get orders ready for delivery management
  const deliveryOrders = orders.filter(order => 
    ['readyForDelivery', 'delivery'].includes(order.status)
  );
  
  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
        <Sidebar 
          navItems={navItems} 
          activeItem={activeTab} 
          setActiveItem={(item) => {
            setActiveTab(item);
            if (item !== 'dashboard') {
              router.push(`/vendor/${item}`);
            }
          }} 
          language={language}
          userType="vendor"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              {language === 'en' ? 'Vendor Dashboard' : 'لوحة تحكم البائع'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' 
                ? `Welcome back, ${user?.name || 'Vendor'}` 
                : `مرحبًا بعودتك، ${user?.name || 'البائع'}`}
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Total Orders' : 'إجمالي الطلبات'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                <div className="text-green-500 text-sm">
                  +{Math.floor(stats.totalOrders * 0.1)} {language === 'en' ? 'this week' : 'هذا الأسبوع'}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Pending Orders' : 'الطلبات المعلقة'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                <div className="text-yellow-500 text-sm">
                  {Math.floor(stats.pendingOrders / stats.totalOrders * 100)}% {language === 'en' ? 'of total' : 'من الإجمالي'}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Completed Orders' : 'الطلبات المكتملة'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
                <div className="text-green-500 text-sm">
                  {Math.floor(stats.completedOrders / stats.totalOrders * 100)}% {language === 'en' ? 'of total' : 'من الإجمالي'}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Total Revenue' : 'إجمالي الإيرادات'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-green-600">{stats.totalRevenue} SAR</p>
                <div className="text-green-500 text-sm">
                  +{stats.monthlyRevenue} {language === 'en' ? 'this month' : 'هذا الشهر'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 lg:col-span-2">
              <h2 className="text-lg font-bold text-blue-800 mb-4">
                {language === 'en' ? 'Revenue Overview' : 'نظرة عامة على الإيرادات'}
              </h2>
              <div className="h-64 flex items-center justify-center text-gray-500">
                {language === 'en' ? 'Revenue chart will appear here' : 'سيظهر مخطط الإيرادات هنا'}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold text-blue-800 mb-4">
                {language === 'en' ? 'Revenue Breakdown' : 'تفصيل الإيرادات'}
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {language === 'en' ? 'Today' : 'اليوم'}
                    </span>
                    <span className="font-medium">{stats.dailyRevenue} SAR</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((stats.dailyRevenue / stats.monthlyRevenue) * 100, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {language === 'en' ? 'This Week' : 'هذا الأسبوع'}
                    </span>
                    <span className="font-medium">{stats.weeklyRevenue} SAR</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((stats.weeklyRevenue / stats.monthlyRevenue) * 100, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {language === 'en' ? 'This Month' : 'هذا الشهر'}
                    </span>
                    <span className="font-medium">{stats.monthlyRevenue} SAR</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-blue-800">
                {language === 'en' ? 'Recent Orders' : 'أحدث الطلبات'}
              </h2>
              <button 
                onClick={() => router.push('/vendor/orders')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {language === 'en' ? 'View All' : 'عرض الكل'}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Order ID' : 'رقم الطلب'}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Customer' : 'العميل'}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Date' : 'التاريخ'}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Status' : 'الحالة'}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'en' ? 'Total' : 'الإجمالي'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/vendor/orders?id=${order.id}`)}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-blue-600">#{order.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{order.customerName}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          ${['pending', 'confirmed', 'pickup', 'processing', 'readyForDelivery', 'delivery'].includes(order.status) ? 'bg-yellow-100 text-yellow-800' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{order.total} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Orders by Status */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-blue-800 mb-4">
              {language === 'en' ? 'Orders by Status' : 'الطلبات حسب الحالة'}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {language === 'en' ? 'Pending' : 'قيد الانتظار'}
                </h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(order => order.status === 'pending').length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {language === 'en' ? 'Processing' : 'قيد المعالجة'}
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(order => order.status === 'processing').length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {language === 'en' ? 'Ready for Delivery' : 'جاهز للتسليم'}
                </h3>
                <p className="text-2xl font-bold text-teal-600">
                  {orders.filter(order => order.status === 'readyForDelivery').length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {language === 'en' ? 'Completed' : 'مكتمل'}
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(order => order.status === 'delivered').length}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                {language === 'en' ? 'Orders by Status' : 'الطلبات حسب الحالة'}
              </h3>
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div 
                    className="bg-yellow-500 h-full" 
                    style={{ width: `${orders.filter(order => order.status === 'pending').length / stats.totalOrders * 100}%` }}
                    title={language === 'en' ? 'Pending' : 'قيد الانتظار'}
                  ></div>
                  <div 
                    className="bg-blue-500 h-full" 
                    style={{ width: `${orders.filter(order => order.status === 'processing').length / stats.totalOrders * 100}%` }}
                    title={language === 'en' ? 'Processing' : 'قيد المعالجة'}
                  ></div>
                  <div 
                    className="bg-teal-500 h-full" 
                    style={{ width: `${orders.filter(order => order.status === 'readyForDelivery').length / stats.totalOrders * 100}%` }}
                    title={language === 'en' ? 'Ready for Delivery' : 'جاهز للتسليم'}
                  ></div>
                  <div 
                    className="bg-green-500 h-full" 
                    style={{ width: `${orders.filter(order => order.status === 'delivered').length / stats.totalOrders * 100}%` }}
                    title={language === 'en' ? 'Delivered' : 'تم التسليم'}
                  ></div>
                  <div 
                    className="bg-red-500 h-full" 
                    style={{ width: `${orders.filter(order => order.status === 'cancelled').length / stats.totalOrders * 100}%` }}
                    title={language === 'en' ? 'Cancelled' : 'ملغى'}
                  ></div>
                </div>
              </div>
            </div>
          </div>
           {/* Vendor Delivery Management */}
           <VendorDeliveryManagement 
            language={language} 
            orders={orders.filter(order => ['readyForDelivery', 'delivery'].includes(order.status))}
          />
        </div>
      </div>
    </Layout>
  );
}
