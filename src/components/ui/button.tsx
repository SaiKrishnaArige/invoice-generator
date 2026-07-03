import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-900 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-navy-700 text-white hover:bg-navy-800 shadow-sm dark:bg-gold-400 dark:text-navy-900 dark:hover:bg-gold-300',
        gold: 'bg-gold-400 text-navy-900 hover:bg-gold-300 shadow-sm',
        outline:
          'border border-navy-200 bg-transparent text-navy-700 hover:bg-navy-50 dark:border-navy-600 dark:text-navy-100 dark:hover:bg-navy-800',
        ghost: 'bg-transparent text-navy-700 hover:bg-navy-100 dark:text-navy-100 dark:hover:bg-navy-800',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        link: 'text-navy-700 underline-offset-4 hover:underline dark:text-gold-300 p-0 h-auto',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
)
Button.displayName = 'Button'
