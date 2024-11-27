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
                console.log(response.user.pk)
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
        <Card className="mx-full max-w-full">
            <CardHeader>
                <CardDescription>
                    Enter your email and password to log in to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Email Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="ml-auto inline-block text-sm underline">
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

                    {/* Display errors if any */}
                    {errors.length > 0 && (
                        <div className="p-2 bg-red-600 text-white rounded-xl opacity-90">
                            {errors.join(', ')}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" onClick={submitLogin} className="w-full">
                        Login
                    </Button>
                    <Button variant="outline" className="w-full">
                        Login with Google
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
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
