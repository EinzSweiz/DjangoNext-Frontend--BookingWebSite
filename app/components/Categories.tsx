'use client'
import { useState } from "react"
import Image from "next/image"
import useSearchModal, { SearchQuery } from "../hooks/useSearchModal"

const Categories = () => {
    const searchModal = useSearchModal()
    const [selectedCategory, setSelectedCategory] = useState('')

    const categories = [
        "Beach",
        "Villas",
        "Cabin",
        "Tiny homes",
        "Mansions",
        "Apartments",
        "Farm stays",
        "Cottages",
        "Glamping",
        "Hotels",
    ]

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category)

        const query: SearchQuery = {
            country: searchModal.query.country,
            checkin: searchModal.query.checkin,
            checkout: searchModal.query.checkout,
            guests: searchModal.query.guests,
            bathrooms: searchModal.query.bathrooms,
            bedrooms: searchModal.query.bedrooms,
            category: category,
        }
        searchModal.setQuery(query)
    }

    return (
        <div className="pt-3 pb-6 flex items-center space-x-12 overflow-x-auto">
            {categories.map((category) => (
                <div
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 
                        ${selectedCategory === category ? 'border-green-500 opacity-100' : 'border-white opacity-60'} 
                        hover:border-gray-200 hover:opacity-100 cursor-pointer`}
                >
                    <Image
                        src="/icn_category.jpg"
                        alt={`cat-${category.toLowerCase().replace(" ", "-")}`}
                        width={30}
                        height={30}
                    />
                    <span className="text-xs">{category}</span>
                </div>
            ))}
        </div>
    )
}

export default Categories
