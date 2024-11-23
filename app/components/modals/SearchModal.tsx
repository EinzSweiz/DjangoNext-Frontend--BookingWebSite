'use client'
import Modal from "./Modal"
import SelectCountry, { SelectCountryValue } from "@/app/forms/SelectCountry"
import { useState } from "react"
import CustomButton from "@/app/forms/CustomButton"
import { Range } from "react-date-range"
import DatePicker from "@/app/forms/Calendar"
import useSearchModal, { SearchQuery } from "@/app/hooks/useSearchModal"


const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

const SearchModal = () => {
    let content = (<></>)
    const SearchModal = useSearchModal()
    const [country, setCountry] = useState<SelectCountryValue>()
    const [numGuests, setNumGuests] = useState<string>('1')
    const [numBathrooms, setnumBathrooms] = useState<string>('1')
    const [numBedrooms, setnumBedrooms] = useState<string>('1')
    const [dateRange, setDateRange] = useState<Range>(initialDateRange)

    const closeAndSearch = () => {
        const newSearchQuery: SearchQuery = {
            country: country?.label,
            checkin: dateRange.startDate,
            checkout: dateRange.endDate,
            guests: parseInt(numGuests),
            bedrooms: parseInt(numBedrooms),
            bathrooms: parseInt(numBathrooms),
            category: ''
        }
        SearchModal.setQuery(newSearchQuery)
        SearchModal.close()
    }

    const _setDateRange = (selection: Range) => {
        if (SearchModal.step === 'checkin') {
            SearchModal.open('checkout')
        } else if (SearchModal.step === 'checkout') {
            SearchModal.open('details')
        }
        setDateRange(selection)
    }

    const contentLocation = (
        <div className="dark:bg-gray-800 dark:border-gray-700 dark:text-white p-6 rounded-lg shadow-lg">
            <h2 className="mb-6 text-xl font-semibold">Where do you want to go?</h2>
            <SelectCountry value={country} onChange={(value) => setCountry(value as SelectCountryValue)} />
            <div className="mt-6 flex flex-row gap-4">
                <CustomButton className="bg-green-500 hover:bg-green-700" label="Check in date ->" onClick={() => SearchModal.open('checkin')} />
            </div>
        </div>
    )

    const contentCheckin = (
        <div className="dark:bg-gray-800 dark:border-gray-700 dark:text-white p-6 rounded-lg shadow-lg">
            <h2 className="mb-6 text-xl font-semibold">When do you want to check in?</h2>
            <DatePicker value={dateRange} onChange={(value) => _setDateRange(value.selection)} />
            <div className="mt-6 flex flex-row gap-4 justify-between">
                <CustomButton className="bg-black hover:bg-gray-700" label="<- Location" onClick={() => SearchModal.open('location')} />
                <CustomButton className="bg-green-500 hover:bg-green-700" label="Check out date ->" onClick={() => SearchModal.open('checkout')} />
            </div>
        </div>
    )

    const contentCheckout = (
        <div className="dark:bg-gray-800 dark:border-gray-700 dark:text-white p-6 rounded-lg shadow-lg">
            <h2 className="mb-6 text-xl font-semibold">When do you want to check out?</h2>
            <DatePicker value={dateRange} onChange={(value) => _setDateRange(value.selection)} />
            <div className="mt-6 flex flex-row gap-4 justify-between">
                <CustomButton className="bg-black hover:bg-gray-700" label="<- Checkin" onClick={() => SearchModal.open('checkin')} />
                <CustomButton className="bg-green-500 hover:bg-green-700" label="Details ->" onClick={() => SearchModal.open('details')} />
            </div>
        </div>
    )

    const contentDetails = (
        <div className="dark:bg-gray-800 dark:border-gray-700 dark:text-white p-6 rounded-lg shadow-lg">
            <h2 className="mb-6 text-xl font-semibold">Details</h2>
            <div className="space-y-4">
                <div className="space-y-4">
                    <label>Number of guests</label>
                    <input
                        type="number"
                        placeholder="Number of guests..."
                        min="1"
                        value={numGuests}
                        onChange={(e) => setNumGuests(e.target.value)}
                        className="w-full h-14 px-4 border border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md"
                    />
                </div>
                <div className="space-y-4">
                    <label>Number of bathrooms</label>
                    <input
                        type="number"
                        placeholder="Number of bathrooms..."
                        min="0"
                        value={numBathrooms}
                        onChange={(e) => setnumBathrooms(e.target.value)}
                        className="w-full h-14 px-4 border border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md"
                    />
                </div>
                <div className="space-y-4">
                    <label>Number of bedrooms</label>
                    <input
                        type="number"
                        placeholder="Number of bedrooms..."
                        min="0"
                        value={numBedrooms}
                        onChange={(e) => setnumBedrooms(e.target.value)}
                        className="w-full h-14 px-4 border border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md"
                    />
                </div>
            </div>
            <div className="mt-6 flex flex-row gap-4 justify-between">
                <CustomButton className="bg-black hover:bg-gray-700" label="<- Checkout" onClick={() => SearchModal.open('checkout')} />
                <CustomButton className="bg-green-500 hover:bg-green-700" label="Search ->" onClick={closeAndSearch} />
            </div>
        </div>
    )

    if (SearchModal.step === 'location') {
        content = contentLocation
    } else if (SearchModal.step === 'checkin') {
        content = contentCheckin
    } else if (SearchModal.step === 'checkout') {
        content = contentCheckout
    } else if (SearchModal.step === 'details') {
        content = contentDetails
    }

    return (
        <Modal
            isOpen={SearchModal.isOpen}
            close={SearchModal.close}
            label='Search'
            content={content}
        />
    )
}

export default SearchModal
