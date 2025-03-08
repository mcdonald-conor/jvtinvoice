import jsPDF from "jspdf"

interface DocumentData {
  documentType: 'quote' | 'invoice'
  quoteNumber: string
  quoteDate: string
  customerName: string
  customerAddress: string[]
  companyName: string
  companyAddress: string[]
  companyContact: string
  companyEmail: string
  companyWebsite: string
  description: string
  amount: string
}

export async function generatePDF(data: DocumentData): Promise<Blob> {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const isInvoice = data.documentType === 'invoice';
  const documentTypeUpper = isInvoice ? "INVOICE" : "QUOTE";
  const documentNumberLabel = isInvoice ? "INVOICE NUMBER" : "QUOTE NUMBER";
  const documentDateLabel = isInvoice ? "INVOICE DATE" : "QUOTE DATE";

  // Set font
  doc.setFont("helvetica")

  // Add company name at the top
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text(data.companyName, 20, 20)

  // Add document type heading
  doc.setFontSize(16)
  doc.text(documentTypeUpper, 20, 30)

  // Create a table for document details
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")

  // Document number and date headers
  doc.text(documentNumberLabel, 20, 40)
  doc.text(documentDateLabel, 70, 40)

  // Document number and date values
  doc.setFont("helvetica", "normal")
  doc.text(data.quoteNumber, 20, 45)
  doc.text(data.quoteDate, 70, 45)

  // Customer and company info headers
  doc.setFont("helvetica", "bold")
  doc.text("PREPARED FOR", 20, 55)
  doc.text("PREPARED BY", 70, 55)
  doc.text("CONTACT", 140, 55)

  // Customer info
  doc.setFont("helvetica", "normal")
  doc.text(data.customerName, 20, 60)

  // Customer address
  let yPos = 65
  data.customerAddress.forEach((line) => {
    doc.text(line, 20, yPos)
    yPos += 5
  })

  // Company info
  doc.text(data.companyName, 70, 60)

  // Company address
  yPos = 65
  data.companyAddress.forEach((line) => {
    doc.text(line, 70, yPos)
    yPos += 5
  })

  // Contact info
  doc.text(data.companyContact, 140, 60)
  doc.text(data.companyEmail, 140, 65)
  doc.text(data.companyWebsite, 140, 70)

  // Line separator
  doc.setDrawColor(220, 220, 220)
  doc.line(20, 85, 190, 85)

  // Description and amount headers
  doc.setFont("helvetica", "bold")
  doc.text("DESCRIPTION", 20, 95)
  doc.text("AMOUNT", 160, 95)

  // Description and amount values
  doc.setFont("helvetica", "normal")
  doc.text(data.description, 20, 105)
  doc.text(`£${data.amount}`, 160, 105)

  // Line separator
  doc.line(20, 115, 190, 115)

  // Subtotal
  doc.setFont("helvetica", "bold")
  doc.text("SUBTOTAL", 130, 125)
  doc.setFont("helvetica", "normal")
  doc.text(`£${data.amount}`, 160, 125)

  // Total
  doc.setFont("helvetica", "bold")
  doc.text("TOTAL", 130, 135)
  doc.text(`£${data.amount}`, 160, 135)

  // Add payment terms for invoice
  if (isInvoice) {
    doc.setFont("helvetica", "bold")
    doc.text("PAYMENT TERMS", 20, 150)
    doc.setFont("helvetica", "normal")
    doc.text("Payment due within 30 days of invoice date", 20, 155)

    // Payment details
    doc.setFont("helvetica", "bold")
    doc.text("PAYMENT DETAILS", 20, 165)
    doc.setFont("helvetica", "normal")
    doc.text("Please make payment to:", 20, 170)
    doc.text("Account Name: KM Joinery", 20, 175)
    doc.text("Sort Code: 00-00-00", 20, 180)
    doc.text("Account Number: 00000000", 20, 185)
    doc.text("Reference: " + data.quoteNumber, 20, 190)
  }

  // Footer
  const footerText = `${data.companyName}`
  const contactText = `Tel: ${data.companyContact} | ${data.companyEmail} | www.${data.companyWebsite}`

  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text(footerText, 105, 270, { align: "center" })
  doc.setFont("helvetica", "normal")
  doc.text(contactText, 105, 275, { align: "center" })

  // Return the PDF as a blob
  return doc.output("blob")
}

// For backward compatibility
export async function generateQuotePDF(data: Omit<DocumentData, 'documentType'>): Promise<Blob> {
  return generatePDF({ ...data, documentType: 'quote' });
}
