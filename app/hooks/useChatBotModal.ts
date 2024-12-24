import React from "react";
import { create } from "zustand";

interface ChatBot {
    isOpen: boolean;
    close: () => void;
    open: () => void;
}

const useChatBotModal = create<ChatBot>((set) => ({
    isOpen: false,
    close: () => set({isOpen: false}),
    open: () => set({isOpen: true})
}))

export default useChatBotModal