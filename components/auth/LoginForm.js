import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = ({ demoCredentials }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const { addNotification } = useNotification();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = t('common.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = t('common.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        addNotification({
          type: 'success',
          message: t('auth.login_success'),
        });
        
        // Redirect based on user role
        const user = success;
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'vendor') {
          router.push('/vendor/dashboard');
        } else if (user.role === 'delivery') {
          router.push('/delivery/dashboard');
        } else if (user.role === 'laundry') {
          router.push('/laundry/dashboard');
        } else {
          router.push('/customer/dashboard');
        }
      } else {
        addNotification({
          type: 'error',
          message: t('auth.login_error'),
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || t('auth.login_error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (credentials) => {
    setFormData(credentials);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('auth.email')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          errorMessage={errors.email}
          required
          icon={
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          }
        />
        
        <Input
          label={t('auth.password')}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          errorMessage={errors.password}
          required
          icon={
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          }
        />
        
        <div className="text-sm text-right">
          <Link href="/auth/forgot-password">
            <a className="font-medium text-blue-600 hover:text-blue-500">
              {t('auth.forgot_password')}
            </a>
          </Link>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          isFullWidth
          isLoading={isLoading}
        >
          {t('auth.login')}
        </Button>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {t('auth.no_account')}{' '}
          <Link href="/auth/register">
            <a className="font-medium text-blue-600 hover:text-blue-500">
              {t('auth.register')}
            </a>
          </Link>
        </p>
      </div>
      
      {demoCredentials && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">{t('demo_login.title')}</h3>
          <div className="space-y-2">
            {Object.entries(demoCredentials).map(([role, credentials]) => (
              <Button
                key={role}
                type="button"
                variant="outline"
                size="sm"
                isFullWidth
                onClick={() => handleDemoLogin(credentials)}
              >
                {t(`demo_login.${role}`)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
