import { motion } from 'framer-motion'

export default function Breadcrumb({ view, selectedPortfolio, onBackToLanding }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', fontSize: 13 }}>
      <button
        onClick={onBackToLanding}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          color: view === 'landing' ? 'var(--text-primary)' : 'var(--accent-blue)',
          fontWeight: view === 'landing' ? 600 : 500,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Domains
      </button>

      {view === 'radar' && selectedPortfolio && (
        <motion.div style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <button
            onClick={onBackToLanding}
            style={{
              color: 'var(--accent-blue)', fontWeight: 500,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {selectedPortfolio.domain}
          </button>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPortfolio.portfolio.name}</span>
        </motion.div>
      )}
    </div>
  )
}
