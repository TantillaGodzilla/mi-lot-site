"use client"

import { useState, useEffect } from "react"

// ─── types ────────────────────────────────────────────────────────────────────
interface LeadFormData {
  // Page 1
  buyer_focus: string
  timeline: string
  new_or_used: string
  motivations: string
  quick_request: string
  // More Specific Needs
  body_style: string[]
  seats: string[]
  fuel_type: string[]
  makes: string[]
  models: string[]
  year_from: string
  year_to: string
  specifics: string
  must_have: string
  preferred: string
  // Budget
  financing: string[]
  otd_price_min: string
  otd_price_max: string
  monthly_budget: string
  down_payment: string
  credit: string
  // Trade Information
  ownership_status: string
  trade_year: string
  trade_make: string
  trade_model: string
  trade_miles: string
  trade_vin: string
  smoked_in: string
  trade_problems: string
  financing_details: string
  leasing_details: string
  // Page 2
  name: string
  phone: string
  email: string
  zip: string
  contact_method: string
  note: string
}

const EMPTY: LeadFormData = {
  buyer_focus: "", timeline: "", new_or_used: "",
  motivations: "", quick_request: "",
  body_style: [], seats: [], fuel_type: [],
  makes: [], models: [], year_from: "", year_to: "",
  specifics: "", must_have: "", preferred: "",
  financing: [], otd_price_min: "", otd_price_max: "", monthly_budget: "",
  down_payment: "", credit: "",
  ownership_status: "", trade_miles: "",
  trade_year: "", trade_make: "", trade_model: "",
  trade_vin: "", smoked_in: "", trade_problems: "",
  financing_details: "", leasing_details: "",
  name: "", phone: "", email: "",
  zip: "", contact_method: "", note: "",
}

// ─── styles ───────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px",
  borderRadius: 10, fontSize: 15,
  border: "1px solid rgba(168,85,247,0.25)",
  background: "rgba(255,255,255,0.04)",
  color: "#f0eeff", outline: "none",
  boxSizing: "border-box",
}

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" }

const optStyle: React.CSSProperties = { color: "#1a0a2e", background: "#fff" }

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 88,
  fontFamily: "inherit",
  lineHeight: 1.5,
}

const labelStyle: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: 6,
  fontSize: 13, fontWeight: 600,
  color: "rgba(240,238,255,0.55)", letterSpacing: "0.04em",
}

const fieldGroupStyle: React.CSSProperties = {
  ...labelStyle,
}

// ─── helpers ──────────────────────────────────────────────────────────────────
const YEARS = Array.from({ length: 101 }, (_, i) => String(2026 - i))

const ALL_MAKES = [
  "Acura","Alfa Romeo","AMC","Aston Martin","Audi","Bentley","BMW","Buick",
  "Cadillac","Chevrolet","Chrysler","Daewoo","Datsun","Dodge","Eagle",
  "Ferrari","Fiat","Fisker","Ford","Genesis","Geo","GMC","Honda","Hummer",
  "Hyundai","Infiniti","Isuzu","Jaguar","Jeep","Kia","Lamborghini",
  "Land Rover","Lexus","Lincoln","Lotus","Lucid","Maserati","Maybach",
  "Mazda","McLaren","Mercedes-Benz","Mercury","Mini","Mitsubishi","Nissan",
  "Oldsmobile","Plymouth","Polestar","Pontiac","Porsche","Ram","Rivian",
  "Rolls-Royce","Saab","Saturn","Scion","Sterling","Subaru","Suzuki",
  "Tesla","Toyota","Volkswagen","Volvo",
].sort()

