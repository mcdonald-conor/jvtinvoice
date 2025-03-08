"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { PDFViewer } from "@/components/pdf-viewer"
import { generateQuotePDF } from "@/lib/pdf-generator"

const formSchema = z.object({
  quoteNumber: z.string().min(1, { message: "Quote number is required" }),
  quoteDate: z.string().min(1, { message: "Quote date is required" }),
  customerName: z.string().min(1, { message: "Customer name is required" }),
  customerAddress1: z.string().min(1, { message: "Address line 1 is required" }),
  customerAddress2: z.string().optional(),
  customerPostcode: z.string().min(1, { message: "Postcode is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
})

type FormValues = z.infer<typeof formSchema>

export function QuoteForm() {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const defaultValues: Partial<FormValues> = {
    quoteNumber: `KMJ-${Math.floor(100 + Math.random() * 900)}`,
    quoteDate: format(new Date(), "dd/MM/yy"),
    description: "",
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)

    try {
      const customerAddress: string[] = [
        data.customerAddress1,
        ...(data.customerAddress2 ? [data.customerAddress2] : []),
        data.customerPostcode
      ];

      const blob = await generateQuotePDF({
        quoteNumber: data.quoteNumber,
        quoteDate: data.quoteDate,
        customerName: data.customerName,
        customerAddress,
        companyName: "KM Joinery",
        companyAddress: ["24 Lyra Road", "Liverpool", "L22 0NT"],
        companyContact: "07395128423",
        companyEmail: "contact@kmjoinery.co.uk",
        companyWebsite: "kmjoinery.co.uk",
        description: data.description,
        amount: data.amount,
      });

      setPdfBlob(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quoteNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote Number</FormLabel>
                      <FormControl>
                        <Input placeholder="KMJ-123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quoteDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote Date</FormLabel>
                      <FormControl>
                        <Input placeholder="DD/MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerAddress1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerAddress2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Liverpool" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPostcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input placeholder="L31 8AL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Side double door repairs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (£)</FormLabel>
                    <FormControl>
                      <Input placeholder="150.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isGenerating || !form.formState.isValid}
              >
                {isGenerating ? "Generating..." : "Generate Quote"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        {pdfBlob ? (
          <PDFViewer pdfBlob={pdfBlob} />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted rounded-lg p-8">
            <p className="text-muted-foreground text-center">
              Fill out the form and click "Generate Quote" to preview your PDF quote
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
