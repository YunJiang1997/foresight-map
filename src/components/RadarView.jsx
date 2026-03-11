import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DOMAIN_ACCENT = {
  'Corporate': '#3b82f6',
  'Customer, Consumer & Channels': '#0d9488',
}

const STAGE_COLORS = {
  transform: '#0d9488',
  pilot:     '#3b82f6',
  seed:      '#d97706',
}

const HORIZON_COLORS = {
  h1: '#0d9488',
  h2: '#3b82f6',
  h3: '#d97706',
}

function getStageColor(stage) {
  if (!stage) return '#94a3b8'
  const s = stage.toLowerCase()
  if (s.includes('transform')) return STAGE_COLORS.transform
  if (s.includes('pilot'))     return STAGE_COLORS.pilot
  if (s.includes('seed'))      return STAGE_COLORS.seed
  return '#94a3b8'
}

function getHorizonColor(horizon) {
  if (!horizon) return '#94a3b8'
  const h = horizon.toLowerCase()
  if (h.includes('h1') || h.includes('near')) return HORIZON_COLORS.h1
  if (h.includes('h2') || h.includes('mid'))  return HORIZON_COLORS.h2
  if (h.includes('h3') || h.includes('long')) return HORIZON_COLORS.h3
  return '#94a3b8'
}

function getHorizonLabel(horizon) {
  if (!horizon) return ''
  if (horizon.includes('H1') || horizon.toLowerCase().includes('near')) return 'H1'
  if (horizon.includes('H2') || horizon.toLowerCase().includes('mid'))  return 'H2'
  if (horizon.includes('H3') || horizon.toLowerCase().includes('long')) return 'H3'
  return ''
}

function wrapText(text, maxLen) {
  if (!text || text.length <= maxLen) return [text || '']
  const words = text.split(' ')
  const lines = []
  let cur = ''
  for (const w of words) {
    const candidate = cur ? cur + ' ' + w : w
    if (candidate.length <= maxLen) { cur = candidate }
    else { if (cur) lines.push(cur); cur = w }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 3)
}

// Fixed canvas size — container scrolls
const W = 1100
const H = 1100
const CX = W / 2
const CY = H / 2

const HUB_R   = 62
const PF_R    = 230
const TECH_R  = 420

