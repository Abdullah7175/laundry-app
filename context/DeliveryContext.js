import { createContext, useContext, useState, useEffect } from 'react';

const DeliveryContext = createContext();

export const DeliveryProvider = ({ children }) => {
  // Mock rider data
  const mockRiders = [
    {
      id: '1',
      name: 'Nasi Rider 1',
      vehicle: 'motorcycle',
      status: 'available',
      type: 'admin'
    },
    {
      id: '2',
      name: 'Vendor A Rider',
      vehicle: 'bicycle',
      status: 'available',
      type: 'vendor',
      vendorId: 'vendor1'
    },
    {
      id: '3',
      name: 'Vendor B Rider',
      vehicle: 'car',
      status: 'busy',
      type: 'vendor',
      vendorId: 'vendor2'
    }
  ];

  const [riders, setRiders] = useState(mockRiders);
  const [availableRiders, setAvailableRiders] = useState([]);
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [unassignedDeliveries, setUnassignedDeliveries] = useState([]);
  
  // Mock order data for deliveries
  const mockDeliveries = [
    {
      id: '101',
      customerName: 'Customer 1',
      address: '123 Main St',
      status: 'readyForDelivery',
      deliveryPersonId: null,
      vendorId: 'vendor1'
    },
    {
      id: '102',
      customerName: 'Customer 2',
      address: '456 Oak Ave',
      status: 'delivery',
      deliveryPersonId: '1',
      vendorId: null
    },
    {
      id: '103',
      customerName: 'Customer 3',
      address: '789 Pine Rd',
      status: 'readyForDelivery',
      deliveryPersonId: null,
      vendorId: 'vendor2'
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    setAvailableRiders(riders.filter(rider => rider.status === 'available'));
    setAssignedDeliveries(mockDeliveries.filter(d => d.deliveryPersonId));
    setUnassignedDeliveries(mockDeliveries.filter(d => !d.deliveryPersonId));
  }, []);

  // Mock function to assign rider
  const assignRider = async (orderId, riderId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update the mock data
        const updatedDeliveries = mockDeliveries.map(order => 
          order.id === orderId ? { ...order, deliveryPersonId: riderId, status: 'delivery' } : order
        );
        
        setAssignedDeliveries(updatedDeliveries.filter(d => d.deliveryPersonId));
        setUnassignedDeliveries(updatedDeliveries.filter(d => !d.deliveryPersonId));
        
        // Update rider status to busy
        const updatedRiders = riders.map(rider => 
          rider.id === riderId ? { ...rider, status: 'busy' } : rider
        );
        setRiders(updatedRiders);
        setAvailableRiders(updatedRiders.filter(r => r.status === 'available'));
        
        console.log(`Assigned rider ${riderId} to order ${orderId}`);
        resolve(true);
      }, 500);
    });
  };

  // Mock function to update rider status
  const updateRiderStatus = async (riderId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedRiders = riders.map(rider => 
          rider.id === riderId ? { ...rider, status } : rider
        );
        setRiders(updatedRiders);
        setAvailableRiders(updatedRiders.filter(r => r.status === 'available'));
        console.log(`Updated rider ${riderId} status to ${status}`);
        resolve(true);
      }, 500);
    });
  };

  return (
    <DeliveryContext.Provider value={{
      riders,
      availableRiders,
      assignedDeliveries: assignedDeliveries,
      unassignedDeliveries: unassignedDeliveries,
      assignRider,
      updateRiderStatus
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => useContext(DeliveryContext);