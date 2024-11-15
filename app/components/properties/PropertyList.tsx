"use client"
import { useEffect, useState } from "react"
import PropertyListItem from "./PropertyListItem"
import { json } from "stream/consumers"
import apiService from "@/app/services/apiService"

export type PropertyType = {
    id: string
    title: string
    price_per_night: number
    image_url: string
}
const PropertyList = () => {
    const [properties, setProperties] = useState<PropertyType[]>([])
    const getProperties = async () => {
        const url = '/api/properities/'
        const tmpProperties = await apiService.get(url)
        setProperties(tmpProperties.data)
    }
    useEffect(() => {
        getProperties();
    }, [])
    return (
        <>
        {properties.map((property) => {
            return (
                <PropertyListItem 
                key={property.id}
                property={property}/>
            )
        })}
        </>
    )
}


export default PropertyList