'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page on load
    router.push('/login');
  }, [router]);

  return null; // Optionally, add a loading spinner or placeholder
};

export default HomePage;