export default function RadarView({ domain, portfolio, onTechClick }) {
  const [selectedPF, setSelectedPF] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)

  const accent = DOMAIN_ACCENT[domain] || '#3b82f6'
  const accentRgb = accent === '#3b82f6' ? '59,130,246' : '13,148,136'

  const productFamilies = portfolio.productFamilies
  const pfCount = productFamilies.length

  // Place PF nodes evenly on inner ring
  const pfNodes = productFamilies.map((pf, i) => {
    const angle = (2 * Math.PI * i) / pfCount - Math.PI / 2
    return { ...pf, id: pf.name, x: CX + PF_R * Math.cos(angle), y: CY + PF_R * Math.sin(angle), angle }
  })

  const activePF = selectedPF ? pfNodes.find(p => p.id === selectedPF) : null

  // Place tech nodes in a tight arc around the active PF's angle
  const techNodes = activePF ? activePF.technologies.map((tech, i) => {
    const n = activePF.technologies.length
    // Tighter arc: max 70° spread per side, with a floor so single items centre
    const spread = n === 1 ? 0 : Math.min(Math.PI * 0.65, (n - 1) * 0.22)
    const angle = activePF.angle + (n === 1 ? 0 : -spread / 2 + (spread * i) / (n - 1))
    return { ...tech, id: tech.name, x: CX + TECH_R * Math.cos(angle), y: CY + TECH_R * Math.sin(angle), angle, pfId: activePF.id }
  }) : []

  const isHighlighted = useCallback((type, id) => {
    if (!hoveredNode) return true
    if (hoveredNode.type === 'pf')   return type === 'pf' ? id === hoveredNode.id : hoveredNode.id === activePF?.id
    if (hoveredNode.type === 'tech') return type === 'tech' ? id === hoveredNode.id : id === activePF?.id
    return true
  }, [hoveredNode, activePF])

  const alpha = (type, id) => hoveredNode ? (isHighlighted(type, id) ? 1 : 0.2) : 1

  const PF_NODE_R = Math.max(10, Math.min(18, 300 / pfCount))

  return (
    <div style={{ padding: '20px 24px 40px', overflowX: 'auto' }}>
      {/* Instruction */}
      <AnimatePresence>
        {!selectedPF && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
            Click a Product Family node to reveal its technologies
          </motion.p>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* SVG canvas */}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 130px)', borderRadius: 16, border: '1px solid var(--border)', background: '#fff', boxShadow: 'var(--shadow-md)', flexShrink: 0 }}>
          <svg width={W} height={H}>
            <defs>
              <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accent} stopOpacity="0.15"/>
                <stop offset="100%" stopColor={accent} stopOpacity="0"/>
              </radialGradient>
              <filter id="soft-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Background tint */}
            <rect width={W} height={H} fill="#fafbff"/>

            {/* Orbit rings */}
            <circle cx={CX} cy={CY} r={PF_R}   fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.12" strokeDasharray="5 9"/>
            <circle cx={CX} cy={CY} r={HUB_R * 1.55} fill="none" stroke={accent} strokeWidth="0.8" strokeOpacity="0.1"/>
            {activePF && (
              <motion.circle cx={CX} cy={CY} r={TECH_R} fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 10"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}/>
            )}

            {/* Hub glow */}
            <circle cx={CX} cy={CY} r={HUB_R * 2.2} fill="url(#hubGrad)"/>

            {/* Spoke lines: hub → PF */}
            {pfNodes.map(pf => {
              const active = pf.id === selectedPF
              return (
                <line key={`spoke-${pf.id}`}
                  x1={CX} y1={CY} x2={pf.x} y2={pf.y}
                  stroke={accent}
                  strokeWidth={active ? 1.5 : 0.8}
                  strokeOpacity={active ? 0.35 : 0.1}
                  strokeDasharray={active ? '' : '4 7'}
                />
              )
            })}

            {/* Lines: PF → Tech */}
            {techNodes.map((tech, i) => {
              const lineOpacity = hoveredNode?.type === 'tech' && hoveredNode?.id === tech.id ? 0.75 : (hoveredNode ? 0.1 : 0.4)
              return (
                <motion.line key={`tline-${i}`}
                  x1={activePF.x} y1={activePF.y} x2={tech.x} y2={tech.y}
                  stroke={accent} strokeWidth="1.2" strokeOpacity={lineOpacity}
                  initial={{ x2: activePF.x, y2: activePF.y }} animate={{ x2: tech.x, y2: tech.y }}
                  transition={{ duration: 0.45, delay: i * 0.03, ease: 'easeOut' }}
                />
              )
            })}

            {/* Hub circle */}
            <circle cx={CX} cy={CY} r={HUB_R} fill="white" stroke={accent} strokeWidth="1.8" filter="url(#soft-glow)"/>
            <foreignObject x={CX - HUB_R + 8} y={CY - HUB_R + 8} width={(HUB_R - 8) * 2} height={(HUB_R - 8) * 2}>
              <div xmlns="http://www.w3.org/1999/xhtml" style={{
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: accent, lineHeight: 1.25 }}>
                  {portfolio.name.split(/[\s&]+/).map((w, i) => <div key={i}>{w}</div>)}
                </div>
              </div>
            </foreignObject>

            {/* PF nodes */}
            {pfNodes.map((pf, i) => {
              const isSelected = pf.id === selectedPF
              const nodeAlpha = alpha('pf', pf.id)
              const color = isSelected ? accent : (hoveredNode && isHighlighted('pf', pf.id) ? accent : '#64748b')
              const lines = wrapText(pf.name, 13)
              const isRight = pf.x > CX + 20
              const isLeft  = pf.x < CX - 20
              const labelX  = isRight ? pf.x + PF_NODE_R + 10 : isLeft ? pf.x - PF_NODE_R - 10 : pf.x
              const anchor  = isRight ? 'start' : isLeft ? 'end' : 'middle'
              const labelY  = (isRight || isLeft) ? pf.y - (lines.length - 1) * 8 : pf.y + PF_NODE_R + 16

              return (
                <g key={pf.id} style={{ cursor: 'pointer', opacity: nodeAlpha, transition: 'opacity 0.18s' }}
                  onClick={() => setSelectedPF(isSelected ? null : pf.id)}
                  onMouseEnter={() => setHoveredNode({ type: 'pf', id: pf.id })}
                  onMouseLeave={() => setHoveredNode(null)}>
                  {isSelected && (
                    <circle cx={pf.x} cy={pf.y} r={PF_NODE_R + 7} fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity="0.3" filter="url(#soft-glow)"/>
                  )}
                  <motion.circle cx={pf.x} cy={pf.y} r={PF_NODE_R}
                    fill={isSelected ? `rgba(${accentRgb},0.1)` : 'white'}
                    stroke={color} strokeWidth={isSelected ? 2 : 1.5}
                    initial={{ r: 0 }} animate={{ r: PF_NODE_R }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                  />
                  <circle cx={pf.x} cy={pf.y} r={3.5} fill={color}/>
                  {/* Tech count */}
                  <text x={pf.x} y={pf.y + 2.5} textAnchor="middle" fill={color} fontSize="8" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" dy="-0.5">
                    {pf.technologies.length}
                  </text>
                  {/* Labels */}
                  {lines.map((line, li) => (
                    <text key={li} x={labelX} y={labelY + li * 15}
                      textAnchor={anchor} fill={isSelected ? 'var(--text-primary)' : '#475569'}
                      fontSize="12.5" fontFamily="'Inter', sans-serif"
                      fontWeight={isSelected ? 600 : 400}>
                      {line}
                    </text>
                  ))}
                </g>
              )
            })}

            {/* Tech nodes */}
            <AnimatePresence>
              {techNodes.map((tech, i) => {
                const hColor = getHorizonColor(tech.horizon)
                const sColor = getStageColor(tech.stage)
                const hLabel = getHorizonLabel(tech.horizon)
                const nodeAlpha = alpha('tech', tech.id)
                const TECH_NODE_R = 12
                const lines = wrapText(tech.name, 18)
                const isRight  = tech.x > CX + 40
                const isLeft   = tech.x < CX - 40
                const isBottom = tech.y > CY + 30
                const labelX   = isRight ? tech.x + TECH_NODE_R + 9 : isLeft ? tech.x - TECH_NODE_R - 9 : tech.x
                const anchor   = isRight ? 'start' : isLeft ? 'end' : 'middle'
                const labelY   = (isRight || isLeft)
                  ? tech.y - (lines.length - 1) * 8
                  : isBottom ? tech.y + TECH_NODE_R + 17 : tech.y - TECH_NODE_R - 10 - (lines.length - 1) * 14

                return (
                  <motion.g key={`${tech.pfId}-${i}`}
                    onClick={() => onTechClick(tech)}
                    onMouseEnter={() => setHoveredNode({ type: 'tech', id: tech.id })}
                    onMouseLeave={() => setHoveredNode(null)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: nodeAlpha }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.035 }}
                    style={{ transformOrigin: `${tech.x}px ${tech.y}px`, cursor: 'pointer', transition: 'opacity 0.18s' }}
                  >
                    <circle cx={tech.x} cy={tech.y} r={TECH_NODE_R + 5}
                      fill={`rgba(${accentRgb},0.05)`}/>
                    <circle cx={tech.x} cy={tech.y} r={TECH_NODE_R}
                      fill="white" stroke={hColor} strokeWidth="1.8" filter="url(#soft-glow)"/>
                    <circle cx={tech.x} cy={tech.y} r={4.5} fill={sColor}/>

                    {/* Horizon badge above node */}
                    {hLabel && (
                      <text x={tech.x} y={tech.y - TECH_NODE_R - 5}
                        textAnchor="middle" fill={hColor} fontSize="8.5"
                        fontFamily="'Space Grotesk', sans-serif" fontWeight="700">
                        {hLabel}
                      </text>
                    )}

                    {/* Tech name */}
                    {lines.map((line, li) => (
                      <text key={li} x={labelX} y={labelY + li * 14}
                        textAnchor={anchor}
                        fill="#334155"
                        fontSize="12" fontFamily="'Inter', sans-serif"
                        fontWeight="450">
                        {line}
                      </text>
                    ))}
                  </motion.g>
                )
              })}
            </AnimatePresence>
          </svg>
        </div>

        {/* Right panel */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
          {/* Legend */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>
              Legend
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Horizon (ring)</div>
            {[['H1', '#0d9488', 'Near-term (2026–28)'], ['H2', '#3b82f6', 'Mid-term (2029–31)'], ['H3', '#d97706', 'Long-term (2032+)']].map(([lbl, clr, desc]) => (
              <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${clr}`, background: 'white', flexShrink: 0 }}/>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}><strong>{lbl}</strong> — {desc}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--border)', margin: '10px 0' }}/>

            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Stage (inner dot)</div>
            {[['Transform', '#0d9488'], ['Pilot', '#3b82f6'], ['Seed', '#d97706']].map(([lbl, clr]) => (
              <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: clr, flexShrink: 0 }}/>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lbl}</span>
              </div>
            ))}
          </div>

          {/* Active PF panel */}
          <AnimatePresence>
            {activePF && (
              <motion.div key="pf-info"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                style={{ background: 'white', border: `1px solid ${accent}44`, borderRadius: 12, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent }}/>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: accent }}>
                    Product Family
                  </span>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {activePF.name}
                </div>
                {activePF.description && (
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 8 }}>
                    {activePF.description.length > 130 ? activePF.description.slice(0, 130) + '…' : activePF.description}
                  </p>
                )}
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {activePF.technologies.length} technologies · click any node for details
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
