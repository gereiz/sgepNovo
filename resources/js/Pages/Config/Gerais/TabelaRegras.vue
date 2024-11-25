<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';
import AddPermissaoRegra from './Regras/AddPermissaoRegra.vue';

const props = defineProps(['funcoes'])

const toastr = useToastr();


const listRoles = ref([])
const listPermissions = ref([])

const funcao = ref({
    id_funcao: 0,
    cargo: ''
})

const role = ref()


onMounted(() => {
    getRoles()
    getPermissions()
})

const getRoles = () => {
    axios.get('/getRoles')
    .then((res) => {
        listRoles.value = res.data
    })
    .catch((err) => {
        console.log(err)
    })
}

const getPermissions = () => {
    axios.get('/getPermissions')
    .then((res) => {
        listPermissions.value = res.data
    })
    .catch((err) => {
        console.log(err)
    })
}


const deleteRole = (role) => {

    console.log(role)
    axios.post('/deleteRole', {role: role})
    .then((res) => {
        toastr.success('Função excluída com sucesso!')
        getRoles()
    })
    .catch((err) => {
        console.log(err)
    })
}



</script>


<template>


    <div class="sm:flex sm:items-center sm:justify-center">
        <div class="sm:flex-auto">
            <p class="mt-2 font-bold text-xl text-gray-700 text-center mb-4">Funções cadastradas no sistema.</p>
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
                    <th scope="col" class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Permissões</th>
                    <th scope="col" class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="(regra, index) in listRoles" :key="index" class="divide-x divide-gray-200">
                    <td class="w-[0.75rem] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ regra.id }}</td>
                    <td class="w-[5rem] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ regra.name }}</td>
                    <td v-if="regra.permissions.length !== 0" class="max-w-[8rem] whitespace-nowrap p-4 text-sm text-gray-500 overflow-x-auto">
                        <span v-for="(perm, permIndex) in regra.permissions">
                            {{ perm.name }}, </span> </td>
                    <td v-else class="whitespace-nowrap p-4 text-sm text-gray-500">Nenhuma permissão atribuída</td>
                    <td class="w-[5rem] whitespace-nowrap p-4 text-sm space-x-2">
                        <label for="modal-permissao" class="botao bg-green-600 hover:bg-green-500" @click="role = regra">Permissões</label>
                        <label class="botao bg-red-600 hover:bg-red-500" @click="deleteRole(regra)">Excluir Função</label>
                    </td>

                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>

<AddPermissaoRegra :listPermissions="listPermissions" :role="role" />


</template>


