import * as React from 'react';
import { cn } from '@/react/lib/utils';

const Separator = React.forwardRef(function Separator(
  { className, orientation = 'horizontal', decorative = true, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      role={decorative ? 'separator' : undefined}
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-outline-variant',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  );
});

export { Separator };
