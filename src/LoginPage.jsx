"use client"

import { useState } from "react"
import { signInWithGoogle } from "./firebase" // Adjust path as needed
import ParticleBackground from "./ParticleBackground"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            setError("")
            await signInWithGoogle()
            // The redirect should happen automatically via your auth state listener
        } catch (err) {
            console.error("Login error:", err)
            setError("Failed to sign in. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4">
            {/* Background effects */}
            <div className="fixed inset-0 z-0 opacity-30">
                <ParticleBackground />
            </div>

            {/* Login container */}
            <div className="w-full max-w-md z-10">
                {/* Logo and title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-2 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-600/20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-8 w-8 text-white"
                        >
                            <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v16.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
                            <path d="M3 7.6v16.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
                            <path d="M15 2v5h5" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
                        Qubit AI
                    </h1>
                    <p className="mt-2 text-gray-300">Your intelligent coding assistant</p>
                </div>

                {/* Login card */}
                <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-6 text-center">Sign in to continue</h2>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 text-red-400 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Sign in buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2.5 px-4 border border-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        Continue with Google
                                    </>
                                )}
                            </button>

                            {/* Additional sign-in options (disabled for now) */}
                            <button
                                disabled
                                className="w-full flex items-center justify-center gap-2 bg-gray-800 text-gray-500 font-medium py-2.5 px-4 border border-gray-700 rounded-lg cursor-not-allowed"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                                Continue with GitHub
                            </button>

                            <button
                                disabled
                                className="w-full flex items-center justify-center gap-2 bg-gray-800 text-gray-500 font-medium py-2.5 px-4 border border-gray-700 rounded-lg cursor-not-allowed"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                Continue with Email
                            </button>
                        </div>

                        {/* Terms and privacy */}
                        <p className="mt-6 text-xs text-center text-gray-400">
                            By continuing, you agree to our{" "}
                            <a href="#" className="text-blue-400 hover:underline">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-blue-400 hover:underline">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">New to Qubit AI?</span>
                            <a
                                href="#"
                                className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300"
                            >
                                Create an account
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3.5 w-3.5"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer links */}
                <div className="mt-8 text-center text-sm text-gray-400">
                    <div className="flex justify-center space-x-4">
                        <a href="#" className="hover:text-blue-400">
                            Help
                        </a>
                        <a href="#" className="hover:text-blue-400">
                            Status
                        </a>
                        <a href="#" className="hover:text-blue-400">
                            About
                        </a>
                    </div>
                    <p className="mt-4">© {new Date().getFullYear()} Qubit AI. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

