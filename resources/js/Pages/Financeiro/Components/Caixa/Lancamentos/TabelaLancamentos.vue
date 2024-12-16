<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';


const props = defineProps(['funcoes'])

const toastr = useToastr();


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
            <tr class="divide-x divide-gray-200">
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2"></td>
                <td class="w-[35%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2"></td>
                <td class="w-[12%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2"></td>
                <td class="w-[12%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2"></td>
                <td class="w-[8%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2"></td>
                <td class="w-[8%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2"></td>
                <td class="w-[8%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2"></td>
                <td class="w-[7%] whitespace-nowrap flex p-4 text-sm space-x-2">

                    <label class=" btn btn-sm btn-square btn-warning text-white" title="Editar">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </label>

                    <label class="btn btn-sm btn-square btn-error text-white" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </label>

                </td>

            </tr>
            </tbody>
        </table>
    </div>

</template>


