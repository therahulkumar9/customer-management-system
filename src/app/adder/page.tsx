"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthStaff, ApiResponse, Customer } from "@/types"

interface CustomerFormData {
  name: string
  email: string
  phone: string
  location: string
  profession: string
  planName: string
  startDate: string
  endDate: string
  paymentScreenshot: string
  isCompanyMember: boolean
}

export default function AdderPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthStaff | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    planName: "",
    startDate: "",
    endDate: "",
    paymentScreenshot: "",
    isCompanyMember: false,
  })

  useEffect(() => {
    checkAuth()
    loadCustomers()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/me")
      const data: { user: AuthStaff | null } = await response.json()

      if (data.user?.role !== "Adder") {
        router.replace("/")
        return
      }

      setUser(data.user)
    } catch (error) {
      router.replace("/")
    } finally {
      setLoading(false)
    }
  }

  const loadCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      const data = await response.json()
      if (data.success) {
        setCustomers(data.data)
      }
    } catch (error) {
      console.error("Error loading customers:", error)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          location: formData.location || undefined,
          profession: formData.profession || undefined,
          plan: {
            name: formData.planName,
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
          paymentScreenshot: formData.paymentScreenshot,
          isCompanyMember: formData.isCompanyMember,
        }),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        setMessage("Customer added successfully! 🎉")
        setShowAddForm(false)
        loadCustomers() // Refresh customer list
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          location: "",
          profession: "",
          planName: "",
          startDate: "",
          endDate: "",
          paymentScreenshot: "",
          isCompanyMember: false,
        })
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage(data.message || "Failed to add customer")
        setTimeout(() => setMessage(""), 5000)
      }
    } catch (error) {
      setMessage("Network error occurred")
      setTimeout(() => setMessage(""), 5000)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                MathToWord - Adder Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Staff Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Your Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <span className="text-blue-600 font-medium">Username:</span>
              <p className="text-gray-800">{user.username}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <span className="text-green-600 font-medium">Role:</span>
              <p className="text-gray-800">{user.role}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <span className="text-purple-600 font-medium">Name:</span>
              <p className="text-gray-800">{user.name}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <span className="text-yellow-600 font-medium">Email:</span>
              <p className="text-gray-800">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 mr-4"
          >
            {showAddForm ? "✕ Cancel" : "+ Add New Customer"}
          </button>

          <button
            onClick={loadCustomers}
            className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("success")
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Add Customer Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Add New MathToWord Customer
            </h3>
            <form onSubmit={handleAddCustomer} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter customer's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="customer@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+91 95239 47981"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession/Organization
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Teacher, Student, Company Name, etc."
                />
              </div>

              {/* Plan Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  Subscription Plan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Name *
                    </label>
                    <select
                      title="select-plan"
                      name="planName"
                      value={formData.planName}
                      onChange={handleInputChange}
                      required
                      className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Plan</option>
                      <option value="Monthly">
                        Monthly – ₹499 (500 conversions)
                      </option>
                      <option value="3 Months">
                        3 Months – ₹1,349 (1,800 conversions)
                      </option>
                      <option value="6 Months">
                        6 Months – ₹2,599 (4,200 conversions)
                      </option>
                      <option value="Yearly">
                        Yearly – ₹4,799 (10,000 conversions)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      title="start-date"
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      title="end-date"
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Screenshot URL *
                </label>
                <input
                  type="url"
                  name="paymentScreenshot"
                  value={formData.paymentScreenshot}
                  onChange={handleInputChange}
                  required
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/payment-proof.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload payment screenshot to cloud storage and paste the
                  public URL
                </p>
              </div>

              <div className="flex items-center">
                <input
                  title="is-company-member"
                  type="checkbox"
                  name="isCompanyMember"
                  checked={formData.isCompanyMember}
                  onChange={handleInputChange}
                  className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  This is a company member (internal user)
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Add Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Customer List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              MathToWord Customers ({customers.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="text-xs text-gray-400">
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.plan.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(customer.plan.startDate).toLocaleDateString()}{" "}
                        - {new Date(customer.plan.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          new Date(customer.plan.endDate) > new Date()
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {new Date(customer.plan.endDate) > new Date()
                          ? "Active"
                          : "Expired"}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {customer.isCompanyMember ? "Company" : "Customer"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.addedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {customers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No customers yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start by adding your first MathToWord customer.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
