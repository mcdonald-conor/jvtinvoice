"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PDFViewerProps {
  pdfBlob: Blob
  documentType?: 'quote' | 'invoice'
}

export function PDFViewer({ pdfBlob, documentType = 'quote' }: PDFViewerProps) {
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
    const documentTypeCapitalized = documentType.charAt(0).toUpperCase() + documentType.slice(1)
    link.download = `KM-Joinery-${documentTypeCapitalized}.pdf`
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
        {pdfUrl ? (
          <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading PDF preview...</p>
          </div>
        )}
      </div>
    </div>
  )
}
