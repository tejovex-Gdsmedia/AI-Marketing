'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setError('Please fill all fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    router.push('/home')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e8e6e3] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2 mb-10 text-neutral-200 hover:text-white transition-colors">
          <img src="/logo.png" alt="Tejovex AI" className="h-8 w-auto object-contain" />
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight mb-2">Create account</h1>
        <p className="text-sm text-neutral-500 mb-8">Start analyzing your marketing today.</p>

        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full h-12 px-4 rounded-xl bg-[#111113] border border-white/[0.08] text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 text-sm transition-colors"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-12 px-4 rounded-xl bg-[#111113] border border-white/[0.08] text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 text-sm transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
            className="w-full h-12 px-4 rounded-xl bg-[#111113] border border-white/[0.08] text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 text-sm transition-colors"
          />

          {error && (
            <div className="text-xs text-red-400 bg-red-400/5 border border-red-400/10 rounded-xl px-3 py-2.5">
              {error}
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-neutral-200 text-[#0a0a0c] font-semibold text-sm hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {loading ? 'Creating account...' : <>Create account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>

        <p className="text-xs text-neutral-500 mt-8 text-center">
          Already have an account? <Link href="/login" className="text-neutral-300 hover:text-white transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
