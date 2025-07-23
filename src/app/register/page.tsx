"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 mb-2">
            MathToWord
          </h1>
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === "register" ? "Register" : "Login"} as {role}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {role === "Adder"
              ? "Add new MathToWord customers"
              : "Manage existing customers"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Code
                </label>
                <input
                  type="password"
                  name="secretCode"
                  value={formData.secretCode}
                  onChange={handleInputChange}
                  required
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter the secret code provided by admin"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contact your admin for the {role} secret code
                </p>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 cursor-pointer hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            {isLoading
              ? "Processing..."
              : mode === "register"
              ? "Register"
              : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === "register" ? "login" : "register")}
            className="text-indigo-600 hover:text-indigo-800 underline text-sm cursor-pointer"
          >
            {mode === "register"
              ? "Already have account? Login"
              : "Need account? Register"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-500 cursor-pointer hover:text-gray-700 text-sm"
          >
            ← Back to Home
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

// Main component with Suspense wrapper
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
