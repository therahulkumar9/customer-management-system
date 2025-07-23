"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthStaff, ApiResponse, Customer } from "@/types"

export default function UpdaterPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthStaff | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)

  useEffect(() => {
    checkAuth()
    loadCustomers()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/me")
      const data: { user: AuthStaff | null } = await response.json()

      if (data.user?.role !== "Updater") {
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

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowEditForm(true)
  }

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer) return

    try {
      const response = await fetch("/api/customers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: editingCustomer._id,
          ...editingCustomer,
        }),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        setMessage("Customer updated successfully! ✅")
        setShowEditForm(false)
        setEditingCustomer(null)
        loadCustomers()
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage(data.message || "Failed to update customer")
        setTimeout(() => setMessage(""), 5000)
      }
    } catch (error) {
      setMessage("Network error occurred")
      setTimeout(() => setMessage(""), 5000)
    }
  }

  const handleDeleteCustomer = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete customer "${customer.name}"? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      const response = await fetch("/api/customers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer._id }),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        setMessage("Customer deleted successfully! 🗑️")
        loadCustomers()
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage(data.message || "Failed to delete customer")
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editingCustomer) return

    const { name, value, type } = e.target

    if (name.startsWith("plan.")) {
      const planField = name.split(".")[1]
      setEditingCustomer((prev) =>
        prev
          ? {
              ...prev,
              plan: { ...prev.plan, [planField]: value },
            }
          : null
      )
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setEditingCustomer((prev) => (prev ? { ...prev, [name]: checked } : null))
    } else {
      setEditingCustomer((prev) => (prev ? { ...prev, [name]: value } : null))
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
                MathToWord - Updater Dashboard
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
            <div className="bg-purple-50 p-3 rounded">
              <span className="text-purple-600 font-medium">Role:</span>
              <p className="text-gray-800">{user.role}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <span className="text-green-600 font-medium">Name:</span>
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
            onClick={loadCustomers}
            className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            🔄 Refresh Customer List
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("success") ||
              message.includes("✅") ||
              message.includes("🗑️")
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Edit Customer Form */}
        {showEditForm && editingCustomer && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Edit Customer: {editingCustomer.name}
            </h3>
            <form onSubmit={handleUpdateCustomer} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    title="name"
                    type="text"
                    name="name"
                    value={editingCustomer.name}
                    onChange={handleInputChange}
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    title="email"
                    type="email"
                    name="email"
                    value={editingCustomer.email}
                    onChange={handleInputChange}
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    title="phone"
                    type="tel"
                    name="phone"
                    value={editingCustomer.phone || ""}
                    onChange={handleInputChange}
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    title="location"
                    type="text"
                    name="location"
                    value={editingCustomer.location || ""}
                    onChange={handleInputChange}
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession
                </label>
                <input
                  title="profession"
                  type="text"
                  name="profession"
                  value={editingCustomer.profession || ""}
                  onChange={handleInputChange}
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      Plan Name
                    </label>
                    <select
                      title="plan-name"
                      name="plan.name"
                      value={editingCustomer.plan.name}
                      onChange={handleInputChange}
                      className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
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
                      Start Date
                    </label>
                    <input
                      title="start-date"
                      type="date"
                      name="plan.startDate"
                      value={
                        editingCustomer.plan.startDate
                          ? new Date(editingCustomer.plan.startDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      title="end-date"
                      type="date"
                      name="plan.endDate"
                      value={
                        editingCustomer.plan.endDate
                          ? new Date(editingCustomer.plan.endDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Screenshot URL
                </label>
                <input
                  title="payment-url"
                  type="url"
                  name="paymentScreenshot"
                  value={editingCustomer.paymentScreenshot}
                  onChange={handleInputChange}
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  title="company-member"
                  type="checkbox"
                  name="isCompanyMember"
                  checked={editingCustomer.isCompanyMember}
                  onChange={handleInputChange}
                  className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Company Member
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Update Customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingCustomer(null)
                  }}
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
                    Actions
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
                        {customer.location && (
                          <div className="text-xs text-gray-400">
                            {customer.location}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditCustomer(customer)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                      {customer.paymentScreenshot && (
                        <a
                          href={customer.paymentScreenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-xs"
                        >
                          Payment
                        </a>
                      )}
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
                    No customers found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Customers will appear here once they are added by Adders.
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
