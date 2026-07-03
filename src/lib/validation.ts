import { z } from 'zod'

export const clientInfoSchema = z.object({
  clientName: z.string().trim().min(1, 'Client name is required'),
  phone: z.string().trim().optional().default(''),
  email: z
    .string()
    .trim()
    .optional()
    .default('')
    .refine((v) => v === '' || z.string().email().safeParse(v).success, {
      message: 'Enter a valid email address',
    }),
  siteAddress: z.string().trim().optional().default(''),
  projectName: z.string().trim().optional().default(''),
  quotationNumber: z.string().trim().min(1, 'Quotation number is required'),
  quotationDate: z.string().trim().min(1, 'Quotation date is required'),
  validUntil: z.string().trim().optional().default(''),
  preparedBy: z.string().trim().optional().default(''),
})

export const invoiceItemSchema = z.object({
  id: z.string(),
  space: z.string().trim().min(1, 'Space is required'),
  particulars: z.string().trim().min(1, 'Particulars are required'),
  length: z.coerce.number({ invalid_type_error: 'Length is required' }).gt(0, 'Length must be greater than 0'),
  breadth: z.coerce.number({ invalid_type_error: 'Breadth is required' }).gt(0, 'Breadth must be greater than 0'),
  pricePerSft: z.coerce.number({ invalid_type_error: 'Price is required' }).gt(0, 'Price must be greater than 0'),
  sft: z.coerce.number().optional().default(0),
  amount: z.coerce.number().optional().default(0),
})

export const invoiceFormSchema = z.object({
  client: clientInfoSchema,
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  gstPercent: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().optional().default(''),
})

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>
