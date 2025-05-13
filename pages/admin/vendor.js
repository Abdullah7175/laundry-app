import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

export default function VendorManagement() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVendorModal, setNewVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    cuisineType: '',
  });
  const [activeTab, setActiveTab] = useState('vendor');

  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    inactiveVendors: 0,
    arabicCuisine: 0,
    asianCuisine: 0,
    internationalCuisine: 0,
    topRatedVendors: 0
  });

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

  const fetchVendors = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would make an API call here
      // For demo, we'll use the mock users from AuthContext
      const mockVendors = [
        {
          id: 'VEN-001',
          name: 'international cleaning services',
          email: 'vendor@example.com',
          phone: '+966 50 456 7890',
          address: '456 Vendor St, Riyadh',
          cuisineType: 'Arabic',
          isActive: true,
          rating: 4.5,
          ratingCount: 120,
          logo: '/images/restaurant-logo.png'
        },
        // Add more mock vendors as needed
      ];

      setVendors(mockVendors);

      // Calculate stats
      const totalVendors = mockVendors.length;
      const activeVendors = mockVendors.filter(v => v.isActive !== false).length;
      const arabicCuisine = mockVendors.filter(v => v.cuisineType === 'Arabic').length;
      const asianCuisine = mockVendors.filter(v => v.cuisineType === 'Asian').length;
      const internationalCuisine = mockVendors.filter(v => v.cuisineType === 'International').length;
      const topRatedVendors = mockVendors.filter(v => v.rating >= 4).length;

      setStats({
        totalVendors,
        activeVendors,
        inactiveVendors: totalVendors - activeVendors,
        arabicCuisine,
        asianCuisine,
        internationalCuisine,
        topRatedVendors
      });
    } catch (error) {
      if (showNotification) {
        showNotification('error', t('admin.error_fetching_vendors'));
      }
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user && user.type !== 'admin') {
      router.push(`/${user.type}`);
      return;
    }

    if (isAuthenticated && user?.type === 'admin') {
      fetchVendors();
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendor(prev => ({ ...prev, [name]: value }));
  };

  const createVendor = async () => {
    try {
      // In a real app, you would make an API call here
      // For demo, we'll just add to local state
      const newVendorWithId = {
        ...newVendor,
        id: `VEN-${Math.floor(1000 + Math.random() * 9000)}`,
        isActive: true,
        rating: 0,
        ratingCount: 0,
        logo: '/images/default-restaurant.png'
      };

      setVendors(prev => [...prev, newVendorWithId]);
      
      if (showNotification) {
        showNotification('success', t('admin.vendor_created'));
      }
      
      setNewVendorModal(false);
      setNewVendor({
        name: '',
        email: '',
        phone: '',
        address: '',
        cuisineType: '',
      });
      
      // Refresh stats
      fetchVendors();
    } catch (error) {
      if (showNotification) {
        showNotification('error', t('admin.error_creating_vendor'));
      }
      console.error('Error creating vendor:', error);
    }
  };

  const updateVendorStatus = async (vendorId, isActive) => {
    try {
      // In a real app, you would make an API call here
      // For demo, we'll just update local state
      setVendors(prev => 
        prev.map(vendor => 
          vendor.id === vendorId ? { ...vendor, isActive } : vendor
        )
      );
      
      if (showNotification) {
        showNotification('success', t('admin.vendor_status_updated'));
      }
      
      // Refresh stats
      fetchVendors();
    } catch (error) {
      if (showNotification) {
        showNotification('error', t('admin.error_updating_status'));
      }
      console.error('Error updating vendor status:', error);
    }
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.cuisineType && vendor.cuisineType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNavigation = (path) => {
    router.push(path);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
        <Sidebar 
          navItems={navItems} 
          activeItem={activeTab} 
          setActiveItem={(item) => {
            setActiveTab(item);
            if (item !== 'vendor') {
              router.push(`/admin/${item}`);
            }
          }} 
          language={language}
          userType="admin"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              {language === 'en' ? 'Vendor Management' : 'إدارة البائعين'}
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
                {language === 'en' ? 'Total Vendors' : 'إجمالي البائعين'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-blue-600">{stats.totalVendors}</p>
                <div className="text-green-500 text-sm">
                  +{Math.floor(stats.totalVendors * 0.1)} {language === 'en' ? 'this month' : 'هذا الشهر'}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Active Vendors' : 'البائعون النشطون'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-green-600">{stats.activeVendors}</p>
                <div className="text-green-500 text-sm">
                  {Math.floor(stats.activeVendors / stats.totalVendors * 100)}% {language === 'en' ? 'of total' : 'من الإجمالي'}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Top Rated' : 'الأعلى تقييماً'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-purple-600">{stats.topRatedVendors}</p>
                <div className="text-green-500 text-sm">
                  {Math.floor(stats.topRatedVendors / stats.totalVendors * 100)}% {language === 'en' ? 'of total' : 'من الإجمالي'}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Cuisine Types' : 'أنواع المطابخ'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-orange-600">
                  {stats.arabicCuisine + stats.asianCuisine + stats.internationalCuisine}
                </p>
                <div className="text-sm">
                  <span className="text-orange-500">{stats.arabicCuisine} {language === 'en' ? 'Arabic' : 'عربي'}</span>,{' '}
                  <span className="text-blue-500">{stats.asianCuisine} {language === 'en' ? 'Asian' : 'آسيوي'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {language === 'en' ? 'All Vendors' : 'جميع البائعين'}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Manage vendors and restaurants' 
                    : 'إدارة البائعين والمطاعم'}
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Search vendors...' : 'ابحث عن البائعين...'}
                    className="pl-10 pr-4 py-2 border rounded-md text-sm w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => setNewVendorModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  {language === 'en' ? 'Add Vendor' : 'إضافة بائع'}
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Vendor' : 'البائع'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Contact' : 'الاتصال'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Cuisine' : 'المطبخ'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Rating' : 'التقييم'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Status' : 'الحالة'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Actions' : 'الإجراءات'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor) => (
                        <tr key={vendor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={vendor.logo || '/images/default-restaurant.png'} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                                <div className="text-sm text-gray-500">{vendor.address}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{vendor.email}</div>
                            <div className="text-sm text-gray-500">{vendor.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vendor.cuisineType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`h-4 w-4 ${star <= Math.round(vendor.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-1 text-sm text-gray-500">
                                ({vendor.ratingCount || 0})
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {vendor.isActive ? (language === 'en' ? 'Active' : 'نشط') : (language === 'en' ? 'Inactive' : 'غير نشط')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => updateVendorStatus(vendor.id, !vendor.isActive)}
                              className={`mr-3 ${vendor.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                            >
                              {vendor.isActive ? (language === 'en' ? 'Deactivate' : 'تعطيل') : (language === 'en' ? 'Activate' : 'تفعيل')}
                            </button>
                            <button 
                              onClick={() => handleNavigation(`/admin/vendor/${vendor.id}`)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              {language === 'en' ? 'Edit' : 'تعديل'}
                            </button>
                            <button 
                              onClick={() => console.log('Delete vendor', vendor.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              {language === 'en' ? 'Delete' : 'حذف'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          {language === 'en' ? 'No vendors found' : 'لا يوجد بائعون'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-blue-800 mb-4">
              {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setNewVendorModal(true)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">➕</span>
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Add Vendor' : 'إضافة بائع'}
                </span>
              </button>
              <button 
                onClick={() => handleNavigation('/admin/vendor')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">🏪</span>
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Manage Vendors' : 'إدارة البائعين'}
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
              <button 
                onClick={() => handleNavigation('/admin/settings')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">⚙️</span>
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Settings' : 'الإعدادات'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Vendor Modal */}
      {newVendorModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setNewVendorModal(false)}></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {language === 'en' ? 'Add New Vendor' : 'إضافة بائع جديد'}
                  </h3>
                  <div className="mt-2">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                          {language === 'en' ? 'Vendor Name' : 'اسم البائع'}
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={newVendor.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                          {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={newVendor.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-left">
                          {language === 'en' ? 'Phone' : 'الهاتف'}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={newVendor.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 text-left">
                          {language === 'en' ? 'Address' : 'العنوان'}
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={newVendor.address}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 text-left">
                          {language === 'en' ? 'Cuisine Type' : 'نوع المطبخ'}
                        </label>
                        <select
                          name="cuisineType"
                          id="cuisineType"
                          value={newVendor.cuisineType}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">{language === 'en' ? 'Select Cuisine' : 'اختر نوع المطبخ'}</option>
                          <option value="Arabic">{language === 'en' ? 'Arabic' : 'عربي'}</option>
                          <option value="Asian">{language === 'en' ? 'Asian' : 'آسيوي'}</option>
                          <option value="Bakery">{language === 'en' ? 'Bakery' : 'مخبوزات'}</option>
                          <option value="Fast Food">{language === 'en' ? 'Fast Food' : 'وجبات سريعة'}</option>
                          <option value="International">{language === 'en' ? 'International' : 'دولي'}</option>
                          <option value="Italian">{language === 'en' ? 'Italian' : 'إيطالي'}</option>
                          <option value="Mexican">{language === 'en' ? 'Mexican' : 'مكسيكي'}</option>
                          <option value="Seafood">{language === 'en' ? 'Seafood' : 'مأكولات بحرية'}</option>
                          <option value="Vegetarian">{language === 'en' ? 'Vegetarian' : 'نباتي'}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={createVendor}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  {language === 'en' ? 'Add Vendor' : 'إضافة بائع'}
                </button>
                <button
                  type="button"
                  onClick={() => setNewVendorModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  {language === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}