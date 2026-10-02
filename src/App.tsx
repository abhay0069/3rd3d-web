import { lazy, Suspense, useEffect, useState } from 'react'
import { Menu, Wallet, X } from 'lucide-react'

const FinancialOrb = lazy(() => import('./components/sections/FinancialOrb'))

type NavLink = {
  number: string
  label: string
  href: string
  delay: number
}

const NAV_LINKS: NavLink[] = [
  { number: '01', label: 'ECOSYSTEM', href: '#ecosystem', delay: 350 },
  { number: '02', label: 'LIQUIDITY_POOLS', href: '#liquidity-pools', delay: 450 },
  { number: '03', label: 'LUMEN_INDEX', href: '#lumen-index', delay: 550 },
  { number: '04', label: 'GOVERNANCE', href: '#governance', delay: 650 },
]

function NavItem({ number, label, href, delay }: NavLink) {
  return (
    <a
      href={href}
      className="flex items-center gap-[3px] anim-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="font-manrope text-[13px] leading-[15.6px] text-[#AFDDFF]/80">
        {number}.
      </span>
      <span className="cursor-pointer font-manrope text-[13px] leading-[15.6px] text-white transition-colors hover:text-[#AFDDFF]">
        {label}
      </span>
    </a>
  )
}

function PrimeMemberChip() {
  return (
    <span className="rounded-[3px] bg-[#AFDDFF] px-[5px] py-[2px] font-manrope text-[13px] leading-[15.6px] text-black">
      PRIME_MEMBER
    </span>
  )
}

function WalletDetails({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      <Wallet
        aria-hidden="true"
        className="h-[15px] w-[15px] shrink-0 text-white"
        strokeWidth={1.5}
      />
      <span className="font-manrope text-[13px] leading-[15.6px] text-white">0x71...f4e2</span>
      <span className="font-manrope text-[13px] leading-[15.6px] text-[#AFDDFF]">
        [ CONNECTED ]
      </span>
      {!mobile && (
        <>
          <span className="ml-[20px] font-manrope text-[13px] leading-[15.6px] text-white">
            STATUS:
          </span>
          <PrimeMemberChip />
        </>
      )}
    </>
  )
}

function MobileMenu({ menuOpen, onClose }: { menuOpen: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden ${
        menuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      aria-hidden={!menuOpen}
    >
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 h-full w-full bg-black/90 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          menuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal={menuOpen ? 'true' : undefined}
        aria-label="Navigation menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
        className={`relative flex h-full flex-col px-5 pt-24 pb-10 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          tabIndex={menuOpen ? 0 : -1}
          className="absolute top-5 right-5 flex h-[40px] w-[40px] items-center justify-center"
        >
          <X className="h-[22px] w-[22px] text-white" strokeWidth={1.5} />
        </button>

        <nav aria-label="Mobile primary" className="flex flex-col gap-8">
          {NAV_LINKS.map((item, index) => (
            <a
              key={item.number}
              href={item.href}
              onClick={onClose}
              tabIndex={menuOpen ? 0 : -1}
              style={{ transitionDelay: menuOpen ? `${150 + index * 75}ms` : '0ms' }}
              className={`flex items-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
              }`}
            >
              <span className="font-manrope text-[14px] leading-[1] text-[#AFDDFF]/80">
                {item.number}.
              </span>
              <span className="font-manrope text-[28px] leading-[1.2] tracking-tight text-white">
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        <div
          style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }}
          className={`mt-auto border-t border-white/10 pt-10 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="mb-3 flex items-center gap-[10px]">
            <WalletDetails mobile />
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="font-manrope text-[13px] leading-[15.6px] text-white">STATUS:</span>
            <PrimeMemberChip />
          </div>
        </div>
      </div>
    </div>
  )
}

function Header({ menuOpen, setMenuOpen }: {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}) {
  return (
    <>
      <nav
        aria-label="Primary"
        className="absolute top-0 left-0 z-30 flex w-full items-center px-5 py-5 md:px-[35px] md:py-[27px]"
      >
        <div className="flex items-center gap-[40px]">
          <a
            href="#home"
            aria-label="LŪMEN // ÍNDEX home"
            className="font-graphik anim-fade-up whitespace-nowrap text-[18px] leading-[21px] text-white md:text-[21px]"
            style={{ animationDelay: '200ms' }}
          >
            LŪMEN // ÍNDEX
          </a>
          <div className="hidden items-center gap-[40px] lg:flex">
            {NAV_LINKS.map((item) => (
              <NavItem key={item.number} {...item} />
            ))}
          </div>
        </div>

        <div
          className="ml-auto hidden items-center gap-[12px] anim-slide-right lg:flex"
          style={{ animationDelay: '600ms' }}
        >
          <WalletDetails />
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative ml-auto flex h-[40px] w-[40px] items-center justify-center anim-fade-in lg:hidden"
          style={{ animationDelay: '400ms' }}
        >
          <span
            aria-hidden="true"
            className={`absolute transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              menuOpen ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
            }`}
          >
            <Menu className="h-[22px] w-[22px] text-white" strokeWidth={1.5} />
          </span>
          <span
            aria-hidden="true"
            className={`absolute transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
            }`}
          >
            <X className="h-[22px] w-[22px] text-white" strokeWidth={1.5} />
          </span>
        </button>
      </nav>

      <div id="mobile-navigation">
        <MobileMenu menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </>
  )
}

function GridLines() {
  const verticalPositions = ['12.6%', '37.5%', '61.9%', '86.2%']
  const horizontalPositions = ['32.7%', '71.4%']

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {verticalPositions.map((left, index) => (
        <div
          key={`v-${left}`}
          className="anim-grid-v absolute top-0 h-full w-px bg-white/[0.04]"
          style={{ left, animationDelay: `${600 + index * 100}ms` }}
        />
      ))}
      {horizontalPositions.map((top, index) => (
        <div
          key={`h-${top}`}
          className="anim-grid-h absolute left-0 h-px w-full bg-white/[0.04]"
          style={{ top, animationDelay: `${800 + index * 150}ms` }}
        />
      ))}
      {horizontalPositions.map((top, hi) =>
        verticalPositions.map((left, vi) => (
          <div
            key={`plus-${hi}-${vi}`}
            className="anim-scale-in absolute"
            style={{ top, left, animationDelay: `${1000 + (hi * 4 + vi) * 80}ms` }}
          >
            <span className="absolute h-px w-[10px] -translate-x-1/2 -translate-y-1/2 bg-white/70" />
            <span className="absolute h-[10px] w-px -translate-x-1/2 -translate-y-1/2 bg-white/70" />
          </div>
        )),
      )}
    </div>
  )
}

type ConnectorLineProps = {
  x1: string
  y1: string
  x2: string
  y2: string
  delay: number
}

function ConnectorLine({ x1, y1, x2, y2, delay }: ConnectorLineProps) {
  return (
    <svg
      aria-hidden="true"
      className="anim-fade-in pointer-events-none absolute inset-0 h-full w-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function CentralNodes() {
  const connectors: ConnectorLineProps[] = [
    { x1: '38%', y1: '14%', x2: '52%', y2: '14%', delay: 1200 },
    { x1: '52%', y1: '14%', x2: '60%', y2: '27%', delay: 1400 },
    { x1: '32%', y1: '58%', x2: '20%', y2: '74%', delay: 1500 },
    { x1: '20%', y1: '74%', x2: '6%', y2: '74%', delay: 1700 },
    { x1: '78%', y1: '53%', x2: '63%', y2: '53%', delay: 1800 },
    { x1: '63%', y1: '53%', x2: '50%', y2: '63%', delay: 2000 },
  ]

  return (
    <div
      id="lumen-index"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 hidden md:block"
    >
      {connectors.map((connector, index) => (
        <ConnectorLine key={`connector-${index}`} {...connector} />
      ))}

      <div className="anim-scale-in absolute top-[27%] left-[60%] h-[80px] w-[80px] border border-white/80 lg:h-[100px] lg:w-[100px]" style={{ animationDelay: '1500ms' }} />
      <div className="anim-scale-in absolute top-[58%] left-[32%] h-[80px] w-[80px] border border-white/80 lg:h-[100px] lg:w-[100px]" style={{ animationDelay: '1800ms' }} />
      <div className="anim-scale-in absolute top-[63%] left-[50%] h-[80px] w-[80px] border border-white/80 lg:h-[100px] lg:w-[100px]" style={{ animationDelay: '2100ms' }} />

      <div
        id="ecosystem"
        className="anim-slide-left absolute top-[11%] left-[26%]"
        style={{ animationDelay: '1100ms' }}
      >
        <span className="font-manrope whitespace-nowrap text-[13px] leading-[15.6px] text-white">
          [ CORE_ENTITY ]
        </span>
        <p className="mt-[4px] max-w-[160px] font-manrope text-[11px] leading-[14px] text-white/50">
          Neural node processing real-time data streams.
        </p>
      </div>
      <div
        id="liquidity-pools"
        className="anim-slide-left absolute top-[76%] left-[3%]"
        style={{ animationDelay: '1400ms' }}
      >
        <span className="font-manrope whitespace-nowrap text-[13px] leading-[15.6px] text-white">
          [ LUMINOUS_INSIGHT ]
        </span>
        <p className="mt-[4px] max-w-[160px] font-manrope text-[11px] leading-[14px] text-white/50">
          Deep-learning engine synthesizing raw inputs.
        </p>
      </div>
      <div
        id="governance"
        className="anim-slide-right absolute top-[50%] left-[78%]"
        style={{ animationDelay: '1700ms' }}
      >
        <span className="font-manrope whitespace-nowrap text-[13px] leading-[15.6px] text-white">
          [ CONNECTIVITY ]
        </span>
        <p className="mt-[4px] max-w-[180px] font-manrope text-[11px] leading-[14px] text-white/50">
          Latency-free transmission across distributed networks.
        </p>
      </div>
    </div>
  )
}

function InfoCard() {
  return (
    <div className="relative hidden max-w-[280px] anim-slide-right sm:block" style={{ animationDelay: '1100ms' }}>
      <span className="mb-[10px] inline-block bg-[#AFDDFF] px-[6px] py-[2px] font-manrope text-[13px] leading-[15.6px] text-black">
        NOT A BANK — AN ECOSYSTEM
      </span>
      <div className="relative min-h-[168px] p-[20px]">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 280 168"
          preserveAspectRatio="none"
        >
          <polygon
            points="0.5,0.5 279.5,0.5 279.5,167.5 30,167.5 0.5,137.5"
            fill="none"
            stroke="#AFDDFF"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <p className="relative mb-[18px] font-manrope text-[13px] leading-[18px] text-white">
          Maps the complexity of modern finance with a partner that brings clarity and organic growth to your portfolio.
        </p>
        <a
          href="#transparency-report"
          className="relative cursor-pointer font-manrope text-[13px] leading-[15.6px] text-[#AFDDFF] hover:underline"
        >
          VIEW_TRANSPARENCY_REPORT
        </a>
      </div>
    </div>
  )
}

function BottomRow() {
  return (
    <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col items-start justify-between gap-5 md:bottom-[35px] md:left-[35px] md:right-[35px] md:flex-row md:items-end md:gap-0">
      <button
        type="button"
        className="flex items-center gap-[10px] bg-[#AFDDFF] px-[16px] py-[10px] transition-colors hover:bg-[#c8e8ff] anim-fade-up md:px-[20px] md:py-[12px]"
        style={{ animationDelay: '900ms' }}
      >
        <span className="text-[16px] leading-none text-black" aria-hidden="true">
          &#10022;
        </span>
        <span className="font-manrope text-[12px] leading-[15.6px] uppercase tracking-wide text-black md:text-[13px]">
          Explore Private Banking
        </span>
      </button>
      <InfoCard />
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const renderOrb = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <section
      id="home"
      aria-label="LŪMEN // ÍNDEX private banking"
      className="hero-stage relative h-screen w-full overflow-hidden bg-black text-white"
    >
      <video
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover anim-fade-in"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_115057_94c3699b-0fd1-4124-bcf3-3626bb8c1f77.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {renderOrb && (
        <Suspense fallback={null}>
          <FinancialOrb />
        </Suspense>
      )}

      <div className="relative z-10 h-full w-full">
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <h1 className="absolute top-[140px] left-5 z-20 max-w-[300px] anim-fade-up font-graphik text-[32px] font-normal leading-[1em] text-white sm:top-[160px] sm:max-w-[420px] sm:text-[48px] md:top-[178px] md:left-[35px] md:max-w-[554px] md:text-[68px]" style={{ animationDelay: '400ms' }}>
          Liquid Assets. Luminous Returns.
        </h1>
        <GridLines />
        <CentralNodes />
        <BottomRow />
      </div>

    </section>
  )
}
