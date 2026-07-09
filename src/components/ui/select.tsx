import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
  wrapperClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, wrapperClassName, invalid, children, ...props }, ref) => (
    <div className={cn('relative', wrapperClassName)}>
      <select
        ref={ref}
        className={cn(
          'flex h-10 w-full appearance-none rounded-lg border bg-white py-2 pl-3 pr-9 text-sm text-navy-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:cursor-not-allowed disabled:opacity-50',
          'dark:bg-navy-800 dark:text-navy-50',
          invalid ? 'border-red-500 focus-visible:ring-red-400' : 'border-navy-200 dark:border-navy-600',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500"
      />
    </div>
  ),
)
Select.displayName = 'Select'
