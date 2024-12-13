import Image from "next/image";
import { getAccessToken } from "../lib/actions";
import apiService from "../services/apiService";
import Link from "next/link";

// Type definitions
interface Property {
    id: string;
    title: string;
    landlord: { id: string; name: string };  // Assuming landlord is an object
    image_url: string;
}

interface Reservation {
    id: string;
    start_date: string;
    end_date: string;
    number_of_nights: number;
    total_price: number;
    property: Property;
}

// Mark the page as dynamic
export const dynamic = "force-dynamic";

const MyReservationsPage = async () => {
    const token = getAccessToken();
    let reservations: Reservation[] = [];
    let isOpen = false;

    try {
        const response = await apiService.getWithToken(`/api/auth/myreservations/`);
        if (response) {
            reservations = response;
        }
    } catch (error) {
        console.error("Error fetching reservations:", error);
    }

    return (
        <main className="max-w-[2000px] mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl text-center">My Reservations</h1>

            {/* Card Layout for Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <div
                            key={reservation.id}
                            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                        >
                            <Link href={`/properties/${reservation.property.id}`}>
                                <Image
                                    src={reservation.property.image_url || "/default-image.jpg"}
                                    alt={reservation.property.title || "Reservation Image"}
                                    width={500}
                                    height={300}
                                    className="rounded-t-lg object-cover"
                                />
                            </Link>
                            <div className="p-5">
                                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {reservation.property.title || "Property Name"}
                                </h5>
                                <p className="mb-3 text-sm text-gray-700 dark:text-gray-400">
                                    <strong>Start:</strong> {reservation.start_date}
                                    <br />
                                    <strong>End:</strong> {reservation.end_date}
                                </p>
                                <p className="mb-3 text-sm text-gray-700 dark:text-gray-400">
                                    <strong>Nights:</strong> {reservation.number_of_nights}
                                </p>
                                <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                                    <strong>Price:</strong> ${reservation.total_price}
                                </p>
                                <Link
                                    href={`/landlords/${reservation.property.landlord.id}`} // Updated link
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    View Landlord
                                    <svg
                                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
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
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-4 text-gray-500">
                        No reservations found.
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyReservationsPage;
