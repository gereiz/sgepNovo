<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, computed, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
    anos: { type: Array, default: () => [] },
});

const toastr = useToastr();

const listaAnos = ref(props.anos || []);
watch(() => props.anos, (val) => {
    listaAnos.value = val || [];
});

const anoAtual = new Date().getFullYear();

const proximoAnoSugerido = computed(() => {
    if (!listaAnos.value.length) return anoAtual + 1;
    const maiorAno = Math.max(...listaAnos.value.map(a => Number(a.ano_bisemana) || anoAtual));
    return maiorAno + 1;
});

function addDaysISO(dateStr, days) {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr).slice(0, 10))) return '';
    const [y, m, d] = String(dateStr).slice(0, 10).split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() + days);
    return dt.toISOString().slice(0, 10);
}

function sugerirDataInicioParaAno(anoAlvo) {
    const y = Number(anoAlvo);
    if (!y || y < 2000 || y > 2100) return '';
    const anoAnterior = listaAnos.value.find(a => Number(a.ano_bisemana) === y - 1);
    if (anoAnterior && anoAnterior.fim_ano) {
        const diaSeguinte = addDaysISO(String(anoAnterior.fim_ano).slice(0, 10), 1);
        if (diaSeguinte) return diaSeguinte;
    }
    return `${y}-01-01`;
}

const novoAno = ref(proximoAnoSugerido.value);
const dataInicioNovoAno = ref(sugerirDataInicioParaAno(proximoAnoSugerido.value));
const salvandoAno = ref(false);
const modalNovoAnoOpen = ref(false);

watch(novoAno, (val) => {
    const sugerida = sugerirDataInicioParaAno(val);
    if (sugerida) {
        dataInicioNovoAno.value = sugerida;
    }
});

const loadingRefresh = ref(false);

// Modal para visualizar as bi-semanas de um ano específico
const modalVerBsOpen = ref(false);
const anoSelecionado = ref(null);

// Modal para editar as bi-semanas de um ano (atual ou futuro)
const modalEditarBsOpen = ref(false);
const anoEditando = ref(null);
const dataInicioEdicao = ref('');
const bisemanasEditando = ref([]);
const encadearDatasEdicao = ref(true);
const salvandoEdicao = ref(false);

const totalBisemanasSistema = computed(() => {
    return listaAnos.value.reduce((acc, a) => acc + (Number(a.qtd_bisemanas) || 0), 0);
});

function gerarListaBisemanasAPartirDeData(dataInicialStr, existentes = []) {
    const str = String(dataInicialStr || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return [];
    const [y, m, d] = str.split('-').map(Number);
    let dtInicial = new Date(Date.UTC(y, m - 1, d));
    let numBs = 1;
    let idx = 0;
    const lista = [];

    while (numBs < 53) {
        const dtFinal = new Date(dtInicial.getTime());
        dtFinal.setUTCDate(dtFinal.getUTCDate() + 13);

        const existente = existentes[idx] || existentes.find(e => Number(e.num_bisemana) === numBs);

        lista.push({
            id: existente ? existente.id : null,
            num_bisemana: numBs,
            inicio: dtInicial.toISOString().slice(0, 10),
            fim: dtFinal.toISOString().slice(0, 10),
        });

        dtInicial = new Date(dtFinal.getTime());
        dtInicial.setUTCDate(dtInicial.getUTCDate() + 1);
        numBs += 2;
        idx++;
    }
    return lista;
}

// Prévia dinâmica das bi-semanas que serão geradas para o novo ano digitado
const previewBisemanas = computed(() => {
    const y = Number(novoAno.value);
    if (!y || y < 2000 || y > 2100) return [];
    const dtStr = dataInicioNovoAno.value || `${y}-01-01`;
    return gerarListaBisemanasAPartirDeData(dtStr);
});

function formatDateBR(d) {
    if (!d) return '—';
    const str = String(d).slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        const [y, m, day] = str.split('-');
        return `${day}/${m}/${y}`;
    }
    return str;
}

function podeEditarAno(itemAno) {
    if (!itemAno) return false;
    return Number(itemAno.ano_bisemana) >= anoAtual;
}

function abrirModalNovoAno() {
    novoAno.value = proximoAnoSugerido.value;
    dataInicioNovoAno.value = sugerirDataInicioParaAno(proximoAnoSugerido.value);
    modalNovoAnoOpen.value = true;
}

