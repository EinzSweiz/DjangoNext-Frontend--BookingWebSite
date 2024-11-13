"use client"
import Modal from "./Modal"
import { useState } from "react"
import { useRouter } from "next/navigation"
import useSignupModal from "@/app/hooks/useSignupModal"
import CustomButton from "@/app/forms/CustomButton"
import apiService from "@/app/services/apiService"

const SignupModal = () => {
    const router = useRouter()
    const signupModal = useSignupModal()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [errors, setErrors] = useState<string[]>([]) 

    // Handle form submission
    const submitSignup = async () => {
        const formData = {
            name: name,
            email: email,
            password1: password1,
            password2: password2
        }

        try {
            const response = await apiService.post('/api/auth/register/', JSON.stringify(formData))

            if (response.access) {
                // Handle successful signup
                signupModal.close()
                router.push('/')
            } else {
                // Handle error response
                const tmpErrors: string[] = Object.values(response).map((error: any) => error)
                setErrors(tmpErrors)

                // Clear errors after a delay
                setTimeout(() => {
                    setErrors([])
                }, 2000)
            }
        } catch (err) {
            console.error('Error during signup:', err)
        }
    }

    const content = (
        <>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}> {/* Prevent native form submit */}
            <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
                placeholder="Your username"
                required
            />
            <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
                placeholder="Your e-mail address"
                required
            />
            <input
                onChange={(e) => setPassword1(e.target.value)}
                type="password"
                className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
                placeholder="Your password"
                required
            />
            <input
                onChange={(e) => setPassword2(e.target.value)}
                type="password"
                className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
                placeholder="Repeat your password"
                required
            />

            {errors.map((error, index) => (
                <div key={`error_${index}`} className="p-2 bg-airbnb text-white rounded-xl opacity-80">
                    {error}
                </div>
            ))}
            
            {/* CustomButton now uses onClick to trigger submitSignup */}
            <CustomButton label="Register" onClick={submitSignup} />
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
