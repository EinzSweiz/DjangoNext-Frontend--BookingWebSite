'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const EmailConfirmation = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');
  console.log(uid)
  console.log(token)

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!uid || !token) {
      setMessage('Missing UID or token.');
      setIsLoading(false);
      return;
    }

    // Send the UID and token to the backend to confirm the email
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/${uid}/${token}/`)
      .then(response => {
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Attempt to parse the response as JSON
      })
      .then(data => {
        if (data) {
          setMessage('Thank you for verifying your email address!');
        } else {
          setMessage('There was an issue with verifying your email. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error confirming email:', error);
        setMessage('An error occurred. Please try again later.');
      })
      .finally(() => setIsLoading(false)); // Set loading state to false after the request completes

  }, [uid, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white dark:bg-gray-800">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg dark:bg-gray-700">
        {isLoading ? (
          <div>
            <h2 className="text-xl">Please wait while we confirm your email...</h2>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4">Email Confirmation</h1>
            <p className="text-xl text-green-400">{message}</p>
            <p className="mt-4">Thank you for using our service!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;
