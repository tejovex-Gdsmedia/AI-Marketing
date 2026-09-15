'use client'

import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { Swords, Sparkles, Plus, X, Search } from 'lucide-react'

export function StepCompetitors() {
  const { data, updateField } = useOnboardingStore()

  const updateUrl = (index: number, value: string) => {
    const updated = [...data.competitor_urls]
    updated[index] = value
    updateField('competitor_urls', updated)
  }

  const addUrl = () => {
    if (data.competitor_urls.filter(Boolean).length < 5) {
      const emptyIdx = data.competitor_urls.findIndex((u) => u === '')
      if (emptyIdx === -1) {
        updateField('competitor_urls', [...data.competitor_urls, ''])
      }
    }
  }

  const filledCount = data.competitor_urls.filter(Boolean).length

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
          Who&apos;s in your arena?
        </h2>
        <p className="text-[var(--muted-cream)] text-sm sm:text-base leading-relaxed">
          Knowing your competition helps us find gaps and opportunities you can own.
        </p>
      </div>

      <div className="grid gap-4">
        {data.competitor_urls.map((url, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs font-mono text-[var(--muted-cream)] w-5 text-right shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--placeholder-dark)]" />
              <Input
                placeholder="https://competitor.com"
                type="url"
                value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                className="
                  h-11 bg-[var(--input-dark)] border-[var(--border-dark)]
                  text-white placeholder:text-[var(--placeholder-dark)]
                  focus:border-amber-400/60 focus:ring-amber-400/20
                  transition-all duration-200 rounded-xl text-sm pl-10
                "
              />
            </div>
            {i > 0 && url && (
              <button
                type="button"
                onClick={() => updateUrl(i, '')}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--muted-cream)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}

        {filledCount < 5 && (
          <button
            type="button"
            onClick={addUrl}
            className="
              flex items-center gap-2 text-sm text-amber-400/70 hover:text-amber-400
              transition-colors duration-200 py-2 px-1 group
            "
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            Add another competitor ({5 - filledCount} remaining)
          </button>
        )}
      </div>

      {/* Auto-Discover Toggle */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-dark)] bg-gradient-to-br from-[#1A1A1F] to-[#14141A] p-6">
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                Auto-discover competitors
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-400 uppercase tracking-wider">
                  Smart
                </span>
              </h4>
              <p className="text-[var(--muted-cream)] text-xs leading-relaxed">
                We&apos;ll search the web and analyze your industry to find competitors you might have missed.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={data.auto_discover}
            onClick={() => updateField('auto_discover', !data.auto_discover)}
            className={`
              relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full
              transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50
              ${data.auto_discover ? 'bg-amber-400' : 'bg-white/10'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg
                transition-transform duration-300 ease-in-out mt-1 ml-1
                ${data.auto_discover ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>
        {data.auto_discover && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-amber-400/70 mt-3 ml-[3.25rem]"
          >
            <Swords className="w-3 h-3 inline mr-1.5 -mt-0.5" />
            We&apos;ll run a deep competitive analysis after you finish setup.
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
