import jwt from "jsonwebtoken"
import { JWTPayload } from "@/types"
import { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET!

export function getTokenFromRequest(req: NextRequest): string | null {
  const cookieString = req.headers.get("cookie") || ""
  const match = cookieString.match(/token=([^;]+)/)
  return match ? match[1] : null
}

export function verifyToken(token: string | null): JWTPayload | null {
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

export function createCookieHeader(token: string): string {
  return `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
}

export function clearCookieHeader(): string {
  return "token=; HttpOnly; Path=/; Max-Age=0"
}
