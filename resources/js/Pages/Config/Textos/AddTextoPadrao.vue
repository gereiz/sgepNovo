<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, watch, onMounted } from 'vue';
import AddTipoTexto from './Components/AddTipoTexto.vue';
import 'trix';
import 'trix/dist/trix.css';
import Swal from 'sweetalert2';

const page = usePage();
const permissions = page.props.user.permissions;

const props = defineProps(['tipo_texto', 'texto_padrao'])
const emit = defineEmits(['']);
const toastr = useToastr();


const openTipo = ref(false)
const tipoTexto = ref(0)
const TextoPadrao = ref(0)
const tipoSelecionado = ref({})
const textoConteudo = ref('')
const textoTitulo = ref('')
const ativo = ref(false)
const disabledForm = ref(true)


watch( () => tipoTexto.value, (val) =>  {
    // if(val != 0) {
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

function handleTrixChange(e) {
    textoConteudo.value = e.target.value;
}

function salvarTextoPadrao() {
    if (!tipoTexto.value || tipoTexto.value === 0) {
        toastr.error('Selecione um tipo de texto!');
        return;
    }
    
    if (!textoTitulo.value) {
        toastr.error('Informe um título para o texto!');
        return;
    }
    
    if (!textoConteudo.value) {
        toastr.error('O conteúdo do texto não pode estar vazio!');
        return;
    }
    
    // Verifica se é uma atualização (se já existe um ID)
    const isUpdate = TextoPadrao.value && TextoPadrao.value !== 0;
    
    // Se for atualização, mostra confirmação
    if (isUpdate) {
        Swal.fire({
            title: 'Confirmação',
            text: 'Já existe um texto padrão com este título. O registro será atualizado em vez de criar um novo. Deseja continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, atualizar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                saveTextoPadrao();
            }
        });
    } else {
        // Verifica se já existe um texto com o mesmo título
        axios.post('/verificaTextoPadrao', {
            titulo: textoTitulo.value
        })
        .then((response) => {
            if (response.data && response.data.exists) {
                Swal.fire({
                    title: 'Confirmação',
                    text: 'Já existe um texto padrão com este título. O registro será atualizado em vez de criar um novo. Deseja continuar?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim, atualizar!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        saveTextoPadrao();
                    }
                });
            } else {
                saveTextoPadrao();
            }
        })
        .catch((error) => {
            console.error(error);
            saveTextoPadrao(); // Em caso de erro na verificação, tenta salvar mesmo assim
        });
    }
}

function saveTextoPadrao() {
    axios.post('/addOrEditTextoPadrao', {
        id: TextoPadrao.value,
        tipo_texto_id: tipoTexto.value,
        titulo: textoTitulo.value,
        conteudo: textoConteudo.value,
        ativo: ativo.value
    })
    .then((response) => {
        toastr.success('Texto padrão ' + (TextoPadrao.value ? 'atualizado' : 'adicionado') + ' com sucesso!');
        textoTitulo.value = '';
        textoConteudo.value = '';
        // Limpar o editor Trix
        document.querySelector('trix-editor').value = '';

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    })
    .catch((error) => {
        toastr.error('Erro ao ' + (TextoPadrao.value ? 'atualizar' : 'adicionar') + ' o texto padrão!');
        console.error(error);
    });
}

function getTextoPadrao() {
    axios.post('/getTextoPadrao', {
        id: TextoPadrao.value
    })
    .then((response) => {
        console.log(response.data);
        textoTitulo.value = response.data.title;
        tipoTexto.value = response.data.type;
        ativo.value = response.data.active ? true : false;
        disabledForm.value = false;
        
        // Atualiza o editor Trix com o conteúdo recuperado
        setTimeout(() => {
            const trixEditor = document.querySelector('trix-editor');
            if (trixEditor) {
                trixEditor.editor.loadHTML(response.data.content);
            }
        }, 100);
    })
}

function deletextoPadrao() {
    Swal.fire({
        title: 'Confirmação',
        text: 'Tem certeza que deseja excluir este texto padrão?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.post('/deleteTextoPadrao', {
                id: TextoPadrao.value
            })
            .then((response) => {
                toastr.success('Texto padrão excluído com sucesso!');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                toastr.error('Erro ao excluir o texto padrão!');
                console.error(error);
            });
        }
    });
}

watch(() => TextoPadrao.value, (val) => {
    if (val != 0) {
        getTextoPadrao()
    } 
})

watch(() => disabledForm.value, (val) => {
    if (val) {
        TextoPadrao.value = 0;
        textoTitulo.value = '';
        tipoTexto.value = 0;
        document.querySelector('trix-editor').value = '';
    }
})


</script>


