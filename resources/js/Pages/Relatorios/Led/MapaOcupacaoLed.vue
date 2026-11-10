<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ref, computed, watch, onMounted } from 'vue';
import { useToastr } from '@/Components/toastr';
import axios from 'axios';

const props = defineProps({
    anos: { type: Array, default: () => [] },
    bisemanas: { type: Array, default: () => [] },
    clientes: { type: Array, default: () => [] },
    leds: { type: Array, default: () => [] },
    dadosIniciais: { type: Object, default: () => ({ leds: [], total_leds: 0 }) },
    diasAlerta: { type: Number, default: 5 },
});

const toastr = useToastr();
const loading = ref(false);

// Filtros
const filtroLed = ref('0');
const filtroCliente = ref('0');
const filtroStatusPI = ref('T');
const filtroStatusContrato = ref('T');

// Mês base da visualização em grade (6 meses)
const mesAtualVisualizacao = ref((() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
})());

const mapa = ref(props.dadosIniciais || { leds: [], total_leds: 0 });

// Modal de Detalhes
const modalDetalheOpen = ref(false);
const ocupacaoSelecionada = ref(null);
const ledSelecionado = ref(null);

// Modal de Extensão
const modalExtensaoOpen = ref(false);
const novaDataFim = ref('');
const submittingExtensao = ref(false);

// Modal de Alertas
const modalAlertasOpen = ref(false);
const alertasTermino = ref([]);
const loadingAlertas = ref(false);

function buscarMapa() {
    loading.value = true;
    axios.post('/MapaOcupacaoLed', {
        cliente_id: filtroCliente.value !== '0' ? Number(filtroCliente.value) : null,
        outdoor_id: filtroLed.value !== '0' ? Number(filtroLed.value) : null,
        status: filtroStatusPI.value !== 'T' ? filtroStatusPI.value : null,
    })
        .then(res => {
            mapa.value = res.data || { leds: [], total_leds: 0 };
        })
        .catch(() => toastr.error('Erro ao buscar mapa de ocupação'))
        .finally(() => {
            loading.value = false;
        });
}

onMounted(() => {
    buscarMapa();
});

const colunasMeses = computed(() => {
    const meses = [];
    const base = new Date(mesAtualVisualizacao.value);
    for (let i = -1; i < 5; i++) {
        const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const nomeMes = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
        const primeiroDia = `${yyyy}-${mm}-01`;
        const ultimoDia = new Date(yyyy, d.getMonth() + 1, 0).toISOString().split('T')[0];

        meses.push({
            rotulo: `${nomeMes}/${String(yyyy).slice(2)}`,
            ano: yyyy,
            mesNumero: d.getMonth() + 1,
            primeiroDia,
            ultimoDia,
        });
    }
    return meses;
});

function navegarMes(offset) {
    const prev = mesAtualVisualizacao.value;
    mesAtualVisualizacao.value = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
}

function irParaMesAtual() {
    const d = new Date();
    mesAtualVisualizacao.value = new Date(d.getFullYear(), d.getMonth(), 1);
}

function getOcupacoesMes(ocupacoes, colMes) {
    if (!ocupacoes || ocupacoes.length === 0) return [];
    return ocupacoes.filter(o => {
        const ini = o.dt_inicio;
        const fim = o.dt_fim;
        if (!ini || !fim) return false;
        return (ini <= colMes.ultimoDia && fim >= colMes.primeiroDia);
    });
}

const ledsExibidos = computed(() => {
    const list = mapa.value?.leds || [];
    if (filtroStatusContrato.value === 'T') return list;

    return list.filter(led => {
        const oc = led.ocupacoes || [];
        return oc.some(o => o.status_contrato?.status === filtroStatusContrato.value);
    });
});

function badgeStatusClasse(statusKey) {
    const map = {
        normal: 'badge-success text-white',
        proximo: 'badge-warning',
        hoje: 'badge-warning animate-pulse',
        encerrado: 'badge-error text-white',
    };
    return map[statusKey] ?? 'badge-info text-white';
}

