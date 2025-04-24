import { useState } from 'react';

export default function DeliveryHistory({ deliveryData, language }) {
  const [filter, setFilter] = useState('all'); // all, completed, cancelled
  
  // Function to format the address
  function formatAddress(address) {
    if (!address) return language === 'en' ? 'No address provided' : 'لم يتم تقديم العنوان';
    
    return `${address.street}, ${address.city}`;
  }
  
  // Filter the delivery data based on the selected filter
  const filteredData = deliveryData.filter(delivery => {
    if (filter === 'all') return true;
    if (filter === 'completed') return delivery.status === 'delivered';
    if (filter === 'cancelled') return delivery.status === 'cancelled';
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Delivery History' : 'سجل التوصيل'}
        </h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {language === 'en' ? 'All' : 'الكل'}
          </button>
          
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'completed'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {language === 'en' ? 'Completed' : 'مكتمل'}
          </button>
          
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'cancelled'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {language === 'en' ? 'Cancelled' : 'ملغي'}
          </button>
        </div>
      </div>
      
      {filteredData.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {language === 'en' ? 'No delivery history' : 'لا يوجد سجل توصيل'}
          </h3>
          <p className="mt-1 text-gray-500">
            {language === 'en' 
              ? 'Your delivered orders will appear here' 
              : 'ستظهر الطلبات المسلمة هنا'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Order ID' : 'رقم الطلب'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Customer' : 'العميل'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Address' : 'العنوان'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Date' : 'التاريخ'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Status' : 'الحالة'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Payment' : 'الدفع'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{delivery.id.toString().padStart(6, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {delivery.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatAddress(delivery.address)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(delivery.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        delivery.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : delivery.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {delivery.status === 'delivered'
                          ? (language === 'en' ? 'Delivered' : 'تم التوصيل')
                          : delivery.status === 'cancelled'
                            ? (language === 'en' ? 'Cancelled' : 'ملغي')
                            : (language === 'en' ? 'In Progress' : 'قيد التنفيذ')
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {delivery.paymentMethod === 'cash'
                        ? (language === 'en' ? 'Cash' : 'نقداً')
                        : (language === 'en' ? 'Card' : 'بطاقة')
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'Total Deliveries' : 'إجمالي التوصيلات'}
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {deliveryData.length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'Completed' : 'مكتمل'}
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {deliveryData.filter(delivery => delivery.status === 'delivered').length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'Cancelled' : 'ملغي'}
          </h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {deliveryData.filter(delivery => delivery.status === 'cancelled').length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'This Month' : 'هذا الشهر'}
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {deliveryData.filter(delivery => {
              const now = new Date();
              const deliveryDate = new Date(delivery.createdAt);
              return deliveryDate.getMonth() === now.getMonth() &&
                     deliveryDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>
    </div>
  );
}