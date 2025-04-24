import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
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
    
    if (!formData.fullName) {
      newErrors.fullName = t('common.required');
    }
    
    if (!formData.email) {
      newErrors.email = t('common.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone) {
      newErrors.phone = t('common.required');
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (!formData.password) {
      newErrors.password = t('common.required');
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('common.required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      
      if (success) {
        addNotification({
          type: 'success',
          message: t('auth.register_success'),
        });
        router.push('/customer/dashboard');
      } else {
        addNotification({
          type: 'error',
          message: t('auth.register_error'),
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || t('auth.register_error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('auth.full_name')}
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          errorMessage={errors.fullName}
          required
          icon={
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          }
        />
        
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
          label={t('auth.phone')}
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          errorMessage={errors.phone}
          required
          icon={
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
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
        
        <Input
          label={t('auth.confirm_password')}
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          errorMessage={errors.confirmPassword}
          required
          icon={
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          }
        />
        
        <Button
          type="submit"
          variant="primary"
          isFullWidth
          isLoading={isLoading}
        >
          {t('auth.register')}
        </Button>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {t('auth.has_account')}{' '}
          <Link href="/auth/login">
            <a className="font-medium text-blue-600 hover:text-blue-500">
              {t('auth.login')}
            </a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
