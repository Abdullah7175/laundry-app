import { createContext, useContext, useState, useCallback } from 'react';

// Create the notification context
const NotificationContext = createContext();

// Types of notifications
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Default timeout
const DEFAULT_TIMEOUT = 5000; // 5 seconds

// NotificationProvider component
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  
  // Add a notification
  const addNotification = useCallback((message, type = NOTIFICATION_TYPES.INFO, timeout = DEFAULT_TIMEOUT) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    
    const newNotification = {
      id,
      message,
      type,
      timeout,
    };
    
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    
    // Auto-remove notification after timeout
    if (timeout !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }
    
    return id;
  }, []);
  
  // Success notification helper
  const showSuccess = useCallback((message, timeout = DEFAULT_TIMEOUT) => {
    return addNotification(message, NOTIFICATION_TYPES.SUCCESS, timeout);
  }, [addNotification]);
  
  // Error notification helper
  const showError = useCallback((message, timeout = DEFAULT_TIMEOUT) => {
    return addNotification(message, NOTIFICATION_TYPES.ERROR, timeout);
  }, [addNotification]);
  
  // Warning notification helper
  const showWarning = useCallback((message, timeout = DEFAULT_TIMEOUT) => {
    return addNotification(message, NOTIFICATION_TYPES.WARNING, timeout);
  }, [addNotification]);
  
  // Info notification helper
  const showInfo = useCallback((message, timeout = DEFAULT_TIMEOUT) => {
    return addNotification(message, NOTIFICATION_TYPES.INFO, timeout);
  }, [addNotification]);
  
  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);
  
  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Value object to be provided to consumers
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    types: NOTIFICATION_TYPES,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook for using the notification context
export function useNotification() {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
}

export default NotificationContext;