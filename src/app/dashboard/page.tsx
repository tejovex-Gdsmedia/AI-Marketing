'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { WalletOverview } from '@/components/wallet/wallet-overview'

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface ResearchResult {
  company_summary: string
  value_proposition: string
  target_audience: { primary: string; secondary: string; pain_points: string[] }
  competitor_analysis: { market_position: string; likely_competitors: string[]; competitive_advantages: string[] }
  keyword_opportunities: string[]
  content_gaps: string[]
  recommendations: string[]
}

interface ContentResult {
  brand_voice: string
  content_pillars: string[]
  blog_ideas: { title: string; target_keyword: string; outline: string[] }[]
  social_captions: { instagram: string; linkedin: string; twitter: string }
  cta_suggestions: string[]
  content_calendar: { week: number; theme: string; content_type: string; topic: string }[]
}

interface AdsResult {
  recommended_platforms: { platform: string; reason: string; budget_allocation: string }[]
  target_audiences: { name: string; demographics: string; interests: string[] }[]
  ad_copies: { type: string; headline: string; description: string; cta: string }[]
  keywords: { high_intent: string[]; broad_match: string[]; negative_keywords: string[] }
  budget_recommendation: { monthly_minimum: string; monthly_recommended: string; expected_roas: string }
  campaign_structure: { campaign_name: string; objective: string; ad_groups: string[] }[]
}

interface SeoResult {
  seo_score: number
  competitor_comparison?: {
    your_seo_score: number
    avg_competitor_score: number
    score_gap: number
    competitors: Record<string, { url: string; seo_score: number; pages_scraped: number }>
    missing_elements: { issue: string; your_status: string; competitor_status: string; impact: string; competitors_doing_it: string[] }[]
  }
  on_page_audit: Record<string, { status: string; issues: string[]; recommendations: string[] }>
  keyword_rankings: { keyword: string; current_position: string; difficulty: string; monthly_volume: string }[]
  technical_issues: { issue: string; severity: string; fix: string }[]
  backlink_strategy: { current_estimate: string; opportunities: string[]; outreach_targets: string[] }
  quick_wins: string[]
  monthly_seo_plan: { month: number; focus: string; tasks: string[] }[]
}

interface ModuleResult {
  module: string
  result: ResearchResult | ContentResult | AdsResult | SeoResult
}

