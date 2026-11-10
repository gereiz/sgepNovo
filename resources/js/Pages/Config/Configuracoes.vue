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

const novoAno = ref(proximoAnoSugerido.value);
const salvandoAno = ref(false);
const modalNovoAnoOpen = ref(false);

const loadingRefresh = ref(false);

// Modal para visualizar as bi-semanas de um ano específico
const modalVerBsOpen = ref(false);
const anoSelecionado = ref(null);

const totalBisemanasSistema = computed(() => {
    return listaAnos.value.reduce((acc, a) => acc + (Number(a.qtd_bisemanas) || 0), 0);
});

// Prévia dinâmica das bi-semanas que serão geradas para o ano digitado
const previewBisemanas = computed(() => {
    const y = Number(novoAno.value);
    if (!y || y < 2000 || y > 2100) return [];
    const lista = [];
    // Mesmo algoritmo do SQL:
    // SET semana_inicial = CONCAT(ano_param, '-01-01');
    // SET numero_bisemana = 1;
    // WHILE numero_bisemana < 53 DO ...
    let dtInicial = new Date(Date.UTC(y, 0, 1));
    let numBs = 1;
    while (numBs < 53) {
        const dtFinal = new Date(dtInicial.getTime());
        dtFinal.setUTCDate(dtFinal.getUTCDate() + 13);

        lista.push({
            num_bisemana: numBs,
            inicio: dtInicial.toISOString().slice(0, 10),
            fim: dtFinal.toISOString().slice(0, 10),
        });

        dtInicial = new Date(dtFinal.getTime());
        dtInicial.setUTCDate(dtInicial.getUTCDate() + 1);
        numBs += 2;
    }
    return lista;
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

function abrirModalNovoAno() {
    novoAno.value = proximoAnoSugerido.value;
    modalNovoAnoOpen.value = true;
}

async function criarBisemanasAno() {
    const anoNum = Number(novoAno.value);
    if (!anoNum || anoNum < 2000 || anoNum > 2100) {
        toastr.error('Informe um ano válido (ex.: 2027).');
        return;
    }

    salvandoAno.value = true;
    try {
        const res = await axios.post('/configuracoes/addAno', { ano: anoNum });
        const msg = res.data?.message || `Bi-semanas do ano ${anoNum} criadas com sucesso!`;
        toastr.success(msg);
        modalNovoAnoOpen.value = false;
        router.reload({
            only: ['anos'],
            onSuccess: () => {
                novoAno.value = proximoAnoSugerido.value;
            },
        });
    } catch (err) {
        const msg = err?.response?.data?.message || 'Erro ao gerar as bi-semanas para o ano informado.';
        toastr.error(msg);
    } finally {
        salvandoAno.value = false;
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

function abrirModalVerBisemanas(itemAno) {
    anoSelecionado.value = itemAno;
    modalVerBsOpen.value = true;
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
                                Informe o ano desejado para criar automaticamente o registro do ano e todas as suas
                                <strong>26 bi-semanas</strong> (iniciando em <code>01/01</code>, com ciclos de 14 dias e numeração ímpar de <code>1</code> a <code>51</code>).
                            </p>

                            <form @submit.prevent="criarBisemanasAno" class="space-y-3">
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
                                        class="input input-bordered w-full font-bold text-lg"
                                        required
                                    />
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
                                            Anos disponíveis para reservas, lançamentos de vendas (OS) e emissão de PIs
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
                                                    <button
                                                        type="button"
                                                        class="btn btn-xs btn-info text-white"
                                                        @click="abrirModalVerBisemanas(item)"
                                                    >
                                                        <i class="fa-solid fa-calendar-days mr-1"></i>
                                                        Ver Bi-semanas
                                                    </button>
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
                        Informe apenas o ano abaixo. O sistema criará o ano e gerará todas as bi-semanas começando em
                        <code>01/01</code>, somando 13 dias para o término de cada bi-semana e incrementando a numeração de 2 em 2 até completar o ano.
                    </p>

                    <div class="form-control w-full mb-4">
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
                    <h3 class="font-bold text-lg mb-2">
                        <i class="fa-solid fa-calendar-days text-info mr-2"></i>
                        Bi-semanas do Ano {{ anoSelecionado?.ano_bisemana }}
                    </h3>

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
        </div>
    </AuthenticatedLayout>
</template>
