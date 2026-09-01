'use client';

import React, { useState } from 'react';
import { Plus, Calendar, User, MapPin, DollarSign, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { BiSemana, Client, Panel, Reservation, Seller } from '@/lib/types';
import { SAMPLE_OOH_IMAGES } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  biSemanas: BiSemana[];
  clients: Client[];
  panels: Panel[];
  sellers: Seller[];
  currentBiSemanaId: string;
  onSaveReservation: (newRes: Reservation) => void;
}

export function NewReservationModal({
  isOpen,
  onClose,
  biSemanas,
  clients,
  panels,
  sellers,
  currentBiSemanaId,
  onSaveReservation,
}: NewReservationModalProps) {
  const [selectedBiSemanaId, setSelectedBiSemanaId] = useState(currentBiSemanaId || biSemanas[0]?.id || '');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [selectedPanelId, setSelectedPanelId] = useState(panels[0]?.id || '');
  const [selectedSellerId, setSelectedSellerId] = useState(sellers[0]?.id || 'taynara');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [customValue, setCustomValue] = useState<number>(3200);
  const [artImageUrl, setArtImageUrl] = useState(SAMPLE_OOH_IMAGES[0]);
  const [checkingPhotoUrl, setCheckingPhotoUrl] = useState(SAMPLE_OOH_IMAGES[1]);
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // When panel changes, update price
  const handlePanelChange = (panelId: string) => {
    setSelectedPanelId(panelId);
    const p = panels.find((x) => x.id === panelId);
    if (p) {
      setCustomValue(p.pricePerBS);
    }
  };

  // When client changes, auto select preferred seller
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const c = clients.find((x) => x.id === clientId);
    if (c && c.preferredSellerId) {
      setSelectedSellerId(c.preferredSellerId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedBS = biSemanas.find((b) => b.id === selectedBiSemanaId) || biSemanas[0];
    const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
    const selectedPanel = panels.find((p) => p.id === selectedPanelId) || panels[0];
    const selectedSeller = sellers.find((s) => s.id === selectedSellerId) || sellers[0];

    const randomSeq = Math.floor(Math.random() * 900) + 100;
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      code: `RES-${selectedBS.year}-${randomSeq}`,
      biSemanaId: selectedBS.id,
      biSemanaLabel: selectedBS.label,
      year: selectedBS.year,
      panelId: selectedPanel.id,
      panelCode: selectedPanel.code,
      panelType: selectedPanel.type,
      addressTitle: selectedPanel.addressTitle,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      sellerId: selectedSeller.id,
      sellerName: selectedSeller.name,
      campaignTitle: campaignTitle || `Campanha ${selectedClient.name}`,
      value: customValue,
      status: 'Confirmada',
      artImageUrl: artImageUrl || SAMPLE_OOH_IMAGES[0],
      checkingPhotoUrl: checkingPhotoUrl || SAMPLE_OOH_IMAGES[1],
      checkedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: notes || 'Reserva cadastrada via sistema OOH.',
    };

    onSaveReservation(newReservation);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-[#006397] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-white">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="font-semibold text-lg text-white">Nova Reserva de Painel</DialogTitle>
              <p className="text-xs text-white/80 mt-0.5">Agendamento de veiculação e reserva por Bi-Semana</p>
            </div>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Reserva Cadastrada com Sucesso!</h4>
            <p className="text-sm text-slate-500">O painel foi alocado e adicionado aos relatórios de vendas.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* Bi-semana & Seller */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Bi-Semana
                </label>
                <Select value={selectedBiSemanaId} onValueChange={(val) => setSelectedBiSemanaId(val)}>
                  <SelectTrigger>
                    <SelectValue />
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

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Vendedor Responsável
                </label>
                <Select value={selectedSellerId} onValueChange={(val) => setSelectedSellerId(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} (Comissão {s.commissionRate}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Client & Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Cliente Anunciante
                </label>
                <Select value={selectedClientId} onValueChange={handleClientChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.segment})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Painel OOH / Local
                </label>
                <Select value={selectedPanelId} onValueChange={handlePanelChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {panels.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.code} - {p.addressTitle} ({p.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Campaign title & Value */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Título da Campanha / Produto
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Campanha Dia das Mães / Ofertas Abril"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Valor da Bi-Semana (R$)
                </label>
                <Input
                  type="number"
                  value={customValue}
                  onChange={(e) => setCustomValue(Number(e.target.value))}
                  className="font-bold text-[#006397]"
                  required
                />
              </div>
            </div>

            {/* Direct Image Links Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ImageIcon className="w-4 h-4 text-[#006397]" />
                <span>Links Diretos de Imagens (Arte & Checking)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Adicione os URLs diretos da imagem da arte publicitária e foto de verificação do outdoor.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Link Direto da Foto da Mídia / Painel:
                  </label>
                  <Input
                    type="url"
                    value={artImageUrl}
                    onChange={(e) => setArtImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Link Direto da Foto de Checking (Instalação):
                  </label>
                  <Input
                    type="url"
                    value={checkingPhotoUrl}
                    onChange={(e) => setCheckingPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Observações de Produção e Iluminação
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Lona fornecida pelo cliente. Refletores acendem às 18:00."
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#006397]"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#006397] hover:bg-[#004f7a]"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Confirmar Reserva
              </Button>
            </div>
          </form>
        )}

      </DialogContent>
    </Dialog>
  );
}
