import { useEffect, useState } from "react";
import apiService from "@/app/services/apiService";

interface FavoriteProps {
    id: string;
    is_favorite: boolean;
    markFavorite: (is_favorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteProps> = ({
    id,
    is_favorite,
    markFavorite    
}) => {
    const [favoriteStatus, setFavoriteStatus] = useState(is_favorite);

    // Fetch favorite status from localStorage when the component mounts
    useEffect(() => {
        const savedFavoriteStatus = localStorage.getItem(`favorite_${id}`);
        if (savedFavoriteStatus !== null) {
            try {
                // Ensure savedFavoriteStatus is a valid JSON boolean
                const parsedStatus = JSON.parse(savedFavoriteStatus);
                if (typeof parsedStatus === "boolean") {
                    setFavoriteStatus(parsedStatus);
                } else {
                    console.error('Invalid favorite status:', parsedStatus);
                    setFavoriteStatus(is_favorite);
                }
            } catch (error) {
                console.error('Error parsing favorite status from localStorage:', error);
                setFavoriteStatus(is_favorite);
            }
        } else {
            setFavoriteStatus(is_favorite);
        }
    }, [id, is_favorite]);

    const toggleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        try {
            const response = await apiService.post(`/api/properties/${id}/toggle_favorite/`, null); 
            
            if (typeof response.is_favorited === 'boolean') {
                // Update UI with the new state
                markFavorite(response.is_favorited);
                
                // Update localStorage with the new favorite status
                setFavoriteStatus(response.is_favorited);
                localStorage.setItem(`favorite_${id}`, JSON.stringify(response.is_favorited));
            } else {
                console.error('Invalid response structure', response);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <div
            onClick={toggleFavorite}
            className="absolute top-2 right-2 cursor-pointer"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={favoriteStatus ? 'red' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke={favoriteStatus ? 'red' : 'currentColor'}
                className="size-6 hover:fill-red-500"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
        </div>
    );
};

export default FavoriteButton;
