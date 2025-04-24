import { useState } from 'react';
import { useRouter } from 'next/router';

export default function OrderCard({ order, language, userType }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  const handleCardClick = () => {
    if (userType === 'customer') {
      router.push(`/dashboard/orders?id=${order.id}`);
    } else if (userType === 'admin') {
      router.push(`/admin/orders?id=${order.id}`);
    } else if (userType === 'vendor') {
      router.push(`/vendor/orders?id=${order.id}`);
    } else if (userType === 'delivery') {
      router.push(`/delivery/orders?id=${order.id}`);
    } else if (userType === 'laundry') {
      router.push(`/laundry/orders?id=${order.id}`);
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return language === 'en' ? 'Pending' : 'قيد الانتظار';
      case 'confirmed':
        return language === 'en' ? 'Confirmed' : 'مؤكد';
      case 'pickup':
        return language === 'en' ? 'Pickup' : 'جاري الاستلام';
      case 'processing':
        return language === 'en' ? 'Processing' : 'قيد المعالجة';
      case 'readyForDelivery':
        return language === 'en' ? 'Ready for Delivery' : 'جاهز للتسليم';
      case 'delivery':
        return language === 'en' ? 'Out for Delivery' : 'خارج للتوصيل';
      case 'delivered':
        return language === 'en' ? 'Delivered' : 'تم التسليم';
      case 'cancelled':
        return language === 'en' ? 'Cancelled' : 'ملغي';
      default:
        return status;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-primary-100 text-primary-800 border-primary-300';
      case 'pickup':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'processing':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'readyForDelivery':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'delivery':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Format date in a more readable way
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', options);
  };
  
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300 border border-gray-100"
      onClick={handleCardClick}
    >
      <div className="p-5">
        <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              {language === 'en' ? 'Order' : 'طلب'} #{order.id}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between items-center mb-4 gap-y-2">
          <div className="space-y-1">
            <p className="text-sm flex items-center gap-1">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <span className="font-medium">{language === 'en' ? 'Items:' : 'العناصر:'}</span> {order.items.length}
            </p>
            <p className="text-sm flex items-center gap-1">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-medium">{language === 'en' ? 'Total:' : 'الإجمالي:'}</span> 
              <span className="font-bold text-primary-700">{order.total} SAR</span>
            </p>
          </div>
          
          <button 
            onClick={toggleExpand}
            className="px-3 py-1.5 text-sm font-medium text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {expanded ? 
              (language === 'en' ? 'Show Less' : 'عرض أقل') : 
              (language === 'en' ? 'View Details' : 'عرض التفاصيل')
            }
          </button>
        </div>
        
        {expanded && (
          <div className="mt-5 pt-4 border-t border-gray-200">
            <h4 className="font-medium mb-3 text-gray-800">{language === 'en' ? 'Order Details' : 'تفاصيل الطلب'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="font-medium">{language === 'en' ? 'Pickup:' : 'الاستلام:'}</span> 
                  <span>{formatDate(order.pickupTime)}</span>
                </p>
                <p className="text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="font-medium">{language === 'en' ? 'Delivery:' : 'التوصيل:'}</span> 
                  <span>{formatDate(order.deliveryTime)}</span>
                </p>
                <p className="text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  <span className="font-medium">{language === 'en' ? 'Payment:' : 'الدفع:'}</span> 
                  <span>{order.paymentMethod}</span>
                </p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-2">{language === 'en' ? 'Items:' : 'العناصر:'}</h5>
                <ul className="text-sm space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg">
                      <span>{item.name} <span className="text-xs font-medium px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded-full">x{item.quantity}</span></span>
                      <span className="font-medium">{item.price * item.quantity} SAR</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom bar for tracking */}
      <div className="bg-primary-50 p-4 border-t border-primary-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-sm text-primary-700 font-medium">
            {getNextStepLabel(order.status, language)}
          </span>
          <div className="w-full sm:w-1/2 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${getProgressPercentage(order.status)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getNextStepLabel(status, language) {
  switch (status) {
    case 'pending':
      return language === 'en' ? 'Waiting for confirmation' : 'في انتظار التأكيد';
    case 'confirmed':
      return language === 'en' ? 'Pickup scheduled' : 'تم جدولة الاستلام';
    case 'pickup':
      return language === 'en' ? 'Driver on the way' : 'السائق في الطريق';
    case 'processing':
      return language === 'en' ? 'Items being cleaned' : 'جاري تنظيف العناصر';
    case 'readyForDelivery':
      return language === 'en' ? 'Ready for delivery' : 'جاهز للتوصيل';
    case 'delivery':
      return language === 'en' ? 'Out for delivery' : 'خارج للتوصيل';
    case 'delivered':
      return language === 'en' ? 'Order completed' : 'تم إكمال الطلب';
    case 'cancelled':
      return language === 'en' ? 'Order cancelled' : 'تم إلغاء الطلب';
    default:
      return '';
  }
}

function getProgressPercentage(status) {
  switch (status) {
    case 'pending':
      return 10;
    case 'confirmed':
      return 25;
    case 'pickup':
      return 40;
    case 'processing':
      return 55;
    case 'readyForDelivery':
      return 70;
    case 'delivery':
      return 85;
    case 'delivered':
      return 100;
    case 'cancelled':
      return 100;
    default:
      return 0;
  }
}