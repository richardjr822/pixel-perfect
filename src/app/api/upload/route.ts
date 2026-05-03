import { NextResponse } from 'next/server'

import { uploadBase64 } from '@/lib/cloudinary'
import type { UploadRequestBody } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseUploadRequestBody(value: unknown): UploadRequestBody | null {
  if (!isRecord(value)) {
    return null
  }

  if (typeof value.base64 !== 'string' || value.base64.trim().length === 0) {
    return null
  }

  if (value.folder !== undefined && typeof value.folder !== 'string') {
    return null
  }

  return {
    base64: value.base64,
    folder: value.folder,
  }
}

export async function POST(request: Request) {
  try {
    const body = parseUploadRequestBody(await request.json())

    if (!body) {
      return NextResponse.json({ error: 'base64 is required' }, { status: 400 })
    }

    const secureUrl = await uploadBase64(body.base64, body.folder ?? 'pixel-perfect')

    return NextResponse.json({ url: secureUrl })
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(message)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
