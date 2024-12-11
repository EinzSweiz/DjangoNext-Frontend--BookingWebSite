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
    customer_service_name: string; // Use the name instead of the ID
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
                                {/* Add SVG above the subject */}
                                <div className="mb-4 flex justify-center">
                                <svg 
                                    data-name="Layer 1" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="562" 
                                    height="486.80525" 
                                    viewBox="0 0 562 486.80525" 
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <path 
                                        d="M553.88171,596.17145a15.51335,15.51335,0,0,0,15.61066,15.38848l265.99316-1.90637a15.5,15.5,0,0,0-.22216-30.9992L569.2702,580.56073A15.5134,15.5134,0,0,0,553.88171,596.17145Z" 
                                        transform="translate(-319 -208.75509)" 
                                        fill="#f2f2f2"
                                    />
                                    <path 
                                        d="M585.78864,592.46466a.9845.9845,0,0,1,.98-.98706l68.70306-.24567a.98365.98365,0,1,1,.007,1.96729h0l-68.70307.24566A.98477.98477,0,0,1,585.78864,592.46466Z" 
                                        transform="translate(-319 -208.75509)" 
                                        fill="#ccc"
                                    />
                                    <path 
                                        d="M585.868,601.48187a.98451.98451,0,0,1,.98-.98706l176.88977-1.04944a.98366.98366,0,0,1,.01123,1.96729h-.00421L586.855,602.4621A.98474.98474,0,0,1,585.868,601.48187Z" 
                                        transform="translate(-319 -208.75509)" 
                                        fill="#ccc"
                                    />
                                    <path 
                                        d="M553.88171,537.17145a15.51335,15.51335,0,0,0,15.61066,15.38848l265.99316-1.90637a15.5,15.5,0,0,0-.22216-30.9992L569.2702,521.56073A15.5134,15.5134,0,0,0,553.88171,537.17145Z" 
                                        transform="translate(-319 -208.75509)" 
                                        fill="#f2f2f2"
                                    />
                                    <path 
                                        d="M582.868,542.48187a.98451.98451,0,0,1,.98-.98706l176.88977-1.04944a.98365.98365,0,1,1,.007,1.96729h0L583.855,543.4621A.98474.98474,0,0,1,582.868,542.48187Z" 
                                        transform="translate(-319 -208.75509)" 
                                        fill="#ccc"
                                    />
                                    <path 
                                        d="M582.868,532.48187a.98451.98451,0,0,1,.98-.98706l176.88977-1.04944a.98365.98365,0,1,1,.007,1.96729h0L583.855,533.4621A.98474.98474,0,0,1,582.868,532.48187Z" 
                                        transform="translate(-319 -208.75509)" 
                                        fill="#ccc"
                                    />
                                    <path 
                                        d="M631.7298,664.56073l-265.99317-1.90637a15.5,15.5,0,0,0-.22216,30.9992l265.99316,1.90637a15.5,15.5,0,0,0,.22217-30.9992Z" 
                                        transform="translate(-319 -208.75509)" 
                                        fill="#f2f2f2"
                                    />
                                    <path 
                                        d="M449.2243,677.44488l-68.70309-.24566a.98365.98365,0,1,1,.007-1.96729l68.70309.24567a.98365.98365,0,1,1-.007,1.96728Z" 
                                        transform="translate(-319 -208.75509)" 
                                        fill="#ccc"
                                    />
                                    <path 
                                        d="M558.1449,686.4621l-176.88977-1.04944a.98365.98365,0,1,1,.007-1.96729h0l176.88974,1.04944a.98365.98365,0,1,1-.007,1.96729Z" 
                                        transform="translate(-319 -208.75509)" 
                                        fill="#ccc"
                                    />
                                    <circle cx="555" cy="327.16309" r="7" fill="#f2f2f2" />
                                    <circle cx="555" cy="386.16309" r="7" fill="#f2f2f2" />
                                </svg>
                                </div>
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
                                    Assigned Agent: {inquiry.customer_service_name || 'Unassigned'}
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
