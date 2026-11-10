<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useToastr } from '@/Components/toastr';
import axios from 'axios';

const props = defineProps({
    paineis: { type: Array, default: () => [] },
    ufs: { type: Array, default: () => [] },
});

const page = usePage();
const toastr = useToastr();

const userPermissions = computed(() => page.props.user?.permissions || []);
const criaPainel = computed(() => userPermissions.value.length === 0 || userPermissions.value.includes('criar painel'));
const editaPainel = computed(() => userPermissions.value.length === 0 || userPermissions.value.includes('editar painel'));
const excluiPainel = computed(() => userPermissions.value.length === 0 || userPermissions.value.includes('excluir painel'));

const paineisList = ref([...(props.paineis || [])]);
watch(() => props.paineis, (val) => {
    paineisList.value = [...(val || [])];
});

const pesqPainel = ref('');
const selectedTipo = ref('all');
const selectedRegiao = ref('all');

// Modal de Exclusão
const isDeleteModalOpen = ref(false);
const panelToDelete = ref(null);
const isDeleting = ref(false);

// Modal de Cadastro/Edição
const isFormModalOpen = ref(false);
const modalMode = ref('create');
const activeFormTab = ref(1);
const isSaving = ref(false);

// Dados auxiliares de endereços
const ufsList = ref([...(props.ufs || [])]);
const cidadesList = ref([]);
const bairrosList = ref([]);
const isLoadingCidades = ref(false);
const isLoadingBairros = ref(false);

const formData = reactive({
    idPainel: null,
    ender: '',
    numero: '',
    referencia: '',
    uf: 0,
    cidade: 0,
    bairro: 0,
    latitude: '',
    longitude: '',
    ident: '',
    ident_ant: '',
    cadan: '',
    dim: '9.00 x 3.00',
    dimLona: '',
    posicao: '',
    tipo: '1',
    is_led: 1,
    imagem: null,
    imagemPreview: null,
});

function resetFormData() {
    formData.idPainel = null;
    formData.ender = '';
    formData.numero = '';
    formData.referencia = '';
    formData.uf = 0;
    formData.cidade = 0;
    formData.bairro = 0;
    formData.latitude = '';
    formData.longitude = '';
    formData.ident = String(paineisList.value.length + 1).padStart(3, '0');
    formData.ident_ant = '';
    formData.cadan = '';
    formData.dim = '9.00 x 3.00';
    formData.dimLona = '';
    formData.posicao = '';
    formData.tipo = '1';
    formData.is_led = 1;
    formData.imagem = null;
    formData.imagemPreview = null;
}

onMounted(() => {
    if (!ufsList.value.length) {
        axios.get('/dtGetUfs')
            .then(res => { ufsList.value = res.data || []; })
            .catch(() => {});
    }
});

const ledsOnly = computed(() => {
    return Object.values(paineisList.value).filter(p => Number(p.is_led) === 1 || p.is_led === true);
});

const regioesDisponiveis = computed(() => {
    const setReg = new Set();
    ledsOnly.value.forEach(p => {
        const regNome = p.bairro?.regiao?.nome;
        if (regNome) setReg.add(regNome);
    });
    return Array.from(setReg).sort();
});

const paineisFiltrados = computed(() => {
    return ledsOnly.value.filter(painel => {
        const term = pesqPainel.value.toLowerCase().trim();
        const matchSearch =
            !term ||
            String(painel.identificacao || '').toLowerCase().includes(term) ||
            String(painel.logradouro || '').toLowerCase().includes(term) ||
            String(painel.bairro?.nome || '').toLowerCase().includes(term) ||
            String(painel.bairro?.regiao?.nome || '').toLowerCase().includes(term) ||
            String(painel.cadan || '').toLowerCase().includes(term);

        let matchTipo = true;
        if (selectedTipo.value !== 'all') {
            matchTipo = String(painel.tipo) === String(selectedTipo.value);
        }

        let matchRegiao = true;
        if (selectedRegiao.value !== 'all') {
            matchRegiao = painel.bairro?.regiao?.nome === selectedRegiao.value;
        }

        return matchSearch && matchTipo && matchRegiao;
    });
});

