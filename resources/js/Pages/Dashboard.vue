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

function getBisemanas() {
    axios.post('/getBisemanass', {bisemana: idAno.value})
    .then(res => {
        listaBisemana.value = Object.values(res.data)
        bsDisabled.value = false
        idBisemana.value = 0
    })
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

onMounted(() => {
    const anoEncontrado = props.anos?.find(ano => ano.ano_bisemana == anoAtual);
    if (anoEncontrado) {
        idAno.value = anoEncontrado.id;
        getBisemanas();
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

    <AuthenticatedLayout>
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 mx-2 md:mx-4">
            <div class="navbar bg-base-100 rounded-box shadow mb-4">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl">Dashboard</a>
                </div>
            </div>
            <div class="card w-full bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Ano -->
                        <div class="w-full">
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
                        
                        <!-- Bisemana -->
                        <div class="w-full">
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

                    <!-- Dashboard Cards Container -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="overflow-auto">
                            <SalesChart :sales-data="salesData" />
                        </div>
                        <div class="overflow-auto">
                            <CustomerChart :customer-data="customerData" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

