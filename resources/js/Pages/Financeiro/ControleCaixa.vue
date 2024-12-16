<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, computed } from 'vue';
import { defineProps, shallowRef } from 'vue';

import ListaCentroCusto from './Components/Caixa/CentroDeCustos/ListaCentroCusto.vue';
import ListaLancamentos from './Components/Caixa/Lancamentos/ListaLancamentos.vue';
import ListaTipoLancamento from './Components/Caixa/TipoLancamento/ListaTipoLancamento.vue';

const props = defineProps(['centros_custo', 'lancamentos', 'tipo-lancamento'])

const pagina = shallowRef('')

const openPagina = (val) => {
    if(val === 'centro-custo') {
        pagina.value = ListaCentroCusto
    } else if(val === 'lancamentos') {
        pagina.value = ListaLancamentos
    } else if(val === 'tipo-lancamento') {
        pagina.value = ListaTipoLancamento
    }

}




</script>

<template>
    <Head title="Controle de Caixa" />

    <AuthenticatedLayout>
        <div class="w-full h-screen sm:pt-24 sm:pb-32 mx-2 md:mx-4">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-[15%] sm:flex">
                <div class="w-full sm:w-4/12 h-14 flex justify-center sm:justify-start items-center">
                    <h1 class="text-2xl md:text-4xl font-bold sm:mt-4">Controle de Caixa</h1>
                </div>

                <!-- Botões -->
                <div class="w-full sm:w-6/12 flex flex-wrap justify-center sm:justify-start space-x-4 my-4">
                    <label class="w-3/12 sm:w-48 btn btn-success text-white" @click="openPagina('centro-custo')">
                        Centros de Custo
                    </label>
                    <label class="w-3/12 sm:w-48 btn btn-success text-white" @click="openPagina('lancamentos')">
                        Lançamentos
                    </label>
                    <label class="w-3/12 sm:w-48 btn btn-success text-white" @click="openPagina('tipo-lancamento')">
                        Tipos de Lançamentos
                    </label>
                </div>

            </div>


            <!-- Card dos Clientes -->
            <div class="card w-full h-[80vh] sm:h-[75vh] bg-base-100 shadow-xl overflow-auto rounded-md ">
                <div class="mt-4 ml-4">
                    <div class="w-full flex flex-col">

                        <h1 v-if="pagina === ''" class="w-full h-72 flex items-center justify-center text-4xl font-semibold">Selecione uma opção Acima</h1>

                        <keep-alive>
                            <component :is="pagina"
                                        :centrosCusto="centros_custo"
                                        :lancamentos="lancamentos"
                                        :tipo-lancamento="tipo-lancamento"

                            >
                            </component>
                        </keep-alive>
                    </div>
                </div>
            </div>

        </div>
    </AuthenticatedLayout>
</template>



