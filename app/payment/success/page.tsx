'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiService from '@/app/services/apiService';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  // Ensure that router is available and we can get the session_id from the query string
  useEffect(() => {
    if (router.isReady) {
      const { session_id } = router.query;
      if (session_id) {
        setSessionId(session_id as string);  // Set session_id when the router is ready
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
