import { Plus } from 'lucide-react'
import { useInvoice } from '@/hooks/useInvoice'
import { InvoiceRow } from '@/components/invoice/InvoiceRow'
import { InvoiceItemCard } from '@/components/invoice/InvoiceItemCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const COLUMNS = [
  'SN',
  'Space',
  'Particulars',
  'Material',
  'Component',
  'Materials Used',
  'Length (ft)',
  'Breadth (ft)',
  'SFT',
  'Price/SFT',
  'Amount',
  '',
]

export function InvoiceTable() {
  const { current, addItem, updateItem, removeItem } = useInvoice()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimation Items</CardTitle>
        <Button type="button" size="sm" variant="gold" onClick={addItem} className="hidden lg:inline-flex">
          <Plus size={16} />
          Add Row
        </Button>
      </CardHeader>

      <div className="hidden lg:block">
        <CardContent className="overflow-x-auto px-0 py-0">
          <table className="w-full min-w-[1320px] border-collapse text-sm">
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
      </div>

      <div className="lg:hidden">
        <CardContent className="flex flex-col gap-3">
          {current.items.map((item, index) => (
            <InvoiceItemCard
              key={item.id}
              index={index}
              item={item}
              removable={current.items.length > 1}
              onChange={(patch) => updateItem(item.id, patch)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
          <Button type="button" variant="outline" className="w-full" onClick={addItem}>
            <Plus size={16} />
            Add Row
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}
