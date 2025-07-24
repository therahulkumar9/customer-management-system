export interface Staff {
  _id?: string
  username: string
  password: string
  role: "Adder" | "Updater"
  name: string
  email: string
  createdAt?: Date
}

export interface Customer {
  _id?: string
  name: string
  email: string
  phone?: string
  location?: string
  profession?: string
  plan: {
    name: string
    startDate: Date
    endDate: Date
  }
  paymentScreenshot: string
  isCompanyMember: boolean
  addedBy: string // Staff username who added this customer
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthStaff {
  username: string
  role: "Adder" | "Updater"
  name: string
  email: string
}

export interface JWTPayload {
  userId: string
  role: "Adder" | "Updater" | "Admin"
  username: string
}

export interface ApiResponse<T = unknown> {
  message: string
  data?: T
  success?: boolean
}

export interface AdminUser {
  username: string
  role: "Admin"
}

export interface StaffWithStats {
  _id: string
  username: string
  name: string
  email: string
  role: "Adder" | "Updater"
  customersAdded: number
  createdAt: Date
}

export interface CustomerSearchParams {
  search?: string
  planType?: string
  status?: "active" | "expired"
  memberType?: "company" | "customer"
  dateFrom?: string
  dateTo?: string
}

export interface AdminStats {
  totalCustomers: number
  activeCustomers: number
  expiredCustomers: number
  totalStaff: number
  totalAdders: number
  totalUpdaters: number
  revenueByPlan: { planName: string; count: number }[]
}
