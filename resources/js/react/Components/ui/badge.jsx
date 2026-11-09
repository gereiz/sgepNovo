import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/react/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-outline-variant px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-on hover:bg-primary/80',
        secondary: 'border-transparent bg-primary-container text-primary-on-container hover:bg-primary-container/80',
        destructive: 'border-transparent bg-error text-error-on hover:bg-error/80',
        outline: 'text-on-surface-variant',
        success: 'border-transparent bg-emerald-600 text-white hover:bg-emerald-600/80',
        warning: 'border-transparent bg-amber-500 text-white hover:bg-amber-500/80',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
