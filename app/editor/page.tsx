"use client"

import { useState, useCallback, useRef, useEffect } from "react"

// ─── constants ────────────────────────────────────────────────────────────────
const CANVAS_W  = 1400
const CANVAS_H  = 1640
const CX        = CANVAS_W / 2
const SNAP      = 8
const TOOLBAR_H = 48

// ─── types ────────────────────────────────────────────────────────────────────
interface El {
  id:         string
  x:          number
  y:          number
  w:          number
  h:          number
  content:    string
  cls:        string
  sty?:       React.CSSProperties
  fontSize?:  number
  textColor?: string
  bgColor?:   string
  fontFamily?: string
  fontWeight?: number
  fontStyle?:  "normal" | "italic"
  isIframe?:   boolean
  card?:       { num: string; title: string; body: string }
  quoteParts?: { first: string; second: string }
}

// Merges editor overrides on top of base sty
function applyOverrides(el: El): React.CSSProperties {
  return {
    ...el.sty,
    ...(el.textColor  ? { color:      el.textColor  } : {}),
    ...(el.fontSize   ? { fontSize:   el.fontSize   } : {}),
    ...(el.bgColor    ? { background: el.bgColor    } : {}),
    ...(el.fontFamily ? { fontFamily: el.fontFamily } : {}),
    ...(el.fontWeight ? { fontWeight: el.fontWeight } : {}),
    ...(el.fontStyle  ? { fontStyle:  el.fontStyle  } : {}),
  }
}

const FONTS = [
  { label: "Default (Geist)",    value: "" },
  { label: "Poppins",            value: "Poppins, sans-serif" },
  { label: "Montserrat",         value: "Montserrat, sans-serif" },
  { label: "Oswald",             value: "Oswald, sans-serif" },
  { label: "Raleway",            value: "Raleway, sans-serif" },
  { label: "Space Grotesk",      value: "Space Grotesk, sans-serif" },
  { label: "DM Sans",            value: "DM Sans, sans-serif" },
  { label: "Bebas Neue",         value: "Bebas Neue, cursive" },
  { label: "Playfair Display",   value: "Playfair Display, serif" },
  { label: "Righteous",          value: "Righteous, cursive" },
  { label: "Russo One",          value: "Russo One, sans-serif" },
]

// ─── Editable ─────────────────────────────────────────────────────────────────
// Uses innerHTML so inline <span style="color:..."> from the color toolbar survive.
function Editable({ value, onSave, className, style }: {
  value:      string
  onSave:     (v: string) => void
  className?: string
  style?:     React.CSSProperties
}) {
  const ref       = useRef<HTMLDivElement>(null)
  const prevVal   = useRef(value)
  const isFocused = useRef(false)

  useEffect(() => {
    if (ref.current) { ref.current.innerHTML = value; prevVal.current = value }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (ref.current && !isFocused.current && prevVal.current !== value) {
      ref.current.innerHTML = value
      prevVal.current = value
    }
  }, [value])

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={className}
      style={{ ...style, outline: "none", userSelect: "text", cursor: "text", whiteSpace: "pre-wrap" }}
      onFocus={() => { isFocused.current = true }}
      onBlur={(e)  => { isFocused.current = false; prevVal.current = e.currentTarget.innerHTML; onSave(e.currentTarget.innerHTML) }}
    />
  )
}

