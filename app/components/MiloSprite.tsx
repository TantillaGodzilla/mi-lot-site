"use client"

import { useState } from "react"

const POOL = [2, 3, 4, 5, 6]

function randomFromPool(exclude?: number) {
  const options = exclude ? POOL.filter((n) => n !== exclude) : POOL
  return options[Math.floor(Math.random() * options.length)]
}

type MiloSpriteProps = {
  width: number
  height: number
  frameWidth?: number
  frameHeight?: number
  scale?: number
  offsetX?: number
  offsetY?: number
  clickable?: boolean
  title?: string
}

export default function MiloSprite({
  width,
  height,
  frameWidth = 720,
  frameHeight = 600,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
  clickable = false,
  title = "Milo",
}: MiloSpriteProps) {
  const [num, setNum] = useState(() => randomFromPool())

  return (
    <div
      onClick={clickable ? () => setNum((current) => randomFromPool(current)) : undefined}
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        cursor: clickable ? "pointer" : "default",
      }}
    >
      <iframe
        key={num}
        src={`/milo-${num}.html`}
        style={{
          position: "absolute",
          width: frameWidth,
          height: frameHeight,
          border: "none",
          background: "transparent",
          pointerEvents: "none",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          left: offsetX * scale,
          top: offsetY * scale,
        }}
        title={title}
      />
    </div>
  )
}
