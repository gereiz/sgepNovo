'use client';

import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Tv,
  Sun,
  Eye,
  CheckCircle,
  Copy,
  ExternalLink,
  Check,
  Zap,
  MapPin,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { Panel, PanelType } from '@/lib/types';
import { SAMPLE_OOH_IMAGES } from '@/lib/mock-data';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PaineisViewProps {
  panels: Panel[];
  onOpenImageViewer: (panel: Panel) => void;
  onAddPanel: (newPanel: Panel) => void;
  onQuickBook: (panel: Panel) => void;
}

export function PaineisView({
  panels,
  onOpenImageViewer,
  onAddPanel,
  onQuickBook,
}: PaineisViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New panel form
  const [newCode, setNewCode] = useState(`EP-${String(panels.length + 1).padStart(3, '0')}`);
  const [newAddress, setNewAddress] = useState('Av. Brigadeiro Faria Lima, 2000');
  const [newNeighborhood, setNewNeighborhood] = useState('Pinheiros');
  const [newCity, setNewCity] = useState('São Paulo - SP');
  const [newType, setNewType] = useState<PanelType>('Outdoor 9x3');
  const [newDimensions, setNewDimensions] = useState('9.00 x 3.00m');
  const [newLighting, setNewLighting] = useState<'Iluminado' | 'Sem Iluminação' | 'Digital LED 24h'>('Iluminado');
  const [newPrice, setNewPrice] = useState(3400);
  const [newDailyViews, setNewDailyViews] = useState(90000);
  const [newImageUrl, setNewImageUrl] = useState(SAMPLE_OOH_IMAGES[0]);

  const panelTypes: PanelType[] = [
    'Outdoor 9x3',
    'Frontlight Iluminado',
    'Painel Digital LED',
    'TopSight',
    'Empena',
  ];

  const filteredPanels = panels.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.addressTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCopyLink = (e: React.MouseEvent, p: Panel) => {
    e.stopPropagation();
    navigator.clipboard.writeText(p.directImageUrl);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreatePanel = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Panel = {
      id: `pan-${Date.now()}`,
      code: newCode,
      addressId: 'loc-custom',
      addressTitle: `${newAddress} - ${newNeighborhood}`,
      neighborhood: newNeighborhood,
      city: newCity,
      type: newType,
      dimensions: newDimensions,
      lighting: newLighting,
      dailyViews: newDailyViews,
      pricePerBS: newPrice,
      directImageUrl: newImageUrl,
      latitude: -23.55,
      longitude: -46.63,
      status: 'Disponível',
    };
    onAddPanel(newP);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full animate-fade-in pb-16">
      
      {/* Header */}
      <div className="px-4 md:px-8 py-4 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-14 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-9 bg-[#006397] rounded-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Painéis e Inventário OOH
            </h1>
            <p className="text-xs text-slate-500">
              Catálogo de faces publicitárias, formatos (9x3m, Frontlight, Digital LED) e disponibilidade
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#006397] hover:bg-[#004f7a] shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Painel</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="px-4 md:px-8 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar por código (ex: EP-001) ou endereço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Format Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Formato:</span>
            <div className="w-48">
              <Select value={selectedType} onValueChange={(val) => setSelectedType(val)}>
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder="Formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Formatos</SelectItem>
                  {panelTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <div className="w-44">
              <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val)}>
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Reservado">Reservado / Ativo</SelectItem>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Em Veiculação">Em Veiculação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-8 max-w-[1440px] mx-auto w-full">
        {filteredPanels.map((panel) => (
          <Card
            key={panel.id}
            onClick={() => onOpenImageViewer(panel)}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer border-slate-200"
          >
            {/* Image Preview Header */}
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={panel.directImageUrl}
                alt={panel.code}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#006397] text-white text-xs font-bold font-mono shadow-xs">
                  {panel.code}
                </span>
                <Badge
                  className={`text-[10px] font-semibold border-0 ${
                    panel.status === 'Reservado' || panel.status === 'Em Veiculação'
                      ? 'bg-[#ab2c5d] text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {panel.status}
                </Badge>
              </div>

              {/* Direct Link Action */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button
                  onClick={(e) => handleCopyLink(e, panel)}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors border border-white/20 cursor-pointer"
                  title="Copiar URL direta da foto"
                >
                  {copiedId === panel.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Panel Type & Dimensions Bottom Overlay */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                  {panel.type}
                </span>
                <span className="text-[11px] font-mono text-white/90">{panel.dimensions}</span>
              </div>
            </div>

            {/* Body */}
            <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                  {panel.addressTitle}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3 h-3 text-[#006397] flex-shrink-0" />
                  <span>{panel.neighborhood} • {panel.city}</span>
                </div>
              </div>

              {/* Specs & Lighting */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600">
                  {panel.lighting.includes('Digital') ? (
                    <Tv className="w-3.5 h-3.5 text-purple-600" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span>{panel.lighting}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <Eye className="w-3.5 h-3.5 text-[#006397]" />
                  <span>{new Intl.NumberFormat('pt-BR').format(panel.dailyViews)}/dia</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                    Tabela por BS:
                  </span>
                  <span className="text-sm font-bold text-emerald-700 font-mono">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(panel.pricePerBS)}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickBook(panel);
                  }}
                  className="h-7 text-xs text-[#006397] border-[#006397]/30 hover:bg-[#006397] hover:text-white"
                >
                  Reservar
                </Button>
              </div>

              {/* Direct image link pill */}
              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                <span className="text-[#006397] hover:underline flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Ver Imagem HD
                </span>
                <span className="font-mono text-[9px] text-slate-400 truncate max-w-[120px]">
                  {panel.directImageUrl.slice(0, 24)}...
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Panel Modal using shadcn Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Layers className="w-5 h-5 text-[#006397]" />
              Cadastrar Novo Painel OOH
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePanel} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Código do Painel
                </label>
                <Input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Tipo / Formato
                </label>
                <Select value={newType} onValueChange={(val) => setNewType(val as PanelType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {panelTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Endereço do Ponto
              </label>
              <Input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Bairro
                </label>
                <Input
                  type="text"
                  value={newNeighborhood}
                  onChange={(e) => setNewNeighborhood(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Medidas (L x A)
                </label>
                <Input
                  type="text"
                  value={newDimensions}
                  onChange={(e) => setNewDimensions(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Iluminação
                </label>
                <Select value={newLighting} onValueChange={(val: any) => setNewLighting(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Iluminado">Iluminado (Refletores)</SelectItem>
                    <SelectItem value="Digital LED 24h">Digital LED 24h</SelectItem>
                    <SelectItem value="Sem Iluminação">Sem Iluminação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Valor por Bi-Semana (R$)
                </label>
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="font-bold text-[#006397]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Link Direto da Foto do Painel (URL):
              </label>
              <Input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="font-mono text-xs"
                required
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#006397] hover:bg-[#004f7a]"
              >
                Salvar Painel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
