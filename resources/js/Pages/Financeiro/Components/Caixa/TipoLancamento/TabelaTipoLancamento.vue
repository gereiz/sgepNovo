<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, watch } from 'vue';

import EditTipoLancamento from './EditTipoLancamento.vue';
import DelTipoLancamento from './DelTipoLancamento.vue';


const page = usePage();
const props = defineProps(['tipos_lancamento'])


const criaFinanceiro = page.props.user.permissions.includes('criar financeiro');
const editaFinanceiro = page.props.user.permissions.includes('editar financeiro');
const excluiFinanceiro = page.props.user.permissions.includes('excluir financeiro');
const tipos = ref(props.tipos_lancamento)
const tipoLancamento = ref({})

const openEdit = (val) => {
    tipoLancamento.value = val

    const dialog = document.getElementById('edit_tipo_lancamento')
    dialog.showModal()

}

const openDelete = (val) => {
    tipoLancamento.value = val

    const dialog = document.getElementById('del_tipo_lancamento')
    dialog.showModal()

}

const getTipos = () => {
    axios.get('/TiposLancamentos')
    .then(response => {
        tipos.value = response.data
    }).catch(error => {
        toastr.error('Erro ao buscar Tipos de Lançamentos!')
    })
}

watch(() => tipos.value, (val) => {
    getTipos()
})


const updateTipos = (val) => {
    tipos.value = tipos.value.filter(tipos => tipos.id !== val)
}


</script>


<template>

    <div class="inline-block min-w-full align-middle ">
        <table class="min-w-full divide-y divide-gray-300 border">
            <thead>
            <tr class="divide-x divide-gray-200">
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-md font-semibold text-gray-900 sm:pl-2">ID</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-md font-semibold text-gray-900 sm:pl-2">Nome</th>
                <th scope="col" class="px-4 py-3.5 text-left text-md font-semibold text-gray-900">Ações</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
            <tr class="divide-x divide-gray-200" v-for="tipo in tipos" :key="tipo.id">
                <td class="w-1/12 whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ tipo.id }}</td>
                <td class="w-8/12 whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ tipo.tipo }}</td>
                <td v-if=" tipo.id != 1 && tipo.id != 2" class="w-3/12 whitespace-nowrap flex p-4 text-sm space-x-2">
                    <label v-if="editaFinanceiro" class="btn btn-sm btn-square btn-warning text-white" title="Editar" @click="openEdit(tipo)">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </label>

                    <label v-if="excluiFinanceiro" class="btn btn-sm btn-square btn-error text-white" title="Excluir" @click="openDelete(tipo)">
                        <i class="fa-solid fa-trash"></i>
                    </label>
                </td>

                <td v-else class="w-3/12 whitespace-nowrap flex p-4 text-sm space-x-2 text-center">
                  <p class="text-red-500 font-black">Não pode ser excluído !</p>
                </td>

            </tr>
            </tbody>
        </table>
    </div>

    <EditTipoLancamento :tipoLancamento="tipoLancamento" @editTipoLancamento="updateTipos" />


    <DelTipoLancamento :tipoLancamento="tipoLancamento" @deleteTipoLancamento="updateTipos" />

</template>


