<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';

import TabelaLancamentos from './TabelaLancamentos.vue';


</script>

<template>
    <div class="w-full h-4/6 flex-col flex-wrap justify-start">

        <!-- Cabeçalho e barra de Pesquisa -->
        <div class="w-full h-[5%] sm:flex">
            <div class="w-full h-10 flex justify-center ">
                <h1 class="text-2xl  font-bold">Lançamentos</h1>
            </div>
        </div>

        <!-- Cadastro de Centros de Custo -->
        <div class="w-[98%] sm:w-[99%] h-[68vh] flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div class="w-[98%] sm:w-5/12 h-[80%] sm:flex flex-col border border-slate-300 rounded-lg p-4 space-y-4">

                <input type="text" placeholder="Descrição curta do Lançamento" class="input input-bordered w-full " />

                <input type="text" placeholder="Valor do Lançamento" class="input input-bordered w-full " />

                <input type="text" placeholder="Data Lançamento" class="input input-bordered w-full " />

                <div class="w-full flex justify-between space-x-2">
                    <select class="select select-bordered w-6/12 max-w-xs">
                        <option disabled selected>Centro de Custo</option>
                        <option>Han Solo</option>
                        <option>Greedo</option>
                    </select>

                    <select class="select select-bordered w-6/12 max-w-xs">
                        <option disabled selected>Tipo de Lançamento</option>
                        <option>Han Solo</option>
                        <option>Greedo</option>
                    </select>
                </div>

                <div class="w-full flex">
                    <textarea class="w-full textarea textarea-bordered" placeholder="Observações"></textarea>
                </div>

                <label class="btn btn-primary text-white w-full mt-4">
                    Adicionar Lançamento
                </label>

            </div>

            <div class="w-[98%] sm:w-7/12 h-[98%] sm:flex flex-wrap border border-slate-300 rounded-lg overflow-x-auto">

                <!-- Tabela de Centros de Custo -->
                <TabelaLancamentos />


            </div>

        </div>

    </div>

</template>

