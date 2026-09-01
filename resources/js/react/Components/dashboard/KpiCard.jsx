import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/react/Components/ui/card';
import { Badge } from '@/react/Components/ui/badge';
import { cn, formatCurrencyBRL, formatNumberBR } from '@/react/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  trend = 0,
  trendLabel = 'vs. período anterior',
  variant = 'default',
  footer,
  badgeText,
  badgeVariant = 'default',
  className,
}) {
  const trendIsPositive = trend > 0.0001;
  const trendIsNegative = trend < -0.0001;

  return (
    <Card className={cn('overflow-hidden transition-transform hover:-translate-y-0.5', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardDescription className="text-xs font-medium uppercase tracking-wider">
            {title}
          </CardDescription>
          <CardTitle className="text-2xl lg:text-3xl font-black tracking-tight">
            {value}
          </CardTitle>
        </div>
        <div
          className={cn(
            'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
            variant === 'primary' && 'bg-primary/10 text-primary',
            variant === 'success' && 'bg-emerald-100 text-emerald-600',
            variant === 'warning' && 'bg-amber-100 text-amber-600',
            variant === 'destructive' && 'bg-error/10 text-error',
            variant === 'default' && 'bg-primary-container text-primary-on-container'
          )}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {trendIsPositive && (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +{formatNumberBR(trend, 1)}%
            </span>
          )}
          {trendIsNegative && (
            <span className="inline-flex items-center gap-1 font-bold text-error">
              <ArrowDownRight className="h-3.5 w-3.5" />
              {formatNumberBR(trend, 1)}%
            </span>
          )}
          {!trendIsPositive && !trendIsNegative && (
            <span className="inline-flex items-center gap-1 font-bold text-on-surface-variant">
              <Minus className="h-3.5 w-3.5" /> Estável
            </span>
          )}
          <span className="text-on-surface-variant">{trendLabel}</span>
        </div>

        {description && <p className="text-xs text-on-surface-variant leading-relaxed">{description}</p>}

        {(badgeText || footer) && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/60">
            {badgeText ? (
              <Badge variant={badgeVariant} className="text-[10px] px-2 py-0.5 font-bold">
                {badgeText}
              </Badge>
            ) : <span />}
            {footer && <div className="text-[11px] text-on-surface-variant">{footer}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
