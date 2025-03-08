"use client"

import { useState, useEffect } from "react"
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
import { generatePDF } from "@/lib/pdf-generator"
import { Switch } from "@/components/ui/switch"

// Function to format UK postcodes
const formatPostcode = (postcode: string): string => {
  if (!postcode) return postcode;

  // Remove all spaces and convert to uppercase
  const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();

  // UK postcodes are generally in the format: AA9A 9AA or A9A 9AA or A9 9AA or A99 9AA or AA9 9AA
  // We want to add a space before the last 3 characters
  if (cleanPostcode.length > 3) {
    const inwardCode = cleanPostcode.slice(-3); // Last 3 characters
    const outwardCode = cleanPostcode.slice(0, -3); // Everything else
    return `${outwardCode} ${inwardCode}`;
  }

  return cleanPostcode;
};

// Function to capitalize the first letter of each word in a name
const formatName = (name: string): string => {
  if (!name) return name;

  // Split the name by spaces, capitalize each part, and join back
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

// Function to format addresses while preserving numbers
const formatAddress = (address: string): string => {
  if (!address) return address;

  // Split the address by spaces
  return address
    .split(' ')
    .map(part => {
      // If the part is only numbers, preserve it as is
      if (/^\d+$/.test(part)) {
        return part;
      }
      // Otherwise capitalize the first letter and lowercase the rest
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(' ');
};

// Define a service item type
interface ServiceItem {
  description: string;
  amount: string;
}

const formSchema = z.object({
  documentType: z.enum(["quote", "invoice"]),
  quoteNumber: z.string().min(1, { message: "Document number is required" }),
  quoteDate: z.string().min(1, { message: "Document date is required" }),
  customerName: z.string().min(1, { message: "Customer name is required" }),
  customerAddress1: z.string().min(1, { message: "Address line 1 is required" }),
  customerAddress2: z.string().optional(),
  customerPostcode: z.string().min(1, { message: "Postcode is required" }),
  serviceItems: z.array(
    z.object({
      description: z.string().min(1, { message: "Description is required" }),
      amount: z.string().min(1, { message: "Amount is required" })
    })
  ).min(1, { message: "At least one service item is required" }),
})

type FormValues = z.infer<typeof formSchema>

export function QuoteForm() {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const defaultValues: Partial<FormValues> = {
    documentType: "quote",
    quoteNumber: `KMJ-${Math.floor(100 + Math.random() * 900)}`,
    quoteDate: format(new Date(), "dd/MM/yy"),
    customerName: "",
    customerAddress1: "",
    customerAddress2: "",
    customerPostcode: "",
    serviceItems: [
      { description: "", amount: "" }
    ],
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })

  // Ensure form is initialized with default values
  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const documentType = form.watch("documentType");
  const isInvoice = documentType === "invoice";
  const documentTypeLabel = isInvoice ? "Invoice" : "Quote";
  const documentNumberLabel = isInvoice ? "Invoice Number" : "Quote Number";
  const documentDateLabel = isInvoice ? "Invoice Date" : "Quote Date";

  // Get the service items array from the form
  const serviceItems = form.watch("serviceItems");

  // Function to add a new service item
  const addServiceItem = () => {
    const currentItems = form.getValues("serviceItems");
    form.setValue("serviceItems", [
      ...currentItems,
      { description: "", amount: "" }
    ]);
  };

  // Function to remove a service item
  const removeServiceItem = (index: number) => {
    const currentItems = form.getValues("serviceItems");
    if (currentItems.length > 1) {
      form.setValue(
        "serviceItems",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)

    try {
      const customerAddress: string[] = [
        data.customerAddress1,
        ...(data.customerAddress2 ? [data.customerAddress2] : []),
        data.customerPostcode
      ];

      const blob = await generatePDF({
        documentType: data.documentType,
        quoteNumber: data.quoteNumber,
        quoteDate: data.quoteDate,
        customerName: data.customerName,
        customerAddress,
        companyName: "KM Joinery",
        companyAddress: ["24 Lyra Road", "Liverpool", "L22 0NT"],
        companyContact: "07395128423",
        companyEmail: "contact@kmjoinery.co.uk",
        companyWebsite: "kmjoinery.co.uk",
        serviceItems: data.serviceItems,
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{documentTypeLabel} Generator</h2>
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-end space-x-2 space-y-0">
                      <div className="text-sm font-medium">Quote</div>
                      <FormControl>
                        <Switch
                          checked={field.value === "invoice"}
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? "invoice" : "quote");
                          }}
                        />
                      </FormControl>
                      <div className="text-sm font-medium">Invoice</div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quoteNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{documentNumberLabel}</FormLabel>
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
                      <FormLabel>{documentDateLabel}</FormLabel>
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
                render={({ field }) => {
                  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e.target.value);
                  };

                  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
                    if (e.target.value) {
                      const formattedValue = formatName(e.target.value);
                      field.onChange(formattedValue);
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          value={field.value || ""}
                          onChange={handleNameChange}
                          onBlur={handleNameBlur}
                          autoCapitalize="words"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="customerAddress1"
                render={({ field }) => {
                  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e.target.value);
                  };

                  const handleAddressBlur = (e: React.FocusEvent<HTMLInputElement>) => {
                    if (e.target.value) {
                      const formattedValue = formatAddress(e.target.value);
                      field.onChange(formattedValue);
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St"
                          value={field.value || ""}
                          onChange={handleAddressChange}
                          onBlur={handleAddressBlur}
                          autoCapitalize="words"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="customerAddress2"
                render={({ field }) => {
                  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e.target.value);
                  };

                  const handleAddressBlur = (e: React.FocusEvent<HTMLInputElement>) => {
                    if (e.target.value) {
                      const formattedValue = formatAddress(e.target.value);
                      field.onChange(formattedValue);
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Liverpool"
                          value={field.value || ""}
                          onChange={handleAddressChange}
                          onBlur={handleAddressBlur}
                          autoCapitalize="words"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="customerPostcode"
                render={({ field }) => {
                  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e.target.value);
                  };

                  const handlePostcodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
                    if (e.target.value) {
                      const formattedValue = formatPostcode(e.target.value);
                      field.onChange(formattedValue);
                    }
                  };

                  const handlePostcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') {
                      if (e.key === ' ' && e.currentTarget.value) {
                        e.preventDefault();
                        const formattedValue = formatPostcode(e.currentTarget.value);
                        field.onChange(formattedValue);
                      }
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="L31 8AL"
                          value={field.value || ""}
                          onChange={handlePostcodeChange}
                          onBlur={handlePostcodeBlur}
                          onKeyDown={handlePostcodeKeyDown}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="serviceItems"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Service Items</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addServiceItem}
                        className="text-xs h-8"
                      >
                        Add Item
                      </Button>
                    </div>
                    <FormControl>
                      <div className="space-y-4">
                        {field.value.map((item, index) => (
                          <div key={index} className="flex items-start space-x-4 p-3 border rounded-md bg-background">
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name={`serviceItems.${index}.description`}
                                render={({ field: itemField }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Side double door repairs"
                                        value={itemField.value}
                                        onChange={(e) => itemField.onChange(e.target.value)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="w-1/3">
                              <FormField
                                control={form.control}
                                name={`serviceItems.${index}.amount`}
                                render={({ field: amountField }) => (
                                  <FormItem>
                                    <FormLabel>Amount (£)</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="150.00"
                                        type="text"
                                        inputMode="decimal"
                                        pattern="[0-9]*\.?[0-9]*"
                                        value={amountField.value}
                                        onChange={(e) => {
                                          // Only allow numbers and decimal point
                                          const value = e.target.value.replace(/[^0-9.]/g, '');
                                          amountField.onChange(value);
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            {field.value.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="mt-8"
                                onClick={() => removeServiceItem(index)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
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
                {isGenerating ? "Generating..." : `Generate ${documentTypeLabel}`}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        {pdfBlob ? (
          <PDFViewer pdfBlob={pdfBlob} documentType={form.getValues("documentType")} />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted rounded-lg p-8">
            <p className="text-muted-foreground text-center">
              Fill out the form and click "Generate {documentTypeLabel}" to preview your PDF {documentTypeLabel.toLowerCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
