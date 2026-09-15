'use client'

import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { Building2, Globe, Layers, Users } from 'lucide-react'
import { useState } from 'react'

const industries = [
  'Digital Marketing Agency',
  'SEO / Content Agency',
  'Social Media Agency',
  'Web Development Agency',
  'SaaS / Software Product',
  'E-commerce / Retail',
  'Watch / Jewellery Retail',
  'Healthcare / Wellness',
  'Finance / Fintech',
  'Education / EdTech',
  'Real Estate',
  'Professional Services',
  'Manufacturing',
  'Media / Entertainment',
  'Travel / Hospitality',
  'Food & Beverage',
  'Non-Profit',
  'Other',
]

const companySizes = [
  '1-10 (Startup)',
  '11-50 (Growing)',
  '51-200 (Mid-size)',
  '201-1000 (Enterprise)',
  '1000+ (Large Enterprise)',
]

export function StepCompany() {
  const { data, updateField } = useOnboardingStore()
  const [showCustomIndustry, setShowCustomIndustry] = useState(false)

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
          Tell us about your company
        </h2>
        <p className="text-[var(--muted-cream)] text-sm sm:text-base leading-relaxed">
          The basics we need to understand your brand and where you fit in the market.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Company Name */}
        <div className="group space-y-2.5">
          <Label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            Company Name <span className="text-amber-400">*</span>
          </Label>
          <Input
            placeholder="Acme Inc."
            value={data.company_name}
            onChange={(e) => updateField('company_name', e.target.value)}
            className="
              h-12 bg-[var(--input-dark)] border-[var(--border-dark)]
              text-white placeholder:text-[var(--placeholder-dark)]
              focus:border-amber-400/60 focus:ring-amber-400/20
              transition-all duration-200 rounded-xl text-base
            "
          />
        </div>

        {/* Website URL */}
        <div className="group space-y-2.5">
          <Label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            Website URL <span className="text-amber-400">*</span>
          </Label>
          <Input
            placeholder="https://acme.com"
            type="url"
            value={data.website_url}
            onChange={(e) => updateField('website_url', e.target.value)}
            className="
              h-12 bg-[var(--input-dark)] border-[var(--border-dark)]
              text-white placeholder:text-[var(--placeholder-dark)]
              focus:border-amber-400/60 focus:ring-amber-400/20
              transition-all duration-200 rounded-xl text-base
            "
          />
          {data.website_url && !data.website_url.startsWith('https://') && (
            <p className="text-xs text-amber-400/80 mt-1">Please use https:// prefix</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
{/* Industry */}
<div className="space-y-2.5">
  <Label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
    <Layers className="w-4 h-4 text-amber-400" />
    Industry <span className="text-amber-400">*</span>
  </Label>
  <Select
    value={showCustomIndustry ? 'Other' : data.industry}
    onValueChange={(v) => {
      if (v === 'Other') {
        setShowCustomIndustry(true)
        updateField('industry', '')
      } else {
        setShowCustomIndustry(false)
        updateField('industry', v)
      }
    }}
  >
    <SelectTrigger
      className="
        h-12 bg-[var(--input-dark)] border-[var(--border-dark)]
        text-white focus:border-amber-400/60 focus:ring-amber-400/20
        transition-all duration-200 rounded-xl text-base
      "
    >
      <SelectValue placeholder="Pick your industry" />
    </SelectTrigger>
    <SelectContent className="bg-[#1A1A1F] border-[var(--border-dark)] text-white">
      {industries.map((ind) => (
        <SelectItem
          key={ind}
          value={ind}
          className="text-white focus:bg-amber-400/10 focus:text-amber-400"
        >
          {ind}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  {/* Show text input when Other is selected */}
  {showCustomIndustry && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Input
        placeholder="e.g. Digital Marketing Agency, Watch Retail Store..."
        value={data.industry}
        onChange={(e) => updateField('industry', e.target.value)}
        className="
          h-12 bg-[var(--input-dark)] border-[var(--border-dark)]
          text-white placeholder:text-[var(--placeholder-dark)]
          focus:border-amber-400/60 focus:ring-amber-400/20
          transition-all duration-200 rounded-xl text-base mt-2
        "
        autoFocus
      />
      <p className="text-xs text-white/40 mt-1">
        Type your exact industry for better competitor matching
      </p>
    </motion.div>
  )}
</div>

          {/* Company Size */}
          <div className="space-y-2.5">
            <Label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Company Size
            </Label>
            <Select value={data.company_size} onValueChange={(v) => updateField('company_size', v)}>
              <SelectTrigger
                className="
                  h-12 bg-[var(--input-dark)] border-[var(--border-dark)]
                  text-white focus:border-amber-400/60 focus:ring-amber-400/20
                  transition-all duration-200 rounded-xl text-base
                "
              >
                <SelectValue placeholder="How big is your team?" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1F] border-[var(--border-dark)] text-white">
                {companySizes.map((size) => (
                  <SelectItem
                    key={size}
                    value={size}
                    className="text-white focus:bg-amber-400/10 focus:text-amber-400"
                  >
                    {size}
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