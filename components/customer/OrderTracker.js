import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../ui/Card';

const OrderTracker = ({ order }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Map status to step number
  useEffect(() => {
    if (!order) return;
    
    const statusMap = {
      'pending': 0,
      'confirmed': 1,
      'picked_up': 2,
      'processing': 3,
      'ready_for_delivery': 4,
      'out_for_delivery': 5,
      'delivered': 6,
      'cancelled': -1
    };
    
    setCurrentStep(statusMap[order.status] || 0);
  }, [order]);
  
  if (!order) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      </Card>
    );
  }
  
  // Steps for the tracking interface
  const steps = [
    { 
      key: 'pending',
      label: t('orders.pending'),
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Your order has been received and is awaiting confirmation.'
    },
    { 
      key: 'confirmed',
      label: t('orders.confirmed'),
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Your order is confirmed and scheduled for pickup.'
    },
    { 
      key: 'picked_up',
      label: t('orders.picked_up'),
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      description: 'Your items have been picked up and are on their way to our facility.'
    },
    { 
      key: 'processing',
      label: t('orders.processing'),
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      description: 'Your items are being processed according to your service preferences.'
    },
    { 
      key: 'ready_for_delivery',
      label: t('orders.ready_for_delivery'),
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      description: 'Your items are ready and scheduled for delivery.'
    },
    { 
      key: 'out_for_delivery',
      label: t('orders.out_for_delivery'),
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      description: 'Your items are on their way to your delivery address.'
    },
    { 
      key: 'delivered',
      label: t('orders.delivered'),
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      description: 'Your items have been delivered successfully. Thank you for your order!'
    }
  ];
  
  // Delivery estimated time calculation (for demo purposes)
  const getEstimatedTime = () => {
    if (currentStep >= 5) {
      return 'Estimated delivery within 30 minutes';
    } else if (currentStep >= 4) {
      return 'Estimated delivery today';
    } else if (currentStep >= 2) {
      return 'Estimated delivery tomorrow';
    }
    return '';
  };
  
  return (
    <Card>
      <div className="px-1">
        <div className="flex justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          {order.status === 'out_for_delivery' && (
            <div className="bg-blue-50 p-2 rounded text-sm text-blue-700">
              {getEstimatedTime()}
            </div>
          )}
        </div>
        
        {/* Render cancelled state separately */}
        {order.status === 'cancelled' ? (
          <div className="bg-red-50 border border-red-100 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{t('orders.cancelled')}</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>This order has been cancelled. {order.cancellationReason || ''}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="relative">
              {/* Step connector line */}
              <div 
                className="absolute left-8 top-0 w-1 h-full bg-gray-200"
                style={{ marginLeft: '1px' }}
              ></div>
              
              {/* Progress line */}
              <div 
                className="absolute left-8 top-0 w-1 bg-blue-500 transition-all duration-500"
                style={{
                  marginLeft: '1px',
                  height: `${Math.min(100, (currentStep / (steps.length - 1)) * 100)}%`
                }}
              ></div>
              
              {/* Steps */}
              <div className="relative z-10">
                <ul className="space-y-8">
                  {steps.map((step, index) => {
                    // Calculate step status
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    const isPending = index > currentStep;
                    
                    return (
                      <li key={step.key} className="relative flex items-start">
                        <span 
                          className={`flex items-center justify-center h-9 w-9 rounded-full flex-shrink-0 ${
                            isCompleted ? 'bg-blue-500' : 
                            isActive ? 'bg-blue-500' : 
                            'bg-gray-200'
                          }`}
                        >
                          <span className="text-white">
                            {isCompleted ? (
                              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              step.icon
                            )}
                          </span>
                        </span>
                        <div className="ml-4 min-w-0">
                          <span 
                            className={`text-sm font-medium ${
                              isCompleted || isActive ? 'text-blue-600' : 'text-gray-500'
                            }`}
                          >
                            {step.label}
                          </span>
                          <p 
                            className={`mt-0.5 text-sm ${
                              isPending ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {step.description}
                          </p>
                          
                          {isActive && step.key === 'out_for_delivery' && (
                            <div className="mt-2 bg-blue-50 px-2 py-1 rounded text-xs text-blue-700">
                              {getEstimatedTime()}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrderTracker;
