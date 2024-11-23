'use client';

import Modal from './Modal';
import { ChangeEvent, useState, useEffect } from 'react';
import useProfileModal from '@/app/hooks/useProfileModal';
import CustomButton from '@/app/forms/CustomButton';
import apiService from '@/app/services/apiService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUserId } from '@/app/lib/actions';

const ProfileModal = () => {
    const profileModal = useProfileModal();
    const [dataname, setDataname] = useState<string>(''); // User's name
    const [dataImage, setDataImage] = useState<File | null>(null); // Image selected for upload
    const [currentUserImage, setCurrentUserImage] = useState<string | null>(null); // Existing avatar URL
    const [errors, setErrors] = useState<string[]>([]); // Error messages
    const router = useRouter();

    // Fetch user data when modal opens
    useEffect(() => {
        if (profileModal.isOpen) {
            const fetchUserData = async () => {
                try {
                    const userid = await getUserId();
                    const response = await apiService.getWithToken(`/api/auth/profile/${userid}/`);
                    console.log('Fetched user data:', response); // Debug log
                    setDataname(response.name || ''); // Set username
                    setCurrentUserImage(response.avatar_url || null); // Set current avatar
                } catch (err) {
                    console.error('Error fetching user data:', err);
                }
            };
            fetchUserData();
        }
    }, [profileModal.isOpen]);

    const fileToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    // Set uploaded image
    const setImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const tmpImage = event.target.files[0];
            setDataImage(tmpImage); // Save file for upload
        }
    };

    // Submit profile update
    const submitForm = async () => {
        if (dataname || dataImage) {
            const formData = new FormData();
            if (dataname) {
                formData.append('name', dataname);
            }
            if (dataImage) {
                formData.append('avatar', dataImage);
        }
    
            try {
                const userId = await getUserId()
                const response = await apiService.put(`/api/auth/profile/update/${userId}`, formData);
                console.log('Response:', response)
                if (response) {
                    console.log('Profile updated successfully');
                    router.push('/'); // Navigate to home or refresh
                    profileModal.close(); // Close modal
                } else {
                    const tmpErrors: string[] = Object.values(response).map((error: any) => error);
                    setErrors(tmpErrors); // Show errors
                }
            } catch (err) {
                console.error('Error updating profile:', err);
            }
        }
    };
    

    // Modal content
    const content = (
        <>
            <h2 className="mb-4 text-2xl">Edit Profile</h2>
            <div className="space-y-4">
                {/* Username input */}
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

                {/* Profile image input */}
                <div className="flex flex-col space-y-2">
                    <label>Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={setImage}
                        className="border border-gray-600 rounded-xl w-full p-1"
                    />
                </div>

                {/* Display current or uploaded profile image */}
                <div className="w-[200px] h-[250px] relative">
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

                {/* Error messages */}
                {errors.map((error, index) => (
                    <div
                        key={index}
                        className="p-5 mb-4 bg-red-500 text-white rounded-xl opacity-80"
                    >
                        {error}
                    </div>
                ))}

                {/* Action buttons */}
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
    );

    // Render modal
    return (
        <Modal
            isOpen={profileModal.isOpen}
            close={profileModal.close}
            label="Edit Profile"
            content={content}
        />
    );
};

export default ProfileModal;