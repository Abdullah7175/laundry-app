import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useOrder } from '../../context/OrderContext';
import { useNotification } from '../../context/NotificationContext';

const ServiceSelection = () => {
  const { t } = useLanguage();
  const { addItemToOrder, cart } = useOrder();
  const { addNotification } = useNotification();
  const router = useRouter();
  
  const [selectedItems, setSelectedItems] = useState({});
  
  // Initialize selected items from cart if available
  useEffect(() => {
    if (cart && cart.items) {
      const initialSelected = {};
      cart.items.forEach(item => {
        initialSelected[item.id] = item.quantity;
      });
      setSelectedItems(initialSelected);
    }
  }, [cart]);

  const services = [
    {
      id: 1,
      name: t('services.bed_sheets'),
      price: 15,
      image: 'https://images.unsplash.com/photo-1521510535750-13af4de027e4',
      description: 'Professional cleaning for all bed sheet sizes',
    },
    {
      id: 2,
      name: t('services.pillowcases'),
      price: 8,
      image: 'https://images.unsplash.com/photo-1529400097500-418a246f63a9',
      description: 'Soft and gentle cleaning for pillowcases',
    },
    {
      id: 3,
      name: t('services.duvet_covers'),
      price: 25,
      image: 'https://images.unsplash.com/photo-1504310996069-2357d42d5061',
      description: 'Deep cleaning for duvet covers of all sizes',
    },
    {
      id: 4,
      name: t('services.blankets'),
      price: 30,
      image: 'https://images.unsplash.com/photo-1422190441165-ec2956dc9ecc',
      description: 'Thorough cleaning for blankets',
    },
    {
      id: 5,
      name: t('services.comforters'),
      price: 40,
      image: 'https://images.unsplash.com/photo-1517836034914-40ef8d668510',
      description: 'Gentle cleaning for your comforters',
    },
    {
      id: 6,
      name: t('services.quilts'),
      price: 35,
      image: 'https://images.unsplash.com/photo-1530455623052-e8441ae826f7',
      description: 'Special care for delicate quilts',
    },
  ];

  const handleQuantityChange = (id, action) => {
    const currentQuantity = selectedItems[id] || 0;
    
    if (action === 'increase') {
      setSelectedItems({
        ...selectedItems,
        [id]: currentQuantity + 1,
      });
    } else if (action === 'decrease' && currentQuantity > 0) {
      setSelectedItems({
        ...selectedItems,
        [id]: currentQuantity - 1,
      });
    }
  };

  const handleAddToOrder = (item) => {
    const quantity = selectedItems[item.id] || 0;
    
    if (quantity > 0) {
      addItemToOrder({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity,
      });
      
      addNotification({
        type: 'success',
        message: `${item.name} added to your order`,
      });
    }
  };

  const handleCheckout = () => {
    const hasItems = Object.values(selectedItems).some(quantity => quantity > 0);
    
    if (hasItems) {
      router.push('/customer/checkout');
    } else {
      addNotification({
        type: 'warning',
        message: 'Please select at least one item to proceed',
      });
    }
  };

  const totalItems = Object.values(selectedItems).reduce((sum, quantity) => sum + quantity, 0);
  const totalPrice = services.reduce((sum, service) => {
    const quantity = selectedItems[service.id] || 0;
    return sum + (service.price * quantity);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('services.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('services.subtitle')}</p>
        </div>
        
        {totalItems > 0 && (
          <div className="mt-4 sm:mt-0 bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              <span className="font-medium">{totalItems}</span> items |{' '}
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-2"
              onClick={handleCheckout}
            >
              {t('order.schedule_pickup')}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service.id}
            isHoverable
            className="overflow-hidden"
            isPadded={false}
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{service.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">
                  ${service.price.toFixed(2)} <span className="text-sm text-gray-500">{t('services.per_item')}</span>
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => handleQuantityChange(service.id, 'decrease')}
                    disabled={!selectedItems[service.id]}
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <span className="w-8 text-center">{selectedItems[service.id] || 0}</span>
                  
                  <button
                    type="button"
                    className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => handleQuantityChange(service.id, 'increase')}
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  variant="outline"
                  isFullWidth
                  onClick={() => handleAddToOrder(service)}
                  isDisabled={!selectedItems[service.id]}
                >
                  {t('services.add_to_order')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {totalItems > 0 && (
        <div className="mt-8 text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCheckout}
          >
            {t('order.schedule_pickup')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
