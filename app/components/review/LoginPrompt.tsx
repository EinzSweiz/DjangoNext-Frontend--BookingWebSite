'use client';

import useLoginModal from "@/app/hooks/useLoginModal";

const LoginPrompt = () => {
    const loginModal = useLoginModal();

    return (
        <div className="bg-black text-white p-4 rounded-lg text-center">
            <a
                onClick={() => loginModal.open()}
                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 cursor-pointer"
            >
                Log in to write a review.
            </a>
        </div>
    );
};

export default LoginPrompt;
