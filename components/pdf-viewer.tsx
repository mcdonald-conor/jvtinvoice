"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Printer, Share2 } from "lucide-react"
import { isBrowser, isMobileDevice, safeWindow } from "@/lib/browser-utils"
import { useToast } from "@/components/ui/use-toast"

interface PDFViewerProps {
  pdfBlob: Blob
  documentType?: 'quote' | 'invoice'
  quoteNumber?: string
}

export function PDFViewer({ pdfBlob, documentType = 'quote', quoteNumber = '' }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    if (!isBrowser) return;

    // Create a URL for the blob
    const url = URL.createObjectURL(pdfBlob)
    setPdfUrl(url)

    // Clean up the URL when the component unmounts
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [pdfBlob])

  const handleDownload = () => {
    if (!isBrowser) return;

    const link = document.createElement("a")
    link.href = pdfUrl
    const documentTypeCapitalized = documentType.charAt(0).toUpperCase() + documentType.slice(1)

    // Use the quote number for the filename if available, otherwise use a default name
    const filename = quoteNumber
      ? `${quoteNumber}.pdf`
      : `KM-Joinery-${documentTypeCapitalized}.pdf`

    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show a toast message with sharing instructions for mobile devices
    if (isMobileDevice()) {
      toast({
        title: "PDF Downloaded",
        description: "You can share this PDF using your device's native sharing options from your Files app.",
        duration: 5000,
      })
    }
  }

  const handlePrint = () => {
    if (!isBrowser) return;

    const window = safeWindow();
    if (!window) return;

    const printWindow = window.open(pdfUrl, '_blank')
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print()
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap justify-end mb-2 gap-2">
        <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Print</span>
        </Button>

        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">Download</span>
        </Button>
      </div>
      <div className="flex-1 bg-white rounded-lg overflow-hidden border" style={{ minHeight: '60vh', WebkitOverflowScrolling: 'touch' }}>
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title="PDF Preview"
            style={{
              height: '100%',
              minHeight: '60vh',
              maxHeight: '70vh',
              overflowY: 'scroll',
              WebkitOverflowScrolling: 'touch'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading PDF preview...</p>
          </div>
        )}
      </div>
    </div>
  )
}
