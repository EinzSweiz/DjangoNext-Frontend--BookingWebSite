"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import AddPropertyModal from "../modals/AddPropertyModal";
import usePropertyModal from "@/app/hooks/usePropertyModal";
import { useState } from "react";

interface AddPropertyButtonProps {
    userid?: string | null;
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({ userid }) => {
    const addPropertyModal = usePropertyModal();
    const loginModal = useLoginModal();
    const [isHovered, setIsHovered] = useState(false);

    const airbnbYouHome = () => {
        if (userid) {
            addPropertyModal.open();
        } else {
            loginModal.open();
        }
    };

    const handleHoverStart = () => {
        setIsHovered(true);
    };

    const handleHoverEnd = () => {
        setIsHovered(false);
    };

    return (
        <div
            onClick={airbnbYouHome}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            onTouchStart={handleHoverStart}
            onTouchEnd={handleHoverEnd}
            className={`cursor-pointer p-4 transition-all duration-300 ease-in-out ${
                isHovered
                    ? "text-green-500"  // Only the text (and icon) will change color to green
                    : "text-black"       // Default text color
            }`}
        >   
            <span className="hidden sm:inline">Add your own properties!</span>
            <div className="flex justify-center items-center mt-1">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className={`w-6 h-6 transition-transform duration-200 ${
                        isHovered ? "scale-125 text-green-500" : "scale-100 text-black"
                    }`} // Icon color and scale will also change
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                </svg>
            </div>
        </div>
    );
};

export default AddPropertyButton;
