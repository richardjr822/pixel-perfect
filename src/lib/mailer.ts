import 'server-only'

import nodemailer from 'nodemailer'
import type { SendStripEmailParams } from '@/types'

function getRequiredEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is missing`)
  }

  return value
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getDownloadUrl(url: string): string {
  if (!url.includes('/upload/')) {
    return url
  }

  return url.replace('/upload/', '/upload/fl_attachment:pixel-perfect-strip/')
}

export async function sendStripEmail({
  to,
  stripUrl,
  layoutLabel,
}: SendStripEmailParams): Promise<void> {
  const gmailUser = getRequiredEnv('GMAIL_USER')
  const gmailAppPassword = getRequiredEnv('GMAIL_APP_PASSWORD').replace(/\s/g, '')
  const downloadUrl = getDownloadUrl(stripUrl)
  const safeLayoutLabel = escapeHtml(layoutLabel)
  const safeDownloadUrl = escapeHtml(downloadUrl)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  })

  await transporter.sendMail({
    from: `"Pixel Perfect" <${gmailUser}>`,
    replyTo: gmailUser,
    to,
    subject: `Your Pixel Perfect ${layoutLabel} photo strip`,
    text: `Your Pixel Perfect ${layoutLabel} photo strip is attached. Download it here: ${downloadUrl}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1a1a14">
        <h1 style="font-size:22px;margin:0 0 12px">Your Pixel Perfect strip is ready</h1>
        <p style="margin:0 0 18px">Your ${safeLayoutLabel} photo strip is attached to this email.</p>
        <a href="${safeDownloadUrl}" style="display:inline-block;background:#1a1a14;color:#ffce1b;text-decoration:none;padding:12px 18px;font-weight:bold">DOWNLOAD STRIP</a>
      </div>
    `,
    attachments: [
      {
        filename: 'pixel-perfect-strip.png',
        path: downloadUrl,
        contentType: 'image/png',
      },
    ],
  })
}
