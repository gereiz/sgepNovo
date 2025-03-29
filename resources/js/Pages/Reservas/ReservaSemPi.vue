<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import {ref, reactive, watch, computed, onMounted} from 'vue';
import { useToastr } from '@/Components/toastr';
import Multiselect from 'vue-multiselect'
import GridPaineisSemPi from './ComponentsResSemPi/GridPaineisSemPi.vue';
import ModalPiRes from './Components/ModalPiRes.vue';
import axios from 'axios';

const props = defineProps(['ambiente', 'clientes', 'anos', 'bisemanas', 'paineis'])
const page = usePage();

const paineis = ref(props.paineis)
const toastr = useToastr();

const reservas = ref([]);
const itemRefs = ref([])
const checkedPaineis = ref([]);

let idents = reactive([]);

const checkedPaineisId = ref([]);
const listaBisemana = ref(0);

const anoAtual = new Date().getFullYear(); // Obtém o ano atual
const idAno = ref(0); // Inicializa a variável reativa

let idCliente = ref('');
let clienteSel = ref('');
const idBisemana = ref(0);
const reservasCampanha = ref([]);
const reservasIdent = ref([]);

const openP = ref(false)

onMounted(() => {
     // Procura o ID do ano atual na lista de anos disponíveis
     const anoEncontrado = props.anos.find(ano => ano.ano_bisemana == anoAtual);
        if (anoEncontrado) {
            idAno.value = anoEncontrado.id;
        }
})

watch(idAno, () => {
    getBisemanas()
})

watch(idCliente, () => {
    getReservasCli(idBisemana.value)
    clearChecked()
})

const clientesComReserva = computed(() => {
  return props.clientes.filter(cliente =>
    reservas.value.some(reserva => reserva.cliente_id === cliente.id)
  );
});

function clienteLista({id, nome_fantasia, razao_social}) {
    return `${nome_fantasia ? nome_fantasia : razao_social}`
}

function getIdent(val) {
    val.forEach(painel => {

        // idents.push('Painel: '+ painel.identificacao + '; End: '+ painel.logradouro + ' - ' + painel.numero + '; Ref: '+ painel.ponto_referencia + ' - id: ' + painel.id)
        idents.push('Painel: '+ painel.identificacao + '; End: '+ painel.logradouro + ' - ' + painel.numero + '; Ref: '+ painel.ponto_referencia + ' - id:   '+ painel.id)
    });

}

function clearChecked() {
    checkedPaineis.value = [];
    checkedPaineisId.value = [];

    const cardPaineis = itemRefs.value;

    cardPaineis.forEach(painel => {
        painel.checked = false
    })
}

function getBisemanas() {
    axios.post('/getBisemanas', {anoId: idAno.value})
    .then(res =>{

        listaBisemana.value = Object.values(res.data)
        // bsDisabled.value = false
        idBisemana.value = 0
        reservas.value = []
    })
}

function getReservasSemPi(bs) {
    axios.post('/GetResSemPi', {
        bsId: bs,
        cliente: idCliente.value
    })
    .then((res) => {

        reservas.value = res.data.reservas
        paineis.value = res.data.paineis

        idents.length = 0

        if(idents.length == 0) {
            getIdent(paineis.value)
        }
    })
}

function getReservasCli(bs) {
    axios.post('/GetResSemPi', {
        bsId: bs,
        cliente: idCliente.value
    })
    .then((res) => {

        reservas.value = res.data.reservas
        paineis.value = res.data.paineis

        reservasCampanha.value = []
        for (let i = 0; i < reservas.value.length; i++) {
            reservasCampanha.value.push(reservas.value[i].campanha)
        }

        reservasIdent.value = []
        for (let i = 0; i < reservas.value.length; i++) {
            reservasIdent.value.push(reservas.value[i].identificacao)
        }
        
    })
    .catch((err) => {
        reservas.value = []
        // paineis.value = []
        console.log(err)
    })

    getCliente(idCliente.value)
}

function getCliente(val) {
    axios.post('/GetCliente', {cliente:val})
    .then((res) => {
        clienteSel.value = res.data

        // openPi('t')
    })

}

function openPi(val)  {
    if(val == 't') {
        openP.value = true
     } else {
        openP.value = false
     }
}

const getItemsRef = (ev) => {
    itemRefs.vaue = ev

}

const bisemanaSelecionada = computed(() => {

    let bisemanaSelecionada = Object.values(props.bisemanas).filter((bisemana) =>{
        return (bisemana.id === idBisemana.value)
    })

    return bisemanaSelecionada
})


</script>

<template>
    <Head title="Painéis" />

    <AuthenticatedLayout>
        <div class="w-full h-[90vh] md:pt-20 md:pb-10 mx-2 md:mx-4 over">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-4">
                <div class="sm:w-2/12 h-14 flex items-center">
                    <h1 class="titulo">Reservas sem PI: </h1> <p class="text-red-500 font-bold ml-2">{{ reservas.length }}</p>
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
                        <select class="select select-bordered" name="bi-semana" id="bi-semama" v-model="idBisemana" @change="getReservasSemPi(idBisemana)">
                            <option value="0" selected>Selecione</option>
                            <option v-for="(bs, index) in listaBisemana"
                                :key="index"
                                :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}
                            </option>
                        </select>
                    </div>

                     <!-- Clientes -->
                     <div class="w-full lg:w-[35%] flex flex-col sm:-mt-5 me-4 sm:me-6 mb-2">
                        <label for="cliente">Cliente</label>
                        <multiselect :disabled="idBisemana == 0"
                            v-model="idCliente"
                            :options="clientesComReserva"
                            :custom-label="clienteLista"
                            selectLabel="Enter para selecionar"
                            :multiple="false"
                            :close-on-select="true"
                            :show-labels="true"
                            placeholder="Selecione o Cliente"

                        >
                        </multiselect>
                    </div>

                    <!-- Botões -->
                    <div class=" w-full lg:w-[25%] flex justify-center sm:justify-start mt-2 space-x-4 mb-2">

                        <button v-if="idCliente && reservas[0] ? reservas[0].pi_ok == 0 : false"
                                @click="openPi('t')"
                                class="btn btn-square btn-warning text-white -mt-1 tooltip tooltip-left animate-pulse" data-tip="Gerar PI para Reserva">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </button>
                    </div>
                </div>


            </div>
            <!-- {{paineis}} -->
            <!-- Card Principal -->
            <div class="card w-full h-full max-h-[68vh] md:max-h-[90vh] bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body flex flex-col sm:flex-row">
                    <!-- Paineis -->
                    <GridPaineisSemPi :reservas="reservas"
                                        :clientes="clientesComReserva"
                                        :paineis="reservas"
                                        :clienteSel="idCliente"
                                        @itemRefs="getItemsRef"
                                        @clienteSel="getCliente"
                                        @geraPi="openPi">

                    </GridPaineisSemPi>

                    <ModalPiRes :openPi="openP"
                                :cliente="idCliente"
                                :campanha="reservasCampanha"
                                :bisemana="bisemanaSelecionada"
                                :paineis="reservasIdent"
                                :dataReserva="reservaData"
                                @closePi="openPi">
                    </ModalPiRes>
                    

                </div>
            </div>




        </div>
    </AuthenticatedLayout>

</template>

