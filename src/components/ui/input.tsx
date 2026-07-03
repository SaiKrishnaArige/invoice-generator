import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:cursor-not-allowed disabled:opacity-50',
        'dark:bg-navy-800 dark:text-navy-50 dark:placeholder:text-navy-500',
        invalid ? 'border-red-500 focus-visible:ring-red-400' : 'border-navy-200 dark:border-navy-600',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
