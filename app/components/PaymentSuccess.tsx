'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Use next/router to capture query params
import apiService from '../services/apiService';

interface Reservation {
  property_name: string;
  start_date: string;
  end_date: string;
  total_price: string;
  number_of_nights: number;
  guests: number;
}
interface PaymentSuccessPageProps {
  reservationId: string;
}

export const PaymentSuccessPage = ({ reservationId }: PaymentSuccessPageProps) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const router = useRouter();
  const { session_id } = router.query;  // Capture session_id from URL query params
  
  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (!session_id) {
        setError('Session ID is missing');
        return;
      }
      
      console.log(`Fetching reservation details for session ID: ${session_id}`);
      try {
        setLoading(true);
        // Pass the session_id to the backend to fetch reservation details
        const response = await apiService.getWithToken(`/api/payment/success/${session_id}/`);
        console.log("API Response Status:", response.status);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Reservation not found');
          } else {
            throw new Error('Failed to fetch payment success details');
          }
        }

        const data: Reservation = await response.json();
        console.log("Fetched Reservation Data:", data);
        setReservation(data);
      } catch (error: any) {
        console.error("Error fetching reservation details:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (session_id) {
      fetchReservationDetails();
    } else {
      setError('Session ID is missing');
    }
  }, [session_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
    </div>
  );
};


export default PaymentSuccessPage