'use client';

import React, { useState } from 'react';
import { Settings, CheckCircle, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [companyName, setCompanyName] = useState('EQUIPE PROPAGANDA LTDA');
  const [cnpj, setCnpj] = useState('14.285.903/0001-44');
  const [defaultCommission, setDefaultCommission] = useState(5.0);
  const [autoChecking, setAutoChecking] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 overflow-hidden">
        
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <DialogTitle className="font-bold text-base text-white">
              Configurações do Sistema OOH
            </DialogTitle>
          </div>
        </DialogHeader>

        {saved ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
            <div className="font-bold text-lg text-slate-900">Configurações Salvas com Sucesso!</div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Razão Social da Empresa OOH
              </label>
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                CNPJ da Emissora
              </label>
              <Input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Comissão Padrão de Vendedores (%)
              </label>
              <Input
                type="number"
                step="0.5"
                value={defaultCommission}
                onChange={(e) => setDefaultCommission(Number(e.target.value))}
                className="font-mono"
                required
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#006397]" />
                Automação & Notificações de Checking
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoChecking}
                  onChange={(e) => setAutoChecking(e.target.checked)}
                  className="rounded text-[#006397] focus:ring-[#006397]"
                />
                <span>Gerar link público de checking fotográfico automaticamente para o cliente</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyWhatsApp}
                  onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                  className="rounded text-[#006397] focus:ring-[#006397]"
                />
                <span>Enviar alerta para vendedora quando a colagem for confirmada</span>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
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
                Salvar Preferências
              </Button>
            </div>
          </form>
        )}

      </DialogContent>
    </Dialog>
  );
}
