'use client';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useRouter } from 'next/navigation';

interface Inquiry {
    id: string;
    subject: string;
    message: string;
    response: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    customer_service: string;
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

    return (
        <div className="p-5 font-sans dark:bg-gray-900 dark:text-gray-200">
            {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inquiries.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">No inquiries found.</p>
                ) : (
                    inquiries.map((inquiry) => (
                        <div
                            key={inquiry.id}
                            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                            onClick={() => router.push(`/myinquiries/${inquiry.id}`)}
                        >
                            <div className="p-5">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {inquiry.subject}
                                </h5>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    {inquiry.message}
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
                                        {inquiry.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Created At: {new Date(inquiry.created_at).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Assigned Agent: {inquiry.customer_service || 'Unassigned'}
                                </p>
                                <button
                                    className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                    ))
                )}
            </div>
        </div>
    );
};

export default MyInquiries;
