<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';
import TabelaRegras from './TabelaRegras.vue';

const props = defineProps(['funcoes'])

const toastr = useToastr();



const permissao = ref({
    nome_permissao: ''
})


const AddPermissao = () => {

    if(permissao.value.nome_permissao == '') {
        toastr.error('Informe o nome da permissão!')
        return
    }

    axios.post('/createRole', {name: permissao.value.nome_permissao})
    .then((res) => {
        permissao.value.nome_permissao = ''
        toastr.success('Permissão cadastrada com sucesso!')

        window.location.reload()
    })
    .catch((err) => {
        console.log(err)
        toastr.error('Erro ao cadastrar permissão!')
    })
}



</script>

<template>
    <Head title="Regras & Permissões" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-4/12 h-14 flex items-center">
                    <h1 class="text-xl md:text-4xl font-bold">Regras & Permissões</h1>
                </div>

            </div>


            <div class="card flex flex-row w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md p-4">

                <!-- cadastro de permissões -->
                <div class="w-4/12 flex flex-col border p-4 rounded-xl mr-2">

                    <div class="w-full flex mb-4">
                        <h3 class="font-bold text-lg">Cadastrar Regra</h3>
                    </div>

                    <div class="w-full flex justify-center mt-8">
                        <input type="text" name="nome_permissao" id="nome_permissao" placeholder="Nome da regra" v-model="permissao.nome_permissao"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ps-4" />

                        <label id="btnAddPermissao"
                                class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm
                                        font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12"
                                        @click="AddPermissao">
                                Avançar
                        </label>
                    </div>

                </div>

                <!-- tabela de permissões -->
                <div class="w-8/12 flex flex-col border p-4 rounded-xl overflow-y-auto overflow-x-hidden">

                    <TabelaRegras :funcoes="funcoes"/>

                </div>


            </div>




        </div>

    </AuthenticatedLayout>
</template>

