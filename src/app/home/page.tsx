'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, ArrowUpRight, LogOut } from 'lucide-react'
import AnimatedGradient from '@/components/ui/animated-gradient'

interface Company {
  id: string
  company_name: string
  website_url: string
  industry: string
  scrape_status: string
  created_at: string
  active_modules: string[]
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser({ email: user.email || '', name: user.user_metadata?.full_name || user.email || '' })
      try {
        const res = await fetch(`http://127.0.0.1:8000/companies?user_id=${user.id}`)
        const data = await res.json()
        setCompanies(data.companies || [])
      } catch (err) {
        console.error('Failed to fetch companies:', err)
      }
      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleCompanyClick = (company: Company) => {
    localStorage.setItem('profile_id', company.id)
    localStorage.setItem('company_name', company.company_name)
    localStorage.setItem('active_modules', JSON.stringify(company.active_modules || []))
    router.push('/dashboard')
  }

  const moduleLabels: Record<string, string> = {
    marketing_research: 'Research',
    content_creation: 'Content',
    ads_strategy: 'Ads',
    seo_dashboard: 'SEO',
  }

  const statusColors: Record<string, string> = {
    done: 'bg-emerald-400/10 text-emerald-400',
    running: 'bg-neutral-400/10 text-neutral-300',
    pending: 'bg-neutral-800/40 text-neutral-300',
    failed: 'bg-red-400/10 text-red-400',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    // ✅ CHANGE 1: added "relative overflow-hidden"
<div className="relative min-h-screen text-[#e8e6e3] overflow-hidden">
      {/* ✅ CHANGE 2: AnimatedGradient added here */}
      <AnimatedGradient
        config={{
          preset: "custom",
          color1: "#050510",
          color2: "#1a1050",
          color3: "#000000",
          swirl: 25,
          swirlIterations: 5,
          softness: 100,
          speed: 15,
          distortion: 2,
          scale: 0.5,
          proportion: 35,
          rotation: -20,
          shape: "Checks",
          shapeSize: 30,
          offset: 0,
        }}
        noise={{ opacity: 0.2, scale: 1 }}
      />

      {/* ✅ CHANGE 3: added "relative z-10" so header stays above gradient */}
      <header className="relative z-10 border-b border-white/[0.04] px-6 md:px-10 py-4 flex items-center justify-between">
<div className="flex items-center gap-3">
  <img src="/logo.png" alt="Tejovex AI" className="h-8 w-auto object-contain " />
</div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-300 hidden md:inline">{user?.email}</span>
          <button onClick={handleLogout} className="text-xs px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-colors text-neutral-300 flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-100">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-neutral-300 text-sm mt-1.5">
              {companies.length > 0
                ? `You have ${companies.length} company${companies.length > 1 ? 'ies' : ''} analysed`
                : 'Start by analysing your first company'}
            </p>
          </div>
          <Link href="/onboarding" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-200 text-[#0a0a0c] font-semibold text-sm hover:bg-white transition-colors shadow-none">
            <Plus className="w-4 h-4" /> New Company
          </Link>
        </div>

        {companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-white/[0.06] bg-[#0f0f12]">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-white/[0.06] flex items-center justify-center mb-6 text-xl text-neutral-200">🏢</div>
            <h3 className="text-white font-medium mb-2">No companies yet</h3>
            <p className="text-neutral-300 text-sm mb-8">Analyse your first company to get started</p>
            <Link href="/onboarding" className="px-6 py-3 rounded-xl bg-neutral-200 text-[#0a0a0c] font-semibold text-sm hover:bg-white transition-colors">
              Analyse a Company
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleCompanyClick(company)}
                className="text-left p-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.07] transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-white/[0.08] flex items-center justify-center text-neutral-300 font-semibold text-sm shrink-0">
                    {company.company_name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColors[company.scrape_status] || statusColors.pending}`}>
                    {company.scrape_status === 'done' ? 'Ready' : company.scrape_status}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-white mb-0.5 truncate">{company.company_name}</h3>
                <p className="text-xs text-neutral-300 mb-1 truncate">{company.website_url}</p>
                <p className="text-[11px] text-neutral-200 mb-4">{company.industry}</p>
                <div className="h-px bg-white/[0.06] mb-3" />
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(company.active_modules || []).map((mod) => (
                    <span key={mod} className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-white/[0.06]">
                      {moduleLabels[mod] || mod}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-200">
                    {new Date(company.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-200 group-hover:text-neutral-200 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}