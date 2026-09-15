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
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-lg w-full"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-black" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-6 h-6 text-amber-300" />
            </motion.div>
          </motion.div>
        </div>

        <div className="text-center space-y-3 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            You&apos;re all set
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[var(--muted-cream)] text-sm leading-relaxed"
          >
            We&apos;re now setting up your marketing engine for{' '}
            <span className="text-white font-medium">{data.company_name}</span>.
            Here&apos;s what we&apos;re working on:
          </motion.p>
        </div>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 mb-8"
        >
          {data.active_modules.map((mod, i) => (
            <motion.div
              key={mod}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <span className="text-sm text-white/80">{moduleLabels[mod] || mod}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-amber-400/80 font-medium uppercase tracking-wider">Queued</span>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center"
        >
<button
  type="button"
  onClick={handleDashboard}
  className="
    flex items-center gap-2 text-sm font-semibold
    px-6 py-3 rounded-xl transition-all duration-300
    bg-gradient-to-r from-amber-400 to-orange-500 text-black
    hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-[0.98]
  "
>
  Go to Dashboard
  <ArrowRight className="w-4 h-4" />
</button>
        </motion.div>
      </motion.div>
    </div>
  )
}
