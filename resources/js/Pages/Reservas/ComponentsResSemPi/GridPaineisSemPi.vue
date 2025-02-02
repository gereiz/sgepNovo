<script setup>
import { Head, usePage } from '@inertiajs/vue3';
import { ref, reactive, watch, computed } from 'vue';
import { useToastr } from '@/Components/toastr';

const props = defineProps(['reservas', 'clientes']);
const emit = defineEmits(['paineisChecked', 'paineisCheckedId', 'itemRefs']);

const clientesOrdenados = computed(() => {
    return props.clientes.sort((a, b) => {
        return a.nome_fantasia.localeCompare(b.nome_fantasia);
    });
});


watch(() => props.reservas, (val) => {
    getPaineisCliente()
});

function getPaineisCliente() {
    // retorna a primeira reserva de cada cliente
    let paineis = [];
    let cliente_id = null;
    let dt_reserva = null;
    let paineisCliente = [];
    let paineisClienteAux = [];
    let paineisClienteAux2 = [];

    // Set para rastrear clientes já processados
    const clientesAdicionados = new Set();

    props.reservas.forEach(reserva => {
        if (!clientesAdicionados.has(reserva.cliente_id)) {
            clientesAdicionados.add(reserva.cliente_id);  // Marca o cliente como processado
            cliente_id = reserva.cliente_id;
            dt_reserva = reserva.dt_reserva;
            paineisClienteAux2.push(reserva);  // Adiciona a primeira reserva do cliente
        }
    });

    // Ordenar pelo campo 'nome_fantasia' em ordem alfabética
    paineisClienteAux2.sort((a, b) => {
        return a.nome_fantasia.localeCompare(b.nome_fantasia);
    });

    paineisCliente = paineisClienteAux2;

    return paineisCliente;

}

</script>

<template>
    <div class="w-full md:w-7/12 flex flex-col flex-wrap items-center md:items-start">
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
                            <span class="text-red-500">{{ cli.nome_fantasia == getPaineisCliente()[index].nome_fantasia ? new Date(getPaineisCliente()[index].dt_reserva).toLocaleDateString('pt-br', {timeZone: 'UTC'}) : '-' }}</span>
                        </p>
                    </div>

                    <div class="md:w-4/12">
                        <p class="text-sm text-gray-600 font-semibold">Campanha: <span class="text-red-500">{{ cli.nome_fantasia == getPaineisCliente()[index].nome_fantasia ? getPaineisCliente()[index].campanha : '-'}}</span></p>
                    </div>
                </div>



            </div>
        </div>
    </div>

</template>

<style scoped>

</style>
