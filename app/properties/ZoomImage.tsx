'use client';

import { useState } from "react";
import Image from "next/image";

const ImageZoom = ({ images }: { images: string[] }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1); // Initial zoom level
    const [currentIndex, setCurrentIndex] = useState(0); // Index of the current image

    // Open modal
    const handleImageClick = () => {
        setModalOpen(true);
    };

    // Close modal and reset zoom level
    const handleCloseModal = () => {
        setModalOpen(false);
        setZoomLevel(1); // Reset zoom level
    };

    // Handle navigation
    const handleNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Go to next image, loop back to start
    };

    const handlePreviousImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Go to previous image, loop to end
    };

    // Handle zoom controls
    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom + 0.2, 3)); // Max zoom level is 3x
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.max(prevZoom - 0.2, 0.6)); // Min zoom level is 0.6x
    };

    return (
        <>
            {/* Image Container */}
            <div
                className="relative w-full mb-4 rounded-xl cursor-pointer"
                style={{ aspectRatio: "16 / 9", overflow: "hidden" }}
                onClick={handleImageClick}
            >
                <Image
                    src={images[currentIndex]}
                    fill
                    className="absolute top-0 left-0 rounded-xl"
                    style={{
                        objectFit: "contain",
                        objectPosition: "center",
                        transform: "scale(1.1)", // Slight zoom for initial view
                    }}
                    alt={`Property image ${currentIndex + 1}`}
                />
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePreviousImage();
                            }}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full text-xl md:left-8"
                        >
                            &lt;
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNextImage();
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full text-xl md:right-8"
                        >
                            &gt;
                        </button>
                    </>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCloseModal();
                        }
                    }}
                >
                    <div
                        className="relative w-11/12 max-w-4xl h-5/6"
                        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on the image
                    >
                        <Image
                            src={images[currentIndex]}
                            fill
                            className="absolute top-0 left-0 rounded-xl"
                            style={{
                                objectFit: "contain",
                                objectPosition: "center",
                                transform: `scale(${zoomLevel})`, // Dynamic zoom level
                            }}
                            alt={`Full-screen view ${currentIndex + 1}`}
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreviousImage();
                                }}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full md:left-8"
                            >
                                &lt;
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextImage();
                                }}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full md:right-8"
                            >
                                &gt;
                            </button>
                        </>
                    )}

                    {/* Zoom Controls */}
                    <div
                        className="absolute gap-4 flex"
                        style={{
                            bottom: "2rem", // Default for laptops
                            left: "50%",
                            transform: "translate(-50%, 0)",
                            ...(window.innerWidth <= 768 && { // Closer for mobile
                                bottom: "0.5rem",
                            }),
                        }}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent modal closure when clicking button
                                handleZoomOut();
                            }}
                            className="px-6 py-3 bg-red-600 text-black font-bold rounded-md text-xl shadow-md"
                        >
                            -
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent modal closure when clicking button
                                handleZoomIn();
                            }}
                            className="px-6 py-3 bg-green-600 text-black font-bold rounded-md text-xl shadow-md"
                        >
                            +
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageZoom;
