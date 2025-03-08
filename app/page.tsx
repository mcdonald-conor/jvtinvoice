import { QuoteForm } from "@/components/quote-form"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">KM Joinery Quote Generator</h1>
      <QuoteForm />
    </main>
  )
}
