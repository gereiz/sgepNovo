<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue';

const page = usePage();
const permissions = page.props.user.permissions;

const props = defineProps(['anos', 'bisemanas', 'comissoes', 'pis', 'clientes'])
const emit = defineEmits(['']);
const toastr = useToastr();

const anoAtual = new Date().getFullYear(); // Obtém o ano atual
const idAno = ref(0); // Inicializa a variável reativa
const listaBisemana = ref(0);
const idBisemana = ref(0);
const pisFiltradas = ref([]);

// Função para encontrar o cliente pelo ID
const getClienteById = (id) => {
    return props.clientes.find(cliente => cliente.id === id) || null;
}

// Função para encontrar o agente pelo ID
const getAgenteById = (id) => {
    return props.clientes.find(cliente => cliente.id === id) || null;
}

onMounted(() => {
     // Procura o ID do ano atual na lista de anos disponíveis
     const anoEncontrado = props.anos.find(ano => ano.ano_bisemana == anoAtual);
        if (anoEncontrado) {
            idAno.value = anoEncontrado.id;
        }
        
     // Inicializa pisFiltradas com todas as PIs
     pisFiltradas.value = props.pis;
})

watch(idAno, (val) => {
    getBisemanas()
})

function getBisemanas() {
    axios.post('/getBisemanas', {anoId: idAno.value})
        .then(res => {
            listaBisemana.value = Object.values(res.data)
            idBisemana.value = 0
            // Resetar as PIs filtradas para mostrar todas quando mudar o ano
            pisFiltradas.value = props.pis;
        })
}

function getReservas(idBisemana) {
    if (idBisemana === 0) {
        // Se nenhuma bisemana for selecionada, mostrar todas as PIs
        pisFiltradas.value = props.pis;
    } else {
        // Filtrar as PIs pela bisemana selecionada
        pisFiltradas.value = props.pis.filter(pi => pi.id_bisemana === idBisemana);
    }
}

</script>

<template>
    <Head title="Comissões Pagas" />

    <AuthenticatedLayout>
        <div class="w-full h-screen sm:pt-20 lg:pb-32 mx-2 md:mx-4">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-4">
                <div class="sm:w-2/12 h-14 flex items-center">
                    <h1 class="titulo">Comissões Pagas</h1>
                </div>
            </div>

            <!-- Filtros de Pesquisa -->
            <div class="w-full flex flex-row flex-wrap items-center lg:mb-4">
                <!-- Ano Bi-semana, e CLiente -->
                <div class="w-full lg:w-6/12 flex items-center sm:justify-start flex-wrap lg:flex-nowrap">

                    <!-- Anos -->
                    <div class="w-[23%] lg:w-[11%] flex flex-col me-4 sm:me-6 -mt-6 mb-2">
                        <label for="bi-semana">Ano</label>
                        <select class="select select-bordered" name="ano" id="ano" v-model="idAno" @change="getBisemanas()">
                            <option value="0" selected>Selecione</option>
                            <option v-for="(ano, index) in anos" :key="index" :value="ano.id">{{ ano.ano_bisemana }}</option>
                        </select>
                    </div>

                    <!-- Bi-semanas -->
                    <div class="w-[66%] lg:w-[30%] flex flex-col me-4 sm:me-6 -mt-6 mb-2">
                        <label for="bi-semana">Bi-Semana</label>
                        <select class="select select-bordered" name="bi-semana" id="bi-semama" v-model="idBisemana" @change="getReservas(idBisemana)">
                            <option value="0" selected>Selecione</option>
                            <option v-for="(bs, index) in listaBisemana"
                                :key="index"
                                :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}
                            </option>
                        </select>
                    </div>

                </div>
            </div>

            <!-- Mensagem quando não há PIs para a bisemana selecionada -->
            <div v-if="pisFiltradas.length === 0" class="alert alert-warning w-[99%] ">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>Nenhuma PI encontrada para a bisemana selecionada.</span>
            </div>

            <!-- Cards das PIs -->
            <div class="card flex flex-col md:flex-row flex-wrap w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md p-4 space-y-4 md:space-y-0 md:space-x-4">
                <div v-for="(pi, index) in pisFiltradas" :key="index" class="card bg-neutral text-neutral-content w-96 h-5/6 hover:scale-105 transition-all duration-500 ease-in-out">
                    <div class="card-body items-center text-center">
                        <h2 class="card-title text-2xl">PI nº {{ pi.id }}</h2>
                        
                        <!-- Informações da PI -->
                        <p class="text-sm font-bold">Cliente: {{ getClienteById(pi.id_cliente) ? getClienteById(pi.id_cliente).nome_fantasia : getAgenteById(comissao.agente_id).razao_social }}</p>
                        <p class="text-lg font-bold">Campanha: {{ pi.campanha ? pi.campanha : 'Não informada' }}</p>
                        
                        <!-- Lista de comissões relacionadas a esta PI -->
                        <div class="w-full mt-4">
                            <h3 class="text-lg font-bold mb-2">Comissões</h3>
                            <div v-if="props.comissoes.filter(com => com.pi_id === pi.id).length > 0">
                                <div v-for="(comissao, comIndex) in props.comissoes.filter(com => com.pi_id === pi.id)" 
                                     :key="comIndex" 
                                     class="card bg-base-100 text-neutral mb-2 p-2">
                                    <div class="text-left">
                                        <p class="text-sm"><span class="font-bold">Agente:</span> {{ getAgenteById(comissao.agente_id) ? getAgenteById(comissao.agente_id).nome_fantasia : getAgenteById(comissao.agente_id).razao_social }}</p>
                                        <p class="text-sm"><span class="font-bold">Valor:</span> {{ comissao.valor_comissao }} R$</p>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-error">
                                Nenhuma comissão encontrada para esta PI
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </AuthenticatedLayout>
</template>

