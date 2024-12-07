'use client'
import { useEffect, useState } from 'react';
import { handleLogin } from '@/app/lib/actions'; // Assuming this function stores tokens
import { useRouter } from 'next/navigation';

type Params = Promise<{ access_token: string, refresh_token: string, id: string }>;

const GoogleCallback = async ({ params }: { params: Params }) => {
  // Resolve params
  const resolvedParams = await params;
  const { access_token, refresh_token, id } = resolvedParams;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Define an async function to handle the login
  const login = async () => {
    try {
      // Handle the login logic
      await handleLogin(id, access_token, refresh_token);

      // Redirect to the dashboard after successful login
      router.push('/');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger login on component mount with useEffect
  useEffect(() => {
    login(); // Call async function here
  }, [access_token, refresh_token, id, router]); // Dependencies

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null; // You could also return a success message or redirect component
};

export default GoogleCallback;
