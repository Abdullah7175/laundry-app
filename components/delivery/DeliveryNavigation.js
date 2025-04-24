import { useState } from 'react';

export default function DeliveryNavigation({ order, language, onStatusChange }) {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
  // Mock navigation actions
  const startNavigation = () => {
    // In a real app, this would integrate with a mapping API
    alert(language === 'en' 
      ? 'Starting navigation to customer location...' 
      : 'بدء التنقل إلى موقع العميل...');
  };
  
  const callCustomer = () => {
    if (order && order.customerPhone) {
      // In a real app, this would use the device's calling capability
      window.location.href = `tel:${order.customerPhone}`;
    } else {
      alert(language === 'en' 
        ? 'Customer phone number not available' 
        : 'رقم هاتف العميل غير متوفر');
    }
  };
  
  const updateOrderStatus = (status) => {
    if (onStatusChange) {
      onStatusChange(order.id, status);
    }
  };
  
  if (!order) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {language === 'en' ? 'No active delivery' : 'لا يوجد توصيل نشط'}
        </h3>
        <p className="mt-1 text-gray-500">
          {language === 'en' 
            ? 'Select an order to start navigation' 
            : 'اختر طلبًا لبدء التنقل'
          }
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Map Section */}
      <div 
        className={`bg-gray-200 relative ${isMapExpanded ? 'h-96' : 'h-48'} transition-all duration-300`}
        style={{ 
          backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=Riyadh,SaudiArabia&zoom=12&size=600x300&key=DEMO_PLACEHOLDER")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <button 
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMapExpanded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Delivery Details */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {language === 'en' ? 'Delivery Navigation' : 'ملاحة التوصيل'}
            </h2>
            <p className="text-gray-600">#{order.id.toString().padStart(6, '0')}</p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'pending' 
              ? 'bg-yellow-100 text-yellow-800' 
              : order.status === 'in_transit'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
          }`}>
            {order.status === 'pending'
              ? (language === 'en' ? 'Pending' : 'قيد الانتظار')
              : order.status === 'in_transit'
                ? (language === 'en' ? 'In Transit' : 'في الطريق')
                : (language === 'en' ? 'Delivered' : 'تم التوصيل')
            }
          </div>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 mb-4">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'Customer Address' : 'عنوان العميل'}
              </p>
              <p className="font-medium text-gray-800">
                {order.address ? (
                  `${order.address.street}, ${order.address.city}`
                ) : (
                  language === 'en' ? 'Address not available' : 'العنوان غير متوفر'
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'Customer Name' : 'اسم العميل'}
              </p>
              <p className="font-medium text-gray-800">
                {order.customerName || (language === 'en' ? 'Unknown' : 'غير معروف')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={startNavigation}
            className="flex items-center justify-center bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {language === 'en' ? 'Navigate' : 'تنقل'}
          </button>
          
          <button
            onClick={callCustomer}
            className="flex items-center justify-center bg-white text-gray-700 py-3 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {language === 'en' ? 'Call Customer' : 'اتصل بالعميل'}
          </button>
        </div>
        
        {/* Status update buttons */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 mb-3">
            {language === 'en' ? 'Update Delivery Status' : 'تحديث حالة التوصيل'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {order.status === 'pending' && (
              <button
                onClick={() => updateOrderStatus('in_transit')}
                className="flex items-center justify-center bg-blue-100 text-blue-700 py-2 px-3 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {language === 'en' ? 'Start Delivery' : 'بدء التوصيل'}
              </button>
            )}
            
            {order.status === 'in_transit' && (
              <button
                onClick={() => updateOrderStatus('delivered')}
                className="flex items-center justify-center bg-green-100 text-green-700 py-2 px-3 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'en' ? 'Mark as Delivered' : 'تحديد كتم تسليمه'}
              </button>
            )}
            
            {(order.status === 'pending' || order.status === 'in_transit') && (
              <button
                onClick={() => updateOrderStatus('cancelled')}
                className="flex items-center justify-center bg-red-100 text-red-700 py-2 px-3 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {language === 'en' ? 'Cancel Delivery' : 'إلغاء التوصيل'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}