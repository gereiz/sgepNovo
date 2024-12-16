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
        <table class="min-w-full divide-y divide-gray-300 border">
            <thead>
            <tr class="divide-x divide-gray-200">
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-md font-semibold text-gray-900 sm:pl-2">ID</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-md font-semibold text-gray-900 sm:pl-2">Nome</th>
                <th scope="col" class="px-4 py-3.5 text-left text-md font-semibold text-gray-900">Ações</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
            <tr class="divide-x divide-gray-200">
                <td class="w-1/12 whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2"></td>
                <td class="w-8/12 whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2"></td>
                <td class="w-3/12 whitespace-nowrap flex p-4 text-sm space-x-2">
                    <label class="btn btn-sm btn-square btn-warning text-white" title="Editar">
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


