// 'use client';

// import React, { useEffect, useState } from 'react';
// import apiService from '../services/apiService';

// interface Reservation {
//   property_name: string;
//   start_date: string;
//   end_date: string;
//   total_price: string;
//   number_of_nights: number;
//   guests: number;
// }

// export const PaymentSuccessPage: React.FC = () => {
//   const [reservation, setReservation] = useState<Reservation | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchPaymentDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await apiService.getWithToken(`/api/stripe/payment/success/`);
//         if (!response.ok) {
//           throw new Error(
//             response.status === 404 ? 'Payment details not found' : 'Failed to fetch payment details'
//           );
//         }
//         const data: Reservation = await response.json();
//         setReservation(data);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPaymentDetails();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div>
//         <p>Error: {error}</p>
//         <button onClick={() => window.location.reload()}>Retry</button>
//       </div>
//     );
//   }

//   if (!reservation) {
//     return <div>No reservation found.</div>;
//   }

//   return (
//     <div className="payment-success">
//       <h1>Payment Successful!</h1>
//       <div>
//         <h2>Reservation Details:</h2>
//         <p><strong>Property Name:</strong> {reservation.property_name}</p>
//         <p><strong>Start Date:</strong> {reservation.start_date}</p>
//         <p><strong>End Date:</strong> {reservation.end_date}</p>
//         <p><strong>Total Price:</strong> ${reservation.total_price}</p>
//         <p><strong>Number of Nights:</strong> {reservation.number_of_nights}</p>
//         <p><strong>Guests:</strong> {reservation.guests}</p>
//       </div>
//     </div>
//   );
// };
