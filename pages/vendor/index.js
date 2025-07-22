import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import VendorDeliveryManagement from '../../components/vendor/VendorDeliveryManagement';

// Import content from the vendor subpages
import VendorOrders from './orders';
import VendorPricing from './pricing';
import VendorAnalytics from './analytics';
import VendorSettings from './settings';

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
          setActiveItem={setActiveTab}
          language={language}
          userType="vendor"
        />
        <div className="flex-1 p-4 md:p-8">
          {activeTab === 'dashboard' && (
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
          )}
          {activeTab === 'orders' && <VendorOrders />}
          {activeTab === 'pricing' && <VendorPricing />}
          {activeTab === 'analytics' && <VendorAnalytics />}
          {activeTab === 'settings' && <VendorSettings />}
        </div>
      </div>
    </Layout>
  );
}
