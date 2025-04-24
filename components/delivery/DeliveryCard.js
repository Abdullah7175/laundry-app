import { useState } from 'react';

export default function DeliveryCard({ order, language, onStatusChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

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
          label: language === 'en' ? 'Pending' : 'قيد الانتظار',
          icon: (
            <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'in_transit':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          label: language === 'en' ? 'In Transit' : 'في الطريق',
          icon: (
            <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        };
      case 'delivered':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          label: language === 'en' ? 'Delivered' : 'تم التوصيل',
          icon: (
            <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'cancelled':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          label: language === 'en' ? 'Cancelled' : 'ملغي',
          icon: (
            <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: language === 'en' ? 'Unknown' : 'غير معروف',
          icon: (
            <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(order.id, newStatus);
    }
  };

  // Format the price
  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  const statusBadge = getStatusBadge(order.status);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Card Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">#{order.id.toString().padStart(6, '0')}</h3>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          
          <div className={`flex items-center ${statusBadge.bgColor} ${statusBadge.textColor} px-3 py-1 rounded-full`}>
            {statusBadge.icon}
            <span className="text-sm font-medium">{statusBadge.label}</span>
          </div>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="px-6 py-4">
        <div className="flex flex-col space-y-4">
          {/* Customer Info */}
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary-100 p-2 rounded-md">
              <svg className="h-6 w-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {language === 'en' ? 'Customer' : 'العميل'}
              </p>
              <p className="text-sm text-gray-500">
                {order.customerName}
              </p>
            </div>
          </div>
          
          {/* Address */}
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary-100 p-2 rounded-md">
              <svg className="h-6 w-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {language === 'en' ? 'Address' : 'العنوان'}
              </p>
              <p className="text-sm text-gray-500">
                {order.address 
                  ? `${order.address.street}, ${order.address.city}` 
                  : (language === 'en' ? 'Address not available' : 'العنوان غير متوفر')
                }
              </p>
            </div>
          </div>
          
          {/* Payment info */}
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary-100 p-2 rounded-md">
              <svg className="h-6 w-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {language === 'en' ? 'Payment' : 'الدفع'}
              </p>
              <p className="text-sm text-gray-500">
                {formatPrice(order.price)} SAR
                <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded-md text-xs">
                  {order.paymentMethod === 'cash' 
                    ? (language === 'en' ? 'Cash' : 'نقداً') 
                    : (language === 'en' ? 'Card' : 'بطاقة')
                  }
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Expandable Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                {language === 'en' ? 'Order Items' : 'عناصر الطلب'}
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                {order.items && order.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                {language === 'en' ? 'Delivery Notes' : 'ملاحظات التوصيل'}
              </p>
              <p className="text-sm text-gray-600">
                {order.notes || (language === 'en' ? 'No delivery notes' : 'لا توجد ملاحظات توصيل')}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Card Footer */}
      <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t border-gray-100">
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <button
              onClick={() => handleStatusChange('in_transit')}
              className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded hover:bg-blue-200"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {language === 'en' ? 'Start' : 'بدء'}
            </button>
          )}
          
          {order.status === 'in_transit' && (
            <button
              onClick={() => handleStatusChange('delivered')}
              className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded hover:bg-green-200"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {language === 'en' ? 'Delivered' : 'تم التوصيل'}
            </button>
          )}
          
          {(order.status === 'pending' || order.status === 'in_transit') && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
          )}
        </div>
        
        {/* Toggle Details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50"
        >
          {isExpanded ? (
            language === 'en' ? 'Hide Details' : 'إخفاء التفاصيل'
          ) : (
            language === 'en' ? 'View Details' : 'عرض التفاصيل'
          )}
          <svg className={`ml-1.5 w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}