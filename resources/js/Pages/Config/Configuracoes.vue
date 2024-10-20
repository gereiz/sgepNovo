<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';
import AddAno from './Gerais/AddAno.vue';
import AddRegra from './Gerais/AddRegra.vue';


const page = usePage();
const permissions = page.props.user.permissions;

const props = defineProps(['anos'])

const toastr = useToastr();



</script>



<template>
    <Head title="Configurações" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-4/12 h-14 flex items-center">
                    <h1 class="text-xl md:text-4xl font-bold">Configurações Gerais</h1>
                </div>

            </div>

            <div class="card flex flex-row w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md p-4">
                <AddAno :anos="anos" />

                <!-- <a v-if="permissions.includes('admin')" href="/roles" class="botao-primario w-fit px-2 flex items-center">Cadastro de Permissões</a> -->
                <a href="/roles" class="botao-primario w-fit px-2 flex items-center">Cadastro de Permissões</a>

            </div>



        </div>

    </AuthenticatedLayout>

</template>

