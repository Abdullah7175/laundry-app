import { useState, useEffect } from 'react';
import DeliveryLayout from '../../components/layout/DeliveryLayout';
import DeliveryHistory from '../../components/delivery/DeliveryHistory';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';

export default function DeliveryHistoryPage() {
  const { user } = useAuth();
  const { orders, getAllOrders } = useOrder();
  
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [deliveryData, setDeliveryData] = useState([]);
  
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
  
  // Filter orders when they are loaded
  useEffect(() => {
    if (orders && orders.length > 0) {
      // Filter orders for this delivery person
      const deliveryPersonOrders = orders.filter(order => 
        order.deliveryPersonId === user.id
      );
      
      setDeliveryData(deliveryPersonOrders);
    }
  }, [orders, user]);
  
  return (
    <DeliveryLayout title={language === 'en' ? 'Delivery History' : 'سجل التوصيل'}>
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <DeliveryHistory 
          deliveryData={deliveryData} 
          language={language} 
        />
      )}
    </DeliveryLayout>
  );
}