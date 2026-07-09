import { Trash2 } from 'lucide-react'
import type { InvoiceItem, MaterialComponent, MaterialType } from '@/types'
import { Combobox } from '@/components/ui/combobox'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { COMPONENT_LABELS, MATERIAL_LABELS } from '@/lib/defaults'
import { SPACE_PRESETS, PARTICULARS_PRESETS } from '@/lib/presets'
import { formatNumber } from '@/lib/utils'

interface InvoiceItemCardProps {
  index: number
  item: InvoiceItem
  onChange: (patch: Partial<InvoiceItem>) => void
  onRemove: () => void
  removable: boolean
}

export function InvoiceItemCard({ index, item, onChange, onRemove, removable }: InvoiceItemCardProps) {
  const invalidLength = item.length <= 0
  const invalidBreadth = item.breadth <= 0
  const invalidPrice = item.pricePerSft <= 0

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-sm dark:border-navy-700 dark:bg-navy-900/40">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-600 dark:bg-navy-700 dark:text-navy-200">
          {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          disabled={!removable}
          aria-label="Delete row"
          className="flex h-9 w-9 items-center justify-center rounded-md text-navy-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-red-950/40"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <Label>Space</Label>
          <Combobox value={item.space} onChange={(v) => onChange({ space: v })} options={SPACE_PRESETS} placeholder="Kitchen" />
        </div>

        <div>
          <Label>Particulars</Label>
          <Combobox
            value={item.particulars}
            onChange={(v) => onChange({ particulars: v })}
            options={PARTICULARS_PRESETS}
            placeholder="P/F boxes in position as per design..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Material</Label>
            <Select value={item.material} onChange={(e) => onChange({ material: e.target.value as MaterialType })}>
              {MATERIAL_LABELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Component</Label>
            <Select
              value={item.component}
              onChange={(e) => onChange({ component: e.target.value as MaterialComponent })}
            >
              {COMPONENT_LABELS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label>Materials Used</Label>
          <Input
            value={item.materialsUsed}
            placeholder="710 BWP plywood, Merino laminate..."
            onChange={(e) => onChange({ materialsUsed: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Length (ft)</Label>
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              value={item.length || ''}
              invalid={invalidLength}
              onChange={(e) => onChange({ length: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label>Breadth (ft)</Label>
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              value={item.breadth || ''}
              invalid={invalidBreadth}
              onChange={(e) => onChange({ breadth: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div>
          <Label>Price / SFT (₹)</Label>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min={0}
            value={item.pricePerSft || ''}
            invalid={invalidPrice}
            onChange={(e) => onChange({ pricePerSft: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-navy-50/70 px-3 py-2.5 dark:bg-navy-800/60">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400 dark:text-navy-400">SFT</p>
            <p className="text-sm font-semibold tabular-nums text-navy-700 dark:text-navy-200">{formatNumber(item.sft)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400 dark:text-navy-400">Amount</p>
            <p className="text-sm font-semibold tabular-nums text-navy-800 dark:text-navy-50">{formatNumber(item.amount)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
