import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import CustomerModel from "@/models/Customer"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { ApiResponse } from "@/types"

// GET specific customer by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(req)
    const auth = verifyToken(token)

    if (!auth) {
      return NextResponse.json<ApiResponse>(
        { message: "Authentication required" },
        { status: 401 }
      )
    }

    // ✅ Await the params to get the actual values
    const { id } = await params

    await dbConnect()

    const customer = await CustomerModel.findById(id)

    if (!customer) {
      return NextResponse.json<ApiResponse>(
        { message: "Customer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error("Get customer error:", error)
    return NextResponse.json<ApiResponse>(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
