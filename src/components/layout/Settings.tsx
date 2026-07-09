import { useRef } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { useInvoice } from '@/hooks/useInvoice'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MATERIAL_LABELS } from '@/lib/defaults'
import type { BankDetails, CompanySettings, MaterialRate, MaterialType } from '@/types'

interface SettingsProps {
  open: boolean
  onClose: () => void
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (dataUrl: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    onChange(dataUrl)
    e.target.value = ''
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-navy-200 bg-navy-50 dark:border-navy-600 dark:bg-navy-900">
          {value ? (
            <img src={value} alt={label} className="h-full w-full object-contain" />
          ) : (
            <Upload size={18} className="text-navy-300" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
            Upload
          </Button>
          {value && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange('')}>
              <Trash2 size={13} /> Remove
            </Button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  )
}

export function Settings({ open, onClose }: SettingsProps) {
  const { company, updateCompany } = useInvoice()

  const set = <K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) => updateCompany({ [key]: value })
  const setBank = (patch: Partial<BankDetails>) => updateCompany({ bankDetails: { ...company.bankDetails, ...patch } })
  const setMaterialRate = (material: MaterialType, patch: Partial<MaterialRate>) =>
    updateCompany({
      materialRates: {
        ...company.materialRates,
        [material]: { ...company.materialRates[material], ...patch },
      },
    })

  return (
    <Modal open={open} onClose={onClose} title="Company Settings">
      <div className="flex flex-col gap-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageUploadField label="Company Logo" value={company.logoDataUrl} onChange={(v) => set('logoDataUrl', v)} />
          <ImageUploadField label="Digital Signature" value={company.signatureDataUrl} onChange={(v) => set('signatureDataUrl', v)} />
          <ImageUploadField label="Company Stamp" value={company.stampDataUrl} onChange={(v) => set('stampDataUrl', v)} />
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Company Name</Label>
            <Input value={company.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={company.tagline} onChange={(e) => set('tagline', e.target.value)} />
          </div>
          <div>
            <Label>Phone 1</Label>
            <Input value={company.phone1} onChange={(e) => set('phone1', e.target.value)} />
          </div>
          <div>
            <Label>Phone 2</Label>
            <Input value={company.phone2} onChange={(e) => set('phone2', e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={company.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <Label>GST Number</Label>
            <Input value={company.gstNumber} onChange={(e) => set('gstNumber', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Address</Label>
            <Input value={company.address} onChange={(e) => set('address', e.target.value)} />
          </div>
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-300">
            Bank Details
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Account Name</Label>
              <Input value={company.bankDetails.accountName} onChange={(e) => setBank({ accountName: e.target.value })} />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input value={company.bankDetails.accountNumber} onChange={(e) => setBank({ accountNumber: e.target.value })} />
            </div>
            <div>
              <Label>IFSC</Label>
              <Input value={company.bankDetails.ifsc} onChange={(e) => setBank({ ifsc: e.target.value })} />
            </div>
            <div>
              <Label>Bank Name</Label>
              <Input value={company.bankDetails.bankName} onChange={(e) => setBank({ bankName: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Branch</Label>
              <Input value={company.bankDetails.branch} onChange={(e) => setBank({ branch: e.target.value })} />
            </div>
          </div>
        </section>

        <section>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-300">
            Material Pricing (₹ / SFT)
          </p>
          <p className="mb-3 text-xs text-navy-400 dark:text-navy-400">
            These rates auto-fill a row&apos;s Price/SFT when you change its Material or Component — the price can
            still be edited per row afterward.
          </p>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-3 text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-navy-500">
              <span>Material</span>
              <span>Box</span>
              <span>Frame</span>
            </div>
            {MATERIAL_LABELS.map(({ value, label }) => (
              <div key={value} className="grid grid-cols-3 items-center gap-3">
                <span className="text-sm font-medium text-navy-700 dark:text-navy-100">{label}</span>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={company.materialRates[value].box || ''}
                  onChange={(e) => setMaterialRate(value, { box: parseFloat(e.target.value) || 0 })}
                />
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={company.materialRates[value].frame || ''}
                  onChange={(e) => setMaterialRate(value, { frame: parseFloat(e.target.value) || 0 })}
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <Label>UPI ID (for payment QR code)</Label>
          <Input placeholder="yourname@bank" value={company.upiId} onChange={(e) => set('upiId', e.target.value)} />
        </section>

        <section>
          <Label>Terms &amp; Conditions</Label>
          <Textarea
            className="min-h-[220px]"
            value={company.termsAndConditions}
            onChange={(e) => set('termsAndConditions', e.target.value)}
          />
        </section>

        <div className="flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  )
}
