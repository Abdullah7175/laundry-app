import React from 'react';

export default function DeliveryStats({ deliveryData, language }) {
  // Calculate various statistics
  const totalDeliveries = deliveryData.length;
  const completedDeliveries = deliveryData.filter(item => item.status === 'delivered').length;
  const cancelledDeliveries = deliveryData.filter(item => item.status === 'cancelled').length;
  const pendingDeliveries = totalDeliveries - completedDeliveries - cancelledDeliveries;
  
  // Completion rate
  const completionRate = totalDeliveries > 0 
    ? Math.round((completedDeliveries / totalDeliveries) * 100) 
    : 0;
  
  // This week's deliveries
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const thisWeekDeliveries = deliveryData.filter(item => {
    const deliveryDate = new Date(item.createdAt);
    return deliveryDate >= startOfWeek;
  }).length;
  
  // Calculate earnings (assuming 15 SAR per completed delivery)
  const totalEarnings = completedDeliveries * 15;
  const thisWeekEarnings = deliveryData.filter(item => {
    const deliveryDate = new Date(item.createdAt);
    return deliveryDate >= startOfWeek && item.status === 'delivered';
  }).length * 15;
  
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'Total Deliveries' : 'إجمالي التوصيلات'}
              </p>
              <p className="text-2xl font-bold mt-1">{totalDeliveries}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'All time' : 'الكل'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'Completion Rate' : 'معدل الإكمال'}
              </p>
              <p className="text-2xl font-bold mt-1">{completionRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'Successfully delivered' : 'تم التوصيل بنجاح'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'This Week' : 'هذا الأسبوع'}
              </p>
              <p className="text-2xl font-bold mt-1">{thisWeekDeliveries}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'Last 7 days' : 'آخر 7 أيام'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'Weekly Earnings' : 'الأرباح الأسبوعية'}
              </p>
              <p className="text-2xl font-bold mt-1">{thisWeekEarnings} SAR</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'From deliveries' : 'من التوصيلات'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {language === 'en' ? 'Delivery Status Breakdown' : 'تفصيل حالة التوصيل'}
        </h2>
        
        <div className="space-y-4">
          {/* Completed */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Completed' : 'مكتملة'}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {completedDeliveries} ({completionRate}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
          
          {/* Pending */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'In Progress' : 'قيد التنفيذ'}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {pendingDeliveries} ({totalDeliveries > 0 ? Math.round((pendingDeliveries / totalDeliveries) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${totalDeliveries > 0 ? (pendingDeliveries / totalDeliveries) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          {/* Cancelled */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Cancelled' : 'ملغاة'}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {cancelledDeliveries} ({totalDeliveries > 0 ? Math.round((cancelledDeliveries / totalDeliveries) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-500 h-2.5 rounded-full" 
                style={{ width: `${totalDeliveries > 0 ? (cancelledDeliveries / totalDeliveries) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Earnings Summary */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {language === 'en' ? 'Earnings Summary' : 'ملخص الأرباح'}
        </h2>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Total Earnings' : 'إجمالي الأرباح'}
            </p>
            <p className="text-3xl font-bold">{totalEarnings} SAR</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Average Per Delivery' : 'المتوسط لكل توصيل'}
            </p>
            <p className="text-xl font-semibold">15 SAR</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Weekly Earnings' : 'الأرباح الأسبوعية'}
            </p>
            <p className="font-medium">{thisWeekEarnings} SAR</p>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Monthly Estimate' : 'التقدير الشهري'}
            </p>
            <p className="font-medium">{thisWeekEarnings * 4} SAR</p>
          </div>
        </div>
      </div>
      
      {/* Top Areas */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {language === 'en' ? 'Top Delivery Areas' : 'أهم مناطق التوصيل'}
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700 flex-1">Al Olaya</span>
            <span className="text-sm font-medium">12 {language === 'en' ? 'orders' : 'طلبات'}</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700 flex-1">Al Malaz</span>
            <span className="text-sm font-medium">8 {language === 'en' ? 'orders' : 'طلبات'}</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700 flex-1">Hittin</span>
            <span className="text-sm font-medium">6 {language === 'en' ? 'orders' : 'طلبات'}</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700 flex-1">Al Sahafah</span>
            <span className="text-sm font-medium">5 {language === 'en' ? 'orders' : 'طلبات'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}