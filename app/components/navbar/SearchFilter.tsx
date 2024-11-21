"use client";
import { useState } from "react";
import useSearchModal from "@/app/hooks/useSearchModal";

const SearchFilters = () => {
    const searchModel = useSearchModal();
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen((prev) => !prev);
    

    return (
        <div>
            {/* Mobile View: Only SVG */}
            <div className="lg:hidden p-2">
                <div
                    className="cursor-pointer p-2 bg-airbnb hover:bg-airbnb-dark transition rounded-full text-white"
                    onClick={toggleOpen}
                >
                    <svg
                        viewBox="0 0 32 32"
                        style={{
                            display: "block",
                            fill: "none",
                            height: "16px",
                            width: "16px",
                            stroke: "currentColor",
                            strokeWidth: 4,
                            overflow: "visible",
                        }}
                        aria-hidden="true"
                        role="presentation"
                        focusable="false"
                    >
                        <path fill="none" d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9" />
                    </svg>
                </div>
            </div>

            {/* Mobile View: Dropdown Search Filters */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t shadow-md p-4 absolute top-0 left-0 w-full z-50">
                    <div
                        onClick={() => searchModel.open("location")}
                        className="cursor-pointer mb-4 p-4 rounded-lg border hover:bg-gray-100 transition"
                    >
                        <p className="text-xs font-semibold">Search</p>
                        <p className="text-sm">Location</p>
                    </div>
                    <div
                        onClick={() => searchModel.open("checkin")}
                        className="cursor-pointer mb-4 p-4 rounded-lg border hover:bg-gray-100 transition"
                    >
                        <p className="text-xs font-semibold">Check in</p>
                        <p className="text-sm">Add dates</p>
                    </div>
                    <div
                        onClick={() => searchModel.open("checkout")}
                        className="cursor-pointer mb-4 p-4 rounded-lg border hover:bg-gray-100 transition"
                    >
                        <p className="text-xs font-semibold">Checkout</p>
                        <p className="text-sm">Add dates</p>
                    </div>
                    <div
                        onClick={() => searchModel.open("details")}
                        className="cursor-pointer mb-4 p-4 rounded-lg border hover:bg-gray-100 transition"
                    >
                        <p className="text-xs font-semibold">Who</p>
                        <p className="text-sm">Add guests</p>
                    </div>
                    <div className="mt-6 flex flex-row gap-4 justify-between ">
                        <div
                            className="cursor-pointer text-airbnb font-semibold"
                            onClick={toggleOpen}
                        >
                            Close
                        </div>
                        {/* <div
                            className="cursor-pointer text-green-500 font-semibold"
                            onClick={() => {
                                closeAndSearch(); // Call the closeAndSearch function
                                setIsOpen(false); // Ensure the dropdown closes
                            }}
                        >
                            Search
                        </div> */}
                    </div>
                </div>
            )}

            {/* Desktop View */}
            <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between border rounded-full h-[64px]">
                <div
                    onClick={() => searchModel.open("location")}
                    className="cursor-pointer w-[250px] h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100"
                >
                    <p className="text-xs font-semibold">Search</p>
                    <p className="text-sm">Location</p>
                </div>
                <div
                    onClick={() => searchModel.open("checkin")}
                    className="cursor-pointer h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100"
                >
                    <p className="text-xs font-semibold">Check in</p>
                    <p className="text-sm">Add dates</p>
                </div>
                <div
                    onClick={() => searchModel.open("checkout")}
                    className="cursor-pointer h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100"
                >
                    <p className="text-xs font-semibold">Checkout</p>
                    <p className="text-sm">Add dates</p>
                </div>
                <div
                    onClick={() => searchModel.open("details")}
                    className="cursor-pointer h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100"
                >
                    <p className="text-xs font-semibold">Who</p>
                    <p className="text-sm">Add guests</p>
                </div>
                <div className="p-2">
                    <div className="cursor-pointer p-4 bg-airbnb hover:bg-airbnb-dark transition rounded-full text-white">
                        <svg
                            viewBox="0 0 32 32"
                            style={{
                                display: "block",
                                fill: "none",
                                height: "16px",
                                width: "16px",
                                stroke: "currentColor",
                                strokeWidth: 4,
                                overflow: "visible",
                            }}
                            aria-hidden="true"
                            role="presentation"
                            focusable="false"
                        >
                            <path fill="none" d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;
