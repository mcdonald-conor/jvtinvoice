import { QuoteForm } from "@/components/quote-form"
import Image from "next/image"

export default function Home() {
  return (
    <main className="container mx-auto py-4 px-4 max-w-5xl">
      <div className="flex justify-center mb-4">
        <Image
          src="/logo.png"
          alt="KM Joinery Logo"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">KM Joinery Document Generator</h1>
      <QuoteForm />
    </main>
  )
}
