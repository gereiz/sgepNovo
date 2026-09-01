'use client';

import React, { useState } from 'react';
import { Search, Building2, TrendingUp, DollarSign } from 'lucide-react';
import { Reservation } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AllClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  biSemanaLabel: string;
  onSelectClient?: (clientName: string) => void;
}

export function AllClientsModal({
  isOpen,
  onClose,
  reservations,
  biSemanaLabel,
  onSelectClient,
}: AllClientsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('all');

  // Aggregate by client
  const clientMap = new Map<string, { count: number; totalValue: number; sellers: Set<string>; types: Set<string> }>();

  reservations.forEach((r) => {
    const existing = clientMap.get(r.clientName) || {
      count: 0,
      totalValue: 0,
      sellers: new Set<string>(),
      types: new Set<string>(),
    };
    existing.count += 1;
    existing.totalValue += r.value;
    existing.sellers.add(r.sellerName);
    existing.types.add(r.panelType);
    clientMap.set(r.clientName, existing);
  });

  const clientList = Array.from(clientMap.entries())
    .map(([clientName, data]) => ({
      name: clientName,
      count: data.count,
      totalValue: data.totalValue,
      sellers: Array.from(data.sellers),
      types: Array.from(data.types),
      percentage: Math.round((data.count / (reservations.length || 1)) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  const filteredClients = clientList.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeller = selectedSeller === 'all' || c.sellers.includes(selectedSeller);
    return matchesSearch && matchesSeller;
  });

  const totalPanelsCount = reservations.length;
  const totalFinancialValue = reservations.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#006397]/40 text-sky-200">
              <Building2 className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <DialogTitle className="font-semibold text-lg text-white">
                Todos os Clientes e Reservas
              </DialogTitle>
              <p className="text-xs text-slate-300 mt-0.5">
                {biSemanaLabel} • {clientList.length} clientes ativos com {totalPanelsCount} painéis
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200">
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-[#006397]/10 rounded-lg text-[#006397]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Total de Clientes</div>
                <div className="text-sm font-bold text-slate-900">{clientList.length} anunciantes</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-[#ab2c5d]/10 rounded-lg text-[#ab2c5d]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Painéis Reservados</div>
                <div className="text-sm font-bold text-slate-900">{totalPanelsCount} faces</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Valor Total da BS</div>
                <div className="text-sm font-bold text-emerald-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFinancialValue)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 bg-white gap-3 border-b border-slate-200">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Filtrar Vendedor:</span>
            <div className="w-48">
              <Select value={selectedSeller} onValueChange={(val) => setSelectedSeller(val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Vendedores</SelectItem>
                  <SelectItem value="Taynara">Taynara</SelectItem>
                  <SelectItem value="Josiane">Josiane</SelectItem>
                  <SelectItem value="Fabiane">Fabiane</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[50vh]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">#</th>
                <th className="pb-3">Cliente Anunciante</th>
                <th className="pb-3">Vendedor Responsável</th>
                <th className="pb-3">Formatos Mídia</th>
                <th className="pb-3 text-right">Painéis</th>
                <th className="pb-3 text-right">% Quota</th>
                <th className="pb-3 text-right pr-2">Investimento Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client, idx) => (
                <tr
                  key={client.name}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => {
                    if (onSelectClient) {
                      onSelectClient(client.name);
                      onClose();
                    }
                  }}
                >
                  <td className="py-3 pl-2 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-[#006397]">
                      {client.name.charAt(0)}
                    </div>
                    <span>{client.name}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {client.sellers.map((seller) => (
                        <Badge
                          key={seller}
                          className={`text-[10px] font-medium border-0 ${
                            seller === 'Taynara'
                              ? 'bg-[#006397]/15 text-[#006397]'
                              : seller === 'Josiane'
                              ? 'bg-[#ab2c5d]/15 text-[#ab2c5d]'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {seller}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-slate-600">
                    <div className="flex gap-1 flex-wrap">
                      {client.types.slice(0, 2).map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px] font-normal">
                          {t}
                        </Badge>
                      ))}
                      {client.types.length > 2 && (
                        <span className="text-[10px] text-slate-400">+{client.types.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md font-mono">{client.count}</span>
                  </td>
                  <td className="py-3 text-right font-mono text-slate-500">{client.percentage}%</td>
                  <td className="py-3 text-right font-semibold text-emerald-700 pr-2 font-mono">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.totalValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nenhum cliente encontrado com os filtros atuais.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Exibindo {filteredClients.length} de {clientList.length} clientes
          </div>
          <Button
            onClick={onClose}
            className="bg-[#006397] hover:bg-[#004f7a]"
          >
            Fechar
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
