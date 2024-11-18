'use client'

import { getAccessToken } from "@/app/lib/actions"
import apiService from "@/app/services/apiService"
import { headers } from "next/headers"

interface FavoriteProps {
    id: string
    is_favorite: boolean
    markFavorite: (is_favorite: boolean) => void
}


const FavoriteButton: React.FC<FavoriteProps> = ({
    id,
    is_favorite,
    markFavorite    
}) => {
        const toggleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            const token = await getAccessToken()
            const response = await apiService.post(`/api/properties/${id}/toggle_favorite/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            markFavorite(response.is_favorite)
        }
    return (
        <div
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 cursor-pointer ${
                is_favorite ? 'text-airbnb' : 'text-white'
            } hover:text-airbnb`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={is_favorite ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
        </div>

    )
}

export default FavoriteButton