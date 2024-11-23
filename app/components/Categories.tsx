'use client'
import { useState } from "react"
import Image from "next/image"
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'; // Arrow icons
import useSearchModal, { SearchQuery } from "../hooks/useSearchModal"

const Categories = () => {
    const searchModal = useSearchModal()
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isOpen, setIsOpen] = useState(true); // Toggle state for categories

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

    const toggleCategories = () => {
        setIsOpen(prevState => !prevState); // Toggle the state for categories visibility
    }

    return (
        <div className="min-h-[100px] flex justify-center items-center bg-white dark:bg-gray-900">
            <div className="flex flex-col items-center w-full">
                {/* Toggle Arrow */}
                <div 
                    onClick={toggleCategories}
                    className="cursor-pointer py-2 text-black dark:text-white"
                >
                    {isOpen ? <AiOutlineUp size={18} className="text-black dark:text-white" /> : <AiOutlineDown size={18} className="text-black dark:text-white" />}
                </div>

                {/* Conditional Rendering: Show categories list or SVG icon based on isOpen */}
                {isOpen ? (
                    <div className={`pt-3 pb-6 flex flex-wrap items-center justify-center gap-4 bg-white p-4 rounded-lg shadow-lg transition-all duration-500 dark:bg-gray-800`}>
                        {categories.map((category) => (
                            <div
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`pb-4 flex flex-col items-center space-y-2 border-b-2 
                                    ${selectedCategory === category ? 'border-green-500 opacity-100' : 'border-gray-700 opacity-60'} 
                                    hover:border-gray-500 hover:opacity-100 cursor-pointer transition-all duration-200 
                                    w-1/3 sm:w-auto`} 
                            >
                                <Image
                                    src={`/icn_category_${category}.jpg`}
                                    alt={`cat-${category.toLowerCase().replace(" ", "-")}`}
                                    width={30}
                                    height={30}
                                    className="filter dark:invert dark:brightness-50"
                                />
                                <span className="text-xs text-black dark:text-white">{category}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    // SVG Icon (this could be any icon you like)
                    <div className="pt-1 pb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-5 w-5 text-black dark:text-white">
                            <path d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"/>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Categories
