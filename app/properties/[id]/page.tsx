'use client'
import Image from "next/image";
import Link from "next/link";
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";

import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";
import GetAllReviews from "@/app/components/review/get_all";
import CreateReview from "@/app/components/review/create_review";
import useLoginModal from "@/app/hooks/useLoginModal";

type Params = Promise<{ id: string }>

const PropertyDetailPage = async ({params}: { params: Params }) => {
    const resolvedParams = await params
    const { id } = resolvedParams
    const property = await apiService.get(`/api/properties/${id}`);
    const userId = await getUserId();
    const loginModal = useLoginModal()
    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="w-full h-[64vh] mb-4 overflow-hidden rounded-xl relative">
                <Image
                    fill
                    src={property.image_url}
                    className="object-cover w-full h-full"
                    alt="Beach house"
                />
            </div>
            <GetAllReviews propertyId={property.id} />
            {userId ? (
                <CreateReview propertyId={property.id} />
                ) : (
                <div className="bg-black text-white p-4 rounded-lg text-center">
                    <a 
                        onClick={() => loginModal.open()} 
                        className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                    >
                        Log in to write a review.
                    </a>
                </div>
                
                )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="py-6 pr-6 col-span-3">
                    <h1 className="mb-4 text-4xl">{property.title}</h1>

                    <span className="mb-6 block text-lg text-gray-600">
                        {property.guests} guests - {property.bedrooms} bedrooms - {property.bathrooms} bathrooms
                    </span>

                    <hr />

                    <Link 
                        href={`/landlords/${property.landlord.id}`}
                        className="py-6 flex items-center space-x-4"
                    >
                        {property.landlord.avatar_url && (
                            <Image
                                src={property.landlord.avatar_url}
                                width={50}
                                height={50}
                                className="rounded-full"
                                alt="The user name"
                            />
                        )}

                        <p><strong>{property.landlord.name}</strong> is your host</p>
                    </Link>

                    <hr />

                    <p className="mt-6 text-lg">
                        {property.description}
                    </p>
                </div>

                <ReservationSidebar 
                    property={property}
                    userId={userId}
                />
            </div>
        </main>
    )
}

export default PropertyDetailPage;