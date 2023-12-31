<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import ModalCancRes from '@/Pages/Paineis/Components/ModalCancelRes.vue'
    import ModalWpp from '@/Pages/Paineis/Components/ModalWpp.vue'
    import ModalPiRes from './Components/ModalPiRes.vue';
    import { Head, router } from '@inertiajs/vue3';
    import { getImage, toastr, enviaWpp, getLink } from '@/functions'
    import { ref, reactive, onMounted, computed, watch } from 'vue'
    import Multiselect from 'vue-multiselect'
    
  

    const props = defineProps(['ambiente', 'reservas', 'anos', 'paineis', 'clientes', 'bisemanas', 'cidades', 'regioes', 'bairros', 'whatsapp']);

    const loading = ref(true)

    const linkWpp = ref ('');

    const itemRefs = ref([])
    const checkedPaineis = ref([]);
    const paineisChecked = ref([]);
    const checkedPaineisId = ref([]);
    const pan = ref(props.paineis);
    const idents = reactive([]);
    const listaClientes = ref('');
    const tipoPainel = ref('');

    const cliente = ref ('');

    const bsDisabled = ref(true);
    const statusDisabled = ref(true);
    const regDisabled = ref(true);
    const baiDisabled = ref(true);

    const idAno = ref(0);
    const idBisemana = ref(0);
    const idPainel = ref(0);
    const idCidade = ref(0);
    const idRegiao = ref(0);
    const idBairro = ref(0);

    const bisemana = ref({})

    const listaBisemana = ref(0);
    const listaRegiao = ref(0);
    const listaBairro = ref(0);

    const painelReserva = ref('');
    const valPi = ref(false)
    const confPi = ref(null)
    const hidePiModal = ref(false)

    const open = ref(false);

    const formReserva = reactive({cliente: 0, campanha: '', observ: ''})

    const bisemanaSelecionada = computed(() => {
        
        let bisemanaSelecionada = Object.values(props.bisemanas).filter((bisemana) =>{
            return (bisemana.id === idBisemana.value)
        })

        return bisemanaSelecionada
    })


    onMounted(() => {
        getIdent()

    }) 

    function getBisemana() {

        axios.post('/GetBisemanas', {bisemana: idAno.value})
        .then(res =>{

            listaBisemana.value = Object.values(res.data)
            bsDisabled.value = false
            idBisemana.value = 0

        })


    }


    function getRegiao() {

        axios.post('/GetRegioes', {idCid: idCidade.value})
        .then(res =>{

            listaRegiao.value = Object.values(res.data)

            idRegiao.value = 0
            idBairro.value = 0

        })

    }


    function getBairro() {

        axios.post('/GetBairros', {idReg: idRegiao.value})
        .then(res =>{
            listaBairro.value = Object.values(res.data)

        })

    }


    function getPaineis() {

        if(idBisemana.value === 0) {

            toastr.error('É necessário informar uma Bi-semana')

        } else if(idPainel.value === 0) {

            toastr.error('É necessário informar um Status')

        } else {

            axios.post('/GetPaineis', {ano: idAno.value,
                                   bisemana: idBisemana.value,
                                   statusPainel: idPainel.value,
                                   cidade: idCidade.value,
                                   regiao: idRegiao.value,
                                   bairro: idBairro.value})
            .then(res => {
                pan.value = res.data
                tipoPainel.value = idPainel.value


            })

        }



    }


    function atualizaPaineis(ev) {
        
        getPaineis()
    }


    function getPainelReserva(val) {

        painelReserva.value = val
        listaClientes.value = props.clientes

        if(idBisemana.value === 0) {
           setTimeout(() => {
                toastr.error('É necessário infrmar a Bi-semana Primeiro')
           }, 500);
        }
    }

    
    function isChecked(val, painelId, id, painel) {
        const cardPainel = itemRefs.value[val];
            
        // let classes = cardPainel.classList

        if(Object.values(checkedPaineis.value).includes(painelId)) {
            checkedPaineis.value.splice(checkedPaineis.value.indexOf(painelId), 1)
            paineisChecked.value.splice(paineisChecked.value.indexOf(painel), 1)
            checkedPaineisId.value.splice(checkedPaineisId.value.indexOf(id), 1)
            cardPainel.checked = false
        } else {
            checkedPaineis.value.push(painelId);
            paineisChecked.value.push(painel);
            checkedPaineisId.value.push(id);
            cardPainel.checked = true
        }


        if(checkedPaineis.value.length === 0) {
            paineisChecked.value = []
            checkedPaineisId.value = []
        }


    }


    function checkAll() {
        let i = 0;

        clearChecked();
        
         pan.value.forEach(painel => {
            let cardPainel = itemRefs.value[i];
            
            checkedPaineis.value.push(painel.identificacao);
            paineisChecked.value.push(painel);
            checkedPaineisId.value.push(painel.id);
            cardPainel.checked = true
            i++;
        });
    }


    function clearChecked() {
        checkedPaineis.value = [];
        checkedPaineisId.value = [];
        paineisChecked.value = []

        const cardPaineis = itemRefs.value;
    
        cardPaineis.forEach(painel => {
            painel.checked = false

        })

    }


    function confirmaPI() {

        if(valPi.value) {
            let conf = confPi.value
            hidePiModal.value = true
            conf.showModal()

        }          

    }


    function getIdent() {
        pan.value.forEach(painel => {

            idents.push(painel.identificacao)
        });

    }


    function reservaPainel(pan) {


        axios.post('/ReservaPainel', {clienteId: formReserva.cliente.id,
                                      outdoorId: pan,
                                      bsId: idBisemana.value,
                                      campanha: formReserva.campanha,
                                      obs: formReserva.observ,
                                      checkPi: valPi.value
        })
        .then((res) => {
            if(res.data.cod === 0) {
                toastr.error(res.data.msg)
            } else if(res.data.cod == 1) {
                toastr.success(res.data.msg)


                formReserva.cliente = ''
                formReserva.campanha = ''
                formReserva.observ = ''
                valPi.value = false

                setTimeout(() => {
                    getPaineis()
                }, 500);
            }
        })


    }


    function relDisponiveis(tp) {

        let btn = document.getElementById('envia_lista')
        loading.value = false

        axios.post('/setData', {numBs: idBisemana.value,
                                idPaineis: checkedPaineisId.value,
                                
                                })
            .then((res) => {

                btn.innerHTML = 'Carregando...'

                setTimeout(() => {

                    axios.post('/relDisponiveis', {tpEnvio: tp})
                        .then((res) => {
                            console.log('Relatório gerado')

                            if(tp == 'wpp') {

                                linkWpp.value = res.data

                            } else if(tp == 'pdf') {

                                window.open('/relDisponiveis', '_blank')

                            }


                            btn.innerHTML = 'Enviar Lista'
                            loading.value = true

                        })
                        .catch((err) => {
                            console.log('Relatório não gerado')
                        })

                }, 2000);
            })
            .catch((err) => {
                console.log('Dados não Enviados')
            })




    }

    function openPi(val)  {
        if(val == 't') {
            open.value = true
        } else 
        open.value = false
        
    }


