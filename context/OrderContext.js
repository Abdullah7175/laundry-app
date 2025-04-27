import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create the order context
const OrderContext = createContext();

// Mock service items
const serviceItems = [
  {
    id: 1,
    name: 'Bed Sheets',
    nameAr: 'ملاءات السرير',
    price: 25,
    description: 'Deep cleaning for all your bed sheets',
    descriptionAr: 'تنظيف عميق لجميع ملاءات السرير',
    icon: '🛏️'
  },
  {
    id: 2,
    name: 'Pillowcases',
    nameAr: 'أكياس الوسائد',
    price: 10,
    description: 'Fresh and clean pillowcases',
    descriptionAr: 'أكياس وسائد منعشة ونظيفة',
    icon: '🛌'
  },
  {
    id: 3,
    name: 'Duvet Covers',
    nameAr: 'أغطية اللحاف',
    price: 35,
    description: 'Professional cleaning for duvet covers',
    descriptionAr: 'تنظيف احترافي لأغطية اللحاف',
    icon: '🧵'
  },
  {
    id: 4,
    name: 'Blankets',
    nameAr: 'البطانيات',
    price: 45,
    description: 'Thorough cleaning for all blankets',
    descriptionAr: 'تنظيف شامل لجميع البطانيات',
    icon: '🧶'
  },
  {
    id: 5,
    name: 'Comforters',
    nameAr: 'اللحف',
    price: 60,
    description: 'Deep cleaning for comforters',
    descriptionAr: 'تنظيف عميق للحف',
    icon: '🧠'
  },
  {
    id: 6,
    name: 'Quilts',
    nameAr: 'الألحفة',
    price: 55,
    description: 'Professional cleaning for quilts',
    descriptionAr: 'تنظيف احترافي للألحفة',
    icon: '🧩'
  }
];

// Mock orders
const mockOrders = [
  {
    id: 1001,
    customerId: 1,
    customerName: 'Customer User',
    customerPhone: '+966 50 123 4567',
    vendorId: 3,
    address: '123 Main St, Riyadh',
    items: [
      { id: 1, name: 'Bed Sheets', quantity: 2, price: 25 },
      { id: 2, name: 'Pillowcases', quantity: 4, price: 10 }
    ],
    subtotal: 90,
    deliveryFee: 10,
    discount: 0,
    total: 100,
    status: 'delivered',
    paymentMethod: 'Card',
    pickupTime: '2025-04-22T10:00:00',
    deliveryTime: '2025-04-23T14:00:00',
    createdAt: '2025-04-22T08:30:00',
    updatedAt: '2025-04-23T14:30:00',
    loyaltyPoints: 10
  },
  {
    id: 1002,
    customerId: 1,
    customerName: 'Customer User',
    customerPhone: '+966 50 123 4567',
    vendorId: 3,
    address: '123 Main St, Riyadh',
    items: [
      { id: 3, name: 'Duvet Covers', quantity: 1, price: 35 },
      { id: 4, name: 'Blankets', quantity: 2, price: 45 }
    ],
    subtotal: 125,
    deliveryFee: 10,
    discount: 5,
    total: 130,
    status: 'processing',
    paymentMethod: 'Cash',
    pickupTime: '2025-04-24T11:00:00',
    deliveryTime: '2025-04-25T15:00:00',
    createdAt: '2025-04-24T09:15:00',
    updatedAt: '2025-04-24T12:30:00',
    loyaltyPoints: 13
  },
  {
    id: 1003,
    customerId: 1,
    customerName: 'Customer User',
    customerPhone: '+966 50 123 4567',
    vendorId: 3,
    address: '123 Main St, Riyadh',
    items: [
      { id: 5, name: 'Comforters', quantity: 1, price: 60 },
      { id: 6, name: 'Quilts', quantity: 1, price: 55 }
    ],
    subtotal: 115,
    deliveryFee: 10,
    discount: 0,
    total: 125,
    status: 'pending',
    paymentMethod: 'STC Pay',
    pickupTime: '2025-04-26T09:00:00',
    deliveryTime: '2025-04-27T13:00:00',
    createdAt: '2025-04-25T18:45:00',
    updatedAt: '2025-04-25T18:45:00',
    loyaltyPoints: 12
  }
];