function getImage(i) {
    if (!i) return '/storage/img/painel_nobre.png';
    if (i.startsWith('http://') || i.startsWith('https://') || i.startsWith('/storage/')) return i;
    return '/storage/' + i;
}

async function loadCidades(ufId, selectFirst = false) {
    if (!ufId || ufId == 0) {
        cidadesList.value = [];
        return;
    }
    isLoadingCidades.value = true;
    try {
        const res = await axios.post('/dtGetCidades', { uf: ufId });
        const cidades = res.data || [];
        cidadesList.value = cidades;
        if (selectFirst && cidades.length > 0) {
            formData.cidade = cidades[0].id;
            await loadBairros(cidades[0].id);
        }
    } catch (e) {
        console.error(e);
    } finally {
        isLoadingCidades.value = false;
    }
}

async function loadBairros(cidadeId) {
    if (!cidadeId || cidadeId == 0) {
        bairrosList.value = [];
        return;
    }
    isLoadingBairros.value = true;
    try {
        const res = await axios.post('/dtGetBairros', { cidade: cidadeId });
        bairrosList.value = res.data || [];
    } catch (e) {
        console.error(e);
    } finally {
        isLoadingBairros.value = false;
    }
}

function handleOpenCreateModal() {
    modalMode.value = 'create';
    activeFormTab.value = 1;
    resetFormData();
    cidadesList.value = [];
    bairrosList.value = [];
    isFormModalOpen.value = true;
}

async function handleOpenEditModal(panel) {
    modalMode.value = 'edit';
    activeFormTab.value = 1;

    const bairroId = panel.bairro_id || panel.bairro?.id || 0;
    const cidadeId = panel.bairro?.regiao?.cidade_id || panel.bairro?.regiao?.cidade?.id || 0;
    const ufId = panel.bairro?.regiao?.cidade?.uf_id || panel.bairro?.regiao?.cidade?.uf?.id || 0;

    formData.idPainel = panel.id;
    formData.ender = panel.logradouro || '';
    formData.numero = panel.numero || '';
    formData.referencia = panel.ponto_referencia || '';
    formData.uf = ufId || 0;
    formData.cidade = cidadeId || 0;
    formData.bairro = bairroId || 0;
    formData.latitude = panel.latitude || '';
    formData.longitude = panel.longitude || '';
    formData.ident = panel.identificacao || '';
    formData.ident_ant = panel.ident_antiga || '';
    formData.cadan = panel.cadan || '';
    formData.dim = panel.dimensao || '9.00 x 3.00';
    formData.dimLona = '';
    formData.posicao = panel.posicao || '';
    formData.tipo = panel.tipo ? String(panel.tipo) : '1';
    formData.is_led = 1;
    formData.imagem = null;
    formData.imagemPreview = panel.image_url ? getImage(panel.image_url) : null;

    if (ufId) await loadCidades(ufId);
    if (cidadeId) await loadBairros(cidadeId);

    isFormModalOpen.value = true;
}

function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (file) {
        formData.imagem = file;
        formData.imagemPreview = URL.createObjectURL(file);
    }
}

function avancarParaStep2() {
    if (!formData.ender.trim()) {
        toastr.error('O campo Endereço é obrigatório!');
        return;
    }
    if (!formData.numero.trim()) {
        toastr.error('O campo Número é obrigatório!');
        return;
    }
    if (!formData.uf || formData.uf == 0) {
        toastr.error('É necessário selecionar uma UF!');
        return;
    }
    if (!formData.cidade || formData.cidade == 0) {
        toastr.error('É necessário selecionar uma Cidade!');
        return;
    }
    if (!formData.bairro || formData.bairro == 0) {
        toastr.error('É necessário selecionar um Bairro!');
        return;
    }
    activeFormTab.value = 2;
}

