import { handleLogin } from "@/app/lib/actions"; // Assuming this is your login handler

const handleCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const userId = urlParams.get('user_id');

    if (accessToken && refreshToken && userId) {
        // Store the access token, refresh token, and user ID securely (e.g., in cookies or localStorage)
        handleLogin(userId, accessToken, refreshToken); // Call your login handler with the necessary data
        
        // Redirect the user to their dashboard or home page
        window.location.href = '/dashboard'; // or wherever you'd like to send them after login
    } else {
        // Handle the error if no access token, refresh token, or user ID is returned
        console.error('Error: Missing access token, refresh token, or user ID');
    }
};