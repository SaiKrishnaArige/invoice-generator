import { Plus } from 'lucide-react'
import { useInvoice } from '@/hooks/useInvoice'
import { InvoiceRow } from '@/components/invoice/InvoiceRow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const COLUMNS = ['SN', 'Space', 'Particulars', 'Length (ft)', 'Breadth (ft)', 'SFT', 'Price/SFT', 'Amount', '']

export function InvoiceTable() {
  const { current, addItem, updateItem, removeItem } = useInvoice()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimation Items</CardTitle>
        <Button type="button" size="sm" variant="gold" onClick={addItem}>
          <Plus size={16} />
          Add Row
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 py-0">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50/70 dark:border-navy-700 dark:bg-navy-900/40">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-300"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.items.map((item, index) => (
              <InvoiceRow
                key={item.id}
                index={index}
                item={item}
                removable={current.items.length > 1}
                onChange={(patch) => updateItem(item.id, patch)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
