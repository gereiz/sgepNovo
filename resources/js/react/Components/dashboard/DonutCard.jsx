import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Users, Package } from 'lucide-react';
import { Badge } from '@/react/Components/ui/badge';
import { cn } from '@/react/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETA_VENDEDORES = [
  '#01579b',
  '#a8325c',
  '#8c5a13',
  '#00838f',
  '#6a5acd',
];
const PALETA_CLIENTES = [
  '#ff79a7',
  '#d98330',
  '#1e88e5',
  '#a8325c',
  '#e8a142',
  '#d3436b',
  '#2096ba',
  '#1261c2',
  '#a2a7b5',
];

const DEFAULT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#111827',
      titleColor: '#fff',
      bodyColor: '#e5e7eb',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
    },
  },
};

function inicial(nome) {
  if (!nome) return '?';
  const partes = String(nome).trim().split(/\s+/).filter(Boolean);
  return (partes[0]?.[0] || '?').toUpperCase();
}

function BadgeTotal({ total, variant = 'info', label }) {
  const variantClasses =
    variant === 'danger'
      ? 'bg-rose-100 text-rose-700 border border-rose-200'
      : 'bg-sky-50 text-sky-700 border border-sky-200';
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 text-[12px] font-semibold rounded-md',
      variantClasses
    )}>
      {label} {total}
    </span>
  );
}

function VendasPorVendedorList({ itens, totalGeral }) {
  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      <div className="grid grid-cols-12 px-1 pb-2.5">
        <div className="col-span-8 text-[12px] font-bold tracking-wide text-gray-500 uppercase">
          Vendedor
        </div>
        <div className="col-span-4 text-[12px] font-bold tracking-wide text-gray-500 uppercase text-right pr-1">
          Reservas
        </div>
      </div>
      <div className="space-y-1.5">
        {itens.map((it, idx) => (
          <div
            key={it.user_id ?? idx}
            className="grid grid-cols-12 items-center px-1 py-2.5 rounded-md hover:bg-gray-50/60 transition-colors"
          >
            <div className="col-span-8 flex items-center gap-3 min-w-0">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                style={{ backgroundColor: PALETA_VENDEDORES[idx % PALETA_VENDEDORES.length] }}
              >
                {it.vendedor_nome === 'Demais' ? '···' : inicial(it.vendedor_nome)}
              </div>
              <div className="truncate min-w-0">
                <div className="text-[13.5px] font-semibold text-gray-800 truncate">
                  {it.vendedor_nome || 'Sem nome'}
                </div>
              </div>
            </div>
            <div className="col-span-4 flex items-center justify-end pr-1">
              <span className="text-[13.5px] font-bold text-gray-700 tabular-nums">
                {it.total_paineis ?? 0}
              </span>
              <span className="ml-1.5 text-[11px] font-medium text-gray-400 hidden sm:inline">
                painéis
              </span>
            </div>
          </div>
        ))}
        {(!itens || itens.length === 0) && (
          <div className="text-center py-6 text-[13px] text-gray-400">
            Nenhuma venda registrada na bi-semana atual.
          </div>
        )}
      </div>
    </div>
  );
}

