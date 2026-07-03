import { Search, Copy, Trash2, FileText } from 'lucide-react'
import { useInvoice } from '@/hooks/useInvoice'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { calculateTotals } from '@/lib/calculations'

interface InvoiceHistoryProps {
  open: boolean
  onClose: () => void
}

export function InvoiceHistory({ open, onClose }: InvoiceHistoryProps) {
  const { filteredInvoices, searchQuery, setSearchQuery, loadInvoice, duplicateInvoice, deleteInvoice } = useInvoice()

  const handleLoad = (id: string) => {
    loadInvoice(id)
    onClose()
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete the invoice for "${name || 'this client'}"? This cannot be undone.`)) {
      deleteInvoice(id)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Invoice History">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
          <Input
            className="pl-9"
            placeholder="Search by client, project or quotation number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-navy-400">
            <FileText size={28} />
            <p className="text-sm">
              {searchQuery ? 'No invoices match your search.' : 'No saved invoices yet. Save your first estimate to see it here.'}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-navy-100 dark:divide-navy-700">
            {filteredInvoices.map((inv) => {
              const totals = calculateTotals(inv.items, inv.extraCharges, inv.discountPercent, inv.gstPercent)
              return (
                <li key={inv.id} className="flex items-center justify-between gap-3 py-3">
                  <button className="min-w-0 flex-1 text-left" onClick={() => handleLoad(inv.id)}>
                    <p className="truncate text-sm font-semibold text-navy-800 dark:text-navy-50">
                      {inv.client.clientName || 'Untitled client'}
                    </p>
                    <p className="truncate text-xs text-navy-400">
                      {inv.client.quotationNumber} · {formatDate(inv.client.quotationDate)} · {formatCurrency(totals.finalTotal)}
                    </p>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button size="icon" variant="ghost" aria-label="Duplicate" onClick={() => duplicateInvoice(inv.id)}>
                      <Copy size={15} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete"
                      onClick={() => handleDelete(inv.id, inv.client.clientName)}
                    >
                      <Trash2 size={15} className="text-red-500" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Modal>
  )
}
