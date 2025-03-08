"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PDFViewerProps {
  pdfBlob: Blob
}

export function PDFViewer({ pdfBlob }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("")

  useEffect(() => {
    // Create a URL for the blob
    const url = URL.createObjectURL(pdfBlob)
    setPdfUrl(url)

    // Clean up the URL when the component unmounts
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [pdfBlob])

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = "KM-Joinery-Quote.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-2">
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div className="flex-1 bg-white rounded-lg overflow-hidden border">
        <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
      </div>
    </div>
  )
}

