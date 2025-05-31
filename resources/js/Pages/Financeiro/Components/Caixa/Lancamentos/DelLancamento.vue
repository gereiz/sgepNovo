<script setup>
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue';


const props = defineProps(['lancamento'])
const emit = defineEmits(['delLancamento']);
const toastr = useToastr();

const lancamentoL = ref(props.lancamento)

const deleteLancamento = () => {
    axios.post('/DeleteLancamento', { lancamento: props.lancamento })
    .then(response => {
        toastr.success('Lançamento excluído com sucesso!')

        setTimeout(() => {
            const dialog = document.getElementById('del_lancamento')
            dialog.close()
            emit('delLancamento', 'T')

            window.location.reload()
        }, 1000)

    }).catch(error => {
        toastr.error('Erro ao excluir Lançamento!')
    })
}



</script>


<template>
    <dialog id="del_lancamento" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div class="w-full flex flex-col items-center p-4">
                <h3 class="text-lg font-bold">Excluir Lançamento: <span class="text-red-500 font-semibold">{{ lancamento.descricao }}</span> </h3>
                <p class="py-4">Essa exclusão não é reversível!</p>
            </div>

            <div class="w-full flex flex-col items-center p-4">
                <label class="w-full btn btn-error text-white" title="Excluir" @click="deleteLancamento()">
                    <i class="fa-solid fa-trash"></i> Excluir
                </label>
            </div>
        </div>
    </dialog>
</template>
