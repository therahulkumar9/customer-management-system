"use client"

import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg w-full max-w-xs sm:max-w-md lg:max-w-lg">
        {/* MathToWord Logo/Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">
            MathToWord
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Admin Panel</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-800 mb-4 sm:mb-6">
            Choose Your Access Level
          </h2>

          {/* Staff Access Section */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="truncate">Staff Access</span>
            </h3>

            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => router.push("/register?role=Adder")}
                className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 cursor-pointer text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
                <span className="truncate">Adder - Add New Customers</span>
              </button>

              <button
                onClick={() => router.push("/register?role=Updater")}
                className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 cursor-pointer text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
                <span className="truncate">Updater - Manage Customers</span>
              </button>
            </div>
          </div>

          {/* Admin Access Section */}
          <div className="bg-red-50 p-3 sm:p-4 rounded-xl border border-red-200">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-red-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">Owner Access</span>
            </h3>

            <button
              onClick={() => router.push("/admin")}
              className="w-full cursor-pointer bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base mb-2"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="truncate">Admin - Full System Control</span>
            </button>

            <p className="text-xs text-red-600 text-center font-medium leading-tight">
              🔐 Owner Only - Requires Secret Authentication
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500 leading-tight">
            MathToWord Customer Management System
          </p>
        </div>
      </div>
    </div>
  )
}
