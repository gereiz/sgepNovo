<script setup>
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue';


const props = defineProps(['centroCusto'])
const emit = defineEmits(['editCentroCusto']);
const toastr = useToastr();

const nome = ref('')


const EditCentroCusto = () => {
    axios.post('/UpdateCentroCusto', {id: props.centroCusto.id,
        centro_custo: nome.value
    }).then(response => {
        toastr.success('Centro de Custo editado com sucesso!')


        setTimeout(() => {
            const dialog = document.getElementById('edit_centro_custo')
            dialog.close()
            nome.value = ''
            emit('editCentroCusto', 'T')
        }, 1000)

    }).catch(error => {
        toastr.error('Erro ao editar Centro de Custo!')
    })
}





</script>


<template>
    <dialog id="edit_centro_custo" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div class="w-full flex flex-col items-center p-4">
                <h3 class="text-lg font-bold">Editar Centro de Custo: <span class="text-red-500 font-semibold">{{ centroCusto.centro_custo }}</span> </h3>
                <p class="py-4">Cuidado ao alterar dados do sistema!</p>
            </div>

            <div class="w-full flex flex-col items-center p-4">
                <input v-model="nome" :placeholder="centroCusto.centro_custo" type="text" placeholder="Nome do Centro de Custo" name="nome" class="input input-bordered w-full " />
            </div>

            <div class="w-full flex flex-col items-center p-4">
                <label class="w-full btn btn-warning text-white" title="Excluir" @click="EditCentroCusto()">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </label>
            </div>
        </div>
    </dialog>
</template>
