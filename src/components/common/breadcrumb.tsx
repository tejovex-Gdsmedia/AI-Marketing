import React from 'react'
import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/30"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          )}

          {item.href && !item.active ? (
            <Link
              href={item.href}
              className="text-white/60 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={
                item.active
                  ? 'text-amber-400 font-medium'
                  : 'text-white/60'
              }
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
