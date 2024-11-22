'use client'
import Modal from "./Modal"
import { ChangeEvent, useState, useEffect } from "react"
import useProfileModal from "@/app/hooks/useProfileModal"
import CustomButton from "@/app/forms/CustomButton"
import apiService from "@/app/services/apiService"
import { useRouter } from "next/navigation"
import Image from "next/image"

const ProfileModal = () => {
    const profileModal = useProfileModal()
    const [dataname, setDataname] = useState<string>('')
    const [dataImage, setDataImage] = useState<File | null>(null)
    const [currentUserImage, setCurrentUserImage] = useState<string | null>(null) // Store the current user's image URL
    const [errors, setErrors] = useState<string[]>([])
    const router = useRouter()

    // Fetch user data when modal is opened
    useEffect(() => {
        if (profileModal.isOpen) {
            // Fetch the current user data
            const fetchUserData = async () => {
                try {
                    const response = await apiService.get('/api/auth/profile')
                    if (response.success) {
                        setDataname(response.user.name || '')
                        setCurrentUserImage(response.user.avatar || null)
                    } else {
                        console.error("Failed to fetch user data")
                    }
                } catch (err) {
                    console.error("Error fetching user data:", err)
                }
            }
            fetchUserData()
        }
    }, [profileModal.isOpen]) // Only fetch user data when the modal is opened

    const setImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const tmpImage = event.target.files[0]
            setDataImage(tmpImage)
        }
    }

    const submitForm = async () => {
        if (dataname || dataImage) {
            const formData = new FormData()
            if (dataname) {
                formData.append('name', dataname)
            }
            if (dataImage) {
                formData.append('avatar', dataImage)
            }
            try {
                const response = await apiService.post('/api/auth/profile/update/', formData)
                if (response.success) {
                    console.log('Profile updated successfully')
                    router.push('/')
                    profileModal.close()
                } else {
                    const tmpErrors: string[] = Object.values(response).map((error: any) => error)
                    setErrors(tmpErrors)
                }
            } catch (err) {
                console.error('Error updating profile', err)
            }
        }
    }

    const content = (
        <>
            <h2 className="mb-4 text-2xl">Edit Profile</h2>
            <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label>Username</label>
                    <input
                        type="text"
                        value={dataname}
                        onChange={(e) => setDataname(e.target.value)}
                        className="border border-gray-600 rounded-xl w-full p-1"
                        placeholder="New username"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label>Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={setImage}
                        className="border border-gray-600 rounded-xl w-full p-1"
                    />
                </div>
                
                {/* Show current profile image or uploaded image */}
                <div className="w-[200px] h-[150px] relative">
                    {dataImage ? (
                        <Image 
                            fill 
                            alt="Upload image" 
                            src={URL.createObjectURL(dataImage)}
                            className="w-full h-full object-cover rounded-xl"
                        />
                    ) : (
                        currentUserImage && (
                            <Image 
                                fill 
                                alt="Current avatar" 
                                src={currentUserImage}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        )
                    )}
                </div>
                
                {/* Show errors if any */}
                {errors.map((error, index) => (
                    <div key={index} className="p-5 mb-4 bg-red-500 text-white rounded-xl opacity-80">
                        {error}
                    </div>
                ))}
                
                <div className="flex justify-between">
                    <CustomButton
                        className="mx-3 bg-black hover:bg-gray-800"
                        label="Close"
                        onClick={profileModal.close}
                    />
                    <CustomButton
                        className="bg-green-500 hover:bg-green-700"
                        label="Save Changes"
                        onClick={submitForm}
                    />
                </div>
            </div>
        </>
    )

    return (
        <Modal isOpen={profileModal.isOpen} close={profileModal.close} label="Edit Profile" content={content} />
    )
}

export default ProfileModal
