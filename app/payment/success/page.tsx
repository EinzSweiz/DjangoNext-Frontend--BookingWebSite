import apiService from '@/app/services/apiService';
import Image from 'next/image';
interface PaymentSuccessPageProps {
  paymentData: any;
}

type Params = Promise<{ session_id: string }>;

const PaymentSuccessPage = async ({ searchParams }: { searchParams: Params }) => {
  const { session_id } = await searchParams; // Extract session_id from query parameters

  if (!session_id) {
    throw new Error('Session ID is missing');
  }

  // Fetch payment data using the session_id
  let paymentData = null;
  try {
    const response = await apiService.getWithToken(`/api/stripe/payment/success/?session_id=${session_id}`);
    console.log('Response:', response);
    paymentData = response;  // Payment data is directly obtained from the response
  } catch (error) {
    console.error('Error fetching payment data:', error);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans dark:bg-gray-900 dark:text-white">
      <h1 className="text-center text-3xl font-bold text-green-500 dark:text-green-400">
        Payment Successful
      </h1>
      <p className="text-center text-lg mt-2">Session ID: {session_id}</p>
      {paymentData ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-4 dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold">Reservation Details</h2>
          <div className="mt-4 space-y-4">
            <p><strong>Start Date:</strong> {paymentData.reservation.start_date}</p>
            <p><strong>End Date:</strong> {paymentData.reservation.end_date}</p>
            <p><strong>Total Price:</strong> ${paymentData.reservation.total_price}</p>
            <p><strong>Number of Nights:</strong> {paymentData.reservation.number_of_nights}</p>
            <p><strong>Guests:</strong> {paymentData.reservation.guests}</p>
            <h3 className="mt-6 text-lg font-semibold">Property Information</h3>
            <p><strong>Name:</strong> {paymentData.reservation.property.name}</p>
            <p><strong>Address:</strong> {paymentData.reservation.property.address}</p>
            <Image 
              src={paymentData.reservation.property.image_url} 
              alt={paymentData.reservation.property.name} 
              width={600}  // You can adjust the width and height
              height={400}  // to fit your needs
              className="w-full h-auto rounded-lg mt-2"
            />
            <h3 className="mt-6 text-lg font-semibold">Customer Information</h3>
            <p><strong>Name:</strong> {paymentData.customer.name}</p>
            <p><strong>Email:</strong> {paymentData.customer.email}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-center text-lg">Loading payment information...</p>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
