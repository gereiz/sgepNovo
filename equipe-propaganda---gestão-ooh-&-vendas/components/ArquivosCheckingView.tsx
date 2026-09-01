'use client';

import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Plus,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  Eye,
  Camera,
  MapPin,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { CheckingReport } from '@/lib/types';
import { SAMPLE_OOH_IMAGES } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ArquivosCheckingViewProps {
  reports: CheckingReport[];
  onOpenImageViewer: (report: CheckingReport) => void;
  onAddReport: (newReport: CheckingReport) => void;
}

export function ArquivosCheckingView({
  reports,
  onOpenImageViewer,
  onAddReport,
}: ArquivosCheckingViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New report form state
  const [newClient, setNewClient] = useState('AGENCIA MOSCA');
  const [newCampaign, setNewCampaign] = useState('Campanha Nova Temporada');
  const [newPanelCode, setNewPanelCode] = useState('EP-001');
  const [newAddress, setNewAddress] = useState('Av. Presidente Vargas, 1420 - Face A');
  const [newPhotoDay, setNewPhotoDay] = useState(SAMPLE_OOH_IMAGES[0]);
  const [newPhotoNight, setNewPhotoNight] = useState(SAMPLE_OOH_IMAGES[1]);
  const [newInstaller, setNewInstaller] = useState('Equipe Técnica de Aplicação 01');
  const [newObs, setNewObs] = useState('Colagem perfeita sem rugas. Iluminação 100% calibrada.');

  const filteredReports = reports.filter((r) => {
    return (
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.panelCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.addressTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCopyLink = (e: React.MouseEvent, r: CheckingReport) => {
    e.stopPropagation();
    navigator.clipboard.writeText(r.directPhotoDayUrl);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newRep: CheckingReport = {
      id: `chk-${Date.now()}`,
      reservationId: `res-${Date.now()}`,
      clientName: newClient,
      campaignName: newCampaign,
      panelCode: newPanelCode,
      addressTitle: newAddress,
      biSemanaLabel: 'BS: 16 (07/04/2025 - 20/04/2025)',
      dateInstalled: new Date().toISOString().replace('T', ' ').slice(0, 16),
      directPhotoDayUrl: newPhotoDay,
      directPhotoNightUrl: newPhotoNight,
      installerName: newInstaller,
      status: 'Aprovado',
      observations: newObs,
    };
    onAddReport(newRep);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full animate-fade-in pb-16">
      
      {/* Header */}
      <div className="px-4 md:px-8 py-4 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-14 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-9 bg-[#006874] rounded-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Arquivos e Checking Fotográfico OOH
            </h1>
            <p className="text-xs text-slate-500">
              Comprovantes visuais de instalação de outdoors, frontlights e lonas para envio aos clientes
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#006874] hover:bg-[#00525c] text-white shadow-xs"
        >
          <Camera className="w-4 h-4" />
          <span>Novo Registro de Checking</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="px-4 md:px-8 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar por cliente, campanha ou painel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-white"
          />
        </div>

        <div className="text-xs text-slate-500">
          Total de <strong className="text-slate-900">{filteredReports.length}</strong> relatórios de checking disponíveis
        </div>
      </div>

      {/* Grid of Checking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8 max-w-[1440px] mx-auto w-full">
        {filteredReports.map((report) => (
          <Card
            key={report.id}
            onClick={() => onOpenImageViewer(report)}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer border-slate-200"
          >
            {/* Direct Image Preview */}
            <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={report.directPhotoDayUrl}
                alt={report.campaignName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white font-mono font-bold text-[11px] border border-white/20">
                  {report.panelCode}
                </span>
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {report.status}
                </Badge>
              </div>

              {/* Direct links actions */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={(e) => handleCopyLink(e, report)}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors border border-white/20 cursor-pointer"
                  title="Copiar link direto da foto de checking"
                >
                  {copiedId === report.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={report.directPhotoDayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors border border-white/20"
                  title="Abrir foto em tamanho real"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Bottom Client & Date */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-[11px] font-semibold text-white/80 uppercase">
                  {report.clientName}
                </div>
                <h3 className="text-sm font-bold text-white truncate drop-shadow-xs">{report.campaignName}</h3>
              </div>
            </div>

            {/* Body */}
            <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-[#006397] flex-shrink-0" />
                  <span className="truncate">{report.addressTitle}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar className="w-3 h-3 text-[#ab2c5d] flex-shrink-0" />
                  <span>Instalação: {report.dateInstalled} • {report.biSemanaLabel}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                <div className="font-semibold text-slate-800 mb-0.5">Laudo de Exibição:</div>
                <p className="line-clamp-2">{report.observations}</p>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[#006397] font-semibold group-hover:underline flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Abrir Checking HD
                </span>
                <span className="text-slate-400 text-[11px]">
                  {report.directPhotoNightUrl ? '☀️ Dia / 🌙 Noite' : '☀️ Foto Diurna'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Report Modal using shadcn Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Camera className="w-5 h-5 text-[#006874]" />
              Registrar Checking Fotográfico
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateReport} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Cliente Anunciante
              </label>
              <Input
                type="text"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Título da Campanha
              </label>
              <Input
                type="text"
                value={newCampaign}
                onChange={(e) => setNewCampaign(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Código do Painel
                </label>
                <Input
                  type="text"
                  value={newPanelCode}
                  onChange={(e) => setNewPanelCode(e.target.value)}
                  className="font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Equipe de Instalação
                </label>
                <Input
                  type="text"
                  value={newInstaller}
                  onChange={(e) => setNewInstaller(e.target.value)}
                />
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

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800">Links Diretos das Fotos de Comprovação</div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Link Direto Foto Diurna (Checking):
                </label>
                <Input
                  type="url"
                  value={newPhotoDay}
                  onChange={(e) => setNewPhotoDay(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Link Direto Foto Noturna (Iluminação):
                </label>
                <Input
                  type="url"
                  value={newPhotoNight}
                  onChange={(e) => setNewPhotoNight(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Parecer Técnico / Observações
              </label>
              <textarea
                rows={2}
                value={newObs}
                onChange={(e) => setNewObs(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#006874]"
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
                className="bg-[#006874] hover:bg-[#00525c] text-white"
              >
                Salvar Comprovante
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
