'use client'
import useSearchModal from "@/app/hooks/useSearchModal";
const SearchFilters = () => {
    const searchModel = useSearchModal()
    return (
        <div
        className="h-[48px] lg:h-[64px] flex flex-row items-center justify-between border rounded-full">
            <div className="hidden lg:block">
                <div className="flex flex-row items-center justify-between">
                    <div onClick={() => searchModel.open('location')} className="cursor-pointer w-[250px] h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100">
                        <p className="text-xs font-semibold">Search</p>
                        <p className="text-sm">Location</p>
                    </div>
                    <div onClick={() => searchModel.open('checkin')} className="cursor-pointer h-[48px] lg:h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100">
                        <p className="text-xs font-semibold">Check in</p>
                        <p className="text-sm">Add dates</p>
                    </div>
                    <div onClick={() => searchModel.open('checkout')} className="cursor-pointer h-[48px] lg:h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100">
                        <p className="text-xs font-semibold">Checkout</p>
                        <p className="text-sm">Add dates</p>
                    </div>
                    <div onClick={() => searchModel.open('details')} className="cursor-pointer h-[48px] lg:h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100">
                        <p className="text-xs font-semibold">Who</p>
                        <p className="text-sm">Add guests</p>
                    </div>
                </div>
            </div>
            <div className="p-2">
                <div className="cursor-pointer p-2 lg:p-4 bg-airbnb hover:bg-airbnb-dark transition rounded-full text-white">
                    <svg viewBox="0 0 32 32" style={{display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentColor', strokeWidth: 4, overflow: 'visible'}} 
                    aria-hidden="true" role="presentation" focusable="false">
                        <path fill="none" d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default SearchFilters;
