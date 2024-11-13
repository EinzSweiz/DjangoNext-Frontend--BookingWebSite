import Image from "next/image";
import { PropertyType } from "./PropertyList";

interface PropertyProps {
    property: PropertyType
}

const PropertyListItem: React.FC<PropertyProps> = ({
    property
}) => {
    return (
        <div className="cursor-pointer">
            <div className="relative overflow-hidden aspect-square rounded-xl">
                <Image 
                    fill 
                    src={property.image_url} 
                    alt="Item-Image-House" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="hover:scale-110 object-cover transition h-full w-full"
                />
            </div>
            <div className="mt-2">
                <p className="text-lg font-bold">{property.title}</p>
            </div>
            <div className="mt-2">
                <p className="text-sm text-gray-500"><strong>${property.price_per_night}</strong> Per night</p>
            </div>
        </div>
    );
};

export default PropertyListItem;
