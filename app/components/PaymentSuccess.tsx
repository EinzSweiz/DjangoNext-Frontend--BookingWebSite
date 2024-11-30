'use client';

import { useEffect, useState } from 'react';
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
  reservationId: string; // Prop passed from the page
}

export const PaymentSuccessPage = ({ reservationId }: PaymentSuccessPageProps) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (!reservationId) {
        setError('Reservation ID is missing');
        return;
      }

      console.log(`Fetching reservation details for reservation ID: ${reservationId}`);
      try {
        setLoading(true);
        // Pass the reservationId to the backend to fetch reservation details
        const response = await apiService.getWithToken(`/api/payment/success/${reservationId}/`);
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

    if (reservationId) {
      fetchReservationDetails();
    } else {
      setError('Reservation ID is missing');
    }
  }, [reservationId]);

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

export default PaymentSuccessPage;
