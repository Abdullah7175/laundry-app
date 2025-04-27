import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';

const LaundryServiceCart = ({ language, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { createOrder } = useOrder();

  // Available laundry services
  const laundryServices = [
    { id: 1, name: language === 'en' ? 'Bed Sheets' : 'ملاءات السرير', price: 25, image: '🛏️' },
    { id: 2, name: language === 'en' ? 'Pillowcases' : 'أكياس الوسائد', price: 10, image: '🛌' },
    { id: 3, name: language === 'en' ? 'Duvet Covers' : 'أغطية اللحاف', price: 35, image: '🧵' },
    { id: 4, name: language === 'en' ? 'Blankets' : 'البطانيات', price: 45, image: '🧶' },
    { id: 5, name: language === 'en' ? 'Comforters' : 'اللحف', price: 60, image: '🧠' },
    { id: 6, name: language === 'en' ? 'Quilts' : 'الألحفة', price: 55, image: '🧩' }
  ];

  const [cart, setCart] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Add item to cart
  const addToCart = (service) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === service.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (serviceId) => {
    const existingItem = cart.find(item => item.id === serviceId);
    if (existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.id === serviceId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== serviceId));
    }
  };

  // Calculate total price
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 10; // Fixed delivery fee
  const totalPrice = subtotal + deliveryFee;

  // Proceed to checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert(language === 'en' ? 'Your cart is empty!' : 'سلة التسوق فارغة!');
      return;
    }
    setIsCheckout(true);
  };

  // Place order
  const placeOrder = async () => {
    if (!paymentMethod) {
      alert(language === 'en' ? 'Please select a payment method' : 'الرجاء اختيار طريقة الدفع');
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderItems = cart.map(item => ({
        serviceId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const orderData = {
        userId: user.id,
        items: orderItems,
        paymentMethod,
        status: 'pending'
      };

      await createOrder(orderData);
      setOrderSuccess(true);
      setTimeout(() => {
        setCart([]);
        setIsCheckout(false);
        setOrderSuccess(false);
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert(language === 'en' ? 'Failed to place order' : 'فشل في تقديم الطلب');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {orderSuccess ? (
        <div className="text-center py-8">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'en' ? 'Order Placed Successfully!' : 'تم تقديم الطلب بنجاح!'}
          </h3>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Thank you for your order. We will process it shortly.' 
              : 'شكرا لطلبك. سنقوم بمعالجته قريبا.'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {language === 'en' ? 'Laundry Services' : 'خدمات الغسيل'}
            </h2>
            {onClose && (
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          {!isCheckout ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Services List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'en' ? 'Available Services' : 'الخدمات المتاحة'}
                </h3>
                <div className="space-y-3">
                  {laundryServices.map(service => (
                    <div 
                      key={service.id} 
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{service.image}</span>
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-500">
                            {service.price} {language === 'en' ? 'SAR per item' : 'ريال لكل عنصر'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(service)}
                        className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
                      >
                        {language === 'en' ? 'Add' : 'إضافة'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'en' ? 'Your Cart' : 'سلة التسوق'}
                </h3>
                {cart.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      {language === 'en' 
                        ? 'Your cart is empty. Add some items!' 
                        : 'سلة التسوق فارغة. أضف بعض العناصر!'}
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      {cart.map(item => (
                        <div key={item.id} className="p-4 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{item.image}</span>
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-500">
                                {item.price} {language === 'en' ? 'SAR ×' : 'ريال ×'} {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span>{language === 'en' ? 'Subtotal:' : 'المجموع الفرعي:'}</span>
                          <span>{subtotal} {language === 'en' ? 'SAR' : 'ريال'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === 'en' ? 'Delivery Fee:' : 'رسوم التوصيل:'}</span>
                          <span>{deliveryFee} {language === 'en' ? 'SAR' : 'ريال'}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                          <span>{language === 'en' ? 'Total:' : 'المجموع:'}</span>
                          <span>{totalPrice} {language === 'en' ? 'SAR' : 'ريال'}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                      >
                        {language === 'en' ? 'Proceed to Checkout' : 'الانتقال إلى الدفع'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Checkout' : 'الدفع'}
              </h3>
              
              {/* Order Summary */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">
                  {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                </h4>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{item.price * item.quantity} {language === 'en' ? 'SAR' : 'ريال'}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Subtotal:' : 'المجموع الفرعي:'}</span>
                    <span>{subtotal} {language === 'en' ? 'SAR' : 'ريال'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Delivery Fee:' : 'رسوم التوصيل:'}</span>
                    <span>{deliveryFee} {language === 'en' ? 'SAR' : 'ريال'}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                    <span>{language === 'en' ? 'Total:' : 'المجموع:'}</span>
                    <span>{totalPrice} {language === 'en' ? 'SAR' : 'ريال'}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div>
                <h4 className="font-medium mb-3">
                  {language === 'en' ? 'Payment Method' : 'طريقة الدفع'}
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="h-4 w-4 text-primary-600"
                    />
                    <span>{language === 'en' ? 'Cash on Delivery' : 'الدفع عند الاستلام'}</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="h-4 w-4 text-primary-600"
                    />
                    <span>{language === 'en' ? 'Credit/Debit Card' : 'بطاقة ائتمان/خصم'}</span>
                  </label>
                </div>
              </div>
              
              {/* Demo Card Payment (shown only when card is selected) */}
              {paymentMethod === 'card' && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <h5 className="font-medium">
                    {language === 'en' ? 'Card Details' : 'تفاصيل البطاقة'}
                  </h5>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'Card Number' : 'رقم البطاقة'}
                      className="w-full p-2 border border-gray-300 rounded"
                      value="4242 4242 4242 4242" // Demo value
                      readOnly
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder={language === 'en' ? 'Expiry' : 'انتهاء الصلاحية'}
                        className="p-2 border border-gray-300 rounded"
                        value="12/25" // Demo value
                        readOnly
                      />
                      <input
                        type="text"
                        placeholder={language === 'en' ? 'CVV' : 'CVV'}
                        className="p-2 border border-gray-300 rounded"
                        value="123" // Demo value
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setIsCheckout(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  {language === 'en' ? 'Back to Cart' : 'العودة إلى السلة'}
                </button>
                <button
                  onClick={placeOrder}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                >
                  {isProcessing 
                    ? (language === 'en' ? 'Processing...' : 'جاري المعالجة...') 
                    : (language === 'en' ? 'Place Order' : 'تقديم الطلب')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LaundryServiceCart;