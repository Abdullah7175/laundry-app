'use client';

import { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { useAuth } from '../../context/AuthContext';

export default function VendorDeliveryManagement({ language }) {
  const { user } = useAuth();
  const { 
    riders, 
    availableRiders, 
    assignedDeliveries, 
    unassignedDeliveries, 
    assignRider,
    updateRiderStatus
  } = useDelivery();
  
  // Filter riders belonging to this vendor
  const vendorRiders = riders.filter(rider => 
    rider.type === 'vendor' && rider.vendorId === user?.vendorId
  );

  // Filter deliveries belonging to this vendor
  const vendorUnassignedDeliveries = unassignedDeliveries.filter(
    order => order.vendorId === user?.vendorId
  );

  const handleAssignRider = async (orderId, riderId) => {
    const success = await assignRider(orderId, riderId);
    if (success) {
      alert(language === 'en' ? 'Rider assigned successfully!' : 'تم تعيين الراكب بنجاح!');
    }
  };

  const handleStatusChange = async (riderId, status) => {
    const success = await updateRiderStatus(riderId, status);
    if (success) {
      alert(language === 'en' ? 'Rider status updated!' : 'تم تحديث حالة الراكب!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6">
      <h2 className="text-lg font-bold text-blue-800 mb-4">
        {language === 'en' ? 'Delivery Management' : 'إدارة التوصيل'}
      </h2>
      
      {/* Vendor's Riders */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3">
          {language === 'en' ? 'Your Delivery Riders' : 'راكبو التوصيل الخاصين بك'}
        </h3>
        {vendorRiders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Name' : 'الاسم'}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Vehicle' : 'المركبة'}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Status' : 'الحالة'}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Actions' : 'إجراءات'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendorRiders.map(rider => (
                  <tr key={rider.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{rider.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {rider.vehicle === 'motorcycle' 
                        ? (language === 'en' ? 'Motorcycle' : 'دراجة نارية')
                        : rider.vehicle === 'bicycle'
                          ? (language === 'en' ? 'Bicycle' : 'دراجة هوائية')
                          : (language === 'en' ? 'Car' : 'سيارة')
                      }
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${rider.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                        ${rider.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${rider.status === 'offline' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {rider.status === 'available' 
                          ? (language === 'en' ? 'Available' : 'متاح')
                          : rider.status === 'busy'
                            ? (language === 'en' ? 'Busy' : 'مشغول')
                            : (language === 'en' ? 'Offline' : 'غير متصل')
                        }
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <select
                        value={rider.status}
                        onChange={(e) => handleStatusChange(rider.id, e.target.value)}
                        className="border rounded p-1 text-sm"
                      >
                        <option value="available">{language === 'en' ? 'Available' : 'متاح'}</option>
                        <option value="busy">{language === 'en' ? 'Busy' : 'مشغول'}</option>
                        <option value="offline">{language === 'en' ? 'Offline' : 'غير متصل'}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">
            {language === 'en' ? 'No riders assigned to your vendor account' : 'لا يوجد راكبون معينون لحساب البائع الخاص بك'}
          </p>
        )}
      </div>
      
      {/* Vendor's Deliveries */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">
          {language === 'en' ? 'Your Orders Ready for Delivery' : 'طلباتك الجاهزة للتسليم'}
        </h3>
        {vendorUnassignedDeliveries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Order ID' : 'رقم الطلب'}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Customer' : 'العميل'}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Assign Rider' : 'تعيين راكب'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendorUnassignedDeliveries.map(order => (
                  <tr key={order.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">#{order.id}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{order.customerName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <select
                        onChange={(e) => handleAssignRider(order.id, e.target.value)}
                        className="border rounded p-1 text-sm"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {language === 'en' ? 'Select Rider' : 'اختر راكب'}
                        </option>
                        {vendorRiders.map(rider => (
                          <option key={rider.id} value={rider.id}>
                            {rider.name} ({rider.vehicle})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">
            {language === 'en' ? 'No orders ready for delivery' : 'لا توجد طلبات جاهزة للتسليم'}
          </p>
        )}
      </div>
    </div>
  );
}