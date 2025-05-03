<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, computed } from 'vue';
import { defineProps } from 'vue';

import GridComissaoServ from './Components/Comissoes/Servico/GridComissaoServ.vue';
import GridComissaoUsu from './Components/Comissoes/Usuario/GridComissaoUsu.vue';


const props = defineProps(['servicos', 'usuarios', 'funcoes', 'comissoes'])

const open = ref(false)

const tipo = ref('cSer')



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
    <Head title="Comissões" />

    <AuthenticatedLayout>
        <div class="w-full h-[90vh] pt-8 sm:pt-24 pb-32 mx-2 md:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex flex-col sm:flex-row mb-2 space-y-4">
                <div class="w-full sm:w-2/12 h-14 flex items-center justify-center">
                    <h1 class="text-xl md:text-4xl font-bold">Comissões</h1>
                    <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4"></h1>
                </div>
                
                <div class="w-full sm:w-2/12 flex justify-center items-center space-x-2"> 
                    <label class="label">
                        <span class="label-text text-lg font-medium">Tipo:</span>
                    </label>

                    <select v-model="tipo"
                    class="select select-bordered w-8/12">
                        <option value="cSer">Comissões por Serviço</option>
                        <option value="cUsu">Comissões por Agente</option>
                    </select>
                </div>
                
            </div>

            <div class="w-full md:w-4/12">

            </div>

            <!-- Card dos Clientes -->
            <div class="card w-full max-h-[80vh] bg-base-100 shadow-xl rounded-md mt-10">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap md:flex-row">
                        <component :is="tipo == 'cSer' ? GridComissaoServ : GridComissaoUsu" 
                                    :servicos="servicos" 
                                    :openAdd="open" 
                                    :usuarios="usuarios"
                                    :funcoes="funcoes"
                                    :comissoes="comissoes"
                                    @closeAdd="openAdd" >

                        </component>
                    </div>
                </div>
            </div>
            
        </div> 
    </AuthenticatedLayout>
</template>



