import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { currentPassword, newPassword, newEmail } = await req.json()

    if (!currentPassword) {
      return NextResponse.json({ error: 'Contraseña actual requerida' }, { status: 400 })
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: session.id },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Usuario administrador no encontrado' }, { status: 404 })
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, admin.password)
    if (!valid) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 })
    }

    const updateData: { password?: string; email?: string } = {}

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    if (newEmail && newEmail !== admin.email) {
      const emailLower = newEmail.toLowerCase().trim()
      // Check if email already taken
      const existing = await prisma.adminUser.findUnique({
        where: { email: emailLower },
      })
      if (existing && existing.id !== admin.id) {
        return NextResponse.json({ error: 'El correo electrónico ya está en uso' }, { status: 400 })
      }
      updateData.email = emailLower
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No se enviaron datos para actualizar' }, { status: 400 })
    }

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, message: 'Credenciales actualizadas exitosamente' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en el servidor' }, { status: 500 })
  }
}
