import Image from "next/image";
import { PropertyType } from "./PropertyList";
import { useRouter } from "next/navigation";
import FavoriteButton from "./FavoriteButton";

interface PropertyProps {
    property: PropertyType
    markFavorite?: (is_favorite: boolean) => void;
}

const PropertyListItem: React.FC<PropertyProps> = ({
    property,
    markFavorite
}) => {
    const router = useRouter()
    return (
        <div
        className="cursor-pointer"
        onClick={() => router.push(`properties/${property.id}`)}
    >
        <div className="relative overflow-hidden aspect-square rounded-xl">
            <Image
                fill
                src={property.image_url}
                alt="Item-Image-House"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 33vw"
                className="hover:scale-110 object-cover transition h-full w-full"
            />
            {markFavorite && (
                <FavoriteButton
                    id={property.id}
                    is_favorite={property.is_favorite}
                    markFavorite={markFavorite}
                />
            )}
        </div>
        <div className="mt-2">
            <p className="text-lg font-bold">{property.title}</p>
        </div>
        <div className="mt-2">
            <p className="text-sm text-gray-500">
                <strong>${property.price_per_night}</strong> Per night
            </p>
        </div>
    </div>
    
    );
};

export default PropertyListItem;
