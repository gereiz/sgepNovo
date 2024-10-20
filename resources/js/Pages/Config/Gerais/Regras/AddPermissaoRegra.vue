<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';


const props = defineProps(['listPermissions', 'role'])
const toastr = useToastr();

const regra = ref('')

const permissoes = ref([])

const setPermisssions = (role, permission) => {

    regra.value = role

    if (permissoes.value.includes(permissoes.value.find(p => p.id === permission.id))) {
        permissoes.value = permissoes.value.filter(p => p.id !== permission.id)
    } else {
        permissoes.value.push(permission)
    }

}

const sendPermissions = () => {
    axios.post('/setPermissions', {role: regra.value,  permissions: permissoes.value})
    .then(response => {
        toastr.success('Permissões atualizadas com sucesso!')

        setTimeout(() => {
            location.reload()
        }, 1000)

    })
    .catch(error => {
        toastr.error('Erro ao atualizar permissões!')

        setTimeout(() => {
            location.reload()
        }, 1000)
    })
}

</script>

<template>
    <input type="checkbox" id="modal-permissao" class="modal-toggle" />
    <div class="modal flex items-end md:items-center">
        <div class="modal-box w-full flex flex-col">
            <div class="w-full flex items-center justify-center mb-4">
                <label for="modal-permissao" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                <h3 v-if="role" class="font-bold text-lg">Incluir Permissões na Regra: <span class="font-semibold text-red-500">{{ role.name }}</span></h3>
            </div>
            <!-- {{ role.permissions }} -->
            <!-- Inclusão de nova permissão -->
            <div class="w-full flex-col flex justify-center mt-8">
                <div class="w-full flex flex-col my-4">
                    <div v-for="(permission, index) in listPermissions" class="flex items-start ms-10 my-2">
                        <div class="flex h-6 items-center">
                            <input id="permission" aria-describedby="permission-description" name="permission" type="checkbox"
                                    :checked="role.permissions.includes(role.permissions.find(p => p.id === permission.id))" @change="setPermisssions(role, permission)"
                                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                        </div>
                        <div class="ml-3 text-sm leading-6">
                            <label for="" class="font-medium text-gray-900">{{permission.name}}</label>
                        </div>
                    </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <label for="modal-permissao" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto">Cancelar</label>
                    <label for="modal-permissao" class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500  sm:w-auto" @click="sendPermissions()">Salvar</label>
                </div>

            </div>


        </div>
    </div>

</template>
