'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, animate } from 'framer-motion'
import { Eye, EyeOff, AlertTriangle, ArrowRight, Chrome, Github, Briefcase } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
}

function DiamondLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M11 1L18.5 8L11 21L3.5 8L11 1Z"
        fill="url(#diamondGrad)"
        stroke="url(#diamondStroke)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M11 5L14.5 8.5L11 17L7.5 8.5L11 5Z"
        fill="url(#diamondInner)"
        opacity="0.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
      />
      <defs>
        <linearGradient id="diamondGrad" x1="3.5" y1="1" x2="18.5" y2="21">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="diamondStroke" x1="3.5" y1="1" x2="18.5" y2="21">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="diamondInner" x1="7.5" y1="5" x2="14.5" y2="17">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function AnimatedCountUp({ target, delay = 0 }: { target: number; delay?: number }) {
  const [display, setDisplay] = useState('$0')
  const count = useMotionValue(0)

  useEffect(() => {
    const unsub = count.on('change', (v) => {
      if (target >= 1_000_000) setDisplay(`$${(v / 1_000_000).toFixed(1)}M`)
      else if (target >= 1_000) setDisplay(`$${(v / 1_000).toFixed(1)}k`)
      else setDisplay(`$${Math.round(v)}`)
    })
    const controls = animate(count, target, { duration: 1.8, delay, ease: 'easeOut' })
    return () => { unsub(); controls.stop() }
  }, [count, target, delay])

  return <span className="text-2xl font-semibold tracking-tight text-white">{display}</span>
}

function Node({ label, color, cx, delay }: { label: string; color: string; cx: number; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.6, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{ position: 'absolute', left: `${cx}%`, top: 0 }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl border shadow-lg backdrop-blur-sm"
        style={{ borderColor: `${color}30`, backgroundColor: `${color}12` }}
      >
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }} />
      </div>
      <span className="whitespace-nowrap text-[11px] font-medium tracking-wide text-zinc-500">{label}</span>
    </motion.div>
  )
}

class ParticleParams {
  constructor(
    public fromX: number,
    public fromY: number,
    public toX: number,
    public toY: number,
    public delay: number,
    public color: string,
    public size: number = 1.5
  ) {}
}

const PARTICLES_SVG_CENTER = 155
const PARTICLES_SVG_BOTTOM = 155
const PARTICLES_TOP = 52

const PARTICLE_OFFSETS = [
  [-11, -3], [7, 1], [-5, 4], [13, -2], [-9, 0],
  [8, 2], [-14, -1], [4, 3], [-7, -3], [11, 1],
  [-6, -2], [10, 2], [-12, 0], [3, -1], [8, 3],
]

const PARTICLE_SIZES = [1.0, 1.8, 1.3, 0.9, 1.5, 1.1, 1.7, 1.2, 0.8, 1.4, 1.6, 1.0, 1.3, 1.5, 0.9]

const PARTICLE_DURATIONS = [2.8, 3.0, 3.4, 2.9, 3.2, 2.7, 3.3, 3.1, 2.8, 3.5, 3.0, 2.9, 3.2, 3.4, 2.7]

function generateParticles(): ParticleParams[] {
  const providers = [
    { cx: 52, color: '#2DD4BF', label: 'aws' },
    { cx: 185, color: '#14B8A6', label: 'azure' },
    { cx: 315, color: '#10B981', label: 'gcp' },
  ]
  const all: ParticleParams[] = []
  providers.forEach((p, pi) => {
    for (let i = 0; i < 5; i++) {
      const idx = pi * 5 + i
      const [ox, oy] = PARTICLE_OFFSETS[idx]
      all.push(
        new ParticleParams(
          p.cx + ox,
          PARTICLES_TOP + (i % 2 === 0 ? -2 : 4) + oy,
          PARTICLES_SVG_CENTER + ox * 0.3,
          PARTICLES_SVG_BOTTOM + oy * 0.5,
          0.1 * pi + 0.15 * i,
          p.color,
          PARTICLE_SIZES[idx]
        )
      )
    }
  })
  return all
}

