'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Download,
} from 'lucide-react';
import { BiSemana, Reservation, Seller } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VendasViewProps {
  reservations: Reservation[];
  biSemanas: BiSemana[];
  currentBiSemana: BiSemana;
  onSelectBiSemana: (bs: BiSemana) => void;
  sellers: Seller[];
  onOpenNewReservation: () => void;
  onOpenImageViewer: (res: Reservation) => void;
}

export function VendasView({
  reservations,
  biSemanas,
  currentBiSemana,
  onSelectBiSemana,
  sellers,
  onOpenNewReservation,
  onOpenImageViewer,
}: VendasViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesBS = r.biSemanaId === currentBiSemana.id;
    const matchesSearch =
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.panelCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeller = selectedSeller === 'all' || r.sellerName === selectedSeller;
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;

    return matchesBS && matchesSearch && matchesSeller && matchesStatus;
  });

  const totalValue = filteredReservations.reduce((acc, curr) => acc + curr.value, 0);

  const handleCopyLink = (e: React.MouseEvent, res: Reservation) => {
    e.stopPropagation();
    const link = res.checkingPhotoUrl || res.artImageUrl || '';
    navigator.clipboard.writeText(link);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col w-full animate-fade-in pb-16">
      
      {/* Header */}
      <div className="px-4 md:px-8 py-4 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-14 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-9 bg-[#006397] rounded-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Contratos e Reservas de Mídia
            </h1>
            <p className="text-xs text-slate-500">
              {currentBiSemana.label} • {filteredReservations.length} reservas registradas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onOpenNewReservation}
            className="bg-[#006397] hover:bg-[#004f7a] shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Reserva</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 md:px-8 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar por cliente, painel ou campanha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* BS Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Bi-Semana:</span>
            <div className="w-64">
              <Select
                value={currentBiSemana.id}
                onValueChange={(val) => {
                  const found = biSemanas.find((b) => b.id === val);
                  if (found) onSelectBiSemana(found);
                }}
              >
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder="Bi-Semana" />
                </SelectTrigger>
                <SelectContent>
                  {biSemanas.map((bs) => (
                    <SelectItem key={bs.id} value={bs.id}>
                      {bs.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seller Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Vendedor:</span>
            <div className="w-48">
              <Select value={selectedSeller} onValueChange={(val) => setSelectedSeller(val)}>
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder="Vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Vendedores</SelectItem>
                  {sellers.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="px-4 md:px-8 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-slate-600">
          <span>
            Exibindo <strong>{filteredReservations.length}</strong> reservas
          </span>
          <span>•</span>
          <span>
            Valor Total Filtrado:{' '}
            <strong className="text-emerald-700 font-mono">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
            </strong>
          </span>
        </div>
      </div>

      {/* Table of Reservations */}
      <div className="p-4 md:p-8 max-w-[1440px] mx-auto w-full overflow-x-auto">
        <Card className="border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Código / Contrato</th>
                <th className="py-3 px-4">Cliente Anunciante</th>
                <th className="py-3 px-4">Painel & Local</th>
                <th className="py-3 px-4">Formato</th>
                <th className="py-3 px-4">Vendedor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Imagens OOH</th>
                <th className="py-3 px-4 text-right">Valor BS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReservations.map((res) => (
                <tr
                  key={res.id}
                  onClick={() => onOpenImageViewer(res)}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  {/* Code */}
                  <td className="py-3 px-4 font-mono font-bold text-[#006397]">
                    {res.code}
                  </td>

                  {/* Client & Campaign */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{res.clientName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                      {res.campaignTitle}
                    </div>
                  </td>

                  {/* Panel & Location */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 font-mono">{res.panelCode}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                      {res.addressTitle}
                    </div>
                  </td>

                  {/* Format */}
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-[11px] bg-slate-50 font-medium">
                      {res.panelType}
                    </Badge>
                  </td>

                  {/* Seller */}
                  <td className="py-3 px-4">
                    <Badge
                      className={`text-[11px] font-semibold border-0 ${
                        res.sellerName === 'Taynara'
                          ? 'bg-[#006397]/15 text-[#006397]'
                          : res.sellerName === 'Josiane'
                          ? 'bg-[#ab2c5d]/15 text-[#ab2c5d]'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {res.sellerName}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <Badge variant="success" className="gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {res.status}
                    </Badge>
                  </td>

                  {/* Direct Image Links */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenImageViewer(res)}
                        className="h-6 px-2 text-[11px] text-[#006397] border-[#006397]/30 hover:bg-[#006397]/10"
                        title="Ver foto de checking"
                      >
                        <ImageIcon className="w-3 h-3 mr-1" />
                        <span>Foto OOH</span>
                      </Button>
                      <button
                        onClick={(e) => handleCopyLink(e, res)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Copiar link direto da imagem"
                      >
                        {copiedId === res.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Value */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(res.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReservations.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nenhuma reserva encontrada para esta Bi-Semana com os filtros selecionados.
            </div>
          )}
        </Card>
      </div>

    </div>
  );
}
