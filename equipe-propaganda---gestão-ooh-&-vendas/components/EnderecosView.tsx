'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Plus,
  ExternalLink,
  Eye,
  Layers,
  Copy,
  Check,
  Filter,
  Navigation,
  Compass,
  Building,
  Image as ImageIcon,
} from 'lucide-react';
import { AddressLocation } from '@/lib/types';
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

interface EnderecosViewProps {
  addresses: AddressLocation[];
  onOpenImageViewer: (address: AddressLocation) => void;
  onAddAddress: (newAddr: AddressLocation) => void;
}

export function EnderecosView({ addresses, onOpenImageViewer, onAddAddress }: EnderecosViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Address Form State
  const [newTitle, setNewTitle] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newCity, setNewCity] = useState('São Paulo - SP');
  const [newReference, setNewReference] = useState('');
  const [newTraffic, setNewTraffic] = useState(80000);
  const [newImageUrl, setNewImageUrl] = useState(SAMPLE_OOH_IMAGES[0]);
  const [newNightImageUrl, setNewNightImageUrl] = useState(SAMPLE_OOH_IMAGES[1]);
  const [newPanelsCount, setNewPanelsCount] = useState(2);

  const cities = Array.from(new Set(addresses.map((a) => a.city)));

  const filteredAddresses = addresses.filter((addr) => {
    const matchesSearch =
      addr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || addr.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const handleCopyLink = (e: React.MouseEvent, addr: AddressLocation) => {
    e.stopPropagation();
    navigator.clipboard.writeText(addr.directImageUrl);
    setCopiedId(addr.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: AddressLocation = {
      id: `loc-${Date.now()}`,
      code: `END-${String(addresses.length + 1).padStart(3, '0')}`,
      title: newTitle,
      neighborhood: newNeighborhood,
      city: newCity,
      reference: newReference,
      coordinates: { lat: -23.5505, lng: -46.6333 },
      dailyTraffic: newTraffic,
      directImageUrl: newImageUrl,
      directNightImageUrl: newNightImageUrl,
      panelsCount: newPanelsCount,
      featured: true,
    };
    onAddAddress(newAddr);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewNeighborhood('');
    setNewReference('');
  };

  return (
    <div className="flex flex-col w-full animate-fade-in pb-16">
      
      {/* Top Header */}
      <div className="px-4 md:px-8 py-4 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-14 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-9 bg-[#006397] rounded-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Endereços e Pontos de Exibição OOH
            </h1>
            <p className="text-xs text-slate-500">
              Catálogo georreferenciado de locais de mídia exterior com links diretos de imagens
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#006397] hover:bg-[#004f7a] shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Ponto / Endereço</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="px-4 md:px-8 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar por rua, bairro ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Cidade:</span>
          <div className="w-56">
            <Select value={selectedCity} onValueChange={(val) => setSelectedCity(val)}>
              <SelectTrigger className="h-9 bg-white">
                <SelectValue placeholder="Selecione Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Cidades ({addresses.length})</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid of Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8 max-w-[1440px] mx-auto w-full">
        {filteredAddresses.map((addr) => (
          <Card
            key={addr.id}
            onClick={() => onOpenImageViewer(addr)}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer border-slate-200"
          >
            {/* Image Preview with Direct Link badge */}
            <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={addr.directImageUrl}
                alt={addr.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Code & Panels Count Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono font-bold border border-white/20">
                  {addr.code}
                </span>
                <Badge className="bg-[#006397] text-white border-0 text-[11px]">
                  {addr.panelsCount} faces
                </Badge>
              </div>

              {/* Direct Link Action Button */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={(e) => handleCopyLink(e, addr)}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors border border-white/20 cursor-pointer"
                  title="Copiar link direto da foto"
                >
                  {copiedId === addr.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={addr.directImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors border border-white/20"
                  title="Abrir foto em tamanho original"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Bottom Street Name & Neighborhood */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">
                  {addr.neighborhood} • {addr.city}
                </div>
                <h3 className="text-sm font-bold text-white truncate drop-shadow-xs">{addr.title}</h3>
              </div>
            </div>

            {/* Content Details */}
            <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {addr.reference}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Eye className="w-3.5 h-3.5 text-[#006397]" />
                  <span>Fluxo:</span>
                  <strong className="text-slate-900">
                    {new Intl.NumberFormat('pt-BR').format(addr.dailyTraffic)}/dia
                  </strong>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 justify-end">
                  <Navigation className="w-3.5 h-3.5 text-[#ab2c5d]" />
                  <span>Geolocalizado</span>
                </div>
              </div>

              {/* Direct Link Box Display */}
              <div className="mt-1 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[#006397] font-semibold group-hover:underline flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Ver Fotos (Dia/Noite)
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  {copiedId === addr.id ? 'URL Copiada!' : 'Link Direto'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Address Modal using shadcn Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <MapPin className="w-5 h-5 text-[#006397]" />
              Adicionar Novo Ponto OOH
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateAddress} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Endereço / Logradouro
              </label>
              <Input
                type="text"
                placeholder="Ex: Av. Faria Lima, 3500"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
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
                  placeholder="Ex: Itaim Bibi"
                  value={newNeighborhood}
                  onChange={(e) => setNewNeighborhood(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Cidade / UF
                </label>
                <Input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Ponto de Referência / Sentido
              </label>
              <Input
                type="text"
                placeholder="Ex: Próximo à esquina com Juscelino Kubitschek"
                value={newReference}
                onChange={(e) => setNewReference(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Fluxo Estimado (veículos/dia)
                </label>
                <Input
                  type="number"
                  value={newTraffic}
                  onChange={(e) => setNewTraffic(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Qtd de Painéis no Ponto
                </label>
                <Input
                  type="number"
                  value={newPanelsCount}
                  onChange={(e) => setNewPanelsCount(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Direct image URLs */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#006397]" />
                Links Diretos das Imagens
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Link Direto Foto Diurna (URL):
                </label>
                <Input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Link Direto Foto Noturna Iluminada (URL):
                </label>
                <Input
                  type="url"
                  value={newNightImageUrl}
                  onChange={(e) => setNewNightImageUrl(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
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
                Salvar Endereço
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
