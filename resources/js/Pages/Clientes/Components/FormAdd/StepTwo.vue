<script setup>

import { ref, onMounted } from 'vue';

import { vMaska } from "maska";

const bairros = ref([]);
const cidades = ref([]);
const ufs = ref([]);


onMounted(() => {
    axios.get('/dtGetBairros')
    .then((res) => {
        bairros.value = res.data
    })

    axios.get('/dtGetCidades')
    .then((res) => {
        cidades.value = res.data
    })

    axios.get('/dtGetUf')
    .then((res) => {
        ufs.value = res.data

    })
})

</script>


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8">
       
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full sm:w-6/12">
                <label for="endereco" class="block text-sm font-medium leading-6 text-gray-900">Endereço</label>
                <div class="mt-2">
                    <input type="text" name="endereco" id="endereco" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

            <div class="w-full sm:w-1/12">
                <label for="numero" class="block text-sm font-medium leading-6 text-gray-900">Número</label>
                <div class="mt-2">
                    <input type="text" name="numero" id="numero" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

            <div class="w-full sm:w-3/12">
                <label for="bairro" class="block text-sm font-medium leading-6 text-gray-900">Bairro</label>
                <div class="mt-2">
                    <select id="bairro" name="bairro" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option v-for="(bai, index) in bairros" :key="index" :value="bai.id">{{ bai.nome }}</option>
                        
                    </select>
                </div>
            </div>
        </div>


        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full sm:w-4/12">
                <label for="cidade" class="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
                <div class="mt-2">
                    <select id="cidade" name="cidade" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option v-for="(cid, index) in cidades" :key="index" :value="cid.id">{{ cid.nome }}</option>
                    </select>
                </div>
            </div>

            <div class="w-full sm:w-3/12">
                <label for="uf" class="block text-sm font-medium leading-6 text-gray-900">UF</label>
                <div class="mt-2">
                    <select id="uf" name="uf" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option v-for="(uf, index) in ufs" :key="index" :value="uf.id">{{ uf.nome }}</option>
                    </select>
                </div>
            </div>

            <div class="w-full sm:w-3/12">
                <label for="cep" class="block text-sm font-medium leading-6 text-gray-900">CEP</label>
                <div class="mt-2">
                    <input type="text" 
                        name="cep" 
                        id="cep" 
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                        v-maska
                        data-maska="##.###-###"
                    />
                </div>
            </div>

        </div>

    </div>
</template>