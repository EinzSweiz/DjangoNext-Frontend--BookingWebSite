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
  markFavorite,
}) => {
  const [favoriteStatus, setFavoriteStatus] = useState<boolean>(is_favorite);

  // Initialize favorite status from localStorage or default to prop value
  useEffect(() => {
    const savedStatus = localStorage.getItem(`favorite_${id}`);
    if (savedStatus) {
      try {
        const parsedStatus = JSON.parse(savedStatus);
        if (typeof parsedStatus === "boolean") {
          setFavoriteStatus(parsedStatus);
        } else {
          throw new Error("Invalid favorite status type");
        }
      } catch (error) {
        console.error("Error parsing favorite status:", error);
        setFavoriteStatus(is_favorite);
      }
    } else {
      setFavoriteStatus(is_favorite);
    }
  }, [id, is_favorite]);

  // Toggle favorite status with API call and update localStorage
  const toggleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      const { is_favorited } = await apiService.post(`/api/properties/${id}/toggle_favorite/`, null);
      if (typeof is_favorited === "boolean") {
        markFavorite(is_favorited);
        setFavoriteStatus(is_favorited);
        localStorage.setItem(`favorite_${id}`, JSON.stringify(is_favorited));
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  return (
    <div
    onClick={toggleFavorite}
    className="absolute top-[-6px] right-[-5px] md:right-6 lg:right-0 cursor-pointer" // Adjusted top and right positions
    >
    <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="32"
        height="32"
        viewBox="0 0 64 64"
        className="hover:scale-105 transition-transform"
    >
        <path
        fill={favoriteStatus ? "#fd3c4f" : "#e0e0e0"} // Highlighted red for favorited, gray for not favorited
        d="M46.676,54.599L33.205,44.87c-0.715-0.517-1.685-0.503-2.386,0.033l-12.662,9.683 C16.865,55.574,15,54.652,15,53.025V11c0-2.209,1.791-4,4-4h27c2.209,0,4,1.791,4,4v41.899C50,54.61,48.062,55.601,46.676,54.599z"
        ></path>
        <path
        d="M45,38v7.265c0,0.816-0.924,1.288-1.586,0.811l-1.308-0.945c-2.24-1.615-5.365-1.113-6.981,1.126l0,0 l11.551,8.342C48.062,55.601,50,54.61,50,52.899V33C47.238,33,45,35.238,45,38z"
        opacity=".15"
        ></path>
        <ellipse cx="32" cy="61" opacity=".3" rx="20.125" ry="3"></ellipse>
        <path
        fill={favoriteStatus ? "#fff" : "#f5f5f5"} // Lighter fill for "not favorited"
        d="M15,11v18c2.762,0,5-2.238,5-5V12.652c0-0.42,0.264-0.795,0.66-0.934 C22.605,11.033,24,9.18,24,7h-5C16.791,7,15,8.791,15,11z"
        opacity=".3"
        ></path>
        <line
        x1="18.5"
        x2="18.5"
        y1="12.5"
        y2="19.5"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        ></line>
        <path
        fill="#ffce29"
        d="M51.544,22.992l2.419,4.902l5.409,0.786c1.459,0.212,2.042,2.005,0.986,3.034l-3.914,3.815 l0.924,5.388c0.249,1.453-1.276,2.561-2.581,1.875l-4.838-2.544l-4.838,2.544c-1.305,0.686-2.83-0.422-2.581-1.875l0.924-5.388 l-3.914-3.815c-1.056-1.029-0.473-2.822,0.986-3.034l5.409-0.786l2.419-4.902C49.006,21.669,50.891,21.669,51.544,22.992z"
        ></path>
    </svg>
    </div>

  );
};

export default FavoriteButton;
