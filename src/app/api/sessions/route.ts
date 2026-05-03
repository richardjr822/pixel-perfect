import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase-server'
import type { CreateSessionRequestBody, Session } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isSessionStatus(value: unknown): value is CreateSessionRequestBody['status'] {
  return value === 'completed' || value === 'abandoned'
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function parseCreateSessionRequestBody(value: unknown): CreateSessionRequestBody | null {
  if (!isRecord(value)) {
    return null
  }

  if (
    typeof value.layout_id !== 'string' ||
    typeof value.filter !== 'string' ||
    !isStringArray(value.photo_urls) ||
    (value.strip_url !== null && typeof value.strip_url !== 'string') ||
    typeof value.price !== 'number' ||
    !isSessionStatus(value.status) ||
    (value.email !== null && typeof value.email !== 'string')
  ) {
    return null
  }

  return {
    layout_id: value.layout_id,
    filter: value.filter,
    photo_urls: value.photo_urls,
    strip_url: value.strip_url,
    price: value.price,
    status: value.status,
    email: value.email,
  }
}

function parseLimit(value: string | null): number {
  if (!value) {
    return 50
  }

  const parsed = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 50
  }

  return Math.min(parsed, 200)
}

export async function POST(request: Request) {
  try {
    const body = parseCreateSessionRequestBody(await request.json())

    if (!body) {
      return NextResponse.json({ error: 'Invalid session payload' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase.from('sessions').insert(body).select().single()

    if (error) {
      throw new Error(error.message)
    }

    if (!data) {
      throw new Error('Session was not created')
    }

    return NextResponse.json({ session: data as Session })
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(message)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get('limit'))
    const status = searchParams.get('status')
    const supabase = createServerClient()
    let query = supabase.from('sessions').select('*').order('created_at', { ascending: false }).limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ sessions: (data ?? []) as Session[] })
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(message)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const supabase = createServerClient()
    const { error } = await supabase
      .from('sessions')
      .delete()
      .not('id', 'is', null)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(message)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