async function handleSavePainel() {
    if (!String(formData.ident).trim()) {
        toastr.error('O campo Identificação é obrigatório!');
        return;
    }
    if (!formData.cadan.trim()) {
        toastr.error('O campo CADAN é obrigatório!');
        return;
    }
    if (!formData.dim.trim()) {
        toastr.error('O campo Dimensão é obrigatório!');
        return;
    }
    if (!formData.posicao.trim()) {
        toastr.error('O campo Posição é obrigatório!');
        return;
    }
    if (modalMode.value === 'create' && !formData.imagem) {
        toastr.error('O campo Imagem é obrigatório!');
        return;
    }

    isSaving.value = true;
    try {
        const dataPayload = new FormData();
        dataPayload.append('dados[sOne][ender]', formData.ender);
        dataPayload.append('dados[sOne][numero]', formData.numero);
        dataPayload.append('dados[sOne][referencia]', formData.referencia || '');
        dataPayload.append('dados[sOne][uf]', formData.uf);
        dataPayload.append('dados[sOne][cidade]', formData.cidade);
        dataPayload.append('dados[sOne][bairro]', formData.bairro);
        dataPayload.append('dados[sOne][latitude]', formData.latitude || '');
        dataPayload.append('dados[sOne][longitude]', formData.longitude || '');

        if (formData.idPainel) {
            dataPayload.append('dados[sTwo][idPainel]', formData.idPainel);
        }
        dataPayload.append('dados[sTwo][ident]', formData.ident);
        dataPayload.append('dados[sTwo][ident_ant]', formData.ident_ant || '');
        dataPayload.append('dados[sTwo][cadan]', formData.cadan);
        dataPayload.append('dados[sTwo][dim]', formData.dim);
        dataPayload.append('dados[sTwo][dimLona]', '');
        dataPayload.append('dados[sTwo][posicao]', formData.posicao);
        dataPayload.append('dados[sTwo][tipo]', formData.tipo);
        dataPayload.append('dados[sTwo][is_led]', 1);

        if (formData.imagem) {
            dataPayload.append('dados[sTwo][imagem]', formData.imagem);
        } else {
            dataPayload.append('dados[sTwo][imagem]', 'existente');
        }

        await axios.post('/CadPainel', dataPayload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        toastr.success(modalMode.value === 'create' ? 'Painel LED cadastrado com sucesso!' : 'Painel LED atualizado com sucesso!');
        isFormModalOpen.value = false;
        router.reload({ preserveScroll: true });
    } catch (err) {
        toastr.error(err.response?.data?.message || 'Erro ao salvar dados do Painel LED.');
    } finally {
        isSaving.value = false;
    }
}

function handleConfirmDelete(panel) {
    panelToDelete.value = panel;
    isDeleteModalOpen.value = true;
}

async function executeDeletePainel() {
    if (!panelToDelete.value) return;
    isDeleting.value = true;
    try {
        await axios.post('/DelPainel', { idPainel: panelToDelete.value.id });
        toastr.success('Painel LED excluído com sucesso!');
        paineisList.value = paineisList.value.filter(p => p.id !== panelToDelete.value.id);
        isDeleteModalOpen.value = false;
        panelToDelete.value = null;
        router.reload({ preserveScroll: true });
    } catch (err) {
        toastr.error('Não foi possível excluir este painel LED.');
    } finally {
        isDeleting.value = false;
    }
}
</script>

<template>
    <Head title="Cadastro de LEDs" />

    <AuthenticatedLayout>
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 mx-2 sm:mx-4">
            <!-- Navbar no padrão clássico Vue (ListaPaineis.vue) -->
            <div class="navbar bg-base-100 rounded-box shadow mb-4">
                <div class="flex-1 flex items-center gap-2">
                    <a class="btn btn-ghost text-xl">Cadastro de LEDs</a>
                    <div class="badge badge-primary text-white font-bold">{{ paineisFiltrados.length }}</div>
                </div>
                <div class="flex-none gap-2">
                    <a href="/ReservaLeds" class="btn btn-primary btn-sm text-white">
                        <i class="fa-regular fa-calendar-check mr-1"></i> Reserva de LEDs
                    </a>
                    <a href="/MapaOcupacaoLed" class="btn btn-info btn-sm text-white">
                        <i class="fa-solid fa-table-cells mr-1"></i> Mapa de Ocupação
                    </a>
                    <button v-if="criaPainel" class="btn btn-success btn-sm text-white" @click="handleOpenCreateModal()">
                        Novo LED
                    </button>
                </div>
            </div>

            <!-- Barra de Pesquisa e Filtros no padrão clássico Vue -->
            <div class="w-full flex flex-wrap items-end gap-4 mb-4">
                <div class="w-full sm:w-4/12">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Pesquisar Painel LED</span>
                        </label>
                        <input
                            v-model="pesqPainel"
                            placeholder="Pesquisar por código, bairro ou endereço"
                            class="input input-bordered"
                            type="text"
                        />
                    </div>
                </div>

                <div class="w-full sm:w-3/12">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Tipo</span>
                        </label>
                        <select v-model="selectedTipo" class="select select-bordered">
                            <option value="all">Todos</option>
                            <option value="1">Painel Nobre</option>
                            <option value="2">Painel Convencional</option>
                        </select>
                    </div>
                </div>

                <div class="w-full sm:w-3/12">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Região</span>
                        </label>
                        <select v-model="selectedRegiao" class="select select-bordered">
                            <option value="all">Todas as Regiões</option>
                            <option v-for="reg in regioesDisponiveis" :key="reg" :value="reg">
                                {{ reg }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Card Principal no padrão clássico Vue (ListaPaineis.vue) -->
            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div v-if="paineisFiltrados.length === 0" class="w-full py-12 text-center text-gray-500">
                        Nenhum painel de LED encontrado. Clique em <b>Novo LED</b> para cadastrar.
                    </div>

                    <div v-else class="w-full flex flex-col flex-wrap sm:flex-row justify-center">
                        <!-- Cards dos Paineis LED (idêntico a ListaPaineis.vue) -->
                        <div
                            v-for="(pain, index) in paineisFiltrados"
                            :key="index"
                            class="card w-full sm:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4"
                        >
                            <div class="card-body">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center gap-2">
                                        <img
                                            v-if="String(pain.tipo) === '1'"
                                            class="w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500"
                                            src="../../../../public/storage/img/painel_nobre.png"
                                            alt="Painel Nobre"
                                            title="Painel Nobre"
                                        />
                                        <img
                                            v-else
                                            class="w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500"
                                            src="../../../../public/storage/img/painel_conv.png"
                                            alt="Painel Convencional"
                                            title="Painel Convencional"
                                        />
                                        <span class="badge badge-primary text-white font-bold">LED</span>
                                    </div>
                                    <h2 class="text-xs sm:card-title text-red-500">
                                        Identificação.: {{ pain.identificacao }}
                                    </h2>
                                </div>

                                <div class="w-full flex flex-col items-center">
                                    <div class="w-full mb-4 -ml-4">
                                        <img
                                            class="img-painel"
                                            :src="getImage(pain.image_url)"
                                            alt="Painel LED"
                                            @error="$event.target.src = '/storage/img/painel_nobre.png'"
                                        />
                                    </div>

                                    <div class="w-full sm:w-11/12 flex justify-center flex-wrap mb-2">
                                        <div class="w-full flex justify-between sm:justify-between">
                                            <h2 class="text-xs sm:card-title">Região: {{ pain.bairro?.regiao?.nome || '—' }}</h2>
                                            <h2 class="text-xs sm:card-title">Bairro: {{ pain.bairro?.nome || '—' }}</h2>
                                        </div>
                                    </div>

                                    <div class="w-full sm:w-11/12 text-xs text-gray-600 mb-4 flex flex-wrap justify-between">
                                        <span><b>End.:</b> {{ pain.logradouro }}, {{ pain.numero }}</span>
                                        <span><b>Dimensão:</b> {{ pain.dimensao || '9.00 x 3.00' }}</span>
                                    </div>

                                    <!-- Botões no padrão clássico (.botao bg-yellow-700 / bg-red-700) -->
                                    <div class="w-full sm:w-11/12 flex justify-center flex-wrap space-x-2 mb-4">
                                        <button
                                            v-if="editaPainel"
                                            class="botao bg-yellow-700"
                                            @click="handleOpenEditModal(pain)"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            v-if="excluiPainel"
                                            class="botao bg-red-700"
                                            @click="handleConfirmDelete(pain)"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MODAL CADASTRO / EDIÇÃO (Padrão AddPainel.vue com HeadlessUI) -->
            <TransitionRoot as="template" :show="isFormModalOpen">
                <Dialog as="div" class="relative z-50" @close="isFormModalOpen = false">
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
                                <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-6/12 sm:max-w-full sm:p-6">
                                    <div>
                                        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                            <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                                        </div>
                                        <div class="mt-3 text-center sm:mt-5">
                                            <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                                                {{ modalMode === 'create' ? 'Cadastrar Novo Painel LED' : `Editar Painel LED #${formData.ident}` }}
                                            </DialogTitle>

                                            <!-- ETAPA 1: LOCALIZAÇÃO -->
                                            <div v-if="activeFormTab === 1" class="w-full flex flex-col items-center justify-center space-y-6 mt-4">
                                                <p class="text-sm leading-6 text-gray-600">Preencha os dados de localização do Painel LED.</p>

                                                <div class="w-full flex flex-wrap justify-center gap-4">
                                                    <div class="w-full sm:w-6/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Endereço</label>
                                                        <input
                                                            type="text"
                                                            v-model="formData.ender"
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center mt-1"
                                                        />
                                                    </div>

                                                    <div class="w-full sm:w-2/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Número</label>
                                                        <input
                                                            type="text"
                                                            v-model="formData.numero"
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center mt-1"
                                                        />
                                                    </div>

                                                    <div class="w-full sm:w-3/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Ponto de Referência</label>
                                                        <input
                                                            type="text"
                                                            v-model="formData.referencia"
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center mt-1"
                                                        />
                                                    </div>
                                                </div>

                                                <div class="w-full flex flex-wrap justify-center gap-4">
                                                    <div class="w-full sm:w-3/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">UF</label>
                                                        <select
                                                            v-model="formData.uf"
                                                            @change="formData.cidade = 0; formData.bairro = 0; loadCidades(formData.uf, true)"
                                                            class="select select-bordered w-full mt-1"
                                                        >
                                                            <option :value="0" disabled>Selecione</option>
                                                            <option v-for="uf in ufsList" :key="uf.id" :value="uf.id">
                                                                {{ uf.sigla || uf.nome }}
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div class="w-full sm:w-4/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
                                                        <select
                                                            v-model="formData.cidade"
                                                            :disabled="!formData.uf || isLoadingCidades"
                                                            @change="formData.bairro = 0; loadBairros(formData.cidade)"
                                                            class="select select-bordered w-full mt-1"
                                                        >
                                                            <option :value="0" disabled>Selecione</option>
                                                            <option v-for="c in cidadesList" :key="c.id" :value="c.id">
                                                                {{ c.nome }}
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div class="w-full sm:w-4/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Bairro</label>
                                                        <select
                                                            v-model="formData.bairro"
                                                            :disabled="!formData.cidade || isLoadingBairros"
                                                            class="select select-bordered w-full mt-1"
                                                        >
                                                            <option :value="0" disabled>Selecione</option>
                                                            <option v-for="b in bairrosList" :key="b.id" :value="b.id">
                                                                {{ b.nome }}
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div class="w-full flex flex-wrap justify-center gap-4">
                                                    <div class="w-full sm:w-4/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Latitude</label>
                                                        <input
                                                            type="text"
                                                            v-model="formData.latitude"
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center mt-1"
                                                        />
                                                    </div>

                                                    <div class="w-full sm:w-4/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Longitude</label>
                                                        <input
                                                            type="text"
                                                            v-model="formData.longitude"
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center mt-1"
                                                        />
                                                    </div>
                                                </div>

                                                <div class="w-full flex justify-end gap-3 pt-4">
                                                    <button type="button" class="btn btn-ghost" @click="isFormModalOpen = false">
                                                        Cancelar
                                                    </button>
                                                    <button type="button" class="btn btn-primary text-white" @click="avancarParaStep2()">
                                                        Avançar
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- ETAPA 2: DADOS TÉCNICOS -->
                                            <div v-else class="w-full flex flex-col items-center justify-center space-y-6 mt-4">
                                                <p class="text-sm leading-6 text-gray-600">Preencha os dados técnicos do Painel LED.</p>

                                                <div class="w-full flex flex-wrap justify-center gap-4">
                                                    <div class="w-full sm:w-3/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Identificação</label>
                                                        <input
                                                            type="text"
                                                            v-model="formData.ident"
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center mt-1"
                                                        />
                                                    </div>

                                                    <div class="w-full sm:w-3/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Ident. Antiga</label>
                                                        <input
                                                            type="text"
                                                            v-model="formData.ident_ant"
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center mt-1"
                                                        />
                                                    </div>

                                                    <div class="w-full sm:w-4/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Cadan</label>
                                                        <input
                                                            type="text"
                                                            v-model="formData.cadan"
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center mt-1"
                                                        />
                                                    </div>
                                                </div>

                                                <div class="w-full flex flex-wrap justify-center gap-4">
                                                    <div class="w-full sm:w-3/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Dimensão</label>
                                                        <input
                                                            type="text"
                                                            v-model="formData.dim"
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center mt-1"
                                                        />
                                                    </div>

                                                    <div class="w-full sm:w-3/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Posição</label>
                                                        <input
                                                            type="text"
                                                            v-model="formData.posicao"
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center mt-1"
                                                        />
                                                    </div>

                                                    <div class="w-full sm:w-4/12">
                                                        <label class="block text-sm font-medium leading-6 text-gray-900">Tipo</label>
                                                        <select v-model="formData.tipo" class="select select-bordered w-full mt-1">
                                                            <option value="1">Nobre</option>
                                                            <option value="2">Convencional</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div class="w-full sm:w-10/12">
                                                    <label class="block text-sm font-medium leading-6 text-gray-900 mb-2">Imagem do Painel LED</label>
                                                    <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-6">
                                                        <img
                                                            v-if="formData.imagemPreview"
                                                            :src="formData.imagemPreview"
                                                            class="max-h-40 rounded mb-3 object-contain"
                                                        />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            @change="handleImageChange"
                                                            class="file-input file-input-bordered file-input-sm w-full max-w-xs"
                                                        />
                                                    </div>
                                                </div>

                                                <div class="w-full flex justify-between pt-4">
                                                    <button type="button" class="btn btn-outline" @click="activeFormTab = 1">
                                                        Voltar
                                                    </button>
                                                    <div class="flex gap-2">
                                                        <button type="button" class="btn btn-ghost" @click="isFormModalOpen = false">
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            class="btn btn-success text-white"
                                                            :disabled="isSaving"
                                                            @click="handleSavePainel()"
                                                        >
                                                            {{ isSaving ? 'Salvando...' : 'Salvar LED' }}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>

            <!-- MODAL CONFIRMAÇÃO DE EXCLUSÃO (Padrão DelPainel.vue) -->
            <TransitionRoot as="template" :show="isDeleteModalOpen">
                <Dialog as="div" class="relative z-50" @close="isDeleteModalOpen = false">
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
                                                Excluir Painel LED
                                            </DialogTitle>
                                            <div class="mt-2">
                                                <p class="text-sm text-gray-500">
                                                    Tem certeza que deseja excluir o Painel LED <b>{{ panelToDelete?.identificacao }}</b>? Esta ação não poderá ser desfeita.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                                        <button
                                            type="button"
                                            class="btn btn-error btn-sm text-white"
                                            :disabled="isDeleting"
                                            @click="executeDeletePainel()"
                                        >
                                            {{ isDeleting ? 'Excluindo...' : 'Excluir' }}
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-outline btn-sm"
                                            @click="isDeleteModalOpen = false"
                                        >
                                            Cancelar
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
