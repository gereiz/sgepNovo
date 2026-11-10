<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, computed, watch } from 'vue';
import axios from 'axios';

const page = usePage();
const toastr = useToastr();

const props = defineProps({
    search: { type: String, default: '' },
    status: { type: String, default: 'todos' },
    centroCustoId: { type: Number, default: 0 },
    tipoLancId: { type: Number, default: 0 },
    page: { type: Number, default: 1 },
    perPage: { type: Number, default: 50 },
    totalItens: { type: Number, default: 0 },
    paginas: { type: Number, default: 1 },
    kpis: {
        type: Object,
        default: () => ({ total_faturado: 0, recebido: 0, a_receber: 0 }),
    },
    centros_custo: { type: Array, default: () => [] },
    tipos_lancamento: { type: Array, default: () => [] },
    lancamentos: { type: Array, default: () => [] },
});

const permissions = computed(() => page.props.user?.permissions || []);
const criaLancamento = computed(() => permissions.value.length === 0 || permissions.value.includes('criar lancamento'));
const editaLancamento = computed(() => permissions.value.length === 0 || permissions.value.includes('editar lancamento'));
const excluiLancamento = computed(() => permissions.value.length === 0 || permissions.value.includes('excluir lancamento'));

// Filtros
const searchInput = ref(props.search || '');
const statusInput = ref(props.status || 'todos');
const ccInput = ref(props.centroCustoId ? String(props.centroCustoId) : '0');
const tlInput = ref(props.tipoLancId ? String(props.tipoLancId) : '0');
const pagAtual = ref(Number(props.page) || 1);
const loading = ref(false);

const listaLancamentos = ref(props.lancamentos || []);
watch(() => props.lancamentos, (val) => {
    listaLancamentos.value = val || [];
});
watch(() => props.page, (val) => {
    pagAtual.value = Number(val) || 1;
});

const centrosCustoManuais = computed(() => {
    return (props.centros_custo || []).filter(c => Number(c.id) > 1);
});

const pctRecebido = computed(() => {
    const total = Number(props.kpis?.total_faturado) || 0;
    const rec = Number(props.kpis?.recebido) || 0;
    if (!total) return 0;
    return Math.round((rec / total) * 1000) / 10;
});

const pctAReceber = computed(() => {
    const total = Number(props.kpis?.total_faturado) || 0;
    if (!total) return 0;
    return Math.max(0, Math.round((100 - pctRecebido.value) * 10) / 10);
});

