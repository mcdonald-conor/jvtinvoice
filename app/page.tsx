'use client';

import Image from "next/image"
import dynamic from "next/dynamic"
import ErrorBoundary from "@/components/error-boundary"

// Use dynamic import with SSR disabled for components that use browser APIs
const QuoteFormWithNoSSR = dynamic(
  () => import('@/components/quote-form').then(mod => mod.QuoteForm),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="container mx-auto py-4 px-4 max-w-5xl">
      <div className="flex justify-center mb-8">
        <Image
          src="/logo.png"
          alt="JVT Plastering Logo"
          width={200}
          height={200}
          className="rounded-lg"
          priority
        />
      </div>
      <ErrorBoundary>
        <QuoteFormWithNoSSR />
      </ErrorBoundary>
    </main>
  )
}
