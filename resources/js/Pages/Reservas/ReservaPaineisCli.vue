<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import {ref, reactive, watch, computed, onMounted} from 'vue';
import { useToastr } from '@/Components/toastr';
import AddReserva from './Components/AddReserva.vue';
import DelReserva from "@/Pages/Reservas/Components/DelReserva.vue";
import Multiselect from 'vue-multiselect'
import GridPaineisReserva from "@/Pages/Reservas/Components/GridPaineisReserva.vue";
import ModalPiRes from "@/Pages/Reservas/Components/ModalPiRes.vue";

const props = defineProps(['ambiente', 'clientes', 'anos', 'bisemanas', 'paineis'])
const page = usePage();

const paineis = ref(props.paineis)
const toastr = useToastr();

const criaReserva = page.props.user.permissions.includes('criar reserva');
const excluiReserva = page.props.user.permissions.includes('excluir reserva');

// const cliente = ref('');
const reservas = ref([]);
const itemRefs = ref([])
const checkedPaineis = ref([]);
// const listaClientes = ref(Object.keys(props.clientes).map(nome_fantasia => props.clientes[nome_fantasia]))
let idents = reactive([]);

const checkedPaineisId = ref([]);
const listaBisemana = ref(0);

const anoAtual = new Date().getFullYear(); // Obtém o ano atual
const idAno = ref(0); // Inicializa a variável reativa

let idCliente = ref('');
let clienteSel = ref('');
const idBisemana = ref(0);
const reservaExtensiva = ref(false)
const bsFinal = ref(0)

const open = ref(false)
const openD = ref(false)
const openP = ref(false)

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

watch(idCliente, (val) => {
    getReservasCli(idBisemana.value)
    clearChecked()



})

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

        bsFinal.value = 0
        reservaExtensiva.value = false

    })


}

