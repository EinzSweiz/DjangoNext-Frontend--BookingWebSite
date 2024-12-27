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
}: {
  password: string;
  setPassword: (value: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor="password">Password</Label>
        {/* Example 'Forgot password' link (remove if not needed) */}
        {/* <Link
          href="#"
          className="ml-auto inline-block text-sm underline"
          onClick={() => console.log("Forgot password clicked")}
        >
          Forgot your password?
        </Link> */}
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
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
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
        // Save credentials in local storage, context, or however you manage them
        handleLogin(response.user.pk, response.access, response.refresh);

        loginModal.close();
        router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        // Gather errors from response
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
        setTimeout(() => setErrors([]), 1000);
        loginModal.close();
        router.push("/password_change_message");
      } else {
        setErrors(["Failed to send reset email. Please try again later."]);
        setTimeout(() => setErrors([]), 2000);
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setErrors(["An unexpected error occurred. Please try again later."]);
    }
  };

  // ----------------------------------------------------------------
  // JSX layout inside the modal
  // ----------------------------------------------------------------
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
          {errors.length > 0 && (
            <div className="p-1 bg-red-600 text-white rounded-xl opacity-90">
              {errors.join(", ")}
            </div>
          )}
          {messages.length > 0 && (
            <div className="p-1 bg-green-600 text-white rounded-xl opacity-90">
              {messages.join(", ")}
            </div>
          )}
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
            />
          </div>
          {!isResetMode && (
            <PasswordField password={password} setPassword={setPassword} />
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
              <Button
                type="submit"
                onClick={submitLogin}
                className="w-full bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-800"
              >
                Login
              </Button>
              <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full mt-4 bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
              >
                Login with Google
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  className="ml-2 inline-block"
                >
                  <path
                    fill="#fbc02d"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#e53935"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4caf50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1565c0"
                    d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              </Button>
            </>
          )}
        </form>
        {!isResetMode && (
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" onClick={handleSignupModal} className="underline">
              Sign up
            </Link>
          </div>
        )}
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
