<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue'
import Multiselect from 'vue-multiselect'


const props = defineProps(['ambiente', 'reservas', 'paineis', 'bisemanas', 'cidades', 'regioes', 'bairros']);

const idPainel = ref(0);
const itemRefs = ref([])
const pesqPainel = ref('');
const checkedPaineis = ref([]);
const checkedPaineisId = ref([]);
const pan = ref(props.paineis)
const cid = ref(props.cidades)
const idents = reactive([])

const paineisFiltrados = computed(() => {
    let paineisFiltrados = Object.values(props.paineis).filter((painel) => {
        return (
            String(painel.identificacao).toLowerCase().indexOf(pesqPainel.value.toLowerCase()) > -1
        );
    })
    
    return paineisFiltrados;
});


onMounted(() => {
    getIdent()

})


function getImage(i) {

    if(props.ambiente == 'local') {
        // Desenvolvimento
        var image = 'http://[::1]:5173/storage/app/public/'+ i 
   
    } else {
         // Produção
        var image = '/storage/'+ i 
    }
    
    return image
}

function getPaineis() {
    
    axios.post('/GetPaineis', {status: idPainel.value,
                               paineisId: checkedPaineisId.value})
    .then(res => {
        
        // console.log(res.data);
        
        pan.value = res.data
        
    })

}

function clearChecked() {
    checkedPaineis.value = [];
    checkedPaineisId.value = [];

    const cardPaineis = itemRefs.value;
  
    cardPaineis.forEach(painel => {
        // console.log(painel.classList)

    if(Object.values(painel.classList).includes('bg-green-300')) {
        painel.classList.remove('bg-green-300');
    }       
    
    })

}

function getIdent() {
    pan.value.forEach(painel => {

        idents.push(painel.identificacao)
    });

}

function isChecked(val, painelId, id) {
    const cardPainel = itemRefs.value[val];
        
    let classes = cardPainel.classList

    // Transforma o objeto classes em um array, e em seguida busca a classe bg-green
    let clicked = Object.values(classes).find(function(click) {
        return click === 'bg-green-300'
    })

    if(Object.values(checkedPaineis.value).includes(painelId)) {
        checkedPaineis.value.splice(checkedPaineis.value.indexOf(painelId), 1)
        checkedPaineisId.value.splice(checkedPaineis.value.indexOf(id), 1)
        cardPainel.classList.remove('bg-green-300');

    } else {
        checkedPaineis.value.push(painelId);
        checkedPaineisId.value.push(id);
        cardPainel.classList.add('bg-green-300');

    }


}

</script>


