import { Trash2 } from 'lucide-react'
import type { InvoiceItem } from '@/types'
import { Input } from '@/components/ui/input'
import { formatNumber } from '@/lib/utils'

interface InvoiceRowProps {
  index: number
  item: InvoiceItem
  onChange: (patch: Partial<InvoiceItem>) => void
  onRemove: () => void
  removable: boolean
}

export function InvoiceRow({ index, item, onChange, onRemove, removable }: InvoiceRowProps) {
  const invalidLength = item.length <= 0
  const invalidBreadth = item.breadth <= 0
  const invalidPrice = item.pricePerSft <= 0

  return (
    <tr className="border-b border-navy-100 last:border-b-0 hover:bg-navy-50/60 dark:border-navy-700 dark:hover:bg-navy-800/40">
      <td className="px-3 py-2 text-center text-sm text-navy-500 dark:text-navy-400">{index + 1}</td>
      <td className="px-2 py-2 min-w-[140px]">
        <Input
          value={item.space}
          placeholder="Kitchen"
          onChange={(e) => onChange({ space: e.target.value })}
        />
      </td>
      <td className="px-2 py-2 min-w-[260px]">
        <Input
          value={item.particulars}
          placeholder="P/F boxes in position as per design, made out of 710 BWP plywood"
          onChange={(e) => onChange({ particulars: e.target.value })}
        />
      </td>
      <td className="px-2 py-2 w-24">
        <Input
          type="number"
          step="0.01"
          min={0}
          value={item.length || ''}
          invalid={invalidLength}
          onChange={(e) => onChange({ length: parseFloat(e.target.value) || 0 })}
        />
      </td>
      <td className="px-2 py-2 w-24">
        <Input
          type="number"
          step="0.01"
          min={0}
          value={item.breadth || ''}
          invalid={invalidBreadth}
          onChange={(e) => onChange({ breadth: parseFloat(e.target.value) || 0 })}
        />
      </td>
      <td className="px-3 py-2 w-24 text-right text-sm font-medium tabular-nums text-navy-700 dark:text-navy-200">
        {formatNumber(item.sft)}
      </td>
      <td className="px-2 py-2 w-28">
        <Input
          type="number"
          step="0.01"
          min={0}
          value={item.pricePerSft || ''}
          invalid={invalidPrice}
          onChange={(e) => onChange({ pricePerSft: parseFloat(e.target.value) || 0 })}
        />
      </td>
      <td className="px-3 py-2 w-32 text-right text-sm font-semibold tabular-nums text-navy-800 dark:text-navy-50">
        {formatNumber(item.amount)}
      </td>
      <td className="px-2 py-2 w-12 text-center">
        <button
          type="button"
          onClick={onRemove}
          disabled={!removable}
          aria-label="Delete row"
          className="rounded-md p-1.5 text-navy-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-red-950/40"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  )
}
