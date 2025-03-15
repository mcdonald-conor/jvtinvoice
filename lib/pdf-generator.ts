import jsPDF from "jspdf"

interface ServiceItem {
  description: string;
  amount: string;
}

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
  services: ServiceItem[]
}

export async function generatePDF(data: DocumentData): Promise<{ blob: Blob, filename: string }> {
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

  // Generate a filename based on the quote number
  const filename = `${data.quoteNumber}.pdf`;

  // Set font
  doc.setFont("helvetica")

  // Add document type heading
  doc.setFontSize(16)
  doc.setTextColor(92, 107, 115) // Gray-blue color for the heading
  doc.setFont("helvetica", "bold")
  doc.text(documentTypeUpper, 20, 30)

  // Add KM logo - using PNG format
  try {
    // Load the logo image (using a relative path to the public directory)
    const logoPath = '/logo.png';
    doc.addImage(logoPath, 'PNG', 150, 10, 40, 40);
  } catch (error) {
    console.error("Error adding logo:", error);
  }

  // Create a table for document details
  doc.setFontSize(10)
  doc.setTextColor(92, 107, 115) // Gray-blue color
  doc.setFont("helvetica", "bold")

  // Document number and date headers
  doc.text(documentNumberLabel, 20, 40)
  doc.text(documentDateLabel, 70, 40)

  // Document number and date values
  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0) // Black color for values
  doc.text(data.quoteNumber, 20, 45)
  doc.text(data.quoteDate, 70, 45)

  // Customer and company info headers
  doc.setFont("helvetica", "bold")
  doc.setTextColor(92, 107, 115) // Gray-blue color
  doc.text("PREPARED FOR", 20, 55)
  doc.text("PREPARED BY", 70, 55)
  doc.text("CONTACT", 140, 55)

  // Customer info
  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0) // Black color for values
  doc.text(data.customerName, 20, 60)

  // Customer address
  let customerYPos = 65
  data.customerAddress.forEach((line) => {
    doc.text(line, 20, customerYPos)
    customerYPos += 5
  })

  // Company info
  doc.text(data.companyName, 70, 60)

  // Company address
  let companyYPos = 65
  data.companyAddress.forEach((line) => {
    doc.text(line, 70, companyYPos)
    companyYPos += 5
  })

  // Contact info
  doc.text(data.companyContact, 140, 60)
  doc.text(data.companyEmail, 140, 65)
  doc.text(data.companyWebsite, 140, 70)

  // Line separator
  doc.setDrawColor(220, 220, 220)
  doc.line(20, 85, 190, 85)

  // Description section with background
  // First, draw the background rectangle
  doc.setFillColor(245, 247, 250) // Light gray background color

  // Calculate the height needed for all services (base height + additional height per service)
  const baseHeight = 30;
  const heightPerService = 10;
  const totalHeight = baseHeight + (data.services.length - 1) * heightPerService;

  doc.rect(20, 90, 170, totalHeight, 'F') // x, y, width, height, style ('F' = fill)

  // Description and amount headers
  doc.setFont("helvetica", "bold")
  doc.setTextColor(92, 107, 115) // Gray-blue color
  doc.text("DESCRIPTION", 25, 95)
  doc.text("AMOUNT", 160, 95)

  // Line separator within the description box
  doc.setDrawColor(220, 220, 220)
  doc.line(20, 100, 190, 100)

  // Description and amount values
  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0) // Black color for values

  // Add each service item
  let yPos = 105;
  let totalAmount = 0;

  data.services.forEach((service, index) => {
    doc.text(service.description, 25, yPos);
    doc.text(`£${service.amount}`, 160, yPos);

    // Add to total amount
    totalAmount += parseFloat(service.amount) || 0;

    // Move to next line for next service
    yPos += 10;
  });

  // Line separator
  doc.setDrawColor(220, 220, 220)
  doc.line(20, 90 + totalHeight + 5, 190, 90 + totalHeight + 5)

  // Subtotal
  doc.setFont("helvetica", "bold")
  doc.setTextColor(92, 107, 115) // Gray-blue color
  doc.text("SUBTOTAL", 130, 90 + totalHeight + 15)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0) // Black color for values
  doc.text(`£${totalAmount.toFixed(2)}`, 160, 90 + totalHeight + 15)

  // Total
  doc.setFont("helvetica", "bold")
  doc.setTextColor(92, 107, 115) // Gray-blue color
  doc.text("TOTAL", 130, 90 + totalHeight + 25)
  doc.setTextColor(0, 0, 0) // Black color for values
  doc.text(`£${totalAmount.toFixed(2)}`, 160, 90 + totalHeight + 25)

  // Add payment terms for invoice
  if (isInvoice) {
    doc.setFont("helvetica", "bold")
    doc.setTextColor(92, 107, 115) // Gray-blue color
    doc.text("PAYMENT TERMS", 20, 90 + totalHeight + 35)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0) // Black color for values
    doc.text("Payment due within 30 days of invoice date", 20, 90 + totalHeight + 40)

    // Payment details
    doc.setFont("helvetica", "bold")
    doc.setTextColor(92, 107, 115) // Gray-blue color
    doc.text("PAYMENT DETAILS", 20, 90 + totalHeight + 50)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0) // Black color for values
    doc.text("Please make payment to:", 20, 90 + totalHeight + 55)
    doc.text("Account Name: JVT Plastering", 20, 90 + totalHeight + 60)
    doc.text("Sort Code: 00-00-00", 20, 90 + totalHeight + 65)
    doc.text("Account Number: 00000000", 20, 90 + totalHeight + 70)
    doc.text("Reference: " + data.quoteNumber, 20, 90 + totalHeight + 75)
  }

  // Footer
  const footerText = `${data.companyName}`
  const contactText = `Tel: ${data.companyContact} | ${data.companyEmail} | www.${data.companyWebsite}`

  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(92, 107, 115) // Gray-blue color
  doc.text(footerText, 105, 270, { align: "center" })
  doc.setFont("helvetica", "normal")
  doc.text(contactText, 105, 275, { align: "center" })

  // Return the PDF as a blob along with the filename
  return {
    blob: doc.output("blob"),
    filename
  }
}

// For backward compatibility
export async function generateQuotePDF(data: Omit<DocumentData, 'documentType' | 'services'> & { description: string, amount: string }): Promise<Blob> {
  const result = await generatePDF({
    ...data,
    documentType: 'quote',
    services: [{ description: data.description, amount: data.amount }]
  });
  return result.blob;
}
