<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import SalesChart from '@/Pages/Components/SalesChart.vue';
import CustomerChart from '@/Pages/Components/CustomerChart.vue';

const props = defineProps(['bisemanas', 'anos']);

const salesData = ref([]);
const customerData = ref([]);
const bsDisabled = ref(true);
const listaBisemana = ref(0);
const idAno = ref(0);
const idBisemana = ref(0);
const anoAtual = new Date().getFullYear();

const bisemanaSelecionada = computed(() => {
    let bisemanaSelecionada = Object.values(props.bisemanas || []).filter((bisemana) => {
        return (bisemana.id === idBisemana.value)
    })
    return bisemanaSelecionada
});

function parseYMDToUTC(dateStr) {
    const d = (dateStr || '').toString().slice(0, 10)
    const [y, m, dnum] = d.split('-').map(n => parseInt(n, 10))
    return Date.UTC(y, (m || 1) - 1, dnum || 1)
}

function findCurrentBiweekId(list) {
    const nowUTC = Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())
    for (const bs of list) {
        const startUTC = parseYMDToUTC(bs.inicio)
        const endUTC = parseYMDToUTC(bs.fim)
        if (nowUTC >= startUTC && nowUTC <= endUTC) {
            return bs.id
        }
    }
    // fallback: primeira bisemana do ano (mais segura que última)
    return list.length ? list[0].id : 0
}

async function getBisemanas() {
    const res = await axios.post('/getBisemanass', {bisemana: idAno.value})
    listaBisemana.value = Object.values(res.data)
    bsDisabled.value = false
    // Auto selecionar bi-semana atual ao carregar
    const currentId = findCurrentBiweekId(listaBisemana.value)
    idBisemana.value = currentId
}

const fetchSalesData = async () => {
    if (idBisemana.value === 0) return;
    
    try {
        const response = await axios.get(`/api/sales-by-biweek/${idBisemana.value}`);
        console.log('API Response:', response.data);
        salesData.value = response.data;

        // Fetch customer data
        const customerResponse = await axios.get(`/api/customer-reservations/${idBisemana.value}`);
        console.log('Customer API Response:', customerResponse.data);
        customerData.value = customerResponse.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(async () => {
    const anoEncontrado = props.anos?.find(ano => ano.ano_bisemana == anoAtual);
    if (anoEncontrado) {
        idAno.value = anoEncontrado.id;
        await getBisemanas();
    }
});

watch(idBisemana, () => {
    if (idBisemana.value !== 0) {
        fetchSalesData();
    }
});
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout :hideHeader="true">
        <div class="w-full min-h-screen pt-6 pb-24 mx-2 md:mx-4 overflow-x-hidden">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Seleção de Período</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="label">
                                    <span class="label-text">Ano</span>
                                </label>
                                <select 
                                    v-model="idAno"
                                    class="select select-bordered w-full"
                                    @change="getBisemanas()"
                                >
                                    <option value="0" disabled>Selecione</option>
                                    <option v-for="(ano, index) in props.anos"
                                        :key="index"
                                        :value="ano.id">
                                        {{ ano.ano_bisemana }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="label">
                                    <span class="label-text">Bi-Semana</span>
                                </label>
                                <select 
                                    v-model="idBisemana"
                                    :disabled="bsDisabled"
                                    @change="fetchSalesData()"
                                    class="select select-bordered w-full"
                                >
                                    <option value="0" selected disabled>Selecione</option>
                                    <option v-for="(bs, index) in listaBisemana"
                                        :key="index"
                                        :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="card bg-base-100 shadow h-[50vh]">
                    <div class="card-body overflow-auto">
                        <h2 class="card-title text-base">Vendas por Vendedor</h2>
                        <div class="overflow-auto">
                            <SalesChart :sales-data="salesData" :height="250" legendPosition="bottom" />
                        </div>
                    </div>
                </div>
                <div class="card bg-base-100 shadow h-[50vh]">
                    <div class="card-body overflow-auto">
                        <h2 class="card-title text-base">Reservas por Cliente</h2>
                        <div class="overflow-auto">
                            <CustomerChart :customer-data="customerData" :height="250" legendPosition="bottom" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
