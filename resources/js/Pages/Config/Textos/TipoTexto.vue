<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { computed, ref, watch } from 'vue';
import AddTipoTexto from './Components/AddTipoTexto.vue';
import AppSelect from '@/Components/Forms/AppSelect.vue';

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

const tipoList = computed(() => {
    return (props.tipo_texto || []).map(tipo => ({
        label: tipo.nome,
        value: tipo.id
    }))
})



watch( () => tipoTexto.value, (val) =>  {
    // if(val != 0) {
        console.log(val);
        getTipoTexto()
    // }

})

function getTipoTexto() {
   axios.post('/configuracoes/getTipoTexto', {
        id: tipoTexto.value
    })
   .then((response) => {
        tipoSelecionado.value = response.data
    })
}

function deleteTipoTexto() {
    axios.post('/configuracoes/deleteTipoTexto', {
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
        <div class="w-full min-h-screen pt-4 md:pt-20 pb-0 mx-2 md:mx-4">
            <div class="navbar bg-base-100 rounded-box shadow mb-4">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl">Tipos de Texto</a>
                </div>
            </div>

            <div class="card w-full h-[80vh] bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="w-full flex flex-col md:flex-row items-end gap-4">
                        <div class="w-full md:w-[24rem]">
                            <div class="form-control w-full">
                                <label class="label">
                                    <span class="label-text">Tipos de Texto</span>
                                </label>
                                <AppSelect :options="tipoList" id="tipo-texto" v-model="tipoTexto" type="text" />
                            </div>
                        </div>

                        <div class="w-full md:flex md:items-center md:gap-2">
                            <button @click="openAdd" class="btn btn-success btn-square text-white tooltip tooltip-left" data-tip="Adicionar Tipo de Texto">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                            <button v-if="tipoTexto != 0" @click="openAdd" class="btn btn-warning btn-square text-white tooltip tooltip-left" data-tip="Editar Tipo de Texto">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button v-if="tipoTexto != 0" @click="deleteTipoTexto()" class="btn btn-error btn-square text-white tooltip tooltip-left" data-tip="Excluir Tipo de Texto">
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

