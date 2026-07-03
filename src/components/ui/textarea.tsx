import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-50 dark:placeholder:text-navy-500',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'
