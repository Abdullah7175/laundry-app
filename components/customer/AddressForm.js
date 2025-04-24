import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

const AddressForm = ({ initialAddress = {}, onSave, onCancel }) => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    building: '',
    apartment: '',
    city: '',
    zipCode: '',
    instructions: '',
    isDefault: false,
    ...initialAddress
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Update form when initialAddress changes
  useEffect(() => {
    if (initialAddress && Object.keys(initialAddress).length > 0) {
      setFormData({
        name: '',
        street: '',
        building: '',
        apartment: '',
        city: '',
        zipCode: '',
        instructions: '',
        isDefault: false,
        ...initialAddress
      });
    }
  }, [initialAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = t('common.required');
    }
    
    if (!formData.street) {
      newErrors.street = t('common.required');
    }
    
    if (!formData.city) {
      newErrors.city = t('common.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // If we're editing, include the ID
      const addressToSave = {
        ...formData,
        id: formData.id || Date.now().toString()
      };
      
      await onSave(addressToSave);
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  // Try to get user's location
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Here we'd normally make a reverse geocoding API call
            // For the demo, we'll just use placeholder data
            setTimeout(() => {
              setFormData({
                ...formData,
                street: "Detected Street",
                city: "Detected City",
                zipCode: "12345"
              });
              setIsLoading(false);
            }, 1000);
          } catch (error) {
            console.error('Error detecting location:', error);
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <div className="w-full sm:w-1/2">
          <Input
            label={t('profile.address_name')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Home, Work, etc."
            errorMessage={errors.name}
            required
          />
        </div>
        
        <div className="mt-4 sm:mt-0 sm:flex-1">
          <Button
            type="button"
            variant="outline"
            isLoading={isLoading}
            onClick={handleDetectLocation}
            className="w-full"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {t('common.detect_location')}
          </Button>
        </div>
      </div>

      <Input
        label={t('profile.street')}
        name="street"
        value={formData.street}
        onChange={handleChange}
        placeholder="Street name and number"
        errorMessage={errors.street}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('profile.building')}
          name="building"
          value={formData.building}
          onChange={handleChange}
          placeholder="Building name/number"
        />
        
        <Input
          label={t('profile.apartment')}
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
          placeholder="Apartment/Suite/Unit"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('profile.city')}
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          errorMessage={errors.city}
          required
        />
        
        <Input
          label={t('profile.zip_code')}
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          placeholder="ZIP / Postal code"
        />
      </div>

      <Input
        label={t('profile.delivery_instructions')}
        name="instructions"
        value={formData.instructions}
        onChange={handleChange}
        placeholder="Special instructions for delivery"
        as="textarea"
        rows={3}
      />

      <div className="flex items-center">
        <input
          id="isDefault"
          name="isDefault"
          type="checkbox"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
          {t('profile.set_default_address')}
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="light"
            onClick={handleCancel}
          >
            {t('common.cancel')}
          </Button>
        )}
        
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
