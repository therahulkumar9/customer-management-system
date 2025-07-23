import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import StaffModel from "@/models/Staff"
import { generateToken, createCookieHeader } from "@/lib/auth"
import { ApiResponse } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json<ApiResponse>(
        { message: "Username and password are required" },
        { status: 400 }
      )
    }

    await dbConnect()

    // Find staff
    const staff = await StaffModel.findOne({ username })
    if (!staff) {
      return NextResponse.json<ApiResponse>(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, staff.password)
    if (!isValidPassword) {
      return NextResponse.json<ApiResponse>(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: staff._id.toString(),
      role: staff.role,
      username: staff.username,
    })

    // Create response with cookie
    const response = NextResponse.json<ApiResponse>(
      {
        message: "Login successful",
        data: {
          username: staff.username,
          role: staff.role,
          name: staff.name,
          email: staff.email,
        },
      },
      { status: 200 }
    )

    response.headers.set("Set-Cookie", createCookieHeader(token))
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json<ApiResponse>(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
