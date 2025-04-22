<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, watch } from 'vue';
import AddTipoTexto from './Components/AddTipoTexto.vue';

const page = usePage();
const permissions = page.props.user.permissions;

const props = defineProps(['tipo_texto'])
const emit = defineEmits(['']);
const toastr = useToastr();


const openTipo = ref(false)
const tipoTexto = ref(0)
const tipoSelecionado = ref({})

const openAdd = () => {
    openTipo.value = true
}

const closeAdd = () => {
    openTipo.value = false
}

watch( () => tipoTexto.value, (val) =>  {
    // if(val != 0) {
        console.log(val);
        getTipoTexto()
    // }
    
})

function getTipoTexto() {
   axios.post('/getTipoTexto', {
        id: tipoTexto.value
    })
   .then((response) => {
        tipoSelecionado.value = response.data
    }) 
}

function deleteTipoTexto() {
    axios.post('/deleteTipoTexto', {
        id: tipoTexto.value
    }) 
    .then((response) => {
       toastr.success('Tipo de Texto excluído com sucesso!')
       tipoTexto.value = 0
       tipoSelecionado.value = {}
       
       setTimeout(() => {
            window.location.reload()
        }, 2000);
    })
    .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
            toastr.error(error.response.data.message)
        } else {
            toastr.error('Este tipo de texto não pode ser excluído pois está em utilização!')
        }
    })
}


</script>



<template>
    <Head title="Configurações" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-4 md:pt-24 pb-32 mx-2 md:mx-4">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-full md:w-4/12 h-14 flex items-center justify-center md:justify-start">
                    <h1 class="text-xl md:text-4xl font-bold">Tipos de Texto</h1>
                </div>

                   

            </div>

            <div class="card flex flex-col md:flex-row w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md p-4">
                    <div class="w-full h-14 flex flex-col md:flex-row mb-2 items-center">
                        <!-- Textos -->
                        <div class="w-full md:w-[20vw] flex flex-col me-4">
                            <label for="tipo-texto">Tipos de Texto</label>
                            <select v-model="tipoTexto" class="select select-bordered " name="tipo-texto" id="tipo-texto">
                                <option value="0" selected>Selecione</option>
                                <option v-for="tipo, index in tipo_texto" :value="tipo.id">{{ tipo.nome }}</option>
                            </select>
                        </div>

                        <div class="w-full md:w-[50vw] flex me-4 space-x-4">
                            <div class="flex flex-col mt-5">
                                <button @click="openAdd" class="btn btn-base btn-square btn-success text-white tooltip tooltip-left" data-tip="Adicionar Tipo de Texto">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div v-if="tipoTexto != 0" class="flex flex-col mt-5">
                                <button @click="openAdd" class="btn btn-base btn-square btn-warning text-white tooltip tooltip-left" data-tip="Editar Tipo de Texto">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            </div>
                            <div v-if="tipoTexto != 0" class="flex flex-col mt-5">
                                <button @click="deleteTipoTexto()" class="btn btn-base btn-square btn-error text-white tooltip tooltip-left" data-tip="Excluir Tipo de Texto">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    
            </div>
            
        </div>

        <AddTipoTexto :openTipo="openTipo" 
                      :tipoTexto="tipoSelecionado"
                      @closeAdd="closeAdd">

        </AddTipoTexto>



    </AuthenticatedLayout>

</template>