function ParticleFlow() {
  const particles = generateParticles()

  return (
    <div className="relative h-52">
      <Node label="AWS" color="#FF9900" cx={10} delay={0.3} />
      <Node label="Azure" color="#0078D4" cx={44} delay={0.45} />
      <Node label="GCP" color="#4285F4" cx={78} delay={0.6} />

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          initial={{ x: p.fromX, y: p.fromY, opacity: 0 }}
          animate={{
            x: [p.fromX, p.fromX + (p.toX - p.fromX) * 0.5, p.toX],
            y: [p.fromY, p.fromY + (p.toY - p.fromY) * 0.3, p.toY],
            opacity: [0, 0.7, 0],
            scale: [0.4, 1.3, 0.4],
          }}
          transition={{ duration: PARTICLE_DURATIONS[i], delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        className="absolute left-1/2 top-[140px] -translate-x-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-lg shadow-teal-500/30">
          <span className="text-xl font-bold tracking-tight text-white">C</span>
        </div>
        <p className="mt-2 text-center text-xs font-semibold tracking-wide text-zinc-500">
          AI Cost Center
        </p>
      </motion.div>
    </div>
  )
}

function SavingsChart() {
  const linePath = 'M0,86 L50,78 L100,68 L150,60 L200,48 L250,38 L300,26 L350,18 L400,10'
  const areaPath = `${linePath} L400,110 L0,110 Z`
  const forecastPath = 'M400,10 L430,8 L460,4 L490,2'
  const forecastAreaPath = `${forecastPath} L490,110 L400,110 Z`

  return (
    <motion.div
      className="group relative rounded-2xl border border-zinc-800/40 bg-zinc-900/30 p-5 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium tracking-wide text-zinc-500">Projected Annual Savings</p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <AnimatedCountUp target={2400000} delay={1.2} />
            <motion.span
              className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 2.2 }}
            >
              -34% YoY
            </motion.span>
          </div>
        </div>
        <motion.div
          className="flex items-center gap-1.5 text-[11px] text-zinc-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <span className="inline-block h-2 w-4 rounded-full bg-teal-500/60" />
          <span>Actual</span>
          <span className="ml-2 inline-block h-0 border-t border-dashed border-teal-500/30 w-4" />
          <span>Forecast</span>
        </motion.div>
      </div>

      <div className="relative h-28">
        <svg className="h-full w-full overflow-visible" viewBox="0 0 500 110" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
            <linearGradient id="forecastStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#5EEAD4" />
            </linearGradient>
            <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[28, 56, 84].map((y, i) => (
            <motion.line
              key={y}
              x1="0" y1={y} x2="500" y2={y}
              stroke="#1E293B" strokeWidth="1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 1.0 + i * 0.12 }}
            />
          ))}

          {/* Confidence band */}
          <motion.path
            d="M400,5 C420,7 440,10 460,8 L460,16 C440,18 420,15 400,12 Z"
            fill="#14B8A6"
            opacity="0.08"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.0 }}
          />

          {/* Main area */}
          <motion.path
            d={areaPath}
            fill="url(#areaFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          />

          {/* Forecast area */}
          <motion.path
            d={forecastAreaPath}
            fill="url(#forecastArea)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          />

          {/* Main line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#lineStroke)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 1.2, ease: 'easeInOut' }}
          />

          {/* Forecast line */}
          <motion.path
            d={forecastPath}
            fill="none"
            stroke="url(#forecastStroke)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 2.0, ease: 'easeInOut' }}
          />

          {/* Endpoint glow */}
          <motion.circle
            cx="490" cy="2" r="5"
            fill="#14B8A6"
            filter="url(#glow)"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.4, 1] }}
            transition={{ duration: 0.5, delay: 2.6, ease: 'easeOut' }}
          />
          <motion.circle
            cx="490" cy="2" r="9"
            fill="#14B8A6"
            opacity="0.2"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 2, 1] }}
            transition={{ duration: 2.5, delay: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      <div className="mt-1 flex justify-between text-[10px] font-medium tracking-wide text-zinc-600">
        {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Jan'].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </motion.div>
  )
}

function ShimmerButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-sm font-semibold text-white shadow-lg shadow-teal-500/15 transition-all duration-300 hover:scale-[1.015] hover:shadow-xl hover:shadow-teal-500/25 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full rounded-xl bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        <>
          <span>{children}</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  )
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-teal-500/10 via-transparent to-transparent opacity-40" />
      <div className="relative rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 shadow-xl shadow-black/40 backdrop-blur-xl">
        {children}
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
      errorRef.current?.focus()
    } else {
      router.push('/overview')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E14] lg:flex-row">
      {/* Mobile bg texture */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900/80 via-[#0A0E14] to-teal-950/20 lg:hidden" />
      <div className="fixed inset-0 bg-[radial-gradient(#1E293B_0.5px,transparent_0.5px)] bg-[length:20px_20px] lg:hidden" />

      {/* ============ Left Panel — Login Form ============ */}
      <div className="relative z-10 flex w-full items-center justify-center overflow-hidden lg:w-[55%]">
        <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(#1E293B_0.5px,transparent_0.5px)] bg-[length:24px_24px] lg:block" />
        <div className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 -translate-y-1/2 translate-x-1/3 rounded-full bg-teal-500/5 blur-[120px]" />

        <motion.div
          className="flex w-full max-w-sm flex-col px-5 py-10 sm:px-6 sm:py-14 lg:px-4 xl:px-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-9">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 shadow-lg shadow-teal-500/20">
                <DiamondLogo />
              </div>
              <div>
                <span className="text-[15px] font-bold tracking-[-0.02em] text-white">AI</span>
                <span className="text-[15px] font-medium tracking-[-0.01em] text-zinc-400"> Cost Center</span>
              </div>
            </div>
          </motion.div>

          <GlassCard>
            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-[26px] font-semibold tracking-tight text-white">
              Welcome back
            </motion.h1>
            <motion.p variants={itemVariants} className="mb-7 text-sm text-zinc-500">
              Sign in to your cost dashboard
            </motion.p>

            {/* Error banner */}
            <motion.div variants={itemVariants}>
              {error && (
                <div
                  ref={errorRef}
                  role="alert"
                  className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/15 bg-red-500/8 p-3 text-sm text-red-400"
                  tabIndex={-1}
                >
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>

            <motion.form variants={containerVariants} onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <motion.div variants={itemVariants} className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3.5 pt-3.5 text-sm text-white placeholder-transparent shadow-sm transition-all duration-200 focus:border-teal-500/50 focus:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  aria-describedby="email-desc"
                />
                <label
                  htmlFor="email"
                  className="pointer-events-none absolute left-3.5 top-3 text-sm text-zinc-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-teal-400"
                >
                  Email address
                </label>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3.5 pt-3.5 pr-10 text-sm text-white placeholder-transparent shadow-sm transition-all duration-200 focus:border-teal-500/50 focus:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
                  placeholder="password"
                  required
                  autoComplete="current-password"
                />
                <label
                  htmlFor="password"
                  className="pointer-events-none absolute left-3.5 top-3 text-sm text-zinc-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-teal-400"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 rounded-lg p-1 text-zinc-500 transition-colors hover:text-zinc-300"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </motion.div>

              {/* Remember me + Forgot password */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-teal-500 accent-teal-500 focus:ring-teal-500/30 focus:ring-offset-0"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-teal-400 transition-colors hover:text-teal-300"
                >
                  Forgot password?
                </button>
              </motion.div>

              {/* CTA */}
              <motion.div variants={itemVariants}>
                <ShimmerButton type="submit" disabled={loading} loading={loading}>
                  Sign in
                </ShimmerButton>
              </motion.div>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative my-1.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-zinc-900/60 px-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                    or continue with
                  </span>
                </div>
              </motion.div>

              {/* SSO */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2.5">
                {[
                  { label: 'Google', icon: Chrome },
                  { label: 'GitHub', icon: Github },
                  { label: 'Microsoft', icon: Briefcase },
                ].map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/20 text-xs font-medium text-zinc-400 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/30 hover:text-zinc-200 active:scale-[0.97]"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {label}
                  </button>
                ))}
              </motion.div>
            </motion.form>
          </GlassCard>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-center text-[11px] font-medium tracking-wide text-zinc-600"
          >
            Multi-cloud FinOps intelligence, powered by AI agents
          </motion.p>
        </motion.div>
      </div>

      {/* ============ Right Panel — Visual Showcase ============ */}
      <div className="relative hidden w-[45%] overflow-hidden lg:block">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-[#0A0E14] to-teal-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_0.5px,transparent_0.5px)] bg-[length:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E14] via-transparent to-transparent" />

        {/* Decorative glow orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-teal-500/8 blur-[140px]" />
        <div className="pointer-events-none absolute -right-10 bottom-1/4 h-48 w-48 rounded-full bg-emerald-500/5 blur-[100px]" />

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-center px-12">
          <div className="w-full max-w-sm">
            {/* Provider nodes + particle flow */}
            <ParticleFlow />
            <div className="mt-6">
              <SavingsChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
