import { motion, AnimatePresence } from 'framer-motion'

function getHorizonBadgeClass(horizon) {
  if (!horizon) return ''
  const h = horizon.toLowerCase()
  if (h.includes('h1') || h.includes('near')) return 'horizon-h1'
  if (h.includes('h2') || h.includes('mid'))  return 'horizon-h2'
  if (h.includes('h3') || h.includes('long')) return 'horizon-h3'
  return ''
}

function getStageBadgeClass(stage) {
  if (!stage) return ''
  const s = stage.toLowerCase()
  if (s.includes('transform')) return 'stage-transform'
  if (s.includes('pilot'))     return 'stage-pilot'
  if (s.includes('seed'))      return 'stage-seed'
  return ''
}

function formatHorizon(horizon) {
  if (!horizon) return 'Unknown'
  return horizon.replace(/[^\x20-\x7E]/g, '').trim()
}

function parseCases(text) {
  if (!text || text === 'N/A' || text === 'None' || text === 'null' || text === '') return null
  const parts = text.split(/\n?(?=\d+\.\s)/).filter(Boolean)
  return parts.length > 1 ? parts : [text]
}

// Parses text containing bare URLs in [url] brackets → "(source)" hyperlinks
function parseWithSourceLinks(text) {
  if (!text) return [{ type: 'text', content: '' }]
  const urlRegex = /\[(https?:\/\/[^\]]+)\]/g
  const parts = []
  let lastIndex = 0
  let match
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'link', url: match[1] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push({ type: 'text', content: text.slice(lastIndex) })
  return parts.length ? parts : [{ type: 'text', content: text }]
}

function LinkedText({ text }) {
  if (!text) return null
  return (
    <span>
      {parseWithSourceLinks(text).map((p, i) =>
        p.type === 'link'
          ? <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
              style={{ color: '#3b82f6', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #bfdbfe' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.color = '#3b82f6'}
            >(source)</a>
          : <span key={i}>{p.content}</span>
      )}
    </span>
  )
}

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>{title}</span>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: '#475569' }}>{children}</div>
    </div>
  )
}

function CasesList({ text }) {
  const cases = parseCases(text)
  if (!cases) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {cases.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, marginTop: 1,
          }}>{i + 1}</div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: '#475569' }}>
            <LinkedText text={c.replace(/^\d+\.\s*/, '')} />
          </div>
        </div>
      ))}
    </div>
  )
}

function isPilotOrTransform(stage) {
  if (!stage) return false
  const s = stage.toLowerCase()
  return s.includes('pilot') || s.includes('transform')
}

function isSeed(stage) {
  if (!stage) return false
  return stage.toLowerCase().includes('seed')
}

export default function TechDrawer({ tech, open, onClose }) {
  return (
    <AnimatePresence>
      {open && tech && (
        <>
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(15,23,42,0.25)', backdropFilter: 'blur(3px)' }}
            onClick={onClose}
          />

          <motion.div key="drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, height: '100%', zIndex: 51,
              width: 'min(520px, 100vw)',
              background: '#ffffff',
              borderLeft: '1px solid #e2e8f0',
              display: 'flex', flexDirection: 'column',
              boxShadow: '-8px 0 30px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {tech.horizon && (
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getHorizonBadgeClass(tech.horizon)}`} style={{ fontSize: 12 }}>
                        {formatHorizon(tech.horizon)}
                      </span>
                    )}
                    {tech.stage && (
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${getStageBadgeClass(tech.stage)}`} style={{ fontSize: 12, border: '1px solid transparent' }}>
                        {tech.stage}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: '#1e293b', lineHeight: 1.3 }}>
                    {tech.name}
                  </h2>
                </div>
                <button onClick={onClose}
                  style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', color: '#94a3b8', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}>

              {/* Description — always shown */}
              <Section title="Description" icon="◈">
                <LinkedText text={tech.description} />
              </Section>

              {/* Implications/Comment — always shown if present */}
              {tech.implications && (
                <Section title="Implications for Pernod Ricard" icon="◆">
                  <LinkedText text={tech.implications} />
                </Section>
              )}

              {/* Stage of Technology — always shown */}
              {tech.stage && (
                <Section title="Stage of Technology" icon="◉">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className={getStageBadgeClass(tech.stage)}
                      style={{ fontSize: 13, padding: '4px 12px', borderRadius: 7, fontWeight: 500, border: '1px solid transparent' }}>
                      {tech.stage}
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>
                      {tech.stage.toLowerCase().includes('transform') && 'Mainstream adoption'}
                      {tech.stage.toLowerCase().includes('pilot')     && 'Early adopters & proofs of concept'}
                      {tech.stage.toLowerCase().includes('seed')      && 'Emerging — research & early tests'}
                    </span>
                  </div>
                </Section>
              )}

              {/* === Pilot / Transform: cols K + L === */}
              {isPilotOrTransform(tech.stage) && (
                <>
                  {tech.maturityAtPR && (
                    <Section title="Maturity at Pernod Ricard" icon="◎">
                      <LinkedText text={tech.maturityAtPR} />
                    </Section>
                  )}
                  {tech.successfulCasesOtherCompanies && (
                    <Section title="Successful Cases in Other Companies" icon="✦">
                      <CasesList text={tech.successfulCasesOtherCompanies} />
                    </Section>
                  )}
                </>
              )}

              {/* === Seed: col M only === */}
              {isSeed(tech.stage) && tech.scientificSupport && (
                <Section title="Scientific Support" icon="⊕">
                  <LinkedText text={tech.scientificSupport} />
                </Section>
              )}

              {/* Source — always shown if present */}
              {tech.source && (
                <Section title="Source" icon="◇">
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{tech.source}</span>
                </Section>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={onClose}
                style={{
                  width: '100%', padding: '10px', borderRadius: 9, fontSize: 14, fontWeight: 500,
                  background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff' }}>
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
