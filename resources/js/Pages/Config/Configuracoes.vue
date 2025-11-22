<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';
import AddAno from './Gerais/AddAno.vue';
import AddRegra from './Gerais/AddRegra.vue';
import BtnConfig from '../Components/BtnConfig.vue'




const page = usePage();
const permissions = page.props.user.permissions;

const props = defineProps(['anos'])

const toastr = useToastr(); 



</script>



<template>
    <Head title="Configurações" />

    <AuthenticatedLayout>
        <div class="w-full min-h-screen pt-4 md:pt-20 mx-2 md:mx-4">
            <div class="navbar bg-base-100 rounded-box shadow mb-4">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl">Configurações</a>
                </div>
                <div class="flex-none">
                    <div class="breadcrumbs text-sm">
                        <ul>
                            <li><a href="/">Início</a></li>
                            <li>Configurações</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="card w-full h-[80vh] bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Áreas de Configuração</h2>
                    <span class="text-sm text-base-content/70">Escolha uma seção para gerenciar regras, permissões e textos padrão.</span>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <BtnConfig  :title="'Cadastro de Regras'"
                                    :link="'configuracoes/roles'">   
                        </BtnConfig>
                        <BtnConfig  :title="'Textos Padrão'"
                                    :link="'configuracoes/textosPadrao'">   
                        </BtnConfig>
                    </div>
                </div>
            </div>
        </div>


    </AuthenticatedLayout>

</template>

