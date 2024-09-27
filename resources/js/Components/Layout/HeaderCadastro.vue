<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';

const props = defineProps(['titulo', 'dados']);
const emit = defineEmits(['pesquisa']);

const pesqCidade = ref('');

watch(pesqCidade, (newValue, oldValue) => {
    emit('pesquisa', newValue);
});

</script>

<template>
    <div class="w-full h-14 flex justify-between mb-2 -mt-[4.5rem] sm:mt-0">
        <div class="w-4/12 h-14 flex items-center">
            <h1 class="text-xl md:text-4xl font-bold">{{ titulo }} </h1>
            <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4">{{ dados.length }}</h1>
        </div>

        <div class="w-full md:w-4/12 hidden sm:flex items-center justify-center">
            <input v-model="pesqCidade" placeholder="Pesquisar Cidade" class="w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600" type="text" name="pesquisar" id="pesquisar">
        </div>
        
        <div class="w-4/12 flex items-center justify-end">
            <label for="modal-cidade-add" class="w-28 botao-modal text-sm ">Add Novo</label>
        </div>
        
    </div>

    <div class="w-full md:w-4/12 sm:hidden mb-4">
        <input v-model="pesqCidade" placeholder="Pesquisar Cidade" class="w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600" type="text" name="pesquisar" id="pesquisar">
    </div>
    
    
</template>