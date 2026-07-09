import { useRef, useState } from 'react'
import {
  FilePlus2,
  Save,
  Copy,
  Trash2,
  Download,
  Upload,
  Sun,
  Moon,
  Settings as SettingsIcon,
  History,
  CheckCircle2,
} from 'lucide-react'
import { useInvoice } from '@/hooks/useInvoice'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/button'

interface ToolbarProps {
  onOpenSettings: () => void
  onOpenHistory: () => void
}

export function Toolbar({ onOpenSettings, onOpenHistory }: ToolbarProps) {
  const { current, invoices, saveInvoice, newInvoice, duplicateInvoice, deleteInvoice, exportInvoicesJSON, importInvoicesJSON } =
    useInvoice()
  const { theme, toggleTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2500)
  }

  const isSaved = invoices.some((inv) => inv.id === current.id)

  const handleSave = () => {
    if (!current.client.clientName.trim()) {
      showToast('Add a client name before saving.')
      return
    }
    saveInvoice()
    showToast('Invoice saved.')
  }

  const handleDuplicate = () => {
    if (!isSaved) {
      saveInvoice()
    }
    duplicateInvoice(current.id)
    showToast('Invoice duplicated.')
  }

  const handleDelete = () => {
    if (!isSaved) {
      newInvoice()
      return
    }
    if (window.confirm('Delete this invoice from history? This cannot be undone.')) {
      deleteInvoice(current.id)
      newInvoice()
      showToast('Invoice deleted.')
    }
  }

  const handleNew = () => {
    if (window.confirm('Start a new invoice? Unsaved changes to the current one will be kept in the current draft only.')) {
      newInvoice()
    }
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await importInvoicesJSON(file)
    showToast(result.message)
    e.target.value = ''
  }

  return (
    <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/95 backdrop-blur dark:border-navy-700 dark:bg-navy-900/95">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-gold-400 dark:bg-gold-400 dark:text-navy-900">
            <span className="font-display text-base font-bold">HE</span>
          </div>
          <div>
            <p className="font-display text-sm font-semibold leading-tight text-navy-800 dark:text-navy-50">
              The Home Editors
            </p>
            <p className="text-[11px] leading-tight text-navy-400">Estimation Generator</p>
          </div>
        </div>

        <div className="flex flex-nowrap items-center gap-1.5 overflow-x-auto [&>*]:shrink-0 sm:flex-wrap sm:overflow-visible">
          <Button size="sm" variant="outline" onClick={handleNew}>
            <FilePlus2 size={15} />
            <span className="hidden sm:inline">New</span>
          </Button>
          <Button size="sm" variant="primary" onClick={handleSave}>
            <Save size={15} />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button size="sm" variant="outline" onClick={handleDuplicate}>
            <Copy size={15} />
            <span className="hidden sm:inline">Duplicate</span>
          </Button>
          <Button size="sm" variant="outline" onClick={handleDelete}>
            <Trash2 size={15} />
            <span className="hidden sm:inline">Delete</span>
          </Button>

          <div className="mx-1 h-6 w-px bg-navy-100 dark:bg-navy-700" />

          <Button size="sm" variant="ghost" onClick={onOpenHistory}>
            <History size={15} />
            <span className="hidden sm:inline">History</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={exportInvoicesJSON}>
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={handleImportClick}>
            <Upload size={15} />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />

          <div className="mx-1 h-6 w-px bg-navy-100 dark:bg-navy-700" />

          <Button size="icon" variant="ghost" onClick={onOpenSettings} aria-label="Settings">
            <SettingsIcon size={16} />
          </Button>
          <Button size="icon" variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </div>

      {toast && (
        <div className="absolute right-6 top-16 z-40 flex items-center gap-2 rounded-lg bg-navy-800 px-3 py-2 text-xs text-white shadow-lg dark:bg-gold-400 dark:text-navy-900">
          <CheckCircle2 size={14} />
          {toast}
        </div>
      )}
    </header>
  )
}
