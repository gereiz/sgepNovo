<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, computed, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
    comissoes: { type: Array, default: () => [] },
    pagination: { type: Object, default: () => ({}) },
    filters: { type: Object, default: () => ({}) },
    agregados: { type: Object, default: () => ({}) },
    flash: { type: Object, default: () => ({}) },
});

const toastr = useToastr();

const OPCOES_APLICAVEL = [
    { value: 'Vendas Gerais (Todos os Painéis)', label: 'Vendas Gerais (Todos os Painéis)' },
    { value: 'Painéis Digitais / Circuito LED', label: 'Painéis Digitais / Circuito LED' },
    { value: 'Taxa de Instalação & Colagem OOH', label: 'Taxa de Instalação & Colagem OOH' },
    { value: 'Agência Parceira / BV Autorizado', label: 'Agência Parceira / BV Autorizado' },
    { value: 'Bonificação Bi-semana Atingida', label: 'Bonificação Bi-semana Atingida' },
    { value: 'TopSight e Frontlight', label: 'TopSight e Frontlight' },
    { value: 'Contratos Anuais', label: 'Contratos Anuais' },
    { value: 'Operações de Rua', label: 'Operações de Rua' },
    { value: 'Empenas e Rodovias', label: 'Empenas e Rodovias' },
    { value: 'Serviços Customizados (PI e OS)', label: 'Serviços Customizados (PI e OS)' },
];

// Estado do formulário
const calculationType = ref('percentage');
const nome = ref('');
const descricao = ref('');
const valor = ref('');
const aplicavel_a = ref('Vendas Gerais (Todos os Painéis)');
const statusRegistro = ref('1');
const editingId = ref(null);
const saving = ref(false);

// Estado de filtros e paginação
const searchTerm = ref(props.filters?.search || '');
const typeFilter = ref(props.filters?.tipo || 'todos');
const statusFilter = ref(props.filters?.status || 'todos');
const currentPage = ref(Number(props.pagination?.page) || 1);
const perPageState = ref(Number(props.pagination?.perPage) || 50);
const loading = ref(false);

// Estado dos modais
const deleteTarget = ref(null);
const deleteSaving = ref(false);
const modalDeleteOpen = ref(false);
const modalHelpOpen = ref(false);

const listaComissoes = ref(props.comissoes || []);
watch(() => props.comissoes, (val) => {
    listaComissoes.value = val || [];
});

const totalPages = computed(() => {
    return Math.max(
        1,
        Number(props.pagination?.ultimaPagina) || Math.ceil(listaComissoes.value.length / perPageState.value) || 1
    );
});

