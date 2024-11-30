'use client';
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
  const [loading, setLoading] = useState<boolean>(true); // Manage loading state
  const router = useRouter();
  const { id } = router.query; // Get reservation id from the URL query

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/payment/success/${id}/`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Reservation not found');
          } else {
            throw new Error('Failed to fetch payment success details');
          }
        }
        const data: Reservation = await response.json();
        setReservation(data); // Store the fetched data
      } catch (error: any) {
        setError(error.message); // Set error if request fails
      } finally {
        setLoading(false); // Ensure loading stops after fetch
      }
    };

    if (id) {
      fetchReservationDetails();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner if needed
  }

  if (error) {
    return <div className="error">Error: {error}</div>; // Style your error message
  }

  if (!reservation) {
    return <div>No reservation found.</div>;
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
        <button onClick={() => router.push('/myreservations')} className="view-reservations">
          View All Reservations
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
