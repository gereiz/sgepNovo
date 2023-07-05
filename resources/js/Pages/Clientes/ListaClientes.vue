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
                <div class="modal-box">
                    <div class="flex mb-4">
                        <label for="modal-cliente-add" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                        <h3 class="font-bold text-lg">Novo Cliente</h3>
                    </div>

                    <!-- Formulário -->
                    <FormKit type="form" :actions="false">
                        <FormKit type="multi-step" tab-style="progress" :allow-incomplete="false">
                            <FormKit type="step" name="Inf.Básicas">
                                <!-- Dados Básicos do Cliente -->

                                <!-- Nome Fantasia -->
                                <FormKit 
                                    type="text" 
                                    label="Nome Fantasia"  
                                    validation="required"
                                />
                
                                <!-- Email do Responsável -->
                                <FormKit 
                                    type="email" 
                                    label="Email do Responsável" 
                                    prefix-icon="email" 
                                    validation="required"
                                />
            
                                <!-- Celular do Responsável -->
                                <FormKit
                                    type="tel"
                                    validation="required"
                                    label="Phone"
                                    prefix-icon="telephone"
                                />

                            </FormKit>
                            
                            <FormKit type="step" name="Inf. Adicionais">
                                <!-- Dados Complementares do Cliente -->

                                <!-- Razão Social -->
                                <FormKit 
                                    type="text" 
                                    label="Razão Social" 
                                    prefix-icon="avatarMan" 
                                    validation="required"
                                />

                                <!-- CPF / CNPJ -->
                                <FormKit 
                                    type="number" 
                                    label="CPF / CNPJ" 
                                    prefix-icon="number" 
                                    validation="required"
                                />

                                <!-- CPF / CNPJ -->
                                <FormKit 
                                    type="number" 
                                    label="Insc. Estadual" 
                                    prefix-icon="number" 
                                    validation="required"
                                />

                                <!-- Contato -->
                                <FormKit 
                                    type="text" 
                                    label="Nome do Responsável" 
                                    prefix-icon="avatarMan" 
                                    validation="required"
                                />

                            </FormKit>

                            <FormKit type="step" name="Endereço">
                                <!-- Dadps de Endereço -->

                                 <!-- Endereço -->
                                 <FormKit 
                                    type="text" 
                                    label="Endereço"  
                                    validation="required"
                                />

                                 <!-- Número -->
                                 <FormKit 
                                    type="text" 
                                    label="Número" 
                                    validation="required"
                                />

                                 <!-- Bairro -->
                                 <FormKit 
                                    type="text" 
                                    label="Bairro"  
                                    validation="required"
                                />

                                 <!-- Cidade -->
                                 <FormKit 
                                    type="text" 
                                    label="Cidade"  
                                    validation="required"
                                />

                                 <!-- UF -->
                                 <FormKit 
                                    type="text" 
                                    label="UF"  
                                    validation="required"
                                />

                                 <!-- CEP -->
                                 <FormKit 
                                    type="text" 
                                    label="CEP"  
                                    validation="required"
                                />


                            </FormKit>

                            <FormKit type="step" name="Inf. Extras">
                                <!-- Informações Extras -->
                                
                                <!-- Tipo -->
                                <FormKit 
                                    type="text" 
                                    label="Tipo"  
                                    validation="required"
                                />

                                <!-- Ativo -->
                                <FormKit 
                                    type="text" 
                                    label="Ativo"  
                                    validation="required"
                                />
                            </FormKit>
                        </FormKit>
                    </FormKit>
                    
                    
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



