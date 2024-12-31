<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';
import { useToastr } from '@/Components/toastr';
import TabelaCentroCustos from './TabelaCentroCustos.vue';

const page = usePage();
const props = defineProps(['centrosCusto'])
const toastr = useToastr();

const criaFinanceiro = page.props.user.permissions.includes('criar financeiro');
const editaFinanceiro = page.props.user.permissions.includes('editar financeiro');
const excluiFinanceiro = page.props.user.permissions.includes('excluir financeiro');

const centros = ref(props.centrosCusto)

const nomeCentroCusto = ref('')

const addCentroCusto = () => {

    if (nomeCentroCusto.value == '') {
        toastr.error('Nome do Centro de Custo não pode ser vazio!')
        return
    } else if (nomeCentroCusto.value.length < 3) {
        toastr.error('Nome do Centro de Custo deve ter no mínimo 3 caracteres!')
        return
    } else {
        axios.post('/CreateCentroCusto', {
            nome: nomeCentroCusto.value
        }).then(response => {
            centros.value.push(response.data)
            nomeCentroCusto.value = ''
            toastr.success('Centro de Custo adicionado com sucesso!')
        }).catch(error => {
            toastr.error('Erro ao adicionar Centro de Custo!')
        })
    }
}

</script>

<template>
    <div class="w-full h-4/6 flex-col flex-wrap justify-start">

        <!-- Cabeçalho e barra de Pesquisa -->
        <div class="w-full h-[5%] sm:flex">
            <div class="w-full h-10 flex justify-center ">
                <h1 class="text-2xl  font-bold">Centros de Custo</h1>
            </div>
        </div>

        <!-- Cadastro de Centros de Custo -->
        <div class="w-[98%] sm:w-[99%] h-[68vh] flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div class="w-[98%] sm:w-5/12 h-[25%] sm:flex flex-col border border-slate-300 rounded-lg p-4 space-y-4">

                <input :disabled="!criaFinanceiro" v-model="nomeCentroCusto" type="text" placeholder="Nome do Centro de Custo" class="input input-bordered w-full" />

                <label v-if="criaFinanceiro" for="modal-cliente-add" class="btn btn-primary text-white w-full mt-4" @click="addCentroCusto">
                    Adicionar Centro de Custo
                </label>

            </div>

            <div class="w-[98%] sm:w-7/12 h-[98%] sm:flex flex-wrap border border-slate-300 rounded-lg overflow-y-auto">

                <!-- Tabela de Centros de Custo -->
                <TabelaCentroCustos  :centrosCusto="centros" />


            </div>

        </div>

    </div>

</template>

