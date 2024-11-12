"use client"
import Modal from "./Modal"

import { useState } from "react"
import useSignupModal from "@/app/hooks/useSignupModal"
import CustomButton from "@/app/forms/CustomButton"

const SignupModal = () => {
    const signupModal = useSignupModal()
    const content = (
        <>
        <form className="space-y-4">
            <input type="email" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" placeholder="Your e-mail address"/>
            <input type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" placeholder="Your password"/>
            <input type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" placeholder="Repeat your password"/>
            <div className="p-2 bg-airbnb text-white rounded-xl opacity-80">
                Error messages
            </div>
            <CustomButton label="Register" onClick={() => console.log('Register')}/>

        </form>
        </>
    )
    return (
        <Modal 
            isOpen={signupModal.isOpen}
            close={signupModal.close}
            label="Register"
            content={content}
        />
    )
}

export default SignupModal