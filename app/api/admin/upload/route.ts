import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const pieceId = formData.get('pieceId') as string | null
    const isPrimary = formData.get('isPrimary') === 'true'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 5MB' }, { status: 400 })
    }

    // Validate MIME type
    const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file format. Allowed formats: PNG, JPG, JPEG, WEBP' }, { status: 400 })
    }

    const rawExt = path.extname(file.name).toLowerCase()
    const validExts = ['.png', '.jpg', '.jpeg', '.webp']
    const ext = validExts.includes(rawExt) ? rawExt : '.png'
    const filename = `${uuidv4()}${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadDir, filename), buffer)

    const url = `/uploads/${filename}`

    // If pieceId provided, create PieceImage record
    if (pieceId) {
      const image = await prisma.pieceImage.create({
        data: { pieceId, url, isPrimary, alt: file.name },
      })
      return NextResponse.json({ url, image })
    }

    return NextResponse.json({ url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
