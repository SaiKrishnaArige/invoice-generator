import { useInvoice } from '@/hooks/useInvoice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ExtraCharges() {
  const { current, updateExtraCharge } = useInvoice()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extra Charges (optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {current.extraCharges.map((charge) => (
            <div key={charge.id} className="rounded-lg border border-navy-100 p-3 dark:border-navy-700">
              <label className="flex items-center gap-2 text-sm font-medium text-navy-700 dark:text-navy-100">
                <input
                  type="checkbox"
                  checked={charge.enabled}
                  onChange={(e) => updateExtraCharge(charge.id, { enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-navy-300 text-gold-500 focus:ring-gold-400"
                />
                {charge.key === 'custom' ? (
                  <Input
                    value={charge.label}
                    onChange={(e) => updateExtraCharge(charge.id, { label: e.target.value })}
                    className="h-7 flex-1 px-2 py-1 text-sm"
                    placeholder="Custom charge label"
                  />
                ) : (
                  charge.label
                )}
              </label>
              <div className="mt-2">
                <Label className="mb-1 text-[10px]">Amount (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={charge.amount || ''}
                  disabled={!charge.enabled}
                  onChange={(e) => updateExtraCharge(charge.id, { amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
