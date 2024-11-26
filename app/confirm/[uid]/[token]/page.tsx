// app/confirm/[uid]/[token]/page.tsx

type Params = Promise<{ uid: string; token: string }>;

const ConfirmEmailPage = async ({ params }: { params: Params }) => {
    const resolvedParams = await params; // Resolve the params promise
    const { uid, token } = resolvedParams;

    // Validate UID and Token on the server side
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate/${uid}/${token}`, {
        method: 'GET',
    });

    if (!response.ok) {
        // If invalid or expired, show an error message
        const errorData = await response.json();
        return (
            <main className="max-w-[1500px] mx-auto px-6 py-12">
                <p className="text-red-500">{errorData.message || 'Invalid or expired link.'}</p>
            </main>
        );
    }

    // If valid, fetch additional data if needed
    const data = await response.json();

    // Pass validated params and additional data to the client component
    return ;
};

export default ConfirmEmailPage;
