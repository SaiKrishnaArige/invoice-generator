import { useMemo } from 'react'
import type { ExtraCharge, InvoiceItem } from '@/types'
import { calculateTotals } from '@/lib/calculations'

export function useAutoCalculate(
  items: InvoiceItem[],
  extraCharges: ExtraCharge[],
  discountPercent: number,
  gstPercent: number,
) {
  return useMemo(
    () => calculateTotals(items, extraCharges, discountPercent, gstPercent),
    [items, extraCharges, discountPercent, gstPercent],
  )
}
