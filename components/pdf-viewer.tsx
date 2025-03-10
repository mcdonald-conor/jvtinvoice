"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Printer, Share2, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isBrowser, isMobileDevice, safeNavigator, safeWindow } from "@/lib/browser-utils"

interface PDFViewerProps {
  pdfBlob: Blob
  documentType?: 'quote' | 'invoice'
}

export function PDFViewer({ pdfBlob, documentType = 'quote' }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState(false)
  const phoneInputRef = useRef<HTMLInputElement>(null)

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
    link.download = `KM-Joinery-${documentTypeCapitalized}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  const handleWhatsAppShare = async (phoneNum?: string) => {
    if (!isBrowser) return;

    try {
      const documentTypeCapitalized = documentType.charAt(0).toUpperCase() + documentType.slice(1)
      const isMobile = isMobileDevice();

      // Different messages for mobile vs desktop
      const message = `Here's your KM Joinery ${documentTypeCapitalized}.`
      const encodedMessage = encodeURIComponent(message)

      const window = safeWindow();
      if (!window) return;

      // If we have a phone number, use it
      if (phoneNum) {
        // Format the phone number (remove spaces, +, etc.)
        const formattedPhone = phoneNum.replace(/\D/g, '')
        // Use wa.me for both mobile and desktop
        window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank')
        return
      }

      const navigator = safeNavigator();
      // Try to use the Web Share API for mobile devices
      if (navigator?.share && pdfBlob && isMobile) {
        try {
          const file = new File([pdfBlob], `KM-Joinery-${documentTypeCapitalized}.pdf`, { type: 'application/pdf' })
          await navigator.share({
            title: `KM Joinery ${documentTypeCapitalized}`,
            text: "Here's your document",
            files: [file]
          })
          return
        } catch (shareError) {
          console.error("Error using Web Share API:", shareError)
          // Fall through to the next option
        }
      }

      // Always use wa.me instead of web.whatsapp.com
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error)
      // Fallback to direct WhatsApp link
      const message = `Here's your KM Joinery ${documentType}.`
      const encodedMessage = encodeURIComponent(message)
      const window = safeWindow();
      if (window) {
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
      }
    }
  }

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleWhatsAppShare(phoneNumber)
    setIsWhatsAppDialogOpen(false)
    setPhoneNumber("")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap justify-end mb-2 gap-2">
        <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Print</span>
        </Button>

        <Dialog open={isWhatsAppDialogOpen} onOpenChange={setIsWhatsAppDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share via WhatsApp</span>
              <span className="sm:hidden">Share</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share via WhatsApp</DialogTitle>
              <DialogDescription>
                Enter a phone number to share directly, or leave blank to share through your WhatsApp.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePhoneSubmit}>
              <div className="flex items-center space-x-2 py-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="phone" className="sr-only">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    ref={phoneInputRef}
                    placeholder="+44 7123 456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                    type="tel"
                    inputMode="tel"
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsWhatsAppDialogOpen(false)
                    handleWhatsAppShare()
                  }}
                >
                  Share with My WhatsApp
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!phoneNumber.trim()}
                >
                  Share to Number
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
