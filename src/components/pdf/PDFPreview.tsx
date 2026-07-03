import { useEffect, useState } from 'react'
import { PDFViewer, pdf } from '@react-pdf/renderer'
import QRCode from 'qrcode'
import { Download, Loader2 } from 'lucide-react'
import { useInvoice } from '@/hooks/useInvoice'
import { PDFDocument } from '@/components/pdf/PDFDocument'
import { Button } from '@/components/ui/button'

export function PDFPreview() {
  const { current, company, totals } = useInvoice()
  const [qrDataUrl, setQrDataUrl] = useState<string | undefined>(undefined)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!company.upiId) {
      setQrDataUrl(undefined)
      return
    }
    const amount = totals.finalTotal > 0 ? totals.finalTotal.toFixed(2) : ''
    const upiUri = `upi://pay?pa=${encodeURIComponent(company.upiId)}&pn=${encodeURIComponent(
      company.name,
    )}${amount ? `&am=${amount}` : ''}&cu=INR`
    QRCode.toDataURL(upiUri, { margin: 1, width: 200 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(undefined)
      })
    return () => {
      cancelled = true
    }
  }, [company.upiId, company.name, totals.finalTotal])

  const document = <PDFDocument invoice={current} company={company} totals={totals} qrDataUrl={qrDataUrl} />

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await pdf(document).toBlob()
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      const safeName = (current.client.clientName || 'estimate').replace(/[^a-z0-9]+/gi, '_')
      a.href = url
      a.download = `${current.client.quotationNumber || 'THE'}_${safeName}.pdf`
      window.document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3 dark:border-navy-700">
        <div>
          <p className="font-display text-sm font-semibold text-navy-800 dark:text-navy-50">Live Preview</p>
          <p className="text-xs text-navy-400 dark:text-navy-400">Printable A4 · Updates instantly</p>
        </div>
        <Button size="sm" variant="gold" onClick={handleDownload} disabled={downloading}>
          {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          Download PDF
        </Button>
      </div>
      <div className="min-h-0 flex-1 bg-navy-100 dark:bg-navy-950">
        <PDFViewer key={current.id} style={{ width: '100%', height: '100%', border: 'none' }} showToolbar={false}>
          {document}
        </PDFViewer>
      </div>
    </div>
  )
}