function formatarValorBR(v) {
    const n = Number(v) || 0;
    return n.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function parseValorMonetario(v) {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    const s = String(v).replace(/[^0-9,.-]/g, '');
    const temVirgula = s.includes(',');
    const normal = temVirgula ? s.replace(/\./g, '').replace(',', '.') : s;
    const n = parseFloat(normal);
    return Number.isFinite(n) ? n : 0;
}

function recarregarLista() {
    const params = {};
    if (searchTerm.value.trim()) params.search = searchTerm.value.trim();
    if (typeFilter.value && typeFilter.value !== 'todos') params.tipo = typeFilter.value;
    if (statusFilter.value && statusFilter.value !== 'todos') params.status = statusFilter.value;
    params.page = String(currentPage.value);
    params.perPage = String(perPageState.value);

    router.get('/cadastro-comissoes', params, {
        preserveState: true,
        preserveScroll: true,
        onStart: () => { loading.value = true; },
        onFinish: () => { loading.value = false; },
    });
}

function aplicarFiltroTipo(tipo) {
    typeFilter.value = tipo;
    currentPage.value = 1;
    recarregarLista();
}

function aplicarFiltroStatus(st) {
    statusFilter.value = st;
    currentPage.value = 1;
    recarregarLista();
}

function mudarPorPagina() {
    currentPage.value = 1;
    recarregarLista();
}

function irParaPagina(pag) {
    if (pag < 1 || pag > totalPages.value) return;
    currentPage.value = pag;
    recarregarLista();
}

function limparFormulario() {
    calculationType.value = 'percentage';
    nome.value = '';
    descricao.value = '';
    valor.value = '';
    aplicavel_a.value = 'Vendas Gerais (Todos os Painéis)';
    statusRegistro.value = '1';
    editingId.value = null;
}

function editarComissao(rule) {
    editingId.value = rule.id;
    nome.value = rule.nome || '';
    descricao.value = rule.descricao || '';
    calculationType.value = rule.calculationType || (Number(rule.tipo_comissao) === 2 ? 'fixed' : 'percentage');
    valor.value = formatarValorBR(rule.valor);
    aplicavel_a.value = rule.aplicavel_a || 'Vendas Gerais (Todos os Painéis)';
    statusRegistro.value = String(rule.status_num ?? 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function salvarComissao() {
    if (!nome.value.trim()) {
        toastr.error('Por favor, informe o Nome / Regra da Comissão.');
        return;
    }

    const valNum = parseValorMonetario(valor.value);
    if (!(valNum > 0)) {
        toastr.error('Por favor, informe um valor válido maior que zero.');
        return;
    }

    const payload = {
        nome: nome.value.trim(),
        descricao: descricao.value.trim(),
        calculationType: calculationType.value,
        tipo_comissao: calculationType.value === 'fixed' ? 2 : 1,
        valor: valNum,
        aplicavel_a: aplicavel_a.value || 'Vendas Gerais (Todos os Painéis)',
        status: statusRegistro.value === '1' ? 1 : 0,
    };

    saving.value = true;
    try {
        let res;
        if (editingId.value) {
            res = await axios.put(`/cadastro-comissoes/${editingId.value}`, payload);
        } else {
            res = await axios.post('/cadastro-comissoes', payload);
        }

        if (res.data?.success) {
            toastr.success(res.data.message || 'Comissão salva com sucesso!');
            limparFormulario();
            recarregarLista();
        } else {
            toastr.error(res.data?.message || 'Não foi possível salvar a comissão.');
        }
    } catch (err) {
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.errors?.[Object.keys(err.response.data.errors || {})[0]]?.[0] ||
            'Erro ao salvar a comissão.';
        toastr.error(msg);
    } finally {
        saving.value = false;
    }
}

async function alternarStatus(rule) {
    try {
        const res = await axios.post(`/cadastro-comissoes/${rule.id}/toggle-status`);
        if (res.data?.success) {
            toastr.success(res.data.message);
            recarregarLista();
        } else {
            toastr.error(res.data?.message || 'Erro ao alterar o status.');
        }
    } catch (err) {
        toastr.error(err?.response?.data?.message || 'Erro ao alterar o status.');
    }
}

function abrirModalExcluir(rule) {
    deleteTarget.value = rule;
    modalDeleteOpen.value = true;
}

function fecharModalExcluir() {
    modalDeleteOpen.value = false;
    deleteTarget.value = null;
}

async function confirmarExclusao() {
    if (!deleteTarget.value) return;
    deleteSaving.value = true;
    try {
        const res = await axios.delete(`/cadastro-comissoes/${deleteTarget.value.id}`);
        if (res.data?.success) {
            toastr.success(res.data.message || 'Comissão excluída com sucesso!');
            if (editingId.value === deleteTarget.value.id) {
                limparFormulario();
            }
            recarregarLista();
        } else {
            toastr.error(res.data?.message || 'Erro ao excluir comissão.');
        }
    } catch (err) {
        toastr.error(err?.response?.data?.message || 'Erro ao excluir comissão.');
    } finally {
        deleteSaving.value = false;
        fecharModalExcluir();
    }
}
</script>

<template>
    <Head title="Cadastro de Comissões" />

    <AuthenticatedLayout>
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 px-2 md:px-4">
            <!-- Barra Superior no Padrão Vue -->
            <div class="navbar bg-base-100 rounded-box shadow mb-4 flex-wrap gap-2">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl font-bold">Cadastro de Comissões</a>
                    <span class="text-xs text-gray-500 hidden md:inline ml-2">
                        Configure percentuais e valores de bonificação usados na emissão de PIs e OSs
                    </span>
                </div>
                <div class="flex-none flex flex-wrap items-center gap-2">
                    <div class="badge badge-neutral gap-1 p-3">
                        Cadastradas: <strong>{{ agregados?.totalCadastros ?? listaComissoes.length }}</strong>
                    </div>
                    <div class="badge badge-success text-white gap-1 p-3">
                        Ativas: <strong>{{ agregados?.totalAtivos ?? 0 }}</strong>
                    </div>
                    <div class="badge badge-ghost gap-1 p-3">
                        Inativas: <strong>{{ agregados?.totalInativos ?? 0 }}</strong>
                    </div>
                    <div class="badge badge-info text-white gap-1 p-3 hidden sm:inline-flex">
                        % Percentuais: <strong>{{ agregados?.totalPercentuais ?? 0 }}</strong>
                    </div>
                    <div class="badge badge-warning text-white gap-1 p-3 hidden sm:inline-flex">
                        Valores Fixos: <strong>{{ agregados?.totalFixos ?? 0 }}</strong>
                    </div>
                    <button class="btn btn-outline btn-sm ml-1" @click="modalHelpOpen = true">
                        <i class="fa-solid fa-circle-question mr-1"></i>
                        Regulamento
                    </button>
                </div>
            </div>

            <!-- Card Principal no Padrão Vue -->
            <div class="card w-full bg-base-100 shadow-xl rounded-md">
                <div class="card-body p-4 md:p-6">
                    <div class="w-full flex flex-col lg:flex-row gap-6">
                        <!-- Coluna Esquerda: Formulário de Cadastro / Edição -->
                        <div class="w-full lg:w-4/12 border border-slate-300 rounded-lg p-4 space-y-4 h-fit bg-base-100">
                            <div class="flex items-center justify-between border-b pb-2">
                                <h2 class="text-lg font-bold">
                                    {{ editingId ? 'Editar Comissão' : 'Cadastrar Comissão' }}
                                </h2>
                                <span class="badge" :class="editingId ? 'badge-warning text-white' : 'badge-primary text-white'">
                                    {{ editingId ? `#${editingId}` : 'Nova Regra' }}
                                </span>
                            </div>

                            <form @submit.prevent="salvarComissao" class="space-y-3">
                                <!-- Tipo de Cálculo -->
                                <div class="form-control w-full">
                                    <label class="label py-1">
                                        <span class="label-text font-semibold">Tipo de Cálculo *</span>
                                    </label>
                                    <div class="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            @click="calculationType = 'percentage'"
                                            class="btn btn-sm"
                                            :class="calculationType === 'percentage' ? 'btn-primary text-white' : 'btn-outline'"
                                        >
                                            <i class="fa-solid fa-percent mr-1"></i>
                                            Porcentagem (%)
                                        </button>
                                        <button
                                            type="button"
                                            @click="calculationType = 'fixed'"
                                            class="btn btn-sm"
                                            :class="calculationType === 'fixed' ? 'btn-warning text-white' : 'btn-outline'"
                                        >
                                            <i class="fa-solid fa-dollar-sign mr-1"></i>
                                            Valor Fixo (R$)
                                        </button>
                                    </div>
                                </div>

                                <!-- Nome / Regra da Comissão -->
                                <div class="form-control w-full">
                                    <label class="label py-1">
                                        <span class="label-text font-semibold">Nome / Regra da Comissão *</span>
                                    </label>
                                    <input
                                        v-model="nome"
                                        type="text"
                                        placeholder="Ex: Comissão Padrão Vendedor Externo"
                                        class="input input-bordered w-full"
                                        required
                                    />
                                    <label class="label py-0.5">
                                        <span class="label-text-alt text-gray-500">
                                            Identificador exibido nas propostas, PIs e OSs.
                                        </span>
                                    </label>
                                </div>

                                <!-- Subtítulo / Descrição -->
                                <div class="form-control w-full">
                                    <label class="label py-1">
                                        <span class="label-text font-semibold">Subtítulo / Descrição da Regra</span>
                                    </label>
                                    <input
                                        v-model="descricao"
                                        type="text"
                                        placeholder="Ex: Comissão base para locação padrão"
                                        class="input input-bordered w-full"
                                    />
                                </div>

                                <!-- Taxa Percentual ou Valor Fixo -->
                                <div class="form-control w-full">
                                    <label class="label py-1">
                                        <span class="label-text font-semibold">
                                            {{ calculationType === 'percentage' ? 'Taxa Percentual (%) *' : 'Valor Fixo (R$) *' }}
                                        </span>
                                    </label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                                            {{ calculationType === 'percentage' ? '%' : 'R$' }}
                                        </span>
                                        <input
                                            v-model="valor"
                                            type="text"
                                            :placeholder="calculationType === 'percentage' ? 'Ex: 5,00' : 'Ex: 100,00'"
                                            class="input input-bordered w-full pl-10 font-bold"
                                            required
                                        />
                                    </div>
                                    <label class="label py-0.5">
                                        <span class="label-text-alt text-gray-500">
                                            {{ calculationType === 'percentage'
                                                ? 'Alíquota em percentual sobre o valor líquido.'
                                                : 'Montante fixo em reais a ser creditado.' }}
                                        </span>
                                    </label>
                                </div>

                                <!-- Aplicável a -->
                                <div class="form-control w-full">
                                    <label class="label py-1">
                                        <span class="label-text font-semibold">Aplicável a</span>
                                    </label>
                                    <select v-model="aplicavel_a" class="select select-bordered w-full">
                                        <option v-for="opt in OPCOES_APLICAVEL" :key="opt.value" :value="opt.value">
                                            {{ opt.label }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Status -->
                                <div class="form-control w-full">
                                    <label class="label py-1">
                                        <span class="label-text font-semibold">Status</span>
                                    </label>
                                    <select v-model="statusRegistro" class="select select-bordered w-full">
                                        <option value="1">Ativa (usar em novas PIs / OSs)</option>
                                        <option value="0">Inativa (não selecionar automaticamente)</option>
                                    </select>
                                </div>

                                <!-- Botões de Ação -->
                                <div class="flex items-center gap-2 pt-2">
                                    <button
                                        type="submit"
                                        :disabled="saving"
                                        class="btn flex-1 text-white"
                                        :class="editingId ? 'btn-warning' : 'btn-primary'"
                                    >
                                        <i v-if="saving" class="fa-solid fa-spinner fa-spin mr-1"></i>
                                        <i v-else-if="editingId" class="fa-solid fa-check mr-1"></i>
                                        <i v-else class="fa-solid fa-plus mr-1"></i>
                                        {{ saving ? 'Salvando...' : (editingId ? 'Salvar Alteração' : 'Cadastrar Comissão') }}
                                    </button>

                                    <button
                                        type="button"
                                        @click="limparFormulario"
                                        class="btn btn-ghost border border-slate-300"
                                    >
                                        {{ editingId ? 'Cancelar' : 'Limpar' }}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Coluna Direita: Listagem e Filtros -->
                        <div class="w-full lg:w-8/12 border border-slate-300 rounded-lg p-4 flex flex-col justify-between bg-base-100">
                            <div>
                                <!-- Barra de Busca e Filtros -->
                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4 mb-4">
                                    <div>
                                        <h2 class="text-lg font-bold">Comissões Cadastradas</h2>
                                        <p class="text-xs text-gray-500">
                                            Regras disponíveis para vínculo no lançamento de PIs e Vendas (OS)
                                        </p>
                                    </div>

                                    <div class="flex flex-wrap items-center gap-2">
                                        <!-- Busca -->
                                        <div class="flex items-center gap-1">
                                            <input
                                                v-model="searchTerm"
                                                @keydown.enter="currentPage = 1; recarregarLista()"
                                                type="text"
                                                placeholder="Pesquisar regra..."
                                                class="input input-bordered w-44 md:w-52"
                                            />
                                            <button
                                                type="button"
                                                @click="currentPage = 1; recarregarLista()"
                                                class="btn btn-square btn-info text-white"
                                                title="Pesquisar"
                                            >
                                                <i class="fa-solid fa-magnifying-glass"></i>
                                            </button>
                                        </div>

                                        <!-- Filtro de Tipo -->
                                        <select
                                            v-model="typeFilter"
                                            @change="aplicarFiltroTipo(typeFilter)"
                                            class="select select-bordered"
                                        >
                                            <option value="todos">Todos os Tipos</option>
                                            <option value="percentual">% Percentual</option>
                                            <option value="fixo">R$ Valor Fixo</option>
                                        </select>

                                        <!-- Filtro de Status -->
                                        <select
                                            v-model="statusFilter"
                                            @change="aplicarFiltroStatus(statusFilter)"
                                            class="select select-bordered"
                                        >
                                            <option value="todos">Todos os Status</option>
                                            <option value="ativos">Ativas</option>
                                            <option value="inativos">Inativas</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Tabela de Comissões -->
                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-gray-300 border">
                                        <thead class="bg-base-200">
                                            <tr class="divide-x divide-gray-200">
                                                <th scope="col" class="py-3 px-3 text-left text-xs font-bold uppercase text-gray-700">ID</th>
                                                <th scope="col" class="py-3 px-3 text-left text-xs font-bold uppercase text-gray-700">Descrição / Regra</th>
                                                <th scope="col" class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Tipo</th>
                                                <th scope="col" class="py-3 px-3 text-right text-xs font-bold uppercase text-gray-700">Valor Aplicado</th>
                                                <th scope="col" class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Aplicável a</th>
                                                <th scope="col" class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Atualização</th>
                                                <th scope="col" class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Status</th>
                                                <th scope="col" class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-200 bg-white">
                                            <tr v-if="listaComissoes.length === 0">
                                                <td colspan="8" class="py-8 text-center text-gray-500">
                                                    Nenhuma comissão encontrada para os critérios selecionados.
                                                </td>
                                            </tr>

                                            <tr
                                                v-for="rule in listaComissoes"
                                                :key="rule.id"
                                                class="divide-x divide-gray-200 hover:bg-base-200/50 transition-colors"
                                                :class="editingId === rule.id ? 'bg-amber-50' : ''"
                                            >
                                                <td class="whitespace-nowrap py-3 px-3 text-sm font-medium text-gray-900">
                                                    #{{ rule.id }}
                                                </td>

                                                <td class="py-3 px-3 text-sm text-gray-900">
                                                    <div class="font-bold">{{ rule.nome }}</div>
                                                    <div class="text-xs text-gray-500">{{ rule.descricao || '—' }}</div>
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-center text-sm">
                                                    <span
                                                        v-if="rule.calculationType === 'percentage' || Number(rule.tipo_comissao) === 1"
                                                        class="badge badge-info text-white badge-sm"
                                                    >
                                                        % Porcentagem
                                                    </span>
                                                    <span v-else class="badge badge-warning text-white badge-sm">
                                                        Valor Fixo
                                                    </span>
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-right text-sm font-bold">
                                                    <span v-if="rule.calculationType === 'percentage' || Number(rule.tipo_comissao) === 1" class="text-sky-700">
                                                        {{ formatarValorBR(rule.valor) }}%
                                                    </span>
                                                    <span v-else class="text-amber-700">
                                                        R$ {{ formatarValorBR(rule.valor) }}
                                                    </span>
                                                </td>

                                                <td class="py-3 px-3 text-center text-xs text-gray-600 max-w-[180px]">
                                                    {{ rule.aplicavel_a || '—' }}
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-center text-xs text-gray-500">
                                                    {{ rule.updatedAt || rule.createdAt || '—' }}
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-center">
                                                    <button
                                                        type="button"
                                                        @click="alternarStatus(rule)"
                                                        :title="(rule.status === 'Ativo' || Number(rule.status_num) === 1) ? 'Clique para inativar' : 'Clique para ativar'"
                                                        class="badge cursor-pointer gap-1"
                                                        :class="(rule.status === 'Ativo' || Number(rule.status_num) === 1) ? 'badge-success text-white' : 'badge-ghost'"
                                                    >
                                                        <i class="fa-solid fa-power-off text-[10px]"></i>
                                                        {{ rule.status || (Number(rule.status_num) === 1 ? 'Ativo' : 'Inativo') }}
                                                    </button>
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-center">
                                                    <div class="flex items-center justify-center space-x-2">
                                                        <button
                                                            type="button"
                                                            class="btn btn-sm btn-square btn-warning text-white"
                                                            title="Editar"
                                                            @click="editarComissao(rule)"
                                                        >
                                                            <i class="fa-solid fa-pen-to-square"></i>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            class="btn btn-sm btn-square text-white"
                                                            :class="(rule.status === 'Ativo' || Number(rule.status_num) === 1) ? 'btn-neutral' : 'btn-success'"
                                                            :title="(rule.status === 'Ativo' || Number(rule.status_num) === 1) ? 'Inativar' : 'Ativar'"
                                                            @click="alternarStatus(rule)"
                                                        >
                                                            <i class="fa-solid fa-power-off"></i>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            class="btn btn-sm btn-square btn-error text-white"
                                                            title="Excluir"
                                                            @click="abrirModalExcluir(rule)"
                                                        >
                                                            <i class="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Rodapé de Paginação -->
                            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t text-xs text-gray-600">
                                <div>
                                    Mostrando
                                    <strong>{{ pagination?.de ?? listaComissoes.length }}</strong>
                                    até
                                    <strong>{{ pagination?.ate ?? listaComissoes.length }}</strong>
                                    de
                                    <strong>{{ pagination?.totalItens ?? listaComissoes.length }}</strong>
                                    comissões cadastradas
                                </div>

                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-1">
                                        <span>Por página:</span>
                                        <select
                                            v-model="perPageState"
                                            @change="mudarPorPagina"
                                            class="select select-bordered py-0 h-8 min-h-0"
                                        >
                                            <option :value="10">10</option>
                                            <option :value="25">25</option>
                                            <option :value="50">50</option>
                                            <option :value="100">100</option>
                                        </select>
                                    </div>

                                    <div class="join">
                                        <button
                                            type="button"
                                            class="btn btn-xs join-item"
                                            :disabled="currentPage <= 1 || loading"
                                            @click="irParaPagina(currentPage - 1)"
                                        >
                                            «
                                        </button>
                                        <button type="button" class="btn btn-xs join-item no-animation">
                                            Página {{ currentPage }} / {{ totalPages }}
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-xs join-item"
                                            :disabled="currentPage >= totalPages || loading"
                                            @click="irParaPagina(currentPage + 1)"
                                        >
                                            »
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Confirmação de Exclusão -->
            <input type="checkbox" id="modal-excluir-comissao" class="modal-toggle" v-model="modalDeleteOpen" />
            <div class="modal" :class="{ 'modal-open': modalDeleteOpen }">
                <div class="modal-box">
                    <h3 class="font-bold text-lg text-red-600">
                        <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                        Confirmar Exclusão
                    </h3>
                    <p class="py-4 text-sm">
                        Tem certeza que deseja excluir a comissão
                        <strong>#{{ deleteTarget?.id }} — {{ deleteTarget?.nome }}</strong>?
                    </p>
                    <div class="modal-action">
                        <button type="button" class="btn btn-ghost" :disabled="deleteSaving" @click="fecharModalExcluir">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-error text-white" :disabled="deleteSaving" @click="confirmarExclusao">
                            <i v-if="deleteSaving" class="fa-solid fa-spinner fa-spin mr-1"></i>
                            <i v-else class="fa-solid fa-trash mr-1"></i>
                            Excluir Comissão
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal de Regulamento -->
            <input type="checkbox" id="modal-regulamento-comissao" class="modal-toggle" v-model="modalHelpOpen" />
            <div class="modal" :class="{ 'modal-open': modalHelpOpen }">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">
                        <i class="fa-solid fa-circle-info text-info mr-2"></i>
                        Regulamento de Comissões OOH
                    </h3>
                    <div class="py-4 space-y-3 text-sm">
                        <div class="p-3 bg-base-200 rounded-lg">
                            <h4 class="font-bold">1. Base de Cálculo</h4>
                            <p class="text-xs text-gray-600 mt-1">
                                As alíquotas percentuais incidem sobre o valor líquido faturado (valor bruto menos descontos concedidos).
                            </p>
                        </div>
                        <div class="p-3 bg-base-200 rounded-lg">
                            <h4 class="font-bold">2. Valores Fixos</h4>
                            <p class="text-xs text-gray-600 mt-1">
                                Os valores fixos são creditados pelo valor nominal configurado na regra selecionada.
                            </p>
                        </div>
                        <div class="p-3 bg-base-200 rounded-lg">
                            <h4 class="font-bold">3. Integração com PIs e OSs</h4>
                            <p class="text-xs text-gray-600 mt-1">
                                As regras ativas cadastradas nesta tela ficam disponíveis imediatamente para seleção nos modais de emissão de Pedido de Inserção (PI) e Ordem de Serviço (OS).
                            </p>
                        </div>
                    </div>
                    <div class="modal-action">
                        <button type="button" class="btn btn-primary text-white" @click="modalHelpOpen = false">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

