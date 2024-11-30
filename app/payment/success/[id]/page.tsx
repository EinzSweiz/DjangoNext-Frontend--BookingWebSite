'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Define the types for your reservation data
interface Reservation {
  property_name: string;
  start_date: string;
  end_date: string;
  total_price: string;
  number_of_nights: number;
  guests: number;
}

const PaymentSuccessPage = () => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;  // Get reservation id from the URL query

  useEffect(() => {
    // Fetch reservation details from your backend API using the reservation id
    if (id) {
      const fetchReservationDetails = async () => {
        try {
          const response = await fetch(`/api/payment/success/${id}/`);
          if (!response.ok) {
            throw new Error('Failed to fetch payment success details');
          }
          const data = await response.json();
          setReservation(data);  // Store the fetched data
        } catch (error: any) {
          setError(error.message);  // Set error if request fails
        }
      };

      fetchReservationDetails();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!reservation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="payment-success">
      <h1>Payment Successful!</h1>
      <div>
        <h2>Reservation Details:</h2>
        <p><strong>Property Name:</strong> {reservation.property_name}</p>
        <p><strong>Start Date:</strong> {reservation.start_date}</p>
        <p><strong>End Date:</strong> {reservation.end_date}</p>
        <p><strong>Total Price:</strong> ${reservation.total_price}</p>
        <p><strong>Number of Nights:</strong> {reservation.number_of_nights}</p>
        <p><strong>Guests:</strong> {reservation.guests}</p>
      </div>
      <div>
        <button onClick={() => router.push('/myreservations')}>View All Reservations</button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
