<script setup>
import { ref, reactive, onMounted, computed } from 'vue';


const props = defineProps(['titulo']);


</script>

<template>
    <input type="checkbox" id="modal-cidade-add" class="modal-toggle" />
    <label for="modal-cidade-add" class="modal modal-bottom sm:modal-middle cursor-pointer">
        <label class="modal-box relative" for="">
            <h3 class="font-bold text-lg text-center mb-8">{{ titulo }}</h3>
            <slot></slot>

        </label>
    </label>
</template>

<!-- <input type="checkbox" id="modal-cidade-add" class="modal-toggle" />
<label for="modal-cidade-add" class="modal modal-bottom sm:modal-middle cursor-pointer">
    <label class="modal-box relative" for="">
        <h3 class="font-bold text-lg">Adicionar Nova Cidade</h3>
        <form @submit.prevent="cadastraCidade">  
            <div class="w-full flex">
                    <div class="w-full flex flex-col">
                        <span class="label-text ml-1">Nome</span>
                        <input v-model="formCidadeAdd.nome" class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                    </div>
                    <div class="w-full flex flex-col">
                        <span class="label-text ml-1">UF</span>
                        <select v-model="formCidadeAdd.uf_id" name="uf_id" id="uf_id" class="select select-bordered">
                            <option value="0" disabled required>Seleicione a Cidade</option>
                            <option v-for="u, index in uf" :key="index" :value="u.id">{{u.nome}}</option>
                        </select>
                    </div>
            </div>
            <div class="modal-action">
                <label @click="cadastraCidade()" for="modal-cidade-add" class="botao-modal">Salvar</label>
            </div>
        </form>

    </label>
</label> -->