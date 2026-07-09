import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  id?: string
  invalid?: boolean
  className?: string
}

export function Combobox({ value, onChange, options, placeholder, id, invalid, className }: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const query = value.trim()

  const filteredOptions = useMemo(() => {
    const q = query.toLowerCase()
    const source = q ? options.filter((o) => o.toLowerCase().includes(q)) : options
    return source.slice(0, 8)
  }, [options, query])

  const hasExactMatch = useMemo(
    () => options.some((o) => o.toLowerCase() === query.toLowerCase()),
    [options, query],
  )
  const showCustomRow = query.length > 0 && !hasExactMatch
  const showDropdown = open && (filteredOptions.length > 0 || showCustomRow)
  const showClear = value.length > 0

  const commit = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  const clear = () => {
    onChange('')
    setOpen(true)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
            e.currentTarget.blur()
          } else if (e.key === 'Enter') {
            e.preventDefault()
            setOpen(false)
            e.currentTarget.blur()
          }
        }}
        className={cn(
          'flex h-10 w-full rounded-lg border bg-white py-2 pl-3 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:cursor-not-allowed disabled:opacity-50',
          'dark:bg-navy-800 dark:text-navy-50 dark:placeholder:text-navy-500',
          showClear ? 'pr-16' : 'pr-9',
          invalid ? 'border-red-500 focus-visible:ring-red-400' : 'border-navy-200 dark:border-navy-600',
          className,
        )}
      />
      {showClear && (
        <button
          type="button"
          aria-label="Clear"
          onMouseDown={(e) => e.preventDefault()}
          onClick={clear}
          className="absolute right-8 top-1/2 -translate-y-1/2 rounded p-0.5 text-navy-400 transition-colors hover:text-navy-700 dark:text-navy-500 dark:hover:text-navy-200"
        >
          <X size={14} />
        </button>
      )}
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500"
      />
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-lg border border-navy-100 bg-white py-1 shadow-lg dark:border-navy-600 dark:bg-navy-800">
          {filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(option)}
              className="block w-full px-3 py-2 text-left text-sm text-navy-700 hover:bg-navy-50 dark:text-navy-100 dark:hover:bg-navy-700"
            >
              {option}
            </button>
          ))}
          {showCustomRow && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(query)}
              className="block w-full border-t border-navy-100 px-3 py-2 text-left text-sm font-medium text-gold-600 hover:bg-gold-50 dark:border-navy-600 dark:text-gold-300 dark:hover:bg-navy-700"
            >
              Use &quot;{query}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  )
}
