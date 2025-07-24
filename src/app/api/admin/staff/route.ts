import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import StaffModel from "@/models/Staff"
import CustomerModel from "@/models/Customer"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { ApiResponse, StaffWithStats } from "@/types"

// GET all staff with statistics
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    const auth = verifyToken(token)

    if (!auth || auth.username !== "admin") {
      return NextResponse.json<ApiResponse>(
        { message: "Admin access required" },
        { status: 403 }
      )
    }

    await dbConnect()

    const staff = await StaffModel.find({}).sort({ createdAt: -1 })

    // Get customer count for each staff member
    const staffWithStats: StaffWithStats[] = await Promise.all(
      staff.map(async (member) => {
        const customersAdded = await CustomerModel.countDocuments({
          addedBy: member.username,
        })
        return {
          _id: member._id.toString(),
          username: member.username,
          name: member.name,
          email: member.email,
          role: member.role,
          customersAdded,
          createdAt: member.createdAt,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: staffWithStats,
    })
  } catch (error) {
    console.error("Get staff error:", error)
    return NextResponse.json<ApiResponse>(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE staff member
export async function DELETE(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    const auth = verifyToken(token)

    if (!auth || auth.username !== "admin") {
      return NextResponse.json<ApiResponse>(
        { message: "Admin access required" },
        { status: 403 }
      )
    }

    const { staffId } = await req.json()

    if (!staffId) {
      return NextResponse.json<ApiResponse>(
        { message: "Staff ID is required" },
        { status: 400 }
      )
    }

    await dbConnect()

    const deletedStaff = await StaffModel.findByIdAndDelete(staffId)

    if (!deletedStaff) {
      return NextResponse.json<ApiResponse>(
        { message: "Staff member not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { message: "Staff member deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete staff error:", error)
    return NextResponse.json<ApiResponse>(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
