import { create } from 'zustand'

export interface OnboardingData {
  // Step 1 - Company Basics
  company_name: string
  website_url: string
  industry: string
  company_size: string
  // Step 2 - Audience
  target_audience: string
  customer_type: string
  geography: string
  language: string
  // Step 3 - Competitors
  competitor_urls: string[]
  auto_discover: boolean
  // Step 4 - Goals & Products
  primary_goal: string
  products: string[]
  // Step 5 - Modules & Preferences
  active_modules: string[]
  content_tone: string
  platforms: string[]
}

interface OnboardingStore {
  step: number
  data: OnboardingData
  direction: 'forward' | 'backward'
  isSubmitting: boolean
  isComplete: boolean
  setStep: (step: number, direction: 'forward' | 'backward') => void
  updateField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void
  setSubmitting: (v: boolean) => void
  setComplete: (v: boolean) => void
  reset: () => void
}

const initialData: OnboardingData = {
  company_name: '',
  website_url: '',
  industry: '',
  company_size: '',
  target_audience: '',
  customer_type: '',
  geography: '',
  language: '',
  competitor_urls: ['', '', '', '', ''],
  auto_discover: false,
  primary_goal: '',
  products: [],
  active_modules: [],
  content_tone: '',
  platforms: [],
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 0,
  data: initialData,
  direction: 'forward',
  isSubmitting: false,
  isComplete: false,
  setStep: (step, direction) => set({ step, direction }),
  updateField: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),
  setSubmitting: (v) => set({ isSubmitting: v }),
  setComplete: (v) => set({ isComplete: v }),
  reset: () => set({ step: 0, data: initialData, direction: 'forward', isSubmitting: false, isComplete: false }),
}))
