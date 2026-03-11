import { motion } from 'framer-motion'

const DOMAIN_STYLES = {
  'Corporate': {
    accent: '#3b82f6',
    light: '#eff6ff',
    border: '#bfdbfe',
    dot: '#3b82f6',
  },
  'Customer, Consumer & Channels': {
    accent: '#0d9488',
    light: '#f0fdfa',
    border: '#99f6e4',
    dot: '#0d9488',
  },
}

const PORTFOLIO_ICONS = {
  'Finance': '₣',
  'HR': '⊙',
  'Legal & Other Corporate': '⊞',
  'Channel': '◈',
  'Consumer': '◉',
  'Customer': '◇',
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } }
}

function PortfolioCard({ portfolio, domain, styles, onClick }) {
  const techCount = portfolio.productFamilies.reduce((a, pf) => a + pf.technologies.length, 0)

  return (
    <motion.button
      whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(domain, portfolio)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '16px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.18s ease',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: styles.light, border: `1px solid ${styles.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: styles.accent,
        }}>
          {PORTFOLIO_ICONS[portfolio.name] || '◈'}
        </div>
        <span style={{
          fontSize: 11, padding: '2px 8px', borderRadius: 20,
          background: styles.light, color: styles.accent,
          border: `1px solid ${styles.border}`, fontWeight: 500,
        }}>
          {portfolio.productFamilies.length} PF
        </span>
      </div>

      {/* Name */}
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 3 }}>
        {portfolio.name}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
        {techCount} technologies mapped
      </div>

      {/* PF pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {portfolio.productFamilies.slice(0, 3).map(pf => (
          <span key={pf.name} style={{
            fontSize: 11, padding: '2px 7px', borderRadius: 5,
            background: '#f8fafc', color: 'var(--text-muted)',
            border: '1px solid #e2e8f0',
          }}>
            {pf.name.length > 20 ? pf.name.slice(0, 19) + '…' : pf.name}
          </span>
        ))}
        {portfolio.productFamilies.length > 3 && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '2px 4px' }}>
            +{portfolio.productFamilies.length - 3} more
          </span>
        )}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: styles.accent }}>
        Open Radar
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </div>
    </motion.button>
  )
}

export default function LandingGrid({ data, onPortfolioClick }) {
  if (!data) return null

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '36px 24px 60px' }}>
      {/* Hero */}
      <motion.div style={{ textAlign: 'center', marginBottom: 44 }}
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-blue)', fontWeight: 600, marginBottom: 10 }}>
          Global Technology Innovation
        </p>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.2 }}>
          Technology Foresight Map
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
          Explore emerging technologies mapped across Pernod Ricard's business domains.
          Select a portfolio to enter the radar view.
        </p>
      </motion.div>

      {/* Domain blocks */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))' }}>
        {data.map((domain) => {
          const s = DOMAIN_STYLES[domain.name] || DOMAIN_STYLES['Corporate']
          const totalTechs = domain.portfolios.reduce((a, p) => a + p.productFamilies.reduce((b, pf) => b + pf.technologies.length, 0), 0)
          const totalPFs   = domain.portfolios.reduce((a, p) => a + p.productFamilies.length, 0)

          return (
            <motion.div key={domain.name} variants={itemVariants}>
              <div style={{
                borderRadius: 16, overflow: 'hidden',
                border: `1px solid ${s.border}`,
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-md)',
              }}>
                {/* Domain header */}
                <div style={{
                  padding: '18px 22px',
                  background: `linear-gradient(90deg, ${s.light} 0%, white 100%)`,
                  borderBottom: `1px solid ${s.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.accent }} />
                      <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: s.accent }}>
                        Domain
                      </span>
                    </div>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>
                      {domain.name}
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: s.accent, lineHeight: 1 }}>
                      {totalTechs}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      technologies · {totalPFs} families
                    </div>
                  </div>
                </div>

                {/* Portfolio grid */}
                <div style={{ padding: 18, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
                  {domain.portfolios.map(portfolio => (
                    <PortfolioCard key={portfolio.name} portfolio={portfolio} domain={domain.name} styles={s} onClick={onPortfolioClick} />
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 36 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        Click any portfolio card to open the radar visualization
      </motion.p>
    </div>
  )
}