async function criarBisemanasAno() {
    const anoNum = Number(novoAno.value);
    if (!anoNum || anoNum < 2000 || anoNum > 2100) {
        toastr.error('Informe um ano válido (ex.: 2027).');
        return;
    }

    if (!dataInicioNovoAno.value || !/^\d{4}-\d{2}-\d{2}$/.test(dataInicioNovoAno.value)) {
        toastr.error('Informe a data inicial da 1ª Bi-semana.');
        return;
    }

    salvandoAno.value = true;
    try {
        const res = await axios.post('/configuracoes/addAno', {
            ano: anoNum,
            data_inicio: dataInicioNovoAno.value,
        });
        const msg = res.data?.message || `Bi-semanas do ano ${anoNum} criadas com sucesso!`;
        toastr.success(msg);
        modalNovoAnoOpen.value = false;
        router.reload({
            only: ['anos'],
            onSuccess: () => {
                novoAno.value = proximoAnoSugerido.value;
                dataInicioNovoAno.value = sugerirDataInicioParaAno(proximoAnoSugerido.value);
            },
        });
    } catch (err) {
        const msg = err?.response?.data?.message || 'Erro ao gerar as bi-semanas para o ano informado.';
        toastr.error(msg);
    } finally {
        salvandoAno.value = false;
    }
}

function abrirModalVerBisemanas(itemAno) {
    anoSelecionado.value = itemAno;
    modalVerBsOpen.value = true;
}

function abrirModalEditarBisemanas(itemAno) {
    if (!podeEditarAno(itemAno)) {
        toastr.error('Apenas bi-semanas do ano atual ou de anos futuros podem ser editadas.');
        return;
    }
    modalVerBsOpen.value = false;
    anoEditando.value = itemAno;

    const existentes = (itemAno.bisemanas || []).map(b => ({
        id: b.id,
        num_bisemana: Number(b.num_bisemana),
        inicio: String(b.inicio || '').slice(0, 10),
        fim: String(b.fim || '').slice(0, 10),
    }));

    if (existentes.length > 0) {
        dataInicioEdicao.value = existentes[0].inicio;
        bisemanasEditando.value = existentes;
    } else {
        const sugerida = sugerirDataInicioParaAno(itemAno.ano_bisemana);
        dataInicioEdicao.value = sugerida;
        bisemanasEditando.value = gerarListaBisemanasAPartirDeData(sugerida);
    }

    modalEditarBsOpen.value = true;
}

const dataSugeridaAnoAnteriorEdicao = computed(() => {
    if (!anoEditando.value) return '';
    return sugerirDataInicioParaAno(anoEditando.value.ano_bisemana);
});

function recalcularEdicaoPelaDataInicial(novaDataOpcional = null) {
    if (novaDataOpcional && typeof novaDataOpcional === 'string') {
        dataInicioEdicao.value = novaDataOpcional;
    }
    if (!dataInicioEdicao.value || !/^\d{4}-\d{2}-\d{2}$/.test(dataInicioEdicao.value)) {
        toastr.error('Informe uma data inicial válida para recalcular.');
        return;
    }
    bisemanasEditando.value = gerarListaBisemanasAPartirDeData(
        dataInicioEdicao.value,
        bisemanasEditando.value
    );
}

function aoAlterarInicioBsEdicao(index) {
    const item = bisemanasEditando.value[index];
    if (!item || !/^\d{4}-\d{2}-\d{2}$/.test(item.inicio)) return;

    if (index === 0) {
        dataInicioEdicao.value = item.inicio;
    }

    if (encadearDatasEdicao.value) {
        // Recalcula o fim desta BS (+13 dias) e todas as BS seguintes em cascata
        let dtInicioAtual = item.inicio;
        for (let i = index; i < bisemanasEditando.value.length; i++) {
            const dtFimAtual = addDaysISO(dtInicioAtual, 13);
            bisemanasEditando.value[i].inicio = dtInicioAtual;
            bisemanasEditando.value[i].fim = dtFimAtual;
            dtInicioAtual = addDaysISO(dtFimAtual, 1);
        }
    }
}

