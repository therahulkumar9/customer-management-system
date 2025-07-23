"use client"

import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* MathToWord Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">
            MathToWord
          </h1>
          <p className="text-gray-600">Admin Panel</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
            Select Your Role
          </h2>

          <button
            onClick={() => router.push("/register?role=Adder")}
            className="w-full bg-green-500 hover:bg-green-600 cursor-pointer text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Adder - Add New Customers</span>
          </button>

          <button
            onClick={() => router.push("/register?role=Updater")}
            className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Updater - Manage Customers</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            MathToWord Customer Management System
          </p>
        </div>
      </div>
    </div>
  )
}
