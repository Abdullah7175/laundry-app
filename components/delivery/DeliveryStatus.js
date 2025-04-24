import { useState } from 'react';

export default function DeliveryStatus({ language, onStatusChange }) {
  const [selectedStatus, setSelectedStatus] = useState('active'); // active, completed
  
  // Sample orders data - in a real app, this would come from a database
  const [orders, setOrders] = useState([
    {
      id: 1001,
      customerName: 'Ahmed Mohammed',
      address: {
        street: '2234 King Fahd Road',
        city: 'Riyadh'
      },
      items: ['Bed Sheets (2)', 'Duvet Cover (1)'],
      status: 'pending',
      createdAt: '2025-04-20T08:30:00',
      price: 75.50,
      paymentMethod: 'cash'
    },
    {
      id: 1002,
      customerName: 'Sara Abdullah',
      address: {
        street: '873 Olaya Street',
        city: 'Riyadh'
      },
      items: ['Pillow Cases (4)', 'Blanket (1)', 'Comforter (1)'],
      status: 'in_transit',
      createdAt: '2025-04-20T10:15:00',
      price: 120.00,
      paymentMethod: 'card'
    },
    {
      id: 1003,
      customerName: 'Khalid Al-Harbi',
      address: {
        street: '45 Prince Sultan Road',
        city: 'Riyadh'
      },
      items: ['Bed Sheets (1)', 'Duvet Cover (2)', 'Pillow Cases (2)'],
      status: 'delivered',
      createdAt: '2025-04-19T14:20:00',
      price: 95.75,
      paymentMethod: 'cash'
    },
    {
      id: 1004,
      customerName: 'Fatima Al-Sulaiman',
      address: {
        street: '127 Tahlia Street',
        city: 'Riyadh'
      },
      items: ['Comforter (1)', 'Bed Sheets (1)'],
      status: 'delivered',
      createdAt: '2025-04-19T11:30:00',
      price: 85.25,
      paymentMethod: 'card'
    }
  ]);
  
  // Filter orders based on selected status
  const filteredOrders = orders.filter(order => {
    if (selectedStatus === 'active') {
      return order.status === 'pending' || order.status === 'in_transit';
    } else {
      return order.status === 'delivered' || order.status === 'cancelled';
    }
  });
  
  // Handle status change for an order
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    if (onStatusChange) {
      onStatusChange(orderId, newStatus);
    }
  };
  
  // Format the date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  // Get status badge styling based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          label: language === 'en' ? 'Pending' : 'قيد الانتظار'
        };
      case 'in_transit':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          label: language === 'en' ? 'In Transit' : 'في الطريق'
        };
      case 'delivered':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          label: language === 'en' ? 'Delivered' : 'تم التوصيل'
        };
      case 'cancelled':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          label: language === 'en' ? 'Cancelled' : 'ملغي'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: language === 'en' ? 'Unknown' : 'غير معروف'
        };
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Delivery Orders' : 'طلبات التوصيل'}
        </h1>
        
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setSelectedStatus('active')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              selectedStatus === 'active'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200`}
          >
            {language === 'en' ? 'Active' : 'نشط'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('completed')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              selectedStatus === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200`}
          >
            {language === 'en' ? 'Completed' : 'مكتمل'}
          </button>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {language === 'en' ? 'No orders found' : 'لم يتم العثور على طلبات'}
          </h3>
          <p className="mt-1 text-gray-500">
            {selectedStatus === 'active'
              ? (language === 'en' ? 'You have no active delivery orders' : 'ليس لديك طلبات توصيل نشطة')
              : (language === 'en' ? 'You have no completed delivery orders' : 'ليس لديك طلبات توصيل مكتملة')
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map(order => {
            const statusBadge = getStatusBadge(order.status);
            
            return (
              <div key={order.id} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-lg font-bold text-gray-800">#{order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    
                    <span className={`${statusBadge.bgColor} ${statusBadge.textColor} py-1 px-3 rounded-full text-xs font-medium`}>
                      {statusBadge.label}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'en' ? 'Customer' : 'العميل'}
                        </p>
                        <p className="font-medium">{order.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'en' ? 'Address' : 'العنوان'}
                        </p>
                        <p className="font-medium">
                          {order.address ? `${order.address.street}, ${order.address.city}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'en' ? 'Items' : 'العناصر'}
                        </p>
                        <p className="font-medium">{order.items.join(', ')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'en' ? 'Payment' : 'الدفع'}
                        </p>
                        <p className="font-medium">
                          {order.price.toFixed(2)} SAR
                          <span className="ml-2 text-xs text-gray-500">
                            ({order.paymentMethod === 'cash' 
                              ? (language === 'en' ? 'Cash' : 'نقداً') 
                              : (language === 'en' ? 'Card' : 'بطاقة')
                            })
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order actions */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'in_transit')}
                        className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-200"
                      >
                        {language === 'en' ? 'Start Delivery' : 'بدء التوصيل'}
                      </button>
                    )}
                    
                    {order.status === 'in_transit' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                        className="bg-green-100 text-green-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-green-200"
                      >
                        {language === 'en' ? 'Mark as Delivered' : 'تحديد كتم تسليمه'}
                      </button>
                    )}
                    
                    {(order.status === 'pending' || order.status === 'in_transit') && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        className="bg-red-100 text-red-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-red-200"
                      >
                        {language === 'en' ? 'Cancel Order' : 'إلغاء الطلب'}
                      </button>
                    )}
                    
                    <button
                      className="bg-white text-gray-700 px-3 py-1.5 rounded text-sm font-medium border border-gray-300 hover:bg-gray-50"
                    >
                      {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}