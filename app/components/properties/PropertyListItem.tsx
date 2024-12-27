import Image from "next/image";
import { useRouter } from "next/navigation";
import { PropertyType } from "./PropertyList";
import FavoriteButton from "./FavoriteButton";

interface PropertyProps {
  property: PropertyType;
  markFavorite?: (is_favorite: boolean) => void;
}

const PropertyListItem: React.FC<PropertyProps> = ({
  property,
  markFavorite,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/properties/${property.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        group
        relative
        cursor-pointer
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
        transition
        duration-300
        transform
        hover:scale-105
        hover:shadow-lg
      "
    >
      {/* Image Section */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-xl">
        <Image
          fill
          src={property.image_url}
          alt={`Image of ${property.title}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 33vw"
          className="
            object-cover
            transition-transform
            duration-300
            group-hover:scale-110
          "
        />
        {/* Favorite Button */}
        {markFavorite && (
          <div className="absolute top-3 right-3 z-20">
            <FavoriteButton
              id={property.id}
              is_favorite={property.is_favorite}
              markFavorite={(is_favorite) => markFavorite(is_favorite)}
            />
          </div>
        )}
        {/* Overlay on Hover */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/40
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />
      </div>

      {/* Info Section */}
      <div className="p-4">
        {/* Title */}
        <h2
          className="
            mb-1
            text-lg
            font-medium
            text-gray-800
            truncate
          "
        >
          {property.title || "Untitled Property"}
        </h2>

        {/* Country */}
        <p
          className="
            text-xs
            text-gray-500
            mb-2
          "
        >
          {property.country || "Unknown location"}
        </p>

        {/* Price Section */}
        <div className="flex items-baseline space-x-1">
          <span
            className="
              text-xl
              font-semibold
              text-gray-800
            "
          >
            ${property.price_per_night}
          </span>
          <span className="text-sm text-gray-500">/ night</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyListItem;
