import Image from "next/image";

interface CategoriesProps {
    dataCategory: string;
    setCategory: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({
    dataCategory,
    setCategory
}) => {
    return (
        <>
            <div className="pt-3 cursor-pointer pb-6 flex items-center space-x-12">
                <div 
                    onClick={() => setCategory('Beach')} 
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
                        dataCategory === 'Beach' ? 'border-gray-800 opacity-100' : 'border-white opacity-60'
                    } hover:border-gray-200 hover:opacity-100`}>
                    <Image src="/icn_category.jpg" alt="cat-beach" width={20} height={20} />
                    <span className="text-xs">Beach</span>
                </div>

                <div 
                    onClick={() => setCategory('Villas')} 
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
                        dataCategory === 'Villas' ? 'border-gray-800 opacity-100' : 'border-white opacity-60'
                    } hover:border-gray-200 hover:opacity-100`}>
                    <Image src="/icn_category.jpg" alt="cat-villas" width={20} height={20} />
                    <span className="text-xs">Villas</span>
                </div>

                <div 
                    onClick={() => setCategory('Cabin')} 
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
                        dataCategory === 'Cabin' ? 'border-gray-800 opacity-100' : 'border-white opacity-60'
                    } hover:border-gray-200 hover:opacity-100`}>
                    <Image src="/icn_category.jpg" alt="cat-cabin" width={20} height={20} />
                    <span className="text-xs">Cabin</span>
                </div>

                <div 
                    onClick={() => setCategory('Tiny homes')} 
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
                        dataCategory === 'Tiny homes' ? 'border-gray-800 opacity-100' : 'border-white opacity-60'
                    } hover:border-gray-200 hover:opacity-100`}>
                    <Image src="/icn_category.jpg" alt="cat-tiny-homes" width={20} height={20} />
                    <span className="text-xs">Tiny homes</span>
                </div>
            </div>
        </>
    );
};

export default Categories;
