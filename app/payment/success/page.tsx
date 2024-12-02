'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiService from '@/app/services/apiService';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isMounted, setIsMounted] = useState<boolean>(false);  // Flag to check if the component is mounted

  // Ensure that useRouter and the rest of the logic is only executed on the client side
  useEffect(() => {
    setIsMounted(true);  // Set the flag to true once the component is mounted on the client
  }, []);

  useEffect(() => {
    if (!isMounted) return;  // Avoid executing any router logic before the component is mounted

    if (router.isReady) {
      const { session_id } = router.query;
      if (session_id) {
        setSessionId(session_id as string);  // Set session_id when the router is ready
      }
    }
  }, [isMounted, router.isReady, router.query]);

  useEffect(() => {
    if (sessionId) {
      // Make the API call to the backend
      apiService.getWithToken(`/payment/success/?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          console.log('Payment success data:', data);
        })
        .catch(error => {
          console.error('Error calling payment success API:', error);
        });
    }
  }, [sessionId]);

  if (!isMounted) return null;  // Return null until the component is mounted on the client side

  return (
    <div>
      <h1>Payment Success</h1>
      {sessionId ? (
        <p>Session ID: {sessionId}</p>
      ) : (
        <p>Loading payment information...</p>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
