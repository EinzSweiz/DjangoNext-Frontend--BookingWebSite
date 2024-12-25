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
import { useEffect } from "react";

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
    const [showErrors, setShowErrors] = useState(true);
    const [extraImages, setExtraImages] = useState<File[]>([]); // Handle extra images
    const router = useRouter()

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]); // Clear errors
            }, 4000);

            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [errors]);


    const setCategory = (category: string) => {
        setDataCategory(category);
    };

    const setImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const tmpImage = event.target.files[0];
            
            // Allow images up to 40MB
            const maxSize = 30 * 1024 * 1024; // 40MB
            if (tmpImage.size > maxSize) {
                setErrors((prevErrors) => [...prevErrors, 'Image size exceeds 30MB limit.']);
                return;
            }
    
            setDataImage(tmpImage);
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
        extraImages.forEach((image) => {
            formData.append("extra_images", image);
        });

        try {
            const response = await apiService.post('/api/properties/create/', formData);
            if (response.success) {
                router.push('/?added=true');
                addPropertyModal.close();
            } else {
                const tmpErrors: string[] = Object.values(response).map((error: any) => {
                    return error;
                });
                setErrors(tmpErrors);
            }
        } catch (err) {
            console.error('Error submitting form', err);
        }
    }
};

    const content = (
        <>
           {errors.length > 0 && (
                <div className="mb-4">
                    {errors.map((error, index) => (
                        <p key={index} className="text-red-500 text-sm font-medium text-center">
                            {error}
                        </p>
                    ))}
                </div>
            )}
            {currentStep === 1 ? (
                <>
                    <Categories dataCategory={dataCategory} setCategory={(category) => setCategory(category)} />
                    <h2 className="mb-6 text-xl text-center">Choose Category</h2>
                    <div className="flex justify-end">
                        <CustomButton className="bg-green-500 hover:bg-green-700" label="Next" onClick={() => setCurrentStep(2)} />
                    </div>
                </>
            ) : currentStep === 2 ? (
                <>
                    <h2 className="text-xl mb-6 text-center">Describe Your Place</h2>
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
                    <h1 className="text-xl mb-6 text-center">Details</h1>
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
                    <h2 className="mb-4 text-xl text-center">Location</h2>
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
                  <h2 className="mb-4 text-lg font-semibold text-center">Upload Images</h2>
                    <div className="space-y-6">
                        {/* Main Image Upload */}
                        <div className="border border-gray-600 rounded-lg p-4 bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <label className="block text-base text-gray-200 mb-4 text-center">Main Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={setImage}
                            />
                            {dataImage && (
                                <div className="mt-4 flex justify-center">
                                    <div className="relative w-[120px] h-[80px] sm:w-[150px] sm:h-[100px] border border-gray-600 rounded-lg overflow-hidden shadow-md">
                                        <Image fill alt="Uploaded main image" src={URL.createObjectURL(dataImage)} className="object-cover" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Extra Images Upload */}
                        <div className="border border-gray-600 rounded-lg p-4 bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <label className="block text-base text-gray-200 mb-4 text-center">Extra Images (Max: 4)</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={(event) => {
                                    if (event.target.files) {
                                        const files = Array.from(event.target.files);
                                        const maxFiles = 4;
                                        if (files.length + extraImages.length > maxFiles) {
                                            setErrors((prevErrors) => [
                                                ...prevErrors,
                                                `You can only upload a maximum of ${maxFiles} images.`,
                                            ]);
                                            return;
                                        }
                                        setExtraImages([...extraImages, ...files.slice(0, maxFiles - extraImages.length)]);
                                    }
                                }}
                            />
                            {extraImages.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-gray-400 text-sm text-center mb-4">Previews</h3>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3">
                                        {extraImages.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] border border-gray-600 rounded-lg overflow-hidden shadow-md mx-auto"
                                            >
                                                <Image
                                                    fill
                                                    alt={`Extra Image ${index + 1}`}
                                                    src={URL.createObjectURL(file)}
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {extraImages.length === 4 && (
                                <p className="text-green-400 text-center text-sm mt-2">Maximum of 4 images uploaded.</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
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
