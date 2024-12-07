'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { cookies } from "next/headers"; // Use next/headers for managing cookies
import { GOOGLE_ACCESS_TOKEN } from "@/app/token"; // If you have the constant in the correct place

function RedirectGoogleAuth() {
    const router = useRouter();

    useEffect(() => {
        const handleLogin = async () => {
            console.log("RedirectHandler mounted successfully");

            // Extract the access token from the URL
            const queryParams = new URLSearchParams(window.location.search);
            const accessToken = queryParams.get('access_token');
            console.log("QueryParams: ", window.location.search);

            if (accessToken) {
                console.log("AccessToken found: ", accessToken);
                
                // Store the access token in a secure, HttpOnly cookie
                const cookieStore = await cookies();  // Ensure cookies() is awaited
                cookieStore.set('google_access_token', accessToken, {
                    httpOnly: true,
                    secure: true,  // Set to true in production with HTTPS
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                    sameSite: 'lax',
                });

                // Send the access token to the backend to validate it and get user ID
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                try {
                    const response = await axios.post('http://localhost:8000/api/validate-google-token/', {
                        access_token: accessToken, // Send access token in the request body
                    });

                    const { user_id } = response.data;
                    if (user_id) {
                        // Store user_id in an HTTP-only cookie
                        cookieStore.set('session_userid', user_id, {
                            httpOnly: true,
                            secure: true,  // Set to true in production with HTTPS
                            maxAge: 60 * 60 * 24,  // One day
                            path: '/',
                            sameSite: 'lax',
                        });

                        // Redirect to the homepage or dashboard after login
                        router.push('/');
                    }
                } catch (error: any) {
                    console.error('Error verifying token:', error.response ? error.response.data : error.message);
                    router.push('/login');  // If there's an error, redirect to login page
                }
            } else {
                console.log('No token found in URL');
                router.push('/login');  // If no token, redirect to login
            }
        };

        // Invoke the handleLogin function
        handleLogin();

    }, [router]);

    return <div>Logging In.........</div>;
}

export default RedirectGoogleAuth;