type ActiveSection =
  | 'marketing_research'
  | 'content_creation'
  | 'ads_strategy'
  | 'seo_dashboard'
  | 'image_generation'
  | 'video_generation'
  | 'advanced_video_generator'
  | 'wallet'
  | 'overview'

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const [profileId, setProfileId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string>('')
  const [activeModules, setActiveModules] = useState<string[]>([])
  const [results, setResults] = useState<Record<string, ModuleResult>>({})
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [researchOpen, setResearchOpen] = useState(true)
  const [contentOpen, setContentOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<ActiveSection>('marketing_research')

  const allModulesReady = activeModules.every(mod => !!results[mod])

  const moduleLabels: Record<string, string> = {
    marketing_research: 'Marketing Research',
    content_creation: 'Content Creation',
    ads_strategy: 'Ads Strategy',
    seo_dashboard: 'SEO Dashboard',
  }

  const hasResult = (module: string) => !!results[module]

    const fetchResults = async (pid: string, modules: string[] = activeModules) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard?profile_id=${pid}`)
      const data = await res.json()
      if (data.results) {
        const mapped: Record<string, ModuleResult> = {}
        data.results.forEach((r: ModuleResult) => { mapped[r.module] = r })
        setResults(mapped)
        const allDone = modules.every((mod: string) => mapped[mod])
        if (allDone && pollRef.current) clearInterval(pollRef.current)
      }
    } catch (err) {
      console.error('Failed to fetch results:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    const pid = localStorage.getItem('profile_id')
    const name = localStorage.getItem('company_name')
    const modules = JSON.parse(localStorage.getItem('active_modules') || '[]')

    if (!pid) {
       router.push('/')
        return }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfileId(pid)
    setCompanyName(name || 'Your Company')
    setActiveModules(modules)
    if (modules.length > 0) setActiveSection(modules[0] as ActiveSection)

    fetchResults(pid, modules)
    
    pollRef.current = setInterval(() => fetchResults(pid, modules), 10000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])


  const pollResults = async () => {
    if (!profileId) return
    setPolling(true)
    await fetchResults(profileId)
    setPolling(false)
  }

  const researchSections: ActiveSection[] = ['marketing_research', 'content_creation', 'ads_strategy', 'seo_dashboard']
  const contentSections: ActiveSection[] = ['image_generation', 'video_generation']

  const sectionIcons: Record<string, string> = {
    marketing_research: '📊',
    content_creation: '✏️',
    ads_strategy: '📢',
    seo_dashboard: '🔍',
    image_generation: '🖼',
    video_generation: '🎬',
    advanced_video_generator: '🎬',
    wallet: '💳',
    overview: '📈',
  }

  const sectionLabels: Record<string, string> = {
    marketing_research: 'Marketing Research',
    content_creation: 'Content Creation',
    ads_strategy: 'Ads Strategy',
    seo_dashboard: 'SEO Dashboard',
    image_generation: 'Image Generation',
    video_generation: 'Video Generation',
    advanced_video_generator: 'Advanced Generator',
    wallet: 'Wallet',
    overview: 'Dashboard Overview',
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex">

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        bg-[#111114] border-r border-white/[0.06]
        transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-16'}
        <div className="p-3 border-b border-white/[0.06]">
        <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8A94A6] hover:text-white hover:bg-white/[0.06] transition-colors">
          <span className="text-lg">🏠</span>
          {sidebarOpen && <span className="text-sm font-medium">Home</span>}
        </a>
        </div>
      `}>

        

        {/* Logo + Toggle */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm shrink-0">
            L
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">Launchpad</div>
              <div className="text-xs text-white/40 truncate">{companyName}</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-white/40 hover:text-white transition-colors shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarOpen
                ? <path d="M18 6L6 18M6 6l12 12" />
                : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">

          {/* Overview Button */}
          <button
            onClick={() => setActiveSection('overview')}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-colors
              ${activeSection === 'overview' ? 'text-amber-400 bg-amber-400/10' : 'text-white/60 hover:text-white hover:bg-white/5'}
            `}
          >
            <span className="text-base shrink-0">📈</span>
            {sidebarOpen && <span className="flex-1 text-left">Dashboard Overview</span>}
          </button>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] my-2" />

          {/* Wallet Section */}
          <button
            onClick={() => setActiveSection('wallet')}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-colors
              ${activeSection === 'wallet' ? 'text-amber-400 bg-amber-400/10' : 'text-white/60 hover:text-white hover:bg-white/5'}
            `}
          >
            <span className="text-base shrink-0">💳</span>
            {sidebarOpen && <span className="flex-1 text-left">Wallet</span>}
          </button>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] my-2" />

          {/* Research Accordion */}
          <div>
            <button
              onClick={() => { setResearchOpen(!researchOpen); if (sidebarOpen) setContentOpen(false) }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-colors
                ${researchSections.includes(activeSection) ? 'text-amber-400 bg-amber-400/10' : 'text-white/60 hover:text-white hover:bg-white/5'}
              `}
            >
              <span className="text-base shrink-0">🔬</span>
              {sidebarOpen && <span className="flex-1 text-left">Research</span>}
              {sidebarOpen && (
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className={`transition-transform ${researchOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            </button>

            {/* Research sub-items */}
            {(researchOpen || !sidebarOpen) && (
              <div className={`mt-1 space-y-0.5 ${sidebarOpen ? 'ml-3' : ''}`}>
                {researchSections.map(section => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm
                      transition-colors
                      ${activeSection === section
                        ? 'text-amber-400 bg-amber-400/10 font-medium'
                        : 'text-white/50 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <span className="text-sm shrink-0">{sectionIcons[section]}</span>
                    {sidebarOpen && (
                      <span className="flex-1 text-left">{sectionLabels[section]}</span>
                    )}
                    {sidebarOpen && hasResult(section) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                    )}
                    {sidebarOpen && !hasResult(section) && activeModules.includes(section) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 animate-pulse shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] my-2" />

          {/* Content Accordion */}
          <div>
            <button
              onClick={() => { setContentOpen(!contentOpen); if (sidebarOpen) setResearchOpen(false) }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-colors
                ${contentSections.includes(activeSection) ? 'text-amber-400 bg-amber-400/10' : 'text-white/60 hover:text-white hover:bg-white/5'}
              `}
            >
              <span className="text-base shrink-0">🎨</span>
              {sidebarOpen && <span className="flex-1 text-left">Content Studio</span>}
              {sidebarOpen && (
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className={`transition-transform ${contentOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            </button>

            {(contentOpen || !sidebarOpen) && (
              <div className={`mt-1 space-y-0.5 ${sidebarOpen ? 'ml-3' : ''}`}>
                {contentSections.map(section => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm
                      transition-colors
                      ${activeSection === section
                        ? 'text-amber-400 bg-amber-400/10 font-medium'
                        : 'text-white/50 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <span className="text-sm shrink-0">{sectionIcons[section]}</span>
                    {sidebarOpen && <span className="flex-1 text-left">{sectionLabels[section]}</span>}
                  </button>
                ))}
                <button
                  onClick={() => setActiveSection('advanced_video_generator')}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm
                    transition-colors
                    ${activeSection === 'advanced_video_generator'
                      ? 'text-amber-400 bg-amber-400/10 font-medium'
                      : 'text-white/50 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <span className="text-sm shrink-0">🎬</span>
                  {sidebarOpen && <span className="flex-1 text-left">Advanced Generator</span>}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Refresh button at bottom */}
        <div className="p-4 border-t border-white/[0.06]">
          <button
            onClick={pollResults}
            disabled={polling}
            className={`
              flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors disabled:opacity-40
              ${sidebarOpen ? 'w-full px-3 py-2 rounded-xl hover:bg-white/5' : 'justify-center w-full'}
            `}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            {sidebarOpen && <span>{polling ? 'Refreshing...' : 'Refresh Results'}</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>

        {/* Processing Banner */}
        {!allModulesReady && !loading && (
          <div className="bg-amber-400/5 border-b border-amber-400/10 px-6 py-3 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
            <p className="text-sm text-amber-400/80">
              AI is analyzing your website and generating insights... Results will appear automatically.
            </p>
          </div>
        )}

        {/* Page Title */}
        <div className="px-8 py-6 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">{sectionLabels[activeSection]}</h1>
            <p className="text-xs text-white/40 mt-0.5">
              {contentSections.includes(activeSection)
                ? `Generate ${activeSection === 'image_generation' ? 'images' : 'video concepts'} using AI — powered by your research insights`
                : `AI-powered ${sectionLabels[activeSection].toLowerCase()} for ${companyName}`}
            </p>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </a>
        </div>

        {/* Content */}
        <main className="max-w-5xl mx-auto px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/40 text-sm">Loading results...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard Overview */}
              {activeSection === 'overview' && (
                <DashboardOverview
                  companyName={companyName}
                  onGenerateVideo={() => setActiveSection('advanced_video_generator')}
                  onGenerateImage={() => setActiveSection('image_generation')}
                  onViewAnalytics={() => setActiveSection('marketing_research')}
                />
              )}

              {/* Wallet Section */}
              {activeSection === 'wallet' && profileId && (
                <WalletOverview userId={profileId} />
              )}

              {/* Research Sections */}
              {activeSection === 'marketing_research' && (
                hasResult('marketing_research')
                  ? <ResearchView data={results['marketing_research'].result as ResearchResult} />
                  : <PendingView label="Marketing Research" />
              )}
              {activeSection === 'content_creation' && (
                hasResult('content_creation')
                  ? <ContentView data={results['content_creation'].result as ContentResult} />
                  : <PendingView label="Content Creation" />
              )}
              {activeSection === 'ads_strategy' && (
                hasResult('ads_strategy')
                  ? <AdsView data={results['ads_strategy'].result as AdsResult} />
                  : <PendingView label="Ads Strategy" />
              )}
              {activeSection === 'seo_dashboard' && (
                hasResult('seo_dashboard')
                  ? <SeoView data={results['seo_dashboard'].result as SeoResult} />
                  : <PendingView label="SEO Dashboard" />
              )}

              {/* Content Studio Sections */}
              {activeSection === 'image_generation' && (
                <ImageGenerationView
                  companyName={companyName}
                  research={results['marketing_research']?.result as ResearchResult}
                  content={results['content_creation']?.result as ContentResult}
                />
              )}
              {activeSection === 'video_generation' && (
                <VideoGenerationView
                  companyName={companyName}
                  research={results['marketing_research']?.result as ResearchResult}
                  content={results['content_creation']?.result as ContentResult}
                />
              )}
              {activeSection === 'advanced_video_generator' && (
                <AdvancedVideoGeneratorView
                  companyName={companyName}
                  research={results['marketing_research']?.result as ResearchResult}
                  content={results['content_creation']?.result as ContentResult}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

// ─── Pending View ─────────────────────────────────────────────────────────────

function PendingView({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-6">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <h3 className="text-white font-semibold mb-2">Generating {label}</h3>
        <p className="text-white/40 text-sm leading-relaxed">
          Our AI is analyzing your website and building insights. This usually takes 1-2 minutes.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Shared Components ────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-4">
      <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Tag({ text, color = 'default' }: { text: string; color?: string }) {
  const colors: Record<string, string> = {
    default: 'bg-white/5 text-white/70',
    green: 'bg-green-400/10 text-green-400',
    red: 'bg-red-400/10 text-red-400',
    amber: 'bg-amber-400/10 text-amber-400',
  }
  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium ${colors[color] || colors.default}`}>
      {text}
    </span>
  )
}

// ─── Image Generation View ────────────────────────────────────────────────────

function ImageGenerationView({
  companyName,
  research,
  content,
}: {
  companyName: string
  research?: ResearchResult
  content?: ContentResult
}) {
  const [brief, setBrief] = useState('')
  const [style, setStyle] = useState('professional')
  const [format, setFormat] = useState('social_post')
  const [generating, setGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  const styles = [
    { value: 'professional', label: 'Professional', desc: 'Clean, corporate, trustworthy' },
    { value: 'bold', label: 'Bold & Vibrant', desc: 'Eye-catching, energetic, modern' },
    { value: 'minimal', label: 'Minimal', desc: 'Simple, elegant, whitespace-focused' },
    { value: 'creative', label: 'Creative', desc: 'Artistic, unique, expressive' },
  ]

  const formats = [
    { value: 'social_post', label: 'Social Post', size: '1080x1080' },
    { value: 'linkedin_banner', label: 'LinkedIn Banner', size: '1584x396' },
    { value: 'instagram_story', label: 'Instagram Story', size: '1080x1920' },
    { value: 'blog_header', label: 'Blog Header', size: '1200x628' },
  ]

  const handleGenerate = async () => {
    if (!brief.trim()) return
    setGenerating(true)
    setError('')
    setGeneratedPrompt('')
    setImageUrl('')

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          brief,
          style,
          format,
          research_context: {
            audience: research?.target_audience?.primary || '',
            value_proposition: research?.value_proposition || '',
            pain_points: research?.target_audience?.pain_points || [],
          },
          content_context: {
            brand_voice: content?.brand_voice || '',
            content_pillars: content?.content_pillars || [],
          },
        }),
      })

      const data = await res.json()
      if (data.prompt) setGeneratedPrompt(data.prompt)
      if (data.image_url) setImageUrl(data.image_url)
      if (data.error) setError(data.error)
    } catch {
      setError('Failed to generate image. Please try again.')
    }

    setGenerating(false)
  }

  return (
    <div>
      {/* Context Banner */}
      {research && (
        <div className="bg-amber-400/5 border border-amber-400/10 rounded-2xl p-4 mb-6">
          <p className="text-xs text-amber-400/70 font-medium mb-2 uppercase tracking-wider">Auto-loaded context</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-white/40 mb-1">Company</p>
              <p className="text-sm text-white font-medium">{companyName}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Audience</p>
              <p className="text-sm text-white/70 truncate">{research.target_audience?.primary}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Brand Voice</p>
              <p className="text-sm text-white/70 truncate">{content?.brand_voice?.split('.')[0] || 'Not loaded yet'}</p>
            </div>
          </div>
        </div>
      )}

      <Card title="Image Brief">
        <div className="space-y-5">
          {/* Brief input */}
          <div>
            <label className="text-xs text-white/50 font-medium mb-2 block">
              Describe what you want to create
            </label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder={`e.g. A professional LinkedIn banner showcasing AI video marketing services for Indian MSMEs, with a modern Mumbai cityscape background and bold typography`}
              rows={4}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-amber-400/40 focus:outline-none resize-none"
            />
          </div>

          {/* Style selector */}
          <div>
            <label className="text-xs text-white/50 font-medium mb-2 block">Visual Style</label>
            <div className="grid grid-cols-4 gap-2">
              {styles.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    style === s.value
                      ? 'border-amber-400/50 bg-amber-400/10'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <p className={`text-xs font-medium ${style === s.value ? 'text-amber-400' : 'text-white'}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Format selector */}
          <div>
            <label className="text-xs text-white/50 font-medium mb-2 block">Image Format</label>
            <div className="grid grid-cols-4 gap-2">
              {formats.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    format === f.value
                      ? 'border-amber-400/50 bg-amber-400/10'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <p className={`text-xs font-medium ${format === f.value ? 'text-amber-400' : 'text-white'}`}>
                    {f.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{f.size}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !brief.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Generating Image...
              </span>
            ) : '✨ Generate Image'}
          </button>
        </div>
      </Card>

      {/* Generated Prompt */}
      {generatedPrompt && (
        <Card title="AI-Enhanced Prompt">
          <p className="text-sm text-white/60 leading-relaxed italic">"{generatedPrompt}"</p>
        </Card>
      )}

      {/* Generated Image */}
      {imageUrl && (
        <Card title="Generated Image">
          <img
            src={imageUrl}
            alt="Generated marketing image"
            className="w-full rounded-xl border border-white/[0.06]"
          />
          <div className="mt-4 flex gap-3">
            <a
              href={imageUrl}
              download="generated-image.png"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-medium text-center hover:bg-amber-400/20 transition-colors"
            >
              Download Image
            </a>
            <button
              onClick={() => { setBrief(''); setImageUrl(''); setGeneratedPrompt('') }}
              className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Generate New
            </button>
          </div>
        </Card>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

// ─── Video Generation View ────────────────────────────────────────────────────

function VideoGenerationView({
  companyName,
  research,
  content,
}: {
  companyName: string
  research?: ResearchResult
  content?: ContentResult
}) {
  const [brief, setBrief] = useState('')
  const [videoType, setVideoType] = useState('instagram_reel')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<{
    script: string
    visual_directions: string[]
    audio_suggestion: string
    duration: string
    hook: string
    cta: string
  } | null>(null)

  const videoTypes = [
    { value: 'instagram_reel', label: 'Instagram Reel', desc: '15-30 sec vertical' },
    { value: 'youtube_short', label: 'YouTube Short', desc: '60 sec vertical' },
    { value: 'linkedin_video', label: 'LinkedIn Video', desc: '30-90 sec landscape' },
    { value: 'brand_ad', label: 'Brand Ad', desc: '15-60 sec any format' },
  ]

  const handleGenerate = async () => {
    if (!brief.trim()) return
    setGenerating(true)
    setResult(null)

    try {
      const res = await fetch('/api/generate-video-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          brief,
          video_type: videoType,
          research_context: {
            audience: research?.target_audience?.primary || '',
            pain_points: research?.target_audience?.pain_points || [],
            value_proposition: research?.value_proposition || '',
          },
          content_context: {
            brand_voice: content?.brand_voice || '',
            content_pillars: content?.content_pillars || [],
          },
        }),
      })

      const data = await res.json()
      if (data.result) setResult(data.result)
    } catch {
      console.error('Failed to generate video concept')
    }

    setGenerating(false)
  }

  return (
    <div>
      {/* Context Banner */}
      {research && (
        <div className="bg-amber-400/5 border border-amber-400/10 rounded-2xl p-4 mb-6">
          <p className="text-xs text-amber-400/70 font-medium mb-2 uppercase tracking-wider">Auto-loaded context</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-white/40 mb-1">Company</p>
              <p className="text-sm text-white font-medium">{companyName}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Audience</p>
              <p className="text-sm text-white/70 truncate">{research.target_audience?.primary}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Pain Points</p>
              <p className="text-sm text-white/70 truncate">{research.target_audience?.pain_points?.[0]}</p>
            </div>
          </div>
        </div>
      )}

      <Card title="Video Brief">
        <div className="space-y-5">
          {/* Brief input */}
          <div>
            <label className="text-xs text-white/50 font-medium mb-2 block">
              What is this video about?
            </label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder={`e.g. Show how GDS Media transforms a small Indian business using AI video marketing — before and after transformation, emotional storytelling, end with a CTA to book a free strategy call`}
              rows={4}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-amber-400/40 focus:outline-none resize-none"
            />
          </div>

          {/* Video type selector */}
          <div>
            <label className="text-xs text-white/50 font-medium mb-2 block">Video Format</label>
            <div className="grid grid-cols-4 gap-2">
              {videoTypes.map(v => (
                <button
                  key={v.value}
                  onClick={() => setVideoType(v.value)}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    videoType === v.value
                      ? 'border-amber-400/50 bg-amber-400/10'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <p className={`text-xs font-medium ${videoType === v.value ? 'text-amber-400' : 'text-white'}`}>
                    {v.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{v.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !brief.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Generating Video Concept...
              </span>
            ) : '🎬 Generate Video Concept'}
          </button>
        </div>
      </Card>

      {/* Generated Result */}
      {result && (
        <>
          <Card title="Hook (First 3 seconds)">
            <p className="text-sm text-white/80 leading-relaxed font-medium">{result.hook}</p>
          </Card>

          <Card title="Video Script">
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{result.script}</p>
          </Card>

          <Card title="Visual Directions">
            <div className="space-y-2">
              {result.visual_directions?.map((dir, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-amber-400 font-bold text-sm shrink-0">{i + 1}</span>
                  <p className="text-sm text-white/70">{dir}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card title="Duration">
              <p className="text-lg font-bold text-amber-400">{result.duration}</p>
            </Card>
            <Card title="Audio Suggestion">
              <p className="text-sm text-white/70">{result.audio_suggestion}</p>
            </Card>
            <Card title="CTA">
              <p className="text-sm text-white/70">{result.cta}</p>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Research View ────────────────────────────────────────────────────────────

function ResearchView({ data }: { data: ResearchResult }) {
  return (
    <div>
      <Card title="Company Summary">
        <p className="text-white/70 text-sm leading-relaxed">{data.company_summary}</p>
        <div className="mt-4 p-3 rounded-xl bg-amber-400/5 border border-amber-400/10">
          <p className="text-xs text-amber-400/70 font-medium mb-1">Value Proposition</p>
          <p className="text-sm text-white/80">{data.value_proposition}</p>
        </div>
      </Card>
      <Card title="Target Audience">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-xs text-white/40 mb-1">Primary</p>
            <p className="text-sm text-white/80">{data.target_audience.primary}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-xs text-white/40 mb-1">Secondary</p>
            <p className="text-sm text-white/80">{data.target_audience.secondary}</p>
          </div>
        </div>
        <p className="text-xs text-white/40 mb-2">Pain Points</p>
        <div className="flex flex-wrap gap-2">
          {data.target_audience.pain_points.map((p, i) => <Tag key={i} text={p} color="red" />)}
        </div>
      </Card>
      <Card title="Competitor Analysis">
        <p className="text-sm text-white/70 mb-4">{data.competitor_analysis.market_position}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/40 mb-2">Likely Competitors</p>
            <div className="flex flex-wrap gap-2">
              {data.competitor_analysis.likely_competitors.map((c, i) => <Tag key={i} text={c} />)}
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-2">Competitive Advantages</p>
            <div className="flex flex-wrap gap-2">
              {data.competitor_analysis.competitive_advantages.map((a, i) => <Tag key={i} text={a} color="green" />)}
            </div>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card title="Keyword Opportunities">
          <div className="flex flex-wrap gap-2">
            {data.keyword_opportunities.map((k, i) => <Tag key={i} text={k} color="amber" />)}
          </div>
        </Card>
        <Card title="Content Gaps">
          <ul className="space-y-2">
            {data.content_gaps.map((g, i) => (
              <li key={i} className="text-sm text-white/70 flex gap-2">
                <span className="text-amber-400 mt-0.5">→</span> {g}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card title="Recommendations">
        <div className="space-y-3">
          {data.recommendations.map((r, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-amber-400 font-bold text-sm">{i + 1}</span>
              <p className="text-sm text-white/70">{r}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Content View ─────────────────────────────────────────────────────────────

function ContentView({ data }: { data: ContentResult }) {
  return (
    <div>
      <Card title="Brand Voice">
        <p className="text-white/70 text-sm">{data.brand_voice}</p>
      </Card>
      <Card title="Content Pillars">
        <div className="flex flex-wrap gap-2">
          {data.content_pillars.map((p, i) => <Tag key={i} text={p} color="amber" />)}
        </div>
      </Card>
      <Card title="Blog Ideas">
        <div className="space-y-4">
          {data.blog_ideas.map((b, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-sm font-medium text-white mb-1">{b.title}</p>
              <Tag text={b.target_keyword} color="amber" />
              <ul className="mt-3 space-y-1">
                {b.outline.map((o, j) => (
                  <li key={j} className="text-xs text-white/50 flex gap-2"><span>•</span>{o}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Social Captions">
        <div className="space-y-3">
          {Object.entries(data.social_captions).map(([platform, caption]) => (
            <div key={platform} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-white/40 uppercase mb-1">{platform}</p>
              <p className="text-sm text-white/70">{caption}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card title="4-Week Content Calendar">
        <div className="space-y-3">
          {data.content_calendar.map((week) => (
            <div key={week.week} className="flex gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
                <span className="text-amber-400 font-bold text-sm">W{week.week}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{week.theme}</p>
                <p className="text-xs text-white/40 mt-0.5">{week.content_type} — {week.topic}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Ads View ─────────────────────────────────────────────────────────────────

function AdsView({ data }: { data: AdsResult }) {
  return (
    <div>
      <Card title="Recommended Platforms">
        <div className="space-y-3">
          {data.recommended_platforms.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div>
                <p className="text-sm font-medium text-white">{p.platform}</p>
                <p className="text-xs text-white/40 mt-0.5">{p.reason}</p>
              </div>
              <Tag text={p.budget_allocation} color="amber" />
            </div>
          ))}
        </div>
      </Card>
      <Card title="Ad Copies">
        <div className="space-y-3">
          {data.ad_copies.map((ad, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <Tag text={ad.type} />
              <p className="text-sm font-medium text-white mt-2">{ad.headline}</p>
              <p className="text-xs text-white/50 mt-1">{ad.description}</p>
              <p className="text-xs text-amber-400 mt-2">CTA: {ad.cta}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Budget Recommendation">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
            <p className="text-xs text-white/40 mb-1">Minimum</p>
            <p className="text-lg font-bold text-white">{data.budget_recommendation.monthly_minimum}</p>
            <p className="text-xs text-white/30">per month</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-center">
            <p className="text-xs text-amber-400/70 mb-1">Recommended</p>
            <p className="text-lg font-bold text-amber-400">{data.budget_recommendation.monthly_recommended}</p>
            <p className="text-xs text-amber-400/50">per month</p>
          </div>
          <div className="p-3 rounded-xl bg-green-400/10 border border-green-400/20 text-center">
            <p className="text-xs text-green-400/70 mb-1">Expected ROAS</p>
            <p className="text-lg font-bold text-green-400">{data.budget_recommendation.expected_roas}</p>
            <p className="text-xs text-green-400/50">return</p>
          </div>
        </div>
      </Card>
      <Card title="Keywords">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-white/40 mb-2">High Intent</p>
            <div className="flex flex-wrap gap-2">
              {data.keywords.high_intent.map((k, i) => <Tag key={i} text={k} color="green" />)}
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-2">Broad Match</p>
            <div className="flex flex-wrap gap-2">
              {data.keywords.broad_match.map((k, i) => <Tag key={i} text={k} color="amber" />)}
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-2">Negative Keywords</p>
            <div className="flex flex-wrap gap-2">
              {data.keywords.negative_keywords.map((k, i) => <Tag key={i} text={k} color="red" />)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── SEO View ─────────────────────────────────────────────────────────────────

function SeoView({ data }: { data: SeoResult }) {
  const comparison = data.competitor_comparison
  const competitors = comparison?.competitors ? Object.entries(comparison.competitors) : []

  return (
    <div>
      {comparison && (
        <Card title="SEO Score vs Competitors">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-center">
              <p className="text-xs text-amber-400/70 mb-1">Your Score</p>
              <p className="text-3xl font-bold text-amber-400">{comparison.your_seo_score}</p>
              <p className="text-xs text-white/30 mt-1">out of 100</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
              <p className="text-xs text-white/40 mb-1">Avg Competitor</p>
              <p className="text-3xl font-bold text-white">{comparison.avg_competitor_score}</p>
              <p className="text-xs text-white/30 mt-1">out of 100</p>
            </div>
            <div className={`p-4 rounded-xl text-center ${comparison.score_gap > 0 ? 'bg-red-400/10 border border-red-400/20' : 'bg-green-400/10 border border-green-400/20'}`}>
              <p className="text-xs text-white/40 mb-1">Gap</p>
              <p className={`text-3xl font-bold ${comparison.score_gap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {comparison.score_gap > 0 ? `-${comparison.score_gap}` : `+${Math.abs(comparison.score_gap)}`}
              </p>
              <p className="text-xs text-white/30 mt-1">
                {comparison.score_gap > 0 ? 'behind competitors' : 'ahead of competitors'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {competitors.length > 0 && (
        <Card title="Competitors Analyzed">
          <div className="space-y-2">
            {competitors.map(([domain, comp], i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-400/10 flex items-center justify-center text-xs text-amber-400 font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-400 hover:underline">
                      {domain}
                    </a>
                    <p className="text-xs text-white/30">{comp.pages_scraped} pages scraped</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">SEO Score</span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${comp.seo_score > 70 ? 'bg-green-400/10 text-green-400' : comp.seo_score > 50 ? 'bg-amber-400/10 text-amber-400' : 'bg-red-400/10 text-red-400'}`}>
                    {comp.seo_score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {comparison?.missing_elements && comparison.missing_elements.length > 0 && (
        <Card title="What Competitors Have That You Don't">
          <div className="space-y-3">
            {comparison.missing_elements.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-white">{item.issue}</p>
                  <Tag text={item.impact} color={item.impact === 'high' ? 'red' : item.impact === 'medium' ? 'amber' : 'default'} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-lg bg-red-400/5 border border-red-400/10">
                    <p className="text-xs text-red-400/70 mb-1">Your site</p>
                    <p className="text-xs text-white/60">{item.your_status}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-400/5 border border-green-400/10">
                    <p className="text-xs text-green-400/70 mb-1">Competitors</p>
                    <p className="text-xs text-white/60">{item.competitor_status}</p>
                  </div>
                </div>
                {item.competitors_doing_it?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-white/30 mb-1">Competitors doing this better:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.competitors_doing_it.map((comp, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">{comp}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="SEO Score">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full border-4 border-amber-400 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-amber-400">{data.seo_score}</span>
          </div>
          <div>
            <p className="text-sm text-white/70">Overall SEO health score</p>
            <p className="text-xs text-white/30 mt-1">Calculated from real on-page factors. Updates only when you rescan your website.</p>
          </div>
        </div>
      </Card>

      <Card title="Quick Wins">
        <div className="space-y-2">
          {data.quick_wins.map((w, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-green-400/5 border border-green-400/10">
              <span className="text-green-400">✓</span>
              <p className="text-sm text-white/70">{w}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Technical Issues">
        <div className="space-y-3">
          {data.technical_issues.map((t, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-white">{t.issue}</p>
                <Tag text={t.severity} color={t.severity === 'high' ? 'red' : t.severity === 'medium' ? 'amber' : 'default'} />
              </div>
              <p className="text-xs text-white/40">Fix: {t.fix}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Keyword Rankings">
        <div className="space-y-2">
          {data.keyword_rankings.map((k, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-sm text-white/70">{k.keyword}</p>
              <div className="flex items-center gap-3">
                <Tag text={`Vol: ${k.monthly_volume}`} />
                <Tag text={k.difficulty} color={k.difficulty === 'low' ? 'green' : k.difficulty === 'medium' ? 'amber' : 'red'} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="3-Month SEO Plan">
        <div className="space-y-3">
          {data.monthly_seo_plan.map((m) => (
            <div key={m.month} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-sm font-medium text-amber-400 mb-2">Month {m.month} — {m.focus}</p>
              <ul className="space-y-1">
                {m.tasks.map((t, i) => (
                  <li key={i} className="text-xs text-white/50 flex gap-2"><span>•</span>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Advanced Video Generator View ────────────────────────────────────────

type VideoType = 'avatar' | 'text_to_video' | 'image_to_video'
type GenerationStatus = 'idle' | 'generating' | 'polling' | 'completed' | 'failed'

type VideoModel = {
  id: string
  providerModelId: string
  name: string
  company: string
  description: string
  types: VideoType[]
  tier: 'premium' | 'standard' | 'budget'
  badge?: string
  pricePerVideo?: number
  pricePerSecond?: number
  resolution: string
  maxDuration: number
  nativeAudio?: boolean
}

// Import complete models from models-complete.ts
import { VIDEO_MODELS as COMPLETE_MODELS } from '@/lib/video/models-complete'

// Convert to dashboard VideoModel type - USE ACTUAL PRICING FROM COMPLETE MODELS
const VIDEO_MODELS: VideoModel[] = COMPLETE_MODELS.map((m: any) => ({
  id: m.id,
  providerModelId: m.providerModelId,
  name: m.name,
  company: m.company,
  description: m.description,
  types: m.types,
  tier: m.tier,
  badge: m.badge,
  pricePerSecond: m.pricePerSecond, // Use actual pricing from complete models!
  pricePerVideo: m.pricePerVideo,   // Use actual pricing from complete models!
  resolution: m.defaultResolution || m.resolutions?.[0] || '1080p',
  maxDuration: m.maxDuration,
}))

const TIER_COLORS: Record<string, string> = {
  premium: 'border-amber-400 text-amber-400',
  standard: 'border-blue-400 text-blue-400',
  budget: 'border-emerald-400 text-emerald-400',
}

const TIER_BORDER: Record<string, string> = {
  premium: 'border-l-amber-400',
  standard: 'border-l-blue-400',
  budget: 'border-l-emerald-400',
}

const DURATIONS = [5, 8, 10, 15]
const ASPECT_RATIOS = ['16:9', '9:16', '1:1']

function AdvancedVideoGeneratorView({
  companyName,
  research,
  content,
}: {
  companyName: string
  research?: ResearchResult
  content?: ContentResult
}) {
  const [activeFilter, setActiveFilter] = useState<'all' | VideoType>('all')
  const [selectedModel, setSelectedModel] = useState<VideoModel | null>(null)
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [conceptInput, setConceptInput] = useState('')
  const [duration, setDuration] = useState(5)
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [jobId, setJobId] = useState<string | null>(null)
  const [provider, setProvider] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [avatars, setAvatars] = useState<Array<{ avatar_id: number; name: string; cover_url: string }>>([])
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null)
  const [loadingAvatars, setLoadingAvatars] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const TYPE_FILTERS: { label: string; value: 'all' | VideoType }[] = [
    { label: 'All Models', value: 'all' },
    { label: 'Avatar', value: 'avatar' },
    { label: 'Text to Video', value: 'text_to_video' },
    { label: 'Image to Video', value: 'image_to_video' },
  ]

  const estimateCost = (model: VideoModel, duration: number) =>
    model.pricePerVideo ?? (model.pricePerSecond ?? 0) * duration
  const usdToInr = (usd: number) => Math.round(usd * 95.94 * 100) / 100

  const filteredModels = VIDEO_MODELS.filter((m) =>
    activeFilter === 'all' ? true : m.types.includes(activeFilter as VideoType)
  )

  const estimatedUSD = selectedModel ? estimateCost(selectedModel, duration) : 0
  const estimatedINR = usdToInr(estimatedUSD)

  useEffect(() => {
    if (status === 'polling' && jobId && provider && selectedModel) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/video-status?jobId=${jobId}&provider=${provider}&modelId=${selectedModel.providerModelId}`
          )
          const data = await res.json()

          if (data.status === 'completed') {
            clearInterval(pollRef.current!)
            setVideoUrl(data.videoUrl)
            setStatus('completed')
          } else if (data.status === 'failed') {
            clearInterval(pollRef.current!)
            setError(data.error || 'Generation failed')
            setStatus('failed')
          }
        } catch {
          clearInterval(pollRef.current!)
          setError('Failed to check status')
          setStatus('failed')
        }
      }, 4000)
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [status, jobId, provider, selectedModel])

  // Fetch avatars when Jogg AI is selected
  useEffect(() => {
    if (selectedModel?.id === 'jogg-ai') {
      setLoadingAvatars(true)
      fetch('/api/jogg-avatars')
        .then(res => res.json())
        .then(data => {
          console.log('Avatar response:', data)
          if (data.data && Array.isArray(data.data)) {
            setAvatars(data.data)
            // Set default avatar if available
            if (data.data.length > 0 && !selectedAvatarId) {
              setSelectedAvatarId(data.data[0].avatar_id)
            }
          } else if (data.error) {
            console.error('Avatar fetch error:', data.error)
            setError(`Avatar loading error: ${data.error}`)
          } else {
            console.error('Unexpected response format:', data)
            setError('Unexpected response format from avatars API')
          }
          setLoadingAvatars(false)
        })
        .catch(err => {
          console.error('Failed to fetch avatars:', err)
          setError(`Failed to fetch avatars: ${err.message}`)
          setLoadingAvatars(false)
        })
    }
  }, [selectedModel?.id])

  async function handleGenerateConcept() {
    if (!conceptInput.trim()) return
    setIsGeneratingPrompt(true)
    try {
      const res = await fetch('/api/generate-video-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          brief: conceptInput,
          video_type: 'brand_ad',
          research_context: {
            audience: research?.target_audience?.primary || '',
            pain_points: research?.target_audience?.pain_points || [],
            value_proposition: research?.value_proposition || '',
          },
          content_context: {
            brand_voice: content?.brand_voice || '',
            content_pillars: content?.content_pillars || [],
          },
        }),
      })
      const data = await res.json()
      if (data.result?.script) {
        setPrompt(data.result.script)
      } else if (data.result?.prompt) {
        setPrompt(data.result.prompt)
      }
    } catch (err) {
      console.error('Failed to generate prompt:', err)
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  async function handleGenerate() {
    if (!selectedModel || !prompt.trim()) return
    setStatus('generating')
    setError(null)
    setVideoUrl(null)

    try {
      const payload: Record<string, unknown> = {
        modelId: selectedModel.id,
        prompt: prompt.trim(),
        imageUrl: imageUrl.trim() || undefined,
        duration,
        aspectRatio,
        userId: 'user_id_here',
      }

      // Add avatar_id for Jogg AI
      if (selectedModel.id === 'jogg-ai') {
        if (!selectedAvatarId) {
          setError('Please select an avatar')
          setStatus('failed')
          return
        }
        payload.avatar_id = selectedAvatarId
      }

      const res = await fetch('/api/video-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setJobId(data.jobId)
      setProvider(data.provider)
      setStatus('polling')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed'
      setError(message)
      setStatus('failed')
    }
  }

  function handleReset() {
    setStatus('idle')
    setJobId(null)
    setVideoUrl(null)
    setError(null)
    setProvider(null)
  }

  return (
    <div>
      {/* Context Banner */}
      {research && (
        <div className="bg-amber-400/5 border border-amber-400/10 rounded-2xl p-4 mb-6">
          <p className="text-xs text-amber-400/70 font-medium mb-2 uppercase tracking-wider">Auto-loaded context</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-white/40 mb-1">Company</p>
              <p className="text-sm text-white font-medium">{companyName}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Audience</p>
              <p className="text-sm text-white/70 truncate">{research.target_audience?.primary}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Pain Points</p>
              <p className="text-sm text-white/70 truncate">{research.target_audience?.pain_points?.[0]}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 mb-6">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setActiveFilter(f.value)
              const models = VIDEO_MODELS.filter((model) =>
                f.value === 'all' ? true : model.types.includes(f.value as VideoType)
              )
              setSelectedModel(models[0] ?? null)
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === f.value
                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                : 'text-white/50 hover:text-white bg-white/5 border border-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Model List */}
        <div className="col-span-1 max-h-96 overflow-y-auto space-y-2 pr-2">
          {filteredModels.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedModel?.id === model.id
                  ? 'bg-amber-400/10 border border-amber-400/30'
                  : `bg-white/[0.03] border border-white/10 hover:border-white/20 ${TIER_BORDER[model.tier]}`
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-xs text-white">{model.name}</span>
                    {model.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${TIER_COLORS[model.tier]}`}>
                        {model.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5">{model.company}</p>
                  <p className="text-[11px] text-white/30 mt-1 leading-relaxed">{model.description}</p>
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                {model.types.map((t) => (
                  <span key={t} className="text-[10px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded">
                    {t === 'avatar' ? 'Avatar' : t === 'text_to_video' ? 'T2V' : 'I2V'}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Generation Form */}
        <div className="col-span-2">
          {!selectedModel ? (
            <div className="flex items-center justify-center h-96 text-white/40">
              Select a model to get started
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected model info */}
              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
                <h3 className="font-semibold text-sm text-white">{selectedModel.name}</h3>
                <p className="text-xs text-white/40 mt-1">
                  {selectedModel.company} · {selectedModel.resolution} · Max {selectedModel.maxDuration}s
                </p>
              </div>

              {/* Avatar Selection for Jogg AI */}
              {selectedModel.id === 'jogg-ai' && (
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2">Select Avatar</label>
                  {loadingAvatars ? (
                    <div className="flex items-center justify-center py-8 text-white/40">
                      <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mr-2" />
                      Loading avatars...
                    </div>
                  ) : avatars.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2">
                      {avatars.map((avatar) => (
                        <button
                          key={avatar.avatar_id}
                          onClick={() => setSelectedAvatarId(avatar.avatar_id)}
                          className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${
                            selectedAvatarId === avatar.avatar_id
                              ? 'bg-amber-400/20 border-amber-400/50'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <img
                            src={avatar.cover_url}
                            alt={avatar.name}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/64?text=' + avatar.name.charAt(0)
                            }}
                          />
                          <span className="text-xs text-white text-center truncate max-w-full">{avatar.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-red-900/20 border border-red-700/40">
                      <p className="text-xs text-red-400">Failed to load avatars</p>
                    </div>
                  )}
                </div>
              )}

              {/* Prompt */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2">
                  {selectedModel.types.includes('avatar') ? 'Script' : 'Prompt'}
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={conceptInput}
                    onChange={(e) => setConceptInput(e.target.value)}
                    placeholder="Describe your video idea..."
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400/30"
                  />
                  <button
                    onClick={handleGenerateConcept}
                    disabled={isGeneratingPrompt || !conceptInput.trim()}
                    className="px-3 py-2 bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isGeneratingPrompt ? '...' : 'Auto-Gen'}
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  placeholder={
                    selectedModel.types.includes('avatar')
                      ? 'Write the script your avatar will speak...'
                      : 'Describe the video you want to generate...'
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400/30 resize-none"
                />
              </div>

              {/* Image URL */}
              {(selectedModel.types.includes('image_to_video') || selectedModel.types.includes('text_to_video')) &&
                !selectedModel.types.includes('avatar') && (
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-2">Image URL (optional)</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400/30"
                    />
                  </div>
                )}

              {/* Duration + Aspect Ratio */}
              {!selectedModel.types.includes('avatar') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-2">Duration (seconds)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1
                          // Enforce max duration limit
                          const capped = Math.min(val, selectedModel.maxDuration)
                          setDuration(Math.max(1, capped))
                        }}
                        min="1"
                        max={selectedModel.maxDuration}
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400/30"
                      />
                      <span className="text-xs text-white/40 px-2 py-2">Max: {selectedModel.maxDuration}s</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-2">Aspect Ratio</label>
                    <div className="flex gap-1">
                      {ASPECT_RATIOS.map((ar) => (
                        <button
                          key={ar}
                          onClick={() => setAspectRatio(ar)}
                          className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                            aspectRatio === ar
                              ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                              : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          {ar}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Cost Preview */}
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">Estimated cost</p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    ₹{estimatedINR}
                    <span className="text-xs font-normal text-white/40 ml-1">(${estimatedUSD})</span>
                  </p>
                </div>
              </div>

              {/* Generate Button */}
              {status === 'idle' || status === 'failed' ? (
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg transition-opacity"
                >
                  Generate Video
                </button>
              ) : status === 'generating' || status === 'polling' ? (
                <div className="w-full py-2.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-white/60">
                    {status === 'generating' ? 'Submitting...' : 'Generating...'}
                  </span>
                </div>
              ) : null}

              {/* Error */}
              {status === 'failed' && error && (
                <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                  <p className="text-xs text-red-400">{error}</p>
                  <button onClick={handleReset} className="text-xs text-red-300 underline mt-1">
                    Try again
                  </button>
                </div>
              )}

              {/* Result */}
              {status === 'completed' && videoUrl && (
                <div className="space-y-2">
                  <video src={videoUrl} controls autoPlay className="w-full rounded-lg border border-white/10" />
                  <div className="flex gap-2">
                    <a
                      href={videoUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-amber-400/20 text-amber-400 text-xs font-medium rounded-lg text-center hover:bg-amber-400/30 transition-colors"
                    >
                      Download
                    </a>
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
