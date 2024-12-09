'use client';
import { useEffect } from 'react';
import { handleLogin } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

const LoginCallbackPage = () => {
    const router = useRouter()
    useEffect(() => {
        // Handle the callback logic on page load
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const userId = urlParams.get('user_id');

        if (accessToken && refreshToken && userId) {
            // Store the access token, refresh token, and user ID securely (e.g., in cookies or localStorage)
            handleLogin(userId, accessToken, refreshToken); // Call your login handler with the necessary data

            // Redirect the user to their home page
            router.push('/')
        } else {
            // Handle the error if no access token, refresh token, or user ID is returned
            console.error('Error: Missing access token, refresh token, or user ID');
        }
    }, []); // Run once when the component mounts

    return (
        <div>
            <p>Logging in...</p>
        </div>
    );
};

export default LoginCallbackPage;
