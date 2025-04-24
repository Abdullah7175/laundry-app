import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminAreas() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('areas');
  const [serviceAreas, setServiceAreas] = useState([]);
  const [editingArea, setEditingArea] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [areaForm, setAreaForm] = useState({
    name: '',
    nameAr: '',
    city: '',
    cityAr: '',
    deliveryFee: 0,
    minOrderAmount: 0,
    isActive: true,
    estimatedDeliveryTime: 24 // in hours
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && user && user.type !== 'admin') {
      router.push(`/${user.type}`);
    }

    if (isAuthenticated && user && user.type === 'admin') {
      fetchServiceAreas();
    }
  }, [loading, isAuthenticated, user, router]);

  const fetchServiceAreas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/areas');
      if (response.ok) {
        const data = await response.json();
        setServiceAreas(data);
      } else {
        throw new Error('Failed to fetch service areas');
      }
    } catch (error) {
      console.error('Error fetching service areas:', error);
      // For now, use some default areas if API fails
      setServiceAreas([
        {
          id: 1,
          name: 'Riyadh Central',
          nameAr: 'وسط الرياض',
          city: 'Riyadh',
          cityAr: 'الرياض',
          deliveryFee: 10,
          minOrderAmount: 50,
          isActive: true,
          estimatedDeliveryTime: 24
        },
        {
          id: 2,
          name: 'Riyadh North',
          nameAr: 'شمال الرياض',
          city: 'Riyadh',
          cityAr: 'الرياض',
          deliveryFee: 15,
          minOrderAmount: 50,
          isActive: true,
          estimatedDeliveryTime: 24
        },
        {
          id: 3,
          name: 'Jeddah Central',
          nameAr: 'وسط جدة',
          city: 'Jeddah',
          cityAr: 'جدة',
          deliveryFee: 12,
          minOrderAmount: 60,
          isActive: true,
          estimatedDeliveryTime: 36
        },
        {
          id: 4,
          name: 'Dammam',
          nameAr: 'الدمام',
          city: 'Dammam',
          cityAr: 'الدمام',
          deliveryFee: 20,
          minOrderAmount: 70,
          isActive: true,
          estimatedDeliveryTime: 48
        },
        {
          id: 5,
          name: 'Mecca',
          nameAr: 'مكة المكرمة',
          city: 'Mecca',
          cityAr: 'مكة المكرمة',
          deliveryFee: 15,
          minOrderAmount: 50,
          isActive: false,
          estimatedDeliveryTime: 36
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditArea = (area) => {
    setEditingArea(area);
    setAreaForm({
      name: area.name,
      nameAr: area.nameAr,
      city: area.city,
      cityAr: area.cityAr,
      deliveryFee: area.deliveryFee,
      minOrderAmount: area.minOrderAmount,
      isActive: area.isActive,
      estimatedDeliveryTime: area.estimatedDeliveryTime
    });
    setIsEditing(true);
  };

  const handleAddNewArea = () => {
    setEditingArea(null);
    setAreaForm({
      name: '',
      nameAr: '',
      city: '',
      cityAr: '',
      deliveryFee: 15,
      minOrderAmount: 50,
      isActive: true,
      estimatedDeliveryTime: 24
    });
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAreaForm({
      ...areaForm,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      let response;
      
      if (editingArea) {
        // Update existing area
        response = await fetch(`/api/areas/${editingArea.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(areaForm)
        });
      } else {
        // Create new area
        response = await fetch('/api/areas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(areaForm)
        });
      }
      
      if (response.ok) {
        const updatedOrNewArea = await response.json();
        
        if (editingArea) {
          // Update area in the state
          setServiceAreas(serviceAreas.map(area => 
            area.id === editingArea.id ? updatedOrNewArea : area
          ));
          setMessage({ 
            type: 'success', 
            text: language === 'en' 
              ? `Successfully updated ${areaForm.name}` 
              : `تم تحديث ${areaForm.nameAr} بنجاح`
          });
        } else {
          // Add new area to the state
          setServiceAreas([...serviceAreas, updatedOrNewArea]);
          setMessage({ 
            type: 'success', 
            text: language === 'en' 
              ? `Successfully added ${areaForm.name}` 
              : `تمت إضافة ${areaForm.nameAr} بنجاح`
          });
        }
        
        // Reset form and editing state
        setIsEditing(false);
      } else {
        throw new Error('Failed to save area');
      }
    } catch (error) {
      console.error('Error saving area:', error);
      
      // Simulate API response for demo
      if (editingArea) {
        // Update the mock data
        const updatedAreas = serviceAreas.map(area => 
          area.id === editingArea.id ? { ...area, ...areaForm } : area
        );
        setServiceAreas(updatedAreas);
        setMessage({ 
          type: 'success', 
          text: language === 'en' 
            ? `Successfully updated ${areaForm.name}` 
            : `تم تحديث ${areaForm.nameAr} بنجاح`
        });
      } else {
        // Add to mock data
        const newArea = {
          id: serviceAreas.length + 1,
          ...areaForm
        };
        setServiceAreas([...serviceAreas, newArea]);
        setMessage({ 
          type: 'success', 
          text: language === 'en' 
            ? `Successfully added ${areaForm.name}` 
            : `تمت إضافة ${areaForm.nameAr} بنجاح`
        });
      }
      
      setIsEditing(false);
    }
  };

  const handleToggleStatus = async (area) => {
    try {
      const updatedArea = { ...area, isActive: !area.isActive };
      
      const response = await fetch(`/api/areas/${area.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArea)
      });
      
      if (response.ok) {
        setServiceAreas(serviceAreas.map(a => 
          a.id === area.id ? updatedArea : a
        ));
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      
      // Simulate API response for demo
      setServiceAreas(serviceAreas.map(a => 
        a.id === area.id ? { ...a, isActive: !a.isActive } : a
      ));
    }
  };

  const handleDeleteArea = async (area) => {
    if (window.confirm(language === 'en' 
      ? `Are you sure you want to delete ${area.name}?` 
      : `هل أنت متأكد أنك تريد حذف ${area.nameAr}؟`)) {
      
      try {
        const response = await fetch(`/api/areas/${area.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setServiceAreas(serviceAreas.filter(a => a.id !== area.id));
          setMessage({ 
            type: 'success', 
            text: language === 'en' 
              ? `Successfully deleted ${area.name}` 
              : `تم حذف ${area.nameAr} بنجاح`
          });
        } else {
          throw new Error('Failed to delete area');
        }
      } catch (error) {
        console.error('Error deleting area:', error);
        
        // Simulate API response for demo
        setServiceAreas(serviceAreas.filter(a => a.id !== area.id));
        setMessage({ 
          type: 'success', 
          text: language === 'en' 
            ? `Successfully deleted ${area.name}` 
            : `تم حذف ${area.nameAr} بنجاح`
        });
      }
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
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-blue-800 mb-2 md:mb-0">
              {language === 'en' ? 'Manage Service Areas' : 'إدارة مناطق الخدمة'}
            </h1>
            
            <button 
              onClick={handleAddNewArea}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center justify-center"
            >
              <span className="mr-2">+</span>
              {language === 'en' ? 'Add New Area' : 'إضافة منطقة جديدة'}
            </button>
          </div>
          
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          {isEditing ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-blue-800 mb-4">
                {editingArea 
                  ? (language === 'en' ? `Edit ${editingArea.name}` : `تعديل ${editingArea.nameAr}`)
                  : (language === 'en' ? 'Add New Service Area' : 'إضافة منطقة خدمة جديدة')
                }
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Area Name (English)' : 'اسم المنطقة (الإنجليزية)'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={areaForm.name}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Area Name (Arabic)' : 'اسم المنطقة (العربية)'}
                    </label>
                    <input
                      type="text"
                      name="nameAr"
                      value={areaForm.nameAr}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'City (English)' : 'المدينة (الإنجليزية)'}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={areaForm.city}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'City (Arabic)' : 'المدينة (العربية)'}
                    </label>
                    <input
                      type="text"
                      name="cityAr"
                      value={areaForm.cityAr}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Delivery Fee (SAR)' : 'رسوم التوصيل (ريال)'}
                    </label>
                    <input
                      type="number"
                      name="deliveryFee"
                      value={areaForm.deliveryFee}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Minimum Order Amount (SAR)' : 'الحد الأدنى للطلب (ريال)'}
                    </label>
                    <input
                      type="number"
                      name="minOrderAmount"
                      value={areaForm.minOrderAmount}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Estimated Delivery Time (hours)' : 'الوقت التقديري للتوصيل (ساعات)'}
                    </label>
                    <input
                      type="number"
                      name="estimatedDeliveryTime"
                      value={areaForm.estimatedDeliveryTime}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={areaForm.isActive}
                      onChange={handleFormChange}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">
                      {language === 'en' ? 'Active' : 'نشط'}
                    </span>
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition duration-300"
                  >
                    {language === 'en' ? 'Cancel' : 'إلغاء'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
                  >
                    {language === 'en' ? 'Save' : 'حفظ'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceAreas.map((area) => (
                <div 
                  key={area.id}
                  className={`bg-white rounded-lg shadow-md p-4 ${!area.isActive ? 'opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{language === 'en' ? area.name : area.nameAr}</h3>
                      <p className="text-sm text-gray-500">{language === 'en' ? area.city : area.cityAr}</p>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${area.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {area.isActive 
                          ? (language === 'en' ? 'Active' : 'نشط')
                          : (language === 'en' ? 'Inactive' : 'غير نشط')
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'en' ? 'Delivery Fee' : 'رسوم التوصيل'}:
                      </span>
                      <span className="font-medium">{area.deliveryFee} SAR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'en' ? 'Min. Order' : 'الحد الأدنى للطلب'}:
                      </span>
                      <span className="font-medium">{area.minOrderAmount} SAR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'en' ? 'Est. Delivery Time' : 'وقت التوصيل التقديري'}:
                      </span>
                      <span className="font-medium">{area.estimatedDeliveryTime} {language === 'en' ? 'hours' : 'ساعة'}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between">
                    <button
                      onClick={() => handleToggleStatus(area)}
                      className={`text-sm px-2 py-1 rounded ${area.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                    >
                      {area.isActive 
                        ? (language === 'en' ? 'Deactivate' : 'إلغاء التنشيط')
                        : (language === 'en' ? 'Activate' : 'تنشيط')
                      }
                    </button>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditArea(area)}
                        className="text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        {language === 'en' ? 'Edit' : 'تعديل'}
                      </button>
                      <button
                        onClick={() => handleDeleteArea(area)}
                        className="text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                      >
                        {language === 'en' ? 'Delete' : 'حذف'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
