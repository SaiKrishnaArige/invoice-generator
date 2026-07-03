export interface InvoiceItem {
  id: string
  space: string
  particulars: string
  length: number
  breadth: number
  sft: number
  pricePerSft: number
  amount: number
}

export type ExtraChargeKey =
  | 'transportation'
  | 'falseCeiling'
  | 'kitchenAccessories'
  | 'electrical'
  | 'plumbing'
  | 'deepCleaning'
  | 'custom'

export interface ExtraCharge {
  id: string
  key: ExtraChargeKey
  label: string
  amount: number
  enabled: boolean
}

export interface ClientInfo {
  clientName: string
  phone: string
  email: string
  siteAddress: string
  projectName: string
  quotationNumber: string
  quotationDate: string
  validUntil: string
  preparedBy: string
}

export interface BankDetails {
  accountName: string
  accountNumber: string
  ifsc: string
  bankName: string
  branch: string
}

export interface CompanySettings {
  name: string
  tagline: string
  logoDataUrl: string
  address: string
  phone1: string
  phone2: string
  email: string
  gstNumber: string
  upiId: string
  bankDetails: BankDetails
  stampDataUrl: string
  signatureDataUrl: string
  termsAndConditions: string
}

export interface InvoiceTotals {
  totalSft: number
  itemsSubtotal: number
  extraChargesTotal: number
  subtotal: number
  discountAmount: number
  afterDiscount: number
  gstAmount: number
  grandTotal: number
  roundOff: number
  finalTotal: number
}

export interface Invoice {
  id: string
  createdAt: string
  updatedAt: string
  client: ClientInfo
  items: InvoiceItem[]
  extraCharges: ExtraCharge[]
  discountPercent: number
  gstPercent: number
  notes: string
}

export type ThemeMode = 'light' | 'dark'
