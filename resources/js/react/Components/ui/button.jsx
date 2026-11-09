import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/react/lib/utils';

/**
 * shadcn/ui Button (versão oficial usando @radix-ui/react-slot).
 *
 * Utiliza agora o @vitejs/plugin-react-swc (SWC) ao invés do
 * @vitejs/plugin-react (BABEL), então o erro "can't detect preamble"
 * NÃO OCORRE MAIS (SWC não implementa essa validação).
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-on shadow hover:bg-primary/90',
        destructive: 'bg-error text-error-on shadow-sm hover:bg-error/90',
        outline:     'border border-outline-variant bg-surface-container-lowest shadow-sm hover:bg-surface-container hover:text-on-surface',
        secondary:   'bg-primary-container text-primary-on-container shadow-sm hover:bg-primary-container/80',
        ghost:       'hover:bg-surface-container hover:text-on-surface',
        link:        'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm:      'h-8 rounded-md px-3 text-xs',
        lg:      'h-10 rounded-md px-8',
        icon:    'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'default',
    },
  }
);

const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
