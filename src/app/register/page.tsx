"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  IdentificationIcon,
  KeyIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import { Loader2 } from "lucide-react"
import { ApiResponse } from "@/types"

// Create a separate component for the form logic that uses useSearchParams
function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = (searchParams.get("role") as "Adder" | "Updater") || "Adder"

  const [mode, setMode] = useState<"register" | "login">("register")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    secretCode: "",
    name: "",
    email: "",
  })
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const url = mode === "register" ? "/api/register" : "/api/login"
      const body =
        mode === "register"
          ? { ...formData, role }
          : { username: formData.username, password: formData.password }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        router.push(role === "Adder" ? "/adder" : "/updater")
      } else {
        setMessage(data.message || "An error occurred")
      }
    } catch {
      setMessage("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleColor = () => {
    return role === "Adder" ? "green" : "blue"
  }

  const getRoleColorClasses = () => {
    const color = getRoleColor()
    return {
      bg: color === "green" ? "bg-green-500" : "bg-blue-500",
      hover: color === "green" ? "hover:bg-green-600" : "hover:bg-blue-600",
      text: color === "green" ? "text-green-600" : "text-blue-600",
      ring: color === "green" ? "focus:ring-green-500" : "focus:ring-blue-500",
      border: color === "green" ? "border-green-200" : "border-blue-200",
    }
  }

  const colorClasses = getRoleColorClasses()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 xl:p-10">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-indigo-600 mb-2">
              MathToWord
            </h1>
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800">
                {mode === "register" ? "Register" : "Login"} as {role}
              </h2>
              <div
                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm lg:text-base font-medium ${
                  role === "Adder"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {role === "Adder"
                  ? "Add new MathToWord customers"
                  : "Manage existing customers"}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 lg:space-y-5"
          >
            {/* Username Field */}
            <div>
              <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 ${colorClasses.ring} focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 ${colorClasses.ring} focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {mode === "register" && (
              <>
                {/* Full Name Field */}
                <div>
                  <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <IdentificationIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 ${colorClasses.ring} focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 ${colorClasses.ring} focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Secret Code Field */}
                <div>
                  <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Secret Code
                  </label>
                  <div className="relative">
                    <KeyIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="password"
                      name="secretCode"
                      value={formData.secretCode}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 ${colorClasses.ring} focus:border-transparent transition-all duration-200`}
                      placeholder="Enter the secret code provided by admin"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                    Contact your admin for the {role} secret code
                  </p>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full cursor-pointer ${colorClasses.bg} ${colorClasses.hover} disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl`}
            >
              {isLoading && (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              )}
              <span>
                {isLoading
                  ? "Processing..."
                  : mode === "register"
                  ? "Register"
                  : "Login"}
              </span>
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() =>
                setMode(mode === "register" ? "login" : "register")
              }
              className={`cursor-pointer ${colorClasses.text} hover:underline text-xs sm:text-sm lg:text-base font-medium transition-colors duration-200`}
            >
              {mode === "register"
                ? "Already have account? Login"
                : "Need account? Register"}
            </button>
          </div>

          {/* Back Button */}
          <div className="mt-3 sm:mt-4 text-center">
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer inline-flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-gray-700 text-xs sm:text-sm lg:text-base font-medium transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              Back to Home
            </button>
          </div>

          {/* Error Message */}
          {message && (
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg sm:rounded-xl text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <ExclamationTriangleIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense wrapper
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-600">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
