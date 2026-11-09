<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import {ref, reactive, watch, computed, onMounted} from 'vue';
import { useToastr } from '@/Components/toastr';


const props = defineProps(['ambiente',  'anos', 'bisemanas', 'pis'])
const page = usePage();
const toastr = useToastr();

const listaBisemana = ref(0);
const anoAtual = new Date().getFullYear(); // Obtém o ano atual
const idAno = ref(0); // Inicializa a variável reativa
const idBisemana = ref(0);
const listaPi = ref([])
const agrupar = ref(false)
const bsFinal = ref(0)

const criaFinanceiro = page.props.user.permissions.includes('criar financeiro');
const selectedClienteId = ref(null)
const selectedPiId = ref(null)


onMounted(() => {
     // Procura o ID do ano atual na lista de anos disponíveis
     const anoEncontrado = props.anos.find(ano => ano.ano_bisemana == anoAtual);
        if (anoEncontrado) {
            idAno.value = anoEncontrado.id;
        }
})

watch(idAno, (val) => {
    getBisemanas()
})

watch(idBisemana, (val) => {
    getPiBs(val)
})


function getBisemanas() {
    axios.post('/getBisemanas', {anoId: idAno.value})
    .then(res =>{

        listaBisemana.value = Object.values(res.data)
        // bsDisabled.value = false
        idBisemana.value = 0

    })

}

function getPiBs(val) {
    axios.post('/getPiBs', {idBs: val})
     .then(res => {
        listaPi.value = res.data
    })
}

function openPiGerada(val, tipo) {
   if(tipo === 'cli') {
        const pdfPath = `/storage/pdf/pi/pi_cli_${val}`;
        const pdfUrl = window.location.origin + pdfPath;
        window.open(pdfUrl, '_blank');
   } else {
        const pdfPath = `/storage/pdf/pi/pi_fin_${val}`;
        const pdfUrl = window.location.origin + pdfPath;
        window.open(pdfUrl, '_blank');
   }

}

async function openPiGrupo(pi) {
    if (!agrupar.value) return
    if (!idBisemana.value || !bsFinal.value || bsFinal.value <= idBisemana.value) {
        toastr.error('Selecione uma Bi-semana final válida para agrupar')
        return
    }
    const bsIniObj = (listaBisemana.value || []).find(b => b.id === idBisemana.value)
    const bsFimObj = (listaBisemana.value || []).find(b => b.id === bsFinal.value)
    if (!bsIniObj || !bsFimObj || bsIniObj.ano_id !== bsFimObj.ano_id) {
        toastr.error('A Bi-semana final deve ser do mesmo ano da inicial')
        return
    }
    try {
        const resp = await axios.post('/groupPiPdf', { clienteId: pi.id_cliente ?? pi.cliente?.id, bsIni: idBisemana.value, bsFim: bsFinal.value }, { responseType: 'blob' })
        const url = window.URL.createObjectURL(resp.data)
        window.open(url, '_blank')
    } catch (e) {
        let msg = 'Falha ao gerar PDF agrupado'
        try {
            if (e.response && e.response.data) {
                const txt = await new Response(e.response.data).text()
                const j = JSON.parse(txt)
                if (j && j.msg) msg = j.msg
            }
        } catch(_) {}
        toastr.error(msg)
    }
}

async function openPiGrupoTop() {
    if (!agrupar.value) { toastr.error('Ative o Agrupar PIs'); return }
    if (!selectedClienteId.value) { toastr.error('Selecione um cliente na lista'); return }
    if (!idBisemana.value || !bsFinal.value || bsFinal.value <= idBisemana.value) {
        toastr.error('Selecione uma Bi-semana final válida')
        return
    }
    const bsIniObj = (listaBisemana.value || []).find(b => b.id === idBisemana.value)
    const bsFimObj = (listaBisemana.value || []).find(b => b.id === bsFinal.value)
    if (!bsIniObj || !bsFimObj || bsIniObj.ano_id !== bsFimObj.ano_id) {
        toastr.error('A Bi-semana final deve ser do mesmo ano da inicial')
        return
    }
    try {
        const resp = await axios.post('/groupPiPdf', { clienteId: selectedClienteId.value, bsIni: idBisemana.value, bsFim: bsFinal.value }, { responseType: 'blob' })
        const url = window.URL.createObjectURL(resp.data)
        window.open(url, '_blank')
    } catch (e) {
        let msg = 'Falha ao gerar PDF agrupado'
        try {
            if (e.response && e.response.data) {
                const txt = await new Response(e.response.data).text()
                const j = JSON.parse(txt)
                if (j && j.msg) msg = j.msg
            }
        } catch(_) {}
        toastr.error(msg)
    }
}

</script>

