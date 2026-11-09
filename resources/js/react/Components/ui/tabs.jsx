import * as React from 'react';
import { cn } from '@/react/lib/utils';

const TabsContext = React.createContext(null);

function Tabs({ className, defaultValue, value: controlledValue, onValueChange, children, ...props }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = (v) => {
    if (controlledValue === undefined) setInternalValue(v);
    if (onValueChange) onValueChange(v);
  };
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-surface-container p-1 text-on-surface-variant',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, value, children, ...props }) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  const isActive = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => ctx.setValue(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
        isActive ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({ className, value, children, ...props }) {
  const ctx = React.useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      data-state={ctx.value === value ? 'active' : 'inactive'}
      className={cn('mt-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
