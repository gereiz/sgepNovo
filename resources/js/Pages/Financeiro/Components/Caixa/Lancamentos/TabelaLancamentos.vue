<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, watch } from 'vue';

import EditLancamento from './EditLancamento.vue';
import DelLancamento from './DelLancamento.vue';

const page = usePage();
const props = defineProps(['centrosCusto', 'lancamentos', 'tipos_lancamento']);
const toastr = useToastr();


const criaLancamento = page.props.user.permissions.includes('criar lancamento');
const editaLancamento = page.props.user.permissions.includes('editar lancamento');
const excluiLancamento = page.props.user.permissions.includes('excluir lancamento');
const lancamentosL = ref(props.lancamentos)
const lancamento = ref({})

const openEdit = (val) => {
    lancamento.value = val

    const dialog = document.getElementById('edit_lancamento')
    dialog.showModal()

}

const openDelete = (val) => {
    lancamento.value = val

    const dialog = document.getElementById('del_lancamento')
    dialog.showModal()

}

const getLancamentos = () => {
    axios.get('/Lancamentos')
    .then(response => {
        lancamentosL.value = response.data
    }).catch(error => {
        toastr.error('Erro ao buscar Centros de Custo!')
    })
}

watch(() => lancamentosL.value, (val) => {
    getLancamentos()
})


const updateLanc = (val) => {
    lancamentosL.value = lancamentosL.value.filter(lancamento => lancamento.id !== val)
}


</script>


<template>

    <div class="inline-block min-w-full align-middle ">
        <table class="min-w-full divide-y divide-gray-300 border table-xs">
            <thead>
            <tr class="divide-x divide-gray-200">
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">ID</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Descrição</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Valor</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Data</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">C. Custo</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Tipo</th>

                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Obs</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Ações</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
            <tr class="divide-x divide-gray-200" v-for="lancamento in lancamentosL" :key="lancamento.id">
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ lancamento.id }}</td>
                <td class="w-[40%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ lancamento.descricao }}</td>
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">R$ {{ lancamento.valor }}</td>
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ new Date(lancamento.dt_faturamento).toLocaleDateString() }}</td>
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ lancamento.centro_custo.centro_custo}}</td>

                <td v-if="lancamento.tipo_lancamento.tipo == 'Entrada'" class="w-[5%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <button class="btn btn-sm btn-square btn-success btn-outline text-white tooltip tooltip-left" :data-tip="lancamento.tipo_lancamento.tipo">
                        <i class="fa-solid fa-angles-up"></i>
                    </button>
                </td>
                <td v-else-if="lancamento.tipo_lancamento.tipo == 'Saída'" class="w-[5%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <button class="btn btn-sm btn-square btn-error btn-outline text-white tooltip tooltip-left" :data-tip="lancamento.tipo_lancamento.tipo">
                        <i class="fa-solid fa-angles-down"></i>
                    </button>
                </td>
                <td v-else class="w-[5%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <button class="btn btn-sm btn-square btn-warning btn-outline text-white tooltip tooltip-left" :data-tip="lancamento.tipo_lancamento.tipo">
                        <i class="fa-solid fa-exclamation"></i>
                    </button>
                </td>

                <td v-if="lancamento.observacoes" class="w-[5%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <button class="btn btn-sm btn-square btn-success btn-outline text-white tooltip tooltip-left" :data-tip="lancamento.observacoes">
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </button>
                </td>
                <td v-else class="w-[5%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <button class="btn btn-sm btn-square btn-error btn-outline text-white tooltip tooltip-left" data-tip="Nenhuma Observação">
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </button>
                </td>

                <td class="w-[7%] whitespace-nowrap flex p-4 text-sm space-x-2">

                    <button v-if="editaLancamento" class=" btn btn-sm btn-square btn-warning text-white tooltip tooltip-left" data-tip="Editar" @click="openEdit(lancamento)">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button v-if="excluiLancamento" class="btn btn-sm btn-square btn-error text-white tooltip tooltip-left" data-tip="Excluir" @click="openDelete(lancamento)">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </td>

            </tr>
            </tbody>
        </table>
    </div>

    <EditLancamento :lancamento="lancamento" :centrosCusto="centrosCusto" :tipos_lancamento="tipos_lancamento" @editLancamento="updateLanc" />

    <DelLancamento :lancamento="lancamento" :centrosCusto="centrosCusto" :tipos_lancamento="tipos_lancamento" @delLancamento="updateLanc" />

</template>


