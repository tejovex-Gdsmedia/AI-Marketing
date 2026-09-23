'use client'

import AnimatedGradient from '@/components/ui/animated-gradient'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">

      <AnimatedGradient
        config={{
          preset: "custom",
          color1: "#0a0a1a",
          color2: "#1a1050",
          color3: "#050510",
          swirl: 40,
          swirlIterations: 6,
          softness: 100,
          speed: 15,
          distortion: 3,
          scale: 0.5,
          proportion: 45,
          rotation: -20,
          shape: "Checks",
          shapeSize: 35,
          offset: 0,
        }}
        noise={{ opacity: 0.15, scale: 1 }}
      />

      <div className="relative z-10 min-h-screen">
        {children}
      </div>

    </div>
  )
}