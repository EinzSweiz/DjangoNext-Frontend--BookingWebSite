"use client"

import React, { useCallback, useEffect, useState } from "react"

interface ModalProps {
    label: string
    content: React.ReactElement
    isOpen: boolean
    close: () => void
}

const Modal: React.FC<ModalProps> = ({
    label,
    content,
    isOpen,
    close,
}) => {
    const [showModel, setShowModel] = useState(isOpen)

    // Ensure `showModel` is updated whenever `isOpen` changes
    useEffect(() => {
        if (isOpen) {
            setShowModel(true)
        } else {
            setTimeout(() => setShowModel(false), 300) // Delay hiding modal for a smooth transition
        }
    }, [isOpen])

    const handleClose = useCallback(() => {
        close()
        setShowModel(false) // Update local state on close
    }, [close])

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            close()
            setShowModel(false)
        }
    }

    if (!showModel && !isOpen) {
        return null
    }

    return (
        <div className="flex items-center justify-center fixed inset-0 z-50 bg-black/60" onClick={handleOutsideClick}>
            <div className="relative w-[90%] md:w-[80%] lg:w-[700px] my-6 h-auto">
                <div className={`translate duration-600 h-full ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <div className="w-full h-auto rounded-xl relative flex flex-col bg-white dark:bg-black">
                        <header className="h-[60px] flex items-center p-6 rounded-t justify-center relative border-b">
                            <div className="p-3 absolute left-3 hover:text-airbnb rounded-full cursor-pointer" onClick={handleClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold">{label}</h2>
                        </header>
                        <section className="p-6">
                            {content}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