function verDetalhesOcupacao(led, ocupacao) {
    ledSelecionado.value = led;
    ocupacaoSelecionada.value = ocupacao;
    modalDetalheOpen.value = true;
}

function abrirExtensao(led, ocupacao) {
    ledSelecionado.value = led;
    ocupacaoSelecionada.value = ocupacao;
    const fimAtual = ocupacao?.dt_fim ? new Date(ocupacao.dt_fim + 'T00:00:00') : new Date();
    fimAtual.setDate(fimAtual.getDate() + 30);
    const yyyy = fimAtual.getFullYear();
    const mm = String(fimAtual.getMonth() + 1).padStart(2, '0');
    const dd = String(fimAtual.getDate()).padStart(2, '0');
    novaDataFim.value = `${yyyy}-${mm}-${dd}`;
    modalExtensaoOpen.value = true;
}

function confirmarExtensao() {
    if (!ocupacaoSelecionada.value || !novaDataFim.value) {
        toastr.error('Informe a nova data final!');
        return;
    }
    submittingExtensao.value = true;
    axios.post('/ExtenderReservaLed', {
        reserva_id: ocupacaoSelecionada.value.reserva_id,
        nova_data_fim: novaDataFim.value,
    })
        .then(res => {
            if (res.data?.cod === 1) {
                toastr.success(res.data?.msg || 'Vigência estendida com sucesso!');
                modalExtensaoOpen.value = false;
                modalDetalheOpen.value = false;
                buscarMapa();
            } else {
                toastr.error(res.data?.msg || 'Não foi possível estender a reserva');
            }
        })
        .catch(err => {
            toastr.error(err.response?.data?.msg || 'Erro ao estender reserva');
        })
        .finally(() => {
            submittingExtensao.value = false;
        });
}

function abrirAlertasTermino() {
    loadingAlertas.value = true;
    modalAlertasOpen.value = true;
    axios.post('/GetContratosProximosTerminoLed', { dias: props.diasAlerta })
        .then(res => {
            alertasTermino.value = res.data || [];
        })
        .catch(() => toastr.error('Erro ao buscar alertas de término'))
        .finally(() => {
            loadingAlertas.value = false;
        });
}

function formatDataBR(dateStr) {
    if (!dateStr) return '—';
    const parts = String(dateStr).split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
}
</script>

