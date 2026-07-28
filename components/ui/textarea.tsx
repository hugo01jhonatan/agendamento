import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[80px] w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
