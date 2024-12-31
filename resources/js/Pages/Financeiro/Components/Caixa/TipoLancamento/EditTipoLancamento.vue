<script setup>
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue';


const props = defineProps(['tipoLancamento'])
const emit = defineEmits(['editTipoLancamento']);
const toastr = useToastr();

const nome_tipo = ref('')


const EditTipo = () => {
    if(nome_tipo.value == ''){
        toastr.error('Preencha o campo Nome do Tipo de Lançamento')
        return
    } else if(nome_tipo.value.length < 3){
        toastr.error('O campo Nome do Tipo de Lançamento deve ter no mínimo 3 caracteres')
        return
    } else {
        axios.post('/UpdateTipoLancamento', {id: props.tipoLancamento.id,
            nome_tipo: nome_tipo.value
        }).then(response => {
            toastr.success('Centro de Custo editado com sucesso!')

            setTimeout(() => {
                const dialog = document.getElementById('edit_tipo_lancamento')
                dialog.close()
                nome_tipo.value = ''
                emit('editTipoLancamento', 'T')
            }, 1000)

        }).catch(error => {
            toastr.error('Erro ao editar Centro de Custo!')
        })
    }
}



</script>


<template>
    <dialog id="edit_tipo_lancamento" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div class="w-full flex flex-col items-center p-4">
                <h3 class="text-lg font-bold">Editar Tipo de Lançamento: <span class="text-red-500 font-semibold">{{ tipoLancamento.tipo }}</span></h3>
                <p class="py-4">Cuidado ao alterar dados do sistema!</p>
            </div>

            <div class="w-full flex flex-col items-center p-4">
                <input v-model="nome_tipo"  type="text" :placeholder="tipoLancamento.tipo" name="nome_tipo" class="input input-bordered w-full " />
            </div>

            <div class="w-full flex flex-col items-center p-4">
                <label class="w-full btn btn-warning text-white" title="Excluir" @click="EditTipo()">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </label>
            </div>
        </div>
    </dialog>
</template>
