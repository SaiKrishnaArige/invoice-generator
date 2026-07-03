import { useInvoice } from '@/hooks/useInvoice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_COMPLIMENTARY_NOTE } from '@/lib/defaults'

export function TermsConditions() {
  const { company } = useInvoice()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms &amp; Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm font-medium text-gold-600 dark:text-gold-300">{DEFAULT_COMPLIMENTARY_NOTE}</p>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-navy-600 dark:text-navy-300">
          {company.termsAndConditions}
        </pre>
        <div className="mt-4 border-t border-navy-100 pt-3 text-sm text-navy-500 dark:border-navy-700 dark:text-navy-400">
          <p className="font-semibold text-navy-700 dark:text-navy-100">Contact</p>
          <p>{company.phone1}{company.phone2 ? ` / ${company.phone2}` : ''}</p>
        </div>
      </CardContent>
    </Card>
  )
}
