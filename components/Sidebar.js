import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ navItems, activeItem, setActiveItem, language, userType }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (logout) {
      logout();
      router.push('/login');
    }
  };

  return (
    <div className="bg-white w-full md:w-64 md:min-h-screen shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-blue-800">
          {userType === 'customer' && (language === 'en' ? 'Customer Panel' : 'لوحة العميل')}
          {userType === 'admin' && (language === 'en' ? 'Admin Panel' : 'لوحة الإدارة')}
          {userType === 'vendor' && (language === 'en' ? 'Vendor Panel' : 'لوحة البائع')}
          {userType === 'delivery' && (language === 'en' ? 'Delivery Panel' : 'لوحة التوصيل')}
          {userType === 'laundry' && (language === 'en' ? 'Laundry Panel' : 'لوحة الغسيل')}
        </h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center p-2 rounded-md transition-colors duration-200 ${
                  activeItem === item.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
          
          <li className="pt-4 mt-4 border-t border-gray-200">
            <button
              className="w-full flex items-center p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200"
              onClick={handleLogout}
            >
              <span className="mr-3">🚪</span>
              <span>{language === 'en' ? 'Logout' : 'تسجيل الخروج'}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}