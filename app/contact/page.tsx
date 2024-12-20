'use client'
import React, { useState, useEffect } from "react";
import { getAccessToken } from "../lib/actions";
import useContactModal from "../hooks/useContactModal";
import LeftModal from "../components/modals/LeftModal";
import { getUserId } from "../lib/actions";
import apiService from "../services/apiService";
import dynamic from "next/dynamic";

const MyPlace = dynamic(() => import("../components/MyPlace"), { ssr: false })

const ContactForm = () => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const contactModal = useContactModal();
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>(''); // State for success/error
    const [showMap, setShowMap] = useState(false)

    // Fetch the token only on client side
    useEffect(() => {
        if (!contactModal.isOpen) return;
    
        let isActive = true; // Prevent updating state if unmounted
        const fetchUserData = async () => {
            try {
                const userid = await getUserId();
                const response = await apiService.getWithToken(`/api/auth/profile/${userid}/`);
                if (isActive) {
                    setEmail(response.email || '');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };
        fetchUserData();
    
        return () => {
            isActive = false; // Cleanup on unmount or dependency change
        };
    }, [contactModal.isOpen]);
    
    const handleSubmit = async (e: any) => {
        e.preventDefault(); // Prevent the default form submission
    
        try {
            // Prepare the data to send to the backend
            const data = {
                email: email,   // User email
                subject: subject, // Subject entered by user
                message: message, // Message entered by user
            };
    
            // Call the API to create the inquiry
            const response = await apiService.postWithoutImages('/api/inquiries/create/', data);
    
            if (response) {
                setStatusMessage("Inquiry submitted successfully!");
                setStatusType('success'); // Set status to success
                setTimeout(() => { contactModal.close() }, 2000); // Close the modal after 2 seconds
            } else {
                setStatusMessage("Error submitting inquiry. Please try again.");
                setStatusType('error'); // Set status to error
            }            
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setStatusMessage("Error submitting inquiry. Please try again.");
            setStatusType('error'); // Set status to error
        }
    };
    
    const content = (
        <div className="text-center bg-gray-400">
            {/* Contact form always visible */}
            <div className="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800">
                <h5
                    id="drawer-label"
                    className="mt-6 inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
                >
                    <svg
                        className="w-4 h-4 me-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 16"
                    >
                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                    </svg>
                    Contact us
                </h5>
                {/* Button to close the contact form */}
                <button
                    type="button"
                    onClick={contactModal.close} // Close the modal on click
                    className="mt-6 text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>

                {/* Contact form */}
                <form onSubmit={handleSubmit} className="mb-6">
                    <div
                        aria-live="polite"
                        className={`text-center ${statusType === 'success' ? 'text-green-500' : 'text-red-500'}`}
                    >
                        {statusMessage}
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Your email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email || ''} // Pre-fill the email if authenticated
                            onChange={(e) => setEmail(e.target.value)} // Allow email update
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="subject"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            onChange={(e) => setSubject(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Let us know how we can help you"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="message"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Your message
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            onChange={(e) => setMessage(e.target.value)}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Your message..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 w-full focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 block"
                    >
                        Send message
                    </button>
                </form>

                {/* Contact info */}
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                        Need more help? Contact us at
                    </p>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <a href="mailto:riad.sultanov.1999@gmail.com" className="hover:underline">
                            riad.sultanov.1999@gmail.com
                        </a>
                     </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        <a href="tel:+994-50-888-87-08" className="hover:underline">
                            +994-50-888-87-08
                        </a>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
                        <a onClick={() => setShowMap(!showMap)} className="mb-2 mr-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 cursor-pointer"
                        >
                            {showMap ? 'Hide map' : 'See our Place'}
                        </a>
                    </p>
                    {showMap && (
                        <div className="mt-8">
                        <MyPlace height="300px" />
                        </div>
                    )}
            </div>
        </div>
    );

    return (
        <LeftModal 
            isOpen={contactModal.isOpen}
            close={contactModal.close}
            label="Contact"
            content={content}
        />
    );
};

export default ContactForm;
