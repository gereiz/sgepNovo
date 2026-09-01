'use client';

import React from 'react';
import { Bell, CheckCircle2, Clock, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNotification?: (action: string) => void;
}

export function NotificationsDropdown({
  isOpen,
  onClose,
  onSelectNotification,
}: NotificationsDropdownProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Checking Fotográfico Aprovado',
      desc: 'Colagem do painel EP-001 (Agência Mosca) foi confirmada com sucesso.',
      time: 'Há 15 minutos',
      icon: Camera,
      color: 'text-[#006397] bg-[#006397]/10',
    },
    {
      id: '2',
      title: 'Nova Reserva Confirmada',
      desc: 'Taynara reservou o Frontlight Dutra para WR Construtora (BS 16).',
      time: 'Há 1 hora',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: '3',
      title: 'Lona em Trânsito / Produção',
      desc: 'Material da campanha Josi Cosméticos recebido pela equipe de colagem.',
      time: 'Há 3 horas',
      icon: Clock,
      color: 'text-[#ab2c5d] bg-[#ab2c5d]/10',
    },
  ];

  return (
    <div className="fixed top-14 right-4 md:right-16 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#006397]" />
          <span className="text-xs font-bold text-slate-900">Notificações Recentes</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 text-slate-400 hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              onClick={() => {
                if (onSelectNotification) onSelectNotification(n.id);
                onClose();
              }}
              className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3"
            >
              <div className={`p-2 rounded-xl h-max ${n.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">{n.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center">
        <button
          onClick={onClose}
          className="text-[11px] font-semibold text-[#006397] cursor-pointer hover:underline"
        >
          Marcar todas como lidas
        </button>
      </div>
    </div>
  );
}
