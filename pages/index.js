import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Check for language preference in localStorage
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // Featured services
  const services = [
    {
      id: 1,
      title: 'Bed Sheets',
      titleAr: 'ملاءات السرير',
      description: 'Professional cleaning for all bed sheets',
      descriptionAr: 'تنظيف احترافي لجميع ملاءات السرير',
      price: 25,
      icon: '🛏️'
    },
    {
      id: 2,
      title: 'Pillowcases',
      titleAr: 'أكياس الوسائد',
      description: 'Fresh and clean pillowcases',
      descriptionAr: 'أكياس وسائد منعشة ونظيفة',
      price: 10,
      icon: '🛌'
    },
    {
      id: 3,
      title: 'Duvet Covers',
      titleAr: 'أغطية اللحاف',
      description: 'Professional cleaning for duvet covers',
      descriptionAr: 'تنظيف احترافي لأغطية اللحاف',
      price: 35,
      icon: '🧵'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'en' ? 'NASI CLEANING Service' : 'خدمة غسيل مفارش السرير الاحترافية'}
            </h1>
            <p className="text-xl mb-8">
              {language === 'en' 
                ? 'We keep your bedding fresh, clean and hygienic' 
                : 'نحافظ على مفارش سريرك منعشة ونظيفة وصحية'
              }
            </p>
            <button
              onClick={() => isAuthenticated ? router.push('/dashboard') : router.push('/register')}
              className="bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-full font-bold text-lg shadow-lg transition duration-300"
            >
              {language === 'en' 
                ? (isAuthenticated ? 'Dashboard' : 'Book Now') 
                : (isAuthenticated ? 'لوحة التحكم' : 'احجز الآن')
              }
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
            {language === 'en' ? 'How It Works' : 'كيف تعمل خدمتنا'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl mb-4 text-blue-600 mx-auto">📱</div>
              <h3 className="text-xl font-bold mb-3 text-blue-700">
                {language === 'en' ? '1. Book a Service' : '١. احجز الخدمة'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Choose your service package and schedule a convenient pickup time' 
                  : 'اختر حزمة الخدمة وحدد وقت استلام مناسب'
                }
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl mb-4 text-blue-600 mx-auto">🚚</div>
              <h3 className="text-xl font-bold mb-3 text-blue-700">
                {language === 'en' ? '2. Pickup & Delivery' : '٢. الاستلام والتوصيل'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'We pick up your bedding items and deliver them back after cleaning' 
                  : 'نستلم عناصر مفارش السرير الخاصة بك ونعيدها بعد التنظيف'
                }
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl mb-4 text-blue-600 mx-auto">✨</div>
              <h3 className="text-xl font-bold mb-3 text-blue-700">
                {language === 'en' ? '3. Professional Cleaning' : '٣. التنظيف الاحترافي'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'We use eco-friendly products and processes to clean your bedding' 
                  : 'نستخدم منتجات وعمليات صديقة للبيئة لتنظيف مفارش السرير'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
            {language === 'en' ? 'Our Services' : 'خدماتنا'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} language={language} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/services')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-300"
            >
              {language === 'en' ? 'View All Services' : 'عرض جميع الخدمات'}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
            {language === 'en' ? 'What Our Customers Say' : 'ما يقوله عملاؤنا'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4 text-yellow-400 text-xl">★★★★★</div>
                <div className="font-bold">
                  {language === 'en' ? 'Sarah M.' : 'سارة م.'}
                </div>
              </div>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Excellent service! My bedding items came back perfectly clean and fresh. Will definitely use again.' 
                  : 'خدمة ممتازة! عادت مفارش السرير الخاصة بي نظيفة ومنعشة تمامًا. سأستخدم الخدمة مرة أخرى بالتأكيد.'
                }
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4 text-yellow-400 text-xl">★★★★★</div>
                <div className="font-bold">
                  {language === 'en' ? 'Mohammed A.' : 'محمد أ.'}
                </div>
              </div>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Very convenient! The pickup and delivery was on time, and the quality of cleaning was superb.' 
                  : 'مريحة جدًا! كان الاستلام والتوصيل في الوقت المحدد، وجودة التنظيف كانت رائعة.'
                }
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4 text-yellow-400 text-xl">★★★★★</div>
                <div className="font-bold">
                  {language === 'en' ? 'Fatima K.' : 'فاطمة ك.'}
                </div>
              </div>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'I was impressed with how well they handled my expensive duvet covers. Professional service!' 
                  : 'أعجبت بمدى إتقانهم في التعامل مع أغطية اللحاف الباهظة الثمن. خدمة احترافية!'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {language === 'en' ? 'Ready for Fresh, Clean Bedding?' : 'هل أنت مستعد لمفارش سرير نظيفة ومنعشة؟'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Join our growing list of satisfied customers and experience the difference of professional bedding care.' 
              : 'انضم إلى قائمتنا المتزايدة من العملاء الراضين واختبر الفرق في العناية الاحترافية بمفارش السرير.'
            }
          </p>
          <button
            onClick={() => isAuthenticated ? router.push('/dashboard') : router.push('/register')}
            className="bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-full font-bold text-lg shadow-lg transition duration-300"
          >
            {language === 'en' 
              ? (isAuthenticated ? 'Go to Dashboard' : 'Get Started Now') 
              : (isAuthenticated ? 'انتقل إلى لوحة التحكم' : 'ابدأ الآن')
            }
          </button>
        </div>
      </section>
    </Layout>
  );
}