import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';

export default function AdminAnalytics() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('analytics');
  const [period, setPeriod] = useState('week');
  const [analyticsData, setAnalyticsData] = useState(null);
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { getAllOrders } = useOrder();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'admin') {
      router.push(`/${user.type}`);
    }

    if (isAuthenticated && user && user.type === 'admin') {
      fetchAnalyticsData();
    }
  }, [loading, isAuthenticated, user, router, period]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch orders from the context
      const orders = await getAllOrders();
      
      // Process analytics based on orders
      const analytics = processAnalytics(orders, period);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalytics = (orders, timePeriod) => {
    const now = new Date();
    let startDate;
    
    // Determine start date based on selected period
    switch (timePeriod) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }
    
    // Filter orders within the selected time period
    const filteredOrders = orders.filter(order => new Date(order.createdAt) >= startDate);
    
    // Calculate revenue statistics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const completedOrders = filteredOrders.filter(order => order.status === 'delivered');
    const completedOrdersCount = completedOrders.length;
    const completedRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Get unique customers
    const uniqueCustomers = [...new Set(filteredOrders.map(order => order.customerId))].length;
    
    // Count orders by status
    const ordersByStatus = {
      pending: filteredOrders.filter(order => order.status === 'pending').length,
      confirmed: filteredOrders.filter(order => order.status === 'confirmed').length,
      pickup: filteredOrders.filter(order => order.status === 'pickup').length,
      processing: filteredOrders.filter(order => order.status === 'processing').length,
      readyForDelivery: filteredOrders.filter(order => order.status === 'readyForDelivery').length,
      delivery: filteredOrders.filter(order => order.status === 'delivery').length,
      delivered: completedOrdersCount,
      cancelled: filteredOrders.filter(order => order.status === 'cancelled').length
    };
    
    // Count orders by service type
    const ordersByService = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!ordersByService[item.name]) {
          ordersByService[item.name] = { count: 0, revenue: 0 };
        }
        ordersByService[item.name].count += item.quantity;
        ordersByService[item.name].revenue += item.price * item.quantity;
      });
    });
    
    // Create time series data for orders and revenue by day
    const timeSeriesData = {};
    
    // Initialize time series with all days in the period
    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateString = currentDate.toISOString().split('T')[0];
      timeSeriesData[dateString] = { orders: 0, revenue: 0 };
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Fill time series with actual data
    filteredOrders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (timeSeriesData[orderDate]) {
        timeSeriesData[orderDate].orders += 1;
        timeSeriesData[orderDate].revenue += order.total || 0;
      }
    });
    
    return {
      totalOrders: filteredOrders.length,
      totalRevenue,
      averageOrderValue: filteredOrders.length ? totalRevenue / filteredOrders.length : 0,
      uniqueCustomers,
      ordersByStatus,
      ordersByService,
      completedOrdersCount,
      completedRevenue,
      conversionRate: filteredOrders.length ? (completedOrdersCount / filteredOrders.length) * 100 : 0,
      timeSeriesData: Object.entries(timeSeriesData).map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: data.revenue
      }))
    };
  };

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  // Admin navigation items
  const navItems = [
    { id: 'dashboard', label: language === 'en' ? 'Dashboard' : 'لوحة القيادة', icon: '📊' },
    { id: 'orders', label: language === 'en' ? 'Orders' : 'الطلبات', icon: '📦' },
    { id: 'users', label: language === 'en' ? 'Users' : 'العملاء', icon: '👥' },
    { id: 'vendors', label: language === 'en' ? 'Vendors' : 'البائعين', icon: '🏪' },
    { id: 'assign-rider', label: language === 'en' ? 'Riders' : 'الدراجين', icon: '🏍️' },
    { id: 'customers', label: language === 'en' ? 'Customers' : 'العملاء', icon: '👥' },
    { id: 'analytics', label: language === 'en' ? 'Analytics' : 'التحليلات', icon: '📈' },
    { id: 'pricing', label: language === 'en' ? 'Pricing' : 'التسعير', icon: '💰' },
    { id: 'areas', label: language === 'en' ? 'Service Areas' : 'مناطق الخدمة', icon: '🗺️' },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'الإعدادات', icon: '⚙️' }
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
        <Sidebar 
          navItems={navItems} 
          activeItem={activeTab} 
          setActiveItem={(item) => {
            setActiveTab(item);
            router.push(`/admin/${item === 'dashboard' ? '' : item}`);
          }} 
          language={language}
          userType="admin"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-blue-800 mb-2 md:mb-0">
              {language === 'en' ? 'Analytics & Reports' : 'التحليلات والتقارير'}
            </h1>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setPeriod('day')}
                className={`px-3 py-1 rounded-md ${period === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
              >
                {language === 'en' ? 'Day' : 'يوم'}
              </button>
              <button 
                onClick={() => setPeriod('week')}
                className={`px-3 py-1 rounded-md ${period === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
              >
                {language === 'en' ? 'Week' : 'أسبوع'}
              </button>
              <button 
                onClick={() => setPeriod('month')}
                className={`px-3 py-1 rounded-md ${period === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
              >
                {language === 'en' ? 'Month' : 'شهر'}
              </button>
              <button 
                onClick={() => setPeriod('year')}
                className={`px-3 py-1 rounded-md ${period === 'year' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
              >
                {language === 'en' ? 'Year' : 'سنة'}
              </button>
            </div>
          </div>
          
          {analyticsData ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {language === 'en' ? 'Total Orders' : 'إجمالي الطلبات'}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.totalOrders}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {language === 'en' ? 'Total Revenue' : 'إجمالي الإيرادات'}
                  </h3>
                  <p className="text-2xl font-bold text-green-600">{analyticsData.totalRevenue.toFixed(2)} SAR</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {language === 'en' ? 'Average Order Value' : 'متوسط قيمة الطلب'}
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.averageOrderValue.toFixed(2)} SAR</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {language === 'en' ? 'Unique Customers' : 'العملاء الفريدون'}
                  </h3>
                  <p className="text-2xl font-bold text-orange-600">{analyticsData.uniqueCustomers}</p>
                </div>
              </div>
              
              {/* Orders Chart */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-bold text-blue-800 mb-4">
                  {language === 'en' ? 'Orders & Revenue Over Time' : 'الطلبات والإيرادات على مدار الوقت'}
                </h2>
                <div className="h-64 flex items-center justify-center">
                  <div className="w-full h-full text-center text-gray-500">
                    {language === 'en' ? 'Orders and revenue chart will appear here' : 'سيظهر مخطط الطلبات والإيرادات هنا'}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Conversion Rate' : 'معدل التحويل'}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">{analyticsData.conversionRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">
                      {language === 'en' 
                        ? 'Percentage of orders completed' 
                        : 'النسبة المئوية للطلبات المكتملة'
                      }
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Completed Orders' : 'الطلبات المكتملة'}
                    </h3>
                    <p className="text-2xl font-bold text-green-600">{analyticsData.completedOrdersCount}</p>
                    <p className="text-xs text-gray-500">
                      {language === 'en' 
                        ? `Revenue: ${analyticsData.completedRevenue.toFixed(2)} SAR` 
                        : `الإيرادات: ${analyticsData.completedRevenue.toFixed(2)} ريال`
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Orders by Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-bold text-blue-800 mb-4">
                    {language === 'en' ? 'Orders by Status' : 'الطلبات حسب الحالة'}
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(analyticsData.ordersByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 
                          ${status === 'delivered' ? 'bg-green-500' : 
                            status === 'cancelled' ? 'bg-red-500' : 
                            status === 'processing' ? 'bg-indigo-500' : 
                            status === 'readyForDelivery' ? 'bg-teal-500' : 
                            status === 'delivery' ? 'bg-orange-500' : 
                            status === 'pickup' ? 'bg-purple-500' : 
                            status === 'confirmed' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm">
                              {status === 'pending' ? (language === 'en' ? 'Pending' : 'قيد الانتظار') :
                               status === 'confirmed' ? (language === 'en' ? 'Confirmed' : 'مؤكد') :
                               status === 'pickup' ? (language === 'en' ? 'Pickup' : 'جاري الاستلام') :
                               status === 'processing' ? (language === 'en' ? 'Processing' : 'قيد المعالجة') :
                               status === 'readyForDelivery' ? (language === 'en' ? 'Ready for Delivery' : 'جاهز للتسليم') :
                               status === 'delivery' ? (language === 'en' ? 'Out for Delivery' : 'خارج للتوصيل') :
                               status === 'delivered' ? (language === 'en' ? 'Delivered' : 'تم التسليم') :
                               (language === 'en' ? 'Cancelled' : 'ملغي')}
                            </span>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className={`h-1.5 rounded-full 
                                ${status === 'delivered' ? 'bg-green-500' : 
                                  status === 'cancelled' ? 'bg-red-500' : 
                                  status === 'processing' ? 'bg-indigo-500' : 
                                  status === 'readyForDelivery' ? 'bg-teal-500' : 
                                  status === 'delivery' ? 'bg-orange-500' : 
                                  status === 'pickup' ? 'bg-purple-500' : 
                                  status === 'confirmed' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                              style={{ width: `${(count / analyticsData.totalOrders) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Orders by Service Type */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-bold text-blue-800 mb-4">
                    {language === 'en' ? 'Orders by Service Type' : 'الطلبات حسب نوع الخدمة'}
                  </h2>
                  {Object.entries(analyticsData.ordersByService).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(analyticsData.ordersByService)
                        .sort(([, a], [, b]) => b.count - a.count)
                        .map(([service, data], index) => (
                          <div key={service} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 bg-blue-${500 - (index * 100 > 400 ? 400 : index * 100)}`}></div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="text-sm">{service}</span>
                                <span className="text-sm font-medium">{data.count}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className={`h-1.5 rounded-full bg-blue-${500 - (index * 100 > 400 ? 400 : index * 100)}`}
                                  style={{ width: `${(data.count / Object.values(analyticsData.ordersByService).reduce((sum, item) => sum + item.count, 0)) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {language === 'en' ? 'No data available' : 'لا توجد بيانات متاحة'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Reports */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-bold text-blue-800 mb-4">
                  {language === 'en' ? 'Export Reports' : 'تصدير التقارير'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                    <span>📊</span>
                    <span>{language === 'en' ? 'Sales Report' : 'تقرير المبيعات'}</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                    <span>👥</span>
                    <span>{language === 'en' ? 'Customer Report' : 'تقرير العملاء'}</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                    <span>🧮</span>
                    <span>{language === 'en' ? 'Financial Report' : 'التقرير المالي'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                {language === 'en' ? 'No analytics data available' : 'لا توجد بيانات تحليلية متاحة'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {language === 'en' 
                  ? 'Start processing orders to see your business analytics here.' 
                  : 'ابدأ في معالجة الطلبات لرؤية تحليلات عملك هنا.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
