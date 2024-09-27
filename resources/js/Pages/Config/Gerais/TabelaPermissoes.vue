<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';

const props = defineProps(['funcoes'])

const toastr = useToastr();


const listPermissoes = ref([])

const funcao = ref({
    id_funcao: 0,
    cargo: ''
})

const permissao = ref({
    id_permissao: 0,
    nome_permissao: '',
    access_levels:  [],
    is_active: 0
})


onMounted(() => {
    getPermissoes()
})

const getPermissoes = () => {
    axios.get('/getRoles')
    .then((res) => {
        listPermissoes.value = res.data
    })
    .catch((err) => {
        console.log(err)
    })
}

const UpdatePermissao = () => {

    // if(permissao.value.nome_permissao == '') {
    //     toastr.error('Informe o nome da permissão!')
    //     return
    // }

    axios.post('/updateRole', {permissao: permissao.value, funcao: funcao.value})
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


    <div class="sm:flex sm:items-center sm:justify-center">
        <div class="sm:flex-auto">
            <p class="mt-2 font-bold text-xl text-gray-700 text-center mb-4">Permissões cadastradas no sistema.</p>
        </div>
    </div>

    <div class="w-full">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300 border">
                <thead>
                <tr class="divide-x divide-gray-200">
                    <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">ID</th>
                    <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Nome</th>
                    <th scope="col" class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Perfis</th>
                    <th scope="col" class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="(perm, index) in listPermissoes" :key="index" class="divide-x divide-gray-200">
                    <td class="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ perm.id }}</td>
                    <td class="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ perm.name }}</td>
                    <td class="whitespace-nowrap p-4 text-sm text-gray-500">{{ perm.access_levels }}</td>
                    <td class="whitespace-nowrap p-4 text-sm space-x-2">
                        <label for="modal-permissao" class="botao bg-green-600 hover:bg-green-500" @click="permissao.id_permissao = perm.id">Perfis</label>
                        <a href="#" class="botao bg-red-600 hover:bg-red-500">Inativar</a>
                    </td>

                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>


    <!-- Modal de edição -->
    <input type="checkbox" id="modal-permissao" class="modal-toggle" />
    <div class="modal flex items-end md:items-center">
        <div class="modal-box w-full flex flex-col">
            <div class="w-full flex items-center justify-center mb-4">
                <label for="modal-permissao" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                <h3 class="font-bold text-lg">Editar Permissão </h3>
            </div>

            <!-- Inclusão de nova permissão -->
            <div class="w-full flex-col flex justify-center mt-8">

                <div class="w-full flex flex-col my-4">
                    <label for="permissao" class="block text-sm font-medium leading-6 text-gray-900">Permissão</label>
                    <div class="mt-2">
                        <select id="permissao" name="permissao" v-model="permissao.id_permissao" disabled
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <option value="0" disabled>Selecione</option>
                            <option v-for="(perm, index) in listPermissoes" :key="index" :value="perm.id">{{ perm.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="w-full flex flex-col my-4" :class="{ 'hidden': permissao.id_permissao == 0 }">
                    <label for="funcao" class="block text-sm font-medium leading-6 text-gray-900">Função</label>
                    <div class="mt-2">
                        <select id="funcao" name="funcao" v-model="funcao.id_funcao"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <option value="0" disabled selected>Selecione</option>
                            <option v-for="(fun, index) in funcoes" :key="index" :value="fun.id">{{ fun.cargo }}</option>
                        </select>
                    </div>
                </div>

                <div class="mt-5 sm:mt-6 w-full flex justify-center  border-t border-gray-200 pt-4">
                    <label class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:mr-3 sm:w-5/12" @click="UpdatePermissao">Avançar</label>
                    <label for="modal-permissao" class="inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-5/12" @click="">Cancelar</label>
                </div>

            </div>


        </div>
    </div>

</template>


