"use client"

import MiloSprite from "./MiloSprite"

const MILO_SCALE = 0.93
const GLOW_SIZE  = 1065

const CROP_W = 340
const CROP_H = 240
const CROP_OFFSET_X = -(720 - CROP_W) / 2  // -190
const CROP_OFFSET_Y = -150                   // start at y=150, end at y=390

export default function HeroCanvas() {
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
        background: "radial-gradient(circle, rgba(120,30,220,0.41) 0%, rgba(100,20,180,0.23) 35%, rgba(80,10,160,0.00) 60%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Milo */}
      <div style={{ position: "relative", zIndex: 1, margin: "8px 0 16px" }}>
        <MiloSprite
          width={miloW}
          height={miloH}
          scale={MILO_SCALE}
          offsetX={CROP_OFFSET_X}
          offsetY={CROP_OFFSET_Y}
          clickable
        />
      </div>
    </>
  )
}