<template>
    <Head title="Reservas" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 sm:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-2/12 h-14 flex items-center">
                    <h1 class="text-xl sm:text-4xl font-bold">Reservas {{ checkedPaineisId.sort() }}</h1>
                    <h1 class="text-lg sm:text-2xl text-red-400 font-bold ml-2 sm:ml-4">{{ pan.length }}</h1>
                </div>
                
            </div>

            <!-- Filtros de Pesquisa -->
            <div class="w-full flex flex-row flex-wrap items-center justify-center">

                <!-- Barra de Pesquisa -->
                <div class="w-full sm:w-5/12 me-4">
                    <input v-model="pesqPainel" 
                           placeholder="Pesquisar Painel"
                           class="w-full h-10 input input-bordered rounded-none mb-4"
                           type="text"
                           name="pesquisar"
                           id="pesquisar"
                    >
                </div>
               
                <!-- Bi-semana, Status e Identificação -->
                <div class="w-full flex items-center justify-center flex-wrap">
                    <!-- Bi-semanas -->
                    <div class="w-full sm:w-3/12 flex flex-col me-4 sm:me-6">
                        <label for="bi-semana">Bi-Semana</label>
                        <select class="select-paineis" name="bi-semana" id="bi-semama">
                            <option v-for="(bs, index) in bisemanas"
                                :key="index" 
                                :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString() }} até {{ new Date(bs.fim).toLocaleDateString() }}
                            </option>
                        </select>
                    </div>

                    <!-- Status -->
                    <div class="w-full sm:w-1/12 flex flex-col me-4 sm:me-6">
                        <label for="status">Status</label>
                        <select class="select-paineis" name="status" id="status" v-model="idPainel" @change="getPaineis()">
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
                                @select="getPaineis()"
                                @remove="getPaineis()"
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
                                <button @click="clearChecked()" class="botao max-h-10 bg-red-500">Limpar</button>
                            </div>
                        </div>                
                    </div>
                </div>
                
                <!-- Cidades, Regiões e Bairros -->
                <div class="w-full flex items-center justify-center flex-wrap">
                    <!-- Cidades -->
                    <div class="w-full sm:w-2/12 flex flex-col me-4 sm:me-6">
                        <label for="cidades">Cidades</label>
                        <select class="select-paineis" name="cidades" id="cidades">
                            <option v-for="(c, index) in cidades" :key="index" value="c.id">{{ c.nome }}</option>
                        </select>
                    </div>

                    <!-- Regiões -->
                    <div class="w-full sm:w-2/12 flex flex-col me-4 sm:me-6">
                        <label for="regioes">Regiões</label>
                        <select class="select-paineis" name="regioes" id="regioes" disabled>
                            <option v-for="(r, index) in regioes" :key="index" value="r.id">{{ r.nome }}</option>
                        </select>
                    </div>

                    <!-- Bairros -->
                    <div class="w-full sm:w-2/12 flex flex-col me-4 sm:me-6">
                        <label for="bairros">Bairros</label>
                        <select class="select-paineis" name="bairros" id="bairros" disabled>
                            <option v-for="(b, index) in bairros" :key="index" value="b.id">{{ b.nome }}</option>
                        </select>
                    </div>
                    <div class="space-x-4 mb-2">
                        <button class="botao bg-sky-700">Filtrar</button>
                        <button class="botao bg-green-700 w-fit px-2">Disponibilidade</button>
                        <transition name="fade">
                            <button v-if="checkedPaineisId.length > 1" class="botao transition-all duration-1000 w-fit px-2 bg-orange-600 ">Reserva Múltipla</button>
                        </transition>
                    </div>
                </div>

            </div>

            <!-- Card Principal -->
            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap sm:flex-row justify-center">
                        
                        <!-- Cards dos Paineis -->
                        <div v-for="(pain, index) in paineisFiltrados " ref="itemRefs" :key="index" class="card w-full sm:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4">
                            <label for="modal-cliente">
                                <div class="card-body" :id="index" @click="isChecked(index, pain.identificacao, pain.id), getPaineis()">
                                   <div class="w-full flex flex-col items-center">
                                        <div class="w-full mb-4 -ml-4">
                                            <img class="img-painel" :src="getImage(pain.image_url)" alt="Bairro">
                                        </div>

                                        <!-- Informações -->
                                        <div class="w-full sm:w-11/12 flex justify-center flex-wrap mb-4">
                                            <div class="w-full flex justify-between sm:justify-between flex-wrap space-y-4">
                                                <div class="w-full flex flex-wrap justify-between sm:justify-between">
                                                    <h2 class="text-xs sm:card-title">{{pain.bairro.regiao.cidade.nome}}</h2>
                                                    <h2 class="text-xs sm:card-title">Região: {{pain.bairro.regiao.nome}}</h2>
                                                </div>
                                                <div class="w-full flex flex-wrap justify-between sm:justify-between">
                                                    <h2 class="text-xs sm:card-title">Bairro: {{pain.bairro.nome}}</h2>
                                                    <h2 class="text-xs sm:card-title text-red-500">Identificação.: {{pain.identificacao}}</h2>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Botões -->
                                        <div class="w-full sm:w-11/12 flex justify-center flex-wrap space-x-2 mb-4">
                                            <button class="botao bg-sky-700">Detalhes</button>
                                            <button v-if="idPainel == 1" class="botao bg-green-700">Reservar</button>
                                            <button v-if="idPainel == 2" class="botao w-fit px-2 bg-red-700">Cancelar</button>
                                            <button v-if="idPainel == 0" class="botao bg-red-700">Excluir</button>
                                        </div>

                                   </div>
                                
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

          
        </div>
    </AuthenticatedLayout>

</template>


<style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity 1s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active em versões anteriores a 2.1.8 */ {
        opacity: 0;
    }
</style>
     