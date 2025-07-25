"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  UserIcon,
  LockClosedIcon,
  KeyIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline"
import { Loader2 } from "lucide-react"
import { ApiResponse } from "@/types"

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    secretCode: "",
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
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        router.push("/admin")
      } else {
        setMessage(data.message || "Login failed")
      }
    } catch {
      setMessage("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl p-4 sm:p-6 lg:p-8 xl:p-10">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-indigo-100 p-2 sm:p-3 rounded-full">
              <ShieldCheckIcon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
            MathToWord
          </h1>
          <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-700 mb-1">
            Admin Panel
          </h2>
          <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-red-100 text-red-700">
            <span className="text-xs sm:text-sm lg:text-base font-medium">
              🔒 Owner Access Only
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4 lg:space-y-6"
        >
          {/* Admin Username Field */}
          <div>
            <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1 sm:mb-2">
              Admin Username
            </label>
            <div className="relative">
              <UserIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter admin username"
              />
            </div>
          </div>

          {/* Admin Password Field */}
          <div>
            <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1 sm:mb-2">
              Admin Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          {/* Admin Secret Code Field */}
          <div>
            <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1 sm:mb-2">
              Admin Secret Code
            </label>
            <div className="relative">
              <KeyIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="password"
                name="secretCode"
                value={formData.secretCode}
                onChange={handleInputChange}
                required
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter admin secret code"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
              🛡️ Owner-only secret code for maximum security
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {isLoading && (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            )}
            <span>{isLoading ? "Signing In..." : "🔐 Sign In as Admin"}</span>
          </button>
        </form>

        {/* Back Button */}
        <div className="mt-4 sm:mt-6 text-center">
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
  )
}
