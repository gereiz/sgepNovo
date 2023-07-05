<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';

const props = defineProps(['clientes'])

const pesqCliente = ref('');
const nomeCli = ref('');
const codCli = ref('');

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
                    <label for="modal-cliente-add" class="w-28 botao-modal text-sm ">+ Novo Cliente</label>
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
                                            <img class="w-20 md:w-32" src="../../../../storage/app/public/img/cliente.png" alt="Bairro">
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

            <!-- Inclusão de novo Cliente -->
            <input type="checkbox" id="modal-cliente-add" class="modal-toggle" />
            <div class="modal flex items-end md:items-center">
                <div class="modal-box modal-big">
                    <div class="flex mb-4">
                        <label for="modal-cliente-add" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                        <h3 class="font-bold text-lg">Novo Cliente</h3>
                    </div>

                    <!-- Formulário -->
                    <div class="w-full flex">
                        <form class="w-full space-y-2.5" @submit.prevent=""> 

                            <!-- Razão Social / Nome Fantasia -->
                            <div class="w-full flex">
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Razão Social</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Nome Fantasia</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                            </div>

                            <!-- CPF / CNPJ / Insc Estadual -->
                            <div class="w-full flex">
                                <div class="w-4/12 flex flex-col">
                                    <span class="label-text ml-1 font-bold">CNPJ / CPF</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-4/12 flex flex-col">
                                    <span class="label-text ml-1 font-bold">Inscrição Estadual</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                            </div>

                            <!-- Dados do Responsável -->
                            <div class="w-full flex">
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Contato/Responsável</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Telefone do Responsável</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">E-mail do Responsável</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                            </div>

                            <!-- Endereço: Rua, Nº -->
                            <div class="w-full flex">
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Endereço</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Número</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                            </div>

                            <!-- Bairro /Cidade -->
                            <div class="w-full flex">
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Bairro</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Cidade</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                            </div>

                            <!-- UF / CEP / E-mail -->
                            <div class="w-full flex">
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">UF</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">CEP</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">E-mail</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                            </div>

                            <!-- Telefone / Tipo -->
                            <div class="w-full flex">
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Telefone</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Celular / Whatsapp</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Tipo</span>
                                    <input class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1 font-bold">Ativo</span>
                                    <input type="checkbox" checked="checked" class="checkbox" />
                                </div>
                            </div>
                           
                            <!-- Salvar -->
                            <div class="modal-action">
                                <label @click="cadastraBairro()" for="modal-cliente-add" class="botao-modal">Salvar</label>
                            </div>
                        </form>
                    </div>
                    
                    
                </div>
            </div>

                <!-- Edição / Exclusão de Bairro -->
                <input type="checkbox" id="modal-cliente" class="modal-toggle" />
                <label for="modal-cliente" class="modal modal-bottom sm:modal-middle cursor-pointer">
                    <label class="modal-box relative" for="">
                        <div class="h-12 border-b-2 font-bold text-center md:text-start">
                            <h1 class="">Dados do Cliente: {{nomeCli}}</h1>
                        </div>
                        <p>{{codCli}} - {{nomeCli}}</p>
                        <!-- <div class="h-full flex flex-col border-b-2 font-bold text-center md:text-start space-x-4 space-y-4 pb-2">
                            <div class="flex space-x-4">
                                <div class="w-full">
                                    <form @submit.prevent="editaBairro">
                                        <span class="label-text ml-1">Nome</span>
                                        <input v-model="formBairroEdit.nome_edit" class="w-full input input-bordered mb-4" type="text" >
                                        <label @click="editaBairro()" for="modal-cliente" class="botao-modal w-full bg-amber-500 hover:bg-amber-700 mb-4">Salvar Edição</label>
                                    </form>
                                    <span class="card-title justify-center mb-4">ou</span>
                                    <label @click="deletaBairro()" for="modal-cliente" class="botao-modal w-full bg-red-500 hover:bg-red-800">Excluir Bairro</label>
                                </div>
                            </div> 
                        </div>'-->
                    </label>
                </label>

        </div>
    </AuthenticatedLayout>
</template>



