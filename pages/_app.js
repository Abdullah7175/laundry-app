import { useState, useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { OrderProvider } from '../context/OrderContext';
import { LanguageProvider } from '../context/LanguageContext';
import { NotificationProvider } from '../context/NotificationContext';
import '../styles/globals.css';
import { DeliveryProvider } from '../context/DeliveryContext';

// // Wrap your app or layout with the provider
// function MyApp({ Component, pageProps }) {
//   return (
//     <AuthProvider>
//       <OrderProvider>
//         <DeliveryProvider>
//           <Component {...pageProps} />
//         </DeliveryProvider>
//       </OrderProvider>
//     </AuthProvider>
//   );
// }

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <AuthProvider>
      <OrderProvider>
      <DeliveryProvider>
        <LanguageProvider>
          <NotificationProvider>
            {isClient && <Component {...pageProps} />}
          </NotificationProvider>
        </LanguageProvider>
        </DeliveryProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default MyApp;