function getReservas(bs) {

    axios.post('/GetPaineisCli', {
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

    axios.post('/GetPaineisCli', {
        bsId: bs,
        cliente: idCliente.value
    })
    .then((res) => {

        reservas.value = res.data.reservas
        paineis.value = res.data.paineis

        // console.log(res.data)
    })
    .catch((err) => {
        reservas.value = []
        // paineis.value = []
        console.log(err)
    })

    axios.post('/GetCliente', {cliente:idCliente.value})
    .then((res) => {
        clienteSel.value = res.data


    })
}

function openPi(val)  {
    if(val == 't') {
        openP.value = true
    } else
        openP.value = false

}

function openAdd(val) {
    if(val === 't') {
        open.value = true
    } else {
        open.value = false
        getReservasCli(idBisemana.value)
    }
}

const openDel = (val) => {
    if(val === 't') {
        openD.value = true
    } else {
        openD.value = false
        getReservasCli(idBisemana.value)
    }
}

const delReservaPI = () => {
    console.log(checkedPaineisId.value.length, reservas.value.length)

    if(checkedPaineisId.value.length == reservas.value.length) {
        openD.value = true
    } else {
        toastr.error('Painéis com PI só podem ser exlcuídos, se forem todos os painéis da reserva')
    }
}

const getChecked = (ev) => {
    checkedPaineis.value = ev

}

const getCheckedId = (ev) => {
    checkedPaineisId.value = ev
}

const getItemsRef = (ev) => {
    itemRefs.value = ev

}

const bisemanaSelecionada = computed(() => {

    let bisemanaSelecionada = Object.values(props.bisemanas).filter((bisemana) =>{
        return (bisemana.id === idBisemana.value)
    })

    return bisemanaSelecionada
})

const reservasIdent = computed(() => {
    let reservasIdent = reservas.value.map((reserva) => {
        return reserva.identificacao
    })

    return reservasIdent
})

const reservasCampanha = computed(() => {
    let reservasCampanha = reservas.value.map((reserva) => {
        return reserva.campanha
    })

    return reservasCampanha
})

const reservaData = computed(() => {
    let reservaData = reservas.value.map((reserva) => {
        return reserva.dt_reserva
    })

    return reservaData[reservaData.length - 1]
})

const bsIntervalCount = computed(() => {
    if (!reservaExtensiva.value || !idBisemana.value || !bsFinal.value) return 0
    const list = (listaBisemana.value || []).slice().sort((a,b)=>a.id-b.id)
    const idxIni = list.findIndex(b => b.id === idBisemana.value)
    const idxFim = list.findIndex(b => b.id === bsFinal.value)
    if (idxIni === -1 || idxFim === -1 || idxFim <= idxIni) return 0
    return (idxFim - idxIni + 1)
})


</script>

<template>
    <Head title="Painéis" />

    <AuthenticatedLayout>
        <div class="w-full h-screen sm:pt-20 lg:pb-32 mx-2 md:mx-4">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-4">
                <div class="sm:w-2/12 h-14 flex items-center">
                    <h1 class="titulo">Reservas por Cliente </h1> <p class="text-red-500 font-bold ml-2">{{ reservas.length }}</p>
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
                    <div class="w-[66%] lg:w-[23%] flex flex-col me-4 sm:me-6 -mt-6 mb-2">
                        <label for="bi-semana">Bi-Semana</label>
                        <select class="select select-bordered" name="bi-semana" id="bi-semama" v-model="idBisemana" @change="getReservas(idBisemana)">
                            <option value="0" selected>Selecione</option>
                            <option v-for="(bs, index) in listaBisemana"
                                :key="index"
                                :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}
                            </option>
                        </select>
                    </div>

                    <!-- Clientes -->
                    <div class="w-full lg:w-[25%] flex flex-col sm:-mt-5 me-4 sm:me-6 mb-2">
                        <label for="cliente">Cliente</label>
                        <multiselect :disabled="idBisemana == 0"
                            v-model="idCliente"
                            :options="clientes"
                            :custom-label="clienteLista"
                            selectLabel="Enter para selecionar"
                            :multiple="false"
                            :close-on-select="true"
                            :show-labels="true"
                            placeholder="Selecione o Cliente"

                        >
                        </multiselect>
                    </div>

                    <!-- Opção de Reserva Extensiva + Botões -->
                    <div class="w-full lg:w-[40%] lg:flex-1 flex items-center justify-start lg:flex-nowrap flex-wrap space-x-3 mb-2">
                        <div class="flex items-center space-x-2 whitespace-nowrap">
                            <input id="extensiva" type="checkbox" class="checkbox checkbox-sm" v-model="reservaExtensiva" @change="() => { if(!reservaExtensiva) bsFinal = 0 }">
                            <label for="extensiva" class="label cursor-pointer"><span class="label-text">Reserva extensiva</span></label>
                        </div>
                        <div class="w-[66%] lg:w-[70%] flex flex-col me-4 sm:me-6 -mt-6 mb-2" v-show="reservaExtensiva">
                            <label class="label"><span class="label-text">Bi-semana final</span></label>
                            <select class="select select-bordered"
                                    v-model.number="bsFinal">
                                <option :value="0" disabled>Selecione</option>
                                <option v-for="(bs, index) in listaBisemana"
                                        :key="index"
                                        :disabled="bs.id <= idBisemana"
                                        :value="bs.id">
                                    BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}
                                </option>
                            </select>
                        </div>

                        <!-- Criar reserva -->
                        <button v-if="idCliente && criaReserva"
                                :disabled="reservaExtensiva && (bsFinal === 0 || bsFinal <= idBisemana)"
                                :title="reservaExtensiva && (bsFinal === 0 || bsFinal <= idBisemana) ? 'Selecione uma bi-semana final válida' : 'Adicionar Painéis'"
                                @click="clearChecked(), openAdd('t')"
                                class="btn btn-square btn-info text-white -mt-1 tooltip tooltip-left" data-tip="Adicionar Painéis">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <span v-if="reservaExtensiva && bsIntervalCount > 0"
                              class="badge badge-info ml-2 -mt-1 px-3 py-2 whitespace-nowrap text-xs">
                              {{ bsIntervalCount }} BS
                        </span>

                        <!-- Excluir Reserva -->
                        <button v-if="idCliente && checkedPaineis.length > 0 && excluiReserva && reservas[0] ? reservas[0].pi_ok == 0 : false"
                                @click="openDel('t')"
                                class="btn btn-square btn-error text-white -mt-1 tooltip tooltip-left" data-tip="Excluir Painéis">
                            <i class="fa-solid fa-trash"></i>
                        </button>

                        <button v-if="idCliente && checkedPaineis.length > 0 && excluiReserva && reservas[0] ? reservas[0].pi_ok == 1 : false"
                                @click="delReservaPI()"
                                class="btn btn-active btn-square btn-default text-white -mt-1 tooltip tooltip-left"
                                data-tip="Painéis com PI só podem ser exlcuídos, se forem todos os painéis da reserva">
                            <i class="fa-solid fa-trash"></i>
                        </button>

                        <!-- Gerar PI -->
                        <!-- <button v-if="idCliente && reservas[0] ? reservas[0].pi_ok == 1 : false"
                                class="btn btn-square btn-success text-white -mt-1 tooltip tooltip-left" data-tip="Reserva já possui PI">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </button>

                        <button v-if="idCliente && reservas[0] ? reservas[0].pi_ok == 0 : false"
                                @click="openPi('t')"
                                class="btn btn-square btn-warning text-white -mt-1 tooltip tooltip-left animate-pulse" data-tip="Gerar PI para Reserva">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </button> -->
                    </div>
                </div>


            </div>

            <!-- Card Principal -->
            <div class="card w-full h-full max-h-[75%] sm:max-h-[97%] bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body flex flex-col sm:flex-row">
                    <!-- Paineis -->
                    <GridPaineisReserva :reservas="reservas"
                                        @paineisChecked="getChecked"
                                        @paineisCheckedId="getCheckedId"
                                        @itemRefs="getItemsRef">

                    </GridPaineisReserva>


                    <ModalPiRes :openPi="openP"
                                :cliente="clienteSel"
                                :campanha="reservasCampanha"
                                :bisemana="bisemanaSelecionada"
                                :paineis="reservasIdent"
                                :dataReserva="reservaData"
                                @closePi="openPi">
                    </ModalPiRes>

                </div>
            </div>


            <!-- Inclusão de novos Paineis -->
            <AddReserva :openAdd="open"
                        :cliente="idCliente"
                        :paineis="paineis"
                        :bisemana="idBisemana"
                        :extensiva="reservaExtensiva"
                        :bsFinal="bsFinal"
                        @closeAdd="openAdd">
            </AddReserva>


            <!-- Excluir Reserva -->
            <DelReserva :openDel="openD"
                        :bisemana="idBisemana"
                        :cliente="idCliente"
                        :paineis="checkedPaineis"
                        :paineisId="checkedPaineisId"
                        @closeDel="openDel">
            </DelReserva>


        </div>
    </AuthenticatedLayout>

</template>
