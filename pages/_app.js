import { useState, useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { OrderProvider } from '../context/OrderContext';
import { LanguageProvider } from '../context/LanguageContext';
import { NotificationProvider } from '../context/NotificationContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <AuthProvider>
      <OrderProvider>
        <LanguageProvider>
          <NotificationProvider>
            {isClient && <Component {...pageProps} />}
          </NotificationProvider>
        </LanguageProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default MyApp;