const MODELS_BY_MAKE: Record<string, string[]> = {
  "Acura":         ["CL","ILX","Integra","Legend","MDX","NSX","RDX","RL","RLX","RSX","TL","TLX","TSX","Vigor","ZDX"],
  "Alfa Romeo":    ["164","4C","Giulia","Giulietta","GTV","Milano","Spider","Stelvio","Tonale"],
  "AMC":           ["Ambassador","AMX","Concord","Eagle","Gremlin","Hornet","Javelin","Matador","Pacer","Rebel","Spirit"],
  "Aston Martin":  ["DB7","DB9","DB11","DBS","DBX","Rapide","Vantage","Virage"],
  "Audi":          ["A3","A4","A5","A6","A7","A8","allroad","e-tron","Q3","Q4 e-tron","Q5","Q7","Q8","R8","RS3","RS4","RS5","RS6","RS7","S3","S4","S5","S6","S7","S8","SQ5","SQ7","SQ8","TT","TTS"],
  "Bentley":       ["Arnage","Bentayga","Continental","Flying Spur","Mulsanne"],
  "BMW":           ["1 Series","2 Series","3 Series","4 Series","5 Series","6 Series","7 Series","8 Series","i3","i4","i5","i7","iX","M2","M3","M4","M5","M6","M8","X1","X2","X3","X4","X5","X6","X7","XM","Z3","Z4"],
  "Buick":         ["Century","Electra","Enclave","Encore","Encore GX","Envision","Envista","LaCrosse","LeSabre","Lucerne","Park Avenue","Rainier","Reatta","Regal","Rendezvous","Riviera","Roadmaster","Skylark","Verano","Wildcat"],
  "Cadillac":      ["ATS","Brougham","CT4","CT5","CT6","CTS","DeVille","DTS","Eldorado","Escalade","Escalade ESV","Fleetwood","Lyriq","Seville","SRX","STS","XLR","XT4","XT5","XT6"],
  "Chevrolet":     ["Astro","Avalanche","Aveo","Blazer","Bolt","Camaro","Caprice","Cobalt","Colorado","Corvette","Cruze","Equinox","Express","HHR","Impala","Lumina","Malibu","Monte Carlo","Nova","S-10","Silverado","Sonic","Spark","Suburban","Tahoe","TrailBlazer","Traverse","Trax","Venture"],
  "Chrysler":      ["200","300","300M","Aspen","Cirrus","Concorde","Crossfire","Imperial","LeBaron","New Yorker","Pacifica","PT Cruiser","Sebring","Town & Country","Voyager"],
  "Daewoo":        ["Lanos","Leganza","Nubira"],
  "Datsun":        ["1200","210","240Z","260Z","280Z","510","610","710","810","B210","Pickup"],
  "Dodge":         ["Avenger","Caliber","Challenger","Charger","Dakota","Dart","Durango","Dynasty","Grand Caravan","Hornet","Intrepid","Journey","Magnum","Neon","Nitro","Ram","Shadow","Stealth","Stratus","Viper"],
  "Eagle":         ["Premier","Summit","Talon","Vision"],
  "Ferrari":       ["296","308","328","348","355","360","430","458","488","812","California","F40","F8","GTC4Lusso","LaFerrari","Portofino","Roma","SF90","Testarossa"],
  "Fiat":          ["124 Spider","500","500L","500X","Spider"],
  "Fisker":        ["Karma","Ocean"],
  "Ford":          ["Bronco","Bronco Sport","Crown Victoria","EcoSport","Edge","Escape","Escort","Expedition","Explorer","F-150","F-250","F-350","Fairlane","Fiesta","Five Hundred","Flex","Focus","Freestyle","Fusion","Galaxie","GT","LTD","Maverick","Mustang","Mustang Mach-E","Pinto","Probe","Ranger","Taurus","Tempo","Thunderbird","Transit","Windstar"],
  "Genesis":       ["G70","G80","G90","GV70","GV80","GV90"],
  "Geo":           ["Metro","Prizm","Storm","Tracker"],
  "GMC":           ["Acadia","Canyon","Envoy","Jimmy","Safari","Savana","Sierra","Sonoma","Terrain","Yukon","Yukon XL"],
  "Honda":         ["Accord","Civic","Clarity","CR-V","CR-Z","Crosstour","del Sol","Element","Fit","HR-V","Insight","Odyssey","Passport","Pilot","Prelude","Prologue","Ridgeline","S2000"],
  "Hummer":        ["H1","H2","H3"],
  "Hyundai":       ["Accent","Azera","Elantra","Entourage","Equus","Genesis","Ioniq","Ioniq 5","Ioniq 6","Kona","Nexo","Palisade","Santa Cruz","Santa Fe","Sonata","Tiburon","Tucson","Veloster","Venue","Veracruz"],
  "Infiniti":      ["EX","FX","G","I","J","M","Q30","Q45","Q50","Q60","Q70","QX30","QX4","QX50","QX55","QX56","QX60","QX80"],
  "Isuzu":         ["Amigo","Axiom","i-Series","Impulse","Rodeo","Stylus","Trooper","VehiCROSS"],
  "Jaguar":        ["E-Pace","F-Pace","F-Type","I-Pace","S-Type","X-Type","XE","XF","XJ","XJS","XK"],
  "Jeep":          ["Cherokee","Commander","Compass","Gladiator","Grand Cherokee","Grand Wagoneer","Liberty","Patriot","Renegade","Wagoneer","Wrangler"],
  "Kia":           ["Amanti","Borrego","Cadenza","Carnival","EV6","EV9","Forte","K5","K900","Niro","Optima","Rio","Sedona","Seltos","Sorento","Soul","Spectra","Sportage","Stinger","Telluride"],
  "Lamborghini":   ["Aventador","Countach","Diablo","Gallardo","Huracan","Murcielago","Revuelto","Urus"],
  "Land Rover":    ["Defender","Discovery","Discovery Sport","Freelander","LR2","LR3","LR4","Range Rover","Range Rover Evoque","Range Rover Sport","Range Rover Velar"],
  "Lexus":         ["CT","ES","GS","GX","IS","LC","LFA","LS","LX","NX","RC","RX","RZ","SC","TX","UX"],
  "Lincoln":       ["Aviator","Blackwood","Continental","Corsair","LS","Mark VII","Mark VIII","MKC","MKS","MKT","MKX","MKZ","Nautilus","Navigator","Town Car","Zephyr"],
  "Lotus":         ["Elise","Emira","Evija","Evora","Exige"],
  "Lucid":         ["Air","Gravity"],
  "Maserati":      ["Ghibli","GranTurismo","Grecale","Levante","MC20","Quattroporte"],
  "Maybach":       ["57","62","GLS","S-Class"],
  "Mazda":         ["3","5","6","626","929","B-Series","CX-3","CX-30","CX-5","CX-50","CX-70","CX-90","Miata","Millenia","MPV","MX-30","MX-5","MX-6","Protege","RX-7","RX-8","Tribute"],
  "McLaren":       ["540C","570S","600LT","650S","675LT","720S","750S","765LT","Artura","MP4-12C","P1","Senna"],
  "Mercedes-Benz": ["A-Class","AMG GT","C-Class","CLA","CLS","E-Class","EQB","EQC","EQE","EQS","G-Class","GLA","GLB","GLC","GLE","GLS","ML","R-Class","S-Class","SL","SLC","SLK","Sprinter"],
  "Mercury":       ["Capri","Colony Park","Cougar","Grand Marquis","Marauder","Marquis","Montego","Monterey","Mystique","Sable","Topaz","Tracer","Villager"],
  "Mini":          ["Clubman","Convertible","Countryman","Coupe","Hardtop","Paceman","Roadster"],
  "Mitsubishi":    ["3000GT","Diamante","Eclipse","Eclipse Cross","Endeavor","Galant","Mirage","Montero","Outlander","Outlander Sport","Raider"],
  "Nissan":        ["1200","200SX","240SX","300ZX","350Z","370Z","Altima","Armada","Ariya","Frontier","GT-R","Kicks","Leaf","Maxima","Murano","Pathfinder","Pulsar","Quest","Rogue","Rogue Sport","Sentra","Stanza","Titan","Versa","Xterra","Z"],
  "Oldsmobile":    ["88","98","Achieva","Alero","Aurora","Bravada","Cutlass","Cutlass Supreme","Delta 88","Intrigue","Silhouette","Toronado"],
  "Plymouth":      ["Barracuda","Duster","Fury","Gran Fury","Horizon","Laser","Neon","Prowler","Road Runner","Satellite","Sundance","Valiant","Voyager"],
  "Polestar":      ["1","2","3","4"],
  "Pontiac":       ["Aztek","Bonneville","Firebird","G5","G6","G8","GTO","Grand Am","Grand Prix","Montana","Solstice","Sunbird","Sunfire","Torrent","Trans Am","Vibe"],
  "Porsche":       ["356","718","911","918","944","968","Boxster","Cayenne","Cayman","Macan","Panamera","Taycan"],
  "Ram":           ["1500","2500","3500","ProMaster","ProMaster City"],
  "Rivian":        ["R1S","R1T","R2"],
  "Rolls-Royce":   ["Cullinan","Dawn","Ghost","Phantom","Silver Shadow","Silver Spirit","Silver Spur","Spectre","Wraith"],
  "Saab":          ["9-2X","9-3","9-4X","9-5","9-7X","900","9000"],
  "Saturn":        ["Astra","Aura","Ion","L-Series","Outlook","Relay","SC","SL","SW","Vue"],
  "Scion":         ["FR-S","iA","iM","iQ","tC","xA","xB","xD"],
  "Sterling":      ["825","827"],
  "Subaru":        ["Ascent","Baja","BRZ","Crosstrek","Forester","Impreza","Justy","Legacy","Loyale","Outback","SVX","Tribeca","WRX","XT"],
  "Suzuki":        ["Aerio","Equator","Esteem","Forenza","Grand Vitara","Kizashi","Reno","Samurai","Sidekick","Swift","SX4","Verona","Vitara","XL-7"],
  "Tesla":         ["Cybertruck","Model 3","Model S","Model X","Model Y","Roadster"],
  "Toyota":        ["4Runner","86","Avalon","C-HR","Camry","Celica","Corolla","Corolla Cross","Cressida","Crown","FJ Cruiser","GR86","GR Corolla","GR Supra","Highlander","Land Cruiser","Matrix","MR2","Previa","Prius","Prius C","Prius V","RAV4","Sequoia","Sienna","Solara","Supra","Tacoma","Tercel","Tundra","Venza"],
  "Volkswagen":    ["Arteon","Atlas","Atlas Cross Sport","Beetle","Cabrio","Corrado","EOS","Golf","GTI","ID.4","ID.Buzz","Jetta","Passat","Phaeton","Rabbit","Routan","Taos","Tiguan","Touareg"],
  "Volvo":         ["240","740","850","940","960","C30","C40","C70","S40","S60","S70","S80","S90","V40","V50","V60","V70","V90","XC40","XC60","XC70","XC90"],
}

