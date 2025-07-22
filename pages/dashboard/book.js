import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { dummyVendors } from '../../components/VendorCard';

export default function BookServicePage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    serviceType: 'home_cleaning',
    date: '',
    time: '',
    address: '',
    specialInstructions: '',
    frequency: 'once',
    paymentMethod: 'cash'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Demo service types
  const serviceTypes = [
    { id: 'home_cleaning', name: language === 'en' ? 'Home Cleaning' : 'تنظيف المنزل' },
    { id: 'deep_cleaning', name: language === 'en' ? 'Deep Cleaning' : 'تنظيف عميق' },
    { id: 'office_cleaning', name: language === 'en' ? 'Office Cleaning' : 'تنظيف المكاتب' },
    { id: 'carpet_cleaning', name: language === 'en' ? 'Carpet Cleaning' : 'تنظيف السجاد' },
    { id: 'window_cleaning', name: language === 'en' ? 'Window Cleaning' : 'تنظيف النوافذ' },
  ];

  // Demo payment methods
  const paymentMethods = [
    { id: 'cash', name: language === 'en' ? 'Cash on Delivery' : 'الدفع نقداً عند الاستلام' },
    { id: 'card', name: language === 'en' ? 'Credit Card' : 'بطاقة ائتمان' },
    { id: 'apple_pay', name: 'Apple Pay' },
    { id: 'google_pay', name: 'Google Pay' },
  ];

  // Demo frequencies
  const frequencies = [
    { id: 'once', name: language === 'en' ? 'One Time' : 'مرة واحدة' },
    { id: 'weekly', name: language === 'en' ? 'Weekly' : 'أسبوعي' },
    { id: 'biweekly', name: language === 'en' ? 'Bi-Weekly' : 'كل أسبوعين' },
    { id: 'monthly', name: language === 'en' ? 'Monthly' : 'شهري' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          serviceType: 'home_cleaning',
          date: '',
          time: '',
          address: '',
          specialInstructions: '',
          frequency: 'once',
          paymentMethod: 'cash'
        });
        setSelectedVendor(null);
        setBookingSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <Layout title={language === 'en' ? 'Book Service | Nasi` Cleanings' : 'حجز الخدمة | تنظيف الأرز'}>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              {language === 'en' ? 'Book a Cleaning Service' : 'حجز خدمة التنظيف'}
            </h1>
            
            {!selectedVendor ? (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Select a Vendor' : 'اختر مزود الخدمة'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dummyVendors.map(vendor => (
                    <div 
                      key={vendor.id}
                      className="border rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors"
                      onClick={() => setSelectedVendor(vendor)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {vendor.image ? (
                            <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{vendor.name}</h3>
                          <p className="text-sm text-gray-600">{vendor.serviceType}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-sm text-gray-700">
                              {vendor.rating} ({vendor.reviews} {language === 'en' ? 'reviews' : 'تقييمات'})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {selectedVendor.image ? (
                        <img src={selectedVendor.image} alt={selectedVendor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{selectedVendor.name}</h2>
                      <p className="text-gray-600">{selectedVendor.serviceType}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedVendor(null)}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    {language === 'en' ? 'Change' : 'تغيير'}
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Service Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Service Type' : 'نوع الخدمة'}
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        {serviceTypes.map(service => (
                          <option key={service.id} value={service.id}>{service.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'en' ? 'Date' : 'التاريخ'}
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'en' ? 'Time' : 'الوقت'}
                        </label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">{language === 'en' ? 'Select time' : 'اختر الوقت'}</option>
                          <option value="08:00">8:00 AM</option>
                          <option value="09:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="13:00">1:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                        </select>
                      </div>
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Frequency' : 'التكرار'}
                      </label>
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        {frequencies.map(freq => (
                          <option key={freq.id} value={freq.id}>{freq.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Address' : 'العنوان'}
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder={language === 'en' ? 'Enter your full address' : 'أدخل عنوانك الكامل'}
                        required
                      />
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Special Instructions' : 'تعليمات خاصة'}
                      </label>
                      <textarea
                        name="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder={language === 'en' ? 'Any special requests or instructions' : 'أي طلبات أو تعليمات خاصة'}
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Payment Method' : 'طريقة الدفع'}
                      </label>
                      <div className="space-y-2">
                        {paymentMethods.map(method => (
                          <div key={method.id} className="flex items-center">
                            <input
                              id={`payment-${method.id}`}
                              name="paymentMethod"
                              type="radio"
                              value={method.id}
                              checked={formData.paymentMethod === method.id}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <label htmlFor={`payment-${method.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                              {method.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-lg mb-3">
                        {language === 'en' ? 'Pricing Summary' : 'ملخص التسعير'}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>{language === 'en' ? 'Base Cleaning' : 'التنظيف الأساسي'}</span>
                          <span>$75.00</span>
                        </div>
                        {formData.serviceType === 'deep_cleaning' && (
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Deep Cleaning Add-on' : 'إضافة التنظيف العميق'}</span>
                            <span>$25.00</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between font-medium">
                          <span>{language === 'en' ? 'Total' : 'المجموع'}</span>
                          <span>
                            {formData.serviceType === 'deep_cleaning' ? '$100.00' : '$75.00'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          language === 'en' ? 'Booking...' : 'جاري الحجز...'
                        ) : (
                          language === 'en' ? 'Confirm Booking' : 'تأكيد الحجز'
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {bookingSuccess && (
                  <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-md">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>
                        {language === 'en' 
                          ? 'Booking confirmed! Our team will contact you soon.' 
                          : 'تم تأكيد الحجز! سيتواصل معك فريقنا قريبًا.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}