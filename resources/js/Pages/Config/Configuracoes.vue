<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';


const props = defineProps(['anos'])

const toastr = useToastr();

const ano = ref('');


function addAno() {

    // console.log(ano.value)

    axios.post('/AddAno', {ano: ano.value})
    .then(res => {
        toastr.success(res.data)
    })
    .catch((err) => {
        console.log(err)
    })
}


</script>



<template>
    <Head title="Configurações" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-4/12 h-14 flex items-center">
                    <h1 class="text-xl md:text-4xl font-bold">Configurações Gerais</h1>
                </div>
                
            </div>


            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap md:flex-row justify-start">
                        <label for="modal-ano" class="botao-primario w-fit px-2 flex items-center">Cadastro de Ano</label>
                    </div>
                </div>
            </div>

          
            <!-- Inclusão de novo Cliente -->
            <input type="checkbox" id="modal-ano" class="modal-toggle" />
            <div class="modal flex items-end md:items-center">
                <div class="modal-box">
                    <div class="flex mb-4">
                        <label for="modal-ano" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                        <h3 class="font-bold text-lg">Cadastrar ano</h3>
                    </div>

                    <div class="w-full flex">
                        <div class="w-7/12 flex flex-col p-1">
                            <div class="mb-2 w-10/12">
                                <input v-model="ano" class="w-full input input-bordered rounded-none" type="number" name="insert_ano" id="insert_ano">
                            </div>

                            <div class="w-10/12">
                                <button class="botao-primario w-full" @click="addAno()">Cadastrar</button>
                            </div>
                            
                        </div>

                        <!-- tabela -->
                        <div class="w-5/12">
                            <div class="overflow-y-auto h-40">
                                <table class="w-full table table-zebra">
                                    <!-- head -->
                                    <thead>
                                        <tr>
                                            <th class="w-full bg-black text-white text-center rounded-none">Ano</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(ano, index) in props.anos" :key="index" class="border border-1">
                                            <td>{{ ano.ano_bisemana }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    
                    
                </div>
            </div>

        </div>
    </AuthenticatedLayout>

</template>

