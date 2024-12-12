'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomNavbar from '../components/navbar/CustomNavbar';
import apiService from '@/app/services/apiService';
import { truncate } from 'fs';

interface Inquiry {
    id: string;
    subject: string;
    message: string;
    response: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    customer_service: string;
    customer_service_name: string; // Use the name instead of the ID
    severity: string;
}

const MyInquiries = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const response = await apiService.getWithToken(`/api/inquiries/get/`);
                setInquiries(response);
            } catch (err) {
                setError('Error fetching inquiries.');
                console.error(err);
            }
        };
        fetchInquiries();
    }, []);
    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="p-5 font-sans dark:bg-gray-900 dark:text-gray-200">
            <CustomNavbar onInquiriesFetch={setInquiries} />
            {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
            <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 p-5 rounded-lg overflow-x-auto">
                {inquiries.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">No inquiries found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {inquiries.map((inquiry) => (
                            <div
                                key={inquiry.id}
                                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                            >
                                <div className="p-5">
                                    <div className="mb-4 flex justify-center">
                                        <img
                                            src="/undraw_online_discussion_re_nn7e.svg"
                                            alt="Discussion SVG"
                                            className="max-h-32"
                                        />
                                    </div>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {truncateText(inquiry.subject, 25)}
                                    </h5>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        {truncateText(inquiry.message, 50)}
                                    </p>
                                    <div className="mb-3">
                                        <span
                                            className={`px-3 py-1 rounded ${
                                                inquiry.status.toLowerCase() === 'active'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : inquiry.status.toLowerCase() === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                            }`}
                                        >
                                            Status: {inquiry.status}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <span
                                            className={`px-3 py-1 rounded ${
                                                inquiry.severity.toLowerCase() === 'normal'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : inquiry.status.toLowerCase() === 'high'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                            }`}
                                        >
                                            Severity: {inquiry.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Created At: {new Date(inquiry.created_at).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Assigned Agent: {inquiry.customer_service_name || 'Unassigned'}
                                    </p>
                                    <button
                                        className="mt-3 w-full inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/myinquiries/${inquiry.id}`);
                                        }}
                                    >
                                        View Details
                                        <svg
                                            className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M1 5h12m0 0L9 1m4 4L9 9"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyInquiries;  // Make sure to add this export
