'use client'
import { useEffect } from 'react';
import apiService from '@/app/services/apiService';
import { useRouter } from 'next/router';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    if (session_id) {
      // Make a call to the backend to handle the payment success
      apiService.getWithToken(`/payment/success/?session_id=${session_id}`)
        .then(response => response.json())
        .then(data => {
          console.log('Payment success data:', data);
          // Handle the response (e.g., show confirmation, etc.)
        })
        .catch(error => {
          console.error('Error calling payment success API:', error);
        });
    }
  }, [session_id]);

  return (
    <div>
      <h1>Payment Success</h1>
      {session_id ? (
        <p>Session ID: {session_id}</p>
      ) : (
        <p>Loading payment information...</p>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
