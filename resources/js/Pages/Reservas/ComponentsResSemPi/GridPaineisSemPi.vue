<script setup>
import { Head, usePage } from '@inertiajs/vue3';
import { ref, reactive, watch, computed } from 'vue';
import { useToastr } from '@/Components/toastr';

const props = defineProps(['paineis', 'reservas', 'clientes', 'clienteSel']);
const emit = defineEmits(['itemRefs', 'geraPi', 'clienteSel']);


const clientesOrdenados = computed(() => {
    return [...(props.clientes || [])].sort((a, b) => {
        const nomeA = a.nome_fantasia || a.razao_social || '';
        const nomeB = b.nome_fantasia || b.razao_social || '';
        return nomeA.localeCompare(nomeB);
    });
});

function getReservaCliente(cli) {
    if (!props.reservas || !cli) return null;
    return props.reservas.find(r => r.cliente_id === cli.id) || null;
}

</script>

<template>
    <div v-if="clientesOrdenados.length > 0" class="w-full md:w-7/12 flex flex-col flex-wrap items-center md:items-start">
        <!-- Cards dos Paineis -->
        <div v-for="(cli, index) in clientesOrdenados" :key="index"
             class="w-full h-[15vh] md:h-[10vh] card flex bg-base-100 border border-gray-200 shadow-xl m-2 p-4">
            <div class="flex">
                <div class="w-full flex flex-col md:flex-row space-y-6 md:space-y-0">
                    <div class="md:w-3/12">
                        <p class="text-sm text-gray-600 font-semibold">Cliente: <span class="text-red-500">{{ cli.nome_fantasia ? cli.nome_fantasia : cli.razao_social }}</span></p>
                    </div>

                    <div class="md:w-4/12">
                        <p class="text-sm text-gray-600 font-semibold">Data Pré-reserva:
                            <span class="text-red-500">{{ getReservaCliente(cli) ? new Date(getReservaCliente(cli).dt_reserva).toLocaleDateString('pt-br', {timeZone: 'UTC'}) : '-' }}</span>
                        </p>
                    </div>

                    <div class="md:w-4/12">
                        <p class="text-sm text-gray-600 font-semibold">Campanha: <span class="text-red-500">{{ getReservaCliente(cli) ? getReservaCliente(cli).campanha : '-'}}</span></p>
                    </div>

                    <div v-if="clienteSel" class="md:w-4/12">
                        <p class="text-sm text-gray-600 font-semibold">Painéis: <span class="text-red-500">{{ reservas.length }}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="w-full flex flex-col flex-wrap items-center md:items-start">
        <div class="w-full h-full flex items-center justify-center">
            <p class="w-full text-center font-semibold text-red-500 text-2xl">Nenhuma Reserva sem PI encontrada na Bi-semana informada.</p>
        </div>
    </div>

</template>

