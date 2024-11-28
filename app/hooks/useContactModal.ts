import { create } from "zustand"

interface ContactStore {
    isOpen: boolean
    open: () => void
    close: () => void
}

const useContactModal = create<ContactStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}))

export default useContactModal
