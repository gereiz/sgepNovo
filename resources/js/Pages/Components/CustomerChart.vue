<script setup>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ref, watch } from 'vue';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
    customerData: {
        type: Object,
        required: true,
        default: () => ({
            reservations: []
        })
    },
    height: {
        type: Number,
        default: 220
    },
    legendPosition: {
        type: String,
        default: 'bottom'
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
            '#FF9F40',
            '#8B4513',
            '#32CD32',
            '#BA55D3',
            '#4682B4',
            '#FF4500',
            '#2E8B57',
            '#DDA0DD',
            '#6495ED',
            '#CD853F',
            '#20B2AA'
        ]
    }]
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: props.legendPosition
        }
    }
};

const totalCustomers = ref(0);

const updateChartData = () => {
    if (props.customerData && props.customerData.reservations && props.customerData.reservations.length > 0) {
        totalCustomers.value = props.customerData.reservations.reduce((sum, item) => sum + item.value, 0);
        chartData.value = {
            labels: props.customerData.reservations.map(item => item.name),
            datasets: [{
                data: props.customerData.reservations.map(item => item.value),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#8B4513',
                    '#32CD32',
                    '#BA55D3',
                    '#4682B4',
                    '#FF4500',
                    '#2E8B57',
                    '#DDA0DD',
                    '#6495ED',
                    '#CD853F',
                    '#20B2AA'
                ]
            }]
        };
    } else {
        totalCustomers.value = 0;
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
                    '#FF9F40',
                    '#8B4513',
                    '#32CD32',
                    '#BA55D3',
                    '#4682B4',
                    '#FF4500',
                    '#2E8B57',
                    '#DDA0DD',
                    '#6495ED',
                    '#CD853F',
                    '#20B2AA'
                ]
            }]
        };
    }
};

watch(() => props.customerData, updateChartData, { immediate: true });
</script>

<template>
    <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Reservas por Cliente: {{ totalCustomers }}</h3>
        <div class="mb-6 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" :style="{ height: props.height + 'px' }">
            <div v-if="!customerData.reservations || customerData.reservations.length === 0" class="flex items-center justify-center h-full">
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
                            Cliente
                        </th>
                        <th class="px-4 py-2 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total de Reservas
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="customer in customerData.reservations" :key="customer.name">
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {{ customer.name }}
                        </td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                            {{ customer.value }} reservas
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
