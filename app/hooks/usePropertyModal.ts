import { create } from "zustand"


interface PropertyModalStore {
    isOpen: boolean
    open: () => void
    close: () => void
}

const usePropertyModal = create<PropertyModalStore>((set) => ({
    isOpen: false,
    open: () => set({isOpen: true}),
    close: () => set({isOpen: false})
}))

export default usePropertyModal