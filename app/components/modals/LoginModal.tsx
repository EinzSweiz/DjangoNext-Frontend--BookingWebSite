"use client"
import Modal from "./Modal"
import { useState } from "react"
import useLoginModal from "@/app/hooks/useLoginModal"
import CustomButton from "@/app/forms/CustomButton"
import apiService from "@/app/services/apiService"
import { useRouter } from "next/navigation"
import { handleLogin } from "@/app/lib/actions"

const LoginModal = () => {
    const loginModal = useLoginModal()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<string[]>([])
    const router = useRouter()

    const submitLogin = async () => {
        const formData = {
            email: email,
            password: password
        }
        try {
            const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(formData))

            if (response.access) {
                loginModal.close()
                console.log('API Response:', response);
                console.log('User ID:', response.user.pk);
                handleLogin(response.user.pk, response.access, response.refresh)
                router.push('/')
            } else {
                const tmpErrors: string[] = Object.values(response).map((error: any) => error)
                setErrors(tmpErrors)

                // Clear errors after a delay
                setTimeout(() => {
                    setErrors([])
                }, 2000)
            }
        } catch (err) {
            console.error('Error during login:', err)
            setErrors(['An unexpected error occurred. Please try again later.'])
        }
    }

    const content = (
        <>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {/* Email Input */}
                <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" 
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
                    placeholder="Your e-mail address" 
                    value={email} 
                />

                {/* Password Input */}
                <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    type="password" 
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
                    placeholder="Your password" 
                    value={password} 
                />

                {/* Display errors if any */}
                {errors.length > 0 && (
                    <div className="p-2 bg-red-600 text-white rounded-xl opacity-90">
                        {errors.join(', ')}
                    </div>
                )}

                {/* Submit Button */}
                <CustomButton 
                    label="Submit"
                    onClick={submitLogin}
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
