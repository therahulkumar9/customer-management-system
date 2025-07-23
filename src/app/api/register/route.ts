import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import StaffModel from "@/models/Staff"
import { ApiResponse } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const { username, password, role, secretCode, name, email } =
      await req.json()

    if (!username || !password || !role || !secretCode || !name || !email) {
      return NextResponse.json<ApiResponse>(
        { message: "All fields are required" },
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

    // Validate secret code
    const expectedSecret =
      role === "Adder"
        ? process.env.ADDER_SECRET
        : role === "Updater"
        ? process.env.UPDATER_SECRET
        : null

    if (!expectedSecret || secretCode !== expectedSecret) {
      return NextResponse.json<ApiResponse>(
        { message: "Invalid secret code for " + role },
        { status: 403 }
      )
    }

    await dbConnect()

    // Check if staff already exists
    const existingStaff = await StaffModel.findOne({
      $or: [{ username }, { email }],
    })

    if (existingStaff) {
      const field = existingStaff.username === username ? "Username" : "Email"
      return NextResponse.json<ApiResponse>(
        { message: `${field} already exists` },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create staff
    const staff = await StaffModel.create({
      username,
      password: hashedPassword,
      role,
      name,
      email,
    })

    return NextResponse.json<ApiResponse>(
      {
        message: "Staff registered successfully",
        data: {
          username: staff.username,
          role: staff.role,
          name: staff.name,
          email: staff.email,
        },
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Registration error:", error)

    // Add proper type checking before accessing properties
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "keyValue" in error
    ) {
      const mongoError = error as {
        code: number
        keyValue: Record<string, unknown>
      }
      if (mongoError.code === 11000) {
        const field = Object.keys(mongoError.keyValue)[0]
        return NextResponse.json<ApiResponse>(
          {
            message: `${
              field.charAt(0).toUpperCase() + field.slice(1)
            } already exists`,
          },
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
