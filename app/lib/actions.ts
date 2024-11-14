'use server';

import { cookies } from 'next/headers';

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    const cookieStore = await cookies(); // Await cookies() call

    cookieStore.set('session_userid', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });

    cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        maxAge: 60 * 60, // 60 minutes
        path: '/',
    });

    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });
}
export async function resetAuthCookies() {
    const cookieStore = await cookies(); // Await cookies() call
    cookieStore.set('session_userid', '', { maxAge: 0 }); // Expire the cookie immediately
    cookieStore.set('session_access_token', '', { maxAge: 0 });
    cookieStore.set('session_refresh_token', '', { maxAge: 0 });
}

export async function getUserId() {
    const cookieStore = await cookies(); // Await cookies() call
    const userId = cookieStore.get('session_userid')?.value; // Access the cookie value

    return userId ? userId : null;
}