<template>
    <Head title="Mapa de Ocupação de LEDs" />

    <AuthenticatedLayout>
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 mx-2 sm:mx-4">
            <!-- Navbar no padrão clássico Vue -->
            <div class="navbar bg-base-100 rounded-box shadow mb-4">
                <div class="flex-1 flex items-center gap-2">
                    <a class="btn btn-ghost text-xl">Mapa de Ocupação • LEDs</a>
                    <span class="badge badge-primary text-white font-bold">
                        LEDs: {{ mapa.total_leds ?? 0 }}
                    </span>
                </div>
                <div class="flex-none gap-2">
                    <button class="btn btn-sm btn-warning" @click="abrirAlertasTermino()">
                        <i class="fa-solid fa-triangle-exclamation mr-1"></i> Contratos próximos do término
                    </button>
                    <a href="/ReservaLeds" class="btn btn-sm btn-primary text-white">
                        <i class="fa-regular fa-calendar-check mr-1"></i> Reserva de LEDs
                    </a>
                </div>
            </div>

            <!-- Filtros no padrão clássico Vue (bg-base-200 p-4 rounded-lg) -->
            <div class="w-full flex flex-wrap items-end justify-center gap-4 mb-6 bg-base-200 p-4 rounded-lg">
                <div class="w-full sm:w-2/12 flex flex-col">
                    <label class="label-text mb-1">LED</label>
                    <select class="select select-bordered" v-model="filtroLed">
                        <option value="0">Todos</option>
                        <option v-for="l in props.leds" :key="l.id" :value="String(l.id)">
                            LED #{{ l.identificacao }}
                        </option>
                    </select>
                </div>

                <div class="w-full sm:w-3/12 flex flex-col">
                    <label class="label-text mb-1">Cliente</label>
                    <select class="select select-bordered" v-model="filtroCliente">
                        <option value="0">Todos</option>
                        <option v-for="c in props.clientes" :key="c.id" :value="String(c.id)">
                            {{ c.razao_social ?? c.nome_fantasia }}
                        </option>
                    </select>
                </div>

                <div class="w-full sm:w-2/12 flex flex-col">
                    <label class="label-text mb-1">Status PI</label>
                    <select class="select select-bordered" v-model="filtroStatusPI">
                        <option value="T">Todos</option>
                        <option value="com_pi">Com PI</option>
                        <option value="sem_pi">Sem PI</option>
                    </select>
                </div>

                <div class="w-full sm:w-2/12 flex flex-col">
                    <label class="label-text mb-1">Status Vigência</label>
                    <select class="select select-bordered" v-model="filtroStatusContrato">
                        <option value="T">Todos</option>
                        <option value="normal">Normal</option>
                        <option value="proximo">Próximo</option>
                        <option value="hoje">Vencendo Hoje</option>
                        <option value="encerrado">Encerrado</option>
                    </select>
                </div>

                <div class="w-full sm:w-2/12">
                    <button class="btn btn-primary w-full text-white" :class="{ 'btn-disabled': loading }" @click="buscarMapa()">
                        <i class="fa-solid fa-magnifying-glass mr-2"></i>
                        {{ loading ? 'Buscando...' : 'Buscar' }}
                    </button>
                </div>
            </div>

            <!-- Legenda e Navegação de Meses no padrão clássico Vue -->
            <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div class="flex items-center gap-2">
                    <button class="btn btn-sm btn-outline" @click="navegarMes(-1)" title="Mês anterior">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" @click="irParaMesAtual()">
                        Mês Atual
                    </button>
                    <button class="btn btn-sm btn-outline" @click="navegarMes(1)" title="Próximo mês">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>

                <div class="flex flex-wrap items-center gap-4">
                    <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded bg-sky-500"></span>
                        <span class="text-sm">LED Ocupado (clique para detalhes)</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded bg-base-300 border border-dashed border-gray-400"></span>
                        <span class="text-sm">LED Disponível</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="badge badge-success badge-sm text-white">Normal</span>
                        <span class="badge badge-warning badge-sm">Próximo</span>
                        <span class="badge badge-error badge-sm text-white">Encerrado</span>
                    </div>
                </div>
            </div>

            <!-- Tabela Grade Mensal no padrão clássico Vue -->
            <div class="card w-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body p-4">
                    <div class="w-full overflow-auto border border-base-300 rounded-lg bg-base-100">
                        <table class="table table-sm table-pin-cols">
                            <thead>
                                <tr class="bg-base-200">
                                    <th class="sticky left-0 z-10 bg-base-200 border-r min-w-[200px]">LED</th>
                                    <th
                                        v-for="(m, idx) in colunasMeses"
                                        :key="idx"
                                        class="text-center min-w-[160px] border-r"
                                    >
                                        <span class="font-bold">{{ m.rotulo }}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="loading">
                                    <tr>
                                        <td :colspan="1 + colunasMeses.length" class="text-center py-10 text-gray-400">
                                            Carregando mapa de ocupação...
                                        </td>
                                    </tr>
                                </template>
                                <template v-else-if="!ledsExibidos.length">
                                    <tr>
                                        <td :colspan="1 + colunasMeses.length" class="text-center py-10 text-gray-400">
                                            Nenhum LED encontrado. Cadastre um painel em "Cadastro de LEDs".
                                        </td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr v-for="led in ledsExibidos" :key="led.painel_id" class="hover">
                                        <td class="sticky left-0 z-10 bg-base-100 border-r">
                                            <div class="flex items-center gap-2">
                                                <span class="badge badge-primary text-white font-bold">LED</span>
                                                <span class="font-bold text-sm">#{{ led.identificacao }}</span>
                                            </div>
                                            <div class="text-xs text-gray-500 mt-1">{{ led.bairro || '—' }}</div>
                                        </td>

                                        <td
                                            v-for="(colMes, mIdx) in colunasMeses"
                                            :key="mIdx"
                                            class="align-top border-r p-2"
                                        >
                                            <template v-if="getOcupacoesMes(led.ocupacoes, colMes).length">
                                                <div class="space-y-1.5">
                                                    <div
                                                        v-for="oc in getOcupacoesMes(led.ocupacoes, colMes)"
                                                        :key="oc.reserva_id"
                                                        @click="verDetalhesOcupacao(led, oc)"
                                                        class="p-2 rounded bg-sky-500 hover:bg-sky-600 text-white text-xs cursor-pointer transition shadow-sm"
                                                    >
                                                        <div class="font-bold truncate" :title="oc.cliente_nome">
                                                            {{ oc.cliente_nome || 'Reservado' }}
                                                        </div>
                                                        <div class="text-[10px] opacity-90 truncate">
                                                            {{ oc.campanha || '—' }}
                                                        </div>
                                                        <div class="mt-1 flex items-center justify-between gap-1">
                                                            <span
                                                                class="badge badge-xs"
                                                                :class="badgeStatusClasse(oc.status_contrato?.status)"
                                                            >
                                                                {{ oc.status_contrato?.label || 'Normal' }}
                                                            </span>
                                                            <span class="text-[10px] font-bold">
                                                                {{ oc.pi_ok ? 'PI' : 'R' }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="h-12 w-full rounded bg-base-300 opacity-40 flex items-center justify-center text-[11px] text-gray-500">
                                                    Disponível
                                                </div>
                                            </template>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>

                    <div class="text-xs text-gray-500 mt-3">
                        Legenda células: <span class="font-bold">R</span> = Reserva sem PI • <span class="font-bold">PI</span> = Reserva com PI emitido. Clique em uma reserva ocupada para ver detalhes ou estender a vigência.
                    </div>
                </div>
            </div>

            <!-- MODAL DETALHES DA OCUPAÇÃO -->
            <TransitionRoot as="template" :show="modalDetalheOpen">
                <Dialog as="div" class="relative z-50" @close="modalDetalheOpen = false">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </TransitionChild>

                    <div class="fixed inset-0 z-10 overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <TransitionChild
                                as="template"
                                enter="ease-out duration-300"
                                enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enter-to="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leave-from="opacity-100 translate-y-0 sm:scale-100"
                                leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                                        Detalhes da Reserva • LED #{{ ledSelecionado?.identificacao }}
                                    </DialogTitle>

                                    <div v-if="ocupacaoSelecionada" class="mt-4 space-y-2 text-sm bg-base-200 p-4 rounded-lg">
                                        <div class="flex justify-between">
                                            <span>Cliente:</span>
                                            <b>{{ ocupacaoSelecionada.cliente_nome || '—' }}</b>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Campanha:</span>
                                            <b>{{ ocupacaoSelecionada.campanha || '—' }}</b>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Vigência:</span>
                                            <b>{{ formatDataBR(ocupacaoSelecionada.dt_inicio) }} até {{ formatDataBR(ocupacaoSelecionada.dt_fim) }}</b>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span>Status:</span>
                                            <span class="badge badge-sm" :class="badgeStatusClasse(ocupacaoSelecionada.status_contrato?.status)">
                                                {{ ocupacaoSelecionada.status_contrato?.label || 'Normal' }}
                                            </span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span>PI:</span>
                                            <span class="badge badge-sm" :class="ocupacaoSelecionada.pi_ok ? 'badge-success text-white' : 'badge-ghost'">
                                                {{ ocupacaoSelecionada.pi_ok ? 'Com PI' : 'Sem PI' }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="mt-5 flex justify-end gap-2">
                                        <button type="button" class="btn btn-outline btn-sm" @click="modalDetalheOpen = false">
                                            Fechar
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-primary btn-sm text-white"
                                            @click="modalDetalheOpen = false; abrirExtensao(ledSelecionado, ocupacaoSelecionada)"
                                        >
                                            Estender Vigência
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>

            <!-- MODAL ESTENDER VIGÊNCIA -->
            <TransitionRoot as="template" :show="modalExtensaoOpen">
                <Dialog as="div" class="relative z-50" @close="modalExtensaoOpen = false">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </TransitionChild>

                    <div class="fixed inset-0 z-10 overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <TransitionChild
                                as="template"
                                enter="ease-out duration-300"
                                enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enter-to="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leave-from="opacity-100 translate-y-0 sm:scale-100"
                                leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                                        Estender Vigência • LED #{{ ledSelecionado?.identificacao }}
                                    </DialogTitle>

                                    <div class="mt-4 space-y-4">
                                        <div class="p-3 bg-base-200 rounded-md text-sm flex justify-between">
                                            <span>Término Atual:</span>
                                            <b>{{ formatDataBR(ocupacaoSelecionada?.dt_fim) }}</b>
                                        </div>

                                        <div>
                                            <label class="label"><span class="label-text">Nova Data Final *</span></label>
                                            <input type="date" v-model="novaDataFim" class="input input-bordered w-full" required />
                                        </div>
                                    </div>

                                    <div class="mt-5 flex justify-end gap-2">
                                        <button type="button" class="btn btn-outline btn-sm" @click="modalExtensaoOpen = false">
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-primary btn-sm text-white"
                                            :disabled="submittingExtensao"
                                            @click="confirmarExtensao()"
                                        >
                                            {{ submittingExtensao ? 'Salvando...' : 'Confirmar Extensão' }}
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>

            <!-- MODAL ALERTAS DE TÉRMINO -->
            <TransitionRoot as="template" :show="modalAlertasOpen">
                <Dialog as="div" class="relative z-50" @close="modalAlertasOpen = false">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </TransitionChild>

                    <div class="fixed inset-0 z-10 overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <TransitionChild
                                as="template"
                                enter="ease-out duration-300"
                                enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enter-to="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leave-from="opacity-100 translate-y-0 sm:scale-100"
                                leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                                        Contratos Próximos do Término ({{ diasAlerta }} dias)
                                    </DialogTitle>

                                    <div class="mt-4 max-h-80 overflow-y-auto space-y-2">
                                        <div v-if="loadingAlertas" class="text-center py-6 text-gray-400">
                                            Buscando alertas...
                                        </div>
                                        <div v-else-if="!alertasTermino.length" class="text-center py-6 text-gray-500 text-sm">
                                            Nenhum contrato de LED próximo do término.
                                        </div>
                                        <div
                                            v-else
                                            v-for="alerta in alertasTermino"
                                            :key="alerta.reserva_id"
                                            class="p-3 rounded-lg bg-base-200 flex items-center justify-between text-sm"
                                        >
                                            <div>
                                                <div class="font-bold">LED #{{ alerta.painel_ident }} • {{ alerta.cliente_nome }}</div>
                                                <div class="text-xs text-gray-600">Campanha: {{ alerta.campanha || '—' }}</div>
                                                <div class="text-xs text-gray-500">
                                                    Vigência: {{ formatDataBR(alerta.dt_inicio) }} até {{ formatDataBR(alerta.dt_fim) }}
                                                </div>
                                            </div>
                                            <span class="badge badge-warning badge-sm">
                                                {{ alerta.status_contrato?.label }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="mt-5 flex justify-end">
                                        <button type="button" class="btn btn-outline btn-sm" @click="modalAlertasOpen = false">
                                            Fechar
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>
        </div>
    </AuthenticatedLayout>
</template>
