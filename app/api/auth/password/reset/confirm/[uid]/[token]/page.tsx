'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import apiService from '@/app/services/apiService'  // Adjust path if necessary
import { Button } from '@/components/ui/button' // Adjust path if necessary
import { Input } from '@/components/ui/input' // Adjust path if necessary
import { Label } from '@/components/ui/label' // Adjust path if necessary

type Params = Promise<{uid: string, token: string}>

const PasswordReset = ({params}: {params: Params}) => {
    const [uid, setUid] = useState<string | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<string[]>([])
    const [message, setMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        const getParams = async () => {
            const handleParams = await params
            setUid(handleParams.uid)
            setToken(handleParams.token)
        }

        getParams()
    }, [params])

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setErrors(['Passwords do not match.'])
            return
        }

        // Prepare form data
        const formData = {
            new_password1: newPassword,
            new_password2: confirmPassword,
            uid: uid, // Include UID
            token: token, // Include token
        }

        try {
            // Send request to reset the password
            const response = await apiService.postWithoutToken(
                `/api/auth/password/reset/confirm/${uid}/${token}/`,
                JSON.stringify(formData), false
            )
            console.log('Response:', response)
            if (response.message === "Password has been reset successfully.") {
                setMessage(response.message)
                setErrors([])
                setTimeout(() => {router.push('/')}, 2000)
            } else {
                setErrors([response.error || 'Failed to reset the password.'])
            }
        } catch (err) {
            console.error('Error during password reset:', err)
            setErrors(['An error occurred while resetting your password.'])
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>

            {/* Display any error or success messages */}
            {errors.length > 0 && (
                <div className="p-2 text-red-500 rounded mb-4">
                    {errors.join(', ')}
                </div>
            )}
            {message && (
                <div className="p-2 text-green-500 rounded mb-4">
                    {message}
                </div>
            )}

            {/* Password reset form */}
            <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <Button type="submit" className="w-full">Reset Password</Button>
            </form>
        </div>
    )
}

export default PasswordReset
