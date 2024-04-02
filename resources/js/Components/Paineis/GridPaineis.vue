<!-- Esse Componente recebe uma lista com todos os paineis, tipoPainel e uma bisemana(ID)
    e devolve um checkedPaineis, checkedPaineisId (obrigatórios), campanha e obsevações(oppcionais)-->

<script setup>

    import { ref, reactive, computed, onMounted, watch } from 'vue'
    import { getLink } from '@/functions'
    import { QuestionMarkCircleIcon } from '@heroicons/vue/20/solid'
    import Multiselect from 'vue-multiselect'
    import ConfirmaReserva from './ConfirmaReserva.vue'

    const props = defineProps(['tipoPainel', 'cliente', 'bisemana', 'paineis']);
    const emit = defineEmits(['checkedPaineis', 'checkedPaineisId', 'campanha', 'observacoes']);

    const pesquisaPainel = ref('')

    const cardPainel = ref('')
    const openCampanha = ref('')
    const campanha = ref('')
    const observacoes = ref('')

    const paineis = ref(props.paineis)
    const itemRefs = ref([])
    const checkedPaineis = ref([]);
    const checkedPaineisId = ref([]);
    let idents = reactive([]);

    onMounted(() => {
        getPaineis()
    })

    watch(() => campanha.value, (val) => {
        emit('campanha', campanha.value)
        emit('observacoes', observacoes.value)
    })

    function openCamp(val) {
        if(val === 't') {
            openCampanha.value = true
        } else {
            openCampanha.value = false
        }

    }

    const paineisFiltrados = computed(() => {
        let paineisFiltrados = paineis.value.filter((painel) => {
            return (
                String(painel.identificacao).toLowerCase().indexOf(pesquisaPainel.value.toLowerCase()) > -1
            );
        })
        return paineisFiltrados;
    })

    function isChecked(val, painelId, id) {
        cardPainel.value = itemRefs.value[val];

            // console.log(cardPainel.value)
            
        let classes = cardPainel.classList

        if(Object.values(checkedPaineis.value).includes(painelId)) {
            checkedPaineis.value.splice(checkedPaineis.value.indexOf(painelId), 1)
            checkedPaineisId.value.splice(checkedPaineis.value.indexOf(id), 1)
            // cardPainel.value.checked = false

        } else {
            checkedPaineis.value.push(painelId);
            checkedPaineisId.value.push(id);
            document.getElementById(painelId).classList.add('hidden')

        }
        emit('checkedPaineis', checkedPaineis.value)
        emit('checkedPaineisId', checkedPaineisId.value)


    }

    function getPaineis(){
        axios.post('/GetPaineis', {statusPainel: props.tipoPainel, bisemana: props.bisemana})
        .then((res) => {
            // console.log(res.data)
            paineis.value = res.data
        })
        .catch((err) => {
            console.log(err)
        })
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

    function clearChecked() {
        checkedPaineis.value = [];
        checkedPaineisId.value = [];

        const cardPaineis = itemRefs.value;

        cardPaineis.forEach(painel => {
            // painel.checked = false
            painel.classList.remove('hidden')

    })

    }

    function getCampanha(ev) {
        campanha.value = ev
    }

    function getObservacoes(ev) {
        observacoes.value = ev
    }


</script>



<template>
    
    <div class="w-full flex flex-wrap sm:flex-none mt-2 space-y-4 sm:space-y-0">
        <!-- Barra de pesquisa -->
        <div class="sm:w-4/12 w-full justify-center">
            <div class="w-10/12 ms-10 relative mt-2 rounded-md shadow-sm">
                <input type="text" 
                       v-model="pesquisaPainel"
                       name="pesquisa_painel" 
                       id="pesquisa_painel" class="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                       placeholder="Pesquisar Painel" 
                />
            </div>
        </div>

        <!-- Painéis Selecionados -->
        <div class="sm:w-6/12 w-full justify-center">
            <div class="w-10/12 relative ms-10 sm:ms-0 mt-1 rounded-md shadow-sm">
                <div class="w-full flex">
                    <div class="w-9/12 me-4">
                        <multiselect disabled
                            v-model="checkedPaineis"
                            :options="idents"
                            :multiple="true"
                            :close-on-select="true"
                            :show-labels="true"
                            placeholder="Painéis Selecionados"
                        >
                        </multiselect>  
                    </div>
                    <div class="w-2/12">
                        <button @click="clearChecked()" class="botao max-h-10 bg-red-700 hover:bg-red-500 ">Limpar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Botão de Inclusão de campanha -->
        <div v-if="checkedPaineis.length > 0 && campanha == ''" class="sm:w-1/12 w-full sm:-ms-20 ">
            <button title="Preencher Campanha e Observações" @click="openCamp('t')">
                <QuestionMarkCircleIcon 
                class="-mt-1 w-14 h-14 sm:w-14 sm:h-14 text-red-600 hover:text-red-700 transition-all duration-1000 animate-bounce" 
            />
            </button>
        </div>
        <div v-else-if="checkedPaineis.length > 0 && campanha != ''" class="sm:w-1/12 w-full sm:-ms-20 ">
            <button title="Campanha e Observações preenchidos" @click="openCamp('t')">
                <QuestionMarkCircleIcon 
                class="-mt-1 w-14 h-14 sm:w-14 sm:h-14 text-green-600 hover:text-green-700 transition-all duration-1000 animate-bounce" 
            />
            </button>
        </div>
    </div>

    <!-- Card Principal -->
    <div class="card w-full h-[28rem] sm:h-[36rem] bg-base-100 border border-base-200 shadow-xl overflow-auto rounded-md">
        <div class="card-body flex flex-col sm:flex-row">
            <!-- Paineis -->
            <div class="w-full flex flex-col flex-wrap md:flex-row">
                    <!-- Cards dos Paineis -->
                <div v-for="(pain, index) in paineisFiltrados" :key="index" ref="itemRefs" :id="pain.identificacao" class="card w-full sm:w-[30%] card-reserva-cliente">
                    <div class="card-body flex" :id="index" @click="isChecked(index, pain.identificacao, pain.id)">
                        <div class="w-full flex-col sm:flex sm:flex-wrap">
                            <div class="w-full flex justify-between max-h-8 -mt-4">
                                <img v-if="pain.tipo === '1'" class="mb-2 w-6 h-6 sm:w-8 sm:h-8 sm:hover:w-10 sm:hover:h-10 transition-all duration-1000" src="../../../../public/storage/img/painel_nobre.png"
                                            alt="Painel Nobre" title="Painel Nobre">
                                <img v-else class="mb-2 w-6 h-6 sm:w-8 sm:h-8 sm:hover:w-10 sm:hover:h-10 transition-all duration-1000" src="../../../../public/storage/img/painel_conv.png"
                                            alt="Painel Convêncional" title="Painel Convêncional">
                                <span class="text-xs sm:text-lg font-bold text-red-500">Identificação.: {{pain.identificacao}}</span>
                            </div>
                            
                            <div class="w-full flex flex-wrap sm:flex-nowrap justify-center my-2 sm:-ml-2 space-x-2">
                                <div class="w-full flex justify-center sm:w-6/12">
                                    <img class="w-[240px] h-[140px] hover:scale-150 transition-all duration-1000 rounded-md" :src="getImage(pain.image_url)" alt="Foto-painel">
                                </div>

                                <div class="w-full sm:w-6/12">
                                    <div class="sm:flex flex-wrap ">   
                                        <div class="w-full flex flex-col items-center space-y-3 mt-4 sm:mt-0">
                                            <p class="text-xs sm:text-md font-extrabold">Bairro: {{pain.bnome}}</p>

                                            <p class="text-xs sm:card-md">{{pain.logradouro}} - {{ pain.numero }}</p>

                                            <p class="text-xs sm:text-md hover:text-red-700 sm:ml-4">
                                                Ver Localização     
                                            </p>
                                            <a :href="getLink(pain.latitude, pain.longitude)" target="_blank">
                                                <img class="w-6 h-6 ms-4 -mt-1 sm:hover:w-10 sm:hover:h-10 transition-all duration-500" src="../../../../public/storage/img/regiao.png" alt="Mapa">
                                            </a> 
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <ConfirmaReserva :open="openCampanha" 
                     @closeObs="openCamp"
                     @campanha="getCampanha($event)"
                     @observacoes="getObservacoes($event)" />

</template>