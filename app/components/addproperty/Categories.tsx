import Image from "next/image";

interface CategoriesProps {
    dataCategory: string;
    setCategory: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ dataCategory, setCategory }) => {
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
    ];

    return (
        <div className="pt-3 pb-6 flex items-center space-x-12 overflow-x-auto">
            {categories.map((category) => (
                <div
                    key={category}
                    onClick={() => setCategory(category)}
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 
                        ${
                            dataCategory === category
                                ? "border-green-500 opacity-100"
                                : "border-white opacity-60"
                        } 
                        hover:border-gray-200 hover:opacity-100 cursor-pointer`}
                >
                    <Image
                        src="/icn_category.jpg"
                        alt={`cat-${category.toLowerCase().replace(" ", "-")}`}
                        width={20}
                        height={20}
                    />
                    <span className="text-xs">{category}</span>
                </div>
            ))}
        </div>
    );
};

export default Categories;
