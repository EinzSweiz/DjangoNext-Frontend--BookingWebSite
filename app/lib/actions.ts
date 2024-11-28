'use server';

import { error } from 'console';
import { cookies } from 'next/headers';
import { json } from 'stream/consumers';

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
                    secure: false,
                    maxAge: 60 * 60,
                    path: '/',
                });
                return json.access; // Return the token
            } else {
                resetAuthCookies();
                return undefined; // Explicitly return undefined if no access token
            }
        })
        .catch((error) => {
            console.log('error:', error);
            resetAuthCookies();
            return undefined; // Return undefined in case of an error
        });

    return token;
}


export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    const cookieStore = await cookies(); // Await cookies() call


    cookieStore.set('session_userid', userId, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24, // One day (24 hours)
        path: '/',
    });
    
    cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60, // 60 minutes (1 hour)
        path: '/',
    });
    
    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24, // One day (24 hours)
        path: '/',
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

export async function getAccessToken() {
    const cookieStore = await cookies()
    let tokenAccess = cookieStore.get('session_access_token')?.value
    
    if (!tokenAccess) {
        tokenAccess = await handleRefresh()
    }
    return tokenAccess
}

export async function getRefreshToken() {
        const cookieStore = await cookies()
        let tokenRefresh = cookieStore.get('session_refresh_token')?.value
        return tokenRefresh
}
