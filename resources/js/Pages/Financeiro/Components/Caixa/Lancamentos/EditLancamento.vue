<script setup>
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { vMaska } from "maska"

const props = defineProps(['lancamento', 'centrosCusto', 'tipos_lancamento']);
const emit = defineEmits(['editLancamento']);
const toastr = useToastr();



const dataAtual = new Date().toISOString().slice(0, 10);

const lancamentoAtual = ref({
    descricao: '',
    centro_custo: '',
    tipo_lancamento: '',
    valor: '',
    parcelas: '',
    dt_faturamento: '',
    observacoes: '',
})

const editLancamento = () => {

    if(lancamentoAtual.value.descricao == ''){
        toastr.error('Preencha o campo Descrição do Lançamento')
        return
    } else if(lancamentoAtual.value.descricao.length < 3){
        toastr.error('O campo Descrição do Lançamento deve ter no mínimo 3 caracteres')
        return
    } else if(lancamentoAtual.value.centro_custo == 0){
        toastr.error('Selecione um Centro de Custo')
        return
    } else if(lancamentoAtual.value.tipo_lancamento == 0){
        toastr.error('Selecione um Tipo de Lançamento')
        return
    } else if(lancamentoAtual.value.valor == ''){
        toastr.error('Preencha o campo Valor do Lançamento')
        return
    } else if(lancamentoAtual.value.valor.length < 5){
        toastr.error('O campo Valor do Lançamento deve ter no mínimo 5 caracteres')
        return
    } else if(lancamentoAtual.value.parcelas == 0){
        toastr.error('Selecione o número de Parcelas')
        return
    } else if(lancamentoAtual.value.data_lancamento == ''){
        toastr.error('Selecione a Data do Lançamento')
        return
    }

    axios.post('/UpdateLancamento', {id: props.lancamento.id,
        lancamento: lancamentoAtual.value
    }).then(response => {
        toastr.success('Lançamento editado com sucesso!')


        setTimeout(() => {
            const dialog = document.getElementById('edit_lancamento')
            dialog.close()
            nome.value = ''
            emit('editLancamento', 'T')

            window.location.reload()
        }, 1000)

    }).catch(error => {
        toastr.error('Erro ao editar Centro de Custo!')
    })
}



watch(() => props.lancamento, (value) => {
    lancamentoAtual.value = value
})



</script>


<template>
    <dialog id="edit_lancamento" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div class="w-full flex flex-col items-center p-4">
                <h3 class="text-lg font-bold">Editar Lançamento: <span class="text-red-500 font-semibold">{{ lancamentoAtual.descricao }}</span> </h3>
                <p class="py-4">Cuidado ao alterar dados do sistema!</p>
                {{ dataAtual }}
                {{ typeof(dataAtual) }}
                {{ (lancamentoAtual.dt_faturamento) }}
               
            </div>

            <div class="w-full space-y-4">
                <!-- Descrição -->
                <div class="w-full">
                    <input v-model="lancamentoAtual.descricao" type="text" placeholder="Descrição do Lançamento" class="input input-bordered w-full" />

                </div>

                <!-- Centro de Custo / Tipo do Lançamento -->
                <div class="w-full flex justify-between space-x-4">
                    <select class="select select-bordered w-6/12" v-model="lancamentoAtual.centro_custo.id">
                        <option value="0" disabled selected>Centro de Custo</option>
                        <option v-for="(centro, index) in centrosCusto" :key="index" :value="centro.id">{{ centro.centro_custo }}</option>
                    </select>

                    <select class="select select-bordered w-6/12" v-model="lancamentoAtual.tipo_lancamento.id">
                        <option value="0" disabled selected>Tipo de Lançamento</option>
                        <option v-for="(tipo, index) in tipos_lancamento" :key="index" :value="tipo.id">{{ tipo.tipo }}</option>

                    </select>
                </div>

                <!-- Dados do Valor / Parcelas -->
                <div class="w-full flex space-x-4">
                    <input type="text" v-model="lancamentoAtual.valor"
                        placeholder="Valor do Lançamento"
                        class="input input-bordered w-6/12"
                        v-maska
                        data-maska=
                        "[
                            'R$ ##,##',
                            ' R$ ###,##',
                            ' R$ ####,##',
                            ' R$ #####,##'
                            ]"
                    />

                    <select class="select select-bordered w-6/12" v-model="lancamentoAtual.parcelas">
                        <option value="0" disabled selected>Número de Parcelas</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                </div>

                <!-- Dados da Data de Vencimento -->
                <div class="w-full flex items-center space-x-4">
                    <input type="date" v-model="lancamentoAtual.dt_faturamento"
                       placeholder="Data Lançamento"
                       class="input input-bordered w-6/12"
                    />

                    <button class="btn btn-sm btn-circle btn-outline btn-error tooltip" v-if="lancamentoAtual.parcelas > 1"
                            data-tip="Atenção! Caso o numero de parcelas seja maior que 1, a data de vencimento será a data da entrada, e as demais parcelas serão geradas  automaticamente a cada 30 dias."
                    >
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </button>
                </div>

                <!-- Observações -->
                <div class="w-full flex">
                    <textarea v-model="lancamentoAtual.observacoes" class="w-full textarea textarea-bordered" placeholder="Observações"></textarea>
                </div>
            </div>

            <div class="w-full flex flex-col items-center p-4">
                <label class="w-full btn btn-warning text-white" title="Excluir" @click="editLancamento()">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </label>
            </div>
        </div>
    </dialog>
</template>
