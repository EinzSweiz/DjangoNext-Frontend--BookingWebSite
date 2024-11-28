// LeftModal.tsx
import React, { useCallback, useEffect, useState } from "react";

interface ModalProps {
    label: string;
    content: React.ReactElement;
    isOpen: boolean;
    close: () => void;
}

const LeftModal: React.FC<ModalProps> = ({ isOpen, close, label, content }) => {
    const [showModel, setShowModel] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShowModel(true);
        } else {
            setTimeout(() => setShowModel(false), 300); // Delay hiding modal for a smooth transition
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        close();
        setShowModel(false); // Update local state on close
    }, [close]);

    if (!showModel && !isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-start z-50">
            <div
                className="bg-white w-80 h-screen p-4 transform transition-transform duration-300 ease-in-out z-50"
                style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
            >
                <div className="relative">
                    <h2 className="text-lg font-bold">{label}</h2>
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    >
                        X
                    </button>
                </div>
                {content}
            </div>
        </div>
    );
};

export default LeftModal;
