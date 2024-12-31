<script setup>
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue';


const props = defineProps(['tipoLancamento'])
const emit = defineEmits(['deleteCentroCusto']);
const toastr = useToastr();

const centros = ref(props.centrosCusto)

const deleteCentroCusto = () => {
    axios.post('/DeleteTipoLancamento', { tipoLancamento: props.tipoLancamento })
    .then(response => {
        toastr.success('Centro de Custo excluído com sucesso!')

        setTimeout(() => {
            const dialog = document.getElementById('del_tipo_lancamento')
            dialog.close()
            emit('deleteTipoLancamento', 'T')
        }, 1000)

    }).catch(error => {
        toastr.error(error.response.data.message)
    })
}

</script>


<template>
    <dialog id="del_tipo_lancamento" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div class="w-full flex flex-col items-center p-4">
                <h3 class="text-lg font-bold">Excluir Tipo de Lançamento: <span class="text-red-500 font-semibold">{{ tipoLancamento.tipo }}</span> </h3>
                <p class="py-4">Essa exclusão não é reversível!</p>
            </div>

            <div class="w-full flex flex-col items-center p-4">
                <label class="w-full btn btn-error text-white" title="Excluir" @click="deleteCentroCusto()">
                    <i class="fa-solid fa-trash"></i> Excluir
                </label>
            </div>
        </div>
    </dialog>
</template>
