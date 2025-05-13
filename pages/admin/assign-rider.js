// pages/admin/rider.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useDelivery } from '../../context/DeliveryContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../../components/Modal';

export default function RiderManagement() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    loading: authLoading 
  } = useAuth();
  const { t } = useLanguage();
  const { 
    riders, 
    availableRiders, 
    busyRiders, 
    getRiders, 
    assignRider, 
    addRider,
    updateRiderStatus 
  } = useDelivery();

  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('riders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newRider, setNewRider] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: 'bike',
    status: 'available'
  });

  // Admin navigation items
  const navItems = [
    { id: 'dashboard', label: language === 'en' ? 'Dashboard' : 'لوحة القيادة', icon: '📊' },
    { id: 'orders', label: language === 'en' ? 'Orders' : 'الطلبات', icon: '📦' },
    { id: 'users', label: language === 'en' ? 'Users' : 'العملاء', icon: '👥' },
    { id: 'vendor', label: language === 'en' ? 'Vendor' : 'البائعين', icon: '🏪' },
    { id: 'rider', label: language === 'en' ? 'Riders' : 'الدراجين', icon: '🏍️' },
    { id: 'customers', label: language === 'en' ? 'Customers' : 'العملاء', icon: '👥' },
    { id: 'analytics', label: language === 'en' ? 'Analytics' : 'التحليلات', icon: '📈' },
    { id: 'pricing', label: language === 'en' ? 'Pricing' : 'التسعير', icon: '💰' },
    { id: 'areas', label: language === 'en' ? 'Service Areas' : 'مناطق الخدمة', icon: '🗺️' },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'الإعدادات', icon: '⚙️' }
  ];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'admin') {
      router.push(`/${user.type}`);
    }

    if (isAuthenticated && user && user.type === 'admin') {
      const fetchRiders = async () => {
        await getRiders();
        setLoading(false);
      };
      fetchRiders();
    }
  }, [authLoading, isAuthenticated, user, router, getRiders]);

  const filteredRiders = riders.filter(rider => 
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRider(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRider = async (e) => {
    e.preventDefault();
    try {
      await addRider(newRider);
      setIsModalOpen(false);
      setNewRider({
        name: '',
        email: '',
        phone: '',
        vehicle: 'bike',
        status: 'available'
      });
      await getRiders(); // Refresh the list
    } catch (error) {
      console.error('Error adding rider:', error);
    }
  };

  const handleStatusChange = async (riderId, newStatus) => {
    try {
      await updateRiderStatus(riderId, newStatus);
      await getRiders(); // Refresh the list
    } catch (error) {
      console.error('Error updating rider status:', error);
    }
  };

  if (authLoading || loading) {
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
            if (item !== 'rider') {
              router.push(`/admin/${item}`);
            }
          }} 
          language={language}
          userType="admin"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              {language === 'en' ? 'Rider Management' : 'إدارة الدراجين'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' 
                ? `Manage all delivery riders in the system` 
                : `إدارة جميع الدراجين في النظام`}
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Total Riders' : 'إجمالي الدراجين'}
              </h3>
              <p className="text-2xl font-bold text-blue-600">{riders.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Available Riders' : 'الدراجين المتاحين'}
              </h3>
              <p className="text-2xl font-bold text-green-600">{availableRiders.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Busy Riders' : 'الدراجين المشغولين'}
              </h3>
              <p className="text-2xl font-bold text-orange-600">{busyRiders.length}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {language === 'en' ? 'All Riders' : 'جميع الدراجين'}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Manage rider status and assignments' 
                    : 'إدارة حالة الدراجين والتعيينات'}
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Search riders...' : 'ابحث عن الدراجين...'}
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
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  {language === 'en' ? 'Add Rider' : 'إضافة دراج'}
                </button>
              </div>
            </div>
            
            {riders.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-gray-500">
                  {language === 'en' ? 'No riders found' : 'لا يوجد دراجين'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Rider' : 'الدراج'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Contact' : 'الاتصال'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Vehicle' : 'المركبة'}
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
                    {filteredRiders.map((rider) => (
                      <tr key={rider.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={rider.avatar || '/images/default-rider.png'} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                              <div className="text-sm text-gray-500">ID: {rider.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{rider.email}</div>
                          <div className="text-sm text-gray-500">{rider.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {language === 'en' 
                              ? rider.vehicle.charAt(0).toUpperCase() + rider.vehicle.slice(1)
                              : rider.vehicle === 'bike' ? 'دراجة'
                              : rider.vehicle === 'motorcycle' ? 'دراجة نارية'
                              : 'سيارة'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={rider.status}
                            onChange={(e) => handleStatusChange(rider.id, e.target.value)}
                            className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                              rider.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            <option value="available">
                              {language === 'en' ? 'Available' : 'متاح'}
                            </option>
                            <option value="busy">
                              {language === 'en' ? 'Busy' : 'مشغول'}
                            </option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => router.push(`/admin/rider/${rider.id}`)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            {language === 'en' ? 'View' : 'عرض'}
                          </button>
                          <button 
                            onClick={() => console.log('Delete rider', rider.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {language === 'en' ? 'Delete' : 'حذف'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Rider Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-blue-800 mb-4">
            {language === 'en' ? 'Add New Rider' : 'إضافة دراج جديد'}
          </h2>
          
          <form onSubmit={handleAddRider}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newRider.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newRider.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newRider.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Vehicle Type' : 'نوع المركبة'}
                </label>
                <select
                  id="vehicle"
                  name="vehicle"
                  value={newRider.vehicle}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="bike">
                    {language === 'en' ? 'Bicycle' : 'دراجة'}
                  </option>
                  <option value="motorcycle">
                    {language === 'en' ? 'Motorcycle' : 'دراجة نارية'}
                  </option>
                  <option value="car">
                    {language === 'en' ? 'Car' : 'سيارة'}
                  </option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {language === 'en' ? 'Add Rider' : 'إضافة دراج'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Layout>
  );
}