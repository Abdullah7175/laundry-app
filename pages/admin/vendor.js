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
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVendorModal, setNewVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cuisineType: '',
  });
  const [activeTab, setActiveTab] = useState('vendors');

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

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchVendors();
    }
  }, [user]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await fetch('/api/admin/vendors');
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      showNotification('error', t('admin.error_fetching_vendors'));
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendor(prev => ({ ...prev, [name]: value }));
  };

  const createVendor = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVendor),
      });
      
      if (response.ok) {
        showNotification('success', t('admin.vendor_created'));
        setNewVendorModal(false);
        setNewVendor({
          name: '',
          email: '',
          phone: '',
          address: '',
          cuisineType: '',
        });
        fetchVendors(); // Refresh the list
      } else {
        showNotification('error', t('admin.error_creating_vendor'));
      }
    } catch (error) {
      showNotification('error', t('admin.error_creating_vendor'));
      console.error('Error creating vendor:', error);
    }
  };

  const updateVendorStatus = async (vendorId, isActive) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/admin/vendors/${vendorId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });
      
      if (response.ok) {
        showNotification('success', t('admin.vendor_status_updated'));
        fetchVendors(); // Refresh the list
      } else {
        showNotification('error', t('admin.error_updating_status'));
      }
    } catch (error) {
      showNotification('error', t('admin.error_updating_status'));
      console.error('Error updating vendor status:', error);
    }
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigation = (path) => {
    router.push(path);
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
              {t('admin.vendor_management')}
            </h1>
            <p className="text-gray-600">
              {t('admin.manage_all_vendors')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('admin.all_vendors')}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {t('admin.manage_vendors_and_restaurants')}
                </p>
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('admin.search_vendors')}
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
                  {t('admin.add_vendor')}
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
                        {t('admin.vendor')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.contact')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.cuisine')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.rating')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.status')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor) => (
                        <tr key={vendor.id}>
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
                              {vendor.isActive ? t('admin.active') : t('admin.inactive')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => updateVendorStatus(vendor.id, !vendor.isActive)}
                              className={`mr-3 ${vendor.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                            >
                              {vendor.isActive ? t('admin.deactivate') : t('admin.activate')}
                            </button>
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              {t('admin.edit')}
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              {t('admin.delete')}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          {t('admin.no_vendors_found')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-6">
            <h2 className="text-lg font-bold text-blue-800 mb-4">
              {t('admin.quick_actions')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => handleNavigation('/admin/vendors')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">🏪</span>
                <span className="text-sm font-medium">
                  {t('admin.manage_vendors')}
                </span>
              </button>
              <button 
                onClick={() => setNewVendorModal(true)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">➕</span>
                <span className="text-sm font-medium">
                  {t('admin.add_vendor')}
                </span>
              </button>
              <button 
                onClick={() => handleNavigation('/admin/analytics')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">📈</span>
                <span className="text-sm font-medium">
                  {t('admin.vendor_analytics')}
                </span>
              </button>
              <button 
                onClick={() => handleNavigation('/admin/settings')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">⚙️</span>
                <span className="text-sm font-medium">
                  {t('admin.vendor_settings')}
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
                    {t('admin.add_new_vendor')}
                  </h3>
                  <div className="mt-2">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                          {t('admin.vendor_name')}
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
                          {t('admin.email')}
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
                          {t('admin.phone')}
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
                          {t('admin.address')}
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
                          {t('admin.cuisine_type')}
                        </label>
                        <select
                          name="cuisineType"
                          id="cuisineType"
                          value={newVendor.cuisineType}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">{t('admin.select_cuisine')}</option>
                          <option value="Arabic">{t('admin.cuisine_arabic')}</option>
                          <option value="Asian">{t('admin.cuisine_asian')}</option>
                          <option value="Bakery">{t('admin.cuisine_bakery')}</option>
                          <option value="Fast Food">{t('admin.cuisine_fast_food')}</option>
                          <option value="International">{t('admin.cuisine_international')}</option>
                          <option value="Italian">{t('admin.cuisine_italian')}</option>
                          <option value="Mexican">{t('admin.cuisine_mexican')}</option>
                          <option value="Seafood">{t('admin.cuisine_seafood')}</option>
                          <option value="Vegetarian">{t('admin.cuisine_vegetarian')}</option>
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
                  {t('admin.add_vendor')}
                </button>
                <button
                  type="button"
                  onClick={() => setNewVendorModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}