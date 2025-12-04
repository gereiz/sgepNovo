<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed, watch } from 'vue';
import RelComissoes from '../../Relatorios/Financeiro/RelComissoes.vue';


const page = usePage();
const permissions = page.props.user.permissions;

const props = defineProps(['anos', 'bisemanas', 'comissoes', 'pis', 'clientes', 'comissoes_defs', 'lancamentos'])
const emit = defineEmits(['']);
const toastr = useToastr();

const open = ref(false)
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

function openRel(val) {
    if(val === 't') {
        open.value = true
    } else {
        open.value = false
    }
}

const comissaoDefsMap = computed(() => {
    const map = new Map()
    ;(props.comissoes_defs || []).forEach(c => map.set(c.id, c))
    return map
})

function getServicoNome(comissaoId) {
    const c = comissaoDefsMap.value.get(comissaoId)
    return (c && c.servico && c.servico.nome) ? c.servico.nome : 'Serviço'
}

function getParcelasPorPi(piId) {
    return (props.lancamentos || [])
        .filter(l => l.id_reserva === piId)
        .sort((a,b)=> new Date(a.dt_faturamento) - new Date(b.dt_faturamento))
        .map(l => ({ data: new Date(l.dt_faturamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }), label: l.parcelas }))
}

function getVencimentoPorPi(piId) {
    const lans = (props.lancamentos || [])
        .filter(l => l.id_reserva === piId)
        .sort((a,b)=> new Date(a.dt_faturamento) - new Date(b.dt_faturamento))
    if (lans.length === 0) return null
    const dt = new Date(lans[0].dt_faturamento)
    return dt.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

function comissoesUnicasPorPi(piId) {
    const lista = (props.comissoes || []).filter(com => com.pi_id === piId)
    const seen = new Set()
    return lista.filter(c => {
        const key = `${c.agente_id}|${c.comissao_id}|${Number(c.valor_comissao).toFixed(2)}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

async function openPiPdf(pi) {
    const nomeArquivo = pi?.arquivo
    if (!nomeArquivo) { toastr.error('PI sem arquivo cadastrado'); return }
    const urls = [
        `/storage/pdf/pi/pi_cli_${nomeArquivo}`,
        `/storage/pdf/pi/pi_fin_${nomeArquivo}`,
    ]
    for (const url of urls) {
        try {
            const resp = await fetch(url, { method: 'HEAD', cache: 'no-store' })
            if (resp.ok) { window.open(url, '_blank'); return }
        } catch (e) {}
    }
    toastr.error('PDF da PI não encontrado')
}

</script>

<template>
    <Head title="Comissões Pagas" />

    <AuthenticatedLayout>
        <div class="w-full min-h-screen bg-base-100 sm:pt-20 lg:pb-32 mx-2 md:mx-4">

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

                    <button
                            @click="openRel('t')"
                            class="btn btn-md btn-square btn-primary text-white text-xl tooltip tooltip-left -mt-2.5 ml-10" data-tip="Gerar Relatório de Comissões Mensal">
                            <i class="fa-regular fa-file-pdf"></i>
                    </button>

                </div>

            </div>

            <!-- Mensagem quando não há PIs para a bisemana selecionada -->
            <div v-if="pisFiltradas.length === 0" class="alert alert-warning w-[99%] ">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>Nenhuma PI encontrada para a bisemana selecionada.</span>
            </div>

            <div class="w-full bg-base-100 rounded-xl p-4">
                <div class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-6">
                    <div v-for="(pi, index) in pisFiltradas" :key="index" class="card card-compact bg-base-200 shadow-lg ring-1 ring-base-300 rounded-xl transition-all">
                        <div class="card-body gap-2">
                            <div class="flex items-center justify-between">
                                <button class="badge badge-neutral cursor-pointer" @click="openPiPdf(pi)">PI nº {{ pi.id }}</button>
                                <div class="badge badge-neutral">BS {{ pi.id_bisemana }}</div>
                            </div>

                            <div class="space-y-1">
                                <p class="text-sm">
                                    <span class="font-semibold">Cliente:</span>
                                    {{ getClienteById(pi.id_cliente) ? (getClienteById(pi.id_cliente).nome_fantasia || getClienteById(pi.id_cliente).razao_social) : 'Não informado' }}
                                </p>
                                <p class="text-sm">
                                    <span class="font-semibold">Campanha:</span>
                                    {{ pi.campanha ? pi.campanha : 'Não informada' }}
                                </p>
                            </div>

                            <div class="divider">Comissões</div>

                            <div class="space-y-2 max-h-44 overflow-auto">
                                <template v-if="comissoesUnicasPorPi(pi.id).length > 0">
                                    <div v-for="(comissao, comIndex) in comissoesUnicasPorPi(pi.id)" :key="comIndex" class="flex items-center justify-between p-2 rounded-md border">
                                        <div class="flex-1">
                                            <div class="text-sm font-medium">
                                                {{ getAgenteById(comissao.agente_id) ? (getAgenteById(comissao.agente_id).nome_fantasia || getAgenteById(comissao.agente_id).razao_social) : 'Agente' }}
                                            </div>
                                            <div class="text-xs opacity-70">ID {{ comissao.agente_id }} • {{ getServicoNome(comissao.comissao_id) }}</div>
                                            <div class="text-xs opacity-70 flex flex-wrap gap-1">
                                                <span v-for="(parc, idx) in getParcelasPorPi(pi.id)" :key="idx" class="badge badge-ghost">{{ parc.data }} {{ parc.label }}</span>
                                            </div>
                                        </div>
                                        <div class="badge badge-primary">R$ {{ comissao.valor_comissao }}</div>
                                    </div>
                                </template>
                                <div v-else class="alert alert-info rounded-lg">
                                    <span>Nenhuma comissão encontrada para esta PI.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gera um novo Relatório -->
            <RelComissoes :openRelScreen="open"
                          :anos="props.anos"
                          :bisemanas="props.bisemanas"
                          :pis="props.pis"
                          :comissoes="props.comissoes"
                          :clientes="props.clientes"
                        @closeRel="openRel">
            </RelComissoes>

        </div>
    </AuthenticatedLayout>
</template>