// Order provider component
export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth() || {};

  useEffect(() => {
    // If there's a logged in user, load their orders
    if (user) {
      if (user.type === 'customer') {
        getCustomerOrders(user.id);
      } else if (user.type === 'vendor') {
        getVendorOrders(user.id);
      } else if (user.type === 'admin' || user.type === 'laundry') {
        getAllOrders();
      }
    }
  }, [user]);

  // Get all orders
  const getAllOrders = async () => {
    // In a real app, you would make an API call here
    // For demo purposes, return our mock orders
    setOrders(mockOrders);
    return mockOrders;
  };

  // Get customer orders
  const getCustomerOrders = async (customerId) => {
    // In a real app, you would make an API call here
    // For demo purposes, filter our mock orders
    const customerOrders = mockOrders.filter(order => order.customerId === customerId);
    setOrders(customerOrders);
    return customerOrders;
  };

  // Get vendor orders
  const getVendorOrders = async (vendorId) => {
    // In a real app, you would make an API call here
    // For demo purposes, filter our mock orders
    const vendorOrders = mockOrders.filter(order => order.vendorId === vendorId);
    setOrders(vendorOrders);
    return vendorOrders;
  };

  // Create a new order
  // const createOrder = async (orderData) => {
  //   try {
  //     // In a real app, you would make an API call here
  //     // For demo purposes, create a new order in our mock data
  //     const newOrder = {
  //       id: mockOrders.length > 0 ? Math.max(...mockOrders.map(o => o.id)) + 1 : 1001,
  //       ...orderData,
  //       status: 'pending',
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //       loyaltyPoints: Math.floor(orderData.total / 10)
  //     };

  //     // Add to mock orders and state
  //     mockOrders.push(newOrder);
  //     setOrders([...orders, newOrder]);

  //     return newOrder;
  //   } catch (error) {
  //     console.error('Create order error:', error);
  //     throw new Error('Failed to create order');
  //   }
  // };

  // Create a new order
const createOrder = async (orderData) => {
  try {
    // Calculate subtotal from items
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create new order object
    const newOrder = {
      id: mockOrders.length > 0 ? Math.max(...mockOrders.map(o => o.id)) + 1 : 1001,
      customerId: orderData.userId,
      customerName: user?.name || 'Customer',
      customerPhone: user?.phone || '',
      vendorId: 3, // Default vendor for laundry
      address: user?.address || '',
      items: orderData.items,
      subtotal: subtotal,
      deliveryFee: 10, // Fixed delivery fee
      discount: 0,
      total: subtotal + 10, // subtotal + delivery fee
      status: 'pending',
      paymentMethod: orderData.paymentMethod,
      pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      deliveryTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      loyaltyPoints: Math.floor((subtotal + 10) / 10) // 1 point per 10 SAR
    };

    // Add to mock orders and state
    mockOrders.unshift(newOrder); // Add to beginning
    setOrders(prevOrders => [newOrder, ...prevOrders]);

    return newOrder;
  } catch (error) {
    console.error('Create order error:', error);
    throw new Error('Failed to create order');
  }
};

  // Update an order
  const updateOrder = async (orderId, updateData) => {
    try {
      // In a real app, you would make an API call here
      // For demo purposes, update the order in our mock data
      const orderIndex = mockOrders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        const updatedOrder = {
          ...mockOrders[orderIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        };

        mockOrders[orderIndex] = updatedOrder;
        setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));

        return updatedOrder;
      }

      throw new Error('Order not found');
    } catch (error) {
      console.error('Update order error:', error);
      throw new Error('Failed to update order');
    }
  };

  // Get service items
  const getServiceItems = async () => {
    // In a real app, you would make an API call here
    // For demo purposes, return our mock service items
    return serviceItems;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      getAllOrders,
      getCustomerOrders,
      getVendorOrders,
      createOrder,
      updateOrder,
      getServiceItems
    }}>
      {children}
    </OrderContext.Provider>
  );
}

// Custom hook to use the order context
export function useOrder() {
  return useContext(OrderContext);
}