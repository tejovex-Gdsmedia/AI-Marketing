import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import TopoFieldPlaceholder from '@/components/ui/topo-field-simple'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-white overflow-hidden selection:bg-neutral-500/20">
      {/* Animated WebGL background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <TopoFieldPlaceholder className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/80 via-transparent to-[#0a0a0c]/90 pointer-events-none" />
      </div>

      <header className="relative z-20 w-full px-6 md:px-16 py-6 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-md bg-[#0a0a0c]/60">
        <Link href="/" className="flex items-center gap-2.5 text-white hover:text-neutral-200 transition-colors">
          <Sparkles className="w-5 h-5 text-neutral-300" />
          <span className="text-base font-semibold tracking-tight">Launchpad</span>
        </Link>
        <nav className="flex items-center gap-8 text-sm text-neutral-300">
          <Link href="/login" className="hover:text-white transition-colors">Log in</Link>
          <Link href="/signup" className="px-4 py-2 rounded-full bg-white text-[#0a0a0c] text-sm font-semibold hover:bg-neutral-200 transition-colors">Get started</Link>
        </nav>
      </header>

      <main className="relative z-10 flex flex-col items-center px-6 pt-28 pb-24 md:pt-36 md:pb-32">
        <section className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] text-white mb-8 drop-shadow-2xl">
            Marketing intelligence<br />
            <span className="text-neutral-300">without the noise.</span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Submit your site. Get competitor research, strategic plans, and metrics in minutes.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#0a0a0c] font-bold text-base hover:bg-neutral-100 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              Start analysis <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white hover:bg-white/[0.08] transition-colors text-base font-medium backdrop-blur-sm">
              How it works
            </a>
          </div>
        </section>

        {/* Feature cards — visible light cards on dark */}
        <section id="features" className="w-full max-w-5xl mt-32 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: 'Instant Research', desc: 'AI scans your industry, competitors, and audience in seconds — no manual work.' },
            { title: 'Strategic Plans', desc: 'Get tailored ads strategy, SEO rankings, content ideas, and growth recommendations.' },
            { title: 'Real Metrics', desc: 'Track competitor pages, ranking scores, module results, and progress over time.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl p-8 bg-[#0f0f14] border border-white/[0.08] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section id="how" className="w-full max-w-5xl mt-28">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-3 tracking-tight">How Launchpad Works</h2>
          <p className="text-center text-neutral-300 mb-14">From URL to strategy in minutes</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Submit URL', desc: 'Enter your website and select modules.' },
              { step: '02', title: 'AI Research', desc: 'We crawl competitors and gather data.' },
              { step: '03', title: 'Generate', desc: 'AI builds your strategic reports.' },
              { step: '04', title: 'Review', desc: 'View ads, SEO, content, and metrics.' },
            ].map((s) => (
              <div key={s.step} className="group rounded-2xl p-6 bg-[#0f0f14] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-0.5 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                <span className="text-3xl font-extrabold text-neutral-700 group-hover:text-neutral-400 transition-colors">{s.step}</span>
                <h4 className="text-base font-bold text-white mt-3 mb-2">{s.title}</h4>
                <p className="text-sm text-neutral-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.08] px-6 md:px-16 py-6 flex items-center justify-between text-xs text-neutral-400 bg-[#0a0a0c]/60 backdrop-blur-md">
        <span className="font-medium">Launchpad</span>
        <span>Built for modern growth</span>
      </footer>
    </div>
  )
}
