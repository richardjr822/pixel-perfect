import { NextResponse } from 'next/server'

import { DEFAULT_SETTINGS } from '@/lib/layouts'
import { createServerClient } from '@/lib/supabase-server'
import type { SettingsRow } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseSettingsRequestBody(value: unknown): Partial<SettingsRow> | null {
  if (!isRecord(value)) {
    return null
  }

  return value as Partial<SettingsRow>
}

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    if (data) {
      return NextResponse.json({ settings: data as SettingsRow })
    }

    const { data: inserted, error: insertError } = await supabase
      .from('settings')
      .insert(DEFAULT_SETTINGS)
      .select()
      .single()

    if (insertError) {
      throw new Error(insertError.message)
    }

    if (!inserted) {
      throw new Error('Settings row was not created')
    }

    return NextResponse.json({ settings: inserted as SettingsRow })
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(message)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = parseSettingsRequestBody(await request.json())

    if (!body) {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data: existing, error: readError } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle()

    if (readError) {
      throw new Error(readError.message)
    }

    const { data, error } = await supabase
      .from('settings')
      .upsert({ ...DEFAULT_SETTINGS, ...(existing as SettingsRow | null ?? {}), id: 1, ...body })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    if (!data) {
      throw new Error('Settings row was not updated')
    }

    return NextResponse.json({ settings: data as SettingsRow })
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(message)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
