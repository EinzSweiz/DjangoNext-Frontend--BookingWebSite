'use client'
import Image from "next/image";

interface FullImageModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

const FullImageModal: React.FC<FullImageModalProps> = ({ isOpen, imageUrl, onClose }) => {
    if (!isOpen || !imageUrl) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div className="relative bg-white p-6 rounded-lg max-w-full max-h-full">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-700 text-xl"
                >
                    &times;
                </button>
                <Image
                    src={imageUrl}
                    alt="Full Image"
                    width={800}
                    height={800}
                    className="object-contain"
                />
            </div>
        </div>
    );
};

export default FullImageModal;
