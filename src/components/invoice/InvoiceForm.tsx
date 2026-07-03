import { InvoiceHeader } from '@/components/invoice/InvoiceHeader'
import { InvoiceTable } from '@/components/invoice/InvoiceTable'
import { ExtraCharges } from '@/components/invoice/ExtraCharges'
import { InvoiceSummary } from '@/components/invoice/InvoiceSummary'
import { TermsConditions } from '@/components/invoice/TermsConditions'
import { useInvoice } from '@/hooks/useInvoice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function InvoiceForm() {
  const { current, setNotes } = useInvoice()

  return (
    <div className="flex flex-col gap-5 pb-10">
      <InvoiceHeader />
      <InvoiceTable />
      <ExtraCharges />
      <InvoiceSummary />
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="notes">Additional notes for this quotation</Label>
          <Textarea
            id="notes"
            value={current.notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any project-specific notes to include on the estimate..."
          />
        </CardContent>
      </Card>
      <TermsConditions />
    </div>
  )
}
