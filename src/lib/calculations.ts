import type { ExtraCharge, InvoiceItem, InvoiceTotals } from '@/types'

/** Round to 2 decimal places, avoiding floating point drift. */
export function round2(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.round((value + Number.EPSILON) * 100) / 100
}

/** SFT = Length x Breadth */
export function calculateSft(length: number, breadth: number): number {
  const l = Number.isFinite(length) ? length : 0
  const b = Number.isFinite(breadth) ? breadth : 0
  return round2(l * b)
}

/** Amount = SFT x Price per SFT */
export function calculateAmount(sft: number, pricePerSft: number): number {
  const s = Number.isFinite(sft) ? sft : 0
  const p = Number.isFinite(pricePerSft) ? pricePerSft : 0
  return round2(s * p)
}

/** Recomputes derived fields (sft, amount) for a single row. */
export function recalculateItem(item: InvoiceItem): InvoiceItem {
  const sft = calculateSft(item.length, item.breadth)
  const amount = calculateAmount(sft, item.pricePerSft)
  return { ...item, sft, amount }
}

export function calculateTotals(
  items: InvoiceItem[],
  extraCharges: ExtraCharge[],
  discountPercent: number,
  gstPercent: number,
): InvoiceTotals {
  const totalSft = round2(items.reduce((sum, i) => sum + (i.sft || 0), 0))
  const itemsSubtotal = round2(items.reduce((sum, i) => sum + (i.amount || 0), 0))
  const extraChargesTotal = round2(
    extraCharges.filter((c) => c.enabled).reduce((sum, c) => sum + (c.amount || 0), 0),
  )
  const subtotal = round2(itemsSubtotal + extraChargesTotal)

  const safeDiscount = Number.isFinite(discountPercent) ? discountPercent : 0
  const discountAmount = round2((subtotal * safeDiscount) / 100)
  const afterDiscount = round2(subtotal - discountAmount)

  const safeGst = Number.isFinite(gstPercent) ? gstPercent : 0
  const gstAmount = round2((afterDiscount * safeGst) / 100)
  const grandTotal = round2(afterDiscount + gstAmount)

  const roundedFinal = Math.round(grandTotal)
  const roundOff = round2(roundedFinal - grandTotal)
  const finalTotal = round2(grandTotal + roundOff)

  return {
    totalSft,
    itemsSubtotal,
    extraChargesTotal,
    subtotal,
    discountAmount,
    afterDiscount,
    gstAmount,
    grandTotal,
    roundOff,
    finalTotal,
  }
}
