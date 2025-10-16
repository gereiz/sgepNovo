<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import {ref, reactive, watch, computed, onMounted} from 'vue';
import { useToastr } from '@/Components/toastr';


const props = defineProps(['ambiente',  'anos', 'bisemanas', 'pis'])
const page = usePage();

const listaBisemana = ref(0);
const anoAtual = new Date().getFullYear(); // Obtém o ano atual
const idAno = ref(0); // Inicializa a variável reativa
const idBisemana = ref(0);
const listaPi = ref([])

const criaFinanceiro = page.props.user.permissions.includes('criar financeiro');


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
                <div class="w-full lg:w-6/12 flex items-center sm:justify-start flex-wrap lg:flex-nowrap">

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
                                    <p class="text-sm text-gray-600 font-semibold">Cliente: <span class="text-red-500">{{ pi.cliente.nome_fantasia ? pi.cliente.nome_fantasia : pi.cliente.razao_social }}</span></p>
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
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </AuthenticatedLayout>

</template>

