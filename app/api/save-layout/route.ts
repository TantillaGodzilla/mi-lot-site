import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

// Dev-only route — intentional filesystem write.
// On Vercel (production), canvas-data.json is a static file baked in at deploy time.
// Saves are only done locally; the saved JSON ships with the next deployment.
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, error: "Save only available in development" }, { status: 403 })
  }
  try {
    const data = await req.json()
    const filePath = path.join(process.cwd(), "public", "canvas-data.json")
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Save failed:", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