</script>


<template>
    <Head title="Reservas" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 sm:mx-4">
            
            <!-- Cabeçalho -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-2/12 h-14 flex items-center">
                    <h1 class="text-xl sm:text-4xl font-bold">Reservas</h1>
                    <h1 class="text-lg sm:text-2xl text-red-400 font-bold ml-2 sm:ml-4">{{ pan.length }} </h1>
                </div>
                
            </div>

            <!-- Filtros de Pesquisa -->
            <div class="w-full flex flex-row flex-wrap items-center justify-center mb-20 sm:mb-0 ">
 
                <!-- Ano Bi-semana, Status e Identificação -->
                <div class="w-full flex items-center sm:justify-center flex-wrap">

                    <!-- Ano -->
                    <div class="w-5/12 sm:w-1/12 flex flex-col me-4 sm:me-6">
                        <label for="bi-semana">Ano</label>
                        <select class="select-paineis" name="ano" id="ano" v-model="idAno" @change="getBisemana()">
                            <option value="0" selected>Selecione</option>
                            <option v-for="(ano, index) in anos" :key="index" :value="ano.id">{{ ano.ano_bisemana }}</option>
                        </select>
                    </div>

                    <!-- Bi-semanas -->
                    <div class="w-5/12 sm:w-[20%] flex flex-col me-4 sm:me-6">
                        <label for="bi-semana">Bi-Semana</label>
                        <select class="select-paineis" name="bi-semana" id="bi-semama" v-model="idBisemana" :disabled="bsDisabled" @change="idPainel = 0, statusDisabled = false">
                            <option value="0" selected disabled>Selecione</option>
                            <option v-for="(bs, index) in listaBisemana"
                                :key="index" 
                                :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}
                            </option>
                        </select>
                    </div>

                    <!-- Status -->
                    <div class="w-full sm:w-1/12 flex flex-col me-4 sm:me-6">
                        <label for="status">Status</label>
                        <select class="select-paineis" name="status" id="status" :disabled="statusDisabled" v-model="idPainel" @change="getPaineis(), clearChecked()">
                            <option value="0">Todos</option>
                            <option value="1">Disponível</option>
                            <option value="2">Reservado</option>
                        </select> 
                    </div>

                    <!-- Identifcação -->
                    <div class="w-full sm:w-4/12 flex flex-col sm:-mt-4 me-4 sm:me-6">
                        <label class="typo__label">Identificação</label>
                        <div class="w-full flex">
                            <div class="w-9/12 me-4">
                                <multiselect disabled
                                v-model="checkedPaineis"
                                :options="idents"
                                :multiple="true"
                                :searchable="true"
                                :close-on-select="false"
                                :show-labels="false"
                                placeholder="Todos"
                                >
                                </multiselect>  
                            </div>
                            <div class="w-2/12">
                                <button @click="clearChecked()" class="botao max-h-10 bg-red-700 hover:bg-red-500 ">Limpar</button>
                            </div>
                        </div>                
                    </div>
                </div>
                
                <!-- Cidades, Regiões e Bairros -->
                <div class="w-full flex items-center sm:justify-center flex-wrap">

                    <!-- Cidades -->
                    <div class="w-5/12 sm:w-[15%] flex flex-col me-4 sm:me-6">
                        <label for="cidades">Cidades</label>
                        <select class="select-paineis" name="cidades" id="cidades" :disabled="bsDisabled" v-model="idCidade" @change="regDisabled = false, getRegiao()">
                            <option value="0" selectedd>Todas as Cidades</option>
                            <option v-for="(c, index) in cidades" :key="index" :value="c.id">{{ c.nome }}</option>
                        </select>
                    </div>

                    <!-- Regiões -->
                    <div class="w-5/12 sm:w-[13%] flex flex-col me-4 sm:me-6">
                        <label for="regioes">Regiões</label>
                        <select class="select-paineis" name="regioes" id="regioes" :disabled="regDisabled" v-model="idRegiao" @change="baiDisabled = false, getBairro()">
                            <option value="0" selected>Todas as Regiões</option>
                            <option v-for="(r, index) in listaRegiao" :key="index" :value="r.id">{{ r.nome }}</option>
                        </select>
                    </div>

                    <!-- Bairros -->
                    <div class="w-full sm:w-[20%] flex flex-col me-4 sm:me-6">
                        <label for="bairros">Bairros</label>
                        <select class="select-paineis" name="bairros" id="bairros" :disabled="baiDisabled" v-model="idBairro">
                            <option value="0" selected>Todos os Bairros</option>
                            <option v-for="(b, index) in listaBairro" :key="index" :value="b.id">{{ b.nome }}</option>
                        </select>
                    </div>

                    <!-- Botões -->
                    <div class="space-x-4 mt-3.5 mb-2">
                        <button class="botao bg-sky-700 hover:bg-sky-500" @click="getPaineis(), clearChecked()">
                            Filtrar
                        </button>

                        <button v-if="tipoPainel == 1" @click="checkAll()" class="botao w-32 max-h-10 bg-fuchsia-700 hover:bg-fuchsia-500 ">
                            Marcar Todos
                        </button>

                        <div class="dropdown">
                        <label v-if="checkedPaineisId.length > 0 && tipoPainel == 1" tabindex="0" class="w-fit botao flex items-center bg-green-700 hover:bg-green-500 px-2 py-[0.7rem]">
                                <img src="../../../../storage/app/public/img/spinner.png" class="w-4 h-4 me-2 animate-spin" :class="{'hidden': loading}" alt="spinner"> 
                                 <p id="envia_lista">Enviar Lista</p>
                            </label>
                            <ul tabindex="0" class="w-56 -ml-20 sm:-ml-10 dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box mt-4">
                                <li><label @click="relDisponiveis('wpp')" for="modal-wpp">Envio por Whatsapp</label></li>
                                <li><a>Envio por Email</a></li>
                                <li><label @click="relDisponiveis('pdf')">Download do Relatório</label></li>
                            </ul>
                        </div>
                        
                        <!-- <button v-if="checkedPaineisId.length > 1 && tipoPainel == 1" class="botao w-fit px-2 bg-teal-700 hover:bg-teal-500">
                            Reserva Multipla
                        </button> -->
                    </div>
                </div>

            </div>

            <!-- Card Principal -->
            <div class="card w-full max-h-[85%] bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body pt-1 sm:pt-2">
                    <div class="w-full flex flex-col flex-wrap sm:flex-row justify-center">
                        
                        <!-- Cards dos Paineis -->
                        <div v-for="(pain, index) in pan "  :key="index" class="card w-full sm:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4">
                            <div class="card-body" :id="index" @click="isChecked(index, pain.identificacao, pain.id, pain)">
                              <div class="flex justify-between">
                                <img v-if="pain.tipo === '1'" class="w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500" src="../../../../public/storage/img/painel_nobre.png"
                                            alt="Painel Nobre" title="Painel Nobre">
                                <img v-else class="w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500" src="../../../../public/storage/img/painel_conv.png"
                                            alt="Painel Convêncional" title="Painel Convêncional">
                                <h2 class="text-xs sm:card-title text-red-500">Identificação.: {{pain.identificacao}}</h2>
                              </div>
                                <div class="w-full flex justify-end">
                                    <input type="checkbox" ref="itemRefs" class="w-14 h-14 border-0 checkbox checkbox-success" />
                                </div>
                                <div class="w-full flex flex-col items-center">
                                    <div class="w-full mb-4 sm:-ml-4">
                                        <img class="img-painel" :src="getImage(props.ambiente ,pain.image_url)" alt="Bairro">
                                    </div>

                                    <!-- Informações -->
                                    <div class="w-full sm:w-11/12 flex justify-center flex-wrap">
                                        <div class="w-full flex justify-between sm:justify-between flex-wrap space-y-4">
                                            <div class="w-full flex flex-wrap justify-between sm:justify-between">
                                                <h2 class="text-xs sm:card-title">Bairro: {{pain.bnome}}</h2>
                                                <h2 class="text-xs flex sm:card-title hover:text-red-700">Ver Localização 
                                                    <a :href="getLink(pain.latitude, pain.longitude)" target="_blank">
                                                        <img class="w-6 ms-4 sm:w-10 sm:hover:w-14 transition-all duration-500" src="../../../../public/storage/img/regiao.png" alt="Mapa">
                                                    </a> 
                                                </h2>
                                            </div>
                                            <div class="w-full flex flex-wrap justify-between sm:justify-between">
                                                    <h2 class="text-xs sm:card-title">Localização: {{pain.logradouro}} - {{ pain.numero }}</h2>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Botões -->
                            <div class="w-full flex justify-center flex-wrap space-y-2 mb-4">
                                <button class="w-11/12 sm:w-10/12 botao bg-sky-700 hover:bg-sky-500">Detalhes</button>
                                <label for="modal-reserva" v-if="tipoPainel == 1" class="w-11/12 sm:w-10/12 h-10 botao-modal bg-green-700 hover:bg-green-500" @click="getPainelReserva(pain)">
                                    Reservar
                                </label>
                                <label @click="getPainelReserva(pain)" for="modal-canc-reserva" v-if="tipoPainel == 2" class="w-11/12 sm:w-10/12 h-10 botao-modal bg-red-700 hover:bg-red-500">
                                    Cancelar
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Reserva Individual -->
            <input type="checkbox" id="modal-reserva" class="modal-toggle" />          
            <div class="modal flex items-end md:items-center">
                <div class="modal-box">
                    <div class="flex mb-4">
                        <label for="modal-reserva" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="formReserva.cliente = 0">✕</label>
                        <h3 class="font-bold text-lg">Reservar Painel:</h3>
                        <h3 class="font-bold text-lg ml-2 text-red-500">Identificação {{ painelReserva.identificacao }}</h3>
                    </div>

                    <form>  
                        <div class="w-full flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-8">

                            <!-- Bi-semana -->
                            <div class="w-7/12 flex flex-col">
                                <span class="label-text ml-1">Bi-semana</span>
                                <select name="" id="" class="select select-bordered" disabled>
                                    <option v-for="(bs, index) in bisemanaSelecionada" 
                                        :key="index" 
                                        :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString() }} até {{ new Date(bs.fim).toLocaleDateString() }}</option>
                                </select>
                            </div>

                            <!-- Cliente -->
                            <div class="w-full sm:w-6/12 flex flex-col me-4">
                                <span class="label-text ml-1">Cliente</span>
                                <select v-model="formReserva.cliente" name="" id="" class="select select-bordered" :disabled="idBisemana == 0">
                                    <option value="0" selected>Selecione o cliente</option>
                                    <option v-for="(cli, index) in listaClientes" :key="index" :value="cli">{{ cli.nome_fantasia ? cli.nome_fantasia : cli.razao_social }}</option>
                                </select>
                            </div>

                            <!-- Campanha -->
                            <div class="w-full sm:w-5/12 flex flex-col">
                                <span class="label-text ml-1">Campanha</span>
                                <input v-model="formReserva.campanha" type="text" name="" id="" class="input input-bordered" :disabled="idBisemana == 0">
                            </div>

                            <!-- Observação -->
                            <div class="w-full flex flex-col">
                                <span class="label-text ml-1">Mensagem</span>
                                <textarea v-model="formReserva.observ" name="" id="" class="textarea textarea-bordered textarea-lg" :disabled="idBisemana == 0"></textarea>
                            </div>

                            <!-- Verifica a existência de P. I. -->
                            <div class="w-full flex flex-col">
                                <div class="form-control">
                                    <label class="cursor-pointer">
                                        <span class="label-text text-lg sm:text-xl me-4">Existe P. I. para esta reserva?</span>
                                        <input type="checkbox" 
                                               v-model="valPi" 
                                               @click="valPi = !valPi, confirmaPI()" 
                                               class="checkbox checkbox-lg checkbox-success border-2 border-gray-400" 
                                               :disabled="formReserva.cliente === 0"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Botão de Confirmação de Reserva -->
                        <div class="modal-action">
                            <label for="modal-reserva" class="w-full botao-modal" 
                                   :class="{'bg-slate-400': idBisemana == 0, 'hover:bg-slate-400': idBisemana == 0}"
                                   @click="reservaPainel(painelReserva.id)">Reservar</label>
                        </div>
                    </form>

                    <!-- Modal de confirmação de PI -->
                    <dialog id="modal_confirm" ref="confPi" class="bg-transparent flex justify-center" :class="{'hidden': !hidePiModal}">
                        <form method="dialog" class="modal-box bg-white">
                            <h3 class="font-black text-2xl text-red-700 animate-pulse duration-200 text-center">ATENÇÃO!</h3>
                            <p class="py-4">Ao Marcar que existe uma P. I. para esta reserva não será mais possível alterá-la!</p>
                            <p class="py-4">Confirme somente se tiver certeza da reserva.</p>
                            <div class="ModalAddPain-action">

                            <!-- if there is a button in form, it will close the modal -->
                            <div class="w-full flex justify-center space-x-4">
                                <button class="w-5/12 botao-primario" @click="hidePiModal = false, openPi('t')">Confirmar</button>
                                <button @click="valPi = false, hidePiModal = false, openPi('f')" class="w-5/12 botao-danger">Ainda não !</button>   
                            </div>
                            
                            </div>
                        </form>
                    </dialog>
                </div>
            </div>
            
               
            <!-- modal  Whatsapp-->
            <ModalWpp :listaClientes="props.clientes" :whatsapp="props.whatsapp" :bisemana="bisemanaSelecionada" :linkrel="linkWpp" />


            <!-- Modal de cancelamento de Reserva-->
            <ModalCancRes :painel="painelReserva" :bisemana="idBisemana"  @atualizaPage="atualizaPaineis"/>

            <ModalPiRes :openPi="open" 
                        :cliente="formReserva.cliente" 
                        :campanha="formReserva.campanha"
                        :painel="painelReserva"
                        @closePi="openPi"
            />
            

        </div>
    </AuthenticatedLayout>

</template>
