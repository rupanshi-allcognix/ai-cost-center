import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { webhook_url, message, severity = 'info' } = body

    if (!webhook_url || !message) {
      return NextResponse.json({ error: 'webhook_url and message are required' }, { status: 400 })
    }

    const blocks = [
      { type: 'header', text: { type: 'plain_text', text: 'AI Cost Center — Notification' } },
      { type: 'section', text: { type: 'mrkdwn', text: `*Severity:* ${severity}\n${message}` } },
    ]

    const resp = await fetch(webhook_url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ blocks }) })

    if (!resp.ok) {
      return NextResponse.json({ error: `Slack returned ${resp.status}` }, { status: 502 })
    }

    return NextResponse.json({ status: 'ok' })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
