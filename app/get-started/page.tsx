import Link from "next/link"
import LeadForm from "../components/LeadForm"
import GetStartedMiloEditor from "../components/GetStartedMiloEditor"

export const metadata = {
  title: "Find My Car — Mi-Lot",
  description: "Tell me what you want. I'll put it in front of the right people. You pick the best offer.",
}

export default function GetStarted() {
  return (
    <>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(30,10,60,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(168,85,247,0.15)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px", height: 64,
          display: "flex", alignItems: "center",
        }}>
          <Link href="/" style={{
            fontSize: 22, fontWeight: 800,
            color: "var(--purple-light)",
            letterSpacing: "-0.02em", textDecoration: "none",
          }}>
            Mi-Lot
          </Link>
        </div>
      </nav>

      <main style={{
        maxWidth: 680, margin: "0 auto",
        padding: "64px 24px 100px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <GetStartedMiloEditor />

          <h1 style={{
            fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900,
            lineHeight: 1.15, marginBottom: 12,
          }}>
            <span style={{ color: "#fff" }}>Let me find your </span>
            <span style={{ color: "var(--purple-light)" }}>next car.</span>
          </h1>

          <p style={{
            fontSize: 16, color: "rgba(240,238,255,0.5)",
            lineHeight: 1.7, maxWidth: 480, margin: "0 auto",
          }}>
            Fill this out — takes two minutes. I&apos;ll put your request in front of
            the right reps and you pick the best offer.
          </p>
        </div>

        {/* Form */}
        <LeadForm />

        {/* Back link */}
        <p style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/" style={{
            fontSize: 13, color: "rgba(168,85,247,0.45)",
            textDecoration: "none",
          }}>
            ← Back to Mi-Lot
          </Link>
        </p>
      </main>
    </>
  )
}
