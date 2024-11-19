import { create } from "zustand";

export type SearchQuery = {
    country: string | undefined
    checkin: Date | undefined
    checkout: Date | undefined
    guests: number
    bathrooms: number
    bedrooms: number
    category: string
}

interface SearchModalStore {
    isOpen: boolean
    open: (step: string) => void
    close: () => void
    step: string
    query: SearchQuery
    setQuery: (query: SearchQuery) => void 
}


const useSearchModal =  create<SearchModalStore>((set) => ({
    isOpen: false,
    open: (step) => set({isOpen: true, step:step}),
    close: () => set({isOpen: false}),
    step: '',
    query: {
        country: undefined,
        checkin: undefined,
        checkout: undefined,
        guests: 1,
        bathrooms: 0,
        bedrooms: 0,
        category: ''
    },
    setQuery: (query: SearchQuery) => set({query: query})
}))

export default useSearchModal