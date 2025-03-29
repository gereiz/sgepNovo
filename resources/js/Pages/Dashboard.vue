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
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <div class="mb-6 flex space-x-4">
                        <!-- Ano -->
                        <div class="w-1/4">
                            <label class="block text-sm font-medium text-gray-700">Ano</label>
                            <select 
                                v-model="idAno"
                                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                        <div class="w-3/4">
                            <label class="block text-sm font-medium text-gray-700">Bi-Semana</label>
                            <select 
                                v-model="idBisemana"
                                :disabled="bsDisabled"
                                @change="fetchSalesData()"
                                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                    <div class="grid grid-cols-2 gap-6 h-[calc(100vh-20rem)]">
                        <div class="overflow-auto scrollbar-hide">
                            <SalesChart :sales-data="salesData" />
                        </div>
                        <div class="overflow-auto scrollbar-hide">
                            <CustomerChart :customer-data="customerData" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

