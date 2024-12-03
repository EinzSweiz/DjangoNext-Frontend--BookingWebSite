"use client"

import Modal from "./Modal"
import { useState } from "react"
import useLoginModal from "@/app/hooks/useLoginModal"
import CustomButton from "@/app/forms/CustomButton"
import apiService from "@/app/services/apiService"
import { useRouter } from "next/navigation"
import { handleLogin } from "@/app/lib/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import useSignupModal from "@/app/hooks/useSignupModal"

const LoginModal = () => {
    const signupModal = useSignupModal()
    const loginModal = useLoginModal()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<string[]>([])
    const [resetEmail, setResetEmail] = useState('')
    const [isResetMode, setIsResetMode] = useState(false)
    const router = useRouter()

    const hadnleSignupModal = () => {
        loginModal.close()
        signupModal.open()
    }

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
                setTimeout(() => {
                    window.location.reload()
                }, 200)
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

    const handlePasswordResetRequest = async () => {
        const formData = { email: resetEmail }
        try {
            const response = await apiService.postWithoutToken('/api/auth/password/reset/', JSON.stringify(formData))
            if (response) {
                setIsResetMode(false)  // Reset the mode after success
                alert('Check your email for password reset instructions')
            } else {
                setErrors(['Failed to send reset email. Please try again later.'])
                setTimeout(() => setErrors([]), 2000)
            }
        } catch (err) {
            console.error('Password reset error:', err)
            setErrors(['An unexpected error occurred. Please try again later.'])
        }
    }

    const content = (
        <Card className="mx-full max-w-full">
            <CardHeader>
                <CardDescription>
                    {isResetMode
                        ? 'Enter your email to reset your password'
                        : 'Enter your email and password to log in to your account'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Display errors if any */}
                    {errors.length > 0 && (
                        <div className="p-1 bg-red-600 text-white rounded-xl opacity-90">
                            {errors.join(', ')}
                        </div>
                    )}
                    {/* Email Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={isResetMode ? resetEmail : email}
                            onChange={(e) => isResetMode ? setResetEmail(e.target.value) : setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input (only for login) */}
                    {!isResetMode && (
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="ml-auto inline-block text-sm underline" onClick={() => setIsResetMode(true)}>
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" onClick={isResetMode ? handlePasswordResetRequest : submitLogin} className="w-full">
                        {isResetMode ? 'Request Password Reset' : 'Login'}
                    </Button>
                </form>

                {!isResetMode && (
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="#" onClick={hadnleSignupModal} className="underline">
                            Sign up
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    )

    return (
        <Modal 
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            label={isResetMode ? 'Password Reset' : 'Login'}
            content={content}
        />
    )
}

export default LoginModal
