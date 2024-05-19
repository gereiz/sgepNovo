<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';

// const props = defineProps(['paineis'])


</script>

<template>
    <Head title="Comissões" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
                        <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-2/12 h-14 flex items-center">
                    <h1 class="titulo">Lista de Comissões</h1>
                    <!-- <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4">{{ paineis.length }}</h1> -->
                </div>
            </div>

            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap md:flex-row justify-center">
                   
                    </div>
                </div>
            </div>

        </div>
    </AuthenticatedLayout>

</template>

