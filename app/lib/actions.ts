'use server';

import { error } from 'console';
import { tr } from 'date-fns/locale';
import { cookies } from 'next/headers';
import { json } from 'stream/consumers';
import jwt, {JwtPayload} from 'jsonwebtoken';

export async function handleRefresh(): Promise<string | undefined> {
    console.log('handleRefresh');
    const CookiesStore = await cookies();

    const refreshToken = await getRefreshToken();

    const token = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
        method: 'POST',
        body: JSON.stringify({
            refresh: refreshToken,
        }),
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((json) => {
            console.log('Response-Refresh', json);
            if (json.access) {
                CookiesStore.set('session_access_token', json.access, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 60 * 60 * 72,
                    path: '/',
                    sameSite: 'lax'
                });
                return json.access; // Return the token
            } else {
                resetAuthCookies();
                return null;
            }
        })
        .catch((error) => {
            console.log('error:', error);
            resetAuthCookies();
            return null;
        });

    return token;
}

export async function isTokenExpired(token: string): Promise<boolean> {
    try {
        // Decode the token
        const decoded = jwt.decode(token) as JwtPayload | null; // Cast to JwtPayload or null
        const now = Math.floor(Date.now() / 1000);
        
        // Ensure that the decoded token exists and has the 'exp' field
        return decoded ? decoded.exp ? decoded.exp < now : false : false;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;  // Ensure that the function returns a boolean
    }
}
export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    const cookieStore = await cookies(); // Await cookies() call
    cookieStore.set('session_userid', userId, {
        httpOnly: true,
        secure: true, // Make sure to set to true in production with HTTPS
        maxAge: 60 * 60 * 24, // One day (24 hours)
        path: '/',
        sameSite: 'lax',  // Or 'Strict' or 'None' depending on your needs
    });
    
    cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: true, // Make sure to set to true in production with HTTPS
        maxAge: 60 * 60, // 60 minutes (1 hour)
        path: '/',
        sameSite: 'lax',  // Or 'Strict' or 'None' depending on your needs
    });
    
    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: true, // Make sure to set to true in production with HTTPS
        maxAge: 60 * 60 * 24, // One day (24 hours)
        path: '/',
        sameSite: 'lax',  // Or 'Strict' or 'None' depending on your needs
    });
    
}
export async function resetAuthCookies() {
    const cookieStore = await cookies(); // Await cookies() call

    // Expire the cookies immediately by setting maxAge to 0
    cookieStore.set('session_userid', '', { maxAge: 0, path: '/' });
    cookieStore.set('session_access_token', '', { maxAge: 0, path: '/' });
    cookieStore.set('session_refresh_token', '', { maxAge: 0, path: '/' });
}


export async function getUserId() {
    const cookieStore = await cookies(); // Await cookies() call
    const userId = cookieStore.get('session_userid')?.value; // Access the cookie value
    return userId ? userId : null;
}

export async function getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    let tokenAccess = cookieStore.get('session_access_token')?.value;

    if (!tokenAccess) {
        tokenAccess = await handleRefresh(); // If no token, refresh it
    }

    // If token exists, check if it's expired
    if (tokenAccess && await isTokenExpired(tokenAccess)) {
        console.log('Access token expired, refreshing...');
        tokenAccess = await handleRefresh();  // Refresh the token if expired
    }

    return tokenAccess; // Return the access token (new or refreshed)
}

export async function getRefreshToken() {
        const cookieStore = await cookies()
        let tokenRefresh = cookieStore.get('session_refresh_token')?.value
        return tokenRefresh
}