function ReservasPorClienteList({ itens, totalGeral }) {
  return (
    <div className="mt-5 pt-4 border-t border-gray-100 max-h-[340px] overflow-y-auto pr-1">
      <div className="grid grid-cols-12 px-1 pb-2.5 sticky top-0 bg-white z-10">
        <div className="col-span-8 text-[12px] font-bold tracking-wide text-gray-500 uppercase">
          Cliente
        </div>
        <div className="col-span-4 text-[12px] font-bold tracking-wide text-gray-500 uppercase text-right pr-1">
          Qtd
        </div>
      </div>
      <div className="space-y-1.5">
        {itens.map((it, idx) => (
          <div
            key={it.cliente_id ?? idx}
            className="grid grid-cols-12 items-center px-1 py-2.5 rounded-md hover:bg-gray-50/60 transition-colors"
          >
            <div className="col-span-8 flex items-center gap-3 min-w-0">
              <div
                className="h-8 w-8 shrink-0 rounded-sm"
                style={{ backgroundColor: PALETA_CLIENTES[idx % PALETA_CLIENTES.length], opacity: 0.92 }}
              />
              <div className="truncate min-w-0">
                <div className="text-[13.5px] font-semibold text-gray-800 truncate uppercase">
                  {it.cliente_nome || 'Sem cliente'}
                </div>
              </div>
            </div>
            <div className="col-span-4 flex items-center justify-end pr-1">
              <span className="text-[13.5px] font-bold text-gray-700 tabular-nums">
                {it.qtd ?? 0}
              </span>
            </div>
          </div>
        ))}
        {(!itens || itens.length === 0) && (
          <div className="text-center py-6 text-[13px] text-gray-400">
            Nenhuma reserva por cliente na bi-semana atual.
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * DonutCard: card único com donut + lista (serve tanto para Vendedor quanto Cliente).
 *
 * Props:
 *  variant = 'vendedor' | 'cliente'
 *  title, subtitle, itens (array), totalGeral (mostrado no centro)
 *  centerPrimary, centerSecondary (texto centro)
 */
export function DonutCard({
  variant = 'vendedor',
  title,
  subtitle,
  itens = [],
  totalGeral,
  centerPrimary,
  centerSecondary,
}) {
  const paleta = variant === 'vendedor' ? PALETA_VENDEDORES : PALETA_CLIENTES;
  const rotulos = itens.map((it) =>
    variant === 'vendedor' ? it.vendedor_nome || 'Sem nome' : it.cliente_nome || 'Sem cliente'
  );
  const valores = itens.map((it) =>
    variant === 'vendedor' ? Number(it.total_paineis || 0) : Number(it.qtd || 0)
  );
  const cores = itens.map((_, idx) => paleta[idx % paleta.length]);

  const chartData = {
    labels: rotulos,
    datasets: [
      {
        data: valores,
        backgroundColor: cores,
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 6,
        borderRadius: 2,
      },
    ],
  };

  const HeaderIcon = variant === 'vendedor' ? Users : Package;
  const headerIconBg = variant === 'vendedor'
    ? 'bg-sky-50 text-sky-700'
    : 'bg-rose-50 text-rose-700';
  const borderTop = variant === 'vendedor'
    ? 'border-t-[3px] border-t-sky-700'
    : 'border-t-[3px] border-t-rose-700';

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden',
        borderTop
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-start gap-2.5">
          <div className={cn('mt-0.5 h-8 w-8 rounded-md flex items-center justify-center shrink-0', headerIconBg)}>
            <HeaderIcon className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-gray-900 leading-snug">
              {title}
            </h3>
            <p className="text-[12.5px] text-gray-500 mt-0.5 leading-tight">
              {subtitle}
            </p>
          </div>
        </div>
        <BadgeTotal
          total={totalGeral ?? 0}
          variant={variant === 'vendedor' ? 'info' : 'danger'}
          label="Total:"
        />
      </div>

      {/* Donut + legenda ao lado */}
      <div className="px-5 pb-2 flex flex-col md:flex-row gap-4 items-center">
        {/* Gráfico centro fixo */}
        <div className="relative w-full max-w-[240px] h-[220px] shrink-0 mx-auto md:mx-0">
          <Doughnut data={chartData} options={DEFAULT_CHART_OPTIONS} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[32px] font-black text-gray-900 leading-none tabular-nums">
              {centerPrimary}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mt-1">
              {centerSecondary}
            </div>
          </div>
        </div>

        {/* Legenda ao lado (desktop) */}
        <div className="hidden md:flex flex-col gap-2 flex-1 w-full min-w-0 pt-1">
          {itens.map((it, idx) => {
            const label = variant === 'vendedor'
              ? it.vendedor_nome || 'Sem nome'
              : it.cliente_nome || 'Sem cliente';
            const valor = variant === 'vendedor'
              ? (it.total_paineis ?? 0)
              : (it.qtd ?? 0);
            return (
              <div
                key={variant + '-' + (variant === 'vendedor' ? it.user_id : it.cliente_id) + '-' + idx}
                className="flex items-center gap-2 min-w-0"
              >
                <span
                  className="inline-block w-3.5 h-3.5 shrink-0 rounded-[4px]"
                  style={{ backgroundColor: paleta[idx % paleta.length] }}
                />
                <span className="text-[12.5px] text-gray-700 font-medium truncate min-w-0">
                  {label}
                </span>
                <span className="ml-auto shrink-0 tabular-nums text-[12px] font-bold text-gray-700">
                  ({valor})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista abaixo (tabela) */}
      <div className="px-5 pb-5">
        {variant === 'vendedor'
          ? <VendasPorVendedorList itens={itens} totalGeral={totalGeral} />
          : <ReservasPorClienteList itens={itens} totalGeral={totalGeral} />}
      </div>
    </div>
  );
}