<template>
    <Head title="Configurações" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-4 md:pt-24 pb-32 mx-2 md:mx-4">

            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-full md:w-4/12 h-14 flex items-center justify-center md:justify-start">
                    <h1 class="text-xl md:text-4xl font-bold">Textos Padrão</h1>
                </div>
            </div>

            <div class="card flex flex-col md:flex-row w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md p-4">
                <div class="w-full flex flex-col">
                    <div class="w-full flex flex-col md:flex-row mb-4 items-center">
                        <!-- Textos -->
                        <div class="w-full md:w-[20vw] flex flex-col me-4">
                            <label for="tipo-texto">Textos Padrão</label>
                            <select v-model="TextoPadrao" class="select select-bordered " name="tipo-texto" id="tipo-texto">
                                <option value="0" selected>Selecione</option>
                                <option v-for="texto, index in texto_padrao" :value="texto.id">{{ texto.title }} </option>
                            </select>
                        </div>

                        <!-- Botões -->
                        <div class="w-full md:w-[50vw] flex me-4 space-x-4">
                            <!-- Botão para adicionar -->
                            <div v-if="disabledForm && TextoPadrao == 0" class="flex flex-col mt-5">
                                <button @click="disabledForm = !disabledForm" class="btn btn-base btn-square btn-success 
                                    text-white tooltip tooltip-left" data-tip="Adicionar Texto Padrão">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div v-else-if="!disabledForm && TextoPadrao == 0" class="flex flex-col mt-5">
                                <button @click="disabledForm = !disabledForm" class="btn btn-base btn-square btn-error 
                                    text-white tooltip tooltip-left" data-tip="Adicionar Texto Padrão">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <!-- Botão para editar -->
                            <div v-if="TextoPadrao != 0 && disabledForm" class="flex flex-col mt-5">
                                <button @click="disabledForm = !disabledForm" class="btn btn-base btn-square btn-success text-white tooltip tooltip-left" data-tip="Editar Texto Padrão">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            </div>
                            <div v-if="TextoPadrao != 0 && !disabledForm" class="flex flex-col mt-5">
                                <button @click="disabledForm = !disabledForm" class="btn btn-base btn-square btn-warning text-white tooltip tooltip-left" data-tip="Parar Edição">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            </div>
                            <!-- Botão para excluir -->
                            <div v-if="TextoPadrao != 0" class="flex flex-col mt-5">
                                <button @click="deletextoPadrao()" class="btn btn-base btn-square btn-error text-white tooltip tooltip-left" data-tip="Excluir Texto Padrão">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Editor de Texto Trix -->
                    <div class="w-full flex flex-col mb-4">
                        <div class="w-full flex space-x-4">
                            <div class="w-5/12 flex flex-col mb-4">
                                <label for="texto-titulo" class="mb-1">Título</label>
                                <input :disabled="disabledForm" v-model="textoTitulo" type="text" id="texto-titulo" class="input input-bordered w-full" placeholder="Informe um título para o texto" />
                            </div>

                            <div class="w-3/12 flex flex-col mb-4">
                                <label for="tipo-texto">Tipo de Texto</label>
                                <select :disabled="disabledForm" v-model="tipoTexto" class="select select-bordered " name="tipo-texto" id="tipo-texto">
                                    <option value="0" selected>Selecione</option>
                                    <option v-for="tipo, index in tipo_texto" :value="tipo.id">{{ tipo.nome }}</option>
                                </select>
                            </div>

                            <div class="w-1/12 flex flex-col mb-4">
                                <span >Ativo</span>
                                <label class="cursor-pointer">
                                    <input v-model="ativo" 
                                           :disabled="disabledForm" 
                                           @click="ativo = !ativo"
                                           type="checkbox" 
                                           class="checkbox checkbox-lg checkbox-success border-2 border-gray-400" />
                                </label>
                            </div>
                        </div>
                        
                        
                        <div class="w-full">
                            <label class="mb-1">Conteúdo</label>
                            <input id="trix" type="hidden" />
                            <trix-editor :disabled="disabledForm" input="trix" @trix-change="handleTrixChange" class="trix-content"></trix-editor>
                        </div>
                        
                        <div v-if="!disabledForm" class="w-full flex justify-end mt-4">
                            <button @click="salvarTextoPadrao" class="btn btn-success text-white">
                                <i class="fa-solid fa-save me-2"></i> Salvar
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

<style>
/* Estilos para o editor Trix */
trix-toolbar {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    border-bottom: none;
}

trix-editor {
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ced4da;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    padding: 0.5rem;
}

trix-toolbar .trix-button-group {
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    margin: 0.25rem;
}

trix-toolbar .trix-button {
    border: none;
}

trix-toolbar .trix-button.trix-active {
    background: #e9ecef;
}
</style>