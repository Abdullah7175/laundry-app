import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../../components/Modal';

export default function UserManagement() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('users');
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    loading, 
    getAllUsers 
  } = useAuth();
  const { t } = useLanguage();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    customers: 0,
    vendors: 0,
    riders: 0,
    admins: 0
  });

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'customer',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would call your API here
      // const response = await addUser(newUser);
      
      // For demo purposes, we'll just log and show success
      console.log('New user data:', newUser);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setNewUser({
          name: '',
          email: '',
          phone: '',
          type: 'customer',
          password: ''
        });
        setSubmitSuccess(false);
        setIsAddUserModalOpen(false);
        // You might want to refresh the user list here
        // fetchUsers();
      }, 2000);
    } catch (error) {
      setSubmitError(error.message || 'Failed to add user');
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'admin') {
      router.push(`/${user.type}`);
    }

    if (isAuthenticated && user && user.type === 'admin') {
      const fetchUsers = async () => {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
        
        const totalUsers = fetchedUsers.length;
        const activeUsers = fetchedUsers.filter(u => u.isActive !== false).length; // Default to active if not specified
        const customers = fetchedUsers.filter(u => u.type === 'customer').length;
        const vendors = fetchedUsers.filter(u => u.type === 'vendor').length;
        const riders = fetchedUsers.filter(u => u.type === 'delivery').length; // Using 'delivery' as riders
        const admins = fetchedUsers.filter(u => u.type === 'admin').length;
        
        setStats({
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          customers,
          vendors,
          riders,
          admins
        });
      };
      
      fetchUsers();
    }
  }, [loading, isAuthenticated, user, router, getAllUsers]);

  // Admin navigation items (same as dashboard)
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

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigation = (path) => {
    router.push(path);
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

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
        <Sidebar 
          navItems={navItems} 
          activeItem={activeTab} 
          setActiveItem={(item) => {
            setActiveTab(item);
            if (item !== 'users') {
              router.push(`/admin/${item}`);
            }
          }} 
          language={language}
          userType="admin"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              {language === 'en' ? 'User Management' : 'إدارة المستخدمين'}
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
                {language === 'en' ? 'Total Users' : 'إجمالي المستخدمين'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                <div className="text-green-500 text-sm">
                  +{Math.floor(stats.totalUsers * 0.1)} {language === 'en' ? 'this month' : 'هذا الشهر'}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Active Users' : 'المستخدمون النشطون'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                <div className="text-green-500 text-sm">
                  {Math.floor(stats.activeUsers / stats.totalUsers * 100)}% {language === 'en' ? 'of total' : 'من الإجمالي'}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Customers' : 'العملاء'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-purple-600">{stats.customers}</p>
                <div className="text-green-500 text-sm">
                  {Math.floor(stats.customers / stats.totalUsers * 100)}% {language === 'en' ? 'of total' : 'من الإجمالي'}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === 'en' ? 'Vendors & Riders' : 'البائعين والراكبين'}
              </h3>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-orange-600">
                  {stats.vendors + stats.riders}
                </p>
                <div className="text-sm">
                  <span className="text-orange-500">{stats.vendors} {language === 'en' ? 'vendors' : 'بائعين'}</span>,{' '}
                  <span className="text-blue-500">{stats.riders} {language === 'en' ? 'riders' : 'راكبين'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {language === 'en' ? 'All Users' : 'جميع المستخدمين'}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Manage user roles and permissions' 
                    : 'إدارة أدوار المستخدمين والأذونات'}
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Search users...' : 'ابحث عن المستخدمين...'}
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
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  {language === 'en' ? 'Add User' : 'إضافة مستخدم'}
                </button>
              </div>
            </div>
            
            {users.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'User' : 'المستخدم'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Contact' : 'الاتصال'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'en' ? 'Role' : 'الدور'}
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
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={user.avatar || '/images/default-avatar.png'} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone || language === 'en' ? 'No phone' : 'لا يوجد هاتف'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {language === 'en' 
                                ? user.type.charAt(0).toUpperCase() + user.type.slice(1)
                                : user.type === 'admin' ? 'مسؤول'
                                : user.type === 'vendor' ? 'بائع'
                                : user.type === 'delivery' ? 'راكب'
                                : 'عميل'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {user.isActive !== false 
                                ? (language === 'en' ? 'Active' : 'نشط') 
                                : (language === 'en' ? 'Inactive' : 'غير نشط')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleNavigation(`/admin/users/${user.id}`)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              {language === 'en' ? 'Edit' : 'تعديل'}
                            </button>
                            <button 
                              onClick={() => console.log('Delete user', user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              {language === 'en' ? 'Delete' : 'حذف'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          {language === 'en' ? 'No users found' : 'لا يوجد مستخدمون'}
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
                onClick={() => setIsAddUserModalOpen(true)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">➕</span>
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Add User' : 'إضافة مستخدم'}
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
                onClick={() => handleNavigation('/admin/assign-rider')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-4 rounded-lg transition duration-300 flex flex-col items-center"
              >
                <span className="text-2xl mb-2">🏍️</span>
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Manage Riders' : 'إدارة الراكبين'}
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
        </div>
      </div>
      {/* Add User Modal */}
<Modal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)}>
  <div className="bg-white rounded-lg p-6 max-w-md w-full">
    <h2 className="text-xl font-bold text-blue-800 mb-4">
      {language === 'en' ? 'Add New User' : 'إضافة مستخدم جديد'}
    </h2>
    
    {submitSuccess ? (
      <div className="text-center py-4">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {language === 'en' ? 'User Added Successfully!' : 'تمت إضافة المستخدم بنجاح!'}
        </h3>
        <p className="text-sm text-gray-500">
          {language === 'en' 
            ? 'The new user has been added to the system.' 
            : 'تمت إضافة المستخدم الجديد إلى النظام.'}
        </p>
      </div>
    ) : (
      <form onSubmit={handleAddUserSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newUser.name}
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
              value={newUser.email}
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
              value={newUser.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'User Type' : 'نوع المستخدم'}
            </label>
            <select
              id="type"
              name="type"
              value={newUser.type}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="customer">
                {language === 'en' ? 'Customer' : 'عميل'}
              </option>
              <option value="vendor">
                {language === 'en' ? 'Vendor' : 'بائع'}
              </option>
              <option value="delivery">
                {language === 'en' ? 'Rider' : 'راكب'}
              </option>
              <option value="admin">
                {language === 'en' ? 'Admin' : 'مسؤول'}
              </option>
            </select>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Password' : 'كلمة المرور'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              minLength="6"
            />
          </div>
        </div>
        
        {submitError && (
          <div className="mt-4 text-red-500 text-sm">
            {submitError}
          </div>
        )}
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {language === 'en' ? 'Cancel' : 'إلغاء'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              language === 'en' ? 'Adding...' : 'جاري الإضافة...'
            ) : (
              language === 'en' ? 'Add User' : 'إضافة مستخدم'
            )}
          </button>
        </div>
      </form>
    )}
  </div>
</Modal>
    </Layout>
  );
}