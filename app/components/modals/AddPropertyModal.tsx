"use client"
import Image from "next/image";
import Modal from "./Modal";
import usePropertyModal from "@/app/hooks/usePropertyModal";
import CustomButton from "@/app/forms/CustomButton";
import { ChangeEvent, useState } from "react";
import Categories from "../addproperty/Categories";
import SelectCountry, { SelectCountryValue } from "@/app/forms/SelectCountry";
import apiService from "@/app/services/apiService";
import { useRouter } from "next/navigation";
import { error } from "console";

const AddPropertyModal = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const addPropertyModal = usePropertyModal();
    const [dataCategory, setDataCategory] = useState('');
    const [dataTitle, setDataTitle] = useState('')
    const [dataDescription, setDataDescription] = useState('')
    const [dataPrice, setDataPrice] = useState('')
    const [dataBedrooms, setDataBedrooms] = useState('')
    const [dataBathrooms, setDataBathrooms] = useState('')
    const [dataGuests, setDataGuests] = useState('')
    const [errors, setErrors] = useState<String[]>([])
    const [dataCountry, setDataCountry] = useState<SelectCountryValue>()
    const [dataImage, setDataImage] = useState<File | null>(null)
    const router = useRouter()

    const setCategory = (category: string) => {
        setDataCategory(category);
    };

    const setImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const tmpImage = event.target.files[0]
            setDataImage(tmpImage)
        }
    }

    const submitForm = async () => {
        if (dataCategory &&
            dataTitle &&
            dataDescription &&
            dataPrice &&
            dataBedrooms &&
            dataCountry &&
            dataImage
        ) {
            const formData = new FormData()
            formData.append('category', dataCategory);
            formData.append('title', dataTitle);
            formData.append('description', dataDescription);
            formData.append('price_per_night', dataPrice);
            formData.append('bedrooms', dataBedrooms);
            formData.append('bathrooms', dataBathrooms);
            formData.append('guests', dataGuests);
            formData.append('country', dataCountry.label);
            formData.append('country_code', dataCountry.value);
            formData.append('image', dataImage);
            
            const response = await apiService.post('/api/properties/create/', formData)
            if (response.success) {
                console.log('SUCCESS')
                router.push('/?added=true')
                addPropertyModal.close()
            } else {
                console.log('ERROR')
                const tmpErrors: string[] = Object.values(response).map((error: any) => {
                    return error
                })
                setErrors(tmpErrors)
            }
        }
    }

    const content = (
        <>
            {currentStep === 1 ? (
                <>
                    <Categories dataCategory={dataCategory} setCategory={(category) => setCategory(category)} />
                    <h2 className="mb-6 text-xl">Choose Category</h2>
                    <div className="flex justify-end">
                        <CustomButton className="bg-green-500 hover:bg-green-700" label="Next" onClick={() => setCurrentStep(2)} />
                    </div>
                </>
            ) : currentStep === 2 ? (
                <>
                    <h2 className="text-xl mb-6">Describe Your Place</h2>
                    <div className="pt-3 pb-6 space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label>Title</label>
                            <input type="text" 
                            value={dataTitle} 
                            onChange={(e) => setDataTitle(e.target.value)} 
                            className="border border-gray-600 rounded-xl w-full p-1"/>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Description</label>
                            <textarea 
                            value={dataDescription} 
                            onChange={(e) => setDataDescription(e.target.value)} 
                            className="border border-gray-600 rounded-xl w-full p-4 h-[200px] "/>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <CustomButton className="mx-4 bg-black hover:bg-gray-800" label="Previous" onClick={() => setCurrentStep(1)} />
                        <CustomButton className="bg-green-500 hover:bg-green-700" label="Next" onClick={() => setCurrentStep(3)} />
                    </div>
                </>
            ) : currentStep === 3 ?(

                <>
                    <h1 className="text-xl mb-6">Details</h1>
                    <div className="pt-3 pb-6 space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label>Price per night</label>
                            <input type="number" 
                            value={dataPrice} 
                            onChange={(e) => setDataPrice(e.target.value)} 
                            className="border border-gray-600 rounded-xl w-full p-1"/>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Bedrooms</label>
                            <input type="number" 
                            value={dataBedrooms} 
                            onChange={(e) => setDataBedrooms(e.target.value)} 
                            className="border border-gray-600 rounded-xl w-full p-1"/>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Bathrooms</label>
                            <input type="number" 
                            value={dataBathrooms} 
                            onChange={(e) => setDataBathrooms(e.target.value)} 
                            className="border border-gray-600 rounded-xl w-full p-1"/>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label>Maximum number of guests</label>
                            <input type="number" 
                            value={dataGuests} 
                            onChange={(e) => setDataGuests(e.target.value)} 
                            className="border border-gray-600 rounded-xl w-full p-1"/>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <CustomButton className="mx-4 bg-black hover:bg-gray-800" label="Previous" onClick={() => setCurrentStep(2)} />
                        <CustomButton className="bg-green-500 hover:bg-green-700" label="Next" onClick={() => setCurrentStep(4)} />
                    </div>
                </>
            ) : currentStep === 4 ?(
                <>
                    <h2 className="mb-4 text-xl">Location</h2>
                    <div className="pt-3 pb-6 space-y-4">
                        <SelectCountry value={dataCountry} onChange={(value) => setDataCountry(value as SelectCountryValue)} />
                    </div>
                    <div className="flex justify-between">
                        <CustomButton className="mx-4 bg-black hover:bg-gray-800" label="Previous" onClick={() => setCurrentStep(3)} />
                        <CustomButton className="bg-green-500 hover:bg-green-700" label="Next" onClick={() => setCurrentStep(5)} />
                    </div>
                </>
            ) : (
                <>
                <h2 className="mb-6 text-2xl">
                    Image
                </h2>
                <div className="pt-3 pb-6 space-y-4">
                    <div className="py-4 px-6 bg-black text-white rounded-xl">
                        <input type="file" accept="image/*" onChange={setImage}/>
                    </div>
                    {dataImage && (
                        <div className="w-[200px] h-[150px] relative">
                            <Image fill 
                                alt="Upload image" 
                                src={URL.createObjectURL(dataImage)}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    )}
                </div>
                {errors.map((error, index) => {
                    return (
                        <div key={index} className="p-5 mb-4 bg-airbnb text-white rounded-xl opacity-80">
                            {error}
                        </div>
                    )
                })}
                <div className="flex justify-between">
                        <CustomButton className="mx-3 bg-black hover:bg-gray-800" label="Previous" onClick={() => setCurrentStep(4)} />
                        <CustomButton className="bg-green-500 hover:bg-green-700" label="Submit" onClick={submitForm} />
                    </div>
                </>
            )}
        </>
    );

    return (
        <>
            <Modal 
                isOpen={addPropertyModal.isOpen}
                close={addPropertyModal.close} 
                label="Add Property"
                content={content}
            />
            
        </>
    );
};

export default AddPropertyModal;
