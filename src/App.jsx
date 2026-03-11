import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingGrid from './components/LandingGrid'
import RadarView from './components/RadarView'
import TechDrawer from './components/TechDrawer'
import Breadcrumb from './components/Breadcrumb'

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('landing')
  const [selectedPortfolio, setSelectedPortfolio] = useState(null)
  const [selectedTech, setSelectedTech] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'foresight_data.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handlePortfolioClick = (domain, portfolio) => {
    setSelectedPortfolio({ domain, portfolio })
    setView('radar')
  }

  const handleTechClick = (tech) => {
    setSelectedTech(tech)
    setDrawerOpen(true)
  }

  const handleBackToLanding = () => {
    setView('landing')
    setSelectedPortfolio(null)
    setDrawerOpen(false)
    setSelectedTech(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(245,246,250,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>PR</div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
              Technology Foresight Map
            </span>
            <span style={{
              fontSize: 11, padding: '2px 9px', borderRadius: 20,
              background: '#eff6ff', color: '#3b82f6',
              border: '1px solid #bfdbfe', fontWeight: 500,
            }}>Bold Horizons</span>
          </div>
          {data && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {data.reduce((a,d) => a + d.portfolios.length, 0)} Portfolios
              {' · '}
              {data.reduce((a,d) => a + d.portfolios.reduce((b,p) => b + p.productFamilies.length, 0), 0)} Product Families
              {' · '}
              {data.reduce((a,d) => a + d.portfolios.reduce((b,p) => b + p.productFamilies.reduce((c,pf) => c + pf.technologies.length, 0), 0), 0)} Technologies
            </span>
          )}
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 56, zIndex: 30 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          <Breadcrumb view={view} selectedPortfolio={selectedPortfolio} onBackToLanding={handleBackToLanding} />
        </div>
      </div>

      {/* Main */}
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}>
            <LandingGrid data={data} onPortfolioClick={handlePortfolioClick} />
          </motion.div>
        )}
        {view === 'radar' && selectedPortfolio && (
          <motion.div key="radar"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            <RadarView
              domain={selectedPortfolio.domain}
              portfolio={selectedPortfolio.portfolio}
              onTechClick={handleTechClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TechDrawer tech={selectedTech} open={drawerOpen} onClose={() => { setDrawerOpen(false); setSelectedTech(null) }} />
    </div>
  )
}
