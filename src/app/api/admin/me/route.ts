import { NextRequest, NextResponse } from "next/server"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { AdminUser } from "@/types"

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    const payload = verifyToken(token)

    if (!payload || payload.username !== "admin") {
      return NextResponse.json<{ user: null }>({ user: null }, { status: 401 })
    }

    const adminUser: AdminUser = {
      username: "admin",
      role: "Admin",
    }

    return NextResponse.json<{ user: AdminUser }>({
      user: adminUser,
    })
  } catch (error) {
    console.error("Admin me route error:", error)
    return NextResponse.json<{ user: null }>({ user: null }, { status: 500 })
  }
}
