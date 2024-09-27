<script setup>
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
// import { Head } from '@inertiajs/vue3';
// import { router } from '@inertiajs/vue3'
import { ref, reactive, onMounted, computed } from 'vue';


const props = defineProps(['selection', 'imagem']);

function getImagem(i) {
    // Se o ambiente for de desenvolvimento, a imagem é carregada localmente
    if (process.env.NODE_ENV === 'development') {
        return `http://[::1]:5173/storage/app/public/img/${i}`;
    } else {
        // Se o ambiente for de produção, a imagem é carregada do servidor
        return `https://sgepequipe.com/storage/app/public/img/${i}`;
    }
}

</script>



<template>
    <div v-for="(x, index) in selection" :key="index" class="card w-full md:w-5/12 bg-base-100  rounded-lg shadow-xl mt-4 md:mr-4">
        <div class="card-body border-0">
            <div class="w-full flex justify-between flex-wrap mb-4">
                <div class="w-full flex justify-between">
                    <h2 class="text-xs md:card-title">{{x.nome}}: </h2>
                    <h2 class="text-xs md:text-base font-bold text-zinc-400">ID: {{x.id}}</h2>
                </div>
            </div>
            {{ image }}
            <div class="w-full flex justify-center md:justify-start mb-4 md:mb-0">
                    <img class="w-20 md:w-32" :src="getImagem(imagem)" alt="Regiao">
            </div>

            <div class="w-full card-actions justify-center md:justify-end ">
                <label for="modal-cidade-edit"  class="w-full md:w-28 botao-primario">Ações</label>
            </div>
        </div>
    </div>
</template>