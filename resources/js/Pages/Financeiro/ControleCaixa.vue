<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, computed } from 'vue';
import { defineProps, shallowRef } from 'vue';

import ListaCentroCusto from './Components/Caixa/CentroDeCustos/ListaCentroCusto.vue';
import ListaLancamentos from './Components/Caixa/Lancamentos/ListaLancamento.vue';
import ListaTipoLancamento from './Components/Caixa/TipoLancamento/ListaTipoLancamento.vue';

const props = defineProps(['centros_custo', 'lancamentos', 'tipos_lancamento', 'comissoes_por_reserva'])

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
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 mx-2 md:mx-4">
            <div class="navbar bg-base-100 rounded-box shadow mb-4">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl">Controle de Caixa</a>
                </div>
                <div class="flex-none gap-2">
                    <button class="btn btn-info btn-sm" @click="openPagina('centro-custo')">Centros de Custo</button>
                    <button class="btn btn-accent btn-sm" @click="openPagina('tipo-lancamento')">Tipos de Lançamentos</button>
                    <button class="btn btn-success btn-sm" @click="openPagina('lancamentos')">Lançamentos</button>
                </div>
            </div>


            <!-- Card dos Clientes -->
            <div class="card w-full h-[80vh] sm:h-[75vh] bg-base-100 shadow-xl overflow-auto rounded-md ">
                <div class="mt-4 ml-4">
                    <div class="w-full flex flex-col">

                        <h1 v-if="pagina === ''" class="w-full h-72 flex items-center justify-center text-2xl font-semibold">Selecione uma opção acima</h1>

                        <keep-alive>
                            <component :is="pagina"
                                        :centrosCusto="centros_custo"
                                        :lancamentos="lancamentos"
                                        :tipos_lancamento="tipos_lancamento"
                                        :comissoes_por_reserva="comissoes_por_reserva"

                            >
                            </component>
                        </keep-alive>
                    </div>
                </div>
            </div>

        </div>
    </AuthenticatedLayout>
</template>