<template>
    <Head title="Painéis" />

    <AuthenticatedLayout>
        <div class="w-full h-[90vh] md:pt-20 md:pb-10 mx-2 md:mx-4 over">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-4">
                <div class="sm:w-2/12 h-14 flex items-center">
                    <h1 class="titulo">Pi's Geradas </h1> <p class="text-red-500 font-bold ml-2">{{ pis.length }}</p>
                    <!-- <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4">{{ paineis.length }}</h1> -->
                </div>
            </div>

            <!-- Filtros de Pesquisa -->
            <div class="w-full flex flex-row flex-wrap items-center lg:mb-4">
                <!-- Ano Bi-semana, e CLiente -->
                <div class="w-full lg:w-8/12 flex items-center sm:justify-start flex-wrap lg:flex-nowrap">

                     <!-- Anos -->
                     <div class="w-[23%] lg:w-[11%] flex flex-col me-4 sm:me-6 -mt-6 mb-2">
                        <label for="bi-semana">Ano</label>
                        <select class="select select-bordered" name="ano" id="ano" v-model="idAno" @change="getBisemanas()">
                            <option value="0" selected>Selecione</option>
                            <option v-for="(ano, index) in anos" :key="index" :value="ano.id">{{ ano.ano_bisemana }}</option>
                        </select>
                    </div>

                    <!-- Bi-semanas -->
                    <div class="w-[66%] lg:w-[30%] flex flex-col me-4 sm:me-6 -mt-6 mb-2">
                        <label for="bi-semana">Bi-Semana</label>
                        <select class="select select-bordered" name="bi-semana" id="bi-semama" v-model="idBisemana">
                            <option value="0" selected>Selecione</option>
                            <option v-for="(bs, index) in listaBisemana"
                                :key="index"
                                :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}
                            </option>
                        </select>
                    </div>

                    <!-- Agrupar -->
                    <div class="flex w-[50%] items-center space-x-4 mb-2">
                        <label class="label cursor-pointer space-x-2">
                            <input type="checkbox" class="checkbox checkbox-sm" v-model="agrupar">
                            <span class="label-text">Agrupar PIs</span>
                        </label>
                        <div v-show="agrupar" class="w-[66%] lg:w-[30%] flex flex-col me-4 sm:me-6 -mt-6 mb-2">
                            <label class="label"><span class="label-text">Bi-semana Final</span></label>
                            <select class="select select-bordered" v-model.number="bsFinal">
                                <option :value="0" disabled>Selecione</option>
                                <option v-for="(bs, index) in listaBisemana"
                                        :key="index"
                                        :disabled="bs.id <= idBisemana"
                                        :value="bs.id">
                                    BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone:'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone:'UTC'}) }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card Principal -->
            <div class="card w-full h-full max-h-[68vh] md:max-h-[90vh] bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body flex flex-col">
                    <div v-for="(pi, index) in listaPi" :key="index"
                        class="w-full justify-center h-[15vh] md:h-[10vh] card flex bg-base-100 border border-gray-200 shadow-xl m-2 p-4">
                        <div class="flex">
                            <div class="w-full flex flex-col md:flex-row space-y-6 md:space-y-0">
                                <div class="md:w-3/12">
                                    <p class="text-sm text-gray-600 font-semibold">
                                      Cliente:
                                      <span class="text-red-500 cursor-pointer"
                                            @click="selectedClienteId = (pi.cliente?.id || pi.id_cliente); selectedPiId = pi.id"
                                            :class="{'underline': selectedClienteId === (pi.cliente?.id || pi.id_cliente)}">
                                        {{ pi.cliente.nome_fantasia ? pi.cliente.nome_fantasia : pi.cliente.razao_social }}
                                      </span>
                                      <span v-if="selectedClienteId === (pi.cliente?.id || pi.id_cliente)" class="badge badge-neutral ml-2">Selecionado</span>
                                    </p>
                                </div>

                                <div class="md:w-3/12">
                                    <p class="text-sm text-gray-600 font-semibold">Arquivo:
                                        <span class="text-red-500">{{ pi.arquivo }}</span>
                                    </p>
                                </div>

                                <div class="md:w-4/12">
                                    <p class="text-sm text-gray-600 font-semibold">Campanha:
                                        <span class="text-red-500">{{ pi.campanha }}</span>
                                    </p>
                                </div>

                                <div class="md:w-2/12 space-x-3">
                                    <button tabindex="0" @click="openPiGerada(pi.arquivo, 'cli')" class="btn btn-sm btn-square btn-error text-white tooltip tooltip-top"
                                        data-tip="Baixar PI do Cliente">
                                        <i class="fa-solid fa-user"></i>
                                    </button>

                                    <button v-if="criaFinanceiro" tabindex="0" @click="openPiGerada(pi.arquivo, 'fin')" class="btn btn-sm btn-square btn-info text-white tooltip tooltip-top"
                                        data-tip="Baixar PI do Financeiro">
                                        <i class="fa-solid fa-dollar-sign"></i>
                                    </button>

                                    <button v-if="agrupar && idBisemana && bsFinal && bsFinal > idBisemana"
                                            tabindex="0"
                                            @click="openPiGrupo(pi)"
                                            class="btn btn-sm btn-square btn-primary text-white tooltip tooltip-top"
                                            data-tip="Gerar PDF Agrupado (cliente)">
                                        <i class="fa-solid fa-layer-group"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </AuthenticatedLayout>

</template>
