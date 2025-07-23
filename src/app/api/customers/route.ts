import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import CustomerModel from "@/models/Customer"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { ApiResponse, Customer } from "@/types"

// GET - List all customers (both Adder and Updater can view)
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    const auth = verifyToken(token)

    if (!auth) {
      return NextResponse.json<ApiResponse>(
        { message: "Authentication required" },
        { status: 401 }
      )
    }

    await dbConnect()

    const customers = await CustomerModel.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: customers.map((customer) => ({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        location: customer.location,
        profession: customer.profession,
        plan: customer.plan,
        paymentScreenshot: customer.paymentScreenshot,
        isCompanyMember: customer.isCompanyMember,
        addedBy: customer.addedBy,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      })),
    })
  } catch (error) {
    console.error("Get customers error:", error)
    return NextResponse.json<ApiResponse>(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Add new customer (Adder only)
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    const auth = verifyToken(token)

    if (!auth || auth.role !== "Adder") {
      return NextResponse.json<ApiResponse>(
        { message: "Access denied. Adder role required." },
        { status: 403 }
      )
    }

    const {
      name,
      email,
      phone,
      location,
      profession,
      plan,
      paymentScreenshot,
      isCompanyMember,
    } = await req.json()

    // Validate required fields
    if (!name || !email || !plan || !paymentScreenshot) {
      return NextResponse.json<ApiResponse>(
        { message: "Required fields: name, email, plan, paymentScreenshot" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>(
        { message: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate plan dates
    const startDate = new Date(plan.startDate)
    const endDate = new Date(plan.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json<ApiResponse>(
        { message: "Invalid plan dates" },
        { status: 400 }
      )
    }

    if (endDate <= startDate) {
      return NextResponse.json<ApiResponse>(
        { message: "End date must be after start date" },
        { status: 400 }
      )
    }

    await dbConnect()

    // Check if customer already exists
    const existingCustomer = await CustomerModel.findOne({ email })
    if (existingCustomer) {
      return NextResponse.json<ApiResponse>(
        { message: "Customer with this email already exists" },
        { status: 400 }
      )
    }

    // Create customer
    const customer = await CustomerModel.create({
      name,
      email,
      phone: phone || undefined,
      location: location || undefined,
      profession: profession || undefined,
      plan: {
        name: plan.name,
        startDate,
        endDate,
      },
      paymentScreenshot,
      isCompanyMember: Boolean(isCompanyMember),
      addedBy: auth.username,
    })

    return NextResponse.json<ApiResponse>(
      {
        message: "Customer added successfully",
        data: {
          _id: customer._id,
          name: customer.name,
          email: customer.email,
          plan: customer.plan,
          addedBy: customer.addedBy,
        },
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Create customer error:", error)

    // Add proper type checking before accessing properties
    if (error && typeof error === "object" && "code" in error) {
      const mongoError = error as { code: number }
      if (mongoError.code === 11000) {
        return NextResponse.json<ApiResponse>(
          { message: "Customer with this email already exists" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json<ApiResponse>(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Update customer (Updater only)
export async function PUT(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    const auth = verifyToken(token)

    if (!auth || auth.role !== "Updater") {
      return NextResponse.json<ApiResponse>(
        { message: "Access denied. Updater role required." },
        { status: 403 }
      )
    }

    const { customerId, ...updateData } = await req.json()

    if (!customerId) {
      return NextResponse.json<ApiResponse>(
        { message: "Customer ID is required" },
        { status: 400 }
      )
    }

    await dbConnect()

    // Handle plan dates if provided
    if (updateData.plan) {
      if (updateData.plan.startDate) {
        updateData.plan.startDate = new Date(updateData.plan.startDate)
      }
      if (updateData.plan.endDate) {
        updateData.plan.endDate = new Date(updateData.plan.endDate)
      }

      // Validate dates if both provided
      if (updateData.plan.startDate && updateData.plan.endDate) {
        if (updateData.plan.endDate <= updateData.plan.startDate) {
          return NextResponse.json<ApiResponse>(
            { message: "End date must be after start date" },
            { status: 400 }
          )
        }
      }
    }

    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      customerId,
      updateData,
      { new: true, runValidators: true }
    )

    if (!updatedCustomer) {
      return NextResponse.json<ApiResponse>(
        { message: "Customer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>(
      {
        message: "Customer updated successfully",
        data: updatedCustomer,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error("Update customer error:", error)

    // Add proper type checking before accessing properties
    if (error && typeof error === "object" && "code" in error) {
      const mongoError = error as { code: number }
      if (mongoError.code === 11000) {
        return NextResponse.json<ApiResponse>(
          { message: "Email already exists for another customer" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json<ApiResponse>(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete customer (Updater only)
export async function DELETE(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    const auth = verifyToken(token)

    if (!auth || auth.role !== "Updater") {
      return NextResponse.json<ApiResponse>(
        { message: "Access denied. Updater role required." },
        { status: 403 }
      )
    }

    const { customerId } = await req.json()

    if (!customerId) {
      return NextResponse.json<ApiResponse>(
        { message: "Customer ID is required" },
        { status: 400 }
      )
    }

    await dbConnect()

    const deletedCustomer = await CustomerModel.findByIdAndDelete(customerId)

    if (!deletedCustomer) {
      return NextResponse.json<ApiResponse>(
        { message: "Customer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { message: "Customer deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete customer error:", error)
    return NextResponse.json<ApiResponse>(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
