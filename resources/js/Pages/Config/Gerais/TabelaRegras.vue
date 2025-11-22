<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';
import AddPermissaoRegra from './Regras/AddPermissaoRegra.vue';

const props = defineProps(['permissions'])

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
    axios.get('/configuracoes/getRoles')
    .then((res) => {
        listRoles.value = res.data
        console.log(listRoles.value)
    })
    .catch((err) => {
        console.log(err)
    })
}

const getPermissions = () => {
    axios.get('/configuracoes/getPermissions')
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


    <div class="w-full">
        <div class="card bg-base-100 shadow">
            <div class="card-body">
                <p class="font-bold text-lg">Funções cadastradas</p>
                <div class="overflow-x-auto">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Permissões</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(regra, index) in listRoles" :key="index">
                                <td>{{ regra.id }}</td>
                                <td>{{ regra.name }}</td>
                                <td>
                                    <div v-if="regra.permissions.length !== 0" class="flex flex-wrap gap-2 max-w-[28rem]">
                                        <span v-for="(perm, permIndex) in regra.permissions" :key="permIndex" class="badge badge-outline">{{ perm.name }}</span>
                                    </div>
                                    <span v-else class="badge badge-ghost">Nenhuma</span>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <label for="modal-permissao" class="btn btn-success btn-sm" @click="role = regra">Permissões</label>
                                        <button class="btn btn-error btn-sm" @click="deleteRole(regra)">Excluir</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

<AddPermissaoRegra :listPermissions="listPermissions" :role="role" />


</template>


