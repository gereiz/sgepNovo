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
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 mx-2 md:mx-4">
            <div class="navbar bg-base-100 rounded-box shadow mb-4">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl">Serviços</a>
                </div>
                <div class="flex-none">
                    <div class="badge badge-primary">{{ servicos.length }}</div>
                    <button class="btn btn-success btn-sm ml-3" for="modal-cliente-add" @click="openAdd('t')">Novo Serviço</button>
                </div>
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



