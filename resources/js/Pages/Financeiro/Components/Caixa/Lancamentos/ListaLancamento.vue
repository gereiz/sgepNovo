<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { vMaska } from "maska"
import TabelaLancamentos from './TabelaLancamentos.vue';
import { ref, defineProps } from 'vue';
import { useToastr } from '@/Components/toastr';
import AddLancamento from './AddLancamento.vue';

const page = usePage();
const props = defineProps(['centrosCusto', 'lancamentos', 'tipos_lancamento', 'comissoes_por_reserva']);
const toastr = useToastr();
const centrosCusto = ref(props.centrosCusto.filter(centro => centro.id > 1))


const openAdd = () => {

    const dialog = document.getElementById('add_lancamento')
    dialog.showModal()

}


</script>

<template>
    <div class="w-full h-full flex-col flex-wrap justify-start">

        <!-- Cabeçalho e barra de Pesquisa -->
        <div class="w-full h-14 sm:flex ">
            <div class="w-full h-10 flex justify-start items-center">
                <h1 class="text-xl lg:text-2xl  font-bold">Últimos Lançamentos</h1>
            </div>

            <div class="w-full h-10 flex justify-end items-center me-5 space-x-4">
                <label id="add_lancamento_btn" class="btn btn-primary" @click="openAdd()">+ Novo Lançamento</label>
                <a href="/RelLancamentos" class="btn btn-info text-white" @click="">Relatório de Lançamentos</a>
            </div>
        </div>

        <!-- Cadastro de Lançamentos -->
        
        <div class="w-[99%] min-h-[36rem] sm:flex flex-wrap border border-slate-300 rounded-lg overflow-x-auto">

            <!-- Tabela de Centros de Custo -->
            <TabelaLancamentos :centrosCusto="centrosCusto" :lancamentos="lancamentos" :tipos_lancamento="tipos_lancamento" :comissoes_por_reserva="comissoes_por_reserva" />

        </div>

        <AddLancamento :centrosCusto="centrosCusto" :tipos_lancamento="props.tipos_lancamento" />

    </div>

</template>

