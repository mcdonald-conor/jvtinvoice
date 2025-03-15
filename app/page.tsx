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
      <div className="flex justify-center mb-4">
        <Image
          src="/logo.png"
          alt="JVT Plastering Logo"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">JVT Plastering Document Generator</h1>
      <ErrorBoundary>
        <QuoteFormWithNoSSR />
      </ErrorBoundary>
    </main>
  )
}
