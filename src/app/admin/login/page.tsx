"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MathToWord</h1>
          <h2 className="text-xl font-semibold text-gray-700">Admin Panel</h2>
          <p className="text-sm text-gray-500 mt-2">Owner Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter admin username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter admin password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Secret Code
            </label>
            <input
              type="password"
              name="secretCode"
              value={formData.secretCode}
              onChange={handleInputChange}
              required
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter admin secret code"
            />
            <p className="text-xs text-gray-500 mt-1">
              Owner-only secret code for maximum security
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? "Signing In..." : "Sign In as Admin"}
          </button>
        </form>

        <div className="mt-6 text-center">
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
