import { create } from "zustand";


interface ProfileStore {
    isOpen: boolean
    open: () => void
    close: () => void
}


const useProfileModal = create<ProfileStore>((set) => ({
    isOpen: false,
    open: () => set({isOpen: true}),
    close: () => set({isOpen: false})
}))

export default useProfileModal