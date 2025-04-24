import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DeliveryLayout from '../../components/layout/DeliveryLayout';
import { useAuth } from '../../context/AuthContext';

export default function DeliveryProfile() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  
  const [language, setLanguage] = useState('en');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: 'motorcycle',
    licenseNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    // Check for language preference in localStorage
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // Populate form data with user info
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        vehicle: user.vehicle || 'motorcycle',
        licenseNumber: user.licenseNumber || '',
      });
    }
  }, [user]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateUser(user.id, formData);
      setSuccess(language === 'en' ? 'Profile updated successfully!' : 'تم تحديث الملف الشخصي بنجاح!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(language === 'en' ? 'Failed to update profile' : 'فشل في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  return (
    <DeliveryLayout title={language === 'en' ? 'My Profile' : 'ملفي الشخصي'}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {!isEditing ? (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="bg-primary-100 text-primary-600 p-6 rounded-full mr-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600">{language === 'en' ? 'Delivery Rider' : 'سائق توصيل'}</p>
              </div>
            </div>
            
            {success && (
              <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md">
                {success}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                  {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                </h3>
                <p className="text-gray-800">{user?.email}</p>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                  {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                </h3>
                <p className="text-gray-800">{user?.phone}</p>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                  {language === 'en' ? 'Vehicle Type' : 'نوع المركبة'}
                </h3>
                <p className="text-gray-800">
                  {formData.vehicle === 'motorcycle' 
                    ? (language === 'en' ? 'Motorcycle' : 'دراجة نارية')
                    : formData.vehicle === 'bicycle'
                      ? (language === 'en' ? 'Bicycle' : 'دراجة هوائية')
                      : (language === 'en' ? 'Car' : 'سيارة')
                  }
                </p>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                  {language === 'en' ? 'License Number' : 'رقم الرخصة'}
                </h3>
                <p className="text-gray-800">{formData.licenseNumber || (language === 'en' ? 'Not provided' : 'غير متوفر')}</p>
              </div>
            </div>
            
            <div className="flex mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
              </button>
              
              <button
                onClick={handleLogout}
                className="ml-4 bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
            </h2>
            
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Vehicle Type' : 'نوع المركبة'}
                  </label>
                  <select
                    id="vehicle"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="motorcycle">{language === 'en' ? 'Motorcycle' : 'دراجة نارية'}</option>
                    <option value="bicycle">{language === 'en' ? 'Bicycle' : 'دراجة هوائية'}</option>
                    <option value="car">{language === 'en' ? 'Car' : 'سيارة'}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'License Number' : 'رقم الرخصة'}
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="flex mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {loading 
                    ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...') 
                    : (language === 'en' ? 'Save Changes' : 'حفظ التغييرات')
                  }
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="ml-4 bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {language === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Performance Stats and Account Settings */}
        <div className="bg-gray-50 p-6 border-t border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {language === 'en' ? 'Performance Statistics' : 'إحصائيات الأداء'}
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-primary-600">4.8</div>
              <div className="text-xs text-gray-500">{language === 'en' ? 'Rating' : 'التقييم'}</div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-primary-600">98%</div>
              <div className="text-xs text-gray-500">{language === 'en' ? 'On-time' : 'في الوقت المحدد'}</div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-primary-600">45</div>
              <div className="text-xs text-gray-500">{language === 'en' ? 'Deliveries' : 'التوصيلات'}</div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {language === 'en' ? 'Account Settings' : 'إعدادات الحساب'}
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">
                  {language === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}
                </h4>
                <p className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Update your password regularly for security' 
                    : 'قم بتحديث كلمة المرور بانتظام للحفاظ على الأمان'
                  }
                </p>
              </div>
              <button className="text-primary-600 hover:text-primary-700">
                {language === 'en' ? 'Change' : 'تغيير'}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">
                  {language === 'en' ? 'Notification Settings' : 'إعدادات الإشعارات'}
                </h4>
                <p className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Manage how you receive notifications' 
                    : 'إدارة كيفية تلقي الإشعارات'
                  }
                </p>
              </div>
              <button className="text-primary-600 hover:text-primary-700">
                {language === 'en' ? 'Manage' : 'إدارة'}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">
                  {language === 'en' ? 'Payment Info' : 'معلومات الدفع'}
                </h4>
                <p className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Update your payment details' 
                    : 'تحديث تفاصيل الدفع الخاصة بك'
                  }
                </p>
              </div>
              <button className="text-primary-600 hover:text-primary-700">
                {language === 'en' ? 'Update' : 'تحديث'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DeliveryLayout>
  );
}