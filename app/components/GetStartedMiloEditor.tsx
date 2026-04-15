"use client"

import MiloSprite from "./MiloSprite"

const FRAME_WIDTH = 156
const FRAME_HEIGHT = 116
const BASE_OFFSET_X = -240
const BASE_OFFSET_Y = -164
const DEFAULT_SPRITE_NUDGE_X = -5
const DEFAULT_SPRITE_NUDGE_Y = 9

export default function GetStartedMiloEditor() {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 250,
            height: 250,
            transform: "translate(calc(-50% - 6px), -43%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.24) 0%, rgba(123,47,190,0.14) 34%, rgba(80,10,160,0.06) 52%, rgba(80,10,160,0) 72%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            transform: `translate(${DEFAULT_SPRITE_NUDGE_X}px, ${DEFAULT_SPRITE_NUDGE_Y}px)`,
          }}
        >
          <MiloSprite
            width={FRAME_WIDTH}
            height={FRAME_HEIGHT}
            scale={0.62}
            offsetX={BASE_OFFSET_X}
            offsetY={BASE_OFFSET_Y}
          />
        </div>
      </div>
    </div>
  )
}
