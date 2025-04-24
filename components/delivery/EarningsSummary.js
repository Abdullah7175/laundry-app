import { useEffect, useState } from 'react';

export default function EarningsSummary({ deliveryData, language }) {
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);
  
  useEffect(() => {
    if (deliveryData && deliveryData.length > 0) {
      calculateWeeklyEarnings();
    }
  }, [deliveryData]);
  
  // Calculate weekly earnings for the past 4 weeks
  const calculateWeeklyEarnings = () => {
    const weeks = [];
    const now = new Date();
    
    // Generate data for the last 4 weeks
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      // Filter orders that were delivered in this week
      const weekOrders = deliveryData.filter(order => {
        const orderDate = new Date(order.updatedAt || order.createdAt);
        return orderDate >= weekStart && orderDate <= weekEnd && order.status === 'delivered';
      });
      
      // Calculate earnings (15 SAR per delivery)
      const earnings = weekOrders.length * 15;
      
      // Format the week label (e.g., "Apr 10-16")
      const startLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endLabel = weekEnd.toLocaleDateString('en-US', { day: 'numeric' });
      const weekLabel = `${startLabel}-${endLabel}`;
      
      weeks.push({
        week: weekLabel,
        earnings,
        deliveries: weekOrders.length,
      });
    }
    
    // Reverse to have oldest week first
    setWeeklyEarnings(weeks.reverse());
  };
  
  // Find the maximum earnings to scale the chart properly
  const maxEarnings = Math.max(...weeklyEarnings.map(week => week.earnings), 100);
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {language === 'en' ? 'Weekly Earnings' : 'الأرباح الأسبوعية'}
      </h2>
      
      {weeklyEarnings.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            {language === 'en' 
              ? 'No earnings data available yet' 
              : 'لا تتوفر بيانات الأرباح بعد'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="mt-6 h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {weeklyEarnings.map((week, index) => (
                <div key={index} className="w-1/4 flex flex-col items-center">
                  <div 
                    className="w-16 bg-primary-500 rounded-t-sm hover:bg-primary-600 transition-all"
                    style={{
                      height: `${(week.earnings / maxEarnings) * 100}%`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <div className="mt-2 text-xs text-gray-500">{week.week}</div>
                </div>
              ))}
            </div>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
              <div>{Math.round(maxEarnings)} SAR</div>
              <div>{Math.round(maxEarnings * 0.75)} SAR</div>
              <div>{Math.round(maxEarnings * 0.5)} SAR</div>
              <div>{Math.round(maxEarnings * 0.25)} SAR</div>
              <div>0 SAR</div>
            </div>
            
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
              <div className="border-t border-gray-200 w-full h-0"></div>
              <div className="border-t border-gray-200 w-full h-0"></div>
              <div className="border-t border-gray-200 w-full h-0"></div>
              <div className="border-t border-gray-200 w-full h-0"></div>
              <div className="border-t border-gray-200 w-full h-0"></div>
            </div>
          </div>
          
          {/* Weekly Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {weeklyEarnings.map((week, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">{week.week}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{week.earnings} SAR</p>
                <p className="text-xs text-gray-500">
                  {week.deliveries} {language === 'en' ? 'deliveries' : 'توصيل'}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Tips and Performance */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {language === 'en' ? 'Tips to Increase Earnings' : 'نصائح لزيادة الأرباح'}
        </h3>
        
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {language === 'en' 
              ? 'Complete more deliveries during peak hours (4-8 PM)' 
              : 'إكمال المزيد من التوصيلات خلال ساعات الذروة (4-8 مساءً)'
            }
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {language === 'en' 
              ? 'Maintain high customer satisfaction for potential tips' 
              : 'الحفاظ على رضا العملاء العالي للحصول على إكراميات محتملة'
            }
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {language === 'en' 
              ? 'Deliver orders promptly to handle more orders per day' 
              : 'توصيل الطلبات على الفور للتعامل مع المزيد من الطلبات يوميًا'
            }
          </li>
        </ul>
      </div>
    </div>
  );
}