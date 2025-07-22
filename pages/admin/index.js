import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { useDelivery } from '../../context/DeliveryContext';

export default function AdminDashboard() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { orders, getAllOrders } = useOrder();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    customers: 0
  });
  const { 
    riders = [], 
    availableRiders = [], 
    assignedDeliveries = [], 
    unassignedDeliveries = [], 
    loadRiders = () => {} 
  } = useDelivery();

  useEffect(() => {
    if (isAuthenticated && user && user.type === 'admin') {
      try {
        loadRiders();
        getAllOrders();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'admin') {
      // Redirect to the appropriate dashboard based on user type
      router.push(`/${user.type}`);
    }

    if (isAuthenticated && user && user.type === 'admin') {
      getAllOrders().then((fetchedOrders) => {
        // Calculate statistics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const pendingOrders = fetchedOrders.filter(order => ['pending', 'confirmed', 'pickup', 'processing', 'readyForDelivery', 'delivery'].includes(order.status)).length;
        const completedOrders = fetchedOrders.filter(order => order.status === 'delivered').length;
        const cancelledOrders = fetchedOrders.filter(order => order.status === 'cancelled').length;
        
        const totalRevenue = fetchedOrders.filter(order => order.status === 'delivered').reduce((total, order) => total + order.total, 0);
        
        const dailyRevenue = fetchedOrders
          .filter(order => order.status === 'delivered' && new Date(order.createdAt) >= today)
          .reduce((total, order) => total + order.total, 0);
        
        const weeklyRevenue = fetchedOrders
          .filter(order => order.status === 'delivered' && new Date(order.createdAt) >= oneWeekAgo)
          .reduce((total, order) => total + order.total, 0);
        
        const monthlyRevenue = fetchedOrders
          .filter(order => order.status === 'delivered' && new Date(order.createdAt) >= oneMonthAgo)
          .reduce((total, order) => total + order.total, 0);
        
        // Get unique customer IDs
        const uniqueCustomers = new Set(fetchedOrders.map(order => order.customerId));
        
        setStats({
          totalOrders: fetchedOrders.length,
          pendingOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue,
          dailyRevenue,
          weeklyRevenue,
          monthlyRevenue,
          customers: uniqueCustomers.size
        });
      });
    }
  }, [loading, isAuthenticated, user, router, getAllOrders]);

  if (loading) {
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
    { id: 'vendor', label: language === 'en' ? 'Vendor' : 'البائعين', icon: '🏪' },
    { id: 'assign-rider', label: language === 'en' ? 'Riders' : 'الدراجين', icon: '🏍️' },
    { id: 'customers', label: language === 'en' ? 'Customers' : 'العملاء', icon: '👥' },
    { id: 'analytics', label: language === 'en' ? 'Analytics' : 'التحليلات', icon: '📈' },
    { id: 'pricing', label: language === 'en' ? 'Pricing' : 'التسعير', icon: '💰' },
    { id: 'areas', label: language === 'en' ? 'Service Areas' : 'مناطق الخدمة', icon: '🗺️' },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'الإعدادات', icon: '⚙️' }
  ];

  // Function to navigate to another page
  const handleNavigation = (path) => {
    router.push(path);
  };

  // Get recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

    // const DeliveryManagementSection = () => (
    //   <div className="bg-white rounded-lg shadow-md p-4 mt-8">
    //     <h2 className="text-lg font-bold text-blue-800 mb-4">
    //       {language === 'en' ? 'Delivery Management' : 'إدارة التوصيل'}
    //     </h2>
        
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //       {/* Available Riders */}
    //       <div className="bg-blue-50 p-4 rounded-lg">
    //         <h3 className="font-medium text-gray-800 mb-3">
    //           {language === 'en' ? 'Available Riders' : 'الراكبون المتاحون'}
    //         </h3>
    //         {available.length > 0 ? (
    //           <ul className="space-y-2">
    //             {availableRiders.map(rider => (
    //               <li key={rider.id} className="flex justify-between items-center p-2 bg-white rounded-md">
    //                 <span>{rider.name}</span>
    //                 <span className="text-sm text-gray-500">{rider.vehicle}</span>
    //               </li>
    //             ))}
    //           </ul>
    //         ) : (
    //           <p className="text-gray-500">
    //             {language === 'en' ? 'No available riders' : 'لا يوجد راكبون متاحون'}
    //           </p>
    //         )}
    //       </div>
          
    //       {/* Unassigned Deliveries */}
    //       <div className="bg-yellow-50 p-4 rounded-lg">
    //         <h3 className="font-medium text-gray-800 mb-3">
    //           {language === 'en' ? 'Ready for Delivery' : 'جاهز للتسليم'}
    //         </h3>
    //         {unassignedDeliveries.length > 0 ? (
    //           <ul className="space-y-2">
    //             {unassignedDeliveries.map(order => (
    //               <li key={order.id} className="flex justify-between items-center p-2 bg-white rounded-md">
    //                 <span>Order #{order.id}</span>
    //                 <button 
    //                   onClick={() => router.push(`/admin/assign-rider?orderId=${order.id}`)}
    //                   className="text-sm text-blue-600 hover:text-blue-800"
    //                 >
    //                   {language === 'en' ? 'Assign Rider' : 'تعيين راكب'}
    //                 </button>
    //               </li>
    //             ))}
    //           </ul>
    //         ) : (
    //           <p className="text-gray-500">
    //             {language === 'en' ? 'No unassigned deliveries' : 'لا توجد توصيلات غير معينة'}
    //           </p>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // );
    

    const DeliveryManagementSection = () => {
      const { availableRiders, unassignedDeliveries, assignRider } = useDelivery();

      return (
        <div className="bg-white rounded-lg shadow-md p-4 mt-8">
          <h2 className="text-lg font-bold text-blue-800 mb-4">
            {language === 'en' ? 'Delivery Management' : 'إدارة التوصيل'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Riders */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">
                {language === 'en' ? 'Available Riders' : 'الراكبون المتاحون'}
              </h3>
              {availableRiders.length > 0 ? (
                <ul className="space-y-2">
                  {availableRiders.map(rider => (
                    <li key={rider.id} className="flex justify-between items-center p-2 bg-white rounded-md">
                      <span>{rider.name}</span>
                      <span className="text-sm text-gray-500">
                        {rider.vehicle === 'motorcycle' ? 'Motorcycle' : 
                         rider.vehicle === 'bicycle' ? 'Bicycle' : 'Car'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  {language === 'en' ? 'No available riders' : 'لا يوجد راكبون متاحون'}
                </p>
              )}
            </div>
            
            {/* Unassigned Deliveries */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">
                {language === 'en' ? 'Ready for Delivery' : 'جاهز للتسليم'}
              </h3>
              {unassignedDeliveries.length > 0 ? (
                <ul className="space-y-2">
                  {unassignedDeliveries.map(order => (
                    <li key={order.id} className="flex justify-between items-center p-2 bg-white rounded-md">
                      <span>Order #{order.id}</span>
                      <select
                        onChange={(e) => assignRider(order.id, e.target.value)}
                        className="border rounded p-1 text-sm"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {language === 'en' ? 'Assign Rider' : 'تعيين راكب'}
                        </option>
                        {availableRiders.map(rider => (
                          <option key={rider.id} value={rider.id}>
                            {rider.name} ({rider.vehicle})
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  {language === 'en' ? 'No unassigned deliveries' : 'لا توجد توصيلات غير معينة'}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    };
    

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
        <Sidebar 
          navItems={navItems} 
          activeItem={activeTab} 
          setActiveItem={(item) => {
            setActiveTab(item);
            if (item !== 'dashboard') {
              router.push(`/admin/${item}`);
            }
          }} 
          language={language}
          userType="admin"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              {language === 'en' ? 'Admin Dashboard' : 'لوحة تحكم المسؤول'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' 
                ? `Welcome back, ${user?.name || 'Admin'}` 
                : `مرحبًا بعودتك، ${user?.name || 'المسؤول'}`}
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
                {language === 'en' ? 'Total Customers' : 'إجمالي العملاء'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-purple-600">{stats.customers}</p>
                <div className="text-green-500 text-sm">
                  +{Math.floor(stats.customers * 0.05)} {language === 'en' ? 'this month' : 'هذا الشهر'}
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

          {/* Orders and Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-800">
                  {language === 'en' ? 'Recent Orders' : 'أحدث الطلبات'}
                </h2>
                <button 
                  onClick={() => handleNavigation('/admin/orders')}
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
                      <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleNavigation(`/admin/orders?id=${order.id}`)}>
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
            
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold text-blue-800 mb-4">
                {language === 'en' ? 'Order Summary' : 'ملخص الطلبات'}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {language === 'en' ? 'Completed Orders' : 'الطلبات المكتملة'}
                  </h3>
                  <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
                  <p className="text-xs text-gray-500">
                    {Math.floor(stats.completedOrders / stats.totalOrders * 100)}% {language === 'en' ? 'of total' : 'من الإجمالي'}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {language === 'en' ? 'Pending Orders' : 'الطلبات المعلقة'}
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                  <p className="text-xs text-gray-500">
                    {Math.floor(stats.pendingOrders / stats.totalOrders * 100)}% {language === 'en' ? 'of total' : 'من الإجمالي'}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {language === 'en' ? 'Cancelled Orders' : 'الطلبات الملغاة'}
                  </h3>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelledOrders}</p>
                  <p className="text-xs text-gray-500">
                    {Math.floor(stats.cancelledOrders / stats.totalOrders * 100)}% {language === 'en' ? 'of total' : 'من الإجمالي'}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {language === 'en' ? 'Average Order Value' : 'متوسط قيمة الطلب'}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalOrders > 0 ? Math.floor(stats.totalRevenue / stats.totalOrders) : 0} SAR
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
                      className="bg-green-500 h-full" 
                      style={{ width: `${Math.floor(stats.completedOrders / stats.totalOrders * 100)}%` }}
                      title={language === 'en' ? 'Completed' : 'مكتمل'}
                    ></div>
                    <div 
                      className="bg-yellow-500 h-full" 
                      style={{ width: `${Math.floor(stats.pendingOrders / stats.totalOrders * 100)}%` }}
                      title={language === 'en' ? 'Pending' : 'معلق'}
                    ></div>
                    <div 
                      className="bg-red-500 h-full" 
                      style={{ width: `${Math.floor(stats.cancelledOrders / stats.totalOrders * 100)}%` }}
                      title={language === 'en' ? 'Cancelled' : 'ملغى'}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span>{language === 'en' ? 'Completed' : 'مكتمل'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                    <span>{language === 'en' ? 'Pending' : 'معلق'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span>{language === 'en' ? 'Cancelled' : 'ملغى'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-blue-800 mb-4">
              {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => handleNavigation('/admin/orders')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">📦</span>
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Manage Orders' : 'إدارة الطلبات'}
                </span>
              </button>
              <button 
                onClick={() => handleNavigation('/admin/customers')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">👥</span>
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Manage Customers' : 'إدارة العملاء'}
                </span>
              </button>
              <button 
                onClick={() => handleNavigation('/admin/pricing')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">💰</span>
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Update Pricing' : 'تحديث التسعير'}
                </span>
              </button>
              <button 
                onClick={() => handleNavigation('/admin/analytics')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">📈</span>
                <span className="text-sm font-medium">
                  {language === 'en' ? 'View Analytics' : 'عرض التحليلات'}
                </span>
              </button>
            </div>
          </div>
          <DeliveryManagementSection />
        </div>
      </div>
    </Layout>
  );
}
