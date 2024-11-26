import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';



type Params = Promise<{
    uid: string;
    token: string;
}>;

 const ConfirmEmail = async ({ params }: { params: Params }) => {
    const resolvedParams = await params
    const router = useRouter();
    const { uid, token } = resolvedParams;
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
