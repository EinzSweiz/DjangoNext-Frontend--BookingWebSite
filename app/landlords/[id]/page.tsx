'use client'
import Image from "next/image";
import ContactButton from "@/app/components/ContactButton";
import PropertyList from "@/app/components/properties/PropertyList";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";
import { useEffect } from 'react'

type Params = Promise<{ id: string }>;

const LandlordDetailPage = async ({ params }: { params: Params }) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const landlord = await apiService.get(`/api/auth/${id}`);
    const userId = await getUserId();

    useEffect(() => {
        console.log('Client-Side Landlord:', landlord);
    }, [landlord]);

    return (
        <main className="max-w-[1500px] mx-auto px-6 py-6 pb-6">
            {/* Center the landlord image at the top */}
            <div className="flex flex-col items-center mb-6">
            <div 
                style={{ 
                    width: "200px", 
                    height: "200px", 
                    overflow: "hidden", 
                    borderRadius: "50%", 
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" 
                }}
                className="mb-6"
            >
                <Image
                    src={landlord.avatar_url}
                    width={200}
                    height={200}
                    alt={`${landlord.name}'s avatar`}
                    style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                    }}
                />
            </div>

                <h1 className="mt-4 text-2xl font-bold text-center">{landlord.name}</h1>
                {userId !== id && (
                    <ContactButton userId={userId} landlordId={id} className="mt-4" />
                )}
            </div>

            {/* Property list */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <PropertyList landlord_id={id} />
            </div>
        </main>
    );
};

export default LandlordDetailPage;
