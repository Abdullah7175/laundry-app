import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function VendorDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/vendor');
  }, [router]);

  return null;
} 