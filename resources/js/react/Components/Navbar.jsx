import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
  Search,
  Settings,
  Bell,
  Sparkles,
  ChevronDown,
  Menu,
  MapPin,
  User,
  Image,
  LayoutGrid,
  FileText,
  DollarSign,
  Globe,
} from 'lucide-react';
import { cn } from '@/react/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/react/Components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/react/Components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/react/Components/ui/accordion';

/**
 * =======================================================
 *  Navbar · ESTILO NOVO (React + shadcn)
 *  - DESKTOP: abas dropdown com submenus 1:1 ao Vue antigo
 *  - MOBILE:  botão hambúrguer → drawer lateral esquerdo com Accordions
 * =======================================================
 */

const NAV_GRUPOS = [
  {
    key: 'enderecos',
    label: 'Endereços',
    icon: MapPin,
    items: [
      { name: 'Cidades', description: 'Realize o cadastro / edição de cidades.', href: '/CadCidade' },
      { name: 'Regiões', description: 'Realize o cadastro / edição de regiões.', href: '/CadRegiao' },
      { name: 'Bairros', description: 'Realize o cadastro / edição de bairros.', href: '/CadBairro' },
    ],
  },
  {
    key: 'clientes',
    label: 'Clientes',
    icon: User,
    items: [
      { name: 'Lista de Clientes', description: 'Realize o cadastro / edição de novos clientes.', href: '/Clientes' },
    ],
  },
  {
    key: 'paineis',
    label: 'Painéis',
    icon: Image,
    items: [
      { name: 'Lista de Painéis', description: 'Realize o cadastro / edição de painéis.', href: '/Paineis' },
      { name: 'Envio de Disponibilidades', description: 'Consulte painéis disponíveis, reservados e envie disponibilidades.', href: '/ResPaineis' },
      { name: 'Reserva de Painéis', description: 'Realize a reserva / cancelamento de reserva para clientes.', href: '/ResPaineisCli' },
      { name: 'Gerar PI', description: 'Gera PI das reservas na Bi-Semana selecionada.', href: '/ReservaSemPi' },
    ],
  },
  {
    key: 'vendas',
    label: 'Vendas',
    icon: DollarSign,
    items: [
      { name: 'Lançar Venda', description: 'Lançar venda de serviços sem reserva.', href: '/Vendas/Lancar' },
    ],
  },
  {
    key: 'arquivos',
    label: 'Arquivos',
    icon: LayoutGrid,
    items: [
      { name: 'Disponibilidades Enviadas', description: 'Em Breve.', href: '#' },
      { name: "Pi's Geradas", description: "Exibe todas as Pi's geradas nos ultimos 60 dias", href: '/PisGeradas' },
      { name: 'Vendas Geradas', description: 'Exibe todas as Vendas geradas', href: '/VendasGeradas' },
    ],
  },
  {
    key: 'relatorios',
    label: 'Relatórios',
    icon: FileText,
    items: [
      { name: 'Relatório de Colagem', description: 'Relatório com a lista de painéis para colagem.', href: '/RelColagem' },
      { name: 'Reservas por Cliente', description: 'Relatório com a quantidade de painéis por cliente específico na bi-semana.', href: '/ReservaCliente' },
      { name: 'Painéis por Cliente', description: 'Relatório geral com a quantidade de painéis por cliente na bi-semana', href: '/PaineisCliente' },
      { name: 'Painéis por Bisemana', description: 'Relatório com a lista de painéis por bisemana.', href: '/RelPainelBisemana' },
      { name: 'Relatório de Ocupação', description: 'Acompanhamento de ocupação.', href: '/RelOcupacao' },
      { name: 'Contas a Pagar/Receber', description: 'Relatório financeiro de lançamentos (entradas/saídas).', href: '/RelLancamentos' },
      { name: 'Mapa de Ocupação • LEDs', description: 'Visualização em timeline/grade da ocupação dos painéis LED por bi-semana, com status de contrato.', href: '/MapaOcupacaoLed' },
      { name: 'Relatório de Reservas • LEDs', description: 'Lista e PDF de reservas de LEDs com filtros, valores, PI e status de contrato.', href: '/RelReservasLed' },
    ],
  },
  {
    key: 'financeiro',
    label: 'Financeiro',
    icon: DollarSign,
    items: [
      { name: 'Cadastro de Serviços', description: 'Realize o cadastro / edição de serviços.', href: '/Servicos' },
      { name: 'Cadastro de Comissões', description: 'Realize o cadastro / edição de comissões.', href: '/Comissoes' },
      { name: 'Controle de Caixa', description: 'Realize o controle de Entradas e Saídas de valores.', href: '/Caixa' },
      { name: 'Comissões Pagas', description: 'Lista as comissões pagas por PI.', href: '/ListaComissoesPagas' },
    ],
  },
  {
    key: 'configuracoes',
    label: 'Configurações',
    icon: Globe,
    items: [
      { name: 'Cadastro de Usuários', description: 'Realize o cadastro / edição de usuários no sistema.', href: '/ListaUsuarios' },
      { name: 'Configurações Gerais', description: 'Configurações Diversas', href: '/configuracoes' },
    ],
  },
];

