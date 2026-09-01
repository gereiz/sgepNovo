'use client';

import React from 'react';
import { Megaphone, Search, Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export type NavTab = 'enderecos' | 'clientes' | 'paineis' | 'vendas' | 'arquivos' | 'relatorios' | 'financeiro';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  notificationCount?: number;
  onOpenNotifications: () => void;
}

export function Navbar({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenSettings,
  notificationCount = 3,
  onOpenNotifications,
}: NavbarProps) {
  const tabs: { id: NavTab; label: string }[] = [
    { id: 'vendas', label: 'Vendas' },
    { id: 'enderecos', label: 'Endereços' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'paineis', label: 'Painéis' },
    { id: 'arquivos', label: 'Arquivos' },
    { id: 'relatorios', label: 'Relatórios' },
    { id: 'financeiro', label: 'Financeiro' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#23272a] text-white z-50 flex items-center justify-between px-4 md:px-8 border-b border-slate-800 shadow-md select-none">
      
      {/* Brand & Navigation */}
      <div className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar">
        
        {/* Brand */}
        <button
          onClick={() => onTabChange('vendas')}
          className="flex items-center gap-2.5 flex-shrink-0 text-left focus:outline-none group cursor-pointer"
        >
          <div className="p-1.5 rounded-lg bg-[#006397]/40 text-[#92ccff] group-hover:scale-105 transition-transform border border-[#92ccff]/30">
            <Megaphone className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="font-bold text-sm md:text-base tracking-wider uppercase text-slate-100 whitespace-nowrap">
            Equipe Propaganda
          </span>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 md:gap-4 ml-2 md:ml-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`font-semibold text-xs md:text-sm transition-all pb-[17px] mt-[17px] whitespace-nowrap px-2 border-b-2 cursor-pointer ${
                  isActive
                    ? 'text-[#92ccff] border-[#92ccff]'
                    : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 pl-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenSearch}
          className="rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60"
          title="Buscar (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenNotifications}
          className="relative rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60"
          title="Notificações"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#fd6c9c] rounded-full ring-2 ring-[#23272a]" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenSettings}
          className="rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60"
          title="Configurações do Sistema"
        >
          <Settings className="w-4 h-4" />
        </Button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-700/80">
          <Avatar className="w-8 h-8 ring-1 ring-white/20">
            <AvatarFallback className="bg-[#006397] text-white text-xs font-bold">
              GO
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline text-xs font-semibold text-slate-200">
            Gestor OOH
          </span>
        </div>
      </div>

    </header>
  );
}
