import React from 'react';

// Dummy vendor data
const dummyVendors = [
  {
    id: '1',
    name: 'CleanPro Services',
    serviceType: 'Home Cleaning',
    rating: 4.8,
    reviews: 124,
    image: '/images/vendors/cleanpro.jpg',
    description: 'Professional home cleaning services with eco-friendly products.',
    experience: 5,
    servicesCount: 3
  },
  {
    id: '2',
    name: 'Sparkle Team',
    serviceType: 'Office Cleaning',
    rating: 4.6,
    reviews: 89,
    image: '/images/vendors/sparkle.jpg',
    description: 'Specialized in office and commercial space cleaning.',
    experience: 7,
    servicesCount: 5
  },
  {
    id: '3',
    name: 'Fresh & Clean',
    serviceType: 'Deep Cleaning',
    rating: 4.9,
    reviews: 156,
    image: '/images/vendors/fresh.jpg',
    description: 'Deep cleaning specialists with attention to detail.',
    experience: 8,
    servicesCount: 4
  },
  {
    id: '4',
    name: 'Green Clean',
    serviceType: 'Eco Cleaning',
    rating: 4.7,
    reviews: 72,
    image: '/images/vendors/green.jpg',
    description: 'Environmentally friendly cleaning services using green products.',
    experience: 4,
    servicesCount: 2
  },
  {
    id: '5',
    name: 'Royal Cleaning',
    serviceType: 'Luxury Cleaning',
    rating: 4.9,
    reviews: 203,
    image: '/images/vendors/royal.jpg',
    description: 'Premium cleaning services for high-end homes and properties.',
    experience: 10,
    servicesCount: 6
  },
  {
    id: '6',
    name: 'Quick Clean',
    serviceType: 'Express Cleaning',
    rating: 4.5,
    reviews: 98,
    image: '/images/vendors/quick.jpg',
    description: 'Fast and efficient cleaning services for busy people.',
    experience: 3,
    servicesCount: 3
  }
];

const VendorCard = ({ vendor, onSelect, language, showDetails = false }) => {
  // If no vendor prop is passed, use the first dummy vendor
  const displayVendor = vendor || dummyVendors[0];

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              {displayVendor.image ? (
                <img 
                  src={displayVendor.image} 
                  alt={displayVendor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{displayVendor.name}</h3>
            <p className="text-gray-600 text-sm">{displayVendor.serviceType}</p>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-sm text-gray-700">
                {displayVendor.rating} ({displayVendor.reviews} {language === 'en' ? 'reviews' : 'تقييمات'})
              </span>
            </div>
            {onSelect && (
              <button 
                className="mt-2 px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(displayVendor);
                }}
              >
                {language === 'en' ? 'Select' : 'اختر'}
              </button>
            )}
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">
              {language === 'en' ? 'About' : 'حول'}
            </h4>
            <p className="text-gray-600 text-sm">{displayVendor.description || (language === 'en' ? 'No description provided' : 'لا يوجد وصف')}</p>
            
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-500 block">
                  {language === 'en' ? 'Experience' : 'الخبرة'}
                </span>
                <span className="text-sm font-medium">
                  {displayVendor.experience || '--'} {language === 'en' ? 'years' : 'سنوات'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">
                  {language === 'en' ? 'Services' : 'الخدمات'}
                </span>
                <span className="text-sm font-medium">
                  {displayVendor.servicesCount || '--'} {language === 'en' ? 'services' : 'خدمة'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export the dummy vendors along with the component
export { dummyVendors };
export default VendorCard;