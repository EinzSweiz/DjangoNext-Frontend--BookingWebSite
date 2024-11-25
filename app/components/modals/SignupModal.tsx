"use client"

import Modal from "./Modal"
import { useState } from "react"
import { useRouter } from "next/navigation"
import useSignupModal from "@/app/hooks/useSignupModal"
import apiService from "@/app/services/apiService"
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

const SignupModal = () => {
  const router = useRouter()
  const signupModal = useSignupModal()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  // Handle form submission
  const submitSignup = async () => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password1', password1)
    formData.append('password2', password2)

    // Append avatar file if it's selected
    if (avatar) {
      formData.append('avatar', avatar)
    }

    try {
      const response = await apiService.postWithoutToken('/api/auth/register/', formData)

      if (response.access) {
        handleLogin(response.id, response.access, response.refresh)
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
    <Card className="mx-full max-w-full">
      <CardHeader>
        <CardDescription>
          Fill in the details to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Username Input */}
          <div className="grid gap-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="grid gap-2">
            <Label htmlFor="password1">Password</Label>
            <Input
              id="password1"
              type="password"
              placeholder="Your password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
          </div>

          {/* Repeat Password Input */}
          <div className="grid gap-2">
            <Label htmlFor="password2">Confirm Password</Label>
            <Input
              id="password2"
              type="password"
              placeholder="Repeat your password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>

          {/* Avatar Upload */}
          <div className="grid gap-2">
            <Label htmlFor="avatar">Upload Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          {/* Display errors if any */}
          {errors.length > 0 && (
            <div className="p-2 bg-red-600 text-white rounded-xl opacity-90">
              {errors.join(', ')}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" onClick={submitSignup} className="w-full">
            Register
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login here
          </Link>
        </div>
      </CardContent>
    </Card>
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
