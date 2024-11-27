import { create } from "zustand";

interface FullImageModalStore {
    isOpen: boolean;
    selectedImage: string | null;
    open: () => void;
    close: () => void;
    setSelectedImage: (imageUrl: string | null) => void;
}

const useFullImageModal = create<FullImageModalStore>((set) => ({
    isOpen: false,
    selectedImage: null,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false, selectedImage: null }), // Clear the selected image on close
    setSelectedImage: (imageUrl) => set({ selectedImage: imageUrl })
}));

export default useFullImageModal;
