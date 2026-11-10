<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { ref, computed, watch, onMounted } from 'vue';
import { useToastr } from '@/Components/toastr';
import Multiselect from 'vue-multiselect';
import axios from 'axios';

const props = defineProps({
    clientes: { type: Array, default: () => [] },
    paineis: { type: Array, default: () => [] },
    permissions: { type: Object, default: () => ({}) },
});

const page = usePage();
const toastr = useToastr();

const userPermissions = computed(() => page.props.user?.permissions || []);
const criaReserva = computed(() => props.permissions?.cria_reserva ?? (userPermissions.value.length === 0 || userPermissions.value.includes('criar reserva')));
const excluiReserva = computed(() => props.permissions?.exclui_reserva ?? (userPermissions.value.length === 0 || userPermissions.value.includes('excluir reserva')));

// Filtros da tela
const searchTerm = ref('');
const filtroStatus = ref('T');

// Lista de contratos de LEDs
const reservasLedList = ref([]);
const loadingLedList = ref(false);

// Modal Nova Reserva de LED
const modalAddOpen = ref(false);
const clienteSelecionado = ref(null);
const ledPainelId = ref(0);
const ledDtInicio = ref('');
const ledDtFim = ref('');
const ledCampanha = ref('');
const ledObs = ref('');
const checaConflitoLed = ref(null);
const loadingConflito = ref(false);
const submittingLed = ref(false);

// Modal Extensão
const modalExtensaoOpen = ref(false);
const reservaParaExtender = ref(null);
const novaDataFim = ref('');
const submittingExtensao = ref(false);

// Modal Cancelamento
const modalCancelOpen = ref(false);
const reservaParaCancelar = ref(null);
const submittingCancel = ref(false);

const listaLedsDisponiveis = computed(() => {
    return (props.paineis || []).filter(p => Number(p.is_led) === 1 || p.is_led === true);
});

function clienteLista({ nome_fantasia, razao_social }) {
    return `${nome_fantasia ? nome_fantasia : razao_social}`;
}

function carregarReservasLed() {
    loadingLedList.value = true;
    axios.post('/GetReservasLed', {})
        .then(res => {
            reservasLedList.value = res.data?.reservas || [];
        })
        .catch(() => toastr.error('Erro ao carregar reservas de LEDs'))
        .finally(() => {
            loadingLedList.value = false;
        });
}

onMounted(() => {
    carregarReservasLed();
});

// Checagem de conflito em tempo real
let conflitoTimer = null;
watch([ledPainelId, ledDtInicio, ledDtFim], () => {
    if (conflitoTimer) clearTimeout(conflitoTimer);

    if (!ledPainelId.value || ledPainelId.value == 0 || !ledDtInicio.value || !ledDtFim.value) {
        checaConflitoLed.value = null;
        return;
    }

    if (ledDtFim.value < ledDtInicio.value) {
        checaConflitoLed.value = {
            conflito: true,
            msg: 'A data final não pode ser anterior à data inicial.',
        };
        return;
    }

    loadingConflito.value = true;
    conflitoTimer = setTimeout(() => {
        axios.post('/VerificaConflitoLed', {
            painel_id: Number(ledPainelId.value),
            dt_inicio: ledDtInicio.value,
            dt_fim: ledDtFim.value,
        })
            .then(res => {
                checaConflitoLed.value = res.data;
            })
            .catch(() => {
                checaConflitoLed.value = null;
            })
            .finally(() => {
                loadingConflito.value = false;
            });
    }, 350);
});

function abrirNovaReserva() {
    clienteSelecionado.value = null;
    ledPainelId.value = 0;
    ledDtInicio.value = '';
    ledDtFim.value = '';
    ledCampanha.value = '';
    ledObs.value = '';
    checaConflitoLed.value = null;
    modalAddOpen.value = true;
}

