import { createContext, useState, useContext, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'Customer User',
    email: 'customer@example.com',
    phone: '+966 50 123 4567',
    type: 'customer',
    address: '123 Main St, Riyadh',
    city: 'Riyadh'
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+966 50 987 6543',
    type: 'admin'
  },
  {
    id: 3,
    name: 'Vendor User',
    email: 'vendor@example.com',
    phone: '+966 50 456 7890',
    type: 'vendor'
  },
  {
    id: 4,
    name: 'Delivery User',
    email: 'delivery@example.com',
    phone: '+966 50 789 0123',
    type: 'delivery'
  },
  {
    id: 5,
    name: 'Laundry User',
    email: 'laundry@example.com',
    phone: '+966 50 321 6547',
    type: 'laundry'
  }
];

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if there's a user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (email, password, userType) => {
    // In a real app, you would make an API call here
    try {
      // For demo purposes, simulate successful login for specific demo credentials
      if (
        (userType === 'customer' && email === 'customer@example.com' && password === 'customer123') ||
        (userType === 'admin' && email === 'admin@example.com' && password === 'admin123') ||
        (userType === 'vendor' && email === 'vendor@example.com' && password === 'vendor123') ||
        (userType === 'delivery' && email === 'delivery@example.com' && password === 'delivery123') ||
        (userType === 'laundry' && email === 'laundry@example.com' && password === 'laundry123')
      ) {
        // Find the user from our mock data
        const foundUser = mockUsers.find(u => u.email === email && u.type === userType);
        
        // Set the user in state and localStorage
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login');
    }
  };
  
  // Register function
  const register = async (name, email, phone, password, userType) => {
    // In a real app, you would make an API call here
    try {
      // For demo purposes, simulate successful registration
      const newUser = {
        id: mockUsers.length + 1,
        name,
        email,
        phone,
        type: userType
      };
      
      // Set the user in state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Add to mock users (this won't persist across page refreshes)
      mockUsers.push(newUser);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register');
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  // Update user function
  const updateUser = async (id, userData) => {
    try {
      // In a real app, you would make an API call here
      // For demo purposes, update the user in our context
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error('Failed to update user');
    }
  };
  
  // Get all users function (for admin panel)
  const getAllUsers = async () => {
    // In a real app, you would make an API call here
    // For demo purposes, return our mock users
    return mockUsers;
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateUser,
      getAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}