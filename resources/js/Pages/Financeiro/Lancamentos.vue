<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, computed } from 'vue';
import { defineProps, shallowRef } from 'vue';

import ListaCentroCusto from './Components/Caixa/CentroDeCustos/AddCentroCusto.vue';
import ListaLancamentos from './Components/Caixa/Lancamentos/AddLancamentos.vue';
import ListaTipoLancamento from './Components/Caixa/TipoLancamento/AddTipoLancamento.vue';

const props = defineProps(['centros_custo', 'lancamentos', 'tipos_lancamento']);


</script> 

<template>
    <Head title="Painel de Lançamentos" />

    <AuthenticatedLayout>
        <div class="w-full h-screen flex flex-col sm:pt-14 sm:pb-32 mx-2 md:mx-4">
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full">
                <div class="w-full h-14 flex justify-center items-center">
                    <h1 class="text-2xl md:text-4xl font-bold sm:mt-4">Painel de Lançamentos</h1>
                </div>
            </div>

            <div class="w-full flex flex-wrap justify-center space-x-2 sm:mt-6">
                <button class="btn  btn-sm btn-primary text-white mt-2 sm:mt-0">Recebimentos</button>
                <button class="btn btn-sm btn-error text-white mt-2 sm:mt-0">Pagamentos</button>
                <button class="btn btn-sm btn-disabled mt-2 sm:mt-0">Transferências</button>
                <!-- <button class="btn btn-sm btn-primary mt-2 sm:mt-0">Recebimentos</button> -->
                <!-- <button class="btn btn-sm btn-primary mt-2 sm:mt-0">Recebimentos</button> -->

            </div>
        </div>
    </AuthenticatedLayout>
</template>



