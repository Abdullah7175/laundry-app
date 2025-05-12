import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminPricing() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('pricing');
  const [pricingItems, setPricingItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [itemForm, setItemForm] = useState({
    name: '',
    nameAr: '',
    price: 0,
    description: '',
    descriptionAr: '',
    icon: '',
    isActive: true
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
      fetchPricingItems();
    }
  }, [loading, isAuthenticated, user, router]);

  const fetchPricingItems = async () => {
    setIsLoading(true);
    
    // Using mock data for now instead of actual API calls
    console.log('Using mock pricing data');
    
    // Set mock pricing data
    setPricingItems([
      {
        id: 1,
        name: 'Bed Sheets',
        nameAr: 'ملاءات السرير',
        price: 25,
        description: 'Deep cleaning for all your bed sheets',
        descriptionAr: 'تنظيف عميق لجميع ملاءات السرير',
        icon: '🛏️',
        isActive: true
      },
      {
        id: 2,
        name: 'Pillowcases',
        nameAr: 'أكياس الوسائد',
        price: 10,
        description: 'Fresh and clean pillowcases',
        descriptionAr: 'أكياس وسائد منعشة ونظيفة',
        icon: '🛌',
        isActive: true
      },
      {
        id: 3,
        name: 'Duvet Covers',
        nameAr: 'أغطية اللحاف',
        price: 35,
        description: 'Professional cleaning for duvet covers',
        descriptionAr: 'تنظيف احترافي لأغطية اللحاف',
        icon: '🧵',
        isActive: true
      },
      {
        id: 4,
        name: 'Blankets',
        nameAr: 'البطانيات',
        price: 45,
        description: 'Thorough cleaning for all blankets',
        descriptionAr: 'تنظيف شامل لجميع البطانيات',
        icon: '🧶',
        isActive: true
      },
      {
        id: 5,
        name: 'Comforters',
        nameAr: 'اللحف',
        price: 60,
        description: 'Deep cleaning for comforters',
        descriptionAr: 'تنظيف عميق للحف',
        icon: '🧠',
        isActive: true
      },
      {
        id: 6,
        name: 'Quilts',
        nameAr: 'الألحفة',
        price: 55,
        description: 'Professional cleaning for quilts',
        descriptionAr: 'تنظيف احترافي للألحفة',
        icon: '🧩',
        isActive: true
      }
    ]);
    
    // Finish loading
    setIsLoading(false);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      nameAr: item.nameAr,
      price: item.price,
      description: item.description,
      descriptionAr: item.descriptionAr,
      icon: item.icon,
      isActive: item.isActive
    });
    setIsEditing(true);
  };

  const handleAddNewItem = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      nameAr: '',
      price: 0,
      description: '',
      descriptionAr: '',
      icon: '🧺',
      isActive: true
    });
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemForm({
      ...itemForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      // In the future, we'll implement real API calls
      // let response;
      
      // if (editingItem) {
      //   // Update existing item
      //   response = await fetch(`/api/pricing/${editingItem.id}`, {
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(itemForm)
      //   });
      // } else {
      //   // Create new item
      //   response = await fetch('/api/pricing', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(itemForm)
      //   });
      // }
      
      // Simulating API response for demo
      console.log('Using mock data for item submission');
      
      if (editingItem) {
        // Update the mock data
        const updatedItems = pricingItems.map(item => 
          item.id === editingItem.id ? { ...item, ...itemForm } : item
        );
        setPricingItems(updatedItems);
        setMessage({ 
          type: 'success', 
          text: language === 'en' 
            ? `Successfully updated ${itemForm.name}` 
            : `تم تحديث ${itemForm.nameAr} بنجاح`
        });
      } else {
        // Add to mock data
        const newItem = {
          id: pricingItems.length + 1,
          ...itemForm
        };
        setPricingItems([...pricingItems, newItem]);
        setMessage({ 
          type: 'success', 
          text: language === 'en' 
            ? `Successfully added ${itemForm.name}` 
            : `تمت إضافة ${itemForm.nameAr} بنجاح`
        });
      }
      
      // Reset form and editing state
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving item:', error);
      
      // Show error message but continue with mock data
      setMessage({ 
        type: 'error', 
        text: language === 'en' 
          ? 'An error occurred, but changes were saved locally.' 
          : 'حدث خطأ، ولكن تم حفظ التغييرات محليًا.'
      });
      
      // Even if real API would fail, we'll still update our local state for the demo
      if (editingItem) {
        const updatedItems = pricingItems.map(item => 
          item.id === editingItem.id ? { ...item, ...itemForm } : item
        );
        setPricingItems(updatedItems);
      } else {
        const newItem = {
          id: pricingItems.length + 1,
          ...itemForm
        };
        setPricingItems([...pricingItems, newItem]);
      }
      
      setIsEditing(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      // In the future, we'll implement API call
      // const updatedItem = { ...item, isActive: !item.isActive };
      // 
      // const response = await fetch(`/api/pricing/${item.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedItem)
      // });
      
      // Simulating API response for demo
      console.log('Using mock data for toggle status');
      
      // Update mock data
      setPricingItems(pricingItems.map(i => 
        i.id === item.id ? { ...i, isActive: !i.isActive } : i
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      
      // Even if API would fail, we update the UI for the demo
      setPricingItems(pricingItems.map(i => 
        i.id === item.id ? { ...i, isActive: !i.isActive } : i
      ));
    }
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(language === 'en' 
      ? `Are you sure you want to delete ${item.name}?` 
      : `هل أنت متأكد أنك تريد حذف ${item.nameAr}؟`)) {
      
      try {
        // In the future, we'll implement API call
        // const response = await fetch(`/api/pricing/${item.id}`, {
        //   method: 'DELETE'
        // });
        
        // Simulating API response for demo
        console.log('Using mock data for delete item');
        
        // Update mock data
        setPricingItems(pricingItems.filter(i => i.id !== item.id));
        setMessage({ 
          type: 'success', 
          text: language === 'en' 
            ? `Successfully deleted ${item.name}` 
            : `تم حذف ${item.nameAr} بنجاح`
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        
        // Show error but still update UI for demo
        setMessage({ 
          type: 'error', 
          text: language === 'en' 
            ? `Error occurred but ${item.name} was removed locally.` 
            : `حدث خطأ ولكن تمت إزالة ${item.nameAr} محليًا.`
        });
        
        // For demo, we'll still remove it from the UI
        setPricingItems(pricingItems.filter(i => i.id !== item.id));
      }
    }
  };

  // Available icons for selection
  const availableIcons = ['🛏️', '🛌', '🧵', '🧶', '🧠', '🧩', '🧺', '🧹', '🧼', '🧽', '🧴', '🪣', '🧪', '👕', '👚'];

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
    { id: 'users', label: language === 'en' ? 'Users' : 'العملاء', icon: '👥' },
    { id: 'vendors', label: language === 'en' ? 'Vendors' : 'البائعين', icon: '🏪' },
    { id: 'assign-rider', label: language === 'en' ? 'Riders' : 'الدراجين', icon: '🏍️' },
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
              {language === 'en' ? 'Manage Pricing' : 'إدارة التسعير'}
            </h1>
            
            <button 
              onClick={handleAddNewItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center justify-center"
            >
              <span className="mr-2">+</span>
              {language === 'en' ? 'Add New Service' : 'إضافة خدمة جديدة'}
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
                {editingItem 
                  ? (language === 'en' ? `Edit ${editingItem.name}` : `تعديل ${editingItem.nameAr}`)
                  : (language === 'en' ? 'Add New Service' : 'إضافة خدمة جديدة')
                }
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Name (English)' : 'الاسم (الإنجليزية)'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={itemForm.name}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Name (Arabic)' : 'الاسم (العربية)'}
                    </label>
                    <input
                      type="text"
                      name="nameAr"
                      value={itemForm.nameAr}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Price (SAR)' : 'السعر (ريال)'}
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={itemForm.price}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Icon' : 'الأيقونة'}
                    </label>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {availableIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setItemForm({ ...itemForm, icon })}
                          className={`w-10 h-10 flex items-center justify-center text-xl rounded ${itemForm.icon === icon ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {language === 'en' ? 'Click on an icon to select it' : 'انقر على أيقونة لتحديدها'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Description (English)' : 'الوصف (الإنجليزية)'}
                    </label>
                    <textarea
                      name="description"
                      value={itemForm.description}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {language === 'en' ? 'Description (Arabic)' : 'الوصف (العربية)'}
                    </label>
                    <textarea
                      name="descriptionAr"
                      value={itemForm.descriptionAr}
                      onChange={handleFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={itemForm.isActive}
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
              {pricingItems.map((item) => (
                <div 
                  key={item.id}
                  className={`bg-white rounded-lg shadow-md p-4 ${!item.isActive ? 'opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <span className="text-3xl mr-2">{item.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{language === 'en' ? item.name : item.nameAr}</h3>
                        <p className="text-sm text-gray-500">{item.price} SAR</p>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.isActive 
                          ? (language === 'en' ? 'Active' : 'نشط')
                          : (language === 'en' ? 'Inactive' : 'غير نشط')
                        }
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {language === 'en' ? item.description : item.descriptionAr}
                  </p>
                  
                  <div className="border-t pt-3 flex justify-between">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`text-sm px-2 py-1 rounded ${item.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                    >
                      {item.isActive 
                        ? (language === 'en' ? 'Deactivate' : 'إلغاء التنشيط')
                        : (language === 'en' ? 'Activate' : 'تنشيط')
                      }
                    </button>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        {language === 'en' ? 'Edit' : 'تعديل'}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
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
