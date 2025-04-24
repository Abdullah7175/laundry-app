import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';

export default function CustomerProfile() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('profile');
  const [activeSection, setActiveSection] = useState('details');
  const router = useRouter();
  const { user, isAuthenticated, loading, updateUser, logout } = useAuth();
  const { orders } = useOrder();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'customer') {
      router.push(`/${user.type}`);
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        password: '',
        confirmPassword: ''
      });
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

  // Customer navigation items
  const navItems = [
    { id: 'dashboard', label: language === 'en' ? 'Dashboard' : 'لوحة التحكم', icon: '📊' },
    { id: 'orders', label: language === 'en' ? 'My Orders' : 'طلباتي', icon: '📦' },
    { id: 'book', label: language === 'en' ? 'New Order' : 'طلب جديد', icon: '➕' },
    { id: 'profile', label: language === 'en' ? 'Profile' : 'الملف الشخصي', icon: '👤' },
    { id: 'support', label: language === 'en' ? 'Support' : 'الدعم', icon: '🔧' }
  ];

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
    
    // Reset form data if cancelling edit
    if (isEditing) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate password if attempting to change it
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      setError(language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة');
      return;
    }
    
    setSaveLoading(true);
    
    try {
      // Update user information
      const updatedData = { ...profileData };
      if (!updatedData.password) {
        delete updatedData.password;
        delete updatedData.confirmPassword;
      } else {
        delete updatedData.confirmPassword;
      }
      
      const success = await updateUser(user.id, updatedData);
      
      if (success) {
        setSuccess(language === 'en' ? 'Profile updated successfully' : 'تم تحديث الملف الشخصي بنجاح');
        setIsEditing(false);
      } else {
        setError(language === 'en' ? 'Failed to update profile' : 'فشل في تحديث الملف الشخصي');
      }
    } catch (error) {
      setError(error.message || (language === 'en' ? 'An error occurred' : 'حدث خطأ'));
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Calculate stats
  const orderStats = {
    total: orders.length,
    completed: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    loyaltyPoints: orders.reduce((sum, order) => sum + (order.loyaltyPoints || 0), 0)
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
        <Sidebar 
          navItems={navItems} 
          activeItem={activeTab} 
          setActiveItem={(item) => {
            setActiveTab(item);
            if (item !== 'profile') {
              router.push(`/dashboard${item === 'dashboard' ? '' : `/${item}`}`);
            }
          }} 
          language={language}
          userType="customer"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">
            {language === 'en' ? 'My Profile' : 'ملفي الشخصي'}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col items-center py-4">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
                  
                  <div className="flex space-x-2">
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {language === 'en' ? 'Customer' : 'عميل'}
                    </div>
                    {orderStats.total > 10 && (
                      <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {language === 'en' ? 'Premium' : 'متميز'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <ul>
                    <li>
                      <button
                        onClick={() => setActiveSection('details')}
                        className={`w-full text-left px-3 py-2 rounded-md transition duration-200 ${activeSection === 'details' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      >
                        {language === 'en' ? 'Personal Details' : 'البيانات الشخصية'}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveSection('addresses')}
                        className={`w-full text-left px-3 py-2 rounded-md transition duration-200 ${activeSection === 'addresses' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      >
                        {language === 'en' ? 'Addresses' : 'العناوين'}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveSection('security')}
                        className={`w-full text-left px-3 py-2 rounded-md transition duration-200 ${activeSection === 'security' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      >
                        {language === 'en' ? 'Security' : 'الأمان'}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveSection('loyalty')}
                        className={`w-full text-left px-3 py-2 rounded-md transition duration-200 ${activeSection === 'loyalty' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      >
                        {language === 'en' ? 'Loyalty & Rewards' : 'الولاء والمكافآت'}
                      </button>
                    </li>
                  </ul>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition duration-200"
                  >
                    {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="lg:col-span-3">
              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}
              
              {/* Personal Details Section */}
              {activeSection === 'details' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-800">
                      {language === 'en' ? 'Personal Details' : 'البيانات الشخصية'}
                    </h2>
                    <button
                      onClick={handleEditToggle}
                      className={`px-4 py-2 rounded-md ${
                        isEditing 
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      } transition duration-300`}
                    >
                      {isEditing 
                        ? (language === 'en' ? 'Cancel' : 'إلغاء') 
                        : (language === 'en' ? 'Edit' : 'تعديل')
                      }
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        ) : (
                          <p className="py-2">{profileData.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        ) : (
                          <p className="py-2">{profileData.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        ) : (
                          <p className="py-2">{profileData.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                          disabled={saveLoading}
                        >
                          {saveLoading ? (
                            <span>{language === 'en' ? 'Saving...' : 'جار الحفظ...'}</span>
                          ) : (
                            <span>{language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}</span>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}
              
              {/* Addresses Section */}
              {activeSection === 'addresses' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-800">
                      {language === 'en' ? 'Addresses' : 'العناوين'}
                    </h2>
                    <button
                      onClick={handleEditToggle}
                      className={`px-4 py-2 rounded-md ${
                        isEditing 
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      } transition duration-300`}
                    >
                      {isEditing 
                        ? (language === 'en' ? 'Cancel' : 'إلغاء') 
                        : (language === 'en' ? 'Edit' : 'تعديل')
                      }
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        {language === 'en' ? 'Address' : 'العنوان'}
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={profileData.address}
                          onChange={handleChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          rows="3"
                        ></textarea>
                      ) : (
                        <p className="py-2">{profileData.address || (language === 'en' ? 'No address provided' : 'لم يتم تقديم عنوان')}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        {language === 'en' ? 'City' : 'المدينة'}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      ) : (
                        <p className="py-2">{profileData.city || (language === 'en' ? 'No city provided' : 'لم يتم تقديم مدينة')}</p>
                      )}
                    </div>
                    
                    {isEditing && (
                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                          disabled={saveLoading}
                        >
                          {saveLoading ? (
                            <span>{language === 'en' ? 'Saving...' : 'جار الحفظ...'}</span>
                          ) : (
                            <span>{language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}</span>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}
              
              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-800">
                      {language === 'en' ? 'Security' : 'الأمان'}
                    </h2>
                    <button
                      onClick={handleEditToggle}
                      className={`px-4 py-2 rounded-md ${
                        isEditing 
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      } transition duration-300`}
                    >
                      {isEditing 
                        ? (language === 'en' ? 'Cancel' : 'إلغاء') 
                        : (language === 'en' ? 'Change Password' : 'تغيير كلمة المرور')
                      }
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          {language === 'en' ? 'New Password' : 'كلمة المرور الجديدة'}
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={profileData.password}
                          onChange={handleChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          {language === 'en' ? 'Confirm New Password' : 'تأكيد كلمة المرور الجديدة'}
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={profileData.confirmPassword}
                          onChange={handleChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                          disabled={saveLoading}
                        >
                          {saveLoading ? (
                            <span>{language === 'en' ? 'Updating...' : 'جار التحديث...'}</span>
                          ) : (
                            <span>{language === 'en' ? 'Update Password' : 'تحديث كلمة المرور'}</span>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <p className="text-gray-600">
                          {language === 'en' 
                            ? 'Last password change: Never' 
                            : 'آخر تغيير لكلمة المرور: أبدًا'
                          }
                        </p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-md mb-4">
                        <h3 className="font-medium text-blue-800 mb-2">
                          {language === 'en' ? 'Password Tip' : 'نصيحة كلمة المرور'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {language === 'en'
                            ? 'For best security, use a password that is at least 8 characters long, includes numbers, symbols, and upper and lowercase letters.'
                            : 'للحصول على أفضل أمان، استخدم كلمة مرور لا تقل عن 8 أحرف، وتشمل أرقامًا ورموزًا وأحرفًا كبيرة وصغيرة.'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Loyalty & Rewards Section */}
              {activeSection === 'loyalty' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-blue-800 mb-6">
                    {language === 'en' ? 'Loyalty & Rewards' : 'الولاء والمكافآت'}
                  </h2>
                  
                  <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-bold text-blue-800">
                          {language === 'en' ? 'Loyalty Points' : 'نقاط الولاء'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {language === 'en' 
                            ? 'Earn points with every order' 
                            : 'اكسب النقاط مع كل طلب'
                          }
                        </p>
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {orderStats.loyaltyPoints}
                      </div>
                    </div>
                    
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${Math.min((orderStats.loyaltyPoints / 500) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {language === 'en' 
                        ? `${500 - (orderStats.loyaltyPoints % 500)} more points for your next reward` 
                        : `${500 - (orderStats.loyaltyPoints % 500)} نقطة أخرى لمكافأتك التالية`
                      }
                    </p>
                  </div>
                  
                  <h3 className="font-bold text-blue-800 mb-4">
                    {language === 'en' ? 'Available Rewards' : 'المكافآت المتاحة'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className={`border border-gray-200 rounded-lg p-4 ${orderStats.loyaltyPoints >= 200 ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{language === 'en' ? '10% Discount' : 'خصم 10٪'}</h4>
                        <span className="text-blue-600 font-bold">200 {language === 'en' ? 'pts' : 'نقطة'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {language === 'en' 
                          ? 'Get 10% off on your next order' 
                          : 'احصل على خصم 10٪ على طلبك التالي'
                        }
                      </p>
                      <button 
                        className={`w-full py-1 px-3 rounded text-center ${
                          orderStats.loyaltyPoints >= 200
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={orderStats.loyaltyPoints < 200}
                      >
                        {language === 'en' ? 'Redeem' : 'استبدال'}
                      </button>
                    </div>
                    
                    <div className={`border border-gray-200 rounded-lg p-4 ${orderStats.loyaltyPoints >= 300 ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{language === 'en' ? 'Free Delivery' : 'توصيل مجاني'}</h4>
                        <span className="text-blue-600 font-bold">300 {language === 'en' ? 'pts' : 'نقطة'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {language === 'en' 
                          ? 'Free delivery on your next order' 
                          : 'توصيل مجاني على طلبك التالي'
                        }
                      </p>
                      <button 
                        className={`w-full py-1 px-3 rounded text-center ${
                          orderStats.loyaltyPoints >= 300
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={orderStats.loyaltyPoints < 300}
                      >
                        {language === 'en' ? 'Redeem' : 'استبدال'}
                      </button>
                    </div>
                    
                    <div className={`border border-gray-200 rounded-lg p-4 ${orderStats.loyaltyPoints >= 500 ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{language === 'en' ? '25% Discount' : 'خصم 25٪'}</h4>
                        <span className="text-blue-600 font-bold">500 {language === 'en' ? 'pts' : 'نقطة'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {language === 'en' 
                          ? 'Get 25% off on your next order' 
                          : 'احصل على خصم 25٪ على طلبك التالي'
                        }
                      </p>
                      <button 
                        className={`w-full py-1 px-3 rounded text-center ${
                          orderStats.loyaltyPoints >= 500
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={orderStats.loyaltyPoints < 500}
                      >
                        {language === 'en' ? 'Redeem' : 'استبدال'}
                      </button>
                    </div>
                    
                    <div className={`border border-gray-200 rounded-lg p-4 ${orderStats.loyaltyPoints >= 1000 ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{language === 'en' ? 'Free Service' : 'خدمة مجانية'}</h4>
                        <span className="text-blue-600 font-bold">1000 {language === 'en' ? 'pts' : 'نقطة'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {language === 'en' 
                          ? 'Get one free cleaning service' 
                          : 'احصل على خدمة تنظيف مجانية واحدة'
                        }
                      </p>
                      <button 
                        className={`w-full py-1 px-3 rounded text-center ${
                          orderStats.loyaltyPoints >= 1000
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={orderStats.loyaltyPoints < 1000}
                      >
                        {language === 'en' ? 'Redeem' : 'استبدال'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold text-blue-800 mb-2">
                      {language === 'en' ? 'How to Earn Points' : 'كيفية كسب النقاط'}
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm">
                      <li>
                        {language === 'en' 
                          ? 'Earn 10 points for every 1 SAR spent' 
                          : 'اكسب 10 نقاط مقابل كل 1 ريال سعودي تنفقه'
                        }
                      </li>
                      <li>
                        {language === 'en' 
                          ? 'Get 50 bonus points for referring a friend' 
                          : 'احصل على 50 نقطة إضافية عند إحالة صديق'
                        }
                      </li>
                      <li>
                        {language === 'en' 
                          ? 'Earn double points on special occasions' 
                          : 'اكسب نقاطًا مضاعفة في المناسبات الخاصة'
                        }
                      </li>
                      <li>
                        {language === 'en' 
                          ? 'Get 100 bonus points for every 5th order' 
                          : 'احصل على 100 نقطة إضافية مقابل كل 5 طلبات'
                        }
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
