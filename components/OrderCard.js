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
        return 'bg-blue-100 text-blue-800 border-blue-300';
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
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-blue-800">
              {language === 'en' ? 'Order' : 'طلب'} #{order.id}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-sm">
              <span className="font-medium">{language === 'en' ? 'Items:' : 'العناصر:'}</span> {order.items.length}
            </p>
            <p className="text-sm">
              <span className="font-medium">{language === 'en' ? 'Total:' : 'الإجمالي:'}</span> {order.total} SAR
            </p>
          </div>
          <button 
            onClick={toggleExpand}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {expanded ? 
              (language === 'en' ? 'Show Less' : 'عرض أقل') : 
              (language === 'en' ? 'View Details' : 'عرض التفاصيل')
            }
          </button>
        </div>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium mb-2">{language === 'en' ? 'Order Details' : 'تفاصيل الطلب'}</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">{language === 'en' ? 'Pickup:' : 'الاستلام:'}</span> {order.pickupTime}
              </p>
              <p className="text-sm">
                <span className="font-medium">{language === 'en' ? 'Delivery:' : 'التوصيل:'}</span> {order.deliveryTime}
              </p>
              <p className="text-sm">
                <span className="font-medium">{language === 'en' ? 'Payment:' : 'الدفع:'}</span> {order.paymentMethod}
              </p>
              
              <div className="mt-2">
                <h5 className="text-sm font-medium mb-1">{language === 'en' ? 'Items:' : 'العناصر:'}</h5>
                <ul className="text-sm space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} x{item.quantity} - {item.price * item.quantity} SAR
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom bar for tracking */}
      <div className="bg-blue-50 p-3 border-t border-blue-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-700">
            {getNextStepLabel(order.status, language)}
          </span>
          <div className="w-1/2 bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full" 
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