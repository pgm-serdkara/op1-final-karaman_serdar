"use client"

import React from 'react'
import { usePathname } from 'next/navigation'

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isBooksRoot = pathname === '/books' || pathname === '/books/'

  if (isBooksRoot) return <>{children}</>

  return <div className="page-container">{children}</div>
}
