import { NextResponse } from 'next/server'

import { sendStripEmail } from '@/lib/mailer'
import { createServerClient } from '@/lib/supabase-server'
import type { EmailRequestBody } from '@/types'

export const runtime = 'nodejs'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseEmailRequestBody(value: unknown): EmailRequestBody | null {
  if (!isRecord(value)) {
    return null
  }

  if (
    typeof value.to !== 'string' ||
    value.to.trim().length === 0 ||
    !value.to.includes('@') ||
    typeof value.stripUrl !== 'string' ||
    value.stripUrl.trim().length === 0 ||
    typeof value.layoutLabel !== 'string'
  ) {
    return null
  }

  return {
    to: value.to,
    stripUrl: value.stripUrl,
    layoutLabel: value.layoutLabel,
  }
}

async function markSessionEmailed(stripUrl: string, email: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('sessions')
    .update({ email })
    .eq('strip_url', stripUrl)

  if (error) {
    throw new Error(error.message)
  }
}

export async function POST(request: Request) {
  try {
    const body = parseEmailRequestBody(await request.json())

    if (!body) {
      return NextResponse.json({ error: 'Invalid email payload' }, { status: 400 })
    }

    await sendStripEmail({
      to: body.to,
      stripUrl: body.stripUrl,
      layoutLabel: body.layoutLabel,
    })

    try {
      await markSessionEmailed(body.stripUrl, body.to)
    } catch (error) {
      console.error(getErrorMessage(error))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(message)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
