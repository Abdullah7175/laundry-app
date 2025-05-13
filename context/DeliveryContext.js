import { createContext, useContext, useState, useEffect } from 'react';

const DeliveryContext = createContext();

export const DeliveryProvider = ({ children }) => {
  // Mock rider data
  const mockRiders = [
    {
      id: '1',
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      vehicle: 'motorcycle',
      status: 'available',
      avatar: '/images/rider1.jpg'
    },
    {
      id: '2',
      name: 'Mohammed Hassan',
      email: 'mohammed@example.com',
      phone: '+966502345678',
      vehicle: 'bike',
      status: 'available',
      avatar: '/images/rider2.jpg'
    },
    {
      id: '3',
      name: 'Khalid Omar',
      email: 'khalid@example.com',
      phone: '+966503456789',
      vehicle: 'car',
      status: 'busy',
      avatar: '/images/rider3.jpg'
    },
    {
      id: '4',
      name: 'Yousef Ibrahim',
      email: 'yousef@example.com',
      phone: '+966504567890',
      vehicle: 'motorcycle',
      status: 'available',
      avatar: '/images/rider4.jpg'
    },
    {
      id: '5',
      name: 'Fahad Abdullah',
      email: 'fahad@example.com',
      phone: '+966505678901',
      vehicle: 'bike',
      status: 'busy',
      avatar: '/images/rider5.jpg'
    }
  ];

  const [riders, setRiders] = useState(mockRiders);
  const [availableRiders, setAvailableRiders] = useState([]);
  const [busyRiders, setBusyRiders] = useState([]);
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [unassignedDeliveries, setUnassignedDeliveries] = useState([]);
  
  // Initialize with mock data
  useEffect(() => {
    updateRiderLists();
  }, []);

  const updateRiderLists = () => {
    setAvailableRiders(riders.filter(rider => rider.status === 'available'));
    setBusyRiders(riders.filter(rider => rider.status === 'busy'));
  };

  // Get all riders
  const getRiders = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        updateRiderLists();
        resolve(riders);
      }, 500);
    });
  };

  // Add new rider
  const addRider = async (riderData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRider = {
          id: (riders.length + 1).toString(),
          ...riderData,
          avatar: '/images/default-rider.png'
        };
        const updatedRiders = [...riders, newRider];
        setRiders(updatedRiders);
        updateRiderLists();
        resolve(newRider);
      }, 500);
    });
  };

  // Assign rider to delivery
  const assignRider = async (orderId, riderId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update the rider status to busy
        const updatedRiders = riders.map(rider => 
          rider.id === riderId ? { ...rider, status: 'busy' } : rider
        );
        setRiders(updatedRiders);
        updateRiderLists();
        console.log(`Assigned rider ${riderId} to order ${orderId}`);
        resolve(true);
      }, 500);
    });
  };

  // Update rider status
  const updateRiderStatus = async (riderId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedRiders = riders.map(rider => 
          rider.id === riderId ? { ...rider, status } : rider
        );
        setRiders(updatedRiders);
        updateRiderLists();
        console.log(`Updated rider ${riderId} status to ${status}`);
        resolve(true);
      }, 500);
    });
  };

  return (
    <DeliveryContext.Provider value={{
      riders,
      availableRiders,
      busyRiders,
      assignedDeliveries,
      unassignedDeliveries,
      getRiders,
      assignRider,
      addRider,
      updateRiderStatus
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => useContext(DeliveryContext);