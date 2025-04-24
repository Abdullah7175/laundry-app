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
      className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
        isHovered ? 'transform -translate-y-2 shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="text-4xl mb-4">{service.icon}</div>
      <h3 className="text-xl font-bold text-blue-700 mb-2">
        {language === 'en' ? service.title : service.titleAr || service.title}
      </h3>
      <p className="text-gray-600 mb-4">
        {language === 'en' ? service.description : service.descriptionAr || service.description}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-blue-600">{service.price} SAR</span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition duration-300">
          {language === 'en' ? 'Book Now' : 'احجز الآن'}
        </button>
      </div>
    </div>
  );
}