'use client';  // Ensures this component is treated as client-side only

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiService from '@/app/services/apiService';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  // Use useEffect to trigger logic only when the router is ready
  useEffect(() => {
    if (router.isReady) {
      const { session_id } = router.query;
      if (session_id) {
        setSessionId(session_id as string);  // Set session_id directly from the URL
      }
    }
  }, [router.isReady, router.query]);

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
