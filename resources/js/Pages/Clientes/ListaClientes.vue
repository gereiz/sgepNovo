<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import AddCliente from './Components/AddCliente.vue';
import DelCliente from "./Components/DelCliente.vue";

const props = defineProps(['clientes'])

const pesqCliente = ref('');
const nomeCli = ref('');
const codCli = ref('');
const cliente = ref({})

const open = ref(false)
const openD = ref(false)

function openAdd(val) {
    if(val === 't') {
        open.value = true
    } else {
        open.value = false
    }
}

function openEdit(val) {
    axios.post('/EditCliente', {idCliente: codCli.value})
        .then((res) =>{
            cliente.value = res.data[0]

        })
        .catch((err) => {
            console.error(err)
    })

    if(val === 't') {
        open.value = true
    } else {
        open.value = false
    }

}

function openDel(val, cli) {
    if(val === 't') {
        openD.value = true
        cliente.value = cli
    } else {
        openD.value = false
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
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 mx-2 md:mx-4">
            <div class="navbar bg-base-100 rounded-box shadow mb-4">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl">Clientes</a>
                </div>
                <div class="flex-none">
                    <div class="badge badge-primary">{{ clientes.length }}</div>
                    <button class="btn btn-success btn-sm ml-3" for="modal-cliente-add" @click="openAdd('t')">Novo Cliente</button>
                </div>
            </div>
            <div class="w-full md:w-4/12 my-4">
                <div class="form-control">
                    <label class="label">
                        <!-- <span class="label-text">Pesquisar Cliente</span> -->
                    </label>
                    <input v-model="pesqCliente" placeholder="Pesquisar Cliente" class="input input-bordered" type="text" name="pesquisar" id="pesquisar">
                </div>
            </div>

            <!-- Card dos Clientes -->
            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap md:flex-row justify-center">

                        <div v-for="(cli, index) in clientesFiltrados" :key="index" class="card w-full md:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 md:mr-4">
                            <label for="modal-cliente">
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
                                </div>
                            </label>

                            <div class="w-full flex justify-center py-4 space-x-4">
                                <button @click="setClienteData(cli.id, (cli.nome_fantasia ? cli.nome_fantasia : cli.razao_social)), openEdit('t')"
                                       class="w-4/12 btn btn-warning text-white">
                                    Editar
                                </button>
                                <button @click="openDel('t', cli)"
                                       class="w-4/12 btn btn-error text-white">
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddCliente :openAdd="open" :clienteEdit="cliente" @CloseAdd="openAdd"/>

            <DelCliente :openDel="openD" :clienteDel="cliente" @CloseDel="openDel"/>

        </div>
    </AuthenticatedLayout>
</template>



