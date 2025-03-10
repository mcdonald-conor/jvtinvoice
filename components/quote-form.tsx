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
import { X } from "lucide-react"

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
const ServiceItem = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
});

const formSchema = z.object({
  documentType: z.enum(["quote", "invoice"]),
  quoteNumber: z.string().min(1, { message: "Document number is required" }),
  quoteDate: z.string().min(1, { message: "Document date is required" }),
  customerName: z.string().min(1, { message: "Customer name is required" }),
  customerAddress1: z.string().min(1, { message: "Address line 1 is required" }),
  customerAddress2: z.string().optional(),
  customerPostcode: z.string().min(1, { message: "Postcode is required" }),
  services: z.array(ServiceItem).min(1, { message: "At least one service is required" }),
})

type FormValues = z.infer<typeof formSchema>
type ServiceItemType = z.infer<typeof ServiceItem>

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
    services: [
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
        services: data.services,
      });

      setPdfBlob(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                <span
                  className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                    isInvoice
                      ? "bg-blue-50 text-blue-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {isInvoice ? "Invoice Mode" : "Quote Mode"}
                </span>
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-end space-x-3 space-y-0">
                      <div className={`text-sm font-medium ${field.value === "quote" ? "text-green-600 font-bold" : "text-gray-500"}`}>Quote</div>
                      <FormControl>
                        <Switch
                          checked={field.value === "invoice"}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked ? "invoice" : "quote");
                          }}
                        />
                      </FormControl>
                      <div className={`text-sm font-medium ${field.value === "invoice" ? "text-blue-600 font-bold" : "text-gray-500"}`}>Invoice</div>
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

              {/* Services Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Services</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentServices = form.getValues("services") || [];
                      form.setValue("services", [
                        ...currentServices,
                        { description: "", amount: "" }
                      ]);
                    }}
                  >
                    Add Service
                  </Button>
                </div>

                <div className="bg-muted rounded-md overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted rounded-t-md">
                    <div className="col-span-8 font-medium text-sm">Description</div>
                    <div className="col-span-3 font-medium text-sm">Amount</div>
                    <div className="col-span-1"></div>
                  </div>

                  {form.watch("services")?.map((field, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 px-4 py-2 items-start">
                      <div className="col-span-8">
                        <FormField
                          control={form.control}
                          name={`services.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Service description"
                                  className="resize-none min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name={`services.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="£0.00"
                                  {...field}
                                  onChange={(e) => {
                                    // Allow only numbers, decimal point, and pound sign
                                    const value = e.target.value.replace(/[^0-9.£]/g, '');
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            const currentServices = form.getValues("services");
                            form.setValue(
                              "services",
                              currentServices.filter((_, i) => i !== index)
                            );
                          }}
                          disabled={form.watch("services")?.length === 1}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
