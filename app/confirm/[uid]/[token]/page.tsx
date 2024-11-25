'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConfirmEmail({ params }: { params: { uid: string; token: string } }) {
    const router = useRouter();
    const { uid, token } = params;
    const [message, setMessage] = useState('Validating...');

    useEffect(() => {
        if (uid && token) {
            fetch(`/api/auth/${uid}/${token}/`, { method: 'GET' })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Invalid or expired link');
                    }
                })
                .then((data) => setMessage(data.message))
                .catch((error) => setMessage(error.message));
        }
    }, [uid, token]);

    return <div>{message}</div>;
}