function formatCurrencyBRL(v) {
    const n = Number(v) || 0;
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateBR(d) {
    if (!d) return '—';
    const str = String(d).slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        const [y, m, day] = str.split('-');
        return `${day}/${m}/${y}`;
    }
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '—';
    return dt.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function formatDateForInput(d) {
    if (!d) return '';
    const str = String(d).slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function parseValorMonetario(v) {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    const s = String(v).replace('R$', '').replace(/\s+/g, '');
    const temVirgula = s.includes(',');
    const normal = temVirgula ? s.replace(/\./g, '').replace(',', '.') : s;
    const n = parseFloat(normal.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : 0;
}

function recarregar(overrides = {}) {
    const qs = {};
    const s = overrides.search !== undefined ? String(overrides.search) : searchInput.value;
    const st = overrides.status !== undefined ? String(overrides.status) : statusInput.value;
    const c = overrides.cc !== undefined ? String(overrides.cc) : ccInput.value;
    const t = overrides.tl !== undefined ? String(overrides.tl) : tlInput.value;
    const p = Number(overrides.page !== undefined ? overrides.page : pagAtual.value);

    if (s && s.trim() !== '') qs.search = s.trim();
    if (st && st !== 'todos') qs.status = st;
    if (c && c !== '0') qs.cc = c;
    if (t && t !== '0') qs.tl = t;
    if (p > 1) qs.page = String(p);
    if (props.perPage !== 50) qs.perPage = String(props.perPage);

    router.get('/caixa', qs, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onStart: () => { loading.value = true; },
        onFinish: () => { loading.value = false; },
    });
}

function aplicarFiltros() {
    pagAtual.value = 1;
    recarregar({ page: 1 });
}

function limparFiltros() {
    searchInput.value = '';
    statusInput.value = 'todos';
    ccInput.value = '0';
    tlInput.value = '0';
    pagAtual.value = 1;
    recarregar({ search: '', status: 'todos', cc: '0', tl: '0', page: 1 });
}

function irParaPagina(n) {
    const total = Math.max(1, Number(props.paginas) || 1);
    const p = Math.max(1, Math.min(total, Number(n) || 1));
    pagAtual.value = p;
    recarregar({ page: p });
}

// ==================== MODAL NOVO LANÇAMENTO ====================
const modalAddOpen = ref(false);
const addSaving = ref(false);
const addForm = ref({
    descricao: '',
    centro_custo: '0',
    tipo_lancamento: '0',
    valor: '',
    parcelas: '1',
    data_lancamento: formatDateForInput(new Date()),
    observacoes: '',
});

function abrirNovoLancamento() {
    addForm.value = {
        descricao: '',
        centro_custo: '0',
        tipo_lancamento: '0',
        valor: '',
        parcelas: '1',
        data_lancamento: formatDateForInput(new Date()),
        observacoes: '',
    };
    modalAddOpen.value = true;
}

async function salvarNovoLancamento() {
    const valNum = parseValorMonetario(addForm.value.valor);
    if (!addForm.value.descricao || addForm.value.descricao.trim().length < 3) {
        toastr.error('O campo Descrição do Lançamento deve ter no mínimo 3 caracteres.');
        return;
    }
    if (!addForm.value.centro_custo || addForm.value.centro_custo === '0') {
        toastr.error('Selecione um Centro de Custo.');
        return;
    }
    if (!addForm.value.tipo_lancamento || addForm.value.tipo_lancamento === '0') {
        toastr.error('Selecione um Tipo de Lançamento.');
        return;
    }
    if (!(valNum > 0)) {
        toastr.error('Informe um Valor do Lançamento válido.');
        return;
    }
    if (!addForm.value.data_lancamento) {
        toastr.error('Selecione a Data de Vencimento.');
        return;
    }

    addSaving.value = true;
    try {
        await axios.post('/CreateLancamento', {
            descricao: addForm.value.descricao.trim(),
            centro_custo: Number(addForm.value.centro_custo),
            tipo_lancamento: Number(addForm.value.tipo_lancamento),
            valor: valNum,
            parcelas: addForm.value.parcelas || '1',
            id_reserva: 0,
            data_lancamento: addForm.value.data_lancamento,
            observacoes: addForm.value.observacoes || '',
        });
        toastr.success('Lançamento adicionado com sucesso!');
        modalAddOpen.value = false;
        recarregar();
    } catch (err) {
        toastr.error(err?.response?.data?.msg || 'Erro ao adicionar Lançamento!');
    } finally {
        addSaving.value = false;
    }
}

// ==================== MODAL QUITAR / REABRIR ====================
const modalToggleOpen = ref(false);
const toggleTarget = ref(null);
const confirmDtPag = ref('');
const toggleSaving = ref(false);

const isToggleQuitar = computed(() => {
    if (!toggleTarget.value) return true;
    return String(toggleTarget.value.status_pagamento || 'PENDENTE').toUpperCase() !== 'QUITADO';
});

function abrirModalToggle(l) {
    toggleTarget.value = l;
    const quitado = String(l.status_pagamento || '').toUpperCase() === 'QUITADO';
    confirmDtPag.value = quitado ? '' : formatDateForInput(new Date());
    modalToggleOpen.value = true;
}

function fecharModalToggle() {
    modalToggleOpen.value = false;
    toggleTarget.value = null;
    confirmDtPag.value = '';
}

async function confirmarToggleStatus() {
    if (!toggleTarget.value) return;
    if (isToggleQuitar.value && !confirmDtPag.value) {
        toastr.error('Informe a Data Real de Pagamento.');
        return;
    }

    toggleSaving.value = true;
    const payload = { id: toggleTarget.value.id };
    if (isToggleQuitar.value) {
        payload.dt_pagamento_real = confirmDtPag.value;
    }

    try {
        const resp = await axios.post('/ToggleLancamentoStatus', payload);
        const novo = resp?.data?.status || (isToggleQuitar.value ? 'QUITADO' : 'PENDENTE');
        toastr.success('Status atualizado para ' + novo);
        fecharModalToggle();
        recarregar();
    } catch (err) {
        toastr.error(err?.response?.data?.msg || 'Falha ao atualizar status.');
    } finally {
        toggleSaving.value = false;
    }
}

// ==================== MODAL EDITAR LANÇAMENTO ====================
const modalEditOpen = ref(false);
const editTarget = ref(null);
const editSaving = ref(false);
const editForm = ref({
    descricao: '',
    valor: '',
    parcelas: '',
    dt_faturamento: '',
    centro_custo_id: '0',
    tipo_lancamento_id: '0',
    observacoes: '',
});

function abrirModalEditar(l) {
    editTarget.value = l;
    editForm.value = {
        descricao: String(l.descricao || ''),
        valor: l.valor != null ? Number(l.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
        parcelas: String(l.parcelas || '1'),
        dt_faturamento: formatDateForInput(l.dt_faturamento),
        centro_custo_id: String(l.centro_custo_id || 0),
        tipo_lancamento_id: String(l.tipo_lancamento_id || 0),
        observacoes: String(l.observacoes || ''),
    };
    modalEditOpen.value = true;
}

function fecharModalEditar() {
    modalEditOpen.value = false;
    editTarget.value = null;
}

async function salvarEdicaoLancamento() {
    if (!editTarget.value) return;
    const valNum = parseValorMonetario(editForm.value.valor);
    if (!editForm.value.descricao || editForm.value.descricao.trim().length < 3) {
        toastr.error('A descrição deve ter no mínimo 3 caracteres.');
        return;
    }
    if (!(valNum > 0)) {
        toastr.error('Informe um valor válido.');
        return;
    }

    editSaving.value = true;
    try {
        const payload = {
            id: editTarget.value.id,
            lancamento: {
                descricao: editForm.value.descricao.trim(),
                valor: valNum,
                parcelas: editForm.value.parcelas || '1',
                dt_faturamento: editForm.value.dt_faturamento,
                centro_custo: { id: Number(editForm.value.centro_custo_id) || 0 },
                tipo_lancamento: { id: Number(editForm.value.tipo_lancamento_id) || 0 },
                id_reserva: editTarget.value.id_reserva ?? null,
                observacoes: editForm.value.observacoes || '',
            },
        };
        await axios.post('/UpdateLancamento', payload);
        toastr.success('Lançamento atualizado com sucesso!');
        fecharModalEditar();
        recarregar();
    } catch (err) {
        toastr.error(err?.response?.data?.msg || 'Erro ao atualizar lançamento.');
    } finally {
        editSaving.value = false;
    }
}

// ==================== MODAL EXCLUIR LANÇAMENTO ====================
const modalDeleteOpen = ref(false);
const deleteTarget = ref(null);
const deleteSaving = ref(false);

function abrirModalExcluir(l) {
    deleteTarget.value = l;
    modalDeleteOpen.value = true;
}

function fecharModalExcluir() {
    modalDeleteOpen.value = false;
    deleteTarget.value = null;
}

async function confirmarExclusaoLancamento() {
    if (!deleteTarget.value) return;
    deleteSaving.value = true;
    try {
        const resp = await axios.post('/DeleteLancamento', { lancamento: deleteTarget.value });
        toastr.success(resp?.data?.message || 'Lançamento excluído com sucesso!');
        fecharModalExcluir();
        recarregar();
    } catch (err) {
        toastr.error(err?.response?.data?.message || 'Erro ao excluir lançamento.');
    } finally {
        deleteSaving.value = false;
    }
}
</script>

<template>
    <Head title="Controle de Caixa - Lançamentos" />

    <AuthenticatedLayout>
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 px-2 md:px-4">
            <!-- Barra Superior no Padrão Vue -->
            <div class="navbar bg-base-100 rounded-box shadow mb-4 flex-wrap gap-2">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl font-bold">Controle de Caixa · Lançamentos</a>
                    <span class="badge badge-neutral ml-2">
                        {{ totalItens }} registros (Página {{ pagAtual }} de {{ paginas }})
                    </span>
                </div>
                <div class="flex-none flex flex-wrap gap-2">
                    <a class="btn btn-info btn-sm text-white" href="/Caixa">
                        <i class="fa-solid fa-layer-group mr-1"></i>
                        Centros de Custo / Tipos
                    </a>
                    <a class="btn btn-accent btn-sm text-white" href="/RelLancamentos">
                        <i class="fa-regular fa-file-pdf mr-1"></i>
                        Relatório de Lançamentos
                    </a>
                    <button v-if="criaLancamento" class="btn btn-success btn-sm text-white" @click="abrirNovoLancamento">
                        <i class="fa-solid fa-plus mr-1"></i>
                        Novo Lançamento
                    </button>
                </div>
            </div>

            <!-- Resumo Financeiro (KPIs no padrão DaisyUI) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="card bg-base-100 shadow-md border-l-4 border-primary">
                    <div class="card-body py-4 px-5">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs font-bold uppercase text-gray-500">Total Faturado</p>
                                <p class="text-2xl font-extrabold text-gray-900 mt-1">
                                    {{ formatCurrencyBRL(kpis?.total_faturado || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 mt-1">{{ totalItens }} lançamentos no filtro atual</p>
                            </div>
                            <div class="btn btn-circle btn-primary btn-outline no-animation">
                                <i class="fa-solid fa-dollar-sign text-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-md border-l-4 border-success">
                    <div class="card-body py-4 px-5">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs font-bold uppercase text-gray-500">Recebido / Liquidado</p>
                                <p class="text-2xl font-extrabold text-green-700 mt-1">
                                    {{ formatCurrencyBRL(kpis?.recebido || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 mt-1">{{ pctRecebido }}% do total</p>
                            </div>
                            <div class="btn btn-circle btn-success btn-outline no-animation">
                                <i class="fa-solid fa-check text-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-100 shadow-md border-l-4 border-warning">
                    <div class="card-body py-4 px-5">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs font-bold uppercase text-gray-500">A Receber / Em Aberto</p>
                                <p class="text-2xl font-extrabold text-amber-600 mt-1">
                                    {{ formatCurrencyBRL(kpis?.a_receber || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 mt-1">{{ pctAReceber }}% do total</p>
                            </div>
                            <div class="btn btn-circle btn-warning btn-outline no-animation">
                                <i class="fa-regular fa-clock text-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card de Filtros -->
            <div class="card w-full bg-base-100 shadow-md rounded-md mb-4">
                <div class="card-body p-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                        <div class="form-control lg:col-span-2">
                            <label class="label py-1">
                                <span class="label-text font-semibold text-xs uppercase">Busca Rápida</span>
                            </label>
                            <input
                                v-model="searchInput"
                                @keydown.enter="aplicarFiltros"
                                type="text"
                                placeholder="Descrição, OS nº, PI nº, observação..."
                                class="input input-bordered w-full"
                            />
                        </div>

                        <div class="form-control">
                            <label class="label py-1">
                                <span class="label-text font-semibold text-xs uppercase">Status Pagamento</span>
                            </label>
                            <select v-model="statusInput" class="select select-bordered w-full">
                                <option value="todos">Todos os status</option>
                                <option value="quitado">Quitados</option>
                                <option value="pendente">Pendentes / Em aberto</option>
                            </select>
                        </div>

                        <div class="form-control">
                            <label class="label py-1">
                                <span class="label-text font-semibold text-xs uppercase">Centro de Custo</span>
                            </label>
                            <select v-model="ccInput" class="select select-bordered w-full">
                                <option value="0">Todos</option>
                                <option v-for="c in centros_custo" :key="c.id" :value="String(c.id)">
                                    {{ c.nome }}
                                </option>
                            </select>
                        </div>

                        <div class="form-control">
                            <label class="label py-1">
                                <span class="label-text font-semibold text-xs uppercase">Tipo de Lançamento</span>
                            </label>
                            <select v-model="tlInput" class="select select-bordered w-full">
                                <option value="0">Todos</option>
                                <option v-for="t in tipos_lancamento" :key="t.id" :value="String(t.id)">
                                    {{ t.nome }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-3">
                        <button type="button" class="btn btn-ghost btn-sm border border-slate-300" @click="limparFiltros">
                            Limpar Filtros
                        </button>
                        <button type="button" class="btn btn-primary btn-sm text-white" @click="aplicarFiltros">
                            <i class="fa-solid fa-magnifying-glass mr-1"></i>
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
            </div>

            <!-- Card Principal da Tabela -->
            <div class="card w-full bg-base-100 shadow-xl rounded-md">
                <div class="card-body p-4">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-300 border table-xs">
                            <thead class="bg-base-200">
                                <tr class="divide-x divide-gray-200">
                                    <th class="py-3 px-3 text-left text-xs font-bold uppercase text-gray-700">ID</th>
                                    <th class="py-3 px-3 text-left text-xs font-bold uppercase text-gray-700">Descrição</th>
                                    <th class="py-3 px-3 text-right text-xs font-bold uppercase text-gray-700">Valor Total</th>
                                    <th class="py-3 px-3 text-right text-xs font-bold uppercase text-gray-700">Valor Líquido</th>
                                    <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Vencimento</th>
                                    <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Pagamento</th>
                                    <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">C. Custo</th>
                                    <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Tipo</th>
                                    <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Status</th>
                                    <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Obs</th>
                                    <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-if="listaLancamentos.length === 0">
                                    <td colspan="11" class="py-8 text-center text-gray-500 text-sm">
                                        Nenhum lançamento encontrado para os filtros informados.
                                    </td>
                                </tr>

                                <tr
                                    v-for="l in listaLancamentos"
                                    :key="l.id"
                                    class="divide-x divide-gray-200 hover:bg-base-200/40 transition-colors"
                                >
                                    <td class="whitespace-nowrap py-3 px-3 text-sm font-bold text-gray-900">
                                        #{{ l.id }}
                                    </td>

                                    <td class="py-3 px-3 text-sm text-gray-900">
                                        <div class="font-semibold">{{ l.descricao || '—' }}</div>
                                        <div v-if="l.parcelas || l.id_reserva" class="text-xs text-gray-500 mt-0.5 space-x-2">
                                            <span v-if="l.parcelas">Parcela: {{ l.parcelas }}</span>
                                            <span v-if="l.id_reserva">Reserva/PI: #{{ l.id_reserva }}</span>
                                        </div>
                                    </td>

                                    <td class="whitespace-nowrap py-3 px-3 text-right text-sm font-bold text-gray-900">
                                        {{ formatCurrencyBRL(l.valor || 0) }}
                                    </td>

                                    <td class="whitespace-nowrap py-3 px-3 text-right text-sm font-medium text-gray-700">
                                        {{ formatCurrencyBRL(l.valor_liquido != null ? l.valor_liquido : l.valor) }}
                                    </td>

                                    <td class="whitespace-nowrap py-3 px-3 text-center text-sm text-gray-700">
                                        {{ formatDateBR(l.dt_faturamento) }}
                                    </td>

                                    <td class="whitespace-nowrap py-3 px-3 text-center text-sm font-semibold">
                                        <span v-if="l.dt_pagamento_real" class="text-green-700">
                                            {{ formatDateBR(l.dt_pagamento_real) }}
                                        </span>
                                        <span v-else class="opacity-60">—</span>
                                    </td>

                                    <td class="whitespace-nowrap py-3 px-3 text-center text-sm text-gray-700">
                                        {{ l.centro_custo_nome || '—' }}
                                    </td>

                                    <td class="whitespace-nowrap py-3 px-3 text-center">
                                        <button
                                            v-if="l.tipo_lancamento_eh_entrada === true || String(l.tipo_lancamento_nome).toLowerCase() === 'entrada'"
                                            class="btn btn-xs btn-square btn-success btn-outline tooltip tooltip-left"
                                            :data-tip="l.tipo_lancamento_nome || 'Entrada'"
                                        >
                                            <i class="fa-solid fa-angles-up"></i>
                                        </button>
                                        <button
                                            v-else-if="l.tipo_lancamento_eh_entrada === false || String(l.tipo_lancamento_nome).toLowerCase() === 'saída' || String(l.tipo_lancamento_nome).toLowerCase() === 'saida'"
                                            class="btn btn-xs btn-square btn-error btn-outline tooltip tooltip-left"
                                            :data-tip="l.tipo_lancamento_nome || 'Saída'"
                                        >
                                            <i class="fa-solid fa-angles-down"></i>
                                        </button>
                                        <button
                                            v-else
                                            class="btn btn-xs btn-square btn-warning btn-outline tooltip tooltip-left"
                                            :data-tip="l.tipo_lancamento_nome || 'Outro'"
                                        >
                                            <i class="fa-solid fa-exclamation"></i>
                                        </button>
                                    </td>

                                    <td class="whitespace-nowrap py-3 px-3 text-center">
                                        <div class="flex items-center justify-center gap-1.5">
                                            <span
                                                v-if="String(l.status_pagamento || 'PENDENTE').toUpperCase() === 'QUITADO'"
                                                class="badge badge-success text-white badge-sm"
                                            >
                                                Quitado
                                            </span>
                                            <span v-else class="badge badge-warning text-white badge-sm">
                                                Pendente
                                            </span>

                                            <button
                                                type="button"
                                                class="btn btn-xs btn-outline"
                                                @click="abrirModalToggle(l)"
                                            >
                                                {{ String(l.status_pagamento || 'PENDENTE').toUpperCase() === 'QUITADO' ? 'Reabrir' : 'Quitar' }}
                                            </button>
                                        </div>
                                    </td>

                                    <td class="whitespace-nowrap py-3 px-3 text-center">
                                        <button
                                            v-if="l.observacoes"
                                            class="btn btn-xs btn-square btn-success btn-outline tooltip tooltip-left"
                                            :data-tip="l.observacoes"
                                        >
                                            <i class="fa-solid fa-circle-exclamation"></i>
                                        </button>
                                        <button
                                            v-else
                                            class="btn btn-xs btn-square btn-error btn-outline tooltip tooltip-left"
                                            data-tip="Nenhuma Observação"
                                        >
                                            <i class="fa-solid fa-circle-exclamation"></i>
                                        </button>
                                    </td>

                                    <td class="whitespace-nowrap py-3 px-3 text-center">
                                        <div class="flex items-center justify-center space-x-2">
                                            <button
                                                v-if="editaLancamento && Number(l.centro_custo_id) !== 1"
                                                type="button"
                                                class="btn btn-sm btn-square btn-warning text-white tooltip tooltip-left"
                                                data-tip="Editar"
                                                @click="abrirModalEditar(l)"
                                            >
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button
                                                v-if="editaLancamento && Number(l.centro_custo_id) === 1"
                                                type="button"
                                                class="btn btn-sm btn-square btn-disabled tooltip tooltip-left"
                                                data-tip="Lançamentos automáticos de reservas não podem ser editados"
                                            >
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>

                                            <button
                                                v-if="excluiLancamento && Number(l.centro_custo_id) !== 1"
                                                type="button"
                                                class="btn btn-sm btn-square btn-error text-white tooltip tooltip-left"
                                                data-tip="Excluir"
                                                @click="abrirModalExcluir(l)"
                                            >
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                            <button
                                                v-if="excluiLancamento && Number(l.centro_custo_id) === 1"
                                                type="button"
                                                class="btn btn-sm btn-square btn-disabled tooltip tooltip-left"
                                                data-tip="Lançamentos automáticos de reservas não podem ser excluídos"
                                            >
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Paginação -->
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t text-xs text-gray-600">
                        <div>
                            Mostrando
                            <strong>{{ totalItens > 0 ? ((pagAtual - 1) * perPage) + 1 : 0 }}</strong>
                            até
                            <strong>{{ Math.min(totalItens, pagAtual * perPage) }}</strong>
                            de
                            <strong>{{ totalItens }}</strong>
                            lançamentos
                        </div>

                        <div class="join">
                            <button
                                type="button"
                                class="btn btn-xs join-item"
                                :disabled="pagAtual <= 1 || loading"
                                @click="irParaPagina(pagAtual - 1)"
                            >
                                « Anterior
                            </button>
                            <button type="button" class="btn btn-xs join-item no-animation">
                                Página {{ pagAtual }} de {{ paginas }}
                            </button>
                            <button
                                type="button"
                                class="btn btn-xs join-item"
                                :disabled="pagAtual >= paginas || loading"
                                @click="irParaPagina(pagAtual + 1)"
                            >
                                Próxima »
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ==================== MODAL NOVO LANÇAMENTO ==================== -->
            <input type="checkbox" id="modal-novo-lancamento" class="modal-toggle" v-model="modalAddOpen" />
            <div class="modal" :class="{ 'modal-open': modalAddOpen }">
                <div class="modal-box max-w-xl">
                    <h3 class="font-bold text-lg mb-3">Adicionar Novo Lançamento</h3>

                    <div class="space-y-3">
                        <div class="form-control w-full">
                            <label class="label py-1"><span class="label-text font-semibold">Descrição *</span></label>
                            <input
                                v-model="addForm.descricao"
                                type="text"
                                placeholder="Descrição do Lançamento"
                                class="input input-bordered w-full"
                            />
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="form-control w-full">
                                <label class="label py-1"><span class="label-text font-semibold">Centro de Custo *</span></label>
                                <select v-model="addForm.centro_custo" class="select select-bordered w-full">
                                    <option value="0" disabled>Selecione</option>
                                    <option v-for="c in centrosCustoManuais" :key="c.id" :value="String(c.id)">
                                        {{ c.nome }}
                                    </option>
                                </select>
                            </div>

                            <div class="form-control w-full">
                                <label class="label py-1"><span class="label-text font-semibold">Tipo de Lançamento *</span></label>
                                <select v-model="addForm.tipo_lancamento" class="select select-bordered w-full">
                                    <option value="0" disabled>Selecione</option>
                                    <option v-for="t in tipos_lancamento" :key="t.id" :value="String(t.id)">
                                        {{ t.nome }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="form-control w-full">
                                <label class="label py-1"><span class="label-text font-semibold">Valor (R$) *</span></label>
                                <input
                                    v-model="addForm.valor"
                                    type="text"
                                    placeholder="Ex: 150,00"
                                    class="input input-bordered w-full"
                                />
                            </div>

                            <div class="form-control w-full">
                                <label class="label py-1"><span class="label-text font-semibold">Parcelas</span></label>
                                <select v-model="addForm.parcelas" class="select select-bordered w-full">
                                    <option v-for="n in 12" :key="n" :value="String(n)">{{ n }}</option>
                                </select>
                            </div>

                            <div class="form-control w-full">
                                <label class="label py-1"><span class="label-text font-semibold">Vencimento *</span></label>
                                <input
                                    v-model="addForm.data_lancamento"
                                    type="date"
                                    class="input input-bordered w-full"
                                />
                            </div>
                        </div>

                        <div class="form-control w-full">
                            <label class="label py-1"><span class="label-text font-semibold">Observações</span></label>
                            <textarea
                                v-model="addForm.observacoes"
                                rows="3"
                                class="textarea textarea-bordered w-full"
                                placeholder="Observações (opcional)"
                            ></textarea>
                        </div>
                    </div>

                    <div class="modal-action">
                        <button type="button" class="btn btn-ghost" :disabled="addSaving" @click="modalAddOpen = false">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-primary text-white" :disabled="addSaving" @click="salvarNovoLancamento">
                            <i v-if="addSaving" class="fa-solid fa-spinner fa-spin mr-1"></i>
                            Adicionar Lançamento
                        </button>
                    </div>
                </div>
            </div>

            <!-- ==================== MODAL QUITAR / REABRIR ==================== -->
            <input type="checkbox" id="modal-toggle-status" class="modal-toggle" v-model="modalToggleOpen" />
            <div class="modal" :class="{ 'modal-open': modalToggleOpen }">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">
                        {{ isToggleQuitar ? 'Confirmar Quitação' : 'Confirmar Reabertura' }}
                    </h3>
                    <p v-if="toggleTarget" class="text-xs text-gray-500 mt-1">
                        Lançamento <strong>#{{ toggleTarget.id }} · {{ toggleTarget.descricao }}</strong>
                    </p>

                    <div class="py-4">
                        <template v-if="isToggleQuitar">
                            <p class="text-sm mb-3">
                                Informe a Data Real de Pagamento para registrar a quitação deste lançamento:
                            </p>
                            <div class="form-control w-full">
                                <label class="label py-1">
                                    <span class="label-text font-semibold">Data Real de Pagamento</span>
                                </label>
                                <input type="date" v-model="confirmDtPag" class="input input-bordered w-full" />
                            </div>
                        </template>
                        <template v-else>
                            <p class="text-sm">
                                Ao confirmar, o lançamento voltará para o status <strong>Pendente</strong> e a Data Real de Pagamento será removida.
                            </p>
                        </template>
                    </div>

                    <div class="modal-action">
                        <button type="button" class="btn btn-ghost" :disabled="toggleSaving" @click="fecharModalToggle">
                            Cancelar
                        </button>
                        <button
                            type="button"
                            class="btn text-white"
                            :class="isToggleQuitar ? 'btn-success' : 'btn-warning'"
                            :disabled="toggleSaving"
                            @click="confirmarToggleStatus"
                        >
                            {{ toggleSaving ? 'Processando...' : (isToggleQuitar ? 'Confirmar Quitação' : 'Confirmar Reabertura') }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- ==================== MODAL EDITAR LANÇAMENTO ==================== -->
            <input type="checkbox" id="modal-editar-lancamento" class="modal-toggle" v-model="modalEditOpen" />
            <div class="modal" :class="{ 'modal-open': modalEditOpen }">
                <div class="modal-box max-w-xl">
                    <h3 class="font-bold text-lg mb-3">
                        Editar Lançamento <span class="text-amber-600">#{{ editTarget?.id }}</span>
                    </h3>

                    <div class="space-y-3">
                        <div class="form-control w-full">
                            <label class="label py-1"><span class="label-text font-semibold">Descrição</span></label>
                            <input
                                v-model="editForm.descricao"
                                type="text"
                                class="input input-bordered w-full"
                            />
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="form-control w-full">
                                <label class="label py-1"><span class="label-text font-semibold">Centro de Custo</span></label>
                                <select v-model="editForm.centro_custo_id" class="select select-bordered w-full">
                                    <option v-for="c in centros_custo" :key="c.id" :value="String(c.id)">
                                        {{ c.nome }}
                                    </option>
                                </select>
                            </div>

                            <div class="form-control w-full">
                                <label class="label py-1"><span class="label-text font-semibold">Tipo de Lançamento</span></label>
                                <select v-model="editForm.tipo_lancamento_id" class="select select-bordered w-full">
                                    <option v-for="t in tipos_lancamento" :key="t.id" :value="String(t.id)">
                                        {{ t.nome }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="form-control w-full">
                                <label class="label py-1"><span class="label-text font-semibold">Valor (R$)</span></label>
                                <input
                                    v-model="editForm.valor"
                                    type="text"
                                    class="input input-bordered w-full"
                                />
                            </div>

                            <div class="form-control w-full">
                                <label class="label py-1"><span class="label-text font-semibold">Parcelas</span></label>
                                <input
                                    v-model="editForm.parcelas"
                                    type="text"
                                    class="input input-bordered w-full"
                                />
                            </div>

                            <div class="form-control w-full">
                                <label class="label py-1"><span class="label-text font-semibold">Data de Vencimento</span></label>
                                <input
                                    v-model="editForm.dt_faturamento"
                                    type="date"
                                    class="input input-bordered w-full"
                                />
                            </div>
                        </div>

                        <div class="form-control w-full">
                            <label class="label py-1"><span class="label-text font-semibold">Observações</span></label>
                            <textarea
                                v-model="editForm.observacoes"
                                rows="3"
                                class="textarea textarea-bordered w-full"
                            ></textarea>
                        </div>
                    </div>

                    <div class="modal-action">
                        <button type="button" class="btn btn-ghost" :disabled="editSaving" @click="fecharModalEditar">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-warning text-white" :disabled="editSaving" @click="salvarEdicaoLancamento">
                            <i v-if="editSaving" class="fa-solid fa-spinner fa-spin mr-1"></i>
                            <i v-else class="fa-solid fa-pen-to-square mr-1"></i>
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>

            <!-- ==================== MODAL EXCLUIR LANÇAMENTO ==================== -->
            <input type="checkbox" id="modal-excluir-lancamento" class="modal-toggle" v-model="modalDeleteOpen" />
            <div class="modal" :class="{ 'modal-open': modalDeleteOpen }">
                <div class="modal-box">
                    <h3 class="font-bold text-lg text-red-600">
                        <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                        Excluir Lançamento
                    </h3>
                    <p class="py-3 text-sm">
                        Tem certeza que deseja excluir o lançamento
                        <strong>#{{ deleteTarget?.id }} — {{ deleteTarget?.descricao }}</strong>?
                    </p>
                    <p class="text-xs text-red-600">
                        Essa exclusão não é reversível! Se este lançamento for de OS, todos os lançamentos vinculados à mesma OS também serão excluídos.
                    </p>
                    <div class="modal-action">
                        <button type="button" class="btn btn-ghost" :disabled="deleteSaving" @click="fecharModalExcluir">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-error text-white" :disabled="deleteSaving" @click="confirmarExclusaoLancamento">
                            <i v-if="deleteSaving" class="fa-solid fa-spinner fa-spin mr-1"></i>
                            <i v-else class="fa-solid fa-trash mr-1"></i>
                            Excluir Lançamento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