function aoAlterarFimBsEdicao(index) {
    const item = bisemanasEditando.value[index];
    if (!item || !/^\d{4}-\d{2}-\d{2}$/.test(item.fim)) return;

    if (encadearDatasEdicao.value && index + 1 < bisemanasEditando.value.length) {
        let dtInicioAtual = addDaysISO(item.fim, 1);
        for (let i = index + 1; i < bisemanasEditando.value.length; i++) {
            const dtFimAtual = addDaysISO(dtInicioAtual, 13);
            bisemanasEditando.value[i].inicio = dtInicioAtual;
            bisemanasEditando.value[i].fim = dtFimAtual;
            dtInicioAtual = addDaysISO(dtFimAtual, 1);
        }
    }
}

async function salvarEdicaoBisemanas() {
    if (!anoEditando.value) return;

    salvandoEdicao.value = true;
    try {
        const res = await axios.post('/configuracoes/updateAnoBisemanas', {
            ano_id: anoEditando.value.id,
            data_inicio: dataInicioEdicao.value,
            bisemanas: bisemanasEditando.value,
        });
        toastr.success(res.data?.message || 'Bi-semanas atualizadas com sucesso!');
        modalEditarBsOpen.value = false;
        router.reload({ only: ['anos'] });
    } catch (err) {
        const msg = err?.response?.data?.message || 'Erro ao atualizar as bi-semanas do ano.';
        toastr.error(msg);
    } finally {
        salvandoEdicao.value = false;
    }
}

function refreshCompressed() {
    if (loadingRefresh.value) return;
    loadingRefresh.value = true;
    axios.post('/configuracoes/atualizarImagens')
        .then((resp) => {
            const msg = typeof resp.data === 'string' ? resp.data : 'Imagens comprimidas atualizadas!';
            toastr.success(msg);
        })
        .catch(() => {
            toastr.error('Falha ao atualizar imagens comprimidas.');
        })
        .finally(() => {
            loadingRefresh.value = false;
        });
}
</script>

