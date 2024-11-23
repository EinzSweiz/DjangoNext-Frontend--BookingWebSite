"use client"
import { useEffect, useState, Suspense } from "react"
import PropertyListItem from "./PropertyListItem"
import apiService from "@/app/services/apiService"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import useSearchModal from "@/app/hooks/useSearchModal"

export type PropertyType = {
    id: string
    title: string
    price_per_night: number
    image_url: string
    is_favorite: boolean
}

interface PropertyListProps {
    landlord_id?: string | null
    favorites?: boolean | null
}

const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id,
    favorites
}) => {
    const params = useSearchParams()
    const searchModal = useSearchModal()
    const country = searchModal.query.country
    const numGuests = searchModal.query.guests
    const numBathrooms = searchModal.query.bathrooms
    const numBedrooms = searchModal.query.bedrooms
    const checkinDate = searchModal.query.checkin
    const checkoutDate = searchModal.query.checkout
    const category = searchModal.query.category
    const [properties, setProperties] = useState<PropertyType[]>([])

    const markFavorite = (id: string, is_favorite: boolean) => {
        setProperties((prevProperties) =>
            prevProperties.map((property) =>
                property.id === id
                    ? { ...property, is_favorite }
                    : property
            )
        );
    };
    
    
    const getProperties = async () => {
        try {
            let url = '/api/properties/';
            if (landlord_id) {
                url += `?landlord_id=${landlord_id}`;
            } else if (favorites) {
                url += '?is_favorites=true';
            } else {
                let urlQuery = '';
                if (country) urlQuery += '&country=' + country;
                if (numGuests) urlQuery += '&numGuests=' + numGuests;
                if (numBathrooms) urlQuery += '&numBathrooms=' + numBathrooms;
                if (category) urlQuery += '&category=' + category;
                if (checkinDate) urlQuery += '&checkinDate=' + format(checkinDate, 'yyyy-MM-dd');
                if (checkoutDate) urlQuery += '&checkoutDate=' + format(checkoutDate, 'yyyy-MM-dd');
                if (urlQuery.length) url += '?' + urlQuery.substring(1);
            }
    
            const tmpProperties = await apiService.get(url);
            setProperties(
                tmpProperties.data.map((property: PropertyType) => ({
                    ...property,
                    is_favorite: !!property.is_favorite, // Ensure proper boolean
                }))
            );
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };
    
    useEffect(() => {
        getProperties();
    }, [category, searchModal.query, params]);

    return (
        <>
        {properties.map((property) => {
            return (
                <PropertyListItem
                key={property.id}
                property={property}
                markFavorite={(is_favorite) => markFavorite(property.id, is_favorite)}
            />
            )
        })}
        </>
    )
}

const PropertyListWithSuspense = (props: PropertyListProps) => (
    <Suspense fallback={<div>Loading properties...</div>}>
        <PropertyList {...props} />
    </Suspense>
)

export default PropertyListWithSuspense