function ModelsPicker({
  makes, value, onChange,
}: {
  makes: string[]
  value: string[]
  onChange: (next: string[]) => void
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen]   = useState(false)

  const pool = makes.length > 0
    ? makes.flatMap(m => MODELS_BY_MAKE[m] ?? [])
    : Object.values(MODELS_BY_MAKE).flat()

  const filtered = query.length > 0
    ? pool.filter(m => m.toLowerCase().startsWith(query.toLowerCase()) && !value.includes(m)).slice(0, 8)
    : []

  const add = (model: string) => {
    const trimmed = model.trim()
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed])
    setQuery("")
    setOpen(false)
  }

  const remove = (model: string) => onChange(value.filter(m => m !== model))

  const placeholder = makes.length === 0
    ? "Select a make above first…"
    : "Type a model…"

  return (
    <div>
      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {value.map(m => (
            <span key={m} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 999,
              background: "rgba(168,85,247,0.2)",
              border: "1px solid rgba(168,85,247,0.35)",
              fontSize: 13, color: "#f0eeff",
            }}>
              {m}
              <button
                type="button"
                onClick={() => remove(m)}
                style={{ background: "none", border: "none", color: "rgba(240,238,255,0.45)", cursor: "pointer", padding: 0, fontSize: 15, lineHeight: 1 }}
              >×</button>
            </span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, position: "relative" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onKeyDown={e => {
              if (e.key === "Enter") { e.preventDefault(); filtered[0] ? add(filtered[0]) : query.trim() && add(query) }
              if (e.key === "Escape") setOpen(false)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={placeholder}
            disabled={makes.length === 0}
            style={{ ...inputStyle, opacity: makes.length === 0 ? 0.4 : 1 }}
          />
          {open && filtered.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
              background: "#1e0a3c",
              border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: 10, zIndex: 50, overflow: "hidden",
            }}>
              {filtered.map(m => (
                <div
                  key={m}
                  onMouseDown={() => add(m)}
                  style={{ padding: "10px 14px", fontSize: 14, color: "#f0eeff", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,85,247,0.15)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          disabled={makes.length === 0}
          onClick={() => filtered[0] ? add(filtered[0]) : query.trim() && add(query)}
          style={{
            padding: "0 18px", borderRadius: 10,
            background: "rgba(168,85,247,0.2)",
            border: "1px solid rgba(168,85,247,0.35)",
            color: "#f0eeff", fontWeight: 700, fontSize: 14,
            cursor: makes.length === 0 ? "not-allowed" : "pointer",
            opacity: makes.length === 0 ? 0.4 : 1,
            whiteSpace: "nowrap",
          }}
        >
          + Add
        </button>
      </div>
    </div>
  )
}

function SingleAutocomplete({
  options, value, onChange, placeholder = "Type to search…", disabled = false,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  const [query, setQuery] = useState(value)
  const [open,  setOpen]  = useState(false)

  useEffect(() => { setQuery(value) }, [value])

  const filtered = query.length > 0 && query !== value
    ? options.filter(o => o.toLowerCase().startsWith(query.toLowerCase())).slice(0, 8)
    : []

  const select = (opt: string) => { onChange(opt); setQuery(opt); setOpen(false) }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(""); setOpen(true) }}
          onKeyDown={e => {
            if (e.key === "Enter") { e.preventDefault(); if (filtered[0]) select(filtered[0]) }
            if (e.key === "Escape") setOpen(false)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          disabled={disabled}
          style={{ ...inputStyle, flex: 1, opacity: disabled ? 0.4 : 1 }}
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(""); setQuery("") }}
            style={{
              padding: "0 14px", borderRadius: 10,
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "rgba(240,238,255,0.5)", fontSize: 18,
              cursor: "pointer", lineHeight: 1,
            }}
          >×</button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#1e0a3c",
          border: "1px solid rgba(168,85,247,0.3)",
          borderRadius: 10, zIndex: 50, overflow: "hidden",
        }}>
          {filtered.map(o => (
            <div
              key={o}
              onMouseDown={() => select(o)}
              style={{ padding: "10px 14px", fontSize: 14, color: "#f0eeff", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,85,247,0.15)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >{o}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function MultiPicker({
  options, value, onChange, placeholder = "Add…",
}: {
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}) {
  const remaining = options.filter(o => !value.includes(o))
  return (
    <div>
      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {value.map(v => (
            <span key={v} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 999,
              background: "rgba(168,85,247,0.2)",
              border: "1px solid rgba(168,85,247,0.35)",
              fontSize: 13, color: "#f0eeff",
            }}>
              {v}
              <button
                type="button"
                onClick={() => onChange(value.filter(x => x !== v))}
                style={{ background: "none", border: "none", color: "rgba(240,238,255,0.45)", cursor: "pointer", padding: 0, fontSize: 15, lineHeight: 1 }}
              >×</button>
            </span>
          ))}
        </div>
      )}
      {remaining.length > 0 ? (
        <select
          value=""
          onChange={e => { if (e.target.value) onChange([...value, e.target.value]) }}
          style={selectStyle}
        >
          <option value="" style={optStyle}>{placeholder}</option>
          {remaining.map(o => <option key={o} value={o} style={optStyle}>{o}</option>)}
        </select>
      ) : (
        <p style={{ fontSize: 12, color: "rgba(240,238,255,0.3)", margin: 0 }}>All options selected</p>
      )}
    </div>
  )
}

function MakesPicker({
  value, onChange,
}: {
  value: string[]
  onChange: (next: string[]) => void
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen]   = useState(false)

  const filtered = query.length > 0
    ? ALL_MAKES.filter(m => m.toLowerCase().startsWith(query.toLowerCase()) && !value.includes(m)).slice(0, 8)
    : []

  const add = (make: string) => {
    const trimmed = make.trim()
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed])
    setQuery("")
    setOpen(false)
  }

  const remove = (make: string) => onChange(value.filter(m => m !== make))

  return (
    <div>
      {/* Tags */}
      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {value.map(m => (
            <span key={m} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 999,
              background: "rgba(168,85,247,0.2)",
              border: "1px solid rgba(168,85,247,0.35)",
              fontSize: 13, color: "#f0eeff",
            }}>
              {m}
              <button
                type="button"
                onClick={() => remove(m)}
                style={{
                  background: "none", border: "none",
                  color: "rgba(240,238,255,0.45)", cursor: "pointer",
                  padding: 0, fontSize: 15, lineHeight: 1,
                }}
              >×</button>
            </span>
          ))}
        </div>
      )}

      {/* Input + Add */}
      <div style={{ display: "flex", gap: 8, position: "relative" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onKeyDown={e => {
              if (e.key === "Enter") { e.preventDefault(); filtered[0] ? add(filtered[0]) : query.trim() && add(query) }
              if (e.key === "Escape") setOpen(false)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Type a make…"
            style={inputStyle}
          />
          {open && filtered.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
              background: "#1e0a3c",
              border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: 10, zIndex: 50, overflow: "hidden",
            }}>
              {filtered.map(m => (
                <div
                  key={m}
                  onMouseDown={() => add(m)}
                  style={{
                    padding: "10px 14px", fontSize: 14,
                    color: "#f0eeff", cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,85,247,0.15)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => filtered[0] ? add(filtered[0]) : query.trim() && add(query)}
          style={{
            padding: "0 18px", borderRadius: 10,
            background: "rgba(168,85,247,0.2)",
            border: "1px solid rgba(168,85,247,0.35)",
            color: "#f0eeff", fontWeight: 700, fontSize: 14,
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          + Add
        </button>
      </div>
    </div>
  )
}

function toggleItem(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
}

function CheckGroup({
  options, value, onChange, columns = 2,
}: {
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
  columns?: number
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: "8px 16px",
      marginTop: 2,
    }}>
      {options.map(opt => (
        <label key={opt} style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 14, fontWeight: 400,
          color: "rgba(240,238,255,0.7)",
          cursor: "pointer", letterSpacing: 0,
        }}>
          <input
            type="checkbox"
            checked={value.includes(opt)}
            onChange={() => onChange(toggleItem(value, opt))}
            style={{ accentColor: "#a855f7", width: 15, height: 15, cursor: "pointer", flexShrink: 0 }}
          />
          {opt}
        </label>
      ))}
    </div>
  )
}

function RadioGroup({
  options, value, onChange,
}: {
  options: string[]
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
      {options.map(opt => (
        <label key={opt} style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 14, fontWeight: 400,
          color: "rgba(240,238,255,0.7)",
          cursor: "pointer", letterSpacing: 0,
        }}>
          <input
            type="radio"
            checked={value === opt}
            onChange={() => onChange(opt)}
            style={{ accentColor: "#a855f7", width: 15, height: 15, cursor: "pointer", flexShrink: 0 }}
          />
          {opt}
        </label>
      ))}
    </div>
  )
}

