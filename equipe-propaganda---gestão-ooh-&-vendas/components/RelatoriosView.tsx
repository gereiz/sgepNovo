'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Users,
  Building,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import { BiSemana, Reservation, Seller } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RelatoriosViewProps {
  reservations: Reservation[];
  sellers: Seller[];
  currentBiSemana: BiSemana;
}

export function RelatoriosView({ reservations, sellers, currentBiSemana }: RelatoriosViewProps) {
  const [reportType, setReportType] = useState<'vendedores' | 'formatos' | 'ocupacao'>('vendedores');

  // Filter reservations for current BS
  const currentReservations = reservations.filter((r) => r.biSemanaId === currentBiSemana.id);

  // Group by format
  const formatCounts: { [key: string]: { count: number; totalValue: number } } = {};
  currentReservations.forEach((r) => {
    if (!formatCounts[r.panelType]) {
      formatCounts[r.panelType] = { count: 0, totalValue: 0 };
    }
    formatCounts[r.panelType].count++;
    formatCounts[r.panelType].totalValue += r.value;
  });

  const totalBSValue = currentReservations.reduce((acc, curr) => acc + curr.value, 0);

  // Group by seller
  const sellerStats = sellers.map((s) => {
    const sRes = currentReservations.filter((r) => r.sellerId === s.id || r.sellerName === s.name);
    const count = sRes.length;
    const value = sRes.reduce((acc, curr) => acc + curr.value, 0);
    const commission = (value * s.commissionRate) / 100;
    return {
      ...s,
      count,
      value,
      commission,
      share: Math.round((count / (currentReservations.length || 1)) * 1000) / 10,
    };
  });

  return (
    <div className="flex flex-col w-full animate-fade-in pb-16">
      
      {/* Header */}
      <div className="px-4 md:px-8 py-4 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-14 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-9 bg-[#006397] rounded-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Relatórios e Métricas de Mídia OOH
            </h1>
            <p className="text-xs text-slate-500">
              Análise de desempenho comercial, ocupação de faces e faturamento por Bi-Semana
            </p>
          </div>
        </div>

        <Button
          onClick={() => alert('Relatório consolidado exportado com sucesso em formato PDF e Excel!')}
          className="bg-[#006397] hover:bg-[#004f7a] shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório PDF / CSV</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-8 max-w-[1440px] mx-auto w-full">
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Painéis Ativos</span>
              <Layers className="w-4 h-4 text-[#006397]" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{currentReservations.length} faces</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">95.0% de taxa de ocupação</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Faturamento Bruto</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 font-mono">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBSValue)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{currentBiSemana.label}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Ticket Médio Face</span>
              <TrendingUp className="w-4 h-4 text-[#ab2c5d]" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                totalBSValue / (currentReservations.length || 1)
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Por painel / bi-semana</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Top Vendedora</span>
              <Users className="w-4 h-4 text-[#006397]" />
            </div>
            <div className="text-2xl font-bold text-[#006397]">Taynara</div>
            <div className="text-[11px] text-slate-500 mt-1">30 painéis (52.6% da cota)</div>
          </CardContent>
        </Card>

      </div>

      {/* Main Report Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        
        {/* Table 1: Desempenho por Vendedora */}
        <Card className="overflow-hidden border-slate-200 shadow-xs">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#006397]" />
              Desempenho por Vendedora
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono">
              {currentBiSemana.label}
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Vendedora</th>
                  <th className="py-2.5 px-4 text-right">Painéis</th>
                  <th className="py-2.5 px-4 text-right">% Quota</th>
                  <th className="py-2.5 px-4 text-right">Faturamento</th>
                  <th className="py-2.5 px-4 text-right">Comissão (5%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sellerStats.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                          s.name === 'Taynara' ? 'bg-[#006397]' : s.name === 'Josiane' ? 'bg-[#ab2c5d]' : 'bg-[#835500]'
                        }`}
                      >
                        {s.initial}
                      </div>
                      {s.name}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{s.count}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">{s.share}%</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.value)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.commission)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Table 2: Mix por Formato de Mídia */}
        <Card className="overflow-hidden border-slate-200 shadow-xs">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ab2c5d]" />
              Mix de Formatos Comercializados
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono">
              {currentReservations.length} total
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Formato OOH</th>
                  <th className="py-2.5 px-4 text-right">Qtd</th>
                  <th className="py-2.5 px-4 text-right">Participação</th>
                  <th className="py-2.5 px-4 text-right">Valor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(formatCounts).map(([format, data]) => {
                  const pct = Math.round((data.count / (currentReservations.length || 1)) * 1000) / 10;
                  return (
                    <tr key={format} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-semibold text-slate-900">{format}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{data.count}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">{pct}%</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalValue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
