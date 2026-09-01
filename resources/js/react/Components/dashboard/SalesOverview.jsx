import React, { useMemo } from 'react';
import { KpiCard } from '@/react/Components/dashboard/KpiCard';
import {
  MonitorSmartphone,
  Users2,
  FileBarChart2,
  Wallet,
  Receipt,
  Layers,
  CalendarRange,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/react/Components/ui/card';
import { Select } from '@/react/Components/ui/select';
import { Input } from '@/react/Components/ui/input';
import { Button } from '@/react/Components/ui/button';
import { Badge } from '@/react/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/react/Components/ui/tabs';
import { cn, formatCurrencyBRL, formatDateBR, formatNumberBR } from '@/react/lib/utils';

export function SalesOverview({
  anos = [],
  bisemanas = [],
  anoAtual,
  bisemanaAtualId,
  onChangeAno,
  onChangeBisemana,
  currentBiSemana = null,
  stats = null,
  ultimasReservas = [],
  proximosPis = [],
}) {
  const kpiItems = useMemo(() => {
    if (!stats) return [];
    return [
      {
        title: 'Total de Painéis',
        value: formatNumberBR(stats.total_paineis ?? 0),
        description: 'Cadastrados ativos no sistema',
        icon: MonitorSmartphone,
        trend: 0,
        variant: 'primary',
        badgeText: `${formatNumberBR(stats.total_paineis_convencionais ?? 0)} Conv.`,
        badgeVariant: 'outline',
        footer: `${formatNumberBR(stats.total_paineis_led ?? 0)} LEDs`,
      },
      {
        title: 'Clientes Ativos',
        value: formatNumberBR(stats.total_clientes ?? 0),
        description: 'Empresas com reserva no período',
        icon: Users2,
        trend: 3.2,
        variant: 'success',
        badgeText: stats.total_clientes_novos_mes ? `${stats.total_clientes_novos_mes} novos este mês` : null,
        badgeVariant: 'success',
      },
      {
        title: 'Reservas (BS atual)',
        value: formatNumberBR(stats.total_reservas_bs_atual ?? 0),
        description: 'Bi-semana selecionada ativa',
        icon: CalendarRange,
        trend: 12.5,
        variant: 'warning',
        badgeText: currentBiSemana
          ? `BS ${currentBiSemana.num_bisemana} - ${formatDateBR(currentBiSemana.inicio)}`
          : null,
        badgeVariant: 'warning',
        footer: currentBiSemana ? `fim ${formatDateBR(currentBiSemana.fim)}` : null,
      },
      {
        title: 'Faturamento PI',
        value: formatCurrencyBRL(stats.total_vl_pi ?? 0),
        description: 'Total em pedidos de inserção no período',
        icon: Wallet,
        trend: 8.7,
        variant: 'primary',
        badgeText: stats.total_pis_emitidos ? `${stats.total_pis_emitidos} PIs emitidos` : null,
        badgeVariant: 'default',
      },
      {
        title: 'Comissões a Pagar',
        value: formatCurrencyBRL(stats.total_comissoes ?? 0),
        description: 'Baseado em vendas fechadas',
        icon: Receipt,
        trend: -1.4,
        variant: 'destructive',
        badgeText: stats.total_comissoes_pagas ? `Pagas ${formatCurrencyBRL(stats.total_comissoes_pagas)}` : null,
        badgeVariant: 'success',
      },
      {
        title: 'Painéis LED',
        value: formatNumberBR(stats.total_paineis_led ?? 0),
        description: 'Gestão dedicada de LEDs',
        icon: Sparkles,
        trend: 22,
        variant: 'primary',
        badgeText: stats.total_reservas_led ? `${formatNumberBR(stats.total_reservas_led)} reservas` : null,
        badgeVariant: 'default',
        footer: stats.contratos_proximos_termino ? `${formatNumberBR(stats.contratos_proximos_termino)} ⚠ próximos` : null,
      },
    ];
  }, [stats, currentBiSemana]);

  return (
    <div className="w-full space-y-5">
      {/* Filter Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Ano</label>
              <Select value={anoAtual || ''} onChange={(e) => onChangeAno && onChangeAno(e.target.value)}>
                {anos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.ano_bisemana}
                  </option>
                ))}
              </Select>
            </div>
            <div className="lg:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                Bi-semana Atual
              </label>
              <Select value={bisemanaAtualId || ''} onChange={(e) => onChangeBisemana && onChangeBisemana(e.target.value)}>
                {bisemanas.map((b) => (
                  <option key={b.id} value={b.id}>
                    BS {b.num_bisemana} — {formatDateBR(b.inicio)} / {formatDateBR(b.fim)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Busca rápida</label>
              <Input type="search" placeholder="Cliente, campanha, painel..." />
            </div>
            <div className="lg:col-span-2 flex gap-2">
              <Button variant="primary" className="flex-1">
                <Layers className="w-4 h-4" /> Aplicar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {kpiItems.map((kpi, idx) => (
          <KpiCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Tabs: Últimas reservas / Próximos PIs */}
      <Tabs defaultValue="reservas" className="w-full">
        <TabsList className="mb-3">
          <TabsTrigger value="reservas">
            <FileBarChart2 className="w-4 h-4 mr-2" /> Últimas reservas
          </TabsTrigger>
          <TabsTrigger value="pis">
            <Receipt className="w-4 h-4 mr-2" /> Próximos PIs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reservas">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 flex flex-wrap flex-row items-center justify-between gap-3">
              <CardTitle className="text-lg font-black">Reservas recentes</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Convencional</Badge>
                <Badge variant="secondary">LED</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full overflow-x-auto border border-outline-variant rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-surface-container text-[11px] uppercase tracking-wide">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-bold text-on-surface-variant">Painel</th>
                      <th className="px-3 py-2.5 text-left font-bold text-on-surface-variant">Cliente</th>
                      <th className="px-3 py-2.5 text-left font-bold text-on-surface-variant">Campanha</th>
                      <th className="px-3 py-2.5 text-left font-bold text-on-surface-variant">Bi-semana</th>
                      <th className="px-3 py-2.5 text-right font-bold text-on-surface-variant">Valor PI</th>
                      <th className="px-3 py-2.5 text-center font-bold text-on-surface-variant">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {ultimasReservas.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-on-surface-variant text-sm">
                          Nenhuma reserva encontrada no período
                        </td>
                      </tr>
                    ) : (
                      ultimasReservas.map((r) => (
                        <tr key={r.id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {r.is_led ? (
                                <Badge variant="default" className="text-[10px] font-bold">LED</Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] font-bold">Conv</Badge>
                              )}
                              <span className="font-bold">#{r.painel_ident ?? r.id}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 max-w-[180px] truncate" title={r.cliente_nome}>
                            {r.cliente_nome ?? '—'}
                          </td>
                          <td className="px-3 py-2.5 max-w-[160px] truncate" title={r.campanha}>
                            {r.campanha ?? '—'}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-xs">
                            <Badge variant="outline" className="font-semibold">BS {r.num_bisemana ?? '—'}</Badge>
                            <div className="mt-0.5 text-[10px] text-on-surface-variant">
                              {r.bisemana_inicio ? formatDateBR(r.bisemana_inicio) : ''}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-right font-bold tabular-nums">
                            {formatCurrencyBRL(r.vl_pi ?? 0)}
                          </td>
                          <td className="px-3 py-2.5 text-center whitespace-nowrap">
                            {r.pi_ok ? (
                              <Badge variant="success" className="font-bold text-[10px]">PI #{r.pi_id}</Badge>
                            ) : (
                              <Badge variant="warning" className="font-bold text-[10px]">Aguardando PI</Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pis">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 flex flex-wrap flex-row items-center justify-between gap-3">
              <CardTitle className="text-lg font-black">Pedidos de Inserção</CardTitle>
              <Badge variant="outline">
                {proximosPis.filter(p => (p.status_pagamento || 'PENDENTE') !== 'QUITADO').length} em aberto
              </Badge>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full overflow-x-auto border border-outline-variant rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-surface-container text-[11px] uppercase tracking-wide">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-bold text-on-surface-variant">PI</th>
                      <th className="px-3 py-2.5 text-left font-bold text-on-surface-variant">Cliente</th>
                      <th className="px-3 py-2.5 text-left font-bold text-on-surface-variant">Campanha</th>
                      <th className="px-3 py-2.5 text-left font-bold text-on-surface-variant">Bi-semana</th>
                      <th className="px-3 py-2.5 text-right font-bold text-on-surface-variant">Valor</th>
                      <th className="px-3 py-2.5 text-center font-bold text-on-surface-variant">Pagamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {proximosPis.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-on-surface-variant text-sm">
                          Nenhum PI encontrado
                        </td>
                      </tr>
                    ) : (
                      proximosPis.map((p) => (
                        <tr key={p.id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="px-3 py-2.5 whitespace-nowrap font-bold">#{p.id}</td>
                          <td className="px-3 py-2.5 max-w-[200px] truncate">{p.cliente_nome ?? '—'}</td>
                          <td className="px-3 py-2.5 max-w-[160px] truncate">{p.campanha ?? '—'}</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-xs">
                            BS {p.num_bisemana ?? '—'}
                          </td>
                          <td className="px-3 py-2.5 text-right font-bold tabular-nums">
                            {formatCurrencyBRL(p.vl_total ?? 0)}
                          </td>
                          <td className="px-3 py-2.5 text-center whitespace-nowrap">
                            {String(p.status_pagamento || 'PENDENTE').toUpperCase() === 'QUITADO' ? (
                              <Badge variant="success" className="font-bold text-[10px]">Pago</Badge>
                            ) : (
                              <Badge variant="destructive" className="font-bold text-[10px]">Em aberto</Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