export const navGroups = NAV_GRUPOS;

export function Navbar({
  activeTab = null,
  notificationCount = 1,
}) {
  const page = usePage();
  const authUser = page?.props?.auth?.user || null;
  const userName = authUser?.name || authUser?.username || 'Gestor OOH';
  const userEmail = authUser?.email || '';
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 text-white shadow-nav overflow-x-hidden max-w-[100vw]"
      style={{ backgroundColor: '#0F172A' }}
    >
      <div className="flex h-[56px] w-full max-w-[100vw] items-center px-3 lg:px-6 gap-1 md:gap-3 relative overflow-x-hidden">
        {/* ========== MOBILE: BOTÃO HAMBÚRGUER ========== */}
        <div className="md:hidden flex items-center justify-center shrink-0 min-w-0">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menu"
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors bg-transparent border-0 shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <img
                    src="/storage/img/logo-black.png"
                    alt="Equipe Propaganda"
                    className="h-6 w-auto object-contain"
                    onError={(ev) => {
                      ev.currentTarget.style.display = 'none';
                      const fb = ev.currentTarget.parentElement.querySelector('[data-sheet-logo-fb]');
                      if (fb) fb.style.display = 'inline-flex';
                    }}
                  />
                  <span data-sheet-logo-fb style={{ display: 'none' }} className="font-black tracking-tight text-[#0F172A]">
                    EQUIPE PROPAGANDA
                  </span>
                </SheetTitle>
              </SheetHeader>

              {/* Usuário logado no drawer */}
              <div className="px-4 pb-3 flex items-center gap-3 border-b border-gray-100">
                <div
                  className="w-11 h-11 rounded-full font-bold flex items-center justify-center text-white text-base select-none shrink-0"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  {String(userName || 'G').trim().charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-gray-900 truncate">
                    {userName}
                  </div>
                  {userEmail && (
                    <div className="text-[12px] text-gray-500 truncate">
                      {userEmail}
                    </div>
                  )}
                </div>
              </div>

              {/* Botão LEGADO no drawer */}
              <div className="px-4 pt-3">
                <a
                  href="/dashboard"
                  className="inline-flex w-full items-center justify-center gap-2 h-10 px-3 text-[13px] font-semibold rounded-lg border border-amber-300/70 bg-amber-100/95 hover:bg-amber-50 text-amber-900 no-underline transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-bold">Dashboard antigo</span>
                  <span className="inline-flex items-center px-2 py-0 text-[10px] h-5 rounded font-black text-white bg-amber-600">
                    LEGADO
                  </span>
                </a>
              </div>

              {/* Accordion com os 8 grupos */}
              <div className="flex-1 overflow-y-auto px-2 pt-2 pb-24">
                <Accordion type="multiple">
                  {NAV_GRUPOS.map((grupo) => {
                    const IconG = grupo.icon;
                    return (
                      <AccordionItem key={grupo.key} value={grupo.key}>
                        <AccordionTrigger className="pl-2">
                          <span className="inline-flex items-center gap-2">
                            <IconG className="w-5 h-5 text-indigo-600 shrink-0" />
                            <span>{grupo.label}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-0.5 pl-2 pr-1">
                            {grupo.items.map((item) => {
                              const IconL = grupo.icon;
                              return (
                                <SheetClose asChild key={item.name}>
                                  <a
                                    href={item.href}
                                    className="group relative flex items-start gap-x-3 rounded-lg p-2.5 text-sm leading-5 hover:bg-indigo-50 no-underline text-gray-900 transition-colors"
                                  >
                                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-gray-50 group-hover:bg-white shrink-0">
                                      <IconL className="h-4 w-4 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                    </div>
                                    <div className="flex-auto min-w-0">
                                      <div className="block font-semibold text-[13.5px] text-gray-900 truncate">
                                        {item.name}
                                      </div>
                                      <p className="mt-0.5 text-gray-500 text-[12px] leading-snug line-clamp-2">
                                        {item.description}
                                      </p>
                                    </div>
                                  </a>
                                </SheetClose>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ========== ESQUERDA: LOGO ========== */}
        <a
          href="/r/dashboard"
          className="flex items-center gap-2 min-w-0 max-w-[140px] md:max-w-[160px] md:min-w-[160px] no-underline shrink-0 overflow-hidden"
        >
          <img
            src="/storage/img/logo-black.png"
            alt="Equipe Propaganda · SGEP"
            className="h-7 md:h-8 w-auto object-contain"
            onError={(ev) => {
              const tgt = ev.currentTarget;
              tgt.style.display = 'none';
              const fb = tgt.parentElement.querySelector('[data-logo-fb]');
              if (fb) fb.style.display = 'inline-flex';
            }}
          />
          <div data-logo-fb style={{ display: 'none' }}>
            <div className="text-[13px] md:text-[14px] font-black tracking-tight text-white select-none whitespace-nowrap">
              EQUIPE PROPAGANDA
            </div>
          </div>
        </a>

        {/* ========== CENTRO: 8 ABAS DROPDOWN (APENAS md+) ========== */}
        <nav className="hidden md:flex items-center gap-0 flex-1 justify-start lg:justify-center overflow-visible h-full min-w-0">
          {NAV_GRUPOS.map((grupo) => {
            const isActive = activeTab === grupo.key;
            return (
              <Popover key={grupo.key}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'inline-flex items-center gap-x-1 px-2 md:px-3 lg:px-4 h-[56px] text-[12px] md:text-[13px] lg:text-[14px] font-semibold whitespace-nowrap border-b-[3px] transition-colors bg-transparent border-0 outline-none cursor-pointer',
                      isActive
                        ? 'text-white border-white'
                        : 'text-gray-300 border-transparent hover:text-white hover:border-white/20',
                    )}
                  >
                    <span>{grupo.label}</span>
                    <ChevronDown
                      className="h-4 w-4 flex-none text-gray-400 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-[420px] max-w-[92vw] max-h-[65vh] overflow-auto rounded-3xl"
                >
                  <div className="p-4 space-y-1">
                    {grupo.items.map((item) => {
                      const IconL = grupo.icon;
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className="group relative flex items-center gap-x-6 rounded-xl p-4 text-sm leading-6 hover:bg-gray-50 no-underline text-gray-900"
                        >
                          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white shrink-0">
                            <IconL className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                          </div>
                          <div className="flex-auto min-w-0">
                            <div className="block font-semibold text-gray-900 truncate">
                              {item.name}
                            </div>
                            <p className="mt-1 text-gray-500 text-[13px] leading-snug line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </nav>

        {/* ========== DIREITA: AÇÕES ========== */}
        <div className="flex items-center gap-0.5 md:gap-1 ml-auto shrink-0 pl-1 md:pl-2 min-w-0 overflow-hidden">
          {/* Botão LEGADO (apenas md+) */}
          <a
            href="/dashboard"
            title="Voltar para o Dashboard Vue (legado)"
            className="hidden md:inline-flex items-center gap-1.5 h-8 px-2.5 text-[11px] font-semibold rounded-lg border border-amber-300/70 bg-amber-100/95 hover:bg-amber-50 text-amber-900 no-underline mr-1 lg:mr-2 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="inline font-bold">Dashboard antigo</span>
            <span className="inline-flex items-center px-1.5 py-0 text-[9px] h-4 rounded font-black text-white bg-amber-600">
              LEGADO
            </span>
          </a>

          {/* Search */}
          <button
            type="button"
            title="Busca (Ctrl+K)"
            className="hidden sm:flex h-9 w-9 rounded-lg items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-0 shrink-0"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            title="Notificações"
            className="relative h-9 w-9 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-0 shrink-0"
          >
            <Bell className="w-[18px] h-[18px]" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[10px] h-[10px] p-0 rounded-full bg-pink-500 ring-2 ring-[#0F172A]" />
            )}
          </button>

          {/* Settings */}
          <button
            type="button"
            title="Configurações"
            className="hidden sm:flex h-9 w-9 rounded-lg items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-0 shrink-0"
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>

          {/* User avatar */}
          <div className="pl-1 ml-0.5 shrink-0">
            <div
              className="w-9 h-9 rounded-full font-bold flex items-center justify-center text-white text-sm select-none ring-2 ring-white/10 shrink-0 cursor-pointer"
              style={{ backgroundColor: '#ef4444' }}
              title={`${userName}${userEmail ? ' • ' + userEmail : ''}`}
            >
              {String(userName || 'G').trim().charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
