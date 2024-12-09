'use client';

import React from 'react';
import Link from 'next/link';

const PaymentCancelPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-semibold text-red-600">Payment Cancelled</h1>
        <p className="mt-4 text-lg text-gray-600">
          We are sorry, but the payment process has been cancelled.
        </p>
        <p className="mt-2 text-gray-500">
          If you wish to try again, please go back to the previous page.
        </p>
        <Link href="/" passHref>
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
            Go Back to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