function handleSaveReservaLed() {
    const cliId = clienteSelecionado.value?.id ?? clienteSelecionado.value;
    if (!cliId) {
        toastr.error('Selecione um cliente!');
        return;
    }
    if (!ledPainelId.value || ledPainelId.value == 0) {
        toastr.error('Selecione o painel LED!');
        return;
    }
    if (!ledDtInicio.value || !ledDtFim.value) {
        toastr.error('Informe as datas de início e término da vigência!');
        return;
    }
    if (ledDtFim.value < ledDtInicio.value) {
        toastr.error('A data final não pode ser anterior à data inicial!');
        return;
    }
    if (!ledCampanha.value.trim()) {
        toastr.error('Informe o nome da campanha!');
        return;
    }

    submittingLed.value = true;
    axios.post('/ReservaLed', {
        cliente_id: Number(cliId),
        painel_id: Number(ledPainelId.value),
        dt_inicio: ledDtInicio.value,
        dt_fim: ledDtFim.value,
        campanha: ledCampanha.value.trim(),
        obs: ledObs.value.trim(),
    })
        .then(res => {
            if (res.data?.cod === 1) {
                toastr.success(res.data?.msg || 'Reserva do LED realizada com sucesso!');
                modalAddOpen.value = false;
                carregarReservasLed();
            } else {
                toastr.error(res.data?.msg || 'Erro ao realizar reserva do LED');
            }
        })
        .catch(err => {
            toastr.error(err.response?.data?.msg || 'Falha ao salvar reserva do LED');
        })
        .finally(() => {
            submittingLed.value = false;
        });
}

function abrirModalExtensao(reserva) {
    reservaParaExtender.value = reserva;
    const fimAtual = reserva.dt_fim ? new Date(reserva.dt_fim + 'T00:00:00') : new Date();
    fimAtual.setDate(fimAtual.getDate() + 30);
    const yyyy = fimAtual.getFullYear();
    const mm = String(fimAtual.getMonth() + 1).padStart(2, '0');
    const dd = String(fimAtual.getDate()).padStart(2, '0');
    novaDataFim.value = `${yyyy}-${mm}-${dd}`;
    modalExtensaoOpen.value = true;
}

