'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { StepCompany } from './step-company'
import { StepAudience } from './step-audience'
import { StepCompetitors } from './step-competitors'
import { StepGoals } from './step-goals'
import { StepModules } from './step-modules'
import { SuccessScreen } from './success-screen'
import { ArrowLeft, ArrowRight, Rocket, Loader2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

const steps = [
  { title: 'Company', subtitle: 'The basics' },
  { title: 'Audience', subtitle: 'Who you reach' },
  { title: 'Competitors', subtitle: 'Your arena' },
  { title: 'Goals', subtitle: 'What matters' },
  { title: 'Modules', subtitle: 'What we build' },
]

const slideVariants = {
  enter: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? -300 : 300,
    opacity: 0,
  }),
}

export function OnboardingWizard() {
  const {
    step,
    data,
    direction,
    isSubmitting,
    isComplete,
    setStep,
    setSubmitting,
    setComplete,
  } = useOnboardingStore()
  const router = useRouter()

  const validateStep = (s: number): boolean => {
    switch (s) {
      case 0:
        return !!(data.company_name.trim() && data.website_url.trim() && data.industry)
      case 1:
        return !!(data.target_audience.trim() && data.customer_type)
      case 2:
        return true
      case 3:
        return !!(data.primary_goal && data.products.length > 0)
      case 4:
        return data.active_modules.length > 0
      default:
        return false
    }
  }

  const canProceed = validateStep(step)
  const isLastStep = step === 4

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit()
    } else {
      setStep(step + 1, 'forward')
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1, 'backward')
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        localStorage.setItem('profile_id', result.profile_id)
        localStorage.setItem('company_name', data.company_name)
        localStorage.setItem('active_modules', JSON.stringify(data.active_modules))
        setComplete(true)
      }
    } catch {
      setComplete(true)
    } finally {
      setSubmitting(false)
    }
  }

  const stepProgress = ((step + 1) / steps.length) * 100

  const getStepStatus = (idx: number): 'completed' | 'active' | 'upcoming' => {
    if (idx < step) return 'completed'
    if (idx === step) return 'active'
    return 'upcoming'
  }

  if (isComplete) {
    return <SuccessScreen />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e8e6e3] flex flex-col">
      <header className="shrink-0 px-6 md:px-10 py-5 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Tejovex AI" className="h-8 w-auto object-contain brightness-150 contrast-125" />
          </div>
          <button
            onClick={() => router.push('/home')}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.03]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Home
          </button>
        </div>
        <span className="text-xs text-neutral-600 hidden sm:block">
          Step {step + 1} of {steps.length}
        </span>
      </header>

      {/* Progress Timeline */}
      <div className="shrink-0 px-6 md:px-10 mb-2">
        <div className="flex items-center gap-0 relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/[0.06] -translate-y-1/2" />
          <motion.div
            className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-neutral-400 to-neutral-200 -translate-y-1/2"
            initial={false}
            animate={{ width: `${stepProgress}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          {steps.map((s, idx) => {
            const status = getStepStatus(idx)
            return (
              <div key={idx} className="flex-1 flex flex-col items-center relative z-10">
                <motion.button
                  type="button"
                  onClick={() => {
                    if (idx < step) setStep(idx, idx < step ? 'backward' : 'forward')
                  }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                    ${status === 'completed'
                      ? 'bg-neutral-200 text-[#0a0a0c] cursor-pointer hover:scale-110'
                      : status === 'active'
                      ? 'bg-neutral-800 text-neutral-200 ring-2 ring-neutral-500/30'
                      : 'bg-[#0f0f12] text-neutral-600 border border-white/[0.06]'}
                  `}
                  whileHover={status === 'completed' ? { scale: 1.1 } : {}}
                  whileTap={status === 'completed' ? { scale: 0.95 } : {}}
                >
                  {status === 'completed' ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </motion.button>
                <span className={`text-[10px] mt-1.5 font-medium transition-colors duration-300 hidden sm:block ${
                  status === 'active' ? 'text-neutral-300' : status === 'completed' ? 'text-neutral-400' : 'text-neutral-700'
                }`}>
                  {s.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main content area */}
      <main className="flex-1 flex flex-col px-6 md:px-10 overflow-hidden">
        <div className="flex-1 overflow-y-auto py-6 md:py-8">
          <div className="max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {step === 0 && <StepCompany />}
                {step === 1 && <StepAudience />}
                {step === 2 && <StepCompetitors />}
                {step === 3 && <StepGoals />}
                {step === 4 && <StepModules />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="shrink-0 py-5 flex items-center justify-between max-w-2xl mx-auto w-full">
          <div>
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors duration-200 px-4 py-2.5 rounded-xl hover:bg-white/[0.03]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div className="w-[88px]" />
            )}
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className={`
              flex items-center gap-2 text-sm font-semibold
              px-6 py-3 rounded-xl transition-all duration-300
              ${canProceed && !isSubmitting
                ? 'bg-neutral-200 text-[#0a0a0c] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-[#0f0f12] text-neutral-600 border border-white/[0.06] cursor-not-allowed'}
            `}
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Launching...</>
            ) : isLastStep ? (
              <>Launch<Rocket className="w-4 h-4" /></>
            ) : (
              <>Continue<ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
