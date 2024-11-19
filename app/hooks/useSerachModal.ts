import { create } from "zustand";

export type SearchQuery = {
    country: string
    checkin: Date | null
    checkout: Date | null
    guests: number
    bathrooms: number
    bedrooms: number
    category: string
}

interface SerachModalStore {
    isOpen: boolean
    open: () => void
    close: () => void
    query: SearchQuery
    setQuery: (query: SearchQuery) => void 
}


const useSerachModal =  create<SerachModalStore>((set) => ({
    isOpen: false,
    open: () => set({isOpen: true}),
    close: () => set({isOpen: false}),
    query: {
        country: '',
        checkin: null,
        checkout: null,
        guests: 1,
        bathrooms: 0,
        bedrooms: 0,
        category: ''
    },
    setQuery: (query: SearchQuery) => set({query: query})
}))

export default useSerachModal