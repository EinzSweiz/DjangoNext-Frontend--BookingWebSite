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
    const [messages, setMessages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const hadnleSignupModal = () => {
        loginModal.close()
        signupModal.open()
    }

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            // Call your backend endpoint to get the Google login redirect URL
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/accounts/google/login/`);
    
            // Check if the response is okay
            if (!response.ok) {
                throw new Error('Failed to fetch the Google login URL');
            }
    
            // Log the raw response text for debugging
            const responseText = await response.text();
            console.log('Raw response text:', responseText);
    
            // Try parsing the response as JSON
            const data = JSON.parse(responseText);
            console.log('Parsed response:', data);
    
            // Check if the redirect URL is present in the response
            if (data?.redirect_url) {
                window.location.href = data.redirect_url;
            } else {
                throw new Error('No redirect URL provided by the backend.');
            }
        } catch (err) {
            console.error('Error during Google login:', err);
            setLoading(false);
        }
    };

    const submitLogin = async () => {
        const formData = {
            email: email,
            password: password,
        }
        try {
            const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(formData))
            if (response.access) {
                loginModal.close()
                console.log('API Response:', response)
                console.log('User ID:', response.user.pk)
                handleLogin(response.user.pk, response.access, response.refresh)
                router.push('/')
                setTimeout(() => {
                    window.location.reload()
                }, 200)
            } else {
                const tmpErrors: string[] = Object.values(response).map((error: any) => error)
                setErrors(tmpErrors)
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
                setIsResetMode(false)
                router.push('/thankyou')
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
                    {errors.length > 0 && (
                        <div className="p-1 bg-red-600 text-white rounded-xl opacity-90">
                            {errors.join(', ')}
                        </div>
                    )}
                    {messages.length > 0 && (
                        <div className="p-1 bg-green-600 text-white rounded-xl opacity-90">
                            {messages.join(', ')}
                        </div>
                    )}
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
                    {isResetMode ? (
                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                        <Button
                            type="button"
                            onClick={() => setIsResetMode(false)}
                            className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900 py-2 px-6 text-lg sm:flex-1"
                        >
                            Back to Login
                        </Button>
                        <Button
                            type="submit"
                            onClick={handlePasswordResetRequest}
                            className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900 py-2 px-6 text-lg sm:flex-1"
                        >
                            Request Password Reset
                        </Button>
                    </div>
                    
                    
                    ) : (
                        <>
                            <Button type="submit" onClick={submitLogin} className="w-full">
                                Login
                            </Button>
                            <Button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900"
                            >
                                Login with google <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                                <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                            </svg>
                            </Button>
                        </>
                    )}
                </form>
                {!isResetMode && (
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
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
