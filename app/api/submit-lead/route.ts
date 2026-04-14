import { NextResponse } from "next/server"

const REQUIRED = ["name", "phone", "email", "vehicle_type", "budget", "new_or_used", "timeline"] as const

export async function POST(req: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    console.error("N8N_WEBHOOK_URL is not set")
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  // Validate required fields
  const missing = REQUIRED.filter(k => !body[k] || String(body[k]).trim() === "")
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 })
  }

  // Forward to n8n
  try {
    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "mi-lot-website",
        submitted_at: new Date().toISOString(),
        ...body,
      }),
    })

    if (!n8nRes.ok) {
      console.error("n8n webhook returned", n8nRes.status)
      return NextResponse.json({ error: "Failed to submit lead" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("n8n fetch failed:", err)
    return NextResponse.json({ error: "Failed to reach webhook" }, { status: 502 })
  }
}
