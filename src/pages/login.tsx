import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LoginScreen, UserProfile } from '@/components/screens/LoginScreen';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (user: UserProfile) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('geofind_user', JSON.stringify(user));
    }
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Security Authentication — GeoFind AI Tamil Nadu Satellite Command</title>
        <meta name="description" content="Official Officer Authentication Terminal for Tamil Nadu Satellite Land-Use & Change Detection Intelligence Platform." />
      </Head>
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => router.push('/')}
        isAuthenticated={false}
      />
    </>
  );
}
