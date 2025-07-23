import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import StaffModel from '@/models/Staff';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { AuthStaff } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json<{ user: null }>(
        { user: null },
        { status: 401 }
      );
    }

    await dbConnect();
    const staff = await StaffModel.findById(payload.userId);

    if (!staff) {
      return NextResponse.json<{ user: null }>(
        { user: null },
        { status: 404 }
      );
    }

    const authStaff: AuthStaff = {
      username: staff.username,
      role: staff.role,
      name: staff.name,
      email: staff.email,
    };

    return NextResponse.json<{ user: AuthStaff }>({
      user: authStaff
    });

  } catch (error) {
    console.error('Me route error:', error);
    return NextResponse.json<{ user: null }>(
      { user: null },
      { status: 500 }
    );
  }
}
