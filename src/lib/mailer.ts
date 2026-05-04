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

function buildEmailHtml(params: {
  safeLayoutLabel: string
  safeStripUrl: string
  safeDownloadUrl: string
  dateStamp: string
}): string {
  const { safeLayoutLabel, safeStripUrl, safeDownloadUrl, dateStamp } = params

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your Pixel Perfect Strip</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#c8c6b4;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#c8c6b4;min-height:100vh;">
    <tr>
      <td align="center" style="padding:28px 16px;">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border:4px solid #1a1a14;box-shadow:8px 8px 0 #1a1a14;">

          <!-- MARQUEE STRIP -->
          <tr>
            <td style="background:#1a1a14;padding:10px 0;overflow:hidden;">
              <div style="font-family:'Press Start 2P',monospace;font-size:10px;color:#ffce1b;letter-spacing:0.3em;white-space:nowrap;text-align:center;">
                ★ &nbsp; PIXEL PERFECT &nbsp; ★ &nbsp; SMILE BIG &nbsp; ★ &nbsp; SHARE INSTANTLY &nbsp; ★ &nbsp; PIXEL PERFECT &nbsp; ★
              </div>
            </td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="background:#1a1a14;padding:36px 32px 28px;text-align:center;border-bottom:4px solid #ffce1b;">
              <div style="font-family:'Press Start 2P',monospace;font-size:32px;color:#ffce1b;letter-spacing:0.04em;line-height:1.1;">
                PIXEL
              </div>
              <div style="font-family:'Press Start 2P',monospace;font-size:22px;color:#e8e6d8;letter-spacing:0.04em;margin-top:8px;">
                PERFECT
              </div>
              <div style="width:100%;height:4px;background:#e8e6d8;margin:22px 0 18px;opacity:0.12;"></div>
              <div style="font-family:'VT323',monospace;font-size:28px;color:#ffce1b;letter-spacing:0.35em;">
                ★ YOUR STRIP IS READY ★
              </div>
            </td>
          </tr>

          <!-- STRIP PREVIEW -->
          <tr>
            <td style="background:#5a82aa;padding:36px 32px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 auto;">
                <tr>
                  <td style="background:#1a1a14;padding:6px;border:4px solid #1a1a14;">
                    <img
                      src="${safeStripUrl}"
                      alt="Your ${safeLayoutLabel} photo strip"
                      width="260"
                      style="display:block;max-width:260px;width:100%;height:auto;"
                    />
                  </td>
                </tr>
              </table>
              <div style="margin-top:18px;font-family:'Press Start 2P',monospace;font-size:8px;color:#e8e6d8;letter-spacing:0.15em;opacity:0.75;">
                ${safeLayoutLabel.toUpperCase()} &nbsp;·&nbsp; ${dateStamp}
              </div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#e8e6d8;padding:36px 32px 28px;border-top:4px solid #1a1a14;">

              <!-- Badge -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td style="background:#ffce1b;border:3px solid #1a1a14;padding:7px 14px;">
                    <span style="font-family:'Press Start 2P',monospace;font-size:9px;color:#1a1a14;letter-spacing:0.15em;">
                      ★ READY TO DOWNLOAD ★
                    </span>
                  </td>
                </tr>
              </table>

              <div style="font-family:'VT323',monospace;font-size:26px;color:#1a1a14;line-height:1.35;margin-bottom:28px;">
                your <strong>${safeLayoutLabel}</strong> photo strip is attached to this email —
                save it to your camera roll, post it, print it, or keep it forever.
              </div>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#1a1a14;border:3px solid #1a1a14;box-shadow:5px 5px 0 #1a1a14;">
                    <a href="${safeDownloadUrl}"
                       style="display:block;background:#ffce1b;color:#1a1a14;text-decoration:none;padding:16px 32px;font-family:'Press Start 2P',monospace;font-size:13px;letter-spacing:0.2em;">
                      &#9654; DOWNLOAD STRIP
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td style="border-top:2px dashed rgba(26,26,20,0.2);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Info row -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 0 10px;">
                    <span style="font-family:'Press Start 2P',monospace;font-size:8px;color:#1a1a14;opacity:0.45;letter-spacing:0.1em;">LAYOUT</span>
                    &nbsp;&nbsp;
                    <span style="font-family:'Press Start 2P',monospace;font-size:8px;color:#1a1a14;letter-spacing:0.1em;">${safeLayoutLabel.toUpperCase()}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 10px;">
                    <span style="font-family:'Press Start 2P',monospace;font-size:8px;color:#1a1a14;opacity:0.45;letter-spacing:0.1em;">DATE</span>
                    &nbsp;&nbsp;
                    <span style="font-family:'Press Start 2P',monospace;font-size:8px;color:#1a1a14;letter-spacing:0.1em;">${dateStamp}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#1a1a14;padding:22px 32px;border-top:4px solid #ffce1b;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="font-family:'Press Start 2P',monospace;font-size:9px;color:#ffce1b;letter-spacing:0.2em;">
                      PIXEL PERFECT
                    </div>
                    <div style="font-family:'VT323',monospace;font-size:19px;color:#e8e6d8;opacity:0.45;margin-top:5px;letter-spacing:0.1em;">
                      get your face in the frame
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <div style="font-family:'Press Start 2P',monospace;font-size:18px;color:#558203;letter-spacing:0.05em;">
                      ★
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BOTTOM ACCENT -->
          <tr>
            <td style="background:#ffce1b;height:6px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>

        <!-- Outside footer note -->
        <div style="margin-top:20px;font-family:monospace;font-size:11px;color:#1a1a14;opacity:0.45;text-align:center;letter-spacing:0.08em;">
          you received this because you shared your strip at the booth.
        </div>

      </td>
    </tr>
  </table>
</body>
</html>`
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
  const safeStripUrl = escapeHtml(stripUrl)
  const dateStamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()

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
    subject: `★ Your Pixel Perfect ${layoutLabel} strip is ready!`,
    text: `Your Pixel Perfect ${layoutLabel} photo strip is attached. Download it here: ${downloadUrl}`,
    html: buildEmailHtml({ safeLayoutLabel, safeStripUrl, safeDownloadUrl, dateStamp }),
    attachments: [
      {
        filename: 'pixel-perfect-strip.jpg',
        path: downloadUrl,
        contentType: 'image/jpeg',
      },
    ],
  })
}
