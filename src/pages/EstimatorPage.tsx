import { useState } from 'react'
import { Toolbar } from '@/components/layout/Toolbar'
import { Settings } from '@/components/layout/Settings'
import { InvoiceHistory } from '@/components/history/InvoiceHistory'
import { InvoiceForm } from '@/components/invoice/InvoiceForm'
import { PDFPreview } from '@/components/pdf/PDFPreview'
import { cn } from '@/lib/utils'

export function EstimatorPage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form')

  return (
    <div className="flex h-screen flex-col bg-navy-50/40 dark:bg-navy-950">
      <Toolbar onOpenSettings={() => setSettingsOpen(true)} onOpenHistory={() => setHistoryOpen(true)} />

      <div className="flex items-center gap-1 border-b border-navy-100 bg-white px-4 py-2 lg:hidden dark:border-navy-700 dark:bg-navy-900">
        {(['form', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={cn(
              'flex-1 rounded-md py-1.5 text-sm font-medium capitalize transition-colors',
              mobileTab === tab
                ? 'bg-navy-800 text-white dark:bg-gold-400 dark:text-navy-900'
                : 'text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800',
            )}
          >
            {tab === 'form' ? 'Edit Estimate' : 'Preview'}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        <div className={cn('min-h-0 overflow-y-auto px-4 py-5 lg:block lg:px-6', mobileTab === 'form' ? 'block' : 'hidden')}>
          <InvoiceForm />
        </div>
        <div
          className={cn(
            'min-h-0 border-navy-100 lg:block lg:border-l dark:border-navy-700',
            mobileTab === 'preview' ? 'block' : 'hidden',
          )}
        >
          <PDFPreview />
        </div>
      </div>

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <InvoiceHistory open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  )
}
