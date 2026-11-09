<script setup>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ref, watch } from 'vue';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
    salesData: {
        type: Array,
        required: true,
        default: () => []
    }
});

const chartData = ref({
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
        ]
    }]
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right'
        }
    }
};

const totalReservations = ref(0);

const updateChartData = () => {
    if (props.salesData && props.salesData.length > 0) {
        totalReservations.value = props.salesData.reduce((sum, item) => sum + item.total_reservations, 0);
        chartData.value = {
            labels: props.salesData.map(item => `${item.seller_name} (${item.total_reservations || 0} painéis)`),
            datasets: [{
                data: props.salesData.map(item => item.total_reservations),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        };
    } else {
        totalReservations.value = 0;
        chartData.value = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        };
    }
};

watch(() => props.salesData, updateChartData, { immediate: true });
</script>

<template>
    <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Vendas por Vendedor: {{ totalReservations }}</h3>
        <div class="h-[400px] mb-6 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div v-if="salesData.length === 0" class="flex items-center justify-center h-full">
                <p class="text-gray-500">Selecione uma bisemana para visualizar os dados</p>
            </div>
            <Pie 
                v-else
                :data="chartData"
                :options="chartOptions"
            />
        </div>
        <div class="mt-4">
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vendedor
                        </th>
                        <th class="px-4 py-2 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total de Reservas
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="sale in salesData" :key="sale.seller_id">
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {{ sale.seller_name }}
                        </td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                            {{ sale.total_reservations }} reservas
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>