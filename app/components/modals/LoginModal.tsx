"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Hooks
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";

// Services
import apiService from "@/app/services/apiService";

// Helpers
import { handleLogin } from "@/app/lib/actions";

// UI Components (Tailwind or your custom ones)
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

// Heroicons
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// ------------------------------------------------------------------
// PasswordField: A custom component that includes the eye icon toggle
// ------------------------------------------------------------------
function PasswordField({
  password,
  setPassword,
  setIsResetMode,
}: {
  password: string;
  setPassword: (value: string) => void;
  setIsResetMode: (value: boolean) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor="password">Password</Label>
        <Link
          href="#"
          className="ml-auto inline-block text-sm underline"
          onClick={() => setIsResetMode(true)} // Enable reset mode
        >
          Forgot your password?
        </Link>
      </div>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pr-10" // ensures space for the icon
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Toggle password visibility"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Main LoginModal component
// ------------------------------------------------------------------
export default function LoginModal() {
  // Hooks
  const loginModal = useLoginModal();
  const signupModal = useSignupModal();
  const router = useRouter();

  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);

  // UI states
  const [errors, setErrors] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Switch to sign-up modal
  const handleSignupModal = () => {
    loginModal.close();
    signupModal.open();
  };

  // Google Login example
  const handleGoogleLogin = () => {
    setLoading(true);
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_HOST}/accounts/google/login/?process=login`;
    } catch (err) {
      console.error("Error during Google login:", err);
      setLoading(false);
    }
  };

  // GitHub Login example
  const handleGithubLogin = () => {
    setLoading(true);
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_HOST}/accounts/github/login/`;
    } catch (err) {
      console.error("Error during GitHub login:", err);
      setLoading(false);
    }
  };

  // Submit Login
  const submitLogin = async () => {
    const formData = { email, password };
    try {
      const response = await apiService.postWithoutToken(
        "/api/auth/login/",
        JSON.stringify(formData)
      );
      if (response.access) {
        handleLogin(response.user.pk, response.access, response.refresh);

        loginModal.close();
        router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        const tmpErrors: string[] = Object.values(response).map(
          (error: any) => error
        );
        setErrors(tmpErrors);
        setTimeout(() => {
          setErrors([]);
        }, 2000);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setErrors(["An unexpected error occurred. Please try again later."]);
    }
  };

  // Request Password Reset
  const handlePasswordResetRequest = async () => {
    const formData = { email: resetEmail };
    try {
      const response = await apiService.postWithoutToken(
        "/api/auth/password/reset/",
        JSON.stringify(formData)
      );
      if (response) {
        setIsResetMode(false);
        setMessages(["Password reset email sent successfully."]);
        setTimeout(() => setMessages([]), 5000);
        router.push("/password_change_message");
        loginModal.close();
        router.push('/password_change_message')
      } else {
        setErrors(["Failed to send reset email."]);
        setTimeout(() => setErrors([]), 2000);
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setErrors(["An unexpected error occurred. Please try again later."]);
    }
  };

  const content = (
    <Card className="mx-full max-w-full">
      <CardHeader>
        <CardDescription>
          {isResetMode
            ? "Enter your email to reset your password"
            : "Enter your email and password to log in"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg shadow-sm">
              {errors.map((error, index) => (
                <p key={index} className="text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}
          {/* Success Messages */}
          {messages.length > 0 && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg shadow-sm">
              {messages.map((message, index) => (
                <p key={index} className="text-sm">
                  {message}
                </p>
              ))}
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
              onChange={(e) =>
                isResetMode ? setResetEmail(e.target.value) : setEmail(e.target.value)
              }
              required
              className="appearance-none border border-gray-300 dark:border-gray-600 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full px-4 py-3 transition-colors"
            />
          </div>
          {/* Password Field (Hidden in Reset Mode) */}
          {!isResetMode && (
            <PasswordField
              password={password}
              setPassword={setPassword}
              setIsResetMode={setIsResetMode}
            />
          )}
          {/* Reset Password Section */}
          {isResetMode ? (
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              {/* Back to Login Button */}
              <Button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="w-full sm:w-auto bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors py-2 px-6 text-lg sm:flex-1 rounded-lg shadow-sm"
              >
                Back to Login
              </Button>
              {/* Request Password Reset Button */}
              <Button
                type="submit"
                onClick={handlePasswordResetRequest}
                className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700 transition-colors py-2 px-6 text-lg sm:flex-1 rounded-lg shadow-sm flex items-center justify-center"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : null}
                Request Password Reset
              </Button>
            </div>
          ) : (
            <>
              <Button
                type="submit"
                onClick={submitLogin}
                className="w-full bg-green-500 text-white hover:bg-green-600 transition-colors py-2 px-6 rounded-lg shadow-sm"
              >
                Login
              </Button>
              <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full mt-4 bg-black text-white hover:bg-gray-800 transition-colors py-2 px-6 rounded-lg shadow-sm flex items-center justify-center"
              >
                {/* Google SVG Icon */}
                <span>Login with Google</span>

                <svg
                  className="w-5 h-5 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.2H42V20H24v8h11.3c-1.6 4-6 11.1-11.3 11.1-6.8 0-12.3-5.5-12.3-12.3S12.9 15.7 19.7 15.7c3.4 0 6.1 1.4 7.8 3.4l5.7-5.7C31.7 8.1 27.7 6 24 6 12.9 6 4.9 13 4.9 24s8 18 19.1 18c10.7 0 17.3-7.2 17.3-17.3 0-1.2-.1-2.3-.3-3.4z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.4 14.7l6.3-4.9C14.8 15.6 18.5 14 24 14c3.6 0 7.1 1.2 9.8 3.6l5.4-5.4C34.7 6.4 29.8 4 24 4 12.9 4 4.9 11.9 4.9 24s8 20 19.1 20c10.1 0 16.8-6 19.1-14h-18.6c-1.5 0-2.8-.6-3.8-1.6l-5.3-5.3c-1.2-1.2-1.2-3.1 0-4.3z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.4 0 10.2-1.8 14-5l-6.4-5c-2.2 1.5-5 2.4-7.6 2.4-5.2 0-9.6-3.5-11.2-8.3l-6.3 4.9C11.3 40.8 16.1 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.2l-6.3-4.9C36.8 14.4 33.4 12 29.7 12c-2.6 0-5.4 1-7.6 2.4l-6.4-5c3.8-3.2 8.6-5 14-5 7.9 0 12.7 3.2 16 10.2z"
                  />
                </svg>
                {/* Button Text */}
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      close={loginModal.close}
      label={isResetMode ? "Password Reset" : "Login"}
      content={content}
    />
  );
}