function Section({
  title, children, defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{
      border: "1px solid rgba(168,85,247,0.2)",
      borderRadius: 14, overflow: "hidden",
    }}>
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 18px",
          background: "rgba(123,47,190,0.12)",
          cursor: "pointer",
          fontSize: 14, fontWeight: 700,
          color: "rgba(240,238,255,0.8)",
          letterSpacing: "0.03em",
          userSelect: "none",
        }}
        onClick={() => setOpen(o => !o)}
      >
        <span>{title}</span>
        <span style={{ fontSize: 12, opacity: 0.5 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{
          padding: "18px",
          display: "flex", flexDirection: "column", gap: 16,
          background: "rgba(255,255,255,0.01)",
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── LeadForm ─────────────────────────────────────────────────────────────────
export default function LeadForm() {
  const [form, setForm] = useState<LeadFormData>(EMPTY)
  const [page, setPage] = useState<1 | 2>(1)
  const [status,     setStatus]     = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errMsg,     setErrMsg]     = useState("")
  const [vinStatus,  setVinStatus]  = useState<"idle" | "decoding" | "ok" | "error">("idle")
  const [vinResult,  setVinResult]  = useState<{ year: string; make: string; model: string; body: string } | null>(null)
  const [vinErrMsg,  setVinErrMsg]  = useState("")

  const set = (field: keyof LeadFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const setArr = (field: keyof LeadFormData) => (next: string[]) =>
    setForm(f => ({ ...f, [field]: next }))

  const setVal = (field: keyof LeadFormData) => (val: string) =>
    setForm(f => ({ ...f, [field]: val }))

  const decodeVin = async () => {
    const vin = form.trade_vin.trim().toUpperCase()
    if (vin.length !== 17) { setVinErrMsg("VIN must be 17 characters."); setVinStatus("error"); return }
    setVinStatus("decoding")
    setVinResult(null)
    setVinErrMsg("")
    try {
      const res  = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`)
      const data = await res.json()
      const get  = (label: string) => (data.Results as {Variable: string; Value: string}[]).find(r => r.Variable === label)?.Value ?? ""
      const year  = get("Model Year")
      const make  = get("Make")
      const model = get("Model")
      const body  = get("Body Class")
      if (!make || make === "null" || make === "Not Applicable") {
        setVinErrMsg("Couldn't decode this VIN — double check it and try again.")
        setVinStatus("error")
      } else {
        const decoded = { year, make, model, body }
        setVinResult(decoded)
        setVinStatus("ok")
        setForm(f => ({ ...f, trade_year: year, trade_make: make, trade_model: model }))
      }
    } catch {
      setVinErrMsg("Could not reach the VIN decoder. Check your connection.")
      setVinStatus("error")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("sending")
    setErrMsg("")
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("success")
        setForm(EMPTY)
        setPage(1)
      } else {
        const data = await res.json().catch(() => ({}))
        setErrMsg(data.error ?? "Something went wrong. Try again.")
        setStatus("error")
      }
    } catch {
      setErrMsg("Could not reach the server. Check your connection.")
      setStatus("error")
    }
  }

  // ── success ──
  if (status === "success") {
    return (
      <div style={{
        maxWidth: 520, margin: "0 auto", textAlign: "center",
        padding: "48px 24px",
        border: "1px solid rgba(168,85,247,0.2)",
        borderRadius: 20,
        background: "rgba(123,47,190,0.07)",
      }}>
        <p style={{ fontSize: 40, marginBottom: 16 }}>👋</p>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          Got it — I&apos;m on it.
        </h3>
        <p style={{ fontSize: 15, color: "rgba(240,238,255,0.5)", lineHeight: 1.6 }}>
          I&apos;ll be in touch once I find the right reps for your request.
          Keep an eye on your phone and email.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}
    >

      {/* ════════════════════════════════ PAGE 1 ════════════════════════════════ */}
      {page === 1 && (
        <>
          {/* Buyer focus */}
          <label style={labelStyle}>
            What&apos;s your main focus as a buyer? *
            <select required value={form.buyer_focus} onChange={set("buyer_focus")} style={selectStyle}>
              <option value="" disabled style={optStyle}>Select…</option>
              {[
                "I know the specific Year/Make/Model/Price",
                "I have a general idea based on what I need it for",
                "I have a body style and brand(s) in mind",
                "I just need something I can drive and afford with cash",
                "My options depend on what I can get approved for",
                "I'm doing research and need advice/guidance",
                "I don't \"need\" a car but I might want one",
                "I need multiple vehicles",
                "I scanned a QR code for fun",
              ].map(o => <option key={o} value={o} style={optStyle}>{o}</option>)}
            </select>
          </label>

          {/* New or Used */}
          <label style={labelStyle}>
            New or Used? *
            <select required value={form.new_or_used} onChange={set("new_or_used")} style={selectStyle}>
              <option value="" disabled style={optStyle}>Select…</option>
              {["New", "Used", "Certified Pre-Owned", "Exotic/Specialty vehicle", "Open to whatever"].map(o =>
                <option key={o} value={o} style={optStyle}>{o}</option>
              )}
            </select>
          </label>

          {/* Timeline */}
          <label style={labelStyle}>
            When do you need a vehicle? *
            <select required value={form.timeline} onChange={set("timeline")} style={selectStyle}>
              <option value="" disabled style={optStyle}>Select…</option>
              {["Now", "1-3 weeks", "1-2 months", "Within 6 months", "6+ Months", "As long as it takes", "Just researching"].map(o =>
                <option key={o} value={o} style={optStyle}>{o}</option>
              )}
            </select>
          </label>

          {/* Motivations */}
          <label style={labelStyle}>
            Motivations for looking / problem I need solved
            <textarea
              value={form.motivations}
              onChange={set("motivations")}
              placeholder="Whatever comes to mind"
              style={textareaStyle}
            />
          </label>

          {/* ── More Specific Needs ── */}
          <Section title="More Specific Needs">
            <p style={{ fontSize: 13, color: "rgba(240,238,255,0.4)", margin: 0, lineHeight: 1.6 }}>
              Describe what you want in a sentence or two — or use the fields below. No need to do both.
            </p>
            <label style={labelStyle}>
              Just describe what you want
              <textarea
                value={form.quick_request}
                onChange={set("quick_request")}
                placeholder="e.g., 2022–2024 Honda CR-V, used, under $28k, financed — sunroof preferred"
                style={textareaStyle}
              />
            </label>

            <div style={{ borderTop: "1px solid rgba(168,85,247,0.12)", margin: "4px 0" }} />

            <div style={fieldGroupStyle}>
              Body Style
              <MultiPicker
                options={["Sedan","Coupe","Hatchback","Crossover","Mid-size SUV","Full-Size SUV","Mid-size Truck","Full-size Truck","Mini-Van","Full-size Van","ANYTHING"]}
                value={form.body_style}
                onChange={setArr("body_style")}
                placeholder="Select a body style…"
              />
            </div>

            <div style={fieldGroupStyle}>
              Seats
              <MultiPicker
                options={["2","4","5","6","7","8+","Doesn't matter"]}
                value={form.seats}
                onChange={setArr("seats")}
                placeholder="Select seat count…"
              />
            </div>

            <div style={fieldGroupStyle}>
              Fuel Type(s)
              <MultiPicker
                options={["Open to whatever","Gas","Diesel","Flex-Fuel","EV","Hybrid","Plug-in Hybrid","Open to Hybrid (curious)"]}
                value={form.fuel_type}
                onChange={setArr("fuel_type")}
                placeholder="Select fuel type…"
              />
            </div>

            <div style={fieldGroupStyle}>
              Make(s)
              <MakesPicker value={form.makes} onChange={next => setForm(f => ({ ...f, makes: next }))} />
            </div>

            <div style={fieldGroupStyle}>
              Model(s)
              <ModelsPicker
                makes={form.makes}
                value={form.models}
                onChange={next => setForm(f => ({ ...f, models: next }))}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={labelStyle}>
                Year from
                <select value={form.year_from} onChange={set("year_from")} style={selectStyle}>
                  <option value="" style={optStyle}>Any</option>
                  {YEARS.map(y => <option key={y} value={y} style={optStyle}>{y}</option>)}
                </select>
              </label>
              <label style={labelStyle}>
                Year to
                <select value={form.year_to} onChange={set("year_to")} style={selectStyle}>
                  <option value="" style={optStyle}>Any</option>
                  {YEARS.map(y => <option key={y} value={y} style={optStyle}>{y}</option>)}
                </select>
              </label>
            </div>

            <label style={labelStyle}>
              Trim(s) / Edition(s)
              <input
                value={form.specifics}
                onChange={set("specifics")}
                placeholder="e.g., Lariat, Sport, Limited, TRD Off-Road"
                style={inputStyle}
              />
              <span style={{ fontSize: 12, color: "rgba(240,238,255,0.3)", fontWeight: 400, letterSpacing: 0 }}>
                Not sure? Leave it blank — your rep can help narrow it down.
              </span>
            </label>

            <label style={labelStyle}>
              Must Have...
              <textarea
                value={form.must_have}
                onChange={set("must_have")}
                placeholder="Features or requirements"
                style={textareaStyle}
              />
            </label>

            <label style={labelStyle}>
              Preferred but not required
              <textarea
                value={form.preferred}
                onChange={set("preferred")}
                placeholder="e.g., sunroof, leather seats, backup camera, heated seats"
                style={textareaStyle}
              />
            </label>
          </Section>

          {/* ── Budget ── */}
          <Section title="Budget">
            <div style={fieldGroupStyle}>
              Financing *
              <CheckGroup
                options={["Cash/Check/Wire-Transfer","Open to Financing","Open to Leasing","I'll have my own financing","Not sure yet"]}
                value={form.financing}
                onChange={setArr("financing")}
                columns={1}
              />
            </div>

            <div style={fieldGroupStyle}>
              Out The Door Price Range?{" "}
              <span style={{ fontStyle: "italic", opacity: 0.6, fontWeight: 400 }}>Cash Buyers</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: "rgba(240,238,255,0.4)", fontSize: 15, pointerEvents: "none",
                  }}>$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.otd_price_min}
                    onChange={e => setForm(f => ({ ...f, otd_price_min: e.target.value.replace(/\D/g, "") }))}
                    placeholder="Min"
                    style={{ ...inputStyle, paddingLeft: 26 }}
                  />
                </div>
                <span style={{ color: "rgba(240,238,255,0.3)", fontSize: 14, flexShrink: 0 }}>to</span>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: "rgba(240,238,255,0.4)", fontSize: 15, pointerEvents: "none",
                  }}>$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.otd_price_max}
                    onChange={e => setForm(f => ({ ...f, otd_price_max: e.target.value.replace(/\D/g, "") }))}
                    placeholder="Max"
                    style={{ ...inputStyle, paddingLeft: 26 }}
                  />
                </div>
              </div>
            </div>

            <label style={labelStyle}>
              Monthly budget (if financing/leasing)
              <select value={form.monthly_budget} onChange={set("monthly_budget")} style={selectStyle}>
                <option value="" style={optStyle}>Select…</option>
                {["$200-$350","$350-$500","$500-$700","$700-$900","$900-$1100","$1100-$1400","$1400-$1600","$1600+"].map(o =>
                  <option key={o} value={o} style={optStyle}>{o}</option>
                )}
              </select>
            </label>

            <label style={labelStyle}>
              Down payment range?
              <input value={form.down_payment} onChange={set("down_payment")} style={inputStyle} />
            </label>

            <label style={labelStyle}>
              Your credit
              <select value={form.credit} onChange={set("credit")} style={selectStyle}>
                <option value="" style={optStyle}>Select…</option>
                {["800+","750","700","650","600","550","500 and below"].map(o =>
                  <option key={o} value={o} style={optStyle}>{o}</option>
                )}
              </select>
            </label>
          </Section>

          {/* ── Trade Information ── */}
          <Section title="Trade Information">
            <div style={fieldGroupStyle}>
              Ownership status
              <RadioGroup
                options={["Own outright (Have Title)","Financing","Leasing","Don't own (but has owner's permission)"]}
                value={form.ownership_status}
                onChange={setVal("ownership_status")}
              />
            </div>

            {/* VIN */}
            <div style={fieldGroupStyle}>
              VIN
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={form.trade_vin}
                  onChange={e => {
                    set("trade_vin")(e)
                    setVinStatus("idle")
                    setVinResult(null)
                    setVinErrMsg("")
                  }}
                  placeholder="17-character VIN"
                  maxLength={17}
                  style={{ ...inputStyle, flex: 1, fontFamily: "monospace", letterSpacing: "0.05em" }}
                />
                <button
                  type="button"
                  onClick={decodeVin}
                  disabled={vinStatus === "decoding"}
                  style={{
                    padding: "0 16px", borderRadius: 10, whiteSpace: "nowrap",
                    background: "rgba(168,85,247,0.2)",
                    border: "1px solid rgba(168,85,247,0.35)",
                    color: "#f0eeff", fontWeight: 700, fontSize: 14,
                    cursor: vinStatus === "decoding" ? "not-allowed" : "pointer",
                    opacity: vinStatus === "decoding" ? 0.5 : 1,
                  }}
                >
                  {vinStatus === "decoding" ? "Decoding…" : "Decode"}
                </button>
              </div>
              {vinStatus === "ok" && vinResult && (
                <div style={{
                  marginTop: 6, padding: "10px 14px", borderRadius: 10,
                  background: "rgba(168,85,247,0.1)",
                  border: "1px solid rgba(168,85,247,0.25)",
                  fontSize: 13, color: "rgba(240,238,255,0.75)",
                  display: "flex", flexDirection: "column", gap: 3,
                }}>
                  <span style={{ fontWeight: 700, color: "#f0eeff" }}>
                    {vinResult.year} {vinResult.make} {vinResult.model}
                  </span>
                  {vinResult.body && <span>{vinResult.body}</span>}
                  <span style={{ fontSize: 11, color: "rgba(240,238,255,0.35)" }}>
                    Fields auto-filled below ↓
                  </span>
                </div>
              )}
              {vinStatus === "error" && (
                <span style={{ fontSize: 12, color: "rgba(239,68,68,0.8)" }}>{vinErrMsg}</span>
              )}
              <span style={{ fontSize: 12, color: "rgba(240,238,255,0.3)", fontWeight: 400, letterSpacing: 0 }}>
                Found on your insurance card, registration, or title.
              </span>
            </div>

            {/* OR divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(168,85,247,0.15)" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(240,238,255,0.3)", letterSpacing: "0.08em" }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "rgba(168,85,247,0.15)" }} />
            </div>

            {/* Year / Make / Model */}
            <label style={labelStyle}>
              Year
              <select value={form.trade_year} onChange={set("trade_year")} style={selectStyle}>
                <option value="" style={optStyle}>Select year…</option>
                {YEARS.map(y => <option key={y} value={y} style={optStyle}>{y}</option>)}
              </select>
            </label>

            <div style={fieldGroupStyle}>
              Make
              <SingleAutocomplete
                options={ALL_MAKES}
                value={form.trade_make}
                onChange={v => setForm(f => ({ ...f, trade_make: v, trade_model: "" }))}
                placeholder="Type a make…"
              />
            </div>

            <div style={fieldGroupStyle}>
              Model
              <SingleAutocomplete
                options={form.trade_make ? (MODELS_BY_MAKE[form.trade_make] ?? []) : Object.values(MODELS_BY_MAKE).flat()}
                value={form.trade_model}
                onChange={v => setForm(f => ({ ...f, trade_model: v }))}
                placeholder={form.trade_make ? "Type a model…" : "Select a make first…"}
                disabled={!form.trade_make}
              />
            </div>

            <label style={labelStyle}>
              Current Miles
              <input value={form.trade_miles} onChange={set("trade_miles")} style={inputStyle} />
            </label>

            <div style={fieldGroupStyle}>
              Smoked in?
              <RadioGroup
                options={["Yes","No"]}
                value={form.smoked_in}
                onChange={setVal("smoked_in")}
              />
            </div>

            <label style={labelStyle}>
              Any problems or check engine lights?
              <textarea value={form.trade_problems} onChange={set("trade_problems")} style={textareaStyle} />
            </label>

            {form.ownership_status === "Financing" && (
              <label style={labelStyle}>
                Amount owed and monthly payments
                <textarea value={form.financing_details} onChange={set("financing_details")} style={textareaStyle} />
              </label>
            )}

            {form.ownership_status === "Leasing" && (
              <label style={labelStyle}>
                Monthly payments and months left
                <textarea value={form.leasing_details} onChange={set("leasing_details")} style={textareaStyle} />
              </label>
            )}
          </Section>

          {/* Next → Page 2 */}
          <button
            type="button"
            onClick={() => setPage(2)}
            style={{
              marginTop: 4, padding: "16px", borderRadius: 999,
              background: "linear-gradient(135deg, var(--purple) 0%, var(--purple-mid) 100%)",
              boxShadow: "0 0 32px var(--purple-glow)",
              color: "#fff", fontWeight: 800, fontSize: 17,
              border: "none", cursor: "pointer",
              transition: "opacity 0.15s",
            }}
          >
            Next →
          </button>

          <p style={{ fontSize: 12, color: "rgba(240,238,255,0.25)", textAlign: "center" }}>
            Free. No spam. No pressure.
          </p>
        </>
      )}

      {/* ════════════════════════════════ PAGE 2 ════════════════════════════════ */}
      {page === 2 && (
        <>
          <p style={{ fontSize: 13, color: "rgba(240,238,255,0.4)", marginBottom: 4 }}>
            Almost done — just need your contact info.
          </p>

          <label style={labelStyle}>
            Name or Nickname *
            <input required value={form.name} onChange={set("name")} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            Phone *
            <div style={{ position: "relative" }}>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="(615) 000-0000"
                style={{
                  ...inputStyle,
                  paddingRight: 40,
                  border: form.phone.length > 0
                    ? form.phone.replace(/\D/g, "").length === 10
                      ? "1px solid rgba(74,222,128,0.5)"
                      : "1px solid rgba(239,68,68,0.5)"
                    : inputStyle.border,
                }}
              />
              {form.phone.length > 0 && (
                <span style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  fontSize: 16, pointerEvents: "none",
                }}>
                  {form.phone.replace(/\D/g, "").length === 10 ? "✓" : "✗"}
                </span>
              )}
            </div>
            {form.phone.length > 0 && form.phone.replace(/\D/g, "").length !== 10 && (
              <span style={{ fontSize: 12, color: "rgba(239,68,68,0.7)", fontWeight: 400, letterSpacing: 0 }}>
                Enter a 10-digit US phone number
              </span>
            )}
          </label>

          <label style={labelStyle}>
            Email
            <div style={{ position: "relative" }}>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@email.com"
                style={{
                  ...inputStyle,
                  paddingRight: 40,
                  border: form.email.length > 0
                    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                      ? "1px solid rgba(74,222,128,0.5)"
                      : "1px solid rgba(239,68,68,0.5)"
                    : inputStyle.border,
                }}
              />
              {form.email.length > 0 && (
                <span style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  fontSize: 16, pointerEvents: "none",
                }}>
                  {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "✓" : "✗"}
                </span>
              )}
            </div>
            {form.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
              <span style={{ fontSize: 12, color: "rgba(239,68,68,0.7)", fontWeight: 400, letterSpacing: 0 }}>
                Enter a valid email address
              </span>
            )}
          </label>

          <label style={labelStyle}>
            Zip Code *
            <input required value={form.zip} onChange={set("zip")} maxLength={10} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            Preferred contact method *
            <select required value={form.contact_method} onChange={set("contact_method")} style={selectStyle}>
              <option value="" disabled style={optStyle}>Select…</option>
              {["Call","Text","Email","Doesn't matter"].map(o =>
                <option key={o} value={o} style={optStyle}>{o}</option>
              )}
            </select>
          </label>

          <label style={labelStyle}>
            Note for me
            <textarea value={form.note} onChange={set("note")} style={textareaStyle} />
          </label>

          {/* Privacy disclaimer */}
          <p style={{
            fontSize: 12, color: "rgba(240,238,255,0.3)", lineHeight: 1.7,
            padding: "12px 14px",
            border: "1px solid rgba(168,85,247,0.1)", borderRadius: 10,
            margin: 0,
          }}>
            Your information is private and used only to match you with relevant vehicle reps.
            It will not be sold or shared beyond that purpose.{" "}
            Questions? Call or text{" "}
            <strong style={{ color: "rgba(240,238,255,0.5)" }}>615-243-5349</strong>.
          </p>

          {status === "error" && (
            <p style={{ fontSize: 13, color: "rgba(239,68,68,0.8)", textAlign: "center" }}>
              {errMsg}
            </p>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={() => setPage(1)}
              style={{
                flexShrink: 0, padding: "16px 24px", borderRadius: 999,
                background: "transparent",
                border: "1px solid rgba(168,85,247,0.3)",
                color: "rgba(240,238,255,0.6)", fontWeight: 700, fontSize: 15,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                flex: 1, padding: "16px", borderRadius: 999,
                background: status === "sending"
                  ? "rgba(123,47,190,0.4)"
                  : "linear-gradient(135deg, var(--purple) 0%, var(--purple-mid) 100%)",
                boxShadow: status === "sending" ? "none" : "0 0 32px var(--purple-glow)",
                color: "#fff", fontWeight: 800, fontSize: 17,
                border: "none", cursor: status === "sending" ? "not-allowed" : "pointer",
                transition: "opacity 0.15s",
              }}
            >
              {status === "sending" ? "Sending…" : "Submit Request →"}
            </button>
          </div>

          <p style={{ fontSize: 12, color: "rgba(240,238,255,0.25)", textAlign: "center" }}>
            Free. No spam. No pressure.
          </p>
        </>
      )}
    </form>
  )
}
