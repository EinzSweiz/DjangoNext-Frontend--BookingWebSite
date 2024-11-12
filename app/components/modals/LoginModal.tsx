"use client"

import Modal from "./Modal"

import { useState } from "react"
import useLoginModal from "@/app/hooks/useLoginModal"
import CustomButton from "@/app/forms/CustomButton"
const LoginModal = () => {
    const loginModal = useLoginModal()

    const content = (
        <>
        <form className="space-y-4">
            <input type="email" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" placeholder="Your e-mail address"></input>
            <input type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" placeholder="Your password "></input>
            <div className="p-1 bg-airbnb text-white rounded-xl opacity-80">
                The error message
            </div>
            <CustomButton 
                label="Submit"
                onClick={() => console.log('test')}
            />
        </form>
        </>
    )
    return (
        <Modal 
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            label="Login"
            content={content}
        />
    )
}

export default LoginModal