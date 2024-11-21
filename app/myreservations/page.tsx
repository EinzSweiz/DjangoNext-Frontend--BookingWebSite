import Image from "next/image";
import Link from "next/link";
import { getAccessToken } from "../lib/actions";
import apiService from "../services/apiService";
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
            <h1 className="my-6 text-2xl">My Reservations</h1>
            <div className="space-y-4">
                {reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <div
                            key={reservation.id}
                            className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-400 rounded-xl"
                        >
                            <div className="col-span-1">
                                <div className="relative overflow-hidden aspect-square rounded-xl">
                                    <Image
                                        fill
                                        src={reservation.property.image_url || "/default-image.jpg"}
                                        alt={reservation.property.title || "Reservation Image"}
                                        className="hover:scale-110 object-cover transition"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-3 flex flex-col">
                                <h2 className="mb-4 text-xl">{reservation.property.title || "Property Name"}</h2>
                                <p>
                                    <strong>Check-in date:</strong> {reservation.start_date}
                                </p>
                                <p>
                                    <strong>Check-out date:</strong> {reservation.end_date}
                                </p>
                                <p>
                                    <strong>Number of nights:</strong> {reservation.number_of_nights}
                                </p>
                                <p>
                                    <strong>Total price:</strong> ${reservation.total_price}
                                </p>
                                <Link
                                    href={`/properties/${reservation.property.id}`}
                                    className="mt-auto flex justify-end"
                                >
                                    <div className="mt-6 inline-block cursor-pointer py-2 px-6 text-white bg-airbnb rounded-xl hover:bg-airbnb-dark">
                                        Go to property
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No reservations found.</p>
                )}
            </div>
        </main>
    );
};

export default MyReservationsPage;
