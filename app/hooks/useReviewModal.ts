import { create } from "zustand";

interface Review {
    id: string;
    user: { id: string; name: string; avatar_url: string };
    text: string;
    created_at: string;
}

interface ReviewModalStore {
    isOpen: boolean;
    review: Review | null;
    open: (review: Review) => void;
    close: () => void;
}

const useReviewModal = create<ReviewModalStore>((set) => ({
    isOpen: false,
    review: null,
    open: (review: Review) => set({ isOpen: true, review }),
    close: () => set({ isOpen: false, review: null }),
}));

export default useReviewModal;
