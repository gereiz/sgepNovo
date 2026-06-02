<script setup>
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import { vMaska } from "maska";

const page = usePage();
const props = defineProps(['centrosCusto', 'tipos_lancamento'])
const emit = defineEmits(['delLancamento']);
const toastr = useToastr();

const dataAtual = new Date().toISOString().slice(0, 10);
const criaLancamento = page.props.user.permissions.includes('criar lancamento');

const lancamento = ref({
    descricao: '',
    centro_custo: 0,
    tipo_lancamento: 0,
    valor: '',
    parcelas: 1,
    data_lancamento: dataAtual,
    observacoes: ''
})

const addLancamento = () => {
    const rawValor = String(lancamento.value.valor ?? '');
    const valorNum = parseFloat(
        rawValor
            .replace('R$', '')
            .replace(/\s+/g, '')
            .replace(/\./g, '')
            .replace(',', '.')
            .replace(/[^0-9.]/g, '')
    );

    if(lancamento.value.descricao == ''){
        toastr.error('Preencha o campo Descrição do Lançamento')
        return
    } else if(lancamento.value.descricao.length < 3){
        toastr.error('O campo Descrição do Lançamento deve ter no mínimo 3 caracteres')
        return
    } else if(lancamento.value.centro_custo == 0){
        toastr.error('Selecione um Centro de Custo')
        return
    } else if(lancamento.value.tipo_lancamento == 0){
        toastr.error('Selecione um Tipo de Lançamento')
        return
    } else if(lancamento.value.valor == ''){
        toastr.error('Preencha o campo Valor do Lançamento')
        return
    } else if(!Number.isFinite(valorNum) || valorNum <= 0){
        toastr.error('Informe um Valor do Lançamento válido')
        return
    } else if(!lancamento.value.parcelas || Number(lancamento.value.parcelas) < 1){
        toastr.error('Selecione o número de Parcelas')
        return
    } else if(lancamento.value.data_lancamento == ''){
        toastr.error('Selecione a Data do Lançamento')
        return
    }

    axios.post('/CreateLancamento', {
        descricao: lancamento.value.descricao,
        centro_custo: lancamento.value.centro_custo,
        tipo_lancamento: lancamento.value.tipo_lancamento,
        valor: lancamento.value.valor,
        parcelas: lancamento.value.parcelas,
        id_reserva: 0,
        data_lancamento: lancamento.value.data_lancamento,
        observacoes: lancamento.value.observacoes

    }).then(response => {
        toastr.success('Lançamento adicionado com sucesso!')

        lancamento.value.descricao = ''
        lancamento.value.centro_custo = 0
        lancamento.value.tipo_lancamento = 0
        lancamento.value.valor = ''
        lancamento.value.parcelas = 1
        lancamento.value.data_lancamento = dataAtual
        lancamento.value.observacoes = ''

        window.location.reload()

    }).catch(error => {
        console.log(error)
        toastr.error('Erro ao adicionar Lançamento!')
    })
}

</script>


<template>
    <dialog id="add_lancamento" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div class="w-[98%]  h-[90%] sm:h-[80%] sm:flex flex-col border border-slate-300 rounded-lg p-4 space-y-4 overflow-y-auto">

                <!-- Descrição -->
                <div class="w-full">
                    <input :disabled="!criaLancamento" v-model="lancamento.descricao" type="text" placeholder="Descrição do Lançamento" class="input input-bordered w-full" />

                </div>

                <!-- Centro de Custo / Tipo do Lançamento -->
                <div class="w-full flex justify-between space-x-4">
                    <select :disabled="!criaLancamento" class="select select-bordered w-6/12" v-model="lancamento.centro_custo">
                        <option value="0" disabled selected>Centro de Custo</option>
                        <option v-for="(centro, index) in centrosCusto" :key="index" :value="centro.id">{{ centro.centro_custo }}</option>
                    </select>

                    <select :disabled="!criaLancamento" class="select select-bordered w-6/12" v-model="lancamento.tipo_lancamento">
                        <option value="0" disabled selected>Tipo de Lançamento</option>
                        <option v-for="(tipo, index) in tipos_lancamento" :key="index" :value="tipo.id">{{ tipo.tipo }}</option>

                    </select>
                </div>

                <!-- Dados do Valor / Parcelas -->
                <div class="w-full flex space-x-4">
                    <input :disabled="!criaLancamento" type="text" v-model="lancamento.valor"
                        placeholder="Valor do Lançamento"
                        class="input input-bordered w-4/12"
                        v-maska
                        data-maska=
                        "[
                            'R$ #,##',
                            'R$ ##,##',
                            'R$ ###,##',
                            'R$ ####,##',
                            'R$ #####,##',
                            'R$ ######,##',
                            'R$ #.###,##',
                            'R$ ##.###,##',
                            'R$ ###.###,##',
                            'R$ #.###.###,##',
                            'R$ ##.###.###,##',
                            'R$ ###.###.###,##'
                            ]"
                    />

                    <select :disabled="!criaLancamento" class="select select-bordered w-4/12" v-model="lancamento.parcelas">
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
                    <div class="w-4/12 flex items-center space-x-4">
                        <input :disabled="!criaLancamento" type="date" v-model="lancamento.data_lancamento"
                        placeholder="Data Lançamento"
                        class="input input-bordered w-full"
                    />

                        <button class="btn btn-sm btn-circle btn-outline btn-error tooltip" v-if="lancamento.parcelas > 1"
                                data-tip="Atenção! Caso o numero de parcelas seja maior que 1, a data de vencimento será a data da entrada, e as demais parcelas serão geradas  automaticamente a cada 30 dias."
                        >
                            <i class="fa-solid fa-circle-exclamation"></i>
                        </button>
                    </div>
                </div>

                <!-- Dados da Data de Vencimento -->
                <!-- <div class="w-full flex items-center space-x-4">
                    <input :disabled="!criaLancamento" type="date" v-model="lancamento.data_lancamento"
                    placeholder="Data Lançamento"
                    class="input input-bordered w-6/12"
                />

                    <button class="btn btn-sm btn-circle btn-outline btn-error tooltip" v-if="lancamento.parcelas > 1"
                            data-tip="Atenção! Caso o numero de parcelas seja maior que 1, a data de vencimento será a data da entrada, e as demais parcelas serão geradas  automaticamente a cada 30 dias."
                    >
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </button>
                </div> -->

                <!-- Observações -->
                <div class="w-full flex">
                    <textarea :disabled="!criaLancamento" v-model="lancamento.observacoes" class="w-full textarea textarea-bordered" placeholder="Observações"></textarea>
                </div>

                <!-- Botão de Adicionar -->
                <button v-if="criaLancamento" class="btn btn-primary text-white w-full mt-4" @click="addLancamento()">
                    Adicionar Lançamento
                </button>
            </div>
        </div>

        
    </dialog>
</template>
