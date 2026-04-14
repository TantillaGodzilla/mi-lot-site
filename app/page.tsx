import Link from "next/link"
import HeroCanvas from "./components/HeroCanvas"

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(30,10,60,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(168,85,247,0.15)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "0 24px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "var(--purple-light)", letterSpacing: "-0.02em" }}>
          Mi-Lot
        </span>
        <Link href="/get-started" style={{
          padding: "10px 24px", borderRadius: 999,
          background: "var(--purple)", color: "#fff",
          fontWeight: 700, fontSize: 15, textDecoration: "none",
          transition: "opacity 0.15s",
        }}>
          Get started
        </Link>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "60px 24px 80px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* eyebrow */}
      <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(168,85,247,0.7)", marginBottom: 24, position: "relative", zIndex: 1 }}>
        Vehicle Referral Network
      </p>

      {/* headline */}
      <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16, maxWidth: 820, position: "relative", zIndex: 1 }}>
        <span style={{ color: "#fff" }}>Need a </span>
        <span style={{ color: "var(--purple-light)" }}>Car?</span>
      </h1>

      {/* Milo + glow + editor */}
      <HeroCanvas />

      {/* sub-headline */}
      <h2 style={{ fontSize: "clamp(28px, 4.5vw, 56px)", fontWeight: 800, lineHeight: 1.15, maxWidth: 760, marginBottom: 20, position: "relative", zIndex: 1 }}>
        <span style={{ color: "#fff" }}>Why go to dealers </span>
        <span style={{ color: "var(--purple-light)" }}>when the dealers can come to you?</span>
      </h2>

      {/* body */}
      <p style={{ fontSize: 18, color: "rgba(240,238,255,0.55)", lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
        Tell me what you want. I&apos;ll put it in front of the right people. You pick the best offer. Simple as that.
      </p>

      {/* CTA */}
      <a href="/get-started" style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "16px 40px", borderRadius: 999,
        background: "linear-gradient(135deg, var(--purple) 0%, var(--purple-mid) 100%)",
        boxShadow: "0 0 40px var(--purple-glow)",
        color: "#fff", fontWeight: 800, fontSize: 20, textDecoration: "none",
        marginBottom: 16, transition: "transform 0.15s, box-shadow 0.15s",
      }}>
        Find my car
      </a>

      <p style={{ fontSize: 13, color: "rgba(240,238,255,0.28)" }}>
        Free. No spam. No pressure.
      </p>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "1",
    title: "Tell me what you want",
    body: "Vehicle type, budget, trade-in — whatever you've got. Takes two minutes.",
  },
  {
    num: "2",
    title: "I go to work",
    body: "Your request goes out to real sales reps who are ready to earn your business.",
  },
  {
    num: "3",
    title: "You pick your offer",
    body: "We match you with a dealer who has an offer and connect them to you. No pressure, no dealership visits until you're ready.",
  },
]

function HowItWorks() {
  return (
    <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{
        fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, textAlign: "center",
        color: "var(--purple-light)", marginBottom: 48,
      }}>
        How it works
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
      }}>
        {STEPS.map((step) => (
          <div key={step.num} style={{
            background: "rgba(123,47,190,0.07)",
            border: "1px solid rgba(168,85,247,0.15)",
            borderRadius: 16, padding: "28px 24px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--purple-light)" }}>
              {step.num}
            </span>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>
              {step.title}
            </p>
            <p style={{ fontSize: 14, color: "rgba(240,238,255,0.5)", lineHeight: 1.65, margin: 0 }}>
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Quote ────────────────────────────────────────────────────────────────────
function Quote() {
  return (
    <section style={{ padding: "60px 24px 80px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
      <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, lineHeight: 1.5, color: "#fff", marginBottom: 16 }}>
        &ldquo;How do you trust a car salesman? You don&apos;t.{" "}
        <span style={{ color: "var(--purple-light)" }}>That&apos;s why I&apos;m here.&rdquo;</span>
      </p>
      <p style={{ fontSize: 13, color: "rgba(240,238,255,0.35)" }}>
        — Milo, your guy on the inside
      </p>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "24px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 8,
      maxWidth: 1200, margin: "0 auto", width: "100%",
    }}>
      <span style={{ fontSize: 12, color: "rgba(240,238,255,0.25)" }}>
        © 2026 Mi-Lot — Vehicle Referral Network
      </span>
      <span style={{ fontSize: 12, color: "rgba(240,238,255,0.25)" }}>
        Nashville, TN
      </span>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Quote />
      </main>
      <Footer />
    </>
  )
}
