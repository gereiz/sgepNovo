<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';
import BtnConfig from '../../Components/BtnConfig.vue';

const page = usePage();
const permissions = page.props.user.permissions;

const props = defineProps([''])
const emit = defineEmits(['']);
const toastr = useToastr();



</script>



<template>
    <Head title="Configurações" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-4 md:pt-24 pb-32 mx-2 md:mx-4">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-full md:w-4/12 h-14 flex items-center justify-center md:justify-start">
                    <h1 class="text-xl md:text-4xl font-bold">Textos Padrão</h1>
                </div>

            </div>

            <div class="card flex flex-col md:flex-row w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md p-4">
                <!-- <AddAno :anos="anos" /> -->
                <!-- <BtnConfig :title="'Cadastro de Anos'"
                           :link="'/AddAno'"> 
                </BtnConfig> -->
                <BtnConfig  :title="'Tipos de Texto'"
                            :link="'/TipoTexto'">   
                </BtnConfig>
                <BtnConfig  :title="'Textos cadastrados'"
                            :link="'/TextoPadrao'">   
                </BtnConfig>
            </div>
        </div>


    </AuthenticatedLayout>

</template>

