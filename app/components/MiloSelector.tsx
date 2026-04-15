"use client"

import MiloSprite from "./MiloSprite"

export default function MiloSelector() {
  return (
    <div style={{ margin: "0 auto", width: 360, height: 300 }}>
      <MiloSprite width={360} height={300} scale={0.5} clickable />
    </div>
  )
}
