"use client"
import { useEffect, useState } from "react"
import PropertyListItem from "./PropertyListItem"
import { json } from "stream/consumers"
import apiService from "@/app/services/apiService"
import { url } from "inspector"
import { useSearchParams } from "next/navigation"
import useSearchModal from "@/app/hooks/useSearchModal"
import { format } from "date-fns"

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
        const updatedProperties = properties.map((property) =>
            property.id === id
                ? { ...property, is_favorite }
                : property
        );
        setProperties(updatedProperties);
    };
    
    const getProperties = async () => {
        let url = '/api/properities/'
        if (landlord_id) {
            url += `?landlord_id=${landlord_id}`
        } else if (favorites) {
            url += '?is_favorites=true'
        } else {
            let urlQuery = ''
            if (country) {
                urlQuery += '&country=' + country
            }
            if (numGuests) {
                urlQuery += '&numGuests=' + numGuests
            }
            if (numBathrooms) {
                urlQuery += '&numBathrooms=' + numBathrooms
            }
            if (numBathrooms) {
                urlQuery += '&numBathrooms=' + numBathrooms
            }
            if (category) {
                urlQuery += '&category=' + category
            }
            if (checkinDate) {
                urlQuery += '&checkinDate=' + format(checkinDate, 'yyyy-MM-dd')
            }
            if (checkoutDate) {
                urlQuery += '&checkoutDate=' + format(checkoutDate, 'yyyy-MM-dd')
            }
            if (urlQuery.length) {
                console.log('Query:', urlQuery)
                urlQuery = '?' + urlQuery.substring(1)
                url += urlQuery
            }
            
        }

        const tmpProperties = await apiService.get(url)
        console.log(tmpProperties)
        setProperties(tmpProperties.data.map((property: PropertyType) => {
            if (tmpProperties.favorites.includes(property.id)) {
                property.is_favorite = true
            } else {
                property.is_favorite = false
            }
            return property
        }))
    }
    useEffect(() => {
        getProperties();
    }, [category, searchModal.query, params])
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


export default PropertyList