import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import Map from '../../components/Map';

export default function AdminOrders() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showMap, setShowMap] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { getAllOrders, updateOrder } = useOrder();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'admin') {
      router.push(`/${user.type}`);
    }

    if (isAuthenticated && user && user.type === 'admin') {
      fetchOrders();
    }
    
    // Check if there's an order ID in the URL
    if (router.query.id) {
      fetchOrderById(router.query.id);
    }
  }, [loading, isAuthenticated, user, router.query.id]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      applyFilters(allOrders, filterStatus, searchQuery, dateRange);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to fetch orders' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderById = async (id) => {
    const allOrders = await getAllOrders();
    const order = allOrders.find(o => o.id.toString() === id.toString());
    if (order) {
      setSelectedOrder(order);
      
      if (order.status === 'pickup' || order.status === 'delivery') {
        setShowMap(true);
      }
    }
  };

  const applyFilters = (ordersData, status, query, dates) => {
    let filtered = [...ordersData];
    
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }
    
    // Search by ID, customer name, or phone
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toString().includes(lowercaseQuery) ||
        (order.customerName && order.customerName.toLowerCase().includes(lowercaseQuery)) ||
        (order.phone && order.phone.includes(lowercaseQuery))
      );
    }
    
    // Filter by date range
    if (dates.start && dates.end) {
      const startDate = new Date(dates.start);
      const endDate = new Date(dates.end);
      endDate.setHours(23, 59, 59, 999); // Include the end date fully
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    
    // Sort by date, newest first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredOrders(filtered);
  };

  const handleStatusChange = (status) => {
    setFilterStatus(status);
    applyFilters(orders, status, searchQuery, dateRange);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(orders, filterStatus, query, dateRange);
  };

  const handleDateChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    applyFilters(orders, filterStatus, searchQuery, newDateRange);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    router.push(`/admin/orders?id=${order.id}`, undefined, { shallow: true });
    
    if (order.status === 'pickup' || order.status === 'delivery') {
      setShowMap(true);
    } else {
      setShowMap(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const updated = await updateOrder(selectedOrder.id, { status: newStatus });
      if (updated) {
        // Update the selected order and the orders list
        setSelectedOrder({ ...selectedOrder, status: newStatus });
        const updatedOrders = orders.map(o => 
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        );
        setOrders(updatedOrders);
        applyFilters(updatedOrders, filterStatus, searchQuery, dateRange);
        
        setMessage({ 
          type: 'success', 
          text: language === 'en' 
            ? `Order #${selectedOrder.id} status updated to ${newStatus}` 
            : `تم تحديث حالة الطلب #${selectedOrder.id} إلى ${newStatus}`
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || (language === 'en' ? 'Failed to update status' : 'فشل تحديث الحالة')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignToDelivery = async (deliveryPersonId) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const updated = await updateOrder(selectedOrder.id, { 
        deliveryPersonId, 
        status: selectedOrder.status === 'readyForDelivery' ? 'delivery' : selectedOrder.status 
      });
      
      if (updated) {
        // Update the selected order and the orders list
        const updatedOrder = { 
          ...selectedOrder, 
          deliveryPersonId,
          status: selectedOrder.status === 'readyForDelivery' ? 'delivery' : selectedOrder.status
        };
        
        setSelectedOrder(updatedOrder);
        const updatedOrders = orders.map(o => 
          o.id === selectedOrder.id ? updatedOrder : o
        );
        setOrders(updatedOrders);
        applyFilters(updatedOrders, filterStatus, searchQuery, dateRange);
        
        setMessage({ 
          type: 'success', 
          text: language === 'en' 
            ? `Order #${selectedOrder.id} assigned to delivery personnel` 
            : `تم تعيين الطلب #${selectedOrder.id} إلى موظف التوصيل`
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || (language === 'en' ? 'Failed to assign order' : 'فشل تعيين الطلب')
      });
    } finally {
      setIsLoading(false);
    }
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
    { id: 'customers', label: language === 'en' ? 'Customers' : 'العملاء', icon: '👥' },
    { id: 'analytics', label: language === 'en' ? 'Analytics' : 'التحليلات', icon: '📈' },
    { id: 'pricing', label: language === 'en' ? 'Pricing' : 'التسعير', icon: '💰' },
    { id: 'areas', label: language === 'en' ? 'Service Areas' : 'مناطق الخدمة', icon: '🗺️' },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'الإعدادات', icon: '⚙️' }
  ];

  // Status options
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

  // Simulated delivery personnel for demo
  const deliveryPersonnel = [
    { id: 1, name: 'Ahmed Ali' },
    { id: 2, name: 'Sarah Khan' },
    { id: 3, name: 'Mohammed Ibrahim' },
    { id: 4, name: 'Nora Saleh' }
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              {language === 'en' ? 'Manage Orders' : 'إدارة الطلبات'}
            </h1>
          </div>
          
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders list */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Filter by Status' : 'تصفية حسب الحالة'}
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Search Orders' : 'البحث في الطلبات'}
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder={language === 'en' ? 'Order ID, customer name, phone...' : 'رقم الطلب، اسم العميل، الهاتف...'}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                
                <div className="mb-4 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'en' ? 'From Date' : 'من تاريخ'}
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => handleDateChange('start', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'en' ? 'To Date' : 'إلى تاريخ'}
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => handleDateChange('end', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  {language === 'en' 
                    ? `Showing ${filteredOrders.length} orders` 
                    : `عرض ${filteredOrders.length} طلبات`
                  }
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {filteredOrders.length > 0 ? (
                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredOrders.map((order) => (
                      <div 
                        key={order.id}
                        className={`p-4 border-b cursor-pointer transition duration-200 ${selectedOrder?.id === order.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
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
                            <p className="text-sm mt-1">
                              {order.customerName || 'N/A'}
                            </p>
                          </div>
                          <div className={`${getStatusColor(order.status)} text-white text-xs px-2 py-1 rounded-full`}>
                            {statusOptions.find(option => option.value === order.status)?.label}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-sm">
                            {language === 'en' ? 'Items' : 'العناصر'}: {order.items?.length || 0}
                          </p>
                          <p className="text-sm font-medium">
                            {order.total} SAR
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    {language === 'en' 
                      ? 'No orders match your filters' 
                      : 'لا توجد طلبات تطابق عوامل التصفية الخاصة بك'
                    }
                  </div>
                )}
              </div>
            </div>
            
            {/* Order details */}
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-blue-800">
                        {language === 'en' ? 'Order Details' : 'تفاصيل الطلب'} #{selectedOrder.id}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className={`${getStatusColor(selectedOrder.status)} text-white text-sm px-3 py-1 rounded-full`}>
                      {statusOptions.find(option => option.value === selectedOrder.status)?.label}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Information */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-bold text-blue-800 mb-3">
                        {language === 'en' ? 'Customer Information' : 'معلومات العميل'}
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Name' : 'الاسم'}:
                          </span>
                          <p className="font-medium">{selectedOrder.customerName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Phone' : 'الهاتف'}:
                          </span>
                          <p className="font-medium">{selectedOrder.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Email' : 'البريد الإلكتروني'}:
                          </span>
                          <p className="font-medium">{selectedOrder.email || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Address' : 'العنوان'}:
                          </span>
                          <p className="font-medium">{selectedOrder.address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Information */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-bold text-blue-800 mb-3">
                        {language === 'en' ? 'Order Information' : 'معلومات الطلب'}
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Pickup Date' : 'تاريخ الاستلام'}:
                          </span>
                          <p className="font-medium">{selectedOrder.pickupTime || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Delivery Date' : 'تاريخ التوصيل'}:
                          </span>
                          <p className="font-medium">{selectedOrder.deliveryTime || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Payment Method' : 'طريقة الدفع'}:
                          </span>
                          <p className="font-medium">{selectedOrder.paymentMethod || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Payment Status' : 'حالة الدفع'}:
                          </span>
                          <p className="font-medium">
                            {selectedOrder.paymentStatus === 'paid' 
                              ? (language === 'en' ? 'Paid' : 'مدفوع') 
                              : (language === 'en' ? 'Unpaid' : 'غير مدفوع')
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-bold text-blue-800 mb-3">
                      {language === 'en' ? 'Order Items' : 'عناصر الطلب'}
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
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedOrder.items?.map((item, index) => (
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
                              <td className="px-4 py-2 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.price * item.quantity} SAR</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      {showMap && (
                        <div className="mb-6">
                          <h3 className="font-bold text-blue-800 mb-3">
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
                      
                      {/* Order Actions */}
                      <div>
                        <h3 className="font-bold text-blue-800 mb-3">
                          {language === 'en' ? 'Order Actions' : 'إجراءات الطلب'}
                        </h3>
                        
                        <div className="space-y-3">
                          {/* Update Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'en' ? 'Update Status' : 'تحديث الحالة'}
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {['pending', 'confirmed', 'pickup', 'processing', 'readyForDelivery', 'delivery', 'delivered', 'cancelled'].map((status) => (
                                <button
                                  key={status}
                                  disabled={selectedOrder.status === status}
                                  onClick={() => handleStatusUpdate(status)}
                                  className={`px-3 py-1 rounded text-sm font-medium ${
                                    selectedOrder.status === status
                                      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                      : `${getStatusColor(status)} text-white hover:opacity-90`
                                  }`}
                                >
                                  {statusOptions.find(option => option.value === status)?.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Assign to Delivery */}
                          {['readyForDelivery', 'delivery'].includes(selectedOrder.status) && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'en' ? 'Assign to Delivery Personnel' : 'تعيين إلى موظف التوصيل'}
                              </label>
                              <div className="flex flex-wrap gap-2">
                                <select
                                  value={selectedOrder.deliveryPersonId || ''}
                                  onChange={(e) => handleAssignToDelivery(e.target.value)}
                                  className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                  <option value="">
                                    {language === 'en' ? 'Select Delivery Personnel' : 'اختر موظف التوصيل'}
                                  </option>
                                  {deliveryPersonnel.map((person) => (
                                    <option key={person.id} value={person.id}>{person.name}</option>
                                  ))}
                                </select>
                                
                                <button
                                  onClick={() => setShowMap(!showMap)}
                                  className="px-3 py-1 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  {showMap 
                                    ? (language === 'en' ? 'Hide Map' : 'إخفاء الخريطة') 
                                    : (language === 'en' ? 'Show Map' : 'إظهار الخريطة')
                                  }
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {/* Contact Customer */}
                          <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700">
                              {language === 'en' ? 'Call Customer' : 'اتصل بالعميل'}
                            </button>
                            <button className="flex-1 px-3 py-2 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                              {language === 'en' ? 'Send SMS' : 'إرسال رسالة نصية'}
                            </button>
                          </div>
                          
                          {/* Print or Export */}
                          <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 rounded text-sm font-medium bg-gray-600 text-white hover:bg-gray-700">
                              {language === 'en' ? 'Print Invoice' : 'طباعة الفاتورة'}
                            </button>
                            <button className="flex-1 px-3 py-2 rounded text-sm font-medium bg-purple-600 text-white hover:bg-purple-700">
                              {language === 'en' ? 'Export Details' : 'تصدير التفاصيل'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-blue-800 mb-3">
                        {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}
                          </span>
                          <span className="font-medium">{selectedOrder.subtotal || 0} SAR</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Delivery Fee' : 'رسوم التوصيل'}
                          </span>
                          <span className="font-medium">{selectedOrder.deliveryFee || 0} SAR</span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">
                              {language === 'en' ? 'Discount' : 'الخصم'}
                            </span>
                            <span className="font-medium text-green-600">-{selectedOrder.discount} SAR</span>
                          </div>
                        )}
                        {selectedOrder.tax > 0 && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">
                              {language === 'en' ? 'Tax' : 'الضريبة'}
                            </span>
                            <span className="font-medium">{selectedOrder.tax} SAR</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2">
                          <span>
                            {language === 'en' ? 'Total' : 'الإجمالي'}
                          </span>
                          <span>{selectedOrder.total || 0} SAR</span>
                        </div>
                      </div>
                      
                      {/* Order Timeline */}
                      <div className="mt-6">
                        <h3 className="font-bold text-blue-800 mb-3">
                          {language === 'en' ? 'Order Timeline' : 'الجدول الزمني للطلب'}
                        </h3>
                        <div className="space-y-4">
                          {selectedOrder.statusHistory ? (
                            selectedOrder.statusHistory.map((status, index) => (
                              <div key={index} className="flex">
                                <div className="flex flex-col items-center mr-4">
                                  <div className={`rounded-full h-4 w-4 ${getStatusColor(status.status)}`}></div>
                                  {index < selectedOrder.statusHistory.length - 1 && (
                                    <div className="h-full w-0.5 bg-gray-300"></div>
                                  )}
                                </div>
                                <div className="pb-4">
                                  <p className="text-sm font-medium">
                                    {statusOptions.find(option => option.value === status.status)?.label}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(status.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500 text-sm">
                              {language === 'en' ? 'No status history available' : 'لا يوجد سجل للحالة متاح'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 h-full flex flex-col items-center justify-center">
                  <div className="text-blue-500 text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {language === 'en' ? 'Select an order to view details' : 'حدد طلبًا لعرض التفاصيل'}
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    {language === 'en' 
                      ? 'Click on any order from the list to view its detailed information and take actions.' 
                      : 'انقر على أي طلب من القائمة لعرض معلوماته التفصيلية واتخاذ الإجراءات.'
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
