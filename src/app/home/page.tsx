'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUser({
        email: user.email || '',
        name: user.user_metadata?.full_name || user.email || ''
      })

      // Fetch their companies from FastAPI
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
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
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
    done: 'bg-green-400/10 text-green-400',
    running: 'bg-amber-400/10 text-amber-400',
    pending: 'bg-white/5 text-white/40',
    failed: 'bg-red-400/10 text-red-400',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">

      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
            L
          </div>
          <span className="text-sm font-semibold text-white">Launchpad</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-xs px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/60"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {companies.length > 0
                ? `You have ${companies.length} company${companies.length > 1 ? 'ies' : ''} analysed`
                : 'Start by analysing your first company'}
            </p>
          </div>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            + New Company
          </Link>
        </div>

        {/* Companies Grid */}
        {companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-6 text-2xl">
              🏢
            </div>
            <h3 className="text-white font-semibold mb-2">No companies yet</h3>
            <p className="text-white/40 text-sm mb-8">
              Analyse your first company to get started
            </p>
            <Link
              href="/onboarding"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Analyse a Company
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{companies.map((company) => (
  <button
    key={company.id}
    onClick={() => handleCompanyClick(company)}
    className="text-left p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-400/30 hover:bg-white/[0.05] transition-all duration-200 group"
  >
    {/* Top row */}
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-lg group-hover:bg-amber-400/20 transition-colors shrink-0">
        {company.company_name.charAt(0).toUpperCase()}
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[company.scrape_status] || statusColors.pending}`}>
        {company.scrape_status === 'done' ? '✓ Ready' : company.scrape_status}
      </span>
    </div>

    {/* Company name and details */}
    <h3 className="text-sm font-semibold text-white mb-0.5 truncate">
      {company.company_name}
    </h3>
    <p className="text-xs text-white/40 mb-1 truncate">{company.website_url}</p>
    <p className="text-xs text-white/30 mb-4">{company.industry}</p>

    {/* Divider */}
    <div className="h-px bg-white/[0.04] mb-3" />

    {/* Modules row */}
    <div className="flex flex-wrap gap-1 mb-3">
      {(company.active_modules || []).map((mod) => (
        <span key={mod} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/[0.06]">
          {moduleLabels[mod] || mod}
        </span>
      ))}
    </div>

    {/* Date and arrow */}
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/30">
        {new Date(company.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}
      </span>
      <svg
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        className="text-white/20 group-hover:text-amber-400 transition-colors"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  </button>
))}
          </div>
        )}
      </main>
    </div>
  )
}