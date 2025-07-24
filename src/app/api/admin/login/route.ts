import { NextRequest, NextResponse } from "next/server"
import { generateToken, createCookieHeader } from "@/lib/auth"
import { ApiResponse } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const { username, password, secretCode } = await req.json()

    if (!username || !password || !secretCode) {
      return NextResponse.json<ApiResponse>(
        { message: "Username, password, and secret code are required" },
        { status: 400 }
      )
    }

    // Check admin secret code first
    if (secretCode !== process.env.ADMIN_SECRET) {
      return NextResponse.json<ApiResponse>(
        { message: "Invalid admin secret code" },
        { status: 403 }
      )
    }

    // Check admin credentials
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json<ApiResponse>(
        { message: "Invalid admin credentials" },
        { status: 401 }
      )
    }

    // Generate JWT token for admin
    const token = generateToken({
      userId: "admin",
      role: "Admin",
      username: "admin",
    })

    const response = NextResponse.json<ApiResponse>(
      {
        message: "Admin login successful",
        data: { username: "admin", role: "Admin" },
      },
      { status: 200 }
    )

    response.headers.set("Set-Cookie", createCookieHeader(token))
    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json<ApiResponse>(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
