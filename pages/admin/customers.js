import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminCustomers() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const router = useRouter();
  const { user, isAuthenticated, loading, getAllUsers } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'admin') {
      router.push(`/${user.type}`);
    }

    if (isAuthenticated && user && user.type === 'admin') {
      fetchCustomers();
    }
    
    // Check if there's a customer ID in the URL
    if (router.query.id) {
      fetchCustomerById(router.query.id);
    }
  }, [loading, isAuthenticated, user, router.query.id]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await getAllUsers();
      // Filter to get only customers
      const customerUsers = allUsers.filter(u => u.type === 'customer');
      setCustomers(customerUsers);
      applyFiltersAndSort(customerUsers, searchQuery, sortOption, sortDirection);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerById = async (id) => {
    const allUsers = await getAllUsers();
    const customer = allUsers.find(c => c.type === 'customer' && c.id.toString() === id.toString());
    if (customer) {
      setSelectedCustomer(customer);
    }
  };

  const applyFiltersAndSort = (customersData, query, sortBy, direction) => {
    let filtered = [...customersData];
    
    // Apply search filter
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(customer => 
        (customer.name && customer.name.toLowerCase().includes(lowercaseQuery)) ||
        (customer.email && customer.email.toLowerCase().includes(lowercaseQuery)) ||
        (customer.phone && customer.phone.includes(lowercaseQuery))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = a.name || '';
          valueB = b.name || '';
          break;
        case 'email':
          valueA = a.email || '';
          valueB = b.email || '';
          break;
        case 'phone':
          valueA = a.phone || '';
          valueB = b.phone || '';
          break;
        case 'orders':
          valueA = a.orderCount || 0;
          valueB = b.orderCount || 0;
          break;
        case 'spent':
          valueA = a.totalSpent || 0;
          valueB = b.totalSpent || 0;
          break;
        case 'date':
          valueA = new Date(a.createdAt || 0);
          valueB = new Date(b.createdAt || 0);
          break;
        default:
          valueA = a.name || '';
          valueB = b.name || '';
      }
      
      if (direction === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredCustomers(filtered);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFiltersAndSort(customers, query, sortOption, sortDirection);
  };

  const handleSort = (option) => {
    // Toggle direction if clicking the same option
    const newDirection = option === sortOption ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortOption(option);
    setSortDirection(newDirection);
    applyFiltersAndSort(customers, searchQuery, option, newDirection);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    router.push(`/admin/customers?id=${customer.id}`, undefined, { shallow: true });
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
              {language === 'en' ? 'Manage Customers' : 'إدارة العملاء'}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer list */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Search Customers' : 'البحث عن العملاء'}
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder={language === 'en' ? 'Name, email, phone...' : 'الاسم، البريد الإلكتروني، الهاتف...'}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  {language === 'en' 
                    ? `${filteredCustomers.length} customers found` 
                    : `تم العثور على ${filteredCustomers.length} عميل`
                  }
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {filteredCustomers.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
                      <button 
                        onClick={() => handleSort('name')}
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        {language === 'en' ? 'Name' : 'الاسم'}
                        {sortOption === 'name' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                      <button 
                        onClick={() => handleSort('orders')}
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        {language === 'en' ? 'Orders' : 'الطلبات'}
                        {sortOption === 'orders' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    </div>
                    
                    <div className="max-h-[600px] overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <div 
                          key={customer.id}
                          className={`p-4 border-b cursor-pointer transition duration-200 ${selectedCustomer?.id === customer.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{customer.name || 'N/A'}</h3>
                              <p className="text-sm text-gray-500">{customer.email || 'N/A'}</p>
                              {customer.phone && (
                                <p className="text-sm text-gray-500">{customer.phone}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {customer.orderCount || 0} {language === 'en' ? 'orders' : 'طلبات'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {language === 'en' ? 'Since' : 'منذ'} {new Date(customer.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    {language === 'en' 
                      ? 'No customers found matching your search' 
                      : 'لم يتم العثور على عملاء يطابقون بحثك'
                    }
                  </div>
                )}
              </div>
            </div>
            
            {/* Customer details */}
            <div className="lg:col-span-2">
              {selectedCustomer ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-blue-800">{selectedCustomer.name}</h2>
                      <p className="text-gray-600">{selectedCustomer.email}</p>
                      {selectedCustomer.phone && (
                        <p className="text-gray-600">{selectedCustomer.phone}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        {language === 'en' ? 'Edit' : 'تعديل'}
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                        {language === 'en' ? 'Delete' : 'حذف'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Information */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-bold text-blue-800 mb-3">
                        {language === 'en' ? 'Customer Information' : 'معلومات العميل'}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Name' : 'الاسم'}:
                          </span>
                          <p className="font-medium">{selectedCustomer.name || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Email' : 'البريد الإلكتروني'}:
                          </span>
                          <p className="font-medium">{selectedCustomer.email || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Phone' : 'الهاتف'}:
                          </span>
                          <p className="font-medium">{selectedCustomer.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Address' : 'العنوان'}:
                          </span>
                          <p className="font-medium">{selectedCustomer.address || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'City' : 'المدينة'}:
                          </span>
                          <p className="font-medium">{selectedCustomer.city || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Member Since' : 'عضو منذ'}:
                          </span>
                          <p className="font-medium">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Customer Statistics */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-bold text-blue-800 mb-3">
                        {language === 'en' ? 'Customer Statistics' : 'إحصائيات العميل'}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Total Orders' : 'إجمالي الطلبات'}:
                          </span>
                          <p className="font-medium">{selectedCustomer.orderCount || 0}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Completed Orders' : 'الطلبات المكتملة'}:
                          </span>
                          <p className="font-medium">{selectedCustomer.completedOrders || 0}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Cancelled Orders' : 'الطلبات الملغاة'}:
                          </span>
                          <p className="font-medium">{selectedCustomer.cancelledOrders || 0}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Total Spent' : 'إجمالي الإنفاق'}:
                          </span>
                          <p className="font-medium">{selectedCustomer.totalSpent || 0} SAR</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Average Order Value' : 'متوسط قيمة الطلب'}:
                          </span>
                          <p className="font-medium">
                            {selectedCustomer.orderCount > 0 
                              ? Math.round((selectedCustomer.totalSpent || 0) / selectedCustomer.orderCount) 
                              : 0} SAR
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            {language === 'en' ? 'Loyalty Points' : 'نقاط الولاء'}:
                          </span>
                          <p className="font-medium">{selectedCustomer.loyaltyPoints || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Orders */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-blue-800">
                        {language === 'en' ? 'Recent Orders' : 'الطلبات الأخيرة'}
                      </h3>
                      <button 
                        onClick={() => router.push(`/admin/orders?customer=${selectedCustomer.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {language === 'en' ? 'View All Orders' : 'عرض جميع الطلبات'}
                      </button>
                    </div>
                    
                    {selectedCustomer.recentOrders && selectedCustomer.recentOrders.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {language === 'en' ? 'Order ID' : 'رقم الطلب'}
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
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedCustomer.recentOrders.map((order) => (
                              <tr 
                                key={order.id} 
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => router.push(`/admin/orders?id=${order.id}`)}
                              >
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-blue-600">
                                  #{order.id}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                    ${['pending', 'confirmed', 'pickup', 'processing', 'readyForDelivery', 'delivery'].includes(order.status) ? 'bg-yellow-100 text-yellow-800' : ''}
                                  `}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                                  {order.total} SAR
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-md">
                        <p className="text-gray-500">
                          {language === 'en' 
                            ? 'This customer has no orders yet' 
                            : 'ليس لدى هذا العميل أي طلبات حتى الآن'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Notes and Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-blue-800 mb-3">
                        {language === 'en' ? 'Customer Notes' : 'ملاحظات العميل'}
                      </h3>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 h-32"
                        placeholder={language === 'en' ? 'Add notes about this customer...' : 'أضف ملاحظات حول هذا العميل...'}
                        defaultValue={selectedCustomer.notes || ''}
                      ></textarea>
                      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        {language === 'en' ? 'Save Notes' : 'حفظ الملاحظات'}
                      </button>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-blue-800 mb-3">
                        {language === 'en' ? 'Customer Actions' : 'إجراءات العميل'}
                      </h3>
                      <div className="space-y-3">
                        <button 
                          onClick={() => router.push(`/admin/orders?customer=${selectedCustomer.id}`)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                        >
                          <span className="mr-2">📦</span>
                          {language === 'en' ? 'View All Orders' : 'عرض جميع الطلبات'}
                        </button>
                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center">
                          <span className="mr-2">📧</span>
                          {language === 'en' ? 'Send Email' : 'إرسال بريد إلكتروني'}
                        </button>
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center justify-center">
                          <span className="mr-2">💰</span>
                          {language === 'en' ? 'Add Special Discount' : 'إضافة خصم خاص'}
                        </button>
                        <button className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition flex items-center justify-center">
                          <span className="mr-2">⚠️</span>
                          {language === 'en' ? 'Block Customer' : 'حظر العميل'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 h-full flex flex-col items-center justify-center">
                  <div className="text-blue-500 text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {language === 'en' ? 'Select a customer to view details' : 'حدد عميلًا لعرض التفاصيل'}
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    {language === 'en' 
                      ? 'Click on any customer from the list to view their details, order history, and take actions.' 
                      : 'انقر على أي عميل من القائمة لعرض التفاصيل الخاصة به، وسجل الطلبات، واتخاذ الإجراءات.'
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
