'use client'

import { motion } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SuccessScreen() {
  const { data, reset } = useOnboardingStore()
  const router = useRouter()

  const moduleLabels: Record<string, string> = {
    marketing_research: 'Marketing Research',
    content_creation: 'Content Creation',
    ads_strategy: 'Ads Strategy',
    seo_dashboard: 'SEO Dashboard',
  }

  const handleDashboard = () => {
    reset()
    router.push('/dashboard')
  }
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 rounded-full bg-neutral-800 border border-white/[0.1] flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-3">You're all set</h1>
        <p className="text-sm text-neutral-400 mb-8">
          We're setting up your marketing engine for <span className="text-white font-medium">{data.company_name}</span>.
        </p>
        <div className="space-y-3 mb-8 text-left">
          {data.active_modules.map((mod) => (
            <div key={mod} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#0f0f12] border border-white/[0.08]">
              <span className="text-sm text-neutral-200">{moduleLabels[mod] || mod}</span>
              <span className="text-[10px] text-neutral-500 font-medium">Queued</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleDashboard}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#0a0a0c] font-semibold text-sm hover:bg-neutral-100 transition-colors"
        >
          Go to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  )
}
