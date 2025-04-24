import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DeliveryLayout from '../../components/layout/DeliveryLayout';
import DeliveryStatus from '../../components/delivery/DeliveryStatus';
import DeliveryStats from '../../components/delivery/DeliveryStats';
import DeliveryCard from '../../components/delivery/DeliveryCard';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';

export default function DeliveryDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, getAllOrders, updateOrder } = useOrder();
  
  const [language, setLanguage] = useState('en');
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [riderStatus, setRiderStatus] = useState('offline');
  
  useEffect(() => {
    // Check for language preference in localStorage
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // Load all orders
    if (user) {
      getAllOrders();
    }
  }, [user, getAllOrders]);
  
  // Filter orders when they are loaded
  useEffect(() => {
    if (orders && orders.length > 0) {
      // Active deliveries: pickup or delivery orders assigned to this rider
      const active = orders.filter(order => 
        (order.status === 'pickup' || order.status === 'delivery') && 
        order.deliveryPersonId === user.id
      );
      
      // Pending deliveries: ready for delivery orders not yet assigned
      const pending = orders.filter(order => 
        order.status === 'readyForDelivery' && 
        !order.deliveryPersonId
      );
      
      setActiveDeliveries(active);
      setPendingDeliveries(pending);
      
      // Update rider status based on active deliveries
      if (active.length > 0) {
        setRiderStatus('busy');
      }
    }
  }, [orders, user]);
  
  // Handle rider status change
  const handleStatusChange = (newStatus) => {
    setRiderStatus(newStatus);
  };
  
  // Handle order status change
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { 
        status: newStatus,
        deliveryPersonId: user.id,
        updatedAt: new Date().toISOString()
      });
      
      // Refresh orders
      await getAllOrders();
      
      // If order is now complete, update rider status if no other active orders
      if (newStatus === 'delivered' || newStatus === 'cancelled') {
        const remainingActive = activeDeliveries.filter(order => order.id !== orderId);
        if (remainingActive.length === 0) {
          setRiderStatus('available');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };
  
  // Accept a delivery
  const acceptDelivery = async (orderId) => {
    try {
      await updateOrder(orderId, { 
        status: 'delivery',
        deliveryPersonId: user.id,
        updatedAt: new Date().toISOString()
      });
      
      // Refresh orders
      await getAllOrders();
      
      // Update rider status
      setRiderStatus('busy');
      
      return true;
    } catch (error) {
      console.error('Error accepting delivery:', error);
      return false;
    }
  };
  
  return (
    <DeliveryLayout title={language === 'en' ? 'Delivery Dashboard' : 'لوحة التوصيل'}>
      <div className="space-y-6">
        {/* Rider Status */}
        <DeliveryStatus 
          language={language} 
          onStatusChange={handleStatusChange} 
        />
        
        {/* Stats */}
        <DeliveryStats 
          deliveryData={orders} 
          language={language} 
        />
        
        {/* Active Deliveries */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {language === 'en' ? 'Active Deliveries' : 'التوصيلات النشطة'}
          </h2>
          
          {activeDeliveries.length > 0 ? (
            <div className="space-y-4">
              {activeDeliveries.map(order => (
                <DeliveryCard 
                  key={order.id}
                  order={order}
                  language={language}
                  onStatusChange={handleOrderStatusChange}
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
                {language === 'en' ? 'No Active Deliveries' : 'لا توجد توصيلات نشطة'}
              </h3>
              <p className="text-gray-500 mb-4">
                {language === 'en' 
                  ? 'You don\'t have any active deliveries at the moment.' 
                  : 'ليس لديك أي توصيلات نشطة في الوقت الحالي.'
                }
              </p>
              
              {riderStatus === 'offline' && (
                <p className="text-sm text-primary-600">
                  {language === 'en' 
                    ? 'Go online to receive delivery requests.' 
                    : 'كن متصلاً لتلقي طلبات التوصيل.'
                  }
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Available Deliveries - only show if rider is available */}
        {riderStatus === 'available' && pendingDeliveries.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {language === 'en' ? 'Available Deliveries' : 'التوصيلات المتاحة'}
            </h2>
            
            <div className="space-y-4">
              {pendingDeliveries.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {language === 'en' ? 'Order' : 'طلب'} #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm border border-teal-200">
                      {language === 'en' ? 'Ready for Delivery' : 'جاهز للتسليم'}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="flex-1">{order.address}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="text-sm">
                        <span className="font-medium">{language === 'en' ? 'Delivery Fee:' : 'رسوم التوصيل:'}</span> 15 SAR
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{language === 'en' ? 'Distance:' : 'المسافة:'}</span> ~3.5 km
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => acceptDelivery(order.id)}
                    className="w-full py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {language === 'en' ? 'Accept Delivery' : 'قبول التوصيل'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DeliveryLayout>
  );
}