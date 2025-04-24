import { useState, useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { OrderProvider } from '../context/OrderContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <AuthProvider>
      <OrderProvider>
        {isClient && <Component {...pageProps} />}
      </OrderProvider>
    </AuthProvider>
  );
}

export default MyApp;