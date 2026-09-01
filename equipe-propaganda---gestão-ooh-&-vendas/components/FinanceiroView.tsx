'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Calendar,
  FileText,
  CreditCard,
  Building,
  TrendingUp,
} from 'lucide-react';
import { BiSemana, Reservation, Seller } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface FinanceiroViewProps {
  reservations: Reservation[];
  sellers: Seller[];
  currentBiSemana: BiSemana;
}

export function FinanceiroView({ reservations, sellers, currentBiSemana }: FinanceiroViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const currentReservations = reservations.filter((r) => r.biSemanaId === currentBiSemana.id);

  const totalBilling = currentReservations.reduce((acc, curr) => acc + curr.value, 0);
  const paidBilling = Math.round(totalBilling * 0.72);
  const pendingBilling = totalBilling - paidBilling;

  return (
    <div className="flex flex-col w-full animate-fade-in pb-16">
      
      {/* Header */}
      <div className="px-4 md:px-8 py-4 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-14 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-9 bg-emerald-600 rounded-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Financeiro e Faturamento por Bi-Semana
            </h1>
            <p className="text-xs text-slate-500">
              Controle de cobranças, recebimentos de anunciantes e comissões da equipe
            </p>
          </div>
        </div>

        <Button
          onClick={() => alert('Arquivo de remessa e notas fiscais geradas com sucesso!')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Emitir Faturas da BS</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 md:p-8 max-w-[1440px] mx-auto w-full">
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Faturado</span>
              <DollarSign className="w-4 h-4 text-[#006397]" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBilling)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{currentBiSemana.label}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Recebido / Liquidado</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 font-mono">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(paidBilling)}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">72% liquidado</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">A Receber / Em Aberto</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-700 font-mono">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pendingBilling)}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Vencimento em 5 dias</div>
          </CardContent>
        </Card>

      </div>

      {/* Financial Breakdown Table */}
      <div className="px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <Card className="border-slate-200 overflow-hidden shadow-xs">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-sm text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Títulos e Contratos a Receber ({currentBiSemana.label})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 text-xs bg-white"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Contrato</th>
                  <th className="py-3 px-4">Cliente / Sacado</th>
                  <th className="py-3 px-4">Vendedora</th>
                  <th className="py-3 px-4">Painel</th>
                  <th className="py-3 px-4">Vencimento</th>
                  <th className="py-3 px-4">Status Pagamento</th>
                  <th className="py-3 px-4 text-right">Valor Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentReservations
                  .filter((r) => r.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(0, 15)
                  .map((r, idx) => {
                    const isPaid = idx % 3 !== 0;
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-[#006397]">{r.code}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{r.clientName}</td>
                        <td className="py-3 px-4 text-slate-500">{r.sellerName}</td>
                        <td className="py-3 px-4 font-mono text-slate-700">{r.panelCode}</td>
                        <td className="py-3 px-4 text-slate-500">25/04/2025</td>
                        <td className="py-3 px-4">
                          {isPaid ? (
                            <Badge variant="success">Liquidado</Badge>
                          ) : (
                            <Badge variant="warning">Aguardando Pagamento</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(r.value)}
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
