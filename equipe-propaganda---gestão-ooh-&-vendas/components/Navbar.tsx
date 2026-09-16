'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Search,
  Bell,
  Settings,
  Layers,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export type NavTab =
  | 'vendas'
  | 'gerar-pi'
  | 'enderecos'
  | 'clientes'
  | 'paineis'
  | 'arquivos'
  | 'relatorios'
  | 'financeiro';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  notificationCount?: number;
  onOpenNotifications: () => void;
  pendingPICount?: number;
  onOpenNewReservation?: () => void;
}

export function Navbar({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenSettings,
  notificationCount = 3,
  onOpenNotifications,
  pendingPICount = 36,
  onOpenNewReservation,
}: NavbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (menuName: string) => {
    setOpenDropdown((prev) => (prev === menuName ? null : menuName));
  };

  // Main navigation items list matching the screenshot
  const navItems: {
    id: NavTab | 'configuracoes';
    label: string;
    hasSubmenu: boolean;
    isActive: boolean;
    badge?: number;
  }[] = [
    {
      id: 'enderecos',
      label: 'Endereços',
      hasSubmenu: true,
      isActive: activeTab === 'enderecos',
    },
    {
      id: 'clientes',
      label: 'Clientes',
      hasSubmenu: true,
      isActive: activeTab === 'clientes',
    },
    {
      id: 'paineis',
      label: 'Painéis',
      hasSubmenu: true,
      isActive: activeTab === 'paineis' || activeTab === 'gerar-pi',
      badge: pendingPICount > 0 && activeTab !== 'gerar-pi' ? pendingPICount : undefined,
    },
    {
      id: 'vendas',
      label: 'Vendas',
      hasSubmenu: true,
      isActive: activeTab === 'vendas',
    },
    {
      id: 'arquivos',
      label: 'Arquivos',
      hasSubmenu: true,
      isActive: activeTab === 'arquivos',
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      hasSubmenu: true,
      isActive: activeTab === 'relatorios',
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      hasSubmenu: true,
      isActive: activeTab === 'financeiro',
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      hasSubmenu: true,
      isActive: false,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#23272a] text-white z-50 flex items-center justify-between px-3 md:px-6 border-b border-slate-800 shadow-md select-none">
      
      {/* Brand & Main Navigation */}
      <div className="flex items-center gap-3 md:gap-5 min-w-0" ref={dropdownRef}>
        
        {/* Brand Logo - Equipe Propaganda */}
        <button
          onClick={() => {
            onTabChange('vendas');
            setOpenDropdown(null);
          }}
          className="flex items-center gap-2.5 flex-shrink-0 text-left focus:outline-none group cursor-pointer pr-1"
        >
          {/* Logo mark (red swoosh/arcs) */}
          <div className="relative w-7 h-7 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-rose-600/40 border-t-rose-500 animate-pulse" />
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-700 to-rose-500 flex items-center justify-center shadow-xs">
              <span className="text-[9px] font-black text-white tracking-tighter">EP</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-extrabold text-sm md:text-[15px] tracking-tight text-white leading-tight">
              Equipe
            </span>
            <span className="text-[8px] font-bold text-rose-500 tracking-[0.2em] uppercase leading-none">
              Propaganda
            </span>
          </div>
        </button>

        {/* Top Navbar Links with ChevronDown */}
        <nav className="flex items-center gap-0.5 md:gap-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const isDropdownOpen = openDropdown === item.id;

            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (item.id === 'paineis') {
                      toggleDropdown('paineis');
                    } else if (item.id === 'configuracoes') {
                      onOpenSettings();
                      setOpenDropdown(null);
                    } else {
                      onTabChange(item.id as NavTab);
                      setOpenDropdown(null);
                    }
                  }}
                  className={`font-semibold text-xs md:text-[13px] transition-all py-2 px-2 md:px-2.5 rounded-md cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                    item.isActive
                      ? 'text-[#92ccff] bg-white/5'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${
                        isDropdownOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  )}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white leading-tight ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Submenu Dropdown for PAINÉIS (Matches user screenshot exactly) */}
                {item.id === 'paineis' && isDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2.5 w-[340px] md:w-[380px] bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 py-2 px-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                    
                    {/* Item 1: Lista de Painéis */}
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('paineis');
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:text-[#006397] group-hover:border-[#006397]/40 shadow-2xs">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#006397] leading-tight">
                          Lista de Painéis
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          Realize o cadastro / edição de painéis.
                        </p>
                      </div>
                    </button>

                    {/* Item 2: Envio de Disponibilidades */}
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('paineis');
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:text-[#006397] group-hover:border-[#006397]/40 shadow-2xs">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#006397] leading-tight">
                          Envio de Disponibilidades
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          Consulte painéis disponíveis, reservados e envie disponibilidades.
                        </p>
                      </div>
                    </button>

                    {/* Item 3: Reserva de Painéis */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenNewReservation) {
                          onOpenNewReservation();
                        } else {
                          onTabChange('vendas');
                        }
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:text-[#006397] group-hover:border-[#006397]/40 shadow-2xs">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#006397] leading-tight">
                          Reserva de Painéis
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          Realize a reserva / cancelamento de reserva para clientes.
                        </p>
                      </div>
                    </button>

                    {/* Item 4: Gerar PI (Target item requested by user!) */}
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('gerar-pi');
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-blue-50/60 transition-colors text-left group cursor-pointer bg-slate-50/50 border border-slate-100/80"
                    >
                      <div className="w-10 h-10 rounded-xl border border-blue-200 bg-white flex items-center justify-center flex-shrink-0 text-[#006397] group-hover:border-[#006397] shadow-2xs">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#006397] leading-tight">
                            Gerar PI
                          </h4>
                          {pendingPICount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-2xs">
                              {pendingPICount} sem PI
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          Gera PI das reservas na Bi-Semana selecionada.
                        </p>
                      </div>
                    </button>

                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right Controls matching screenshot */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 pl-2">
        
        {/* Search */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenSearch}
          className="rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60"
          title="Buscar (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenNotifications}
          className="relative rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60"
          title="Notificações"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#23272a]" />
          )}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenSettings}
          className="rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60"
          title="Configurações do Sistema"
        >
          <Settings className="w-4 h-4" />
        </Button>

        {/* NOVO Frontend BETA Badge Button from Screenshot */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#004d40]/40 border border-[#00bfa5]/40 text-[#64ffda] text-xs font-semibold shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-[#64ffda]" />
          <span className="text-[11px] text-slate-200">NOVO Frontend</span>
          <span className="px-1.5 py-0.2 rounded bg-[#00bfa5] text-slate-950 text-[9px] font-black uppercase">
            BETA
          </span>
        </div>

        {/* User avatar GR (Red circular avatar with bold white letters) */}
        <div className="flex items-center pl-1">
          <Avatar className="w-8 h-8 ring-2 ring-white/20 shadow-xs cursor-pointer">
            <AvatarFallback className="bg-[#e53935] hover:bg-[#d32f2f] text-white text-xs font-bold transition-colors">
              GR
            </AvatarFallback>
          </Avatar>
        </div>

      </div>

    </header>
  );
}
