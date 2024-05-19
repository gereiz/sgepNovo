<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, computed } from 'vue';
import { defineProps } from 'vue';

import GridServicos from './Components/Servicos/GridServico.vue';

import AddServico from './Components/Servicos/AddServico.vue';

const props = defineProps(['servicos'])

const open = ref(false)

function openAdd(val) {
    if(val === 't') {
        open.value = true
    } else {
        open.value = false

        window.location.reload()
    }
}





</script>

<template>
    <Head title="Serviços" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-2/12 h-14 flex items-center">
                    <h1 class="text-xl md:text-4xl font-bold">Serviços</h1>
                    <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4">{{servicos.length}}</h1>
                </div>
                
                <div class="w-10/12 flex justify-end"> 
                    <label for="modal-cliente-add" class="w-32 botao-modal text-sm" @click="openAdd('t')">+ Novo Serviço</label>
                </div>
                
            </div>
            <div class="w-full md:w-4/12">

            </div>

            <!-- Card dos Clientes -->
            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap md:flex-row justify-center">
                        <GridServicos 
                            :servicos="servicos"
                        >
                        </GridServicos>
                    </div>
                </div>
            </div>

        <AddServico :openAdd="open" @closeAdd="openAdd" >
         
        </AddServico> 
        </div> 
    </AuthenticatedLayout>
</template>



