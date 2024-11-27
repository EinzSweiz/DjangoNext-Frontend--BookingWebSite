import Image from "next/image";
import { getAccessToken } from "../lib/actions";
import apiService from "../services/apiService";
import Link from "next/link";

// Type definitions
interface Property {
    id: string;
    title: string;
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
    let isOpen = false

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
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <h1 className="my-6 text-2xl flex justify-center">My Reservations</h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-16 py-3">
                                <span className="sr-only">Image</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Property
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Dates
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nights
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.length > 0 ? (
                            reservations.map((reservation) => (
                                <tr
                                    key={reservation.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <td className="p-4">
                                        <Image
                                            src={reservation.property.image_url || "/default-image.jpg"}
                                            alt={reservation.property.title || "Reservation Image"}
                                            width={200}
                                            height={200}
                                            className="object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {reservation.property.title || "Property Name"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p><strong>Start:</strong> {reservation.start_date}</p>
                                        <p><strong>End:</strong> {reservation.end_date}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {reservation.number_of_nights}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        ${reservation.total_price}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/properties/${reservation.property.id}`} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                            Property
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    No reservations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default MyReservationsPage;
