import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type {
  ClientInfo,
  CompanySettings,
  ExtraCharge,
  Invoice,
  InvoiceItem,
  InvoiceTotals,
} from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS } from '@/lib/storage'
import { calculateTotals, recalculateItem } from '@/lib/calculations'
import {
  DEFAULT_COMPANY_SETTINGS,
  createDefaultClientInfo,
  createDefaultExtraCharges,
  createEmptyItem,
  generateQuotationNumber,
} from '@/lib/defaults'
import { generateId } from '@/lib/utils'

function createDraftInvoice(sequence: number): Invoice {
  const now = new Date().toISOString()
  return {
    id: generateId('inv'),
    createdAt: now,
    updatedAt: now,
    client: createDefaultClientInfo(generateQuotationNumber(sequence)),
    items: [createEmptyItem()],
    extraCharges: createDefaultExtraCharges(),
    discountPercent: 0,
    gstPercent: 0,
    notes: '',
  }
}

interface InvoiceContextValue {
  invoices: Invoice[]
  current: Invoice
  company: CompanySettings
  totals: InvoiceTotals
  searchQuery: string
  setSearchQuery: (q: string) => void
  filteredInvoices: Invoice[]
  updateClient: (patch: Partial<ClientInfo>) => void
  addItem: () => void
  updateItem: (id: string, patch: Partial<InvoiceItem>) => void
  removeItem: (id: string) => void
  updateExtraCharge: (id: string, patch: Partial<ExtraCharge>) => void
  setDiscountPercent: (value: number) => void
  setGstPercent: (value: number) => void
  setNotes: (value: string) => void
  saveInvoice: () => void
  newInvoice: () => void
  loadInvoice: (id: string) => void
  duplicateInvoice: (id: string) => void
  deleteInvoice: (id: string) => void
  updateCompany: (patch: Partial<CompanySettings>) => void
  exportInvoicesJSON: () => void
  importInvoicesJSON: (file: File) => Promise<{ success: boolean; message: string }>
}

const InvoiceContext = createContext<InvoiceContextValue | null>(null)

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>(STORAGE_KEYS.invoices, [])
  const [sequence, setSequence] = useLocalStorage<number>(STORAGE_KEYS.sequence, 1)
  const [company, setCompany] = useLocalStorage<CompanySettings>(STORAGE_KEYS.company, DEFAULT_COMPANY_SETTINGS)
  const [current, setCurrent] = useLocalStorage<Invoice>(STORAGE_KEYS.draft, createDraftInvoice(1))
  const [searchQuery, setSearchQuery] = useState('')

  const totals = useMemo(
    () => calculateTotals(current.items, current.extraCharges, current.discountPercent, current.gstPercent),
    [current.items, current.extraCharges, current.discountPercent, current.gstPercent],
  )

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return invoices
    return invoices.filter(
      (inv) =>
        inv.client.clientName.toLowerCase().includes(q) ||
        inv.client.quotationNumber.toLowerCase().includes(q) ||
        inv.client.projectName.toLowerCase().includes(q),
    )
  }, [invoices, searchQuery])

  const touch = (patch: Partial<Invoice>) =>
    setCurrent((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }))

  const updateClient = (patch: Partial<ClientInfo>) => touch({ client: { ...current.client, ...patch } })

  const addItem = () => touch({ items: [...current.items, createEmptyItem()] })

  const updateItem = (id: string, patch: Partial<InvoiceItem>) =>
    touch({
      items: current.items.map((item) => (item.id === id ? recalculateItem({ ...item, ...patch }) : item)),
    })

  const removeItem = (id: string) => {
    const next = current.items.filter((item) => item.id !== id)
    touch({ items: next.length > 0 ? next : [createEmptyItem()] })
  }

  const updateExtraCharge = (id: string, patch: Partial<ExtraCharge>) =>
    touch({ extraCharges: current.extraCharges.map((c) => (c.id === id ? { ...c, ...patch } : c)) })

  const setDiscountPercent = (value: number) => touch({ discountPercent: value })
  const setGstPercent = (value: number) => touch({ gstPercent: value })
  const setNotes = (value: string) => touch({ notes: value })

  const saveInvoice = () => {
    setInvoices((prev) => {
      const exists = prev.some((inv) => inv.id === current.id)
      const savedInvoice = { ...current, updatedAt: new Date().toISOString() }
      return exists ? prev.map((inv) => (inv.id === current.id ? savedInvoice : inv)) : [savedInvoice, ...prev]
    })
  }

  const newInvoice = () => {
    const nextSeq = sequence + 1
    setSequence(nextSeq)
    setCurrent(createDraftInvoice(nextSeq))
  }

  const loadInvoice = (id: string) => {
    const found = invoices.find((inv) => inv.id === id)
    if (found) setCurrent(found)
  }

  const duplicateInvoice = (id: string) => {
    const found = invoices.find((inv) => inv.id === id)
    if (!found) return
    const now = new Date().toISOString()
    const nextSeq = sequence + 1
    setSequence(nextSeq)
    const copy: Invoice = {
      ...found,
      id: generateId('inv'),
      createdAt: now,
      updatedAt: now,
      client: {
        ...found.client,
        quotationNumber: generateQuotationNumber(nextSeq),
      },
      items: found.items.map((item) => ({ ...item, id: generateId('item') })),
      extraCharges: found.extraCharges.map((c) => ({ ...c, id: generateId('charge') })),
    }
    setInvoices((prev) => [copy, ...prev])
    setCurrent(copy)
  }

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
  }

  const updateCompany = (patch: Partial<CompanySettings>) => setCompany((prev) => ({ ...prev, ...patch }))

  const exportInvoicesJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      company,
      invoices,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `the-home-editors-invoices-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const importInvoicesJSON = async (file: File): Promise<{ success: boolean; message: string }> => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const importedInvoices: Invoice[] = Array.isArray(parsed?.invoices) ? parsed.invoices : []
      if (importedInvoices.length === 0) {
        return { success: false, message: 'No invoices found in the selected file.' }
      }
      setInvoices((prev) => {
        const existingIds = new Set(prev.map((inv) => inv.id))
        const merged = [...prev]
        for (const inv of importedInvoices) {
          if (!inv?.id) continue
          if (existingIds.has(inv.id)) {
            const idx = merged.findIndex((m) => m.id === inv.id)
            merged[idx] = inv
          } else {
            merged.unshift(inv)
          }
        }
        return merged
      })
      if (parsed?.company) {
        setCompany((prev) => ({ ...prev, ...parsed.company }))
      }
      return { success: true, message: `Imported ${importedInvoices.length} invoice(s) successfully.` }
    } catch {
      return { success: false, message: 'That file could not be read. Please select a valid export JSON file.' }
    }
  }

  const value: InvoiceContextValue = {
    invoices,
    current,
    company,
    totals,
    searchQuery,
    setSearchQuery,
    filteredInvoices,
    updateClient,
    addItem,
    updateItem,
    removeItem,
    updateExtraCharge,
    setDiscountPercent,
    setGstPercent,
    setNotes,
    saveInvoice,
    newInvoice,
    loadInvoice,
    duplicateInvoice,
    deleteInvoice,
    updateCompany,
    exportInvoicesJSON,
    importInvoicesJSON,
  }

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
}

export function useInvoiceContext(): InvoiceContextValue {
  const ctx = useContext(InvoiceContext)
  if (!ctx) throw new Error('useInvoiceContext must be used within an InvoiceProvider')
  return ctx
}
