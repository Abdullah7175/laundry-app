// pages/admin/assign-rider.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { useDelivery } from '../../context/DeliveryContext';

export default function AssignRiderPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const { user } = useAuth();
  const { orders, getOrderById } = useOrder();
  const { riders = [], availableRiders = [], assignRider = () => {} } = useDelivery();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    console.log('Order ID:', orderId); // Add this to verify
    if (orderId) {
        const fetchOrder = async () => {
            try {
              const orderData = await getOrderById(orderId);
              if (!orderData) {
                console.error('Order not found');
                router.push('/admin'); // or show an error message
                return;
              }
              setOrder(orderData);
            } catch (error) {
              console.error('Error fetching order:', error);
            } finally {
              setLoading(false);
            }
          };
    fetchOrder();
  }
}, [orderId, getOrderById]);

  const handleAssign = async () => {
    if (!selectedRider) {
      alert(language === 'en' ? 'Please select a rider' : 'الرجاء اختيار راكب');
      return;
    }
    
    const success = await assignRider(orderId, selectedRider);
    if (success) {
      alert(language === 'en' ? 'Rider assigned successfully!' : 'تم تعيين الراكب بنجاح!');
      router.push('/admin');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50">
        <Sidebar 
          // Add your sidebar items here
          language={language}
          userType="admin"
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold text-blue-800 mb-6">
              {language === 'en' ? 'Assign Rider to Order' : 'تعيين راكب للطلب'}
            </h1>
            
            {order && (
              <div className="mb-6">
                <h2 className="font-medium text-gray-800 mb-2">
                  {language === 'en' ? 'Order Details' : 'تفاصيل الطلب'}
                </h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><span className="font-medium">Order ID:</span> #{order.id}</p>
                  <p><span className="font-medium">Customer:</span> {order.customerName}</p>
                  <p><span className="font-medium">Address:</span> {order.address}</p>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Select Rider' : 'اختر راكب'}
              </label>
              <select
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  {language === 'en' ? '-- Select Rider --' : '-- اختر راكب --'}
                </option>
                {availableRiders.map(rider => (
                  <option key={rider.id} value={rider.id}>
                    {rider.name} ({rider.vehicle})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {language === 'en' ? 'Assign Rider' : 'تعيين راكب'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}