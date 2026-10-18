import { cookies } from 'next/headers'
import { prisma } from './prisma'
import crypto from 'crypto'

const SESSION_COOKIE = 'chrono_admin_session'
const SECRET = process.env.NEXTAUTH_SECRET || 'chrono-luxury-watchmaking-secret-key-2026'

export function signToken(data: string): string {
  const hmac = crypto.createHmac('sha256', SECRET).update(data).digest('hex')
  return `${data}.${hmac}`
}

export function verifyToken(token: string): string | null {
  const [data, sig] = token.split('.')
  if (!data || !sig) return null
  const expected = crypto.createHmac('sha256', SECRET).update(data).digest('hex')
  if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return data
  }
  return null
}

export async function auth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const userId = verifyToken(token)
  if (!userId) return null

  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true }
  })

  return user
}

export async function setAdminSession(userId: string) {
  const cookieStore = await cookies()
  const token = signToken(userId)
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
