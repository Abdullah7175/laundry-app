import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import OrderCard from '../../components/OrderCard';
import Map from '../../components/Map';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';

export default function CustomerOrders() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('orders');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { orders, getCustomerOrders } = useOrder();
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'customer') {
      router.push(`/${user.type}`);
    }

    if (isAuthenticated && user && user.type === 'customer') {
      getCustomerOrders(user.id);
    }
  }, [loading, isAuthenticated, user, router, getCustomerOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      if (filterStatus === 'all') {
        setFilteredOrders(orders);
      } else {
        setFilteredOrders(orders.filter(order => order.status === filterStatus));
      }
    }
  }, [orders, filterStatus]);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    if (order.status === 'pickup' || order.status === 'delivery') {
      setShowMap(true);
    }
  };

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

  // Status filter options
  const statusOptions = [
    { value: 'all', label: language === 'en' ? 'All Orders' : 'جميع الطلبات' },
    { value: 'pending', label: language === 'en' ? 'Pending' : 'قيد الانتظار' },
    { value: 'confirmed', label: language === 'en' ? 'Confirmed' : 'مؤكد' },
    { value: 'pickup', label: language === 'en' ? 'Pickup' : 'جاري الاستلام' },
    { value: 'processing', label: language === 'en' ? 'Processing' : 'قيد المعالجة' },
    { value: 'readyForDelivery', label: language === 'en' ? 'Ready for Delivery' : 'جاهز للتسليم' },
    { value: 'delivery', label: language === 'en' ? 'Out for Delivery' : 'خارج للتوصيل' },
    { value: 'delivered', label: language === 'en' ? 'Delivered' : 'تم التسليم' },
    { value: 'cancelled', label: language === 'en' ? 'Cancelled' : 'ملغي' }
  ];

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'pickup': return 'bg-purple-500';
      case 'processing': return 'bg-indigo-500';
      case 'readyForDelivery': return 'bg-teal-500';
      case 'delivery': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
        <Sidebar 
          navItems={navItems} 
          activeItem={activeTab} 
          setActiveItem={(item) => {
            setActiveTab(item);
            if (item !== 'orders') {
              router.push(`/dashboard${item === 'dashboard' ? '' : `/${item}`}`);
            }
          }} 
          language={language}
          userType="customer"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-blue-800 mb-4 md:mb-0">
              {language === 'en' ? 'My Orders' : 'طلباتي'}
            </h1>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              
              <button
                onClick={() => {
                  setActiveTab('book');
                  router.push('/dashboard/book');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                {language === 'en' ? 'New Order' : 'طلب جديد'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 h-full">
              <h2 className="font-bold text-lg text-blue-800 mb-4">
                {language === 'en' ? 'Order List' : 'قائمة الطلبات'}
              </h2>
              
              {filteredOrders.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredOrders.map((order) => (
                    <div 
                      key={order.id}
                      className={`p-3 border rounded-md cursor-pointer transition duration-200 ${selectedOrder?.id === order.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => handleOrderSelect(order)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {language === 'en' ? 'Order' : 'طلب'} #{order.id}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`${getStatusColor(order.status)} text-white text-xs px-2 py-1 rounded-full`}>
                          {statusOptions.find(option => option.value === order.status)?.label}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">
                        {language === 'en' ? 'Items' : 'العناصر'}: {order.items.length}
                      </p>
                      <p className="text-sm font-medium">
                        {language === 'en' ? 'Total' : 'الإجمالي'}: {order.total} SAR
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? filterStatus === 'all' 
                        ? "You don't have any orders yet." 
                        : `No ${statusOptions.find(option => option.value === filterStatus)?.label} orders found.`
                      : filterStatus === 'all'
                        ? "ليس لديك أي طلبات حتى الآن."
                        : `لم يتم العثور على طلبات ${statusOptions.find(option => option.value === filterStatus)?.label}.`
                    }
                  </p>
                  {filterStatus === 'all' && (
                    <button
                      onClick={() => {
                        setActiveTab('book');
                        router.push('/dashboard/book');
                      }}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                    >
                      {language === 'en' ? 'Book Your First Order' : 'احجز طلبك الأول'}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg text-blue-800">
                      {language === 'en' ? 'Order Details' : 'تفاصيل الطلب'}
                    </h2>
                    <div className={`${getStatusColor(selectedOrder.status)} text-white text-sm px-3 py-1 rounded-full`}>
                      {statusOptions.find(option => option.value === selectedOrder.status)?.label}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'en' ? 'Order ID' : 'رقم الطلب'}
                      </p>
                      <p className="font-medium">#{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'en' ? 'Date' : 'التاريخ'}
                      </p>
                      <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'en' ? 'Pickup Time' : 'وقت الاستلام'}
                      </p>
                      <p className="font-medium">{selectedOrder.pickupTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'en' ? 'Delivery Time' : 'وقت التوصيل'}
                      </p>
                      <p className="font-medium">{selectedOrder.deliveryTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'en' ? 'Address' : 'العنوان'}
                      </p>
                      <p className="font-medium">{selectedOrder.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'en' ? 'Payment Method' : 'طريقة الدفع'}
                      </p>
                      <p className="font-medium">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">
                      {language === 'en' ? 'Items' : 'العناصر'}
                    </h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {language === 'en' ? 'Item' : 'العنصر'}
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {language === 'en' ? 'Quantity' : 'الكمية'}
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {language === 'en' ? 'Price' : 'السعر'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedOrder.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.quantity}</div>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.price} SAR</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">
                      {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">
                          {language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}
                        </span>
                        <span className="font-medium">{selectedOrder.subtotal} SAR</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">
                          {language === 'en' ? 'Delivery Fee' : 'رسوم التوصيل'}
                        </span>
                        <span className="font-medium">{selectedOrder.deliveryFee} SAR</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Discount' : 'الخصم'}
                          </span>
                          <span className="font-medium text-green-600">-{selectedOrder.discount} SAR</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2">
                        <span>
                          {language === 'en' ? 'Total' : 'الإجمالي'}
                        </span>
                        <span>{selectedOrder.total} SAR</span>
                      </div>
                    </div>
                  </div>
                  {showMap && (
                    <div className="mb-6">
                      <h3 className="font-medium text-blue-800 mb-2">
                        {language === 'en' 
                          ? selectedOrder.status === 'pickup' 
                            ? 'Pickup Tracking' 
                            : 'Delivery Tracking'
                          : selectedOrder.status === 'pickup'
                            ? 'تتبع الاستلام'
                            : 'تتبع التوصيل'
                        }
                      </h3>
                      <div className="h-64 bg-gray-100 rounded-md overflow-hidden">
                        <Map 
                          order={selectedOrder} 
                          language={language}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    {['pending', 'confirmed'].includes(selectedOrder.status) && (
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300"
                      >
                        {language === 'en' ? 'Cancel Order' : 'إلغاء الطلب'}
                      </button>
                    )}
                    
                    {selectedOrder.status === 'delivered' && (
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300"
                      >
                        {language === 'en' ? 'Reorder' : 'إعادة الطلب'}
                      </button>
                    )}
                    
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300"
                    >
                      {language === 'en' ? 'Contact Support' : 'الاتصال بالدعم'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center h-full">
                  <div className="text-blue-500 text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {language === 'en' ? 'Select an order to view details' : 'حدد طلبًا لعرض التفاصيل'}
                  </h3>
                  <p className="text-gray-500 text-center">
                    {language === 'en' 
                      ? 'Click on any order from the list to view its detailed information.' 
                      : 'انقر على أي طلب من القائمة لعرض معلوماته التفصيلية.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
