'use client'

import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { Target, UserCheck, MapPin, Languages } from 'lucide-react'

const customerTypes = [
  { value: 'B2B', label: 'B2B', desc: 'Selling to other businesses' },
  { value: 'B2C', label: 'B2C', desc: 'Selling directly to consumers' },
  { value: 'Both', label: 'Both', desc: 'A mix of B2B and B2C' },
]


const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Chinese (Mandarin)',
  'Japanese',
  'Hindi',
  'Arabic',
  'Korean',
  'Multiple Languages',
]

export function StepAudience() {
  const { data, updateField } = useOnboardingStore()

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
          Who are you trying to reach?
        </h2>
        <p className="text-[var(--muted-cream)] text-sm sm:text-base leading-relaxed">
          The better we know your audience, the sharper your marketing becomes.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Target Audience Description */}
        <div className="space-y-2.5">
          <Label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            Describe your ideal customer <span className="text-amber-400">*</span>
          </Label>
          <Textarea
            placeholder="e.g., Marketing directors at mid-size SaaS companies who struggle with lead generation and are looking for AI-powered automation tools..."
            value={data.target_audience}
            onChange={(e) => updateField('target_audience', e.target.value)}
            rows={4}
            className="
              bg-[var(--input-dark)] border-[var(--border-dark)]
              text-white placeholder:text-[var(--placeholder-dark)]
              focus:border-amber-400/60 focus:ring-amber-400/20
              transition-all duration-200 rounded-xl text-base
              resize-none
            "
          />
          <p className="text-xs text-[var(--muted-cream)]">Demographics, pain points, goals — the more detail the better</p>
        </div>

        {/* Customer Type - Creative card selection */}
        <div className="space-y-3">
          <Label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            Customer Type <span className="text-amber-400">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {customerTypes.map((ct) => (
              <button
                key={ct.value}
                type="button"
                onClick={() => updateField('customer_type', ct.value)}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${
                    data.customer_type === ct.value
                      ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'border-[var(--border-dark)] bg-[var(--input-dark)] hover:border-amber-400/30 hover:bg-amber-400/5'
                  }
                `}
              >
                <span className={`block text-lg font-bold transition-colors duration-200 ${
                  data.customer_type === ct.value ? 'text-amber-400' : 'text-white'
                }`}>
                  {ct.label}
                </span>
                <span className="block text-xs text-[var(--muted-cream)] mt-1">{ct.desc}</span>
                {data.customer_type === ct.value && (
                  <motion.div
                    layoutId="customerTypeIndicator"
                    className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Geography */}
{/* Geography */}
<div className="space-y-2.5">
  <Label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
    <MapPin className="w-4 h-4 text-amber-400" />
    Where are your customers located?
  </Label>
  <input
    type="text"
    placeholder="e.g. Mira Road, Mumbai or Koramangala, Bangalore"
    value={data.geography}
    onChange={(e) => updateField('geography', e.target.value)}
    className="
      w-full h-12 px-4 rounded-xl text-base
      bg-[var(--input-dark)] border border-[var(--border-dark)]
      text-white placeholder:text-[var(--placeholder-dark)]
      focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20
      outline-none transition-all duration-200
    "
  />
  <p className="text-xs text-[var(--muted-cream)]">Be specific — city, area or neighbourhood works best for finding local competitors</p>
</div>

          {/* Language */}
          <div className="space-y-2.5">
            <Label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
              <Languages className="w-4 h-4 text-amber-400" />
              Language
            </Label>
            <Select value={data.language} onValueChange={(v) => updateField('language', v)}>
              <SelectTrigger
                className="
                  h-12 bg-[var(--input-dark)] border-[var(--border-dark)]
                  text-white focus:border-amber-400/60 focus:ring-amber-400/20
                  transition-all duration-200 rounded-xl text-base
                "
              >
                <SelectValue placeholder="Primary language?" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1F] border-[var(--border-dark)] text-white">
                {languages.map((lang) => (
                  <SelectItem
                    key={lang}
                    value={lang}
                    className="text-white focus:bg-amber-400/10 focus:text-amber-400"
                  >
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={className}>{children}</label>
}