// ─── InlineColorBar ───────────────────────────────────────────────────────────
// Floats above any highlighted text inside a contenteditable.
// Saves the selection range before the color picker steals focus, then restores it.
function InlineColorBar({ editMode }: { editMode: boolean }) {
  const [pos, setPos]   = useState<{ x: number; y: number } | null>(null)
  const savedRange      = useRef<Range | null>(null)

  useEffect(() => {
    const onSel = () => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || !sel.toString()) { setPos(null); return }
      const anchor = sel.anchorNode?.parentElement
      if (!anchor?.closest("[contenteditable]")) { setPos(null); return }
      const rect = sel.getRangeAt(0).getBoundingClientRect()
      if (!rect.width) { setPos(null); return }
      setPos({ x: rect.left + rect.width / 2, y: rect.top })
    }
    document.addEventListener("selectionchange", onSel)
    return () => document.removeEventListener("selectionchange", onSel)
  }, [])

  if (!editMode || !pos) return null

  const saveRange = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange()
  }

  const restoreRange = () => {
    const sel = window.getSelection()
    if (savedRange.current && sel) { sel.removeAllRanges(); sel.addRange(savedRange.current) }
  }

  return (
    <div style={{
      position: "fixed",
      left: pos.x, top: pos.y - 46,
      transform: "translateX(-50%)",
      background: "rgba(14,6,28,0.97)",
      border: "1px solid rgba(168,85,247,0.35)",
      borderRadius: 8, padding: "5px 10px",
      display: "flex", alignItems: "center", gap: 8,
      zIndex: 1000,
      backdropFilter: "blur(8px)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
    }}>
      {/* colour label */}
      <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", userSelect: "none" }}>A</span>

      {/* colour picker */}
      <input
        type="color"
        defaultValue="#ffffff"
        onMouseDown={saveRange}
        onChange={(e) => { restoreRange(); document.execCommand("foreColor", false, e.target.value) }}
        style={{ width: 26, height: 22, borderRadius: 4, border: "1px solid rgba(168,85,247,0.3)", cursor: "pointer", padding: 1 }}
        title="Text color"
      />

      {/* remove inline colour */}
      <button
        onMouseDown={(e) => { e.preventDefault(); document.execCommand("removeFormat", false, undefined) }}
        style={{ fontSize: 11, color: "rgba(168,85,247,0.55)", background: "none", border: "none", cursor: "pointer", userSelect: "none", padding: "0 2px" }}
        title="Remove color"
      >×</button>
    </div>
  )
}

