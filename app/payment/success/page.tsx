// app/payment/success/page.tsx

import apiService from '@/app/services/apiService';

interface PaymentSuccessPageProps {
  sessionId: string;
  paymentData: any;
}

const PaymentSuccessPage = async ({ searchParams }: { searchParams: { session_id: string } }) => {
  const { session_id } = searchParams;  // Extract session_id from query parameters

  if (!session_id) {
    throw new Error('Session ID is missing');
  }

  // Fetch payment data using the session_id
  let paymentData = null;
  try {
    const response = await apiService.getWithToken(`/payment/success?session_id=${session_id}`);
    paymentData = await response.json();
  } catch (error) {
    console.error('Error fetching payment data:', error);
  }

  return (
    <div>
      <h1>Payment Success</h1>
      <p>Session ID: {session_id}</p>
      {paymentData ? (
        <div>
          <p>Payment details:</p>
          <pre>{JSON.stringify(paymentData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading payment information...</p>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
