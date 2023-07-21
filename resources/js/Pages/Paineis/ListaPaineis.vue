<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';

const props = defineProps(['paineis'])

const pesqPainel = ref('');

const paineisFiltrados = computed(() => {
    let paineisFiltrados = Object.values(props.paineis).filter((painel) => {
        return (
            String(painel.ponto_referencia).toLowerCase().indexOf(pesqPainel.value.toLowerCase()) > -1
        );
    })

    return paineisFiltrados;
});

function getImage(i) {
    // var image = '../../../../storage/app/public/'+ i
    var image = '/storage/app/public/'+ i

    return image
}


</script>

<template>
    <Head title="Painéis" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-2/12 h-14 flex items-center">
                    <h1 class="text-xl md:text-4xl font-bold">Painéis</h1>
                    <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4">{{ paineis.length }}</h1>
                </div>
                
                <div class="w-10/12 flex justify-end">
                    <label for="modal-cliente-add" class="w-28 botao-modal text-sm ">+ Novo Painel</label>
                </div>
                
            </div>
            <div class="w-full md:w-4/12">
                <input v-model="pesqPainel" placeholder="Pesquisar Painel" class="w-full h-10 input input-bordered rounded-none mb-4" type="text" name="pesquisar" id="pesquisar">
            </div>

            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap md:flex-row justify-center">
                   
                        <div v-for="(pain, index) in paineisFiltrados" :key="index" class="card w-full md:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 md:mr-4">
                            <label for="modal-cliente" @click="setClienteData(pain.id, (pain.logradouro ? pain.logradouro : pain.ponto_referencia))">
                                <div class="card-body">
                                    <div class="w-full flex justify-between flex-wrap mb-4">
                                        <div class="w-full flex justify-between">
                                            <h2 v-if="pain.logradouro === null" class="text-xs md:card-title">Painel.: {{pain.ponto_referencia}}</h2>
                                            <h2 v-else class="text-xs md:card-title">Painel.: {{pain.identificacao}}</h2>
                                            <h2 class="text-xs md:text-base font-bold text-zinc-400">ID: {{pain.id}}</h2>
                                        </div>
                                    </div>

                                    <div class="w-full flex justify-center md:justify-start mb-4 md:mb-0">
                                            <img class="w-20 md:w-32" :src="getImage(pain.image_url)" alt="Bairro">
                                    </div>

                                    <!-- <div class="w-full card-actions justify-center md:justify-end ">
                                        <label for="modal-cliente" @click="setBairroData(pain.id, pain.nome_fantasia)" class="w-full md:w-28 botao-modal">Ações</label>
                                    </div> -->
                                </div>
                            </label>
                        </div>

                    </div>
                </div>
            </div>

          

        </div>
    </AuthenticatedLayout>

</template>

