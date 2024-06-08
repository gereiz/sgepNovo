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
                    <label for="" class="block text-lg font-medium leading-6 text-gray-900">Tipo:</label>

                    <select v-model="tipo"
                    class="block w-8/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="cSer">Comissões por Serviço</option>
                        <option value="cUsu">Comissões por Usuário</option>
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



