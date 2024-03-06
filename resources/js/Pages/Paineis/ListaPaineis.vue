<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';
import AddPainel from './Components/AddPainel.vue';

const props = defineProps(['paineis'])

const pesqPainel = ref('');
const open = ref(false);

const painel = ref({});

function openAdd(val) {
    if(val === 't') {
        open.value = true
    } else {
        open.value = false
    }
}

function openEdit(val, id) {
    axios.post('/EditPainel', {idPainel: id})
        .then((res) =>{
           painel.value = res.data

        })
        .catch((err) => {
            console.error(err)
    })

    
    if(val === 't') {
        open.value = true
    } else {
        open.value = false
    }

}

const paineisFiltrados = computed(() => {
    let paineisFiltrados = Object.values(props.paineis).filter((painel) => {
        return (
            String(painel.bairro.nome).toLowerCase().indexOf(pesqPainel.value.toLowerCase()) > -1
        );
    })

    return paineisFiltrados;
});

function getImage(i) {
    // Devenvolvimento
    var image = 'http://localhost:8000/storage/'+ i 

    // Produção
    var image = '/storage/'+ i 

    return image
}


</script>

<template>
    <Head title="Painéis" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-20 sm:pt-4 pb-32 mx-2 sm:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2 pe-3 sm:pe-0">
                <div class="w-2/12 h-14 flex items-center">
                    <h1 class="text-xl sm:text-4xl font-bold">Painéis</h1>
                    <h1 class="text-lg sm:text-2xl text-red-400 font-bold ml-2 sm:ml-4">{{ paineis.length }}</h1>
                </div>
                
                <div class="w-10/12 flex justify-end">
                    <label for="modal-painel-add" class="w-28 botao-modal text-sm " @click="openAdd('t')">+ Novo Painel</label>
                </div>
                
            </div>

            <!-- Barra de Pesquisa -->
            <div class="w-full sm:w-4/12">
                <input v-model="pesqPainel" placeholder="Pesquisar Painel" class="w-full h-10 input input-bordered rounded-none mb-4" type="text" name="pesquisar" id="pesquisar">
            </div>

            <!-- Card Principal -->
            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap sm:flex-row justify-center">
                        
                        <!-- Cards dos Paineis -->
                        <div v-for="(pain, index) in paineisFiltrados" :key="index" class="card w-full sm:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4">
                            <label for="modal-cliente">
                                <div class="card-body">
                                    <div class="flex justify-between">
                                        <img v-if="pain.tipo === '1'" class="w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500" src="../../../../public/storage/img/painel_nobre.png"
                                                    alt="Painel Nobre" title="Painel Nobre">
                                        <img v-else class="w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500" src="../../../../public/storage/img/painel_conv.png"
                                                    alt="Painel Convêncional" title="Painel Convêncional">
                                        <h2 class="text-xs sm:card-title text-red-500">Identificação.: {{pain.identificacao}}</h2>
                                    </div>
                                   <div class="w-full flex flex-col items-center">
                                        <div class="w-full mb-4 -ml-4">
                                            <img class="img-painel" :src="getImage(pain.image_url)" alt="Bairro">
                                        </div>

                                        <div class="w-full sm:w-11/12 flex justify-center flex-wrap mb-4">
                                            <div class="w-full flex justify-between sm:justify-between">
                                                <h2 class="text-xs sm:card-title">Região: {{pain.bairro.regiao.nome}}</h2>
                                                <h2 class="text-xs sm:card-title">Bairro: {{pain.bairro.nome}}</h2>
                                            </div>
                                        </div>

                                        <!-- Botões -->
                                        <div class="w-full sm:w-11/12 flex justify-center flex-wrap space-x-2 mb-4">
                                            <!-- <button class="botao bg-sky-700">Detalhes</button> -->
                                            <button class="botao bg-yellow-700" @click="openEdit('t', pain.id)">Editar</button>
                                            <button class="botao bg-red-700">Excluir</button>
                                        </div>

                                   </div>
                                
                                </div>
                            </label>
                        </div>

                    </div>
                </div>
            </div>

          <addPainel :openAdd="open" @CloseAdd="openAdd" :painel="painel" />

        </div>
    </AuthenticatedLayout>

</template>

