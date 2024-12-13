"use client"
import { useEffect, useState } from "react";
import apiService from "@/app/services/apiService";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import useSearchModal from "@/app/hooks/useSearchModal";
import PropertyListItem from "./PropertyListItem";

export type PropertyType = {
    id: string;
    title: string;
    price_per_night: number;
    image_url: string;
    is_favorite: boolean;
};

interface PropertyListProps {
    landlord_id?: string | null;
    favorites?: boolean | null;
}

const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id,
    favorites,
}) => {
    const params = useSearchParams();
    const searchModal = useSearchModal();
    const country = searchModal.query.country;
    const numGuests = searchModal.query.guests;
    const numBathrooms = searchModal.query.bathrooms;
    const numBedrooms = searchModal.query.bedrooms;
    const checkinDate = searchModal.query.checkin;
    const checkoutDate = searchModal.query.checkout;
    const category = searchModal.query.category;
    const [properties, setProperties] = useState<PropertyType[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);  // Track favorite IDs

    // Mark a property as a favorite or remove from favorites
    const markFavorite = async (id: string, is_favorite: boolean) => {
        // Update the favorite state locally
        setFavoriteIds((prev) =>
            is_favorite
                ? [...prev, id]
                : prev.filter((favoriteId) => favoriteId !== id)
        );

        setProperties((prevProperties) =>
            prevProperties.map((property) =>
                property.id === id
                    ? { ...property, is_favorite }
                    : property
            )
        );
    };

    // Get properties from the API and set the `is_favorite` status based on `favoriteIds`
    const getProperties = async () => {
        try {
            let url = '/api/properties/';
            if (landlord_id) {
                url += `?landlord_id=${landlord_id}`;
            } else if (favorites) {
                url += `?is_favorites=false`;
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
            console.log("Favorites Array:", tmpProperties);

            // Set the properties and mark them as favorite if their ID is in `favoriteIds`
            setProperties(
                tmpProperties.data.map((property: PropertyType) => ({
                    ...property,
                    is_favorite: property.is_favorite || favoriteIds.includes(property.id),
                }))
            );
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    useEffect(() => {
        getProperties();
    }, [category, searchModal.query, params, favorites, favoriteIds]); // Refetch when favoriteIds change

    return (
        <>
            {properties.map((property) => (
                <PropertyListItem
                    key={property.id}
                    property={property}
                    markFavorite={(is_favorite) => markFavorite(property.id, is_favorite)}
                />
            ))}
        </>
    );
};

export default PropertyList;
