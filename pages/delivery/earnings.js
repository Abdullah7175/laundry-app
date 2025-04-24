import { useState, useEffect } from 'react';
import DeliveryLayout from '../../components/layout/DeliveryLayout';
import EarningsSummary from '../../components/delivery/EarningsSummary';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';

export default function DeliveryEarnings() {
  const { user } = useAuth();
  const { orders, getAllOrders } = useOrder();
  
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [deliveryData, setDeliveryData] = useState([]);
  const [period, setPeriod] = useState('week'); // week, month, year
  
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
  
  // Calculate total earnings based on period
  const calculateEarnings = () => {
    if (!deliveryData || deliveryData.length === 0) return 0;
    
    const now = new Date();
    let startDate;
    
    // Set the start date based on the selected period
    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Beginning of time
    }
    
    // Calculate earnings from delivered orders in the specified period
    return deliveryData
      .filter(order => 
        order.status === 'delivered' && new Date(order.updatedAt) >= startDate
      )
      .reduce((total, order) => total + 15, 0); // Assuming 15 SAR per delivery
  };
  
  return (
    <DeliveryLayout title={language === 'en' ? 'My Earnings' : 'أرباحي'}>
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Earnings Overview */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {language === 'en' ? 'Earnings Overview' : 'نظرة عامة على الأرباح'}
              </h2>
              
              <div className="relative z-10 inline-flex shadow-sm rounded-md">
                <button
                  type="button"
                  onClick={() => setPeriod('week')}
                  className={`relative inline-flex items-center px-3 py-1.5 rounded-l-md border text-sm font-medium focus:z-10 focus:outline-none ${
                    period === 'week'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {language === 'en' ? 'Week' : 'أسبوع'}
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('month')}
                  className={`relative inline-flex items-center px-3 py-1.5 border-t border-b text-sm font-medium focus:z-10 focus:outline-none ${
                    period === 'month'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {language === 'en' ? 'Month' : 'شهر'}
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('year')}
                  className={`relative inline-flex items-center px-3 py-1.5 rounded-r-md border text-sm font-medium focus:z-10 focus:outline-none ${
                    period === 'year'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {language === 'en' ? 'Year' : 'سنة'}
                </button>
              </div>
            </div>
            
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-1">
                {language === 'en' ? 'Total Earnings This' : 'إجمالي الأرباح هذا'}
                {' '}
                {period === 'week' 
                  ? (language === 'en' ? 'Week' : 'الأسبوع') 
                  : period === 'month'
                    ? (language === 'en' ? 'Month' : 'الشهر')
                    : (language === 'en' ? 'Year' : 'العام')
                }
              </p>
              <h3 className="text-4xl font-bold text-gray-800">{calculateEarnings()} SAR</h3>
              
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'en' ? 'Deliveries' : 'التوصيلات'}
                  </p>
                  <p className="text-xl font-semibold text-gray-700">
                    {deliveryData.filter(order => order.status === 'delivered').length}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'en' ? 'Avg. per Delivery' : 'المتوسط لكل توصيل'}
                  </p>
                  <p className="text-xl font-semibold text-gray-700">15 SAR</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'en' ? 'Rating' : 'التقييم'}
                  </p>
                  <p className="text-xl font-semibold text-gray-700">4.8 ★</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Weekly Earnings Chart */}
          <EarningsSummary 
            deliveryData={deliveryData} 
            language={language} 
          />
          
          {/* Payment History */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {language === 'en' ? 'Payment History' : 'سجل المدفوعات'}
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">
                    {language === 'en' ? 'Weekly Payout' : 'الدفع الأسبوعي'}
                  </p>
                  <p className="text-sm text-gray-500">April 17, 2025</p>
                </div>
                <p className="font-bold text-gray-800">325 SAR</p>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">
                    {language === 'en' ? 'Weekly Payout' : 'الدفع الأسبوعي'}
                  </p>
                  <p className="text-sm text-gray-500">April 10, 2025</p>
                </div>
                <p className="font-bold text-gray-800">290 SAR</p>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">
                    {language === 'en' ? 'Weekly Payout' : 'الدفع الأسبوعي'}
                  </p>
                  <p className="text-sm text-gray-500">April 3, 2025</p>
                </div>
                <p className="font-bold text-gray-800">345 SAR</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button className="text-primary-600 font-medium hover:text-primary-700">
                {language === 'en' ? 'View All Payments' : 'عرض جميع المدفوعات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DeliveryLayout>
  );
}