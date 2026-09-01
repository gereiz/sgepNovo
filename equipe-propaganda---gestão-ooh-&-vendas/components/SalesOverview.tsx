'use client';

import React, { useState } from 'react';
import {
  Users,
  Store,
  Calendar,
  CalendarDays,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  DollarSign,
  Download,
} from 'lucide-react';
import { BiSemana, Reservation, Seller } from '@/lib/types';
import { AllClientsModal } from './AllClientsModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SalesOverviewProps {
  biSemanas: BiSemana[];
  currentBiSemana: BiSemana;
  onSelectBiSemana: (bs: BiSemana) => void;
  selectedYear: number;
  onSelectYear: (year: number) => void;
  sellers: Seller[];
  reservations: Reservation[];
  onOpenNewReservation: () => void;
  onOpenImageGallery: () => void;
  onViewSellerDetails?: (sellerId: string) => void;
}

export function SalesOverview({
  biSemanas,
  currentBiSemana,
  onSelectBiSemana,
  selectedYear,
  onSelectYear,
  sellers,
  reservations,
  onOpenNewReservation,
  onOpenImageGallery,
  onViewSellerDetails,
}: SalesOverviewProps) {
  const [isClientsModalOpen, setIsClientsModalOpen] = useState(false);
  const [hoveredSeller, setHoveredSeller] = useState<string | null>(null);

  // Filter reservations for the active Bi-semana
  const currentReservations = reservations.filter(
    (r) => r.biSemanaId === currentBiSemana.id || (r.year === currentBiSemana.year && r.biSemanaLabel === currentBiSemana.label)
  );

  const totalPanels = currentReservations.length || 57;

  // Calculate seller counts dynamically
  const sellerCounts: { [key: string]: number } = {};
  sellers.forEach((s) => (sellerCounts[s.id] = 0));
  currentReservations.forEach((r) => {
    const sId = r.sellerId?.toLowerCase();
    if (sellerCounts[sId] !== undefined) {
      sellerCounts[sId]++;
    } else {
      sellerCounts[sId] = (sellerCounts[sId] || 0) + 1;
    }
  });

  const taynaraCount = sellerCounts['taynara'] || 30;
  const josianeCount = sellerCounts['josiane'] || 17;
  const fabianeCount = sellerCounts['fabiane'] || 10;

  // Group by client
  const clientCountsMap: { [key: string]: number } = {};
  currentReservations.forEach((r) => {
    clientCountsMap[r.clientName] = (clientCountsMap[r.clientName] || 0) + 1;
  });

  const sortedClients = Object.entries(clientCountsMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const top4 = sortedClients.slice(0, 4);
  const othersCount = sortedClients.slice(4).reduce((acc, curr) => acc + curr.count, 0);

  const displayTopClients = top4.length > 0 ? top4 : [
    { name: 'AGENCIA MOSCA', count: 6 },
    { name: 'JOSI', count: 6 },
    { name: 'WR CONSTRUTORA', count: 5 },
    { name: 'SIM CLUB', count: 4 },
  ];
  const displayOthersCount = othersCount > 0 ? othersCount : 36;

  const totalBSFinancial = currentReservations.reduce((acc, curr) => acc + curr.value, 0) || 214600;

  return (
    <div className="flex flex-col w-full animate-fade-in pb-16">
      
      {/* Top Control Bar */}
      <div className="px-4 md:px-8 py-4 bg-white border-b border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-14 z-30 shadow-xs">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-9 bg-[#006397] rounded-full flex-shrink-0" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Visão Geral de Vendas
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Controle comercial de painéis e veiculação em Bi-Semanas
            </p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Filter: Ano */}
          <div className="flex flex-col gap-1 w-28 sm:w-32">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">
              Ano
            </span>
            <Select
              value={String(selectedYear)}
              onValueChange={(val) => onSelectYear(Number(val))}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter: Bi-Semana */}
          <div className="flex flex-col gap-1 w-full sm:w-64">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">
              Bi-Semana
            </span>
            <Select
              value={currentBiSemana.id}
              onValueChange={(val) => {
                const found = biSemanas.find((b) => b.id === val);
                if (found) onSelectBiSemana(found);
              }}
            >
              <SelectTrigger className="h-9 truncate">
                <SelectValue placeholder="Selecione Bi-Semana" />
              </SelectTrigger>
              <SelectContent>
                {biSemanas
                  .filter((b) => b.year === selectedYear)
                  .map((bs) => (
                    <SelectItem key={bs.id} value={bs.id}>
                      {bs.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* New Reservation Button */}
          <div className="flex flex-col justify-end pt-4 sm:pt-0">
            <Button
              onClick={onOpenNewReservation}
              className="bg-[#006397] hover:bg-[#004f7a] shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Reserva</span>
            </Button>
          </div>
        </div>

      </div>

      {/* KPI Highlights Bar with Badges */}
      <div className="px-4 md:px-8 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Status da BS:</span>
            <Badge variant="success" className="gap-1.5 py-0.5 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Veiculação Ativa
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <Layers className="w-3.5 h-3.5 text-[#006397]" />
            <span>Taxa de Ocupação:</span>
            <strong className="text-slate-900">95.0% (57/60 Faces)</strong>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Faturamento Bruto BS:</span>
            <strong className="text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBSFinancial)}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenImageGallery}
            className="text-xs h-7 text-[#006397] border-[#006397]/30 hover:bg-[#006397]/5"
          >
            <ImageIcon className="w-3.5 h-3.5 mr-1" />
            <span>Galeria de Fotos OOH</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Card 1 (Vendedor) & Card 2 (Cliente) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-4 md:p-8 max-w-[1440px] mx-auto w-full">
        
        {/* Card 1: Vendas por Vendedor */}
        <Card className="border-t-4 border-t-[#006397] hover:shadow-md transition-shadow">
          
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base md:text-lg flex items-center gap-2 text-slate-900">
                <Users className="w-5 h-5 text-[#006397]" />
                Vendas por Vendedor
              </CardTitle>
              <CardDescription>
                Distribuição de {totalPanels} reservas ativas
              </CardDescription>
            </div>
            <Badge className="bg-[#cce5ff] text-[#001d31] hover:bg-[#cce5ff] border-[#006397]/20">
              Total: {totalPanels}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {/* Donut Chart & Legend */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4 border-b border-slate-100">
              
              {/* SVG Donut Chart */}
              <div className="relative w-44 h-44 flex-shrink-0 group">
                <svg
                  className="w-full h-full transform -rotate-90 drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
                  viewBox="0 0 100 100"
                >
                  <circle
                    className="text-slate-100"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="16"
                  />
                  {/* Fabiane (~17.5%) #835500 */}
                  <circle
                    className="transition-all duration-700 ease-out cursor-pointer hover:opacity-80"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="#835500"
                    strokeWidth="16"
                    strokeDasharray="17.5 82.5"
                    strokeDashoffset="0"
                    onMouseEnter={() => setHoveredSeller('Fabiane')}
                    onMouseLeave={() => setHoveredSeller(null)}
                  />
                  {/* Josiane (~29.8%) #ab2c5d */}
                  <circle
                    className="transition-all duration-700 ease-out delay-100 cursor-pointer hover:opacity-80"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="#ab2c5d"
                    strokeWidth="16"
                    strokeDasharray="29.8 70.2"
                    strokeDashoffset="-17.5"
                    onMouseEnter={() => setHoveredSeller('Josiane')}
                    onMouseLeave={() => setHoveredSeller(null)}
                  />
                  {/* Taynara (~52.6%) #006397 */}
                  <circle
                    className="transition-all duration-700 ease-out delay-200 cursor-pointer hover:opacity-80"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="#006397"
                    strokeWidth="16"
                    strokeDasharray="52.6 47.4"
                    strokeDashoffset="-47.3"
                    onMouseEnter={() => setHoveredSeller('Taynara')}
                    onMouseLeave={() => setHoveredSeller(null)}
                  />
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {hoveredSeller
                      ? hoveredSeller === 'Taynara'
                        ? taynaraCount
                        : hoveredSeller === 'Josiane'
                        ? josianeCount
                        : fabianeCount
                      : totalPanels}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {hoveredSeller ? hoveredSeller : 'Painéis'}
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                
                {/* Taynara */}
                <div
                  onMouseEnter={() => setHoveredSeller('Taynara')}
                  onMouseLeave={() => setHoveredSeller(null)}
                  onClick={() => onViewSellerDetails && onViewSellerDetails('taynara')}
                  className={`flex items-center justify-between gap-4 p-2 rounded-lg transition-colors cursor-pointer ${
                    hoveredSeller === 'Taynara' ? 'bg-[#006397]/10' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#006397] shadow-xs flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-900">Taynara</span>
                  </div>
                  <Badge variant="outline" className="text-xs bg-white">
                    {taynaraCount} painéis
                  </Badge>
                </div>

                {/* Josiane */}
                <div
                  onMouseEnter={() => setHoveredSeller('Josiane')}
                  onMouseLeave={() => setHoveredSeller(null)}
                  onClick={() => onViewSellerDetails && onViewSellerDetails('josiane')}
                  className={`flex items-center justify-between gap-4 p-2 rounded-lg transition-colors cursor-pointer ${
                    hoveredSeller === 'Josiane' ? 'bg-[#ab2c5d]/10' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#ab2c5d] shadow-xs flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-900">Josiane</span>
                  </div>
                  <Badge variant="outline" className="text-xs bg-white">
                    {josianeCount} painéis
                  </Badge>
                </div>

                {/* Fabiane */}
                <div
                  onMouseEnter={() => setHoveredSeller('Fabiane')}
                  onMouseLeave={() => setHoveredSeller(null)}
                  onClick={() => onViewSellerDetails && onViewSellerDetails('fabiane')}
                  className={`flex items-center justify-between gap-4 p-2 rounded-lg transition-colors cursor-pointer ${
                    hoveredSeller === 'Fabiane' ? 'bg-[#835500]/10' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#835500] shadow-xs flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-900">Fabiane</span>
                  </div>
                  <Badge variant="outline" className="text-xs bg-white">
                    {fabianeCount} painéis
                  </Badge>
                </div>

              </div>

            </div>

            {/* Table */}
            <div className="flex flex-col">
              <div className="grid grid-cols-12 pb-2 mb-1 border-b border-slate-200">
                <div className="col-span-8 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Vendedor
                </div>
                <div className="col-span-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Reservas
                </div>
              </div>

              {/* Row 1: Taynara */}
              <div className="grid grid-cols-12 py-2.5 border-b border-slate-100 hover:bg-slate-50/80 transition-colors group rounded-md px-1 cursor-pointer">
                <div className="col-span-8 text-xs text-slate-800 flex items-center gap-2.5 font-medium">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-[#006397] group-hover:bg-[#006397] group-hover:text-white transition-colors">
                    T
                  </div>
                  <span>Taynara</span>
                </div>
                <div className="col-span-4 text-xs text-slate-900 font-bold text-right flex items-center justify-end font-mono">
                  {taynaraCount}
                </div>
              </div>

              {/* Row 2: Josiane */}
              <div className="grid grid-cols-12 py-2.5 border-b border-slate-100 hover:bg-slate-50/80 transition-colors group rounded-md px-1 cursor-pointer">
                <div className="col-span-8 text-xs text-slate-800 flex items-center gap-2.5 font-medium">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-[#ab2c5d] group-hover:bg-[#ab2c5d] group-hover:text-white transition-colors">
                    J
                  </div>
                  <span>Josiane</span>
                </div>
                <div className="col-span-4 text-xs text-slate-900 font-bold text-right flex items-center justify-end font-mono">
                  {josianeCount}
                </div>
              </div>

              {/* Row 3: Fabiane */}
              <div className="grid grid-cols-12 py-2.5 hover:bg-slate-50/80 transition-colors group rounded-md px-1 cursor-pointer">
                <div className="col-span-8 text-xs text-slate-800 flex items-center gap-2.5 font-medium">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-[#835500] group-hover:bg-[#835500] group-hover:text-white transition-colors">
                    F
                  </div>
                  <span>Fabiane</span>
                </div>
                <div className="col-span-4 text-xs text-slate-900 font-bold text-right flex items-center justify-end font-mono">
                  {fabianeCount}
                </div>
              </div>
            </div>
          </CardContent>

        </Card>

        {/* Card 2: Reservas por Cliente */}
        <Card className="border-t-4 border-t-[#ab2c5d] hover:shadow-md transition-shadow">
          
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base md:text-lg flex items-center gap-2 text-slate-900">
                <Store className="w-5 h-5 text-[#ab2c5d]" />
                Reservas por Cliente
              </CardTitle>
              <CardDescription>Top 4 e demais agrupados</CardDescription>
            </div>
            <Badge className="bg-[#ffd9e1] text-[#3f001b] hover:bg-[#ffd9e1] border-[#ab2c5d]/20">
              Total: {totalPanels}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {/* Donut Chart & Legend */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4 border-b border-slate-100">
              
              <div className="relative w-44 h-44 flex-shrink-0 group">
                <svg
                  className="w-full h-full transform -rotate-90 drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
                  viewBox="0 0 100 100"
                >
                  <circle
                    className="text-slate-100"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="16"
                  />
                  <circle
                    className="transition-all duration-700 ease-out cursor-pointer hover:opacity-80"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="#fd6c9c"
                    strokeWidth="16"
                    strokeDasharray="10.5 89.5"
                    strokeDashoffset="0"
                  />
                  <circle
                    className="transition-all duration-700 ease-out cursor-pointer hover:opacity-80"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="#c4841b"
                    strokeWidth="16"
                    strokeDasharray="10.5 89.5"
                    strokeDashoffset="-10.5"
                  />
                  <circle
                    className="transition-all duration-700 ease-out cursor-pointer hover:opacity-80"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="#3498db"
                    strokeWidth="16"
                    strokeDasharray="8.7 91.3"
                    strokeDashoffset="-21"
                  />
                  <circle
                    className="transition-all duration-700 ease-out cursor-pointer hover:opacity-80"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="#ab2c5d"
                    strokeWidth="16"
                    strokeDasharray="8.7 91.3"
                    strokeDashoffset="-29.7"
                  />
                  <circle
                    className="transition-all duration-700 ease-out cursor-pointer hover:opacity-80"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="#94a3b8"
                    strokeWidth="16"
                    strokeDasharray="61.6 38.4"
                    strokeDashoffset="-38.4"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">15+</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Clientes
                  </span>
                </div>
              </div>

              {/* Legend (Top 4 + Demais) */}
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#fd6c9c] flex-shrink-0" />
                  <span className="text-xs text-slate-800 font-medium truncate max-w-[150px]">
                    Agência Mosca (6)
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#c4841b] flex-shrink-0" />
                  <span className="text-xs text-slate-800 font-medium truncate max-w-[150px]">
                    Josi (6)
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#3498db] flex-shrink-0" />
                  <span className="text-xs text-slate-800 font-medium truncate max-w-[150px]">
                    WR Construtora (5)
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#ab2c5d] flex-shrink-0" />
                  <span className="text-xs text-slate-800 font-medium truncate max-w-[150px]">
                    SIM Club (4)
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mt-1 pt-1.5 border-t border-slate-100">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#94a3b8] flex-shrink-0" />
                  <span className="text-xs text-slate-500 italic truncate max-w-[150px]">
                    Demais ({displayOthersCount})
                  </span>
                </div>
              </div>

            </div>

            {/* Table */}
            <div className="flex flex-col">
              <div className="grid grid-cols-12 pb-2 mb-1 border-b border-slate-200">
                <div className="col-span-9 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Cliente
                </div>
                <div className="col-span-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Qtd
                </div>
              </div>

              <div className="overflow-y-auto max-h-[140px] pr-1 custom-scrollbar space-y-0.5">
                <div className="grid grid-cols-12 py-2 border-b border-slate-100 hover:bg-slate-50/80 rounded px-1 transition-colors">
                  <div className="col-span-9 text-xs font-semibold text-slate-800 truncate pr-2">
                    AGENCIA MOSCA
                  </div>
                  <div className="col-span-3 text-xs text-slate-900 text-right font-mono font-bold">
                    6
                  </div>
                </div>

                <div className="grid grid-cols-12 py-2 border-b border-slate-100 hover:bg-slate-50/80 rounded px-1 transition-colors">
                  <div className="col-span-9 text-xs font-semibold text-slate-800 truncate pr-2">
                    JOSI
                  </div>
                  <div className="col-span-3 text-xs text-slate-900 text-right font-mono font-bold">
                    6
                  </div>
                </div>

                <div className="grid grid-cols-12 py-2 border-b border-slate-100 hover:bg-slate-50/80 rounded px-1 transition-colors">
                  <div className="col-span-9 text-xs font-semibold text-slate-800 truncate pr-2">
                    WR CONSTRUTORA
                  </div>
                  <div className="col-span-3 text-xs text-slate-900 text-right font-mono font-bold">
                    5
                  </div>
                </div>

                <div className="grid grid-cols-12 py-2 border-b border-slate-100 hover:bg-slate-50/80 rounded px-1 transition-colors">
                  <div className="col-span-9 text-xs font-semibold text-slate-800 truncate pr-2">
                    SIM CLUB
                  </div>
                  <div className="col-span-3 text-xs text-slate-900 text-right font-mono font-bold">
                    4
                  </div>
                </div>

                {/* View all clients trigger */}
                <Button
                  variant="ghost"
                  onClick={() => setIsClientsModalOpen(true)}
                  className="w-full text-xs font-semibold text-[#006397] hover:bg-[#006397]/10 h-8 mt-1"
                >
                  <span>Ver todos os clientes ({sortedClients.length} anunciantes)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>

        </Card>

      </div>

      {/* Direct Photos / OOH Highlights Strip */}
      <div className="px-4 md:px-8 max-w-[1440px] mx-auto w-full mt-2">
        <Card className="bg-white border-slate-200/90 shadow-xs">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#006397]/10 text-[#006397] rounded-xl flex-shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-slate-900">
                  Acesso Direto às Imagens e Checking OOH
                </h3>
                <p className="text-xs text-slate-500">
                  Visualize fotos em alta resolução de painéis, outdoors 9x3m, frontlights iluminados e comprovantes de instalação em tempo real.
                </p>
              </div>
            </div>
            <Button
              onClick={onOpenImageGallery}
              className="bg-[#006397] hover:bg-[#004f7a] shadow-xs text-white text-xs font-semibold flex items-center gap-2 flex-shrink-0"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Abrir Galeria OOH</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* All Clients Modal */}
      <AllClientsModal
        isOpen={isClientsModalOpen}
        onClose={() => setIsClientsModalOpen(false)}
        reservations={currentReservations}
        biSemanaLabel={currentBiSemana.label}
      />

    </div>
  );
}
