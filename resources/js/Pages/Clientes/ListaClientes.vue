<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, computed } from 'vue';
import AddCliente from './Components/AddCliente.vue';

const props = defineProps(['clientes'])

const pesqCliente = ref('');
const nomeCli = ref('');
const codCli = ref('');

const open = ref(false)

function openAdd(val) {
    if(val === 't') {
        open.value = true
    } else {
        open.value = false
    }
}

function setClienteData (id, nome) {
    codCli.value = id; 
    nomeCli.value = nome;

}

const clientesFiltrados = computed(() => {
    let clientesFiltrados = Object.values(props.clientes).filter((cliente) => {
        return (
            String(cliente.nome_fantasia).toLowerCase().indexOf(pesqCliente.value.toLowerCase()) > -1
        );
    })

    return clientesFiltrados;
})

</script>

<template>
    <Head title="Clientes" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-2/12 h-14 flex items-center">
                    <h1 class="text-xl md:text-4xl font-bold">Clientes</h1>
                    <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4">{{ clientes.length }}</h1>
                </div>
                
                <div class="w-10/12 flex justify-end">
                    <label for="modal-cliente-add" class="w-28 botao-modal text-sm" @click="openAdd('t')">+ Novo Cliente</label>
                </div>
                
            </div>
            <div class="w-full md:w-4/12">
                <input v-model="pesqCliente" placeholder="Pesquisar Cliente" class="w-full h-10 input input-bordered rounded-none mb-4" type="text" name="pesquisar" id="pesquisar">
            </div>

            <!-- Card dos Clientes -->
            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap md:flex-row justify-center">
                        
                        <div v-for="(cli, index) in clientesFiltrados" :key="index" class="card w-full md:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 md:mr-4">
                            <label for="modal-cliente" @click="setClienteData(cli.id, (cli.nome_fantasia ? cli.nome_fantasia : cli.razao_social))">
                                <div class="card-body">
                                    <div class="w-full flex justify-between flex-wrap mb-4">
                                        <div class="w-full flex justify-between">
                                            <h2 v-if="cli.nome_fantasia === null" class="text-xs md:card-title">Cliente.: {{cli.razao_social}}</h2>
                                            <h2 v-else class="text-xs md:card-title">Cliente.: {{cli.nome_fantasia}}</h2>
                                            <h2 class="text-xs md:text-base font-bold text-zinc-400">ID: {{cli.id}}</h2>
                                        </div>
                                    </div>

                                    <div class="w-full flex justify-center md:justify-start mb-4 md:mb-0">
                                            <img class="w-20 md:w-32" src="../../../../storage/app/public/img/cliente.png" alt="Cliente">
                                    </div>

                                    <!-- <div class="w-full card-actions justify-center md:justify-end ">
                                        <label for="modal-cliente" @click="setBairroData(cli.id, cli.nome_fantasia)" class="w-full md:w-28 botao-modal">Ações</label>
                                    </div> -->
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <AddCliente :openAdd="open" @CloseAdd="openAdd"/>

        </div>
    </AuthenticatedLayout>
</template>



