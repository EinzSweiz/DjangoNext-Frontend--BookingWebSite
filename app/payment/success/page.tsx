import { GetServerSideProps } from 'next';
import apiService from '@/app/services/apiService';

interface PaymentSuccessProps {
  sessionId: string | null;
  paymentData: any | null;
}

const PaymentSuccessPage = ({ sessionId, paymentData }: PaymentSuccessProps) => {
  return (
    <div>
      <h1>Payment Success</h1>
      {sessionId ? (
        <p>Session ID: {sessionId}</p>
      ) : (
        <p>Loading payment information...</p>
      )}

      {paymentData && (
        <div>
          <p>Payment details:</p>
          <pre>{JSON.stringify(paymentData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// This function will run on the server side to fetch the session_id and payment data
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { session_id } = context.query;  // Extract session_id from query params

  if (!session_id) {
    return { notFound: true };  // Return 404 if no session_id is found
  }

  try {
    // Fetch payment data using the session_id
    const paymentData = await apiService.getWithToken(`/payment/success?session_id=${session_id}`);

    // Return the session_id and payment data as props to the page
    return {
      props: {
        sessionId: session_id as string,
        paymentData,  // Pass fetched data to the page
      },
    };
  } catch (error) {
    console.error('Error fetching payment data:', error);
    return { notFound: true };  // Return 404 if API call fails
  }
};

export default PaymentSuccessPage;
