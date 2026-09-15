'use client'

import { motion } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboarding-store'
import {
  Search,
  PenTool,
  Megaphone,
  BarChart3,
  Mail,
  LineChart,
  FileText,
  Zap,
  Lock,
} from 'lucide-react'

const activeModules = [
  {
    value: 'marketing_research',
    label: 'Marketing Research',
    desc: 'Audience insights, market trends, and opportunity mapping',
    icon: Search,
    color: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-400/40',
  },
  {
    value: 'content_creation',
    label: 'Content Creation',
    desc: 'Blog posts, landing pages, and creative copy',
    icon: PenTool,
    color: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-400',
    borderColor: 'border-violet-400/40',
  },
  {
    value: 'ads_strategy',
    label: 'Ads Strategy',
    desc: 'Google, Meta, and LinkedIn ad copy that converts',
    icon: Megaphone,
    color: 'from-rose-500/20 to-rose-500/5',
    iconColor: 'text-rose-400',
    borderColor: 'border-rose-400/40',
  },
  {
    value: 'seo_dashboard',
    label: 'SEO Dashboard',
    desc: 'Keyword tracking, rankings, and content performance',
    icon: BarChart3,
    color: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-400/40',
  },
]

const lockedModules = [
  {
    value: 'email_campaigns',
    label: 'Email Campaigns',
    desc: 'Sequences, newsletters, and drip campaigns',
    icon: Mail,
  },
  {
    value: 'analytics_dashboard',
    label: 'Analytics Dashboard',
    desc: 'Performance dashboards and competitive intel',
    icon: LineChart,
  },
]

const platformOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
]

const tones = [
  { value: 'professional', label: 'Professional', desc: 'Polished and authoritative' },
  { value: 'casual', label: 'Casual & Friendly', desc: 'Warm, approachable, human' },
  { value: 'bold', label: 'Bold & Edgy', desc: 'Opinionated, provocative, memorable' },
  { value: 'witty', label: 'Witty & Clever', desc: 'Smart humor that sticks' },
]

export function StepModules() {
  const { data, updateField } = useOnboardingStore()

  const toggleModule = (value: string) => {
    const current = data.active_modules
    if (current.includes(value)) {
      updateField('active_modules', current.filter((m) => m !== value))
    } else {
      updateField('active_modules', [...current, value])
    }
  }

  const togglePlatform = (value: string) => {
    const current = data.platforms
    if (current.includes(value)) {
      updateField('platforms', current.filter((p) => p !== value))
    } else {
      updateField('platforms', [...current, value])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          What should we build for you?
        </h2>
        <p className="text-[var(--muted-cream)] text-sm sm:text-base leading-relaxed">
          Pick at least one module. These power the AI workflows that run after setup.
        </p>
      </div>

      {/* Active Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeModules.map((mod) => {
          const isActive = data.active_modules.includes(mod.value)
          const Icon = mod.icon
          return (
            <button
              key={mod.value}
              type="button"
              onClick={() => toggleModule(mod.value)}
              className={`
                relative p-4 rounded-2xl border-2 text-left transition-all duration-300
                group overflow-hidden
                ${
                  isActive
                    ? `${mod.borderColor} bg-gradient-to-br ${mod.color} shadow-[0_0_25px_rgba(0,0,0,0.2)]`
                    : 'border-[var(--border-dark)] bg-[var(--input-dark)] hover:border-white/20 hover:bg-white/[0.03]'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl transition-colors duration-200 ${
                  isActive ? `${mod.iconColor} bg-white/10` : 'bg-white/5 text-[var(--muted-cream)]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`block text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-white/80'}`}>
                    {mod.label}
                  </span>
                  <span className="block text-[11px] text-[var(--muted-cream)] mt-0.5 leading-relaxed">
                    {mod.desc}
                  </span>
                </div>
              </div>
              {isActive && (
                <motion.div
                  layoutId={`moduleCheck_${mod.value}`}
                  className="absolute top-3 right-3"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Zap className={`w-4 h-4 ${mod.iconColor}`} />
                </motion.div>
              )}
            </button>
          )
        })}
      </div>

      {/* Locked / Coming Soon Modules */}
      <div className="space-y-3">
        <p className="text-xs text-[var(--muted-cream)] uppercase tracking-wider font-medium">Coming Soon</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lockedModules.map((mod) => {
            const Icon = mod.icon
            return (
              <div
                key={mod.value}
                className="
                  relative p-4 rounded-2xl border-2 border-white/[0.04] bg-white/[0.015]
                  text-left opacity-50 cursor-not-allowed select-none
                "
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/[0.03] text-[var(--muted-cream)]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-white/50">
                      {mod.label}
                    </span>
                    <span className="block text-[11px] text-[var(--muted-cream)] mt-0.5 leading-relaxed">
                      {mod.desc}
                    </span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04]">
                  <Lock className="w-3 h-3 text-white/25" />
                  <span className="text-[9px] text-white/25 uppercase tracking-wider font-medium">Soon</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {data.active_modules.length === 0 && (
        <p className="text-xs text-amber-400/70 -mt-4">Select at least one module to continue</p>
      )}

      {/* Platform Checkboxes */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
            Which platforms are you active on?
          </label>
          <p className="text-xs text-[var(--muted-cream)]">
            Optional — helps us tailor content formats and ad strategies.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {platformOptions.map((platform) => {
            const isChecked = data.platforms.includes(platform.value)
            return (
              <button
                key={platform.value}
                type="button"
                onClick={() => togglePlatform(platform.value)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium
                  transition-all duration-200
                  ${
                    isChecked
                      ? 'border-amber-400/40 bg-amber-400/10 text-amber-400'
                      : 'border-[var(--border-dark)] bg-[var(--input-dark)] text-white/50 hover:border-white/15 hover:text-white/70'
                  }
                `}
              >
                <span className={`
                  w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200
                  ${
                    isChecked
                      ? 'border-amber-400 bg-amber-400'
                      : 'border-white/20'
                  }
                `}>
                  {isChecked && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="w-2.5 h-2.5 text-black"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 6l2.5 2.5 4.5-5" />
                    </motion.svg>
                  )}
                </span>
                {platform.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Tone */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Content Tone
          </label>
          <p className="text-xs text-[var(--muted-cream)]">
            This sets the voice for all generated content and ad copy.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {tones.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => updateField('content_tone', tone.value)}
              className={`
                p-3.5 rounded-xl border-2 text-center transition-all duration-200
                ${
                  data.content_tone === tone.value
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-[var(--border-dark)] bg-[var(--input-dark)] hover:border-white/15'
                }
              `}
            >
              <span className={`block text-sm font-semibold transition-colors ${
                data.content_tone === tone.value ? 'text-amber-400' : 'text-white'
              }`}>
                {tone.label}
              </span>
              <span className="block text-[10px] text-[var(--muted-cream)] mt-0.5">{tone.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}