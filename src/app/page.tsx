import Link from 'next/link'
import { ArrowRight, Zap, ShieldCheck, TrendingUp } from 'lucide-react'
import MeshBackground from '@/components/ui/mesh-background'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] text-white overflow-hidden selection:bg-white/30">
      {/* Subtle Grain Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Animated Mesh Hero Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MeshBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/60 via-transparent to-[#030303]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#030303_90%)] pointer-events-none" />
      </div>

      {/* Glass header */}
      <header className="relative z-30 w-full px-6 md:px-16 py-5 flex items-center justify-between border-b border-white/[0.06] backdrop-blur-xl bg-[#030303]/40 sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Tejovex AI" className="h-8 w-auto object-contain" />
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-300">
          <Link href="#how" className="hover:text-white transition-colors hidden md:block">How it works</Link>
          <Link href="#features" className="hover:text-white transition-colors hidden md:block">Features</Link>
          <Link href="/login" className="hover:text-white transition-colors hidden md:block">Log in</Link>
          <Link href="/signup" className="inline-flex items-center px-5 py-2.5 rounded-full bg-white text-[#030303] text-sm font-bold hover:bg-neutral-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.25)]">
            Get started
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex flex-col items-center px-6">
        {/* Hero */}
        <section className="max-w-5xl text-center pt-32 md:pt-44 pb-24 md:pb-36">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md mb-10 animate-[float-slow_6s_ease-in-out_infinite]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="text-xs font-medium text-neutral-300 tracking-wide">AI-Powered Marketing Intelligence</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-extrabold tracking-tighter leading-[0.92] text-white mb-10 drop-shadow-[0_20px_60px_rgba(255,255,255,0.12)] glow-text">
            Marketing<br />
            <span className="text-neutral-400">without noise.</span>
          </h1>

          <p className="text-lg md:text-2xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light tracking-tight">
            Submit your site. Get competitor research, strategic plans, and real metrics — in minutes, not months.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 px-9 py-5 rounded-2xl bg-white text-[#030303] text-lg font-extrabold hover:bg-neutral-100 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.35)] hover:-translate-y-0.5">
              Start analysis <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 px-9 py-5 rounded-2xl border border-white/[0.1] text-white hover:bg-white/[0.06] hover:border-white/[0.2] transition-all text-lg font-medium backdrop-blur-sm hover:-translate-y-0.5">
              How it works
            </a>
          </div>
        </section>

        {/* Feature Cards */}
        <section id="features" className="w-full max-w-5xl mb-36">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: 'Instant Research', desc: 'AI scans your industry, competitors, and audience in seconds — no manual work required.' },
              { icon: ShieldCheck, title: 'Strategic Plans', desc: 'Tailored ads strategy, SEO rankings, content ideas, and growth recommendations delivered instantly.' },
              { icon: TrendingUp, title: 'Real Metrics', desc: 'Track competitor pages, ranking scores, module results, and progress over time with precision.' },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl p-9 bg-[#0a0a0c]/60 border border-white/[0.06] hover:border-white/[0.2] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:bg-white/[0.08] transition-colors">
                  <f.icon className="w-6 h-6 text-neutral-200" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="w-full max-w-5xl mb-36">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">How Launchpad Works</h2>
            <p className="text-neutral-400 text-base">From URL to strategy in minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { step: '01', title: 'Submit URL', desc: 'Enter your website and select the analysis modules you need.' },
              { step: '02', title: 'AI Research', desc: 'Our engine crawls competitors and gathers real-time data.' },
              { step: '03', title: 'Generate', desc: 'AI builds strategic reports tailored to your business.' },
              { step: '04', title: 'Review', desc: 'View ads strategy, SEO insights, content plans, and metrics.' },
            ].map((s) => (
              <div
                key={s.step}
                className="group relative rounded-2xl p-8 bg-[#08080c] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_50px_rgba(0,0,0,0.6)]"
              >
                <span className="text-5xl font-extrabold text-neutral-800 group-hover:text-neutral-600 transition-colors tracking-tighter">{s.step}</span>
                <h4 className="text-base font-bold text-white mt-5 mb-2 tracking-tight">{s.title}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action banner */}
        <section className="w-full max-w-4xl mb-32">
          <div className="relative rounded-3xl overflow-hidden bg-[#08080c] border border-white/[0.06] p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight relative">Ready to grow faster?</h2>
            <p className="text-neutral-400 mb-8 max-w-lg mx-auto font-light">Analyze your site, see your competitors, and get strategic plans — all powered by AI.</p>
            <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-[#030303] text-lg font-extrabold hover:bg-neutral-100 transition-all shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:shadow-[0_0_90px_rgba(255,255,255,0.35)] hover:-translate-y-1">
              Get started free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 bg-[#030303]/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-tight">Launchpad</span>
          <span className="hidden md:inline text-neutral-700">|</span>
          <span>Built for modern growth</span>
        </div>
        <div className="flex gap-6 text-neutral-600">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
