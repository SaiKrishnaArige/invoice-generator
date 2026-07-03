import { useInvoice } from '@/hooks/useInvoice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency, formatNumber } from '@/lib/utils'

function SummaryLine({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${emphasis ? 'text-base font-semibold' : 'text-sm'}`}>
      <span className={emphasis ? 'text-navy-800 dark:text-navy-50' : 'text-navy-500 dark:text-navy-300'}>
        {label}
      </span>
      <span className={`tabular-nums ${emphasis ? 'text-navy-900 dark:text-white' : 'text-navy-700 dark:text-navy-200'}`}>
        {value}
      </span>
    </div>
  )
}

export function InvoiceSummary() {
  const { current, totals, setDiscountPercent, setGstPercent } = useInvoice()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-navy-100 dark:border-navy-700">
          <div>
            <Label>Discount %</Label>
            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={current.discountPercent || ''}
              onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>GST %</Label>
            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={current.gstPercent || ''}
              onChange={(e) => setGstPercent(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="pt-2">
          <SummaryLine label="Total SFT" value={formatNumber(totals.totalSft)} />
          <SummaryLine label="Subtotal" value={formatCurrency(totals.subtotal)} />
          <SummaryLine label={`Discount (${formatNumber(current.discountPercent)}%)`} value={`- ${formatCurrency(totals.discountAmount)}`} />
          <SummaryLine label={`GST (${formatNumber(current.gstPercent)}%)`} value={`+ ${formatCurrency(totals.gstAmount)}`} />
          <SummaryLine label="Grand Total" value={formatCurrency(totals.grandTotal)} />
          <SummaryLine label="Round Off" value={formatCurrency(totals.roundOff)} />
          <div className="mt-2 border-t border-navy-100 pt-2 dark:border-navy-700">
            <SummaryLine label="Final Total" value={formatCurrency(totals.finalTotal)} emphasis />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
