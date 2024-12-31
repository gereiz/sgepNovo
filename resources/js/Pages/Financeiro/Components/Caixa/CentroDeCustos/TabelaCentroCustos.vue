<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue';

import DelCentroCusto from './DelCentroCusto.vue';
import EditCentroCusto from './EditCentroCusto.vue';

const page = usePage();
const props = defineProps(['centrosCusto'])


const criaFinanceiro = page.props.user.permissions.includes('criar financeiro');
const editaFinanceiro = page.props.user.permissions.includes('editar financeiro');
const excluiFinanceiro = page.props.user.permissions.includes('excluir financeiro');
const centrosC = ref(props.centrosCusto)
const centroCusto = ref({})

const openEdit = (val) => {
    centroCusto.value = val

    const dialog = document.getElementById('edit_centro_custo')
    dialog.showModal()

}

const openDelete = (val) => {
    centroCusto.value = val

    const dialog = document.getElementById('del_centro_custo')
    dialog.showModal()

}

const getCentrosCusto = () => {
    axios.get('/CentrosCusto')
    .then(response => {
        centrosC.value = response.data
    }).catch(error => {
        toastr.error('Erro ao buscar Centros de Custo!')
    })
}

watch(() => centrosC.value, (val) => {
    getCentrosCusto()
})


const updateCentros = (val) => {
    centrosC.value = centrosC.value.filter(centro => centro.id !== val)
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
            <tr class="divide-x divide-gray-200" v-for="centro in centrosC" :key="centro.id">
                <td class="w-1/12 whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ centro.id }}</td>
                <td class="w-8/12 whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ centro.centro_custo }}</td>
                <td v-if="centro.id != 1" class="w-3/12 whitespace-nowrap flex p-4 text-sm space-x-2">
                    <label v-if="editaFinanceiro" class="btn btn-sm btn-square btn-warning text-white" title="Editar" @click="openEdit(centro)">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </label>

                    <label v-if="excluiFinanceiro" class="btn btn-sm btn-square btn-error text-white" @click="openDelete(centro)" title="Excluir">
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

    <EditCentroCusto :centroCusto="centroCusto" @editCentroCusto="updateCentros" />


    <DelCentroCusto :centroCusto="centroCusto" @deleteCentroCusto="updateCentros" />

</template>


