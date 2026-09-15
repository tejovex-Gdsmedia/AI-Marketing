'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { Crosshair, Package, Plus, X } from 'lucide-react'
import { useState, KeyboardEvent } from 'react'

const goals = [
  {
    value: 'leads',
    label: 'Generate More Leads',
    desc: 'Fill the pipeline with qualified prospects',
    icon: '◆',
  },
  {
    value: 'brand',
    label: 'Build Brand Awareness',
    desc: 'Get more eyes on your brand and story',
    icon: '○',
  },
  {
    value: 'conversion',
    label: 'Improve Conversions',
    desc: 'Turn more visitors into paying customers',
    icon: '■',
  },
  {
    value: 'retention',
    label: 'Boost Retention',
    desc: 'Keep customers engaged and coming back',
    icon: '▲',
  },
]

export function StepGoals() {
  const { data, updateField } = useOnboardingStore()
  const [tagInput, setTagInput] = useState('')

  const addProduct = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !data.products.includes(trimmed) && data.products.length < 15) {
      updateField('products', [...data.products, trimmed])
      setTagInput('')
    }
  }

  const removeProduct = (product: string) => {
    updateField('products', data.products.filter((p) => p !== product))
  }

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addProduct()
    }
    if (e.key === 'Backspace' && tagInput === '' && data.products.length > 0) {
      removeProduct(data.products[data.products.length - 1])
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
          What are you after?
        </h2>
        <p className="text-[var(--muted-cream)] text-sm sm:text-base leading-relaxed">
          Pick the goal that matters most right now — this shapes everything we build for you.
        </p>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {goals.map((goal) => (
          <button
            key={goal.value}
            type="button"
            onClick={() => updateField('primary_goal', goal.value)}
            className={`
              relative p-5 rounded-2xl border-2 text-left transition-all duration-300
              group overflow-hidden
              ${
                data.primary_goal === goal.value
                  ? 'border-amber-400 bg-gradient-to-br from-amber-400/15 to-amber-400/5 shadow-[0_0_30px_rgba(245,158,11,0.12)]'
                  : 'border-[var(--border-dark)] bg-[var(--input-dark)] hover:border-amber-400/30 hover:bg-amber-400/5'
              }
            `}
          >
            {/* Background number */}
            <span className="absolute -right-2 -top-3 text-[5rem] font-black leading-none select-none transition-colors duration-300
              {data.primary_goal === goal.value ? 'text-amber-400/8' : 'text-white/[0.02]'}
            ">
              {goal.icon}
            </span>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-lg ${data.primary_goal === goal.value ? 'text-amber-400' : 'text-white/40'} transition-colors`}>
                  {goal.icon}
                </span>
                <span className={`font-semibold text-sm transition-colors ${data.primary_goal === goal.value ? 'text-amber-400' : 'text-white'}`}>
                  {goal.label}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-cream)] leading-relaxed">{goal.desc}</p>
            </div>
            {data.primary_goal === goal.value && (
              <motion.div
                layoutId="goalIndicator"
                className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-amber-400"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Products / Services Tag Input */}
      <div className="space-y-3">
        <label className="text-[var(--label-cream)] text-sm font-medium flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-400" />
          Products or Services <span className="text-amber-400">*</span>
        </label>
        <p className="text-xs text-[var(--muted-cream)]">Press Enter or comma to add. These become keywords for your content and ads.</p>

        <div className="
          min-h-[52px] bg-[var(--input-dark)] border-2 border-[var(--border-dark)] rounded-xl
          px-3 py-2.5 flex flex-wrap gap-2 items-center
          focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-400/20
          transition-all duration-200
        ">
          <AnimatePresence>
            {data.products.map((product) => (
              <motion.span
                key={product}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                  bg-amber-400/15 text-amber-400 text-xs font-medium
                  border border-amber-400/20
                "
              >
                {product}
                <button
                  type="button"
                  onClick={() => removeProduct(product)}
                  className="hover:bg-amber-400/30 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => {
              if (e.target.value.endsWith(',')) {
                setTagInput(e.target.value.slice(0, -1))
                setTimeout(addProduct, 0)
              } else {
                setTagInput(e.target.value)
              }
            }}
            onKeyDown={handleTagKeyDown}
            placeholder={data.products.length === 0 ? 'e.g. Email Marketing Suite, Analytics Dashboard...' : 'Add another...'}
            className="
              flex-1 min-w-[120px] bg-transparent text-white text-sm
              placeholder:text-[var(--placeholder-dark)] outline-none
            "
          />
        </div>
        {data.products.length > 0 && (
          <p className="text-xs text-[var(--muted-cream)]">{data.products.length} product{data.products.length !== 1 ? 's' : ''} added</p>
        )}
      </div>
    </motion.div>
  )
}
