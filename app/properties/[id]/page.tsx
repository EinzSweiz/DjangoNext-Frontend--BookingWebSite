import Image from "next/image";
import Link from "next/link";
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";

import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";
import GetAllReviews from "@/app/components/review/get_all";
import CreateReview from "@/app/components/review/create_review";
import LoginPrompt from "@/app/components/review/LoginPrompt";

type Params = Promise<{ id: string }>

const PropertyDetailPage = async ({params}: { params: Params }) => {
    const resolvedParams = await params
    const { id } = resolvedParams
    const property = await apiService.get(`/api/properties/${id}`);
    const userId = await getUserId();
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
                <LoginPrompt/>
                
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
                            <div 
                                style={{ 
                                    marginRight: "15px", 
                                    flexShrink: 0, 
                                    width: "50px", 
                                    height: "50px", 
                                    overflow: "hidden", 
                                    borderRadius: "50%" 
                                }}
                            >
                                <Image
                                    src={property.landlord.avatar_url}
                                    width={50}
                                    height={50}
                                    alt={`${property.landlord.name}'s avatar`}
                                    style={{
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
                            </div>
                        )}

                        <p>
                            <strong>{property.landlord.name}</strong> is your host
                        </p>
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