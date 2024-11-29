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
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                        <tr>
                            <th className="px-6 py-3">Inquiry ID</th>
                            <th className="px-6 py-3">Subject</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inquiries.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-3 text-gray-500 text-center dark:text-gray-400">
                                    No inquiries found.
                                </td>
                            </tr>
                        ) : (
                            inquiries.map((inquiry) => (
                                <tr
                                    key={inquiry.id}
                                    className="bg-white border-b hover:bg-gray-50 cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    onClick={() => router.push(`/myinquiries/${inquiry.id}`)}
                                >
                                    <td className="px-6 py-4">{inquiry.id}</td>
                                    <td className="px-6 py-4">{inquiry.subject}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded text-center ${
                                                inquiry.status.toLowerCase() === 'open'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : inquiry.status.toLowerCase() === 'in_progress'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                            }`}
                                        >
                                            {inquiry.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(inquiry.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyInquiries;
