'use client'

import { BellRing } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const notifications = [
  {
    title: 'We recieved your request!',
    description: 'We have sent a confirmation email to your address.',
  },
  {
    title: 'Confirmation pending.',
    description: 'Please confirm your email to complete the password change.',
  },
]

export default function ThankYouPage() {
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    // Simulate a delay for when the user sees the Switch being checked
    const timer = setTimeout(() => {
      setIsChecked(true) // This will change the state after 4 seconds (4000ms)
    }, 4000)

    // Clean up the timer if the component is unmounted
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-800">
      <Card className="w-[600px] p-8">
        <CardHeader>
          <CardTitle className="text-4xl font-semibold text-green-600 dark:text-green-400">
            We recieved your request to change the password!
          </CardTitle>
          <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
            Please confirm your email address by clicking the link we sent you.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center space-x-6 rounded-md border p-6">
            <BellRing className="h-8 w-8 text-sky-500" />
            <div className="flex-1 space-y-2">
              <p className="text-lg font-medium leading-none">Email Confirmation</p>
              <p className="text-sm text-muted-foreground">
                Confirm your email to complete the process.
              </p>
            </div>
            <Switch checked={isChecked} disabled={isChecked} />
          </div>

          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span className="flex h-4 w-4 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-2">
                  <p className="text-lg font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
