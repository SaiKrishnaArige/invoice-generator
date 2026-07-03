import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientInfoSchema } from '@/lib/validation'
import type { ClientInfo } from '@/types'
import { useInvoice } from '@/hooks/useInvoice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const FIELDS: { name: keyof ClientInfo; label: string; type?: string; placeholder?: string }[] = [
  { name: 'clientName', label: 'Client Name', placeholder: 'e.g. Sai Krishna' },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '9XXXXXXXXX' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'client@example.com' },
  { name: 'siteAddress', label: 'Site Address', placeholder: 'Flat / Street / City' },
  { name: 'projectName', label: 'Project Name', placeholder: 'e.g. Namalagundu Residence' },
  { name: 'quotationNumber', label: 'Quotation Number' },
  { name: 'quotationDate', label: 'Quotation Date', type: 'date' },
  { name: 'validUntil', label: 'Valid Until', type: 'date' },
  { name: 'preparedBy', label: 'Prepared By', placeholder: 'Sales / design lead' },
]

export function InvoiceHeader() {
  const { current, updateClient } = useInvoice()
  const {
    register,
    reset,
    formState: { errors },
  } = useForm<ClientInfo>({
    resolver: zodResolver(clientInfoSchema),
    defaultValues: current.client,
    mode: 'onBlur',
  })

  // Re-sync the form whenever a different invoice is loaded (new/duplicate/history).
  useEffect(() => {
    reset(current.client)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.id])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client &amp; Quotation Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FIELDS.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type ?? 'text'}
                placeholder={field.placeholder}
                invalid={!!errors[field.name]}
                {...register(field.name, {
                  onChange: (e) => updateClient({ [field.name]: e.target.value } as Partial<ClientInfo>),
                })}
              />
              {errors[field.name] && (
                <p className="mt-1 text-xs text-red-500">{errors[field.name]?.message as string}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
