import type {
  ClientInfo,
  CompanySettings,
  ExtraCharge,
  Invoice,
  InvoiceItem,
  MaterialComponent,
  MaterialRates,
  MaterialType,
} from '@/types'
import { generateId, todayISO, addDaysISO } from '@/lib/utils'

// Retained exactly as provided in the source PDF ("The Home Editors" estimation sheet).
export const DEFAULT_TERMS_AND_CONDITIONS = `Terms and Conditions:
1. Taxes: All product prices are exclusive of taxes/GST.
2. Exclusions: Electrical, plumbing, Chimney, loose furniture, artifacts in designs, curtains, blinds, wallpapers, kitchen countertop, back splash and civil works are not included unless otherwise mentioned in the quote. Rates for kitchen appliances/platform and sink are not included and will be applicable based on your selection.
3. Design Changes: No changes will be made after signing the production drawings. Separate timelines will apply for increases in scope of work and will attract additional costs.
4. Payment Terms:
50,000/- token for visual designing (amount included in the final quote)
50% at the time of signing this work order
35% on completion of box structure
10% on completion of laminate work
5% on completion and handover
5. Additional Services: Estimates for other services are based on the scope of work defined in an additional sheet. Any increase in scope of work will require a price revision.
6. Kitchen Appliances/ Platform and Sink: Rates for kitchen appliances/platform and sink are not included and will be applicable based on your selection.

Your acceptance of this proposal indicates that these Terms and Conditions have been read and accepted by you.`

export const DEFAULT_COMPLIMENTARY_NOTE = 'Complimentary: Pest Control and Shoe Rack (3*4 sft)'

export const DEFAULT_MATERIAL_RATES: MaterialRates = {
  laminate: { box: 1400, frame: 1000 },
  acrylic: { box: 2000, frame: 1400 },
  pu: { box: 3200, frame: 2200 },
}

export const MATERIAL_LABELS: { value: MaterialType; label: string }[] = [
  { value: 'laminate', label: 'Laminate' },
  { value: 'acrylic', label: 'Acrylic' },
  { value: 'pu', label: 'PU' },
]

export const COMPONENT_LABELS: { value: MaterialComponent; label: string }[] = [
  { value: 'box', label: 'Box' },
  { value: 'frame', label: 'Frame' },
]

export function materialLabel(material: MaterialType): string {
  return MATERIAL_LABELS.find((m) => m.value === material)?.label ?? material
}

export function componentLabel(component: MaterialComponent): string {
  return COMPONENT_LABELS.find((c) => c.value === component)?.label ?? component
}

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: 'THE HOME EDITORS',
  tagline: 'INNOVATE EVERY INCH',
  logoDataUrl: '',
  address: '',
  phone1: '9948999908',
  phone2: '7036666567',
  email: '',
  gstNumber: '',
  upiId: '',
  bankDetails: {
    accountName: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
    branch: '',
  },
  stampDataUrl: '',
  signatureDataUrl: '',
  termsAndConditions: DEFAULT_TERMS_AND_CONDITIONS,
  materialRates: DEFAULT_MATERIAL_RATES,
}

export const EXTRA_CHARGE_LABELS: { key: ExtraCharge['key']; label: string }[] = [
  { key: 'transportation', label: 'Transportation' },
  { key: 'falseCeiling', label: 'False Ceiling' },
  { key: 'kitchenAccessories', label: 'Kitchen Accessories' },
  { key: 'electrical', label: 'Electrical' },
  { key: 'plumbing', label: 'Plumbing' },
  { key: 'deepCleaning', label: 'Deep Cleaning' },
  { key: 'custom', label: 'Custom Charges' },
]

export function createDefaultExtraCharges(): ExtraCharge[] {
  return EXTRA_CHARGE_LABELS.map(({ key, label }) => ({
    id: generateId('charge'),
    key,
    label,
    amount: 0,
    enabled: false,
  }))
}

export function createEmptyItem(startingPricePerSft = 0): InvoiceItem {
  return {
    id: generateId('item'),
    space: '',
    particulars: '',
    material: 'laminate',
    component: 'box',
    materialsUsed: '',
    length: 0,
    breadth: 0,
    sft: 0,
    pricePerSft: startingPricePerSft,
    amount: 0,
  }
}

function normalizeMaterialType(value: unknown): MaterialType {
  return value === 'acrylic' || value === 'pu' ? value : 'laminate'
}

function normalizeMaterialComponent(value: unknown): MaterialComponent {
  return value === 'frame' ? 'frame' : 'box'
}

/** Old saved items may predate the material/component/materialsUsed fields; default them. */
export function normalizeInvoiceItem(item: InvoiceItem): InvoiceItem {
  return {
    ...item,
    material: normalizeMaterialType(item.material),
    component: normalizeMaterialComponent(item.component),
    materialsUsed: typeof item.materialsUsed === 'string' ? item.materialsUsed : '',
  }
}

export function normalizeInvoice(invoice: Invoice): Invoice {
  if (!invoice || !Array.isArray(invoice.items)) return invoice
  return { ...invoice, items: invoice.items.map(normalizeInvoiceItem) }
}

export function normalizeInvoiceList(invoices: Invoice[]): Invoice[] {
  return Array.isArray(invoices) ? invoices.map(normalizeInvoice) : invoices
}

function normalizeMaterialRates(rates: Partial<MaterialRates> | undefined): MaterialRates {
  return {
    laminate: { ...DEFAULT_MATERIAL_RATES.laminate, ...rates?.laminate },
    acrylic: { ...DEFAULT_MATERIAL_RATES.acrylic, ...rates?.acrylic },
    pu: { ...DEFAULT_MATERIAL_RATES.pu, ...rates?.pu },
  }
}

/** Old saved company settings may predate materialRates (and other fields); backfill defaults. */
export function normalizeCompanySettings(company: CompanySettings): CompanySettings {
  return {
    ...DEFAULT_COMPANY_SETTINGS,
    ...company,
    bankDetails: { ...DEFAULT_COMPANY_SETTINGS.bankDetails, ...company?.bankDetails },
    materialRates: normalizeMaterialRates(company?.materialRates),
  }
}

export function createDefaultClientInfo(quotationNumber: string): ClientInfo {
  return {
    clientName: '',
    phone: '',
    email: '',
    siteAddress: '',
    projectName: '',
    quotationNumber,
    quotationDate: todayISO(),
    validUntil: addDaysISO(30),
    preparedBy: '',
  }
}

export function generateQuotationNumber(sequence: number): string {
  const year = new Date().getFullYear()
  return `THE-${year}-${String(sequence).padStart(4, '0')}`
}
