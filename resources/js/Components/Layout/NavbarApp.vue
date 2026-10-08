<script setup>
import { ref, computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverGroup,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue';
import ModalAlteraSenha from '@/Components/Layout/ModalAlteraSenha.vue';

const page = usePage();
const authUser = computed(() => page.props.auth?.user || null);
const userName = computed(() => authUser.value?.name || authUser.value?.username || 'Gestor OOH');
const userEmail = computed(() => authUser.value?.email || '');
const userInitial = computed(() => String(userName.value || 'G').trim().charAt(0).toUpperCase());

const mobileDrawerOpen = ref(false);
const modalSenhaOpen = ref(false);

function handleOpenModalSenha(val) {
  modalSenhaOpen.value = val === 't' || val === true;
}

const NAV_GRUPOS = [
  {
    key: 'home',
    label: 'Início',
    icon: 'layout-grid',
    items: [
      { name: 'Dashboard • Novo React', description: 'Painel executivo de indicadores comerciais e operacionais.', href: '/dashboard', badge: { text: 'REACT', color: 'bg-cyan-500' } },
      { name: 'Dashboard Antigo • Vue Legado', description: 'Painel clássico de bi-semanas e clientes.', href: '/dashboard-antigo', badge: { text: 'LEGADO', color: 'bg-amber-600' } },
    ],
  },
  {
    key: 'enderecos',
    label: 'Endereços',
    icon: 'map-pin',
    items: [
      { name: 'Cidades', description: 'Realize o cadastro / edição de cidades.', href: '/CadCidade' },
      { name: 'Regiões', description: 'Realize o cadastro / edição de regiões.', href: '/CadRegiao' },
      { name: 'Bairros', description: 'Realize o cadastro / edição de bairros.', href: '/CadBairro' },
    ],
  },
  {
    key: 'clientes',
    label: 'Clientes',
    icon: 'user',
    items: [
      { name: 'Lista de Clientes', description: 'Realize o cadastro / edição de novos clientes.', href: '/Clientes' },
    ],
  },
  {
    key: 'paineis',
    label: 'Painéis',
    icon: 'image',
    items: [
      { name: 'Lista de Painéis', description: 'Realize o cadastro / edição de painéis.', href: '/Paineis' },
      { name: 'Envio de Disponibilidades', description: 'Consulte painéis disponíveis, reservados e envie disponibilidades.', href: '/ResPaineis' },
      { name: 'Reserva de Painéis', description: 'Realize a reserva / cancelamento de reserva para clientes.', href: '/ResPaineisCli' },
      { name: 'Gerar PI (Vue Legado)', description: 'Fluxo antigo Vue de emissão de PI por reserva.', href: '/ReservaSemPi' },
      { name: 'Reservas sem PI • Novo React', description: 'Nova interface React com cards agrupados e stepper de emissão.', href: '/reservas-sem-pi', badge: { text: 'NOVO', color: 'bg-emerald-500' } },
    ],
  },
  {
    key: 'vendas',
    label: 'Vendas',
    icon: 'dollar-sign',
    items: [
      { name: 'Lançar Venda • Novo React', description: 'Nova interface React com cards, filtros e stepper de venda.', href: '/vendas/lancar', badge: { text: 'NOVO', color: 'bg-emerald-500' } },
      { name: 'Lançar Venda (Vue Legado)', description: 'Fluxo antigo Vue de lançamento de venda.', href: '/Vendas/Lancar-antigo' },
    ],
  },
  {
    key: 'arquivos',
    label: 'Arquivos',
    icon: 'sparkles',
    items: [
      { name: 'Disponibilidades Enviadas', description: 'Em Breve.', href: '#' },
      { name: "Pi's Geradas", description: "Exibe todas as Pi's geradas nos ultimos 60 dias", href: '/PisGeradas' },
      { name: 'Vendas Geradas', description: 'Exibe todas as Vendas geradas', href: '/VendasGeradas' },
    ],
  },
  {
    key: 'relatorios',
    label: 'Relatórios',
    icon: 'file-text',
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
    icon: 'dollar-sign',
    items: [
      { name: 'Cadastro de Serviços', description: 'Realize o cadastro / edição de serviços.', href: '/Servicos' },
      { name: 'Cadastro de Comissões', description: 'Realize o cadastro / edição de comissões.', href: '/Comissoes' },
      { name: 'Cadastro de Comissões - Novo', description: 'Tela React para gestão de regras de comissão usadas em PIs e OSs.', href: '/cadastro-comissoes', badge: { text: 'NOVO', color: 'bg-emerald-500' } },
      { name: 'Controle de Caixa (Vue Legado)', description: 'Fluxo antigo Vue de entradas e saídas.', href: '/Caixa' },
      { name: 'Caixa • Novo React', description: 'Nova interface com modais de Quitar, Editar, Excluir e emissão.', href: '/caixa', badge: { text: 'REACT', color: 'bg-cyan-500' } },
      { name: 'Comissões Pagas', description: 'Lista as comissões pagas por PI.', href: '/ListaComissoesPagas' },
    ],
  },
  {
    key: 'configuracoes',
    label: 'Configurações',
    icon: 'globe',
    items: [
      { name: 'Cadastro de Usuários', description: 'Realize o cadastro / edição de usuários no sistema.', href: '/ListaUsuarios' },
      { name: 'Configurações Gerais', description: 'Configurações Diversas', href: '/configuracoes' },
    ],
  },
];
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 text-white shadow-md"
    style="background-color: #0F172A;"
  >
    <div class="flex h-[56px] w-full items-center px-3 lg:px-6 gap-1 md:gap-3 relative">
      <!-- ========== MOBILE: BOTÃO HAMBÚRGUER ========== -->
      <div class="md:hidden flex items-center justify-center shrink-0 min-w-0">
        <button
          type="button"
          aria-label="Abrir menu"
          class="h-10 w-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors bg-transparent border-0 shrink-0 cursor-pointer"
          @click="mobileDrawerOpen = true"
        >
          <!-- Menu hamburger icon -->
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- ========== ESQUERDA: LOGO ========== -->
      <a
        href="/dashboard"
        class="flex items-center gap-2 min-w-0 max-w-[140px] md:max-w-[160px] md:min-w-[160px] no-underline shrink-0"
      >
        <img
          src="/storage/img/logo-black.png"
          alt="Equipe Propaganda · SGEP"
          class="h-7 md:h-8 w-auto object-contain"
        />
      </a>

      <!-- ========== CENTRO: 9 ABAS DROPDOWN (md+) ========== -->
      <PopoverGroup as="nav" class="hidden md:flex items-center gap-0 flex-1 justify-start lg:justify-center overflow-visible h-full min-w-0">
        <Popover v-for="grupo in NAV_GRUPOS" :key="grupo.key" class="relative" v-slot="{ open }">
          <PopoverButton
            :class="[
              open ? 'text-white border-white' : 'text-gray-300 border-transparent hover:text-white hover:border-white/20',
              'inline-flex items-center gap-x-1 px-2 md:px-3 lg:px-4 h-[56px] text-[12px] md:text-[13px] lg:text-[14px] font-semibold whitespace-nowrap border-b-[3px] transition-colors bg-transparent border-0 outline-none cursor-pointer'
            ]"
          >
            <span>{{ grupo.label }}</span>
            <svg
              :class="[open ? 'rotate-180' : '', 'h-4 w-4 flex-none text-gray-400 shrink-0 transition-transform duration-200']"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </PopoverButton>

          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <PopoverPanel
              :class="[
                ['relatorios', 'financeiro', 'configuracoes'].includes(grupo.key) ? 'right-0' : 'left-0',
                'absolute top-full z-50 mt-1.5 w-[420px] max-w-[92vw] max-h-[65vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-gray-900/10 focus:outline-none'
              ]"
            >
              <div class="p-4 space-y-1">
                <a
                  v-for="item in grupo.items"
                  :key="item.name"
                  :href="item.href"
                  class="group relative flex items-center gap-x-5 rounded-xl p-3.5 text-sm leading-6 hover:bg-gray-50 no-underline text-gray-900 transition-colors"
                >
                  <div class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white shrink-0 shadow-sm border border-gray-100">
                    <!-- Icon placeholder / svg -->
                    <svg v-if="grupo.icon === 'layout-grid'" class="h-5 w-5 text-gray-600 group-hover:text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                    <svg v-else-if="grupo.icon === 'map-pin'" class="h-5 w-5 text-gray-600 group-hover:text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    <svg v-else-if="grupo.icon === 'user'" class="h-5 w-5 text-gray-600 group-hover:text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <svg v-else-if="grupo.icon === 'image'" class="h-5 w-5 text-gray-600 group-hover:text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <svg v-else-if="grupo.icon === 'dollar-sign'" class="h-5 w-5 text-gray-600 group-hover:text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <svg v-else-if="grupo.icon === 'sparkles'" class="h-5 w-5 text-gray-600 group-hover:text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                    <svg v-else-if="grupo.icon === 'file-text'" class="h-5 w-5 text-gray-600 group-hover:text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-gray-600 group-hover:text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
                    </svg>
                  </div>
                  <div class="flex-auto min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="block font-semibold text-gray-900 truncate">{{ item.name }}</span>
                      <span
                        v-if="item.badge"
                        :class="[
                          item.badge.color || 'bg-cyan-500',
                          'inline-flex items-center px-1.5 py-0 text-[9px] h-4 rounded font-black tracking-wider text-white'
                        ]"
                      >
                        {{ item.badge.text }}
                      </span>
                    </div>
                    <p class="mt-1 text-gray-500 text-[13px] leading-snug line-clamp-2">{{ item.description }}</p>
                  </div>
                </a>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </PopoverGroup>

      <!-- ========== DIREITA: AÇÕES ========== -->
      <div class="flex items-center gap-0.5 md:gap-1 ml-auto shrink-0 pl-1 md:pl-2 min-w-0 overflow-hidden">
        <!-- Botão LEGADO (apenas md+) -->
        <a
          href="/dashboard-antigo"
          title="Voltar para o Dashboard Vue (legado)"
          class="hidden md:inline-flex items-center gap-1.5 h-8 px-2.5 text-[11px] font-semibold rounded-lg border border-amber-300/70 bg-amber-100/95 hover:bg-amber-50 text-amber-900 no-underline mr-1 lg:mr-2 transition-colors whitespace-nowrap cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-amber-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
          <span class="inline font-bold">Dashboard antigo</span>
          <span class="inline-flex items-center px-1.5 py-0 text-[9px] h-4 rounded font-black text-white bg-amber-600">
            LEGADO
          </span>
        </a>

        <!-- Search button -->
        <button
          type="button"
          title="Busca"
          class="hidden sm:flex h-9 w-9 rounded-lg items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-0 shrink-0 cursor-pointer"
        >
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </button>

        <!-- Notifications button -->
        <button
          type="button"
          title="Notificações"
          class="relative h-9 w-9 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-0 shrink-0 cursor-pointer"
        >
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span class="absolute top-1.5 right-1.5 min-w-[10px] h-[10px] p-0 rounded-full bg-pink-500 ring-2 ring-[#0F172A]"></span>
        </button>

        <!-- Settings button -->
        <a
          href="/configuracoes"
          title="Configurações"
          class="hidden sm:flex h-9 w-9 rounded-lg items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-0 shrink-0 no-underline cursor-pointer"
        >
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
          </svg>
        </a>

        <!-- User avatar com Dropdown -->
        <div class="pl-1 ml-0.5 shrink-0 relative">
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton
                class="w-9 h-9 rounded-full font-bold flex items-center justify-center text-white text-sm select-none ring-2 ring-white/10 shrink-0 cursor-pointer border-0 p-0 outline-none hover:ring-white/40 transition-all"
                style="background-color: #ef4444;"
                :title="userName + (userEmail ? ' • ' + userEmail : '')"
              >
                {{ userInitial }}
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl bg-white py-1 shadow-2xl ring-1 ring-gray-900/10 focus:outline-none"
              >
                <div class="px-3.5 py-2.5 border-b border-gray-100">
                  <div class="font-semibold text-sm text-gray-900 truncate">{{ userName }}</div>
                  <div v-if="userEmail" class="text-xs text-gray-500 truncate">{{ userEmail }}</div>
                </div>

                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <a
                      href="https://ibitweb.atlassian.net/servicedesk/customer/portal/1/group/1/create/10"
                      target="_blank"
                      :class="[active ? 'bg-gray-50' : '', 'flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-gray-700 no-underline transition-colors']"
                    >
                      <span>Abrir Chamado</span>
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" />
                      </svg>
                    </a>
                  </MenuItem>

                  <MenuItem v-slot="{ active }">
                    <button
                      type="button"
                      @click="handleOpenModalSenha('t')"
                      :class="[active ? 'bg-gray-50' : '', 'w-full text-left flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-gray-700 no-underline transition-colors bg-transparent border-0 cursor-pointer']"
                    >
                      <span>Alterar Senha</span>
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </button>
                  </MenuItem>

                  <div class="border-t border-gray-100 my-1"></div>

                  <MenuItem v-slot="{ active }">
                    <a
                      href="/logout"
                      :class="[active ? 'bg-red-50' : '', 'flex items-center justify-between px-3.5 py-2 text-xs font-bold text-red-600 no-underline transition-colors']"
                    >
                      <span>Sair</span>
                      <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <!-- ========== MOBILE DRAWER (SHEET) ========== -->
    <TransitionRoot as="template" :show="mobileDrawerOpen">
      <Dialog as="div" class="relative z-50 md:hidden" @close="mobileDrawerOpen = false">
        <!-- Backdrop -->
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative flex w-full max-w-xs flex-1 flex-col bg-white overflow-hidden shadow-2xl">
              <!-- Drawer Header -->
              <div class="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                <a href="/dashboard" class="flex items-center gap-2" @click="mobileDrawerOpen = false">
                  <img
                    src="/storage/img/logo-black.png"
                    alt="Equipe Propaganda"
                    class="h-6 w-auto object-contain"
                  />
                </a>
                <button
                  type="button"
                  class="h-9 w-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors bg-transparent border-0 cursor-pointer"
                  @click="mobileDrawerOpen = false"
                >
                  <span class="sr-only">Fechar menu</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Usuário logado no drawer -->
              <div class="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-gray-50/50">
                <div
                  class="w-11 h-11 rounded-full font-bold flex items-center justify-center text-white text-base select-none shrink-0"
                  style="background-color: #ef4444;"
                >
                  {{ userInitial }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-[14px] font-semibold text-gray-900 truncate">
                    {{ userName }}
                  </div>
                  <div v-if="userEmail" class="text-[12px] text-gray-500 truncate">
                    {{ userEmail }}
                  </div>
                </div>
              </div>

              <!-- Botão LEGADO no drawer -->
              <div class="px-4 pt-3">
                <a
                  href="/dashboard-antigo"
                  class="inline-flex w-full items-center justify-center gap-2 h-10 px-3 text-[13px] font-semibold rounded-lg border border-amber-300/70 bg-amber-100/95 hover:bg-amber-50 text-amber-900 no-underline transition-colors"
                >
                  <svg class="w-4 h-4 text-amber-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                  <span class="font-bold">Dashboard antigo</span>
                  <span class="inline-flex items-center px-2 py-0 text-[10px] h-5 rounded font-black text-white bg-amber-600">
                    LEGADO
                  </span>
                </a>
              </div>

              <!-- Accordions com os grupos -->
              <div class="flex-1 overflow-y-auto px-2 pt-2 pb-6">
                <div class="space-y-1">
                  <Disclosure
                    v-for="grupo in NAV_GRUPOS"
                    :key="grupo.key"
                    as="div"
                    class="border-b border-gray-100 last:border-0"
                    v-slot="{ open }"
                  >
                    <DisclosureButton
                      class="flex w-full items-center justify-between rounded-lg py-3 px-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      <span class="inline-flex items-center gap-2.5">
                        <!-- Group icon -->
                        <span class="text-indigo-600">
                          <svg v-if="grupo.icon === 'layout-grid'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
                          </svg>
                          <svg v-else-if="grupo.icon === 'map-pin'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                          <svg v-else-if="grupo.icon === 'user'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                          </svg>
                          <svg v-else-if="grupo.icon === 'image'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                          <svg v-else-if="grupo.icon === 'dollar-sign'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                          <svg v-else-if="grupo.icon === 'sparkles'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                          </svg>
                          <svg v-else-if="grupo.icon === 'file-text'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
                          </svg>
                          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
                          </svg>
                        </span>
                        <span>{{ grupo.label }}</span>
                      </span>
                      <svg
                        :class="[open ? 'rotate-180' : '', 'h-4 w-4 text-gray-400 transition-transform duration-200']"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                      </svg>
                    </DisclosureButton>
                    <DisclosurePanel class="space-y-1 pb-2 pl-2 pr-1">
                      <a
                        v-for="item in grupo.items"
                        :key="item.name"
                        :href="item.href"
                        @click="mobileDrawerOpen = false"
                        class="group relative flex items-start gap-x-3 rounded-lg p-2.5 text-sm leading-5 hover:bg-indigo-50 no-underline text-gray-900 transition-colors"
                      >
                        <div class="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-gray-50 group-hover:bg-white shrink-0 border border-gray-100">
                          <svg class="h-4 w-4 text-gray-600 group-hover:text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                        <div class="flex-auto min-w-0">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="block font-semibold text-[13.5px] text-gray-900 truncate">{{ item.name }}</span>
                            <span
                              v-if="item.badge"
                              :class="[
                                item.badge.color || 'bg-cyan-500',
                                'inline-flex items-center px-1.5 py-0 text-[9px] h-4 rounded font-black tracking-wider text-white'
                              ]"
                            >
                              {{ item.badge.text }}
                            </span>
                          </div>
                          <p class="mt-0.5 text-gray-500 text-[12px] leading-snug line-clamp-2">{{ item.description }}</p>
                        </div>
                      </a>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              </div>

              <!-- Rodapé do Drawer -->
              <div class="p-4 border-t border-gray-100 bg-gray-50/50 space-y-1">
                <button
                  type="button"
                  @click="mobileDrawerOpen = false; handleOpenModalSenha('t')"
                  class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg no-underline transition-colors bg-transparent border-0 cursor-pointer"
                >
                  <span>Alterar Senha</span>
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </button>
                <a
                  href="https://ibitweb.atlassian.net/servicedesk/customer/portal/1/group/1/create/10"
                  target="_blank"
                  rel="noreferrer"
                  class="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg no-underline transition-colors"
                >
                  <span>Abrir Chamado</span>
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                </a>
                <a
                  href="/logout"
                  class="flex items-center justify-between px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg no-underline transition-colors"
                >
                  <span>Sair do Sistema</span>
                  <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                </a>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal Alterar Senha -->
    <ModalAlteraSenha
      v-if="authUser"
      :openPi="modalSenhaOpen"
      :user="authUser"
      @closePi="handleOpenModalSenha"
    />
  </header>
</template>
