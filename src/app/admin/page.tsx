"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminUser, StaffWithStats, Customer, AdminStats } from "@/types"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    "overview" | "staff" | "customers"
  >("overview")
  const [staff, setStaff] = useState<StaffWithStats[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [adderSearchTerm, setAdderSearchTerm] = useState("")
  const [updaterSearchTerm, setUpdaterSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "expired"
  >("all")
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/me")
      const data: { user: AdminUser | null } = await response.json()

      if (!data.user) {
        router.replace("/admin/login")
        return
      }

      setUser(data.user)
      loadData()
    } catch (error) {
      router.replace("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    try {
      // Load staff
      const staffResponse = await fetch("/api/admin/staff")
      const staffData = await staffResponse.json()
      if (staffData.success) setStaff(staffData.data)

      // Load customers
      const customersResponse = await fetch("/api/customers")
      const customersData = await customersResponse.json()
      if (customersData.success) setCustomers(customersData.data)

      // Calculate stats
      calculateStats(staffData.data, customersData.data)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const calculateStats = (
    staffData: StaffWithStats[],
    customerData: Customer[]
  ) => {
    const now = new Date()
    const activeCustomers = customerData.filter(
      (c) => new Date(c.plan.endDate) > now
    )
    const expiredCustomers = customerData.filter(
      (c) => new Date(c.plan.endDate) <= now
    )

    const planCounts = customerData.reduce((acc, customer) => {
      acc[customer.plan.name] = (acc[customer.plan.name] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const revenueByPlan = Object.entries(planCounts).map(
      ([planName, count]) => ({
        planName,
        count,
      })
    )

    setStats({
      totalCustomers: customerData.length,
      activeCustomers: activeCustomers.length,
      expiredCustomers: expiredCustomers.length,
      totalStaff: staffData.length,
      totalAdders: staffData.filter((s) => s.role === "Adder").length,
      totalUpdaters: staffData.filter((s) => s.role === "Updater").length,
      revenueByPlan,
    })
  }

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return

    try {
      const response = await fetch("/api/admin/staff", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId }),
      })

      if (response.ok) {
        loadData() // Refresh data
        alert("Staff member deleted successfully")
      }
    } catch (error) {
      alert("Error deleting staff member")
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

  // Filter functions
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch

    const isActive = new Date(customer.plan.endDate) > new Date()
    return (
      matchesSearch &&
      ((filterStatus === "active" && isActive) ||
        (filterStatus === "expired" && !isActive))
    )
  })

  const filteredAdders = staff.filter(
    (member) =>
      member.role === "Adder" &&
      (member.name.toLowerCase().includes(adderSearchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(adderSearchTerm.toLowerCase()) ||
        member.username.toLowerCase().includes(adderSearchTerm.toLowerCase()))
  )

  const filteredUpdaters = staff.filter(
    (member) =>
      member.role === "Updater" &&
      (member.name.toLowerCase().includes(updaterSearchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(updaterSearchTerm.toLowerCase()) ||
        member.username.toLowerCase().includes(updaterSearchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">
                MathToWord Admin Panel
              </h1>
              <p className="text-sm text-gray-600">
                Complete system administration
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {["overview", "staff", "customers"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "overview" | "staff" | "customers")
                }
                className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Total Customers
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.totalCustomers}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Active Subscriptions
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.activeCustomers}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Staff</h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalStaff}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Expired Plans
              </h3>
              <p className="text-3xl font-bold text-red-600">
                {stats.expiredCustomers}
              </p>
            </div>
          </div>
        )}

        {/* Staff Management Tab - Updated with Left/Right Layout */}
        {activeTab === "staff" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Adders Section - Left Side */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b bg-green-50">
                <h3 className="text-lg font-medium text-green-800">
                  Adders ({filteredAdders.length})
                </h3>
                <p className="text-sm text-green-600">
                  Staff who add new customers
                </p>
              </div>

              {/* Adder Search */}
              <div className="p-4 border-b">
                <input
                  type="text"
                  placeholder="Search adders..."
                  value={adderSearchTerm}
                  onChange={(e) => setAdderSearchTerm(e.target.value)}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Adders List */}
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredAdders.map((member) => (
                  <div key={member._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {member.name}
                          </h4>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Adder
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <p className="text-xs text-gray-400">
                          @{member.username}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span>📊 {member.customersAdded} customers</span>
                          <span>
                            📅 {new Date(member.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteStaff(member._id)}
                        className="text-red-600 cursor-pointer hover:text-red-900 text-sm px-2 py-1 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {filteredAdders.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <p>No adders found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Updaters Section - Right Side */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b bg-blue-50">
                <h3 className="text-lg font-medium text-blue-800">
                  Updaters ({filteredUpdaters.length})
                </h3>
                <p className="text-sm text-blue-600">
                  Staff who manage existing customers
                </p>
              </div>

              {/* Updater Search */}
              <div className="p-4 border-b">
                <input
                  type="text"
                  placeholder="Search updaters..."
                  value={updaterSearchTerm}
                  onChange={(e) => setUpdaterSearchTerm(e.target.value)}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Updaters List */}
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredUpdaters.map((member) => (
                  <div key={member._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {member.name}
                          </h4>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Updater
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <p className="text-xs text-gray-400">
                          @{member.username}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            📅 {new Date(member.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteStaff(member._id)}
                        className="text-red-600 cursor-pointer hover:text-red-900 text-sm px-2 py-1 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {filteredUpdaters.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <p>No updaters found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Customer Management Tab */}
        {activeTab === "customers" && (
          <div>
            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="flex-1 text-black px-4 py-2 border rounded-lg"
                />
                <select
                  title="filter-status"
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as "all" | "active" | "expired"
                    )
                  }
                  className="px-4 cursor-pointer text-black py-2 border rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg text-black font-medium">
                  Customer Management ({filteredCustomers.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Added By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer._id}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {customer.plan.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            <span>
                              {new Date(
                                customer.plan.startDate
                              ).toLocaleDateString()}
                            </span>
                            <span className="mx-1">to</span>
                            <span>
                              {new Date(
                                customer.plan.endDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              new Date(customer.plan.endDate) > new Date()
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {new Date(customer.plan.endDate) > new Date()
                              ? "Active"
                              : "Expired"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {customer.addedBy}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {customer.createdAt
                            ? new Date(customer.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