<template>
    <Head title="Configurações Gerais" />

    <AuthenticatedLayout>
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 px-2 md:px-4">
            <!-- Barra Superior no Padrão Vue -->
            <div class="navbar bg-base-100 rounded-box shadow mb-4 flex-wrap gap-2">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl font-bold">Configurações Gerais</a>
                    <span class="text-xs text-gray-500 hidden md:inline ml-2">
                        Gerencie regras de acesso, textos padrão, imagens e geração de bi-semanas por ano
                    </span>
                </div>
                <div class="flex-none flex flex-wrap items-center gap-2">
                    <div class="badge badge-neutral gap-1 p-3">
                        Anos Cadastrados: <strong>{{ listaAnos.length }}</strong>
                    </div>
                    <div class="badge badge-info text-white gap-1 p-3 hidden sm:inline-flex">
                        Total de Bi-semanas: <strong>{{ totalBisemanasSistema }}</strong>
                    </div>
                    <button
                        type="button"
                        class="btn btn-primary btn-sm text-white"
                        :disabled="loadingRefresh"
                        @click="refreshCompressed"
                    >
                        <i v-if="loadingRefresh" class="fa-solid fa-spinner fa-spin mr-1"></i>
                        <i v-else class="fa-solid fa-images mr-1"></i>
                        {{ loadingRefresh ? 'Atualizando...' : 'Atualizar Imagens Comprimidas' }}
                    </button>
                    <button
                        type="button"
                        class="btn btn-success btn-sm text-white"
                        @click="abrirModalNovoAno"
                    >
                        <i class="fa-solid fa-calendar-plus mr-1"></i>
                        + Gerar Bi-semanas (Novo Ano)
                    </button>
                </div>
            </div>

            <!-- Cards de Áreas de Configuração -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <!-- Card 1: Cadastro de Regras -->
                <div class="card bg-base-100 shadow-md border-l-4 border-primary">
                    <div class="card-body py-4 px-5 flex flex-row items-center justify-between">
                        <div>
                            <p class="text-xs font-bold uppercase text-gray-500">Controle de Acesso</p>
                            <h3 class="text-lg font-extrabold text-gray-900 mt-1">Cadastro de Regras</h3>
                            <p class="text-xs text-gray-500 mt-1">Gerencie perfis, funções e permissões do sistema.</p>
                            <div class="mt-3">
                                <a href="/configuracoes/roles" class="btn btn-primary btn-sm text-white">
                                    <i class="fa-solid fa-shield-halved mr-1"></i>
                                    Acessar Regras
                                </a>
                            </div>
                        </div>
                        <div class="btn btn-circle btn-primary btn-outline no-animation hidden sm:inline-flex">
                            <i class="fa-solid fa-user-shield text-lg"></i>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Textos Padrão -->
                <div class="card bg-base-100 shadow-md border-l-4 border-info">
                    <div class="card-body py-4 px-5 flex flex-row items-center justify-between">
                        <div>
                            <p class="text-xs font-bold uppercase text-gray-500">Documentos & PIs</p>
                            <h3 class="text-lg font-extrabold text-gray-900 mt-1">Textos Padrão</h3>
                            <p class="text-xs text-gray-500 mt-1">Configure textos e observações padrão para documentos.</p>
                            <div class="mt-3">
                                <a href="/configuracoes/textosPadrao" class="btn btn-info btn-sm text-white">
                                    <i class="fa-solid fa-file-lines mr-1"></i>
                                    Acessar Textos
                                </a>
                            </div>
                        </div>
                        <div class="btn btn-circle btn-info btn-outline no-animation hidden sm:inline-flex">
                            <i class="fa-solid fa-align-left text-lg"></i>
                        </div>
                    </div>
                </div>

                <!-- Card 3: Cadastro de Usuários -->
                <div class="card bg-base-100 shadow-md border-l-4 border-warning">
                    <div class="card-body py-4 px-5 flex flex-row items-center justify-between">
                        <div>
                            <p class="text-xs font-bold uppercase text-gray-500">Equipe & Operadores</p>
                            <h3 class="text-lg font-extrabold text-gray-900 mt-1">Cadastro de Usuários</h3>
                            <p class="text-xs text-gray-500 mt-1">Adicione ou edite usuários e vincule permissões.</p>
                            <div class="mt-3">
                                <a href="/ListaUsuarios" class="btn btn-warning btn-sm text-white">
                                    <i class="fa-solid fa-users-gear mr-1"></i>
                                    Gerenciar Usuários
                                </a>
                            </div>
                        </div>
                        <div class="btn btn-circle btn-warning btn-outline no-animation hidden sm:inline-flex">
                            <i class="fa-solid fa-users text-lg"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card Principal: Geração e Listagem de Bi-semanas por Ano -->
            <div class="card w-full bg-base-100 shadow-xl rounded-md">
                <div class="card-body p-4 md:p-6">
                    <div class="w-full flex flex-col lg:flex-row gap-6">
                        <!-- Coluna Esquerda: Formulário para Gerar Bi-semanas de Novo Ano -->
                        <div class="w-full lg:w-4/12 border border-slate-300 rounded-lg p-4 space-y-4 h-fit bg-base-100">
                            <div class="flex items-center justify-between border-b pb-2">
                                <h2 class="text-lg font-bold">Gerar Bi-semanas do Ano</h2>
                                <span class="badge badge-success text-white">Calendário OOH</span>
                            </div>

                            <p class="text-xs text-gray-600">
                                Informe o ano e o <strong>dia inicial da 1ª Bi-semana</strong> para criar automaticamente todas as
                                <strong>26 bi-semanas</strong> (ciclos de 14 dias com numeração de <code>1</code> a <code>51</code>).
                            </p>

                            <form @submit.prevent="criarBisemanasAno" class="space-y-3">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div class="form-control w-full">
                                        <label class="label py-1">
                                            <span class="label-text font-semibold">Ano para Geração *</span>
                                        </label>
                                        <input
                                            v-model="novoAno"
                                            type="number"
                                            min="2020"
                                            max="2100"
                                            placeholder="Ex: 2027"
                                            class="input input-bordered w-full font-bold text-base"
                                            required
                                        />
                                    </div>

                                    <div class="form-control w-full">
                                        <label class="label py-1">
                                            <span class="label-text font-semibold">Início da 1ª Bi-semana *</span>
                                        </label>
                                        <input
                                            v-model="dataInicioNovoAno"
                                            type="date"
                                            class="input input-bordered w-full text-sm font-semibold"
                                            required
                                        />
                                    </div>
                                </div>

                                <!-- Resumo da prévia -->
                                <div v-if="previewBisemanas.length > 0" class="p-3 bg-base-200 rounded-lg text-xs space-y-1 border border-base-300">
                                    <div class="font-bold text-gray-800 flex items-center justify-between">
                                        <span>Prévia para {{ novoAno }}:</span>
                                        <span class="badge badge-primary badge-sm text-white">{{ previewBisemanas.length }} bi-semanas</span>
                                    </div>
                                    <div class="text-gray-600">
                                        • <strong>1ª Bi-semana (BS {{ previewBisemanas[0].num_bisemana }}):</strong>
                                        {{ formatDateBR(previewBisemanas[0].inicio) }} até {{ formatDateBR(previewBisemanas[0].fim) }}
                                    </div>
                                    <div class="text-gray-600">
                                        • <strong>Última Bi-semana (BS {{ previewBisemanas[previewBisemanas.length - 1].num_bisemana }}):</strong>
                                        {{ formatDateBR(previewBisemanas[previewBisemanas.length - 1].inicio) }} até {{ formatDateBR(previewBisemanas[previewBisemanas.length - 1].fim) }}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    :disabled="salvandoAno"
                                    class="btn btn-success text-white w-full"
                                >
                                    <i v-if="salvandoAno" class="fa-solid fa-spinner fa-spin mr-1"></i>
                                    <i v-else class="fa-solid fa-calendar-check mr-1"></i>
                                    {{ salvandoAno ? 'Gerando Bi-semanas...' : `Criar Bi-semanas de ${novoAno || ''}` }}
                                </button>
                            </form>

                            <div class="divider my-2"></div>

                            <!-- Bloco de Manutenção de Imagens -->
                            <div class="space-y-2">
                                <h3 class="text-sm font-bold text-gray-800">
                                    <i class="fa-solid fa-wand-magic-sparkles text-primary mr-1"></i>
                                    Otimização de Imagens dos Painéis
                                </h3>
                                <p class="text-xs text-gray-500">
                                    Recria e atualiza as versões comprimidas das fotos dos painéis para carregamento rápido nos relatórios e reservas.
                                </p>
                                <button
                                    type="button"
                                    class="btn btn-outline btn-primary btn-sm w-full"
                                    :disabled="loadingRefresh"
                                    @click="refreshCompressed"
                                >
                                    <i v-if="loadingRefresh" class="fa-solid fa-spinner fa-spin mr-1"></i>
                                    <i v-else class="fa-solid fa-rotate mr-1"></i>
                                    {{ loadingRefresh ? 'Processando Imagens...' : 'Atualizar Imagens Comprimidas' }}
                                </button>
                            </div>
                        </div>

                        <!-- Coluna Direita: Tabela de Anos Cadastrados e suas Bi-semanas -->
                        <div class="w-full lg:w-8/12 border border-slate-300 rounded-lg p-4 flex flex-col justify-between bg-base-100">
                            <div>
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-4">
                                    <div>
                                        <h2 class="text-lg font-bold">Calendário de Anos e Bi-semanas</h2>
                                        <p class="text-xs text-gray-500">
                                            Anos disponíveis para reservas, lançamentos de vendas (OS) e emissão de PIs. Anos atuais e futuros podem ter suas datas editadas.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        class="btn btn-success btn-sm text-white"
                                        @click="abrirModalNovoAno"
                                    >
                                        <i class="fa-solid fa-plus mr-1"></i>
                                        Novo Ano
                                    </button>
                                </div>

                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-gray-300 border">
                                        <thead class="bg-base-200">
                                            <tr class="divide-x divide-gray-200">
                                                <th class="py-3 px-3 text-left text-xs font-bold uppercase text-gray-700">ID</th>
                                                <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Ano</th>
                                                <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Qtd. Bi-semanas</th>
                                                <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Início da 1ª BS</th>
                                                <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Fim da Última BS</th>
                                                <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Status</th>
                                                <th class="py-3 px-3 text-center text-xs font-bold uppercase text-gray-700">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-200 bg-white">
                                            <tr v-if="listaAnos.length === 0">
                                                <td colspan="7" class="py-8 text-center text-gray-500 text-sm">
                                                    Nenhum ano cadastrado.
                                                </td>
                                            </tr>

                                            <tr
                                                v-for="item in listaAnos"
                                                :key="item.id"
                                                class="divide-x divide-gray-200 hover:bg-base-200/50 transition-colors"
                                            >
                                                <td class="whitespace-nowrap py-3 px-3 text-sm font-medium text-gray-900">
                                                    #{{ item.id }}
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-center text-base font-extrabold text-gray-900">
                                                    {{ item.ano_bisemana }}
                                                    <span
                                                        v-if="Number(item.ano_bisemana) === anoAtual"
                                                        class="badge badge-primary badge-xs text-white ml-1"
                                                    >
                                                        Atual
                                                    </span>
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-center text-sm">
                                                    <span class="badge badge-neutral font-bold">
                                                        {{ item.qtd_bisemanas }} BS
                                                    </span>
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-center text-sm text-gray-700">
                                                    {{ formatDateBR(item.inicio_ano) }}
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-center text-sm text-gray-700">
                                                    {{ formatDateBR(item.fim_ano) }}
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-center">
                                                    <span
                                                        v-if="item.qtd_bisemanas > 0"
                                                        class="badge badge-success text-white badge-sm"
                                                    >
                                                        Gerado
                                                    </span>
                                                    <span v-else class="badge badge-warning text-white badge-sm">
                                                        Sem BS
                                                    </span>
                                                </td>

                                                <td class="whitespace-nowrap py-3 px-3 text-center">
                                                    <div class="flex items-center justify-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            class="btn btn-xs btn-info text-white"
                                                            @click="abrirModalVerBisemanas(item)"
                                                        >
                                                            <i class="fa-solid fa-calendar-days mr-1"></i>
                                                            Ver Bi-semanas
                                                        </button>

                                                        <button
                                                            v-if="podeEditarAno(item)"
                                                            type="button"
                                                            class="btn btn-xs btn-warning text-white"
                                                            @click="abrirModalEditarBisemanas(item)"
                                                            title="Editar datas das bi-semanas deste ano"
                                                        >
                                                            <i class="fa-solid fa-pen-to-square mr-1"></i>
                                                            Editar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="pt-4 mt-4 border-t text-xs text-gray-500 flex items-center justify-between">
                                <span>Total de <strong>{{ listaAnos.length }}</strong> anos configurados no sistema</span>
                                <span>Padrão: 26 bi-semanas de 14 dias por ano</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ==================== MODAL GERAR BI-SEMANAS (NOVO ANO) ==================== -->
            <input type="checkbox" id="modal-gerar-bisemanas" class="modal-toggle" v-model="modalNovoAnoOpen" />
            <div class="modal" :class="{ 'modal-open': modalNovoAnoOpen }">
                <div class="modal-box max-w-2xl">
                    <h3 class="font-bold text-lg mb-2">
                        <i class="fa-solid fa-calendar-plus text-success mr-2"></i>
                        Criar Bi-semanas de Novo Ano
                    </h3>
                    <p class="text-xs text-gray-600 mb-4">
                        Informe o ano e o <strong>dia inicial da primeira bi-semana</strong>. O sistema gerará todas as 26 bi-semanas somando 13 dias para o término de cada bi-semana e iniciando a próxima no dia seguinte.
                    </p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div class="form-control w-full">
                            <label class="label py-1">
                                <span class="label-text font-semibold">Informe o Ano *</span>
                            </label>
                            <input
                                v-model="novoAno"
                                type="number"
                                min="2020"
                                max="2100"
                                placeholder="Ex: 2027"
                                class="input input-bordered w-full font-bold text-lg"
                            />
                        </div>

                        <div class="form-control w-full">
                            <label class="label py-1">
                                <span class="label-text font-semibold">Dia Inicial da 1ª Bi-semana *</span>
                            </label>
                            <input
                                v-model="dataInicioNovoAno"
                                type="date"
                                class="input input-bordered w-full font-bold text-base"
                            />
                        </div>
                    </div>

                    <!-- Tabela de Prévia das Bi-semanas -->
                    <div v-if="previewBisemanas.length > 0" class="border rounded-lg overflow-hidden">
                        <div class="bg-base-200 px-3 py-2 text-xs font-bold uppercase text-gray-700 flex justify-between">
                            <span>Prévia das Bi-semanas a serem criadas ({{ novoAno }})</span>
                            <span>{{ previewBisemanas.length }} registros</span>
                        </div>
                        <div class="max-h-60 overflow-y-auto">
                            <table class="min-w-full divide-y divide-gray-200 text-xs">
                                <thead class="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th class="py-2 px-3 text-left font-bold">Nº Bi-semana</th>
                                        <th class="py-2 px-3 text-center font-bold">Data Inicial</th>
                                        <th class="py-2 px-3 text-center font-bold">Data Final (+13 dias)</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <tr v-for="bs in previewBisemanas" :key="bs.num_bisemana">
                                        <td class="py-1.5 px-3 font-bold">BS {{ bs.num_bisemana }}</td>
                                        <td class="py-1.5 px-3 text-center">{{ formatDateBR(bs.inicio) }}</td>
                                        <td class="py-1.5 px-3 text-center">{{ formatDateBR(bs.fim) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="modal-action">
                        <button
                            type="button"
                            class="btn btn-ghost"
                            :disabled="salvandoAno"
                            @click="modalNovoAnoOpen = false"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            class="btn btn-success text-white"
                            :disabled="salvandoAno"
                            @click="criarBisemanasAno"
                        >
                            <i v-if="salvandoAno" class="fa-solid fa-spinner fa-spin mr-1"></i>
                            <i v-else class="fa-solid fa-check mr-1"></i>
                            {{ salvandoAno ? 'Criando Bi-semanas...' : `Confirmar e Gerar Ano ${novoAno || ''}` }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- ==================== MODAL VISUALIZAR BI-SEMANAS DO ANO ==================== -->
            <input type="checkbox" id="modal-ver-bisemanas" class="modal-toggle" v-model="modalVerBsOpen" />
            <div class="modal" :class="{ 'modal-open': modalVerBsOpen }">
                <div class="modal-box max-w-2xl">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-bold text-lg">
                            <i class="fa-solid fa-calendar-days text-info mr-2"></i>
                            Bi-semanas do Ano {{ anoSelecionado?.ano_bisemana }}
                        </h3>
                        <button
                            v-if="podeEditarAno(anoSelecionado)"
                            type="button"
                            class="btn btn-warning btn-xs text-white"
                            @click="abrirModalEditarBisemanas(anoSelecionado)"
                        >
                            <i class="fa-solid fa-pen-to-square mr-1"></i>
                            Editar Bi-semanas
                        </button>
                    </div>

                    <div class="max-h-96 overflow-y-auto border rounded-lg mt-3">
                        <table class="min-w-full divide-y divide-gray-200 text-xs">
                            <thead class="bg-base-200 sticky top-0">
                                <tr>
                                    <th class="py-2.5 px-3 text-left font-bold uppercase">ID</th>
                                    <th class="py-2.5 px-3 text-center font-bold uppercase">Bi-semana</th>
                                    <th class="py-2.5 px-3 text-center font-bold uppercase">Início</th>
                                    <th class="py-2.5 px-3 text-center font-bold uppercase">Fim</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-if="!anoSelecionado?.bisemanas?.length">
                                    <td colspan="4" class="py-6 text-center text-gray-500">
                                        Nenhuma bi-semana cadastrada para este ano.
                                    </td>
                                </tr>
                                <tr v-for="bs in (anoSelecionado?.bisemanas || [])" :key="bs.id">
                                    <td class="py-2 px-3 text-gray-500">#{{ bs.id }}</td>
                                    <td class="py-2 px-3 text-center font-bold text-gray-900">BS {{ bs.num_bisemana }}</td>
                                    <td class="py-2 px-3 text-center">{{ formatDateBR(bs.inicio) }}</td>
                                    <td class="py-2 px-3 text-center">{{ formatDateBR(bs.fim) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="modal-action">
                        <button type="button" class="btn btn-primary text-white" @click="modalVerBsOpen = false">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>

            <!-- ==================== MODAL EDITAR BI-SEMANAS (ANO ATUAL E FUTUROS) ==================== -->
            <input type="checkbox" id="modal-editar-bisemanas" class="modal-toggle" v-model="modalEditarBsOpen" />
            <div class="modal" :class="{ 'modal-open': modalEditarBsOpen }">
                <div class="modal-box max-w-3xl">
                    <h3 class="font-bold text-lg mb-1">
                        <i class="fa-solid fa-pen-to-square text-warning mr-2"></i>
                        Editar Bi-semanas do Ano {{ anoEditando?.ano_bisemana }}
                    </h3>
                    <p class="text-xs text-gray-600 mb-4">
                        Altere o <strong>Dia Inicial da 1ª Bi-semana</strong> para recalcular todo o calendário do ano automaticamente, ou ajuste as datas de cada bi-semana abaixo.
                    </p>

                    <!-- Barra de Recálculo Rápido pelo Dia Inicial -->
                    <div class="p-3.5 bg-base-200 rounded-lg border border-base-300 mb-4 space-y-3">
                        <div class="flex flex-col sm:flex-row sm:items-end gap-3">
                            <div class="form-control flex-1">
                                <label class="label py-1">
                                    <span class="label-text text-xs font-bold">Dia Inicial da 1ª Bi-semana (BS 1)</span>
                                </label>
                                <input
                                    v-model="dataInicioEdicao"
                                    type="date"
                                    class="input input-bordered w-full text-sm font-bold bg-white"
                                />
                            </div>

                            <button
                                type="button"
                                class="btn btn-primary btn-sm text-white h-10"
                                @click="recalcularEdicaoPelaDataInicial()"
                            >
                                <i class="fa-solid fa-rotate mr-1"></i>
                                Recalcular Todas pelo Dia Inicial
                            </button>

                            <button
                                v-if="dataSugeridaAnoAnteriorEdicao && dataSugeridaAnoAnteriorEdicao !== dataInicioEdicao"
                                type="button"
                                class="btn btn-outline btn-info btn-sm h-10"
                                @click="recalcularEdicaoPelaDataInicial(dataSugeridaAnoAnteriorEdicao)"
                                title="Definir início logo após o fim da última bi-semana do ano anterior"
                            >
                                <i class="fa-solid fa-wand-magic-sparkles mr-1"></i>
                                Usar {{ formatDateBR(dataSugeridaAnoAnteriorEdicao) }} (Pós-{{ Number(anoEditando?.ano_bisemana) - 1 }})
                            </button>
                        </div>

                        <label class="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium pt-1">
                            <input
                                type="checkbox"
                                v-model="encadearDatasEdicao"
                                class="checkbox checkbox-xs checkbox-primary"
                            />
                            <span>Recalcular bi-semanas seguintes automaticamente em cascata (14 dias cada) ao alterar uma data na tabela</span>
                        </label>
                    </div>

                    <!-- Tabela Editável das Bi-semanas -->
                    <div class="max-h-80 overflow-y-auto border rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 text-xs">
                            <thead class="bg-base-200 sticky top-0 z-10">
                                <tr>
                                    <th class="py-2.5 px-3 text-left font-bold uppercase">ID</th>
                                    <th class="py-2.5 px-3 text-center font-bold uppercase">Bi-semana</th>
                                    <th class="py-2.5 px-3 text-center font-bold uppercase">Data Inicial</th>
                                    <th class="py-2.5 px-3 text-center font-bold uppercase">Data Final</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-for="(bs, idx) in bisemanasEditando" :key="bs.id || bs.num_bisemana">
                                    <td class="py-1.5 px-3 text-gray-500">#{{ bs.id || 'Novo' }}</td>
                                    <td class="py-1.5 px-3 text-center font-bold text-gray-900">BS {{ bs.num_bisemana }}</td>
                                    <td class="py-1.5 px-3 text-center">
                                        <input
                                            type="date"
                                            v-model="bs.inicio"
                                            @change="aoAlterarInicioBsEdicao(idx)"
                                            class="input input-bordered input-xs w-36 text-xs font-medium"
                                        />
                                    </td>
                                    <td class="py-1.5 px-3 text-center">
                                        <input
                                            type="date"
                                            v-model="bs.fim"
                                            @change="aoAlterarFimBsEdicao(idx)"
                                            class="input input-bordered input-xs w-36 text-xs font-medium"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="modal-action">
                        <button
                            type="button"
                            class="btn btn-ghost"
                            :disabled="salvandoEdicao"
                            @click="modalEditarBsOpen = false"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            class="btn btn-success text-white"
                            :disabled="salvandoEdicao"
                            @click="salvarEdicaoBisemanas"
                        >
                            <i v-if="salvandoEdicao" class="fa-solid fa-spinner fa-spin mr-1"></i>
                            <i v-else class="fa-solid fa-floppy-disk mr-1"></i>
                            {{ salvandoEdicao ? 'Salvando...' : `Salvar Bi-semanas de ${anoEditando?.ano_bisemana || ''}` }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
