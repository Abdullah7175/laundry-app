import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DeliveryLayout from '../../components/layout/DeliveryLayout';
import DeliveryCard from '../../components/delivery/DeliveryCard';
import DeliveryNavigation from '../../components/delivery/DeliveryNavigation';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';

export default function DeliveryOrders() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { orders, getAllOrders, updateOrder } = useOrder();
  
  const [language, setLanguage] = useState('en');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  
  useEffect(() => {
    // Check for language preference in localStorage
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // Load all orders
    if (user) {
      const loadOrders = async () => {
        try {
          await getAllOrders();
          setLoading(false);
        } catch (error) {
          console.error('Error loading orders:', error);
          setLoading(false);
        }
      };
      
      loadOrders();
    }
  }, [user, getAllOrders]);
  
  // Filter active orders and find current order if specified
  useEffect(() => {
    if (orders && orders.length > 0) {
      // Active orders: pickup or delivery orders assigned to this rider
      const active = orders.filter(order => 
        (order.status === 'pickup' || order.status === 'delivery' || order.status === 'readyForDelivery') && 
        (order.deliveryPersonId === user.id || !order.deliveryPersonId)
      );
      
      setActiveOrders(active);
      
      // If there's an ID in the URL, find that specific order
      if (id) {
        const order = orders.find(o => o.id.toString() === id);
        if (order) {
          setCurrentOrder(order);
        } else {
          // If order not found, redirect back to orders list
          router.replace('/delivery/orders');
        }
      }
    }
  }, [orders, id, user, router]);
  
  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { 
        status: newStatus,
        deliveryPersonId: user.id,
        updatedAt: new Date().toISOString()
      });
      
      // Refresh orders
      await getAllOrders();
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };
  
  // If we're viewing a specific order, show the delivery navigation
  if (currentOrder) {
    return (
      <DeliveryLayout title={language === 'en' ? 'Delivery Navigation' : 'ملاحة التوصيل'}>
        <DeliveryNavigation
          order={currentOrder}
          language={language}
          onStatusChange={handleStatusChange}
        />
      </DeliveryLayout>
    );
  }
  
  return (
    <DeliveryLayout title={language === 'en' ? 'Active Orders' : 'الطلبات النشطة'}>
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : activeOrders.length > 0 ? (
        <div className="space-y-4">
          {activeOrders.map(order => (
            <DeliveryCard 
              key={order.id}
              order={order}
              language={language}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-block p-3 bg-blue-100 text-blue-600 rounded-full mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {language === 'en' ? 'No Active Orders' : 'لا توجد طلبات نشطة'}
          </h3>
          <p className="text-gray-500 mb-4">
            {language === 'en' 
              ? 'You don\'t have any active orders to deliver at the moment.' 
              : 'ليس لديك أي طلبات نشطة للتوصيل في الوقت الحالي.'
            }
          </p>
          
          <button
            onClick={() => router.push('/delivery')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {language === 'en' ? 'Return to Dashboard' : 'العودة إلى لوحة المعلومات'}
          </button>
        </div>
      )}
    </DeliveryLayout>
  );
}