<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import ModalAddPainCliVue from './Components/ModalAddPainCli.vue';
import { ref, reactive, onMounted, computed } from 'vue';
import { useToastr } from '@/Components/toastr';

const props = defineProps(['ambiente', 'clientes', 'anos', 'bisemanas', 'paineis'])

const paineis = ref(props.paineis)
const toastr = useToastr(); 

const reservas = ref([]);
const itemRefs = ref([])
const checkedPaineis = ref([]);
let idents = reactive([]);

const checkedPaineisId = ref([]);
const listaBisemana = ref(0);
const idAno = ref(0);
let idCliente = ref(0);
let clienteSel = ref('');
const idBisemana = ref(0);


function getIdent(val) {
    val.forEach(painel => {

        // idents.push('Painel: '+ painel.identificacao + '; End: '+ painel.logradouro + ' - ' + painel.numero + '; Ref: '+ painel.ponto_referencia + ' - id: ' + painel.id)
        idents.push('Painel: '+ painel.identificacao + '; End: '+ painel.logradouro + ' - ' + painel.numero + '; Ref: '+ painel.ponto_referencia + ' - id:   '+ painel.id)
    });

}


function atualizaPaineis(ev) {
        idCliente.value = 0
        
        axios.post('/GetPaineisCli', {
        bsId: idBisemana.value,
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


function clearChecked() {
    checkedPaineis.value = [];
    checkedPaineisId.value = [];

    const cardPaineis = itemRefs.value;

    cardPaineis.forEach(painel => {
        painel.checked = false

    })

}


function isChecked(val, painelId, id) {
        const cardPainel = itemRefs.value[val];
            
        let classes = cardPainel.classList

        if(Object.values(checkedPaineis.value).includes(painelId)) {
            checkedPaineis.value.splice(checkedPaineis.value.indexOf(painelId), 1)
            checkedPaineisId.value.splice(checkedPaineis.value.indexOf(id), 1)
            cardPainel.checked = false

        } else {
            checkedPaineis.value.push(painelId);
            checkedPaineisId.value.push(id);
            cardPainel.checked = true

        }


}


function getImage(i) {

    if(props.ambiente == 'local') {
        // Desenvolvimento
        var image = 'http://localhost:8000/storage/'+ i 

    } else {
        // Produção
        var image = '/storage/'+ i 
}

return image
}


function getBisemana() {

    axios.post('/GetBisemanas', {bisemana: idAno.value})
    .then(res =>{

        listaBisemana.value = Object.values(res.data)
        // bsDisabled.value = false
        idBisemana.value = 0
        reservas.value = []

        

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

    })

    axios.post('/GetCliente', {cliente:idCliente})
        .then((res) => {
            clienteSel.value = res.data
    })
}


function cancelaResMulti() {
    
    axios.post('/DelResCliente',  {paineisId: checkedPaineisId.value,
                                    bs: idBisemana.value})
        .then((res) => {
            
            getReservasCli(idBisemana.value)

            if(res.data.cod === 0) {
                toastr.error(res.data.msg)
            } else if(res.data.cod == 1) {
                toastr.success(res.data.msg)
            }

        })

}
 




</script>

<template>
    <Head title="Painéis" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-20 pb-32 mx-2 md:mx-4">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="sm:w-2/12 h-14 flex items-center">
                    <h1 class="titulo">Reservas por Cliente </h1> <p class="text-red-500 font-bold ml-2">{{ reservas.length }}</p>
                    <!-- <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4">{{ paineis.length }}</h1> -->
                </div>
            </div>

            <!-- Filtros de Pesquisa -->
            <div class="w-full flex flex-row flex-wrap items-center justify-center mb-20 sm:mb-0 ">


                <!-- Ano Bi-semana, e CLiente -->
                <div class="w-full flex items-center sm:justify-center flex-wrap">

                     <!-- Anos -->
                     <div class="w-[30%] sm:w-[8%] flex flex-col me-4 sm:me-6">
                        <label for="bi-semana">Ano</label>
                        <select class="select-paineis" name="ano" id="ano" v-model="idAno" @change="idCliente = 0, getBisemana()">
                            <option value="0" selected>Selecione</option>
                            <option v-for="(ano, index) in anos" :key="index" :value="ano.id">{{ ano.ano_bisemana }}</option>
                        </select>
                    </div>

                    <!-- Bi-semanas -->
                    <div class="w-[61%] sm:w-[20%] flex flex-col me-4 sm:me-6">
                        <label for="bi-semana">Bi-Semana</label>
                        <select class="select-paineis" name="bi-semana" id="bi-semama" v-model="idBisemana" @change="idCliente = 0 , getReservas(idBisemana)">
                            <option value="0" selected>Selecione</option>
                            <option v-for="(bs, index) in listaBisemana"
                                :key="index" 
                                :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}
                            </option>
                        </select>
                    </div>

                     <!-- Clientes -->
                     <div class="w-full sm:w-[20%] flex flex-col me-4 sm:me-6">
                        <label for="status">Cliente</label>
                        <select class="select-paineis" name="cliente" id="cliente" v-model="idCliente" :disabled="idBisemana == 0" @change="getReservasCli(idBisemana), clearChecked()">
                            <option value="0" selected>Selecione</option>
                            <option v-for="(cli, index) in clientes" :value="cli.id" :key="index">{{ cli.nome_fantasia ? cli.nome_fantasia : cli.razao_social }}</option>
                        </select>
                    </div>

                    <!-- Botões -->
                    <div class=" w-full sm:w-[20%] flex mt-2 space-x-4">
                        <label v-if="idCliente != 0" @click="clearChecked()" for="modal-add-painel" class="w-fit botao-modal px-2 transition-all duration-1000">Incluir painéis</label>
                        <label v-if="idCliente != 0" for="modal-add-painel" class="w-fit botao-modal bg-slate-700 hover:bg-slate-500 px-2 transition-all duration-1000">Gerar PI</label>
                        <label v-if="idCliente != 0" for="modal-add-painel" class="w-fit botao-modal bg-red-700 hover:bg-red-500 px-2 transition-all duration-1000">Excluir Reserva</label>
                        <label v-if="idCliente != 0 && checkedPaineis.length > 0" for ="modal-canc-res-cli" class="w-fit botao-danger px-2 transition-all duration-1000">Excluir Selecionados</label>
                        
                    </div>
                   

                </div>

            </div>


            <!-- Card Principal -->
            <div class="card w-full h-full max-h-[97%] bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body flex flex-col sm:flex-row">
                    <!-- Painies -->
                    <div class="w-full flex flex-col flex-wrap md:flex-row">
                        
                        <!-- Cards dos Paineis -->
                        <div v-for="(res, index) in reservas " :key="index" class="card w-full sm:w-[30%] card-reserva-cliente">
                            <div class="card-body flex" :id="index" @click="isChecked(index, res.identificacao, res.id)">
                                <div class="w-full -mt-6 flex justify-end">
                                    <input type="checkbox" ref="itemRefs" class="border-0 checkbox checkbox-success"/>
                                </div>
                                <div class="w-full flex">
                                    <div class="w-5/12 mb-4 -ml-6 -mt-4">
                                        <img class="w-36 h-24" :src="getImage(res.image_url)" alt="Foto-painel">
                                    </div>
                                    <div class="w-7/12 mb-4 ml-4 -mt-4 space-y-2">
                                        <span class="font-bold text-sm text-red-500">Painel: </span>
                                        <span class="font-extrabold text-xs"> {{ res.identificacao }} - {{ res.nome_fantasia ? res.nome_fantasia : res.razao_social }}</span>
                                        
                                        <br>
                                        <span class="font-bold text-sm text-red-500">Campanha: </span> <span class="font-extrabold text-xs">{{ res.campanha }}</span> <br>
                                        <span class="font-bold text-sm text-red-500">Obs.: </span> <span class="font-extrabold text-xs">{{ res.obs }}</span>
                                    </div>
                                    
                                   
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>

                </div>
            </div>


            <!-- Inclusão de novos Paineis -->
           <ModalAddPainCliVue :clienteSel="clienteSel" :idents="idents" :idBisemana="idBisemana" @atualizaPage="atualizaPaineis" />

           <!-- Excluir painéis selecionados -->
           <input type="checkbox" id="modal-canc-res-cli" class="modal-toggle" />          
            <div class="modal flex items-end md:items-center">
                <form method="dialog" class="modal-box bg-white">
                    <h3 class="font-black text-2xl animate-pulse duration-200 text-center mb-2">Cancelar Reserva: Painéis {{checkedPaineisId}}</h3>
                    <h3 class="font-black text-2xl text-red-700 animate-pulse duration-200 text-center">ATENÇÃO!</h3>
                    <p class="py-4">Ao cancelar esta reserva, o painel ficará disponível na Bi-semana selecionada, e poderá ser reservado imadiatamente.</p>
                    <p class="py-4 text-center">Confirme somente se tiver certeza do cancelamento!</p>

                    <label for="paineis-del">Painéis Selecionados</label>
                    <textarea class="w-full input input-bordered" type="text" name="paineis-del" id="paineis-del" v-model="checkedPaineis" disabled></textarea>
                
                    <div class="modal-action">
                        <div class="w-full flex justify-center space-x-4">
                            <label @click="cancelaResMulti()" for="modal-canc-res-cli" class="w-5/12 text-sm botao-modal bg-red-700 hover:bg-red-500">Cancelar Painéis</label>
                            <label for="modal-canc-res-cli" class="w-5/12 text-sm botao-modal bg-gray-700 hover:bg-gray-500">Manter Painéis</label>
                        </div>
                    
                    </div>
                </form>
            </div>

        </div>
    </AuthenticatedLayout>

</template>

