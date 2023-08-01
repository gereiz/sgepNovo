<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue';

const props = defineProps(['ambiente', 'reservas', 'paineis', 'bisemanas', 'cidades', 'regioes', 'bairros']);

const idPainel = ref(0);

var pan = ref(props.paineis)

// onMounted(() =>{

// getPaineis()

// })

// watch( pan, (val) =>{
//     // getPaineis()

// })

function getImage(i) {

    if(props.ambiente == 'local') {
        // Devenvolvimento
        var image = 'http://[::1]:5173/storage/app/public/'+ i 
   
    } else {
         // Produção
        var image = '/storage/'+ i 
    }
    
    return image
}



function getPaineis() {
    
    let pan = ref(props.paineis)

    axios.post('/GetPaineis', {status: idPainel.value})
    .then(res => {

        if(this.pan != undefined) {
            this.pan = res.data
        }
        
    })

}




</script>

<template>
    <Head title="Reservas" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 sm:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-2/12 h-14 flex items-center">
                    <h1 class="text-xl sm:text-4xl font-bold">Reservas</h1>
                    <h1 class="text-lg sm:text-2xl text-red-400 font-bold ml-2 sm:ml-4">{{ pan.length }}</h1>
                </div>
                
            </div>
            
            <div class="w-full flex flex-row flex-wrap items-center justify-center">
              
                <!-- Bi-semanas -->
                <div class="w-full sm:w-3/12 flex flex-col me-4 sm:me-6">
                    <label for="bi-semana">Bi-Semana</label>
                    <select class="select-paineis" name="bi-semana" id="bi-semama">
                        <option v-for="(bs, index) in bisemanas" :key="index" :value="bs.id">Bi-semana: {{ bs.inicio }}</option>
                    </select>
                </div>

                <!-- Status -->
                <div class="w-full sm:w-3/12 flex flex-col me-4 sm:me-6">
                    <label for="status">Status</label>
                    <select class="select-paineis" name="status" id="status" v-model="idPainel" @change="getPaineis()">
                        <option value="0">Todos</option>
                        <option value="1">Disponível</option>
                        <option value="2">Reservado</option>
                    </select>
                </div>

                <!-- Identifcação -->
                <div class="w-full sm:w-3/12 flex flex-col me-4 sm:me-6">
                    <label for="ident">Identificação</label>
                    <select class="select-paineis" name="ident" id="ident">
                        <option v-for="(p, index) in pan" :key="index" :value="p.index">{{ p.identificacao }}</option>
                    </select>
                </div>
                
                <!-- Cidades -->
                <div class="w-full sm:w-3/12 flex flex-col me-4 sm:me-6">
                    <label for="cidades">Cidades</label>
                    <select class="select-paineis" name="cidades" id="cidades">
                        <option v-for="(c, index) in cidades" :key="index" value="c.id">{{ c.nome }}</option>
                    </select>
                </div>

                 <!-- Regiões -->
                 <div class="w-full sm:w-3/12 flex flex-col me-4 sm:me-6">
                    <label for="regioes">Regiões</label>
                    <select class="select-paineis" name="regioes" id="regioes">
                        <option v-for="(r, index) in regioes" :key="index" value="r.id">{{ r.nome }}</option>
                    </select>
                </div>

                <!-- Bairros -->
                <div class="w-full sm:w-3/12 flex flex-col me-4 sm:me-6">
                    <label for="bairros">Bairros</label>
                    <select class="select-paineis" name="bairros" id="bairros">
                        <option v-for="(b, index) in bairros" :key="index" value="b.id">{{ b.nome }}</option>
                    </select>
                </div>

            </div>

            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap sm:flex-row justify-center">
                        
                        <!-- Cards dos Paineis -->
                        <div v-for="(pain, index) in pan" :key="index" class="card w-full sm:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4">
                            <label for="modal-cliente">
                                <div class="card-body">
                                   <div class="w-full flex flex-col items-center">
                                        <div class="w-full mb-4 -ml-4">
                                            <img class="img-painel" :src="getImage(pain.image_url)" alt="Bairro">
                                        </div>


                                        <div class="w-full sm:w-11/12 flex justify-center flex-wrap mb-4">
                                            <div class="w-full flex justify-between sm:justify-between">
                                                <h2 class="text-xs sm:card-title">Região: {{pain.bairro.regiao.nome}}</h2>
                                                <h2 class="text-xs sm:card-title">Bairro: {{pain.bairro.nome}}</h2>
                                                <h2 class="text-xs sm:card-title text-red-500">Identificação.: {{pain.identificacao}}</h2>
                                            </div>
                                        </div>

                                        <!-- Botões -->
                                        <div class="w-full sm:w-11/12 flex justify-center flex-wrap space-x-2 mb-4">
                                            <button class="botao bg-sky-700">Detalhes</button>
                                            <button class="botao bg-yellow-700">Editar</button>
                                            <button class="botao bg-red-700">Excluir</button>
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

