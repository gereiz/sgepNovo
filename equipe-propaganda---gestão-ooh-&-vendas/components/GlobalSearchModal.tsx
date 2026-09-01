'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Layers, Users, FileText, ArrowRight } from 'lucide-react';
import { AddressLocation, Client, Panel, Reservation } from '@/lib/types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: AddressLocation[];
  panels: Panel[];
  clients: Client[];
  reservations: Reservation[];
  onSelectResult: (type: 'address' | 'panel' | 'client' | 'reservation', item: any) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  addresses,
  panels,
  clients,
  reservations,
  onSelectResult,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const matchedPanels = query.trim()
    ? panels.filter(
        (p) =>
          p.code.toLowerCase().includes(query.toLowerCase()) ||
          p.addressTitle.toLowerCase().includes(query.toLowerCase()) ||
          p.type.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedClients = query.trim()
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          (c.tradeName && c.tradeName.toLowerCase().includes(query.toLowerCase())) ||
          c.segment.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedAddresses = query.trim()
    ? addresses.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.neighborhood.toLowerCase().includes(query.toLowerCase()) ||
          a.code.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedReservations = query.trim()
    ? reservations.filter(
        (r) =>
          r.code.toLowerCase().includes(query.toLowerCase()) ||
          r.clientName.toLowerCase().includes(query.toLowerCase()) ||
          r.campaignTitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden top-[25%] translate-y-[-25%]">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3 bg-white">
          <Search className="w-5 h-5 text-[#006397] flex-shrink-0" />
          <Input
            autoFocus
            type="text"
            placeholder="Buscar painéis, clientes, endereços ou contratos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-sm font-medium h-9 pl-0"
          />
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[55vh]">
          {!query.trim() && (
            <div className="text-center py-10 text-xs text-slate-500 space-y-2">
              <p>Digite qualquer termo para buscar em toda a base da Equipe Propaganda.</p>
              <div className="flex justify-center gap-2 flex-wrap text-[11px] pt-2">
                <Badge variant="secondary">Ex: EP-001</Badge>
                <Badge variant="secondary">Ex: Mosca</Badge>
                <Badge variant="secondary">Ex: Paulista</Badge>
                <Badge variant="secondary">Ex: Frontlight</Badge>
              </div>
            </div>
          )}

          {/* Matched Panels */}
          {matchedPanels.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#006397] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Painéis OOH ({matchedPanels.length})
              </div>
              <div className="space-y-1">
                {matchedPanels.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectResult('panel', p);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className="font-mono font-bold text-xs bg-[#006397]/10 text-[#006397] border-0">
                        {p.code}
                      </Badge>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{p.addressTitle}</div>
                        <div className="text-[10px] text-slate-500">{p.type} • {p.dimensions}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Clients */}
          {matchedClients.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#ab2c5d] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Clientes & Anunciantes ({matchedClients.length})
              </div>
              <div className="space-y-1">
                {matchedClients.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectResult('client', c);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.segment} • {c.contactName}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Addresses */}
          {matchedAddresses.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#006874] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Pontos de Exibição ({matchedAddresses.length})
              </div>
              <div className="space-y-1">
                {matchedAddresses.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onSelectResult('address', a);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{a.title}</div>
                      <div className="text-[10px] text-slate-500">{a.neighborhood} • {a.city}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Reservations */}
          {matchedReservations.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Reservas & Contratos ({matchedReservations.length})
              </div>
              <div className="space-y-1">
                {matchedReservations.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onSelectResult('reservation', r);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 font-mono">{r.code} - {r.clientName}</div>
                      <div className="text-[10px] text-slate-500">{r.campaignTitle} • Painel {r.panelCode}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {query.trim() &&
            matchedPanels.length === 0 &&
            matchedClients.length === 0 &&
            matchedAddresses.length === 0 &&
            matchedReservations.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500">
                Nenhum resultado encontrado para &ldquo;{query}&rdquo;.
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Pressione ESC para fechar</span>
          <span>Equipe Propaganda • Sistema OOH</span>
        </div>

      </DialogContent>
    </Dialog>
  );
}
