import Image from "next/image";

const PropertyListItem = () => {
    return (
        <div className="cursor-pointer">
            <div className="relative overflow-hidden aspect-square rounded-xl">
                <Image 
                    fill 
                    src="/beach_1.jpg" 
                    alt="Item-Image-House" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="hover:scale-110 object-cover transition h-full w-full"
                />
            </div>
            <div className="mt-2">
                <p className="text-lg font-bold">Property Name</p>
            </div>
            <div className="mt-2">
                <p className="text-sm text-gray-500"><strong>$200</strong> Per night</p>
            </div>
        </div>
    );
};

export default PropertyListItem;
