"use client"

import { useState } from "react"

const POOL = [2, 3, 4, 5, 6]

function pickRandom(exclude: number) {
  const options = POOL.filter(n => n !== exclude)
  return options[Math.floor(Math.random() * options.length)]
}

export default function MiloSelector() {
  const [num, setNum] = useState(() => POOL[Math.floor(Math.random() * POOL.length)])

  return (
    <div
      onClick={() => setNum(n => pickRandom(n))}
      style={{ width: 360, height: 300, cursor: "pointer", margin: "0 auto", overflow: "hidden" }}
    >
      <iframe
        key={num}
        src={`/milo-${num}.html`}
        style={{ width: 720, height: 600, border: "none", background: "transparent", pointerEvents: "none", transform: "scale(0.5)", transformOrigin: "top left" }}
        title="Milo"
      />
    </div>
  )
}
