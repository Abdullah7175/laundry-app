import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function ServiceCard({ service, language }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard/book');
    } else {
      router.push('/login');
    }
  };
  
  return (
    <div 
      className={`bg-white rounded-2xl shadow-md p-6 transition-all duration-300 border border-gray-100 hover:border-primary-200 ${
        isHovered ? 'transform -translate-y-2 shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary-100 text-primary-600">
        <span className="text-3xl">{service.icon}</span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        {language === 'en' ? service.title : service.titleAr || service.title}
      </h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {language === 'en' ? service.description : service.descriptionAr || service.description}
      </p>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xl font-bold text-primary-700">{service.price} SAR</span>
        
        <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary-600 px-4 py-2 text-white shadow-md transition duration-300 ease-out hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2">
          <span className="relative">{language === 'en' ? 'Book Now' : 'احجز الآن'}</span>
        </button>
      </div>
    </div>
  );
}