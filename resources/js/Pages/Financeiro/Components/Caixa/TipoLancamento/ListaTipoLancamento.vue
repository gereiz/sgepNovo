<script setup>
import { ref } from 'vue';
import { useToastr } from '@/Components/toastr';
import { Head, usePage } from '@inertiajs/vue3';
import TabelaTipoLancamento from './TabelaTipoLancamento.vue';

const page = usePage();
const props = defineProps(['tipos_lancamento'])
const toastr = useToastr();

const criaFinanceiro = page.props.user.permissions.includes('criar financeiro');
const editaFinanceiro = page.props.user.permissions.includes('editar financeiro');
const excluiFinanceiro = page.props.user.permissions.includes('excluir financeiro');
const tipos = ref(props.tipos_lancamento)

const nomeTipo = ref('')

const AddTipoLancamento = () => {
    if(nomeTipo.value == ''){
        toastr.error('Preencha o campo Nome do Tipo de Lançamento')
        return
    } else if(nomeTipo.value.length < 3){
        toastr.error('O campo Nome do Tipo de Lançamento deve ter no mínimo 3 caracteres')
        return
    } else {
        axios.post('/CreateTipoLancamento', {
            nome_tipo: nomeTipo.value
        }).then(response => {
            tipos.value.push(response.data)
            nomeTipo.value = ''
            toastr.success('Tipo de Lançamento adicionado com sucesso!')
        }).catch(error => {
            toastr.error('Erro ao adicionar Tipo de Lançamento!')
        })
    }
}



</script>

<template>
    <div class="w-full h-4/6 flex-col flex-wrap justify-start">

        <!-- Cabeçalho e barra de Pesquisa -->
        <div class="w-full h-[5%] sm:flex">
            <div class="w-full h-10 flex justify-center ">
                <h1 class="text-2xl  font-bold">Tipos de Lançamentos</h1>
            </div>
        </div>

        <!-- Cadastro de Centros de Custo -->
        <div class="w-[98%] sm:w-[99%] h-[68vh] flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div class="w-[98%] sm:w-5/12 h-[25%] sm:flex flex-col border border-slate-300 rounded-lg p-4 space-y-4">

                <input :disabled="!criaFinanceiro" v-model="nomeTipo" type="text" name="nome_tipo" placeholder="Nome do Tipo de Lançamento" class="input input-bordered w-full " />

                <label v-if="criaFinanceiro" for="modal-cliente-add" class="btn btn-primary text-white w-full mt-4" @click="AddTipoLancamento()">
                    Adicionar Tipo de Lançamento
                </label>

            </div>

            <div class="w-[98%] sm:w-7/12 h-[98%] sm:flex flex-wrap border border-slate-300 rounded-lg">

                <!-- Tabela de Centros de Custo -->
                <TabelaTipoLancamento :tipos_lancamento="tipos_lancamento" />


            </div>

        </div>

    </div>

</template>