// ─── ElBox ────────────────────────────────────────────────────────────────────
function ElBox({
  el, isSelected, editMode,
  onStartDrag, onStartResize, onSelect, onChange, onCardChange, onQuoteChange,
}: {
  el:            El
  isSelected:    boolean
  editMode:      boolean
  onStartDrag:   (id: string, e: React.PointerEvent) => void
  onStartResize: (id: string, e: React.PointerEvent) => void
  onSelect:      (id: string | null) => void
  onChange:      (id: string, v: string) => void
  onCardChange:  (id: string, field: "num" | "title" | "body", v: string) => void
  onQuoteChange: (id: string, field: "first" | "second", v: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const showHandle  = editMode && (hovered || isSelected)
  const isCentered  = Math.abs((el.x + el.w / 2) - CX) < 2
  const computed    = applyOverrides(el)

  return (
    <div
      style={{ position: "absolute", left: el.x, top: el.y, width: el.w, minHeight: el.h, zIndex: isSelected ? 50 : 2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); if (editMode) onSelect(el.id) }}
    >
      {/* selection ring */}
      {editMode && isSelected && (
        <div style={{
          position: "absolute", inset: -2,
          border: "1.5px solid rgba(168,85,247,0.85)",
          borderRadius: 6, pointerEvents: "none", zIndex: 60,
        }} />
      )}

      {/* size badge */}
      {editMode && isSelected && (
        <div style={{
          position: "absolute", top: -26, left: 0,
          fontSize: 10, color: "rgba(168,85,247,0.7)",
          whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none",
        }}>
          {Math.round(el.w)} × {Math.round(el.h)}
          {isCentered && <span style={{ marginLeft: 6, color: "rgba(168,85,247,1)" }}>● centered</span>}
        </div>
      )}

      {/* drag handle */}
      {editMode && (
        <div
          onPointerDown={(e) => { e.stopPropagation(); onStartDrag(el.id, e) }}
          title="Drag to move"
          style={{
            position: "absolute", top: -14, left: 0, right: 0, height: 12,
            cursor: "grab",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: showHandle ? 1 : 0,
            transition: "opacity 0.12s",
            background: "rgba(123,47,190,0.3)",
            borderRadius: "4px 4px 0 0",
            userSelect: "none",
          }}
        >
          <div style={{ width: 30, height: 3, borderRadius: 2, background: "rgba(168,85,247,0.85)" }} />
        </div>
      )}

      {/* ── content ── */}
      {el.isIframe ? (
        <iframe
          src={el.content}
          style={{ width: "100%", height: el.h, border: "none", background: "transparent", overflow: "hidden", display: "block" }}
        />
      ) : el.card ? (
        <div style={{ ...computed, padding: "24px", borderRadius: 16, border: "1px solid rgba(168,85,247,0.2)", minHeight: el.h, display: "flex", flexDirection: "column", gap: 8 }}>
          <Editable value={el.card.num}   onSave={(v) => onCardChange(el.id, "num",   v)} style={{ fontSize: el.fontSize ?? 11, fontWeight: 700, letterSpacing: "0.1em", color: el.textColor ?? "var(--purple-light)" }} />
          <Editable value={el.card.title} onSave={(v) => onCardChange(el.id, "title", v)} style={{ fontSize: el.fontSize ?? 14, fontWeight: 600, color: el.textColor ?? "#fff" }} />
          <Editable value={el.card.body}  onSave={(v) => onCardChange(el.id, "body",  v)} style={{ fontSize: el.fontSize ?? 13, color: el.textColor ?? "rgba(255,255,255,0.5)", lineHeight: 1.6 }} />
        </div>
      ) : el.quoteParts ? (
        <div className={el.cls} style={{ color: "var(--foreground)" }}>
          <Editable value={el.quoteParts.first}  onSave={(v) => onQuoteChange(el.id, "first",  v)} style={el.textColor ? { color: el.textColor } : undefined} />
          <Editable value={el.quoteParts.second} onSave={(v) => onQuoteChange(el.id, "second", v)} style={{ color: el.textColor ?? "var(--purple-light)" }} />
        </div>
      ) : (
        <Editable value={el.content} onSave={(v) => onChange(el.id, v)} className={el.cls} style={computed} />
      )}

      {/* resize handle */}
      {editMode && isSelected && (
        <div
          onPointerDown={(e) => { e.stopPropagation(); onStartResize(el.id, e) }}
          title="Drag to resize"
          style={{
            position: "absolute", bottom: -6, right: -6,
            width: 12, height: 12,
            background: "rgba(168,85,247,0.9)", borderRadius: "50%",
            cursor: "se-resize", zIndex: 70,
          }}
        />
      )}
    </div>
  )
}

// ─── PropertiesPanel ──────────────────────────────────────────────────────────
function PropertiesPanel({ el, onUpdate, onDelete }: {
  el:       El
  onUpdate: (id: string, updates: Partial<El>) => void
  onDelete: (id: string) => void
}) {
  const isIframe = !!el.isIframe
  const textColor = el.textColor ?? "#ffffff"
  const bgColor   = el.bgColor   ?? "#1e0a3c"
  const fontSize  = el.fontSize  ?? ""

  const [panelPos, setPanelPos] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth - 234 : 900,
    y: typeof window !== "undefined" ? Math.max(60, window.innerHeight / 2 - 250) : 200,
  }))
  const dragging = useRef<{ ox: number; oy: number } | null>(null)

  const onDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = { ox: e.clientX - panelPos.x, oy: e.clientY - panelPos.y }
  }
  const onDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    setPanelPos({ x: e.clientX - dragging.current.ox, y: e.clientY - dragging.current.oy })
  }
  const onDragEnd = () => { dragging.current = null }

  const row: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }
  const label: React.CSSProperties = { fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", textTransform: "uppercase" as const }
  const inputBase: React.CSSProperties = { borderRadius: 6, border: "1px solid rgba(168,85,247,0.25)", background: "rgba(255,255,255,0.04)", color: "#f0eeff", fontSize: 12, padding: "4px 8px" }

  return (
    <div
      style={{
        position: "fixed", left: panelPos.x, top: panelPos.y,
        width: 210,
        background: "rgba(14,6,28,0.96)",
        border: "1px solid rgba(168,85,247,0.3)",
        borderRadius: 12, overflow: "hidden",
        zIndex: 600, color: "#f0eeff", fontSize: 12,
        backdropFilter: "blur(12px)",
        userSelect: "none",
      }}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
    >
      {/* drag handle */}
      <div
        onPointerDown={onDragStart}
        style={{
          padding: "8px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "grab", background: "rgba(123,47,190,0.2)",
          borderBottom: "1px solid rgba(168,85,247,0.15)",
        }}
      >
        <span style={{ fontWeight: 700, color: "rgba(168,85,247,0.85)", letterSpacing: "0.08em", fontSize: 10, textTransform: "uppercase" }}>
          {el.id}
        </span>
        <span style={{ color: "rgba(168,85,247,0.4)", fontSize: 14, letterSpacing: 2 }}>⠿</span>
      </div>

      <div style={{ padding: "12px 14px 10px" }}>

      {!isIframe && (
        <>
          <div style={row}>
            <span style={label}>Text Color</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={textColor} onChange={(e) => onUpdate(el.id, { textColor: e.target.value })}
                style={{ width: 28, height: 24, borderRadius: 4, border: "1px solid rgba(168,85,247,0.3)", cursor: "pointer", padding: 1 }} />
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{textColor}</span>
            </div>
          </div>

          <div style={row}>
            <span style={label}>Font Size (px)</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="number" min={8} max={160} value={fontSize}
                placeholder="auto"
                onChange={(e) => onUpdate(el.id, { fontSize: e.target.value ? parseInt(e.target.value) : undefined })}
                style={{ ...inputBase, width: 64 }} />
              {el.fontSize && (
                <button onClick={() => onUpdate(el.id, { fontSize: undefined })}
                  style={{ fontSize: 11, color: "rgba(168,85,247,0.6)", background: "none", border: "none", cursor: "pointer" }}>
                  reset
                </button>
              )}
            </div>
          </div>

          <div style={row}>
            <span style={label}>Font Family</span>
            <select
              value={el.fontFamily ?? ""}
              onChange={(e) => onUpdate(el.id, { fontFamily: e.target.value || undefined })}
              style={{ ...inputBase, width: "100%", cursor: "pointer" }}
            >
              {FONTS.map(f => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value || "inherit" }}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div style={row}>
            <span style={label}>Style</span>
            <div style={{ display: "flex", gap: 6 }}>
              {/* Bold */}
              <button
                onClick={() => onUpdate(el.id, { fontWeight: el.fontWeight === 700 ? undefined : 700 })}
                style={{
                  width: 34, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700,
                  border: "1px solid rgba(168,85,247,0.3)",
                  background: el.fontWeight === 700 ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.04)",
                  color: el.fontWeight === 700 ? "#c084fc" : "rgba(255,255,255,0.6)",
                }}
                title="Bold"
              >B</button>
              {/* Italic */}
              <button
                onClick={() => onUpdate(el.id, { fontStyle: el.fontStyle === "italic" ? undefined : "italic" })}
                style={{
                  width: 34, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 13, fontStyle: "italic",
                  border: "1px solid rgba(168,85,247,0.3)",
                  background: el.fontStyle === "italic" ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.04)",
                  color: el.fontStyle === "italic" ? "#c084fc" : "rgba(255,255,255,0.6)",
                }}
                title="Italic"
              >I</button>
              {/* Clear both */}
              {(el.fontWeight || el.fontStyle) && (
                <button
                  onClick={() => onUpdate(el.id, { fontWeight: undefined, fontStyle: undefined })}
                  style={{ fontSize: 10, color: "rgba(168,85,247,0.5)", background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}
                  title="Clear style overrides"
                >clear</button>
              )}
            </div>
          </div>
        </>
      )}

      <div style={row}>
        <span style={label}>Background</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="color" value={bgColor} onChange={(e) => onUpdate(el.id, { bgColor: e.target.value })}
            style={{ width: 28, height: 24, borderRadius: 4, border: "1px solid rgba(168,85,247,0.3)", cursor: "pointer", padding: 1 }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{bgColor}</span>
          {el.bgColor && (
            <button onClick={() => onUpdate(el.id, { bgColor: undefined })}
              style={{ fontSize: 11, color: "rgba(168,85,247,0.6)", background: "none", border: "none", cursor: "pointer" }}>
              reset
            </button>
          )}
        </div>
      </div>

      {/* position + size inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
        {(["x","y","w","h"] as const).map(k => (
          <label key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={label}>{k.toUpperCase()}</span>
            <input type="number" value={Math.round(el[k])}
              onChange={(e) => onUpdate(el.id, { [k]: parseInt(e.target.value) || 0 })}
              style={{ ...inputBase, width: "100%" }} />
          </label>
        ))}
      </div>

      {isIframe && (
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 10, lineHeight: 1.5 }}>
          Resize with the purple corner handle.
        </p>
      )}

      <button onClick={() => onDelete(el.id)} style={{
        width: "100%", padding: "6px", borderRadius: 8,
        border: "1px solid rgba(239,68,68,0.35)",
        background: "rgba(239,68,68,0.08)",
        color: "rgba(239,68,68,0.75)",
        cursor: "pointer", fontSize: 12, fontWeight: 600,
      }}>
        Delete
      </button>
      </div>
    </div>
  )
}

// ─── EditorToolbar ────────────────────────────────────────────────────────────
function EditorToolbar({ editMode, onToggle, onAddText, onSave, saving, saved }: {
  editMode: boolean
  onToggle: () => void
  onAddText:() => void
  onSave:   () => void
  saving:   boolean
  saved:    boolean
}) {
  const btn: React.CSSProperties = {
    padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    border: "1px solid rgba(168,85,247,0.4)", cursor: "pointer",
  }
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: TOOLBAR_H,
      background: "rgba(10,4,22,0.97)",
      borderBottom: "1px solid rgba(168,85,247,0.2)",
      display: "flex", alignItems: "center", gap: 8, padding: "0 16px",
      zIndex: 500, backdropFilter: "blur(8px)",
    }}>
      <span style={{ fontWeight: 800, fontSize: 13, color: "rgba(168,85,247,0.85)", marginRight: 6, letterSpacing: "0.04em" }}>
        MI-LOT
      </span>

      <button onClick={onToggle} style={{
        ...btn,
        background: editMode ? "rgba(168,85,247,0.18)" : "transparent",
        color: editMode ? "#c084fc" : "rgba(255,255,255,0.4)",
      }}>
        {editMode ? "⚡ Editing" : "○ Preview"}
      </button>

      {editMode && (
        <>
          <button onClick={onAddText} style={{ ...btn, background: "transparent", color: "rgba(255,255,255,0.65)" }}>
            + Text Box
          </button>
          <button onClick={onSave} disabled={saving} style={{
            ...btn,
            background: saved  ? "rgba(34,197,94,0.15)"   : "rgba(168,85,247,0.18)",
            color:      saved  ? "rgba(134,239,172,0.9)"  : "#c084fc",
            border:     saved  ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(168,85,247,0.4)",
          }}>
            {saving ? "Saving…" : saved ? "✓ Saved" : "💾 Save Layout"}
          </button>
        </>
      )}

      <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.18)" }}>
        {editMode ? "Drag handles visible · Preview to see live look" : "Preview mode · click Editing to make changes"}
      </span>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLDivElement>(null)
  const [scale,    setScale]    = useState(1)
  const [editMode, setEditMode] = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [els,      setEls]      = useState<El[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null)
  const [resizing, setResizing] = useState<{ id: string; sx: number; sy: number; sw: number; sh: number } | null>(null)
  const [guideV,   setGuideV]   = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Load layout from canvas-data.json on mount
  useEffect(() => {
    fetch("/canvas-data.json")
      .then(r => r.json())
      .then((data: El[]) => setEls(data))
      .catch(err => console.error("Could not load canvas-data.json:", err))
  }, [])

  // Scale canvas to fill container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setScale(containerRef.current.offsetWidth / CANVAS_W)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const toCanvas = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale }
  }, [scale])

  const startDrag = useCallback((id: string, e: React.PointerEvent) => {
    if (!editMode) return
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    const el  = els.find(el => el.id === id)!
    const pos = toCanvas(e.clientX, e.clientY)
    setDragging({ id, ox: pos.x - el.x, oy: pos.y - el.y })
    setSelected(id)
    setIsDragging(true)
  }, [els, toCanvas, editMode])

  const startResize = useCallback((id: string, e: React.PointerEvent) => {
    if (!editMode) return
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    const el = els.find(el => el.id === id)!
    setResizing({ id, sx: e.clientX, sy: e.clientY, sw: el.w, sh: el.h })
    setSelected(id)
  }, [els, editMode])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging) {
      const pos = toCanvas(e.clientX, e.clientY)
      setEls(prev => prev.map(el => {
        if (el.id !== dragging.id) return el
        let newX = pos.x - dragging.ox
        const newY = pos.y - dragging.oy
        const snap = Math.abs((newX + el.w / 2) - CX) < SNAP
        setGuideV(snap)
        if (snap) newX = CX - el.w / 2
        return { ...el, x: newX, y: newY }
      }))
    }
    if (resizing) {
      setEls(prev => prev.map(el => {
        if (el.id !== resizing.id) return el
        return {
          ...el,
          w: Math.max(60,  resizing.sw + (e.clientX - resizing.sx) / scale),
          h: Math.max(20,  resizing.sh + (e.clientY - resizing.sy) / scale),
        }
      }))
    }
  }, [dragging, resizing, toCanvas, scale])

  const onPointerUp = useCallback(() => {
    setDragging(null); setResizing(null); setGuideV(false); setIsDragging(false)
  }, [])

  const onChange      = useCallback((id: string, v: string) => setEls(p => p.map(el => el.id === id ? { ...el, content: v }  : el)), [])
  const onCardChange  = useCallback((id: string, f: "num"|"title"|"body", v: string) => setEls(p => p.map(el => el.id === id && el.card ? { ...el, card: { ...el.card, [f]: v } } : el)), [])
  const onQuoteChange = useCallback((id: string, f: "first"|"second", v: string) => setEls(p => p.map(el => el.id === id && el.quoteParts ? { ...el, quoteParts: { ...el.quoteParts, [f]: v } } : el)), [])
  const updateEl      = useCallback((id: string, updates: Partial<El>) => setEls(p => p.map(el => el.id === id ? { ...el, ...updates } : el)), [])
  const deleteEl      = useCallback((id: string) => { setEls(p => p.filter(el => el.id !== id)); setSelected(null) }, [])

  const addTextBox = useCallback(() => {
    const id = `text-${Date.now()}`
    setEls(p => [...p, {
      id, x: CX - 150, y: 500, w: 300, h: 50,
      content: "New text box",
      cls: "text-lg text-white text-center",
    }])
    setSelected(id)
  }, [])

  const saveLayout = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/save-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(els),
      })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    } finally {
      setSaving(false)
    }
  }

  const selectedEl = els.find(el => el.id === selected) ?? null

  return (
    <>
      <InlineColorBar editMode={editMode} />
      <EditorToolbar
        editMode={editMode}
        onToggle={() => { setEditMode(m => !m); setSelected(null) }}
        onAddText={addTextBox}
        onSave={saveLayout}
        saving={saving}
        saved={saved}
      />

      {editMode && selectedEl && (
        <PropertiesPanel el={selectedEl} onUpdate={updateEl} onDelete={deleteEl} />
      )}

      {/* container sits below the fixed toolbar */}
      <div ref={containerRef} style={{ width: "100%", height: CANVAS_H * scale, overflow: "hidden", marginTop: TOOLBAR_H }}>
        <div
          ref={canvasRef}
          style={{
            position: "relative", width: CANVAS_W, height: CANVAS_H,
            background: "var(--background)",
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={() => setSelected(null)}
        >
          {/* vertical center guide */}
          <div style={{
            position: "absolute", left: CX, top: 0, bottom: 0, width: 1,
            borderLeft: isDragging ? `1px dashed ${guideV ? "rgba(168,85,247,1)" : "rgba(168,85,247,0.25)"}` : "none",
            zIndex: 200, pointerEvents: "none", transition: "border-color 0.1s",
          }} />

          {/* footer separator */}
          <div style={{
            position: "absolute", left: 32, right: 32, top: 1490,
            borderTop: "1px solid rgba(255,255,255,0.08)", pointerEvents: "none",
          }} />

          {els.map(el => (
            <ElBox
              key={el.id}
              el={el}
              isSelected={selected === el.id}
              editMode={editMode}
              onStartDrag={startDrag}
              onStartResize={startResize}
              onSelect={setSelected}
              onChange={onChange}
              onCardChange={onCardChange}
              onQuoteChange={onQuoteChange}
            />
          ))}
        </div>
      </div>
    </>
  )
}
