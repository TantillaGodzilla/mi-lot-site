"use client"

import { useState } from "react"

const POOL = [2, 3, 4, 5, 6]

function pickRandom(exclude: number) {
  const options = POOL.filter(n => n !== exclude)
  return options[Math.floor(Math.random() * options.length)]
}

const MILO_SCALE = 0.93
const GLOW_SIZE  = 1065

const CROP_W = 340
const CROP_H = 240
const CROP_OFFSET_X = -(720 - CROP_W) / 2  // -190
const CROP_OFFSET_Y = -150                   // start at y=150, end at y=390

export default function HeroCanvas() {
  const [num, setNum] = useState(() => POOL[Math.floor(Math.random() * POOL.length)])

  const miloW = Math.round(CROP_W * MILO_SCALE)
  const miloH = Math.round(CROP_H * MILO_SCALE)

  return (
    <>
      {/* Glow */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: GLOW_SIZE,
        height: GLOW_SIZE,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(120,30,220,0.27) 0%, rgba(100,20,180,0.15) 35%, rgba(80,10,160,0.00) 60%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Milo */}
      <div
        onClick={() => setNum(n => pickRandom(n))}
        style={{
          position: "relative",
          zIndex: 1,
          margin: "8px 0 16px",
          width: miloW,
          height: miloH,
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <iframe
          key={num}
          src={`/milo-${num}.html`}
          style={{
            position: "absolute",
            width: 720,
            height: 600,
            border: "none",
            background: "transparent",
            pointerEvents: "none",
            transform: `scale(${MILO_SCALE})`,
            transformOrigin: "top left",
            left: CROP_OFFSET_X * MILO_SCALE,
            top: CROP_OFFSET_Y * MILO_SCALE,
          }}
          title="Milo"
        />
      </div>
    </>
  )
}
