<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, reactive, nextTick } from 'vue';
import { UserCircleIcon } from '@heroicons/vue/24/outline';
import { usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import axios from 'axios';

const toastr = useToastr();

const props = defineProps(['cliente', 'campanha', 'paineis', 'bisemana', 'dataReserva', 'agentes', 'vendedorId', 'vendedorNome']);
const emit = defineEmits(['nextStep', 'formTwo']);

const edit = ref(true);
const page = usePage();

const dropdownOpen = ref(false);
const dropdownRef = ref(null);
const searchInputRef = ref(null);
const searchTerm = ref('');

const participantesOptions = ref([]);
const participantesSelected = ref([]);
const participantesComissoes = ref([]);
const comissoesAtivas = ref([]);
const loadingParticipantes = ref(false);

const paineisTexto = computed(() => {
  if (!props.paineis) return '';
  if (Array.isArray(props.paineis)) {
    return props.paineis.join(', ');
  }
  return String(props.paineis);
});

const formTwo = reactive({
  paineis: props.paineis,
  campanha: props.campanha ? (Array.isArray(props.campanha) ? props.campanha[0] : props.campanha) : '',
  vendedorId: props.vendedorId || 0,
  vendedor: props.vendedorNome || '',
  agentesId: [],
  participantesComissoes: [],
});

function getInitials(name) {
  if (!name) return '??';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function tirarAcentos(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const filteredParticipantes = computed(() => {
  const s = tirarAcentos(searchTerm.value).trim().toLowerCase();
  if (!s) return participantesOptions.value;
  return participantesOptions.value.filter(p => {
    const nome = tirarAcentos(p.nome || '').toLowerCase();
    const badge = tirarAcentos(p.badge_label || '').toLowerCase();
    return nome.includes(s) || badge.includes(s);
  });
});

const displaySummary = computed(() => {
  if (participantesSelected.value.length === 0) {
    return 'Selecione os participantes';
  }
  let cntUser = 0;
  let cntAg = 0;
  participantesSelected.value.forEach(k => {
    if (String(k).startsWith('user:')) cntUser++;
    else cntAg++;
  });
  const primeiroChave = participantesSelected.value[0];
  const primeiro = participantesOptions.value.find(o => o.chave === primeiroChave);
  const primeiroNome = primeiro ? primeiro.nome : '';
  const total = participantesSelected.value.length;
  const resumo = `${total} participante${total === 1 ? '' : 's'} (${cntUser} Vendedor${cntUser === 1 ? '' : 'es'} / ${cntAg} Agente${cntAg === 1 ? '' : 's'})`;
  return primeiroNome ? `${primeiroNome} · ${resumo}` : resumo;
});

function isParticipanteSelected(part) {
  return participantesSelected.value.includes(part.chave);
}

function toggleParticipante(part) {
  if (!edit.value) return;
  const chave = part.chave;
  const idx = participantesSelected.value.indexOf(chave);
  if (idx >= 0) {
    participantesSelected.value.splice(idx, 1);
    participantesComissoes.value = participantesComissoes.value.filter(p => p.chave !== chave);
  } else {
    participantesSelected.value.push(chave);

    // Seleciona regra padrão se existir
    let padraoId = 0;
    let padraoNome = '';
    let padraoTipo = 1;
    let padraoVal = 0;
    let padraoApresentavel = '';

    if (comissoesAtivas.value.length > 0) {
      const match = comissoesAtivas.value.find(c =>
        c.nome.toLowerCase().includes('padrão') || c.nome.toLowerCase().includes('padrao')
      ) || comissoesAtivas.value[0];

      if (match) {
        padraoId = match.id;
        padraoNome = match.nome;
        padraoTipo = match.tipo_comissao;
        padraoVal = match.valor_numerico;
        padraoApresentavel = match.valor_apresentavel;
      }
    }

    participantesComissoes.value.push({
      chave: chave,
      pessoa_tipo: part.pessoa_tipo,
      pessoa_id: part.pessoa_id,
      nome: part.nome,
      badge_label: part.badge_label || (part.pessoa_tipo === 'user' ? 'Vendedor' : 'Agente'),
      comissao_id: padraoId,
      comissao_nome: padraoNome,
      comissao_tipo: padraoTipo,
      comissao_valor_numerico: padraoVal,
      comissao_valor_apresentavel: padraoApresentavel,
    });
  }
  syncFormTwo();
}

function onComissaoChange(pc) {
  const selId = Number(pc.comissao_id);
  if (selId === -1) {
    pc.comissao_nome = 'Sem comissão';
    pc.comissao_tipo = 1;
    pc.comissao_valor_numerico = 0;
    pc.comissao_valor_apresentavel = '0%';
  } else {
    const reg = comissoesAtivas.value.find(c => Number(c.id) === selId);
    if (reg) {
      pc.comissao_nome = reg.nome;
      pc.comissao_tipo = reg.tipo_comissao;
      pc.comissao_valor_numerico = reg.valor_numerico;
      pc.comissao_valor_apresentavel = reg.valor_apresentavel;
    }
  }
  syncFormTwo();
}

function syncFormTwo() {
  const users = participantesComissoes.value.filter(p => p.pessoa_tipo === 'user');
  const clientes = participantesComissoes.value.filter(p => p.pessoa_tipo === 'cliente');

  if (users.length > 0) {
    formTwo.vendedorId = users[0].pessoa_id;
    formTwo.vendedor = users[0].nome;
  } else {
    formTwo.vendedorId = 0;
    formTwo.vendedor = '';
  }

  formTwo.agentesId = clientes.map(c => c.pessoa_id);
  formTwo.participantesComissoes = participantesComissoes.value;
}

function toggleDropdown() {
  if (!edit.value) return;
  dropdownOpen.value = !dropdownOpen.value;
  if (dropdownOpen.value) {
    nextTick(() => {
      if (searchInputRef.value) searchInputRef.value.focus();
    });
  }
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
}

function changeEdit() {
  edit.value = !edit.value;
}

async function loadInitialData() {
  loadingParticipantes.value = true;
  try {
    const [partRes, comRes] = await Promise.all([
      axios.get('/listarParticipantesComissao'),
      axios.get('/listarComissoesAtivas'),
    ]);

    const parts = (partRes.data || []).map(p => ({
      ...p,
      chave: `${p.pessoa_tipo}:${p.pessoa_id}`,
    }));
    participantesOptions.value = parts;
    comissoesAtivas.value = comRes.data || [];

    // Tenta restaurar do localStorage se existir
    const saved = localStorage.getItem('piFormTwo');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.campanha) formTwo.campanha = parsed.campanha;
        if (Array.isArray(parsed.participantesComissoes) && parsed.participantesComissoes.length > 0) {
          participantesComissoes.value = parsed.participantesComissoes;
          participantesSelected.value = parsed.participantesComissoes.map(p => p.chave);
          syncFormTwo();
          return;
        }
      } catch (e) {
        console.error('Erro ao restaurar piFormTwo do localStorage:', e);
      }
    }

    // Se nenhum selecionado ainda, pré-seleciona vendedor da reserva ou usuário autenticado
    if (participantesSelected.value.length === 0) {
      const targetUserId = props.vendedorId || page.props.auth?.user?.id;
      if (targetUserId) {
        const userOpt = parts.find(p => p.pessoa_tipo === 'user' && Number(p.pessoa_id) === Number(targetUserId));
        if (userOpt) {
          toggleParticipante(userOpt);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao carregar participantes e comissões:', error);
  } finally {
    loadingParticipantes.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  loadInitialData();
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

const nextStep = (val) => {
  if (val === 1) {
    emit('nextStep', val);
    return;
  }
  if (val === 3) {
    if (participantesSelected.value.length === 0) {
      toastr.error('Selecione pelo menos um Participante (Vendedor ou Agente)');
      return;
    }
    const temUser = participantesComissoes.value.some(p => p.pessoa_tipo === 'user');
    if (!temUser) {
      toastr.error('Selecione pelo menos um Vendedor como participante.');
      return;
    }
    const semRegra = participantesComissoes.value.some(p => !p.comissao_id || p.comissao_id === 0);
    if (semRegra) {
      toastr.error('Selecione a regra de comissão para todos os participantes.');
      return;
    }

    syncFormTwo();
    emit('formTwo', formTwo);
    emit('nextStep', 3);
  }
};
</script>

<template>
  <div class="space-y-5">
    <!-- Cabeçalho -->
    <div class="mt-2 text-center sm:mt-0 sm:text-left">
      <h1 class="text-base font-semibold leading-6 text-gray-900">Pedido de Inserção</h1>
      <div class="flex items-center justify-center sm:justify-start mt-1.5">
        <p class="text-sm text-gray-500 mb-0">Confira os dados da reserva e comissões do lançamento.</p>
        <button
          type="button"
          class="btn btn-sm btn-circle ml-3"
          :class="edit ? 'btn-success text-white' : 'btn-warning text-white'"
          @click="changeEdit()"
          :title="edit ? 'Edição Ativada' : 'Ativar Edição'"
        >
          <UserCircleIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <p v-if="bisemana && bisemana[0]" class="text-xs font-bold text-red-500 text-center mt-2">
        Bi-Semana: {{ bisemana[0].num_bisemana }}
        {{ new Date(bisemana[0].inicio).toLocaleDateString('pt-br', { timeZone: 'UTC' }) }} até
        {{ new Date(bisemana[0].fim).toLocaleDateString('pt-br', { timeZone: 'UTC' }) }}
      </p>
    </div>

    <!-- Linha Painéis / Campanha -->
    <div class="flex flex-col sm:flex-row w-full gap-4">
      <div class="w-full sm:w-7/12">
        <label class="label py-1">
          <span class="label-text font-medium text-gray-700">Painéis</span>
        </label>
        <input
          type="text"
          :value="paineisTexto"
          class="input input-bordered w-full h-10 text-sm font-bold text-red-500 bg-gray-50"
          disabled
        />
      </div>

      <div class="w-full sm:w-5/12">
        <label class="label py-1">
          <span class="label-text font-medium text-gray-700">Campanha</span>
        </label>
        <input
          type="text"
          v-model="formTwo.campanha"
          class="input input-bordered w-full h-10 text-sm bg-white"
          placeholder="Informe a campanha (opcional)"
          :disabled="!edit"
        />
      </div>
    </div>

    <!-- Participantes que receberão comissão -->
    <div class="w-full relative" ref="dropdownRef">
      <label class="label py-1">
        <span class="label-text font-medium text-gray-700">Participantes que receberão comissão *</span>
      </label>

      <!-- Botão Trigger -->
      <button
        type="button"
        @click="toggleDropdown"
        :disabled="!edit"
        class="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        <span :class="['truncate text-left', participantesSelected.length === 0 ? 'text-gray-400' : 'text-gray-900 font-medium']">
          {{ displaySummary }}
        </span>
        <svg
          class="h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0"
          :class="{ 'rotate-180': dropdownOpen }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Dropdown Panel -->
      <div
        v-if="dropdownOpen"
        class="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
      >
        <!-- Busca interna -->
        <div class="p-2 border-b border-slate-100 bg-slate-50/80">
          <div class="flex items-center gap-2 px-2 py-1.5 rounded-md border border-slate-300 bg-white focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-600">
            <svg class="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref="searchInputRef"
              type="text"
              v-model="searchTerm"
              placeholder="Digite o nome do participante..."
              class="flex-1 bg-transparent outline-none text-xs text-gray-800 placeholder:text-gray-400"
            />
            <button
              v-if="searchTerm"
              type="button"
              @click="searchTerm = ''"
              class="text-gray-400 hover:text-gray-600 text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Lista com Checkboxes -->
        <div class="max-h-60 overflow-y-auto p-1 text-sm space-y-0.5">
          <div v-if="loadingParticipantes" class="p-3 text-xs text-slate-500 text-center">
            Carregando lista de vendedores e agentes...
          </div>
          <div v-else-if="filteredParticipantes.length === 0" class="p-3 text-xs text-gray-500 text-center italic">
            Nenhum participante encontrado.
          </div>
          <div
            v-for="part in filteredParticipantes"
            :key="part.chave"
            @click="toggleParticipante(part)"
            :class="[
              'flex items-center gap-2 px-2.5 py-2 cursor-pointer rounded-md transition-colors',
              isParticipanteSelected(part) ? 'bg-emerald-50' : 'hover:bg-slate-100'
            ]"
          >
            <input
              type="checkbox"
              :checked="isParticipanteSelected(part)"
              class="checkbox checkbox-sm checkbox-success pointer-events-none"
            />
            <span class="flex-1 min-w-0 truncate text-slate-800 text-xs sm:text-sm font-medium">
              {{ part.nome }}
            </span>
            <span
              :class="[
                'flex-shrink-0 text-[10px] font-bold uppercase tracking-tight rounded px-1.5 py-0.5',
                part.pessoa_tipo === 'user'
                  ? 'bg-slate-100 text-slate-700 border border-slate-300'
                  : 'bg-sky-50 text-sky-700 border border-sky-300'
              ]"
            >
              {{ part.badge_label || (part.pessoa_tipo === 'user' ? 'Vendedor' : 'Agente') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Dica -->
      <p class="text-[11px] leading-4 text-slate-500 mt-1 pl-0.5">
        <span class="font-medium text-slate-600">Dica:</span> digite o nome no dropdown para pesquisar. Inclua o
        <span class="font-semibold text-slate-700">Vendedor</span> como participante para ele também receber comissão.
      </p>
    </div>

    <!-- Regras de comissão por participante -->
    <div v-if="participantesComissoes.length > 0" class="space-y-2.5 pt-1">
      <h3 class="text-sm font-semibold text-gray-800">Regras de comissão por participante</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="pc in participantesComissoes"
          :key="pc.chave"
          class="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50/60 p-3 flex flex-col gap-2 shadow-sm"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white',
                pc.pessoa_tipo === 'user' ? 'bg-slate-700' : 'bg-sky-600'
              ]"
            >
              {{ getInitials(pc.nome) }}
            </span>
            <div class="flex items-center gap-1.5 min-w-0 flex-1">
              <span class="truncate text-sm font-semibold text-slate-800" :title="pc.nome">
                {{ pc.nome }}
              </span>
              <span
                :class="[
                  'flex-shrink-0 text-[10px] font-bold uppercase tracking-tight rounded px-1.5 py-0.5',
                  pc.pessoa_tipo === 'user'
                    ? 'bg-slate-100 text-slate-700 border border-slate-300'
                    : 'bg-sky-50 text-sky-700 border border-sky-300'
                ]"
              >
                {{ pc.badge_label || (pc.pessoa_tipo === 'user' ? 'Vendedor' : 'Agente') }}
              </span>
            </div>
          </div>

          <div class="space-y-1">
            <label class="label py-0">
              <span class="label-text text-xs font-medium text-slate-600">Regra de comissão padrão *</span>
            </label>
            <select
              v-model="pc.comissao_id"
              @change="onComissaoChange(pc)"
              class="select select-bordered select-sm w-full bg-white text-xs"
              :disabled="!edit"
            >
              <option :value="0" disabled>Selecione a regra...</option>
              <option v-for="c in comissoesAtivas" :key="c.id" :value="c.id">
                {{ c.nome }} ({{ c.valor_apresentavel }})
              </option>
              <option :value="-1">Sem comissão (Isento / 0%)</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Botões Voltar / Avançar -->
    <div class="w-full sm:flex sm:flex-row-reverse pt-2">
      <button class="btn btn-success w-full sm:w-auto sm:ml-3 text-white" @click="nextStep(3)">
        Avançar
      </button>
      <button class="btn btn-outline mt-3 sm:mt-0 w-full sm:w-auto" @click="nextStep(1)">
        Voltar
      </button>
    </div>
  </div>
</template>
