'use client';  // Ensures this component is treated as client-side only

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiService from '@/app/services/apiService';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [paymentData, setPaymentData] = useState<any>(null);  // Optional: Store payment data from the API

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
      // Make the API call to the backend once sessionId is available
      apiService.getWithToken(`/payment/success?session_id=${sessionId}`)
        .then(data => {
          setPaymentData(data);  // Store response data in state
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
      
      {/* Optional: Show payment details once they are fetched */}
      {paymentData && (
        <div>
          <p>Payment details:</p>
          <pre>{JSON.stringify(paymentData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