function handleExtenderReserva() {
    if (!reservaParaExtender.value || !novaDataFim.value) {
        toastr.error('Informe a nova data final!');
        return;
    }
    submittingExtensao.value = true;
    axios.post('/ExtenderReservaLed', {
        reserva_id: reservaParaExtender.value.reserva_id,
        nova_data_fim: novaDataFim.value,
    })
        .then(res => {
            if (res.data?.cod === 1) {
                toastr.success(res.data?.msg || 'Reserva estendida com sucesso!');
                modalExtensaoOpen.value = false;
                reservaParaExtender.value = null;
                carregarReservasLed();
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

function confirmarCancelamento(reserva) {
    reservaParaCancelar.value = reserva;
    modalCancelOpen.value = true;
}

function handleCancelarReservaLed() {
    if (!reservaParaCancelar.value) return;
    submittingCancel.value = true;
    axios.post('/CancelaReserva', { reserva_id: reservaParaCancelar.value.reserva_id })
        .then(res => {
            if (res.data?.cod === 1) {
                toastr.success(res.data?.msg || 'Reserva de LED cancelada!');
                modalCancelOpen.value = false;
                reservaParaCancelar.value = null;
                carregarReservasLed();
            } else {
                toastr.error(res.data?.msg || 'Erro ao cancelar reserva');
            }
        })
        .catch(err => {
            toastr.error(err.response?.data?.msg || 'Falha ao cancelar reserva');
        })
        .finally(() => {
            submittingCancel.value = false;
        });
}

function formatDataBR(dateStr) {
    if (!dateStr) return '—';
    const parts = String(dateStr).split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
}

function badgeStatusClasse(statusKey) {
    const map = {
        normal: 'badge-success text-white',
        proximo: 'badge-warning',
        hoje: 'badge-warning animate-pulse',
        encerrado: 'badge-error text-white',
    };
    return map[statusKey] ?? 'badge-info text-white';
}

const reservasFiltradas = computed(() => {
    return reservasLedList.value.filter(r => {
        const term = searchTerm.value.toLowerCase().trim();
        const matchSearch =
            !term ||
            String(r.painel_ident || '').toLowerCase().includes(term) ||
            String(r.cliente_nome || '').toLowerCase().includes(term) ||
            String(r.campanha || '').toLowerCase().includes(term) ||
            String(r.bairro || '').toLowerCase().includes(term);

        let matchStatus = true;
        if (filtroStatus.value !== 'T') {
            matchStatus = r.status_contrato?.status === filtroStatus.value;
        }

        return matchSearch && matchStatus;
    });
});
</script>

<template>
    <Head title="Reserva de LEDs" />

    <AuthenticatedLayout>
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 mx-2 sm:mx-4">
            <!-- Navbar no padrão clássico Vue -->
            <div class="navbar bg-base-100 rounded-box shadow mb-4">
                <div class="flex-1 flex items-center gap-2">
                    <a class="btn btn-ghost text-xl">Reserva de LEDs</a>
                    <div class="badge badge-primary text-white font-bold">{{ reservasFiltradas.length }}</div>
                </div>
                <div class="flex-none gap-2">
                    <a href="/CadastroLeds" class="btn btn-primary btn-sm text-white">
                        Cadastro de LEDs
                    </a>
                    <a href="/MapaOcupacaoLed" class="btn btn-info btn-sm text-white">
                        Mapa de Ocupação
                    </a>
                    <button v-if="criaReserva" class="btn btn-success btn-sm text-white" @click="abrirNovaReserva()">
                        Nova Reserva LED
                    </button>
                </div>
            </div>

            <!-- Filtros no padrão clássico Vue (bg-base-200 p-4 rounded-lg) -->
            <div class="w-full flex flex-wrap items-end gap-4 mb-6 bg-base-200 p-4 rounded-lg">
                <div class="w-full sm:w-5/12 flex flex-col">
                    <label class="label-text mb-1">Pesquisar Reserva</label>
                    <input
                        v-model="searchTerm"
                        type="text"
                        placeholder="Pesquisar por cliente, LED, campanha ou bairro..."
                        class="input input-bordered w-full"
                    />
                </div>

                <div class="w-full sm:w-3/12 flex flex-col">
                    <label class="label-text mb-1">Status da Vigência</label>
                    <select v-model="filtroStatus" class="select select-bordered w-full">
                        <option value="T">Todos</option>
                        <option value="normal">Normal (Vigente)</option>
                        <option value="proximo">Término Próximo</option>
                        <option value="hoje">Vencendo Hoje</option>
                        <option value="encerrado">Encerrado</option>
                    </select>
                </div>

                <div class="w-full sm:w-2/12">
                    <button class="btn btn-primary w-full text-white" @click="carregarReservasLed()">
                        <i class="fa-solid fa-rotate mr-2" :class="{ 'fa-spin': loadingLedList }"></i>
                        Atualizar
                    </button>
                </div>
            </div>

            <!-- Card Principal com Tabela (padrão clássico Vue) -->
            <div class="card w-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="overflow-x-auto border border-base-300 rounded-lg bg-base-100">
                        <table class="table table-sm">
                            <thead>
                                <tr class="bg-base-200">
                                    <th>LED</th>
                                    <th>Cliente</th>
                                    <th>Campanha</th>
                                    <th>Período de Vigência</th>
                                    <th>Status Contrato</th>
                                    <th>Status PI</th>
                                    <th class="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="loadingLedList">
                                    <td colspan="7" class="text-center py-10 text-gray-400">
                                        Carregando reservas de LEDs...
                                    </td>
                                </tr>
                                <tr v-else-if="reservasFiltradas.length === 0">
                                    <td colspan="7" class="text-center py-10 text-gray-400">
                                        Nenhuma reserva de LED encontrada. Clique em <b>Nova Reserva LED</b> para cadastrar.
                                    </td>
                                </tr>
                                <tr v-else v-for="r in reservasFiltradas" :key="r.reserva_id" class="hover">
                                    <td>
                                        <span class="badge badge-primary text-white font-bold mr-2">LED</span>
                                        <span class="font-bold">{{ r.painel_ident }}</span>
                                        <div class="text-[11px] text-gray-500">{{ r.bairro || '—' }}</div>
                                    </td>
                                    <td class="font-semibold">{{ r.cliente_nome || '—' }}</td>
                                    <td>{{ r.campanha || '—' }}</td>
                                    <td>
                                        <span class="badge badge-outline">
                                            {{ formatDataBR(r.dt_inicio) }} até {{ formatDataBR(r.dt_fim) }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge badge-sm" :class="badgeStatusClasse(r.status_contrato?.status)">
                                            {{ r.status_contrato?.label || 'Normal' }}
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="r.pi_ok" class="badge badge-success badge-sm text-white">Com PI</span>
                                        <span v-else class="badge badge-ghost badge-sm">Sem PI</span>
                                    </td>
                                    <td class="text-center">
                                        <div class="flex items-center justify-center space-x-2">
                                            <button
                                                class="botao bg-yellow-700"
                                                @click="abrirModalExtensao(r)"
                                            >
                                                Estender
                                            </button>
                                            <button
                                                v-if="excluiReserva"
                                                class="botao bg-red-700"
                                                @click="confirmarCancelamento(r)"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- MODAL NOVA RESERVA DE LED (Padrão clássico HeadlessUI) -->
            <TransitionRoot as="template" :show="modalAddOpen">
                <Dialog as="div" class="relative z-50" @close="modalAddOpen = false">
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
                                <DialogPanel class="relative transform overflow-visible rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-6/12 sm:max-w-full sm:p-6">
                                    <div>
                                        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                            <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                                        </div>
                                        <div class="mt-3 text-center sm:mt-5">
                                            <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                                                Nova Reserva Mensal de LED
                                            </DialogTitle>
                                            <p class="mt-1 text-sm text-gray-500">
                                                Selecione o cliente, o painel LED e o período de vigência da reserva.
                                            </p>

                                            <form @submit.prevent="handleSaveReservaLed" class="mt-6 space-y-4 text-left">
                                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label class="label"><span class="label-text">Cliente *</span></label>
                                                        <multiselect
                                                            v-model="clienteSelecionado"
                                                            :options="clientes"
                                                            :custom-label="clienteLista"
                                                            selectLabel="Enter para selecionar"
                                                            :multiple="false"
                                                            :close-on-select="true"
                                                            placeholder="Selecione o Cliente"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label class="label"><span class="label-text">Painel LED *</span></label>
                                                        <select v-model="ledPainelId" class="select select-bordered w-full" required>
                                                            <option :value="0" disabled>Selecione o LED</option>
                                                            <option v-for="l in listaLedsDisponiveis" :key="l.id" :value="l.id">
                                                                LED #{{ l.identificacao }} {{ l.bairro?.nome ? `— ${l.bairro.nome}` : '' }}
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label class="label"><span class="label-text">Data Início da Vigência *</span></label>
                                                        <input type="date" v-model="ledDtInicio" class="input input-bordered w-full" required />
                                                    </div>

                                                    <div>
                                                        <label class="label"><span class="label-text">Data Término da Vigência *</span></label>
                                                        <input type="date" v-model="ledDtFim" class="input input-bordered w-full" required />
                                                    </div>
                                                </div>

                                                <!-- Alerta de Conflito -->
                                                <div
                                                    v-if="checaConflitoLed"
                                                    class="alert text-sm py-2"
                                                    :class="checaConflitoLed.conflito ? 'alert-error text-white' : 'alert-success text-white'"
                                                >
                                                    <span>{{ checaConflitoLed.msg }}</span>
                                                </div>

                                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label class="label"><span class="label-text">Campanha *</span></label>
                                                        <input
                                                            type="text"
                                                            v-model="ledCampanha"
                                                            placeholder="Nome da campanha"
                                                            class="input input-bordered w-full"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label class="label"><span class="label-text">Observações</span></label>
                                                        <input
                                                            type="text"
                                                            v-model="ledObs"
                                                            placeholder="Observações do contrato"
                                                            class="input input-bordered w-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div class="pt-4 flex justify-end gap-2">
                                                    <button type="button" class="btn btn-outline" @click="modalAddOpen = false">
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        class="btn btn-success text-white"
                                                        :disabled="submittingLed || (checaConflitoLed && checaConflitoLed.conflito)"
                                                    >
                                                        {{ submittingLed ? 'Salvando...' : 'Confirmar Reserva' }}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
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
                                        Estender Vigência • LED #{{ reservaParaExtender?.painel_ident }}
                                    </DialogTitle>
                                    <p class="text-sm text-gray-500 mt-1">
                                        Cliente: <b>{{ reservaParaExtender?.cliente_nome }}</b>
                                    </p>

                                    <div class="mt-4 space-y-4">
                                        <div class="p-3 bg-base-200 rounded-md text-sm flex justify-between">
                                            <span>Término Atual:</span>
                                            <b>{{ formatDataBR(reservaParaExtender?.dt_fim) }}</b>
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
                                            @click="handleExtenderReserva()"
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

            <!-- MODAL CANCELAR RESERVA -->
            <TransitionRoot as="template" :show="modalCancelOpen">
                <Dialog as="div" class="relative z-50" @close="modalCancelOpen = false">
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
                                    <div class="sm:flex sm:items-start">
                                        <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                                                Cancelar Reserva de LED
                                            </DialogTitle>
                                            <div class="mt-2">
                                                <p class="text-sm text-gray-500">
                                                    Deseja realmente cancelar a reserva do <b>LED #{{ reservaParaCancelar?.painel_ident }}</b> para o cliente <b>{{ reservaParaCancelar?.cliente_nome }}</b>?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                                        <button
                                            type="button"
                                            class="btn btn-error btn-sm text-white"
                                            :disabled="submittingCancel"
                                            @click="handleCancelarReservaLed()"
                                        >
                                            {{ submittingCancel ? 'Cancelando...' : 'Sim, Cancelar' }}
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-outline btn-sm"
                                            @click="modalCancelOpen = false"
                                        >
                                            Voltar
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
