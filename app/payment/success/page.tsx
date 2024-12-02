'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import apiService from '@/app/services/apiService';

interface Reservation {
  property_name: string;
  start_date: string;
  end_date: string;
  total_price: string;
  number_of_nights: number;
  guests: number;
}

const PaymentSuccessPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (!sessionId) {
        setError('Missing session_id');
        return;
      }

      try {
        setLoading(true);
        const response = await apiService.getWithToken(`/api/stripe/payment/success/?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment success details');
        }
        const data: Reservation = await response.json();
        setReservation(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [sessionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!reservation) return <div>No reservation details found.</div>;

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

// Wrapper for Suspense with fallback
const PaymentSuccessPage: React.FC = () => (
  <Suspense fallback={<div>Loading payment details...</div>}>
    <PaymentSuccessPageContent />
  </Suspense>
);

export default PaymentSuccessPage;
