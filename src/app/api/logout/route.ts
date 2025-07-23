import { NextResponse } from "next/server"
import { clearCookieHeader } from "@/lib/auth"
import { ApiResponse } from "@/types"

export async function POST() {
  const response = NextResponse.json<ApiResponse>(
    { message: "Successfully logged out" },
    { status: 200 }
  )

  response.headers.set("Set-Cookie", clearCookieHeader())
  return response
}
