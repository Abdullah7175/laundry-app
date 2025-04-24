import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';

export default function BookingForm({ language }) {
  const router = useRouter();
  const { user } = useAuth();
  const { createOrder, getServiceItems } = useOrder();
  
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [address, setAddress] = useState(user?.address || '');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Minimum date for pickup (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  // Load services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const items = await getServiceItems();
        setServices(items || []);
      } catch (err) {
        console.error('Error loading services:', err);
        setError(language === 'en' ? 'Failed to load services' : 'فشل في تحميل الخدمات');
      }
    };
    
    loadServices();
  }, [getServiceItems, language]);
  
  // Toggle service selection
  const toggleService = (service) => {
    const exists = selectedServices.find(s => s.id === service.id);
    
    if (exists) {
      // If quantity is more than 1, decrease quantity
      if (exists.quantity > 1) {
        setSelectedServices(
          selectedServices.map(s => 
            s.id === service.id 
              ? { ...s, quantity: s.quantity - 1 } 
              : s
          )
        );
      } else {
        // Otherwise remove the service
        setSelectedServices(
          selectedServices.filter(s => s.id !== service.id)
        );
      }
    } else {
      // Add service with quantity 1
      setSelectedServices([
        ...selectedServices, 
        { ...service, quantity: 1 }
      ]);
    }
  };
  
  // Increase quantity
  const increaseQuantity = (serviceId) => {
    setSelectedServices(
      selectedServices.map(s => 
        s.id === serviceId 
          ? { ...s, quantity: s.quantity + 1 } 
          : s
      )
    );
  };
  
  // Decrease quantity
  const decreaseQuantity = (serviceId) => {
    const service = selectedServices.find(s => s.id === serviceId);
    
    if (service.quantity === 1) {
      setSelectedServices(
        selectedServices.filter(s => s.id !== serviceId)
      );
    } else {
      setSelectedServices(
        selectedServices.map(s => 
          s.id === serviceId 
            ? { ...s, quantity: s.quantity - 1 } 
            : s
        )
      );
    }
  };
  
  // Calculate totals
  const calculateSubtotal = () => {
    return selectedServices.reduce((total, service) => {
      return total + (service.price * service.quantity);
    }, 0);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = 10; // Fixed delivery fee
    return subtotal + deliveryFee;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      setError(language === 'en' ? 'Please select at least one service' : 'الرجاء اختيار خدمة واحدة على الأقل');
      return;
    }
    
    if (!address) {
      setError(language === 'en' ? 'Please provide your address' : 'الرجاء تقديم عنوانك');
      return;
    }
    
    if (!pickupDate || !pickupTime) {
      setError(language === 'en' ? 'Please select pickup date and time' : 'الرجاء تحديد تاريخ ووقت الاستلام');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Create a delivery date (2 days after pickup)
      const delivery = new Date(pickupDate);
      delivery.setDate(delivery.getDate() + 2);
      
      // Prepare order data
      const orderData = {
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.phone,
        vendorId: 3, // Default vendor ID for demo
        address,
        items: selectedServices.map(s => ({
          id: s.id,
          name: s.name,
          quantity: s.quantity,
          price: s.price
        })),
        subtotal: calculateSubtotal(),
        deliveryFee: 10,
        discount: 0,
        total: calculateTotal(),
        paymentMethod,
        specialInstructions,
        pickupTime: `${pickupDate}T${pickupTime}:00`,
        deliveryTime: delivery.toISOString(),
        status: 'pending'
      };
      
      // Create the order
      const newOrder = await createOrder(orderData);
      
      if (newOrder) {
        setSuccess(true);
        setSelectedServices([]);
        setAddress(user?.address || '');
        setPickupDate('');
        setPickupTime('');
        setPaymentMethod('cash');
        setSpecialInstructions('');
        
        // Redirect to orders page after a delay
        setTimeout(() => {
          router.push('/dashboard/orders');
        }, 3000);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(language === 'en' ? 'Failed to create order' : 'فشل في إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {language === 'en' ? 'Book Laundry Service' : 'حجز خدمة الغسيل'}
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
          {language === 'en' 
            ? 'Order successfully created! Redirecting to your orders...' 
            : 'تم إنشاء الطلب بنجاح! جاري التحويل إلى طلباتك...'
          }
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Services selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {language === 'en' ? 'Select Services' : 'اختر الخدمات'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const selected = selectedServices.find(s => s.id === service.id);
              return (
                <div 
                  key={service.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selected 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50'
                  }`}
                  onClick={() => toggleService(service)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        <span className="text-xl">{service.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {language === 'en' ? service.name : service.nameAr || service.name}
                        </h4>
                        <p className="text-sm text-gray-500">{service.price} SAR</p>
                      </div>
                    </div>
                    
                    {selected && (
                      <div className="flex items-center space-x-2">
                        <button 
                          type="button"
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            decreaseQuantity(service.id);
                          }}
                        >
                          <span>-</span>
                        </button>
                        <span className="text-primary-700 font-medium">{selected.quantity}</span>
                        <button 
                          type="button"
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            increaseQuantity(service.id);
                          }}
                        >
                          <span>+</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {selectedServices.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 text-gray-700">
                {language === 'en' ? 'Selected Services' : 'الخدمات المختارة'}
              </h4>
              <ul className="space-y-2">
                {selectedServices.map((service) => (
                  <li key={service.id} className="flex justify-between text-sm">
                    <span>
                      {language === 'en' ? service.name : service.nameAr || service.name} 
                      <span className="text-gray-500"> x{service.quantity}</span>
                    </span>
                    <span className="font-medium">{service.price * service.quantity} SAR</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span>{language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                  <span className="font-medium">{calculateSubtotal()} SAR</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>{language === 'en' ? 'Delivery Fee' : 'رسوم التوصيل'}</span>
                  <span className="font-medium">10 SAR</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 font-bold">
                  <span>{language === 'en' ? 'Total' : 'الإجمالي'}</span>
                  <span className="text-primary-700">{calculateTotal()} SAR</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Pickup details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {language === 'en' ? 'Pickup Details' : 'تفاصيل الاستلام'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Address' : 'العنوان'}
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                rows="2"
                placeholder={language === 'en' ? 'Enter your address' : 'أدخل عنوانك'}
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Pickup Date' : 'تاريخ الاستلام'}
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={minDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Pickup Time' : 'وقت الاستلام'}
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">{language === 'en' ? 'Select time' : 'اختر الوقت'}</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment method */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {language === 'en' ? 'Payment Method' : 'طريقة الدفع'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              className={`p-4 rounded-lg border cursor-pointer ${
                paymentMethod === 'cash' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              onClick={() => setPaymentMethod('cash')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="cash" className="ml-3 block font-medium text-gray-700 cursor-pointer">
                  {language === 'en' ? 'Cash on Delivery' : 'الدفع عند الاستلام'}
                </label>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-lg border cursor-pointer ${
                paymentMethod === 'card' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="card" className="ml-3 block font-medium text-gray-700 cursor-pointer">
                  {language === 'en' ? 'Credit Card' : 'بطاقة ائتمان'}
                </label>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-lg border cursor-pointer ${
                paymentMethod === 'stcpay' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              onClick={() => setPaymentMethod('stcpay')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="stcpay"
                  checked={paymentMethod === 'stcpay'}
                  onChange={() => setPaymentMethod('stcpay')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="stcpay" className="ml-3 block font-medium text-gray-700 cursor-pointer">
                  STC Pay
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Special instructions */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'en' ? 'Special Instructions (Optional)' : 'تعليمات خاصة (اختياري)'}
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            rows="3"
            placeholder={language === 'en' ? 'Any special instructions for your order' : 'أي تعليمات خاصة لطلبك'}
          ></textarea>
        </div>
        
        {/* Submit button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${
              (loading || success) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading 
              ? (language === 'en' ? 'Processing...' : 'جاري المعالجة...') 
              : (language === 'en' ? 'Place Order' : 'تقديم الطلب')
            }
          </button>
        </div>
      </form>
    </div>
  );
}