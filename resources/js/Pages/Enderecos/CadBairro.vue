<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3'
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';

const toastr = useToastr();
const props = defineProps(['bairros', 'regioes', 'errors']);

const nomeBairro = ref('');
const pesqBairro = ref('');
const formBairroAdd = reactive({nome: '', regiao_id: 0});
const formBairroEdit = reactive({nome_edit: '', id_bairro: ''});


function setBairroData(id, d) {
    nomeBairro.value = d
    formBairroEdit.nome_edit = d
    formBairroEdit.id_bairro = id
}

function cadastraBairro() {
    if(formBairroAdd.nome == '' || formBairroAdd.nome.length < 3) {
        toastr.error('O nome do Bairro deve ter no mínimo 3 caracteres!')
    } else if(formBairroAdd.regiao_id == 0) {
        toastr.error('O Bairro deve pertencer a uma região!') 
        formBairroAdd.regiao_id = 0
    } else {
        router.post('/AddBairro', this.formBairroAdd)
        if(props.errors.regiao_id == undefined && props.errors.nome == undefined) {
            toastr.success('Bairro '+ formBairroAdd.nome +' cadastrado!')
            formBairroAdd.nome = ''
            formBairroAdd.regiao_id = 0
        }
        
    }
    
};

function editaBairro() {

    if(formBairroEdit.nome_edit.length <3) {
        toastr.error('O nome do Bairro deve ter no mínimo 3 caracteres!')
    } else {
        router.post('/EditBairro', formBairroEdit)
        toastr.success('Bairro '+ formBairroEdit.nome_edit +' editado para '+formBairroEdit.nome_edit+ ' !')
    }

    
};

function deletaBairro() {
    router.post('/DelBairro', formBairroEdit)
    toastr.success('Bairro '+ nomeBairro.value +' excluído!')
};

const bairrosFiltrados = computed(() => {
    let bairrosFiltrados = Object.values(props.bairros).filter((bairro) => {
        return (
            bairro.nome.toLowerCase().indexOf(pesqBairro.value.toLowerCase()) > -1
        );
    })

    return bairrosFiltrados;
})

// onMounted(() =>{
//     // toastr.info('Tudo ok')
    
//     console.log(props.errors.length)
//     // console.log(bairrosFiltrados.value)
// })


</script>

<template>
    <Head title="Bairros" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-2/12 h-14 flex items-center">
                    <h1 class="text-xl md:text-4xl font-bold">Bairros</h1>
                    <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4">{{ bairros.length }}</h1>
                </div>
                
                <div class="w-10/12 flex justify-end">
                    <label for="modal-bairro-add" class="w-28 botao-modal text-sm ">+ Novo Bairro</label>
                </div>
                
            </div>
            <div class="w-full md:w-4/12">
                <input v-model="pesqBairro" placeholder="Pesquisar Bairro" class="w-full h-10 input input-bordered rounded-none mb-4" type="text" name="pesquisar" id="pesquisar">
            </div>

            <!-- Card dos Bairros -->
            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap md:flex-row justify-center">
                        <div v-for="(b, index) in bairrosFiltrados" :key="index" class="card w-full md:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 md:mr-4">
                            <div class="card-body">
                                <div class="w-full flex justify-between flex-wrap mb-4">
                                    <div class="w-full flex justify-between">
                                        <h2 class="text-xs md:card-title">Bairro.: {{b.nome}}</h2>
                                        <h2 class="text-xs md:text-base font-bold text-zinc-400">ID: {{b.id}}</h2>
                                    </div>
                                </div>

                                <div class="w-full flex justify-center md:justify-start mb-4 md:mb-0">
                                        <img class="w-20 md:w-32" src="../../../../storage/app/public/img/bairro.png" alt="Bairro">
                                </div>

                                <div class="w-full card-actions justify-center md:justify-end ">
                                    <label for="modal-bairro-edit" @click="setBairroData(b.id, b.nome)" class="w-full md:w-28 botao-modal">Ações</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>

            <!-- Inclusão de novo Bairro -->
            <input type="checkbox" id="modal-bairro-add" class="modal-toggle" />
            <label for="modal-bairro-add" class="modal modal-bottom sm:modal-middle cursor-pointer">
                <label class="modal-box relative" for="">
                    <h3 class="font-bold text-lg">Adicionar Novo Bairro</h3>
                    <form @submit.prevent="cadastraBairro">  
                        <div class="w-full flex">
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1">Nome</span>
                                    <input v-model="formBairroAdd.nome" class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1">Região</span>
                                    <select v-model="formBairroAdd.regiao_id" name="regiao_id" id="regiao_id" class="select select-bordered">
                                        <option value="0">Seleicione a Região</option>
                                        <option v-for="r, index in regioes" :key="index" :value="r.id">{{r.nome}}</option>
                                    </select>
                                </div>
                        </div>
                        <div class="modal-action">
                            <label @click="cadastraBairro()" for="modal-bairro-add" class="botao-modal">Salvar</label>
                        </div>
                    </form>

                </label>
            </label>

            <!-- Edição / Exclusão de Bairro -->
            <input type="checkbox" id="modal-bairro-edit" class="modal-toggle" />
            <label for="modal-bairro-edit" class="modal modal-bottom sm:modal-middle cursor-pointer">
                <label class="modal-box relative" for="">
                    <div class="h-12 border-b-2 font-bold text-center md:text-start">
                        <h1 class="">Dados do Bairro: {{nomeBairro}}</h1>
                    </div>
                    <div class="h-full flex flex-col border-b-2 font-bold text-center md:text-start space-x-4 space-y-4 pb-2">
                        <div class="flex space-x-4">
                            <div class="w-full">
                                <form @submit.prevent="editaBairro">
                                    <span class="label-text ml-1">Nome</span>
                                    <input v-model="formBairroEdit.nome_edit" class="w-full input input-bordered mb-4" type="text" >
                                    <label @click="editaBairro()" for="modal-bairro-edit" class="botao-modal w-full bg-amber-500 hover:bg-amber-700 mb-4">Salvar Edição</label>
                                </form>
                                <span class="card-title justify-center mb-4">ou</span>
                                <label @click="deletaBairro()" for="modal-bairro-edit" class="botao-modal w-full bg-red-500 hover:bg-red-800">Excluir Bairro</label>
                            </div>
                        </div>
                    </div>
                </label>
            </label>
        </div>
    </AuthenticatedLayout>
</template>

<!-- <script>
export default {
//   components: { ToastSuccess },
    props: ['bairros', 'regioes', 'teste'],
    data() {
        return{
            nomeBairro: '',
            pesqBairro: '',
            formBairroAdd: {
                nome: null,
                regiao_id: null
            },
            formBairroEdit: {
                nome_edit: null,
                id_bairro: null
            },
            closeToast: false
        }
    },

    methods: {
        setBairroData(id, d) {
            this.nomeBairro = d
            this.formBairroEdit.nome_edit = d
            this.formBairroEdit.id_bairro = id
        },

        cadastraBairro() {
            router.post('/AddBairro', this.formBairroAdd)
            this.formBairroAdd.nome = ''
            this.formBairroAdd.regiao_id = 0
        },
        
        editaBairro() {
            router.post('/EditBairro', this.formBairroEdit)

        },

        deletaBairro() {
            router.post('/DelBairro', this.formBairroEdit)

        },

    },

    computed: {
        bairrosFiltrados() {
            
            let bairrosFiltrados = Object.values(this.bairros).filter((bairro) => {
                return (
                    bairro.nome.toLowerCase().indexOf(this.pesqBairro.toLowerCase()) > -1
                );
            })

            return bairrosFiltrados;
        },
    },
               
    onMounted() {
        toastr.info('Sucesso');
    },

    watch: {
        teste() {
            console.log(this.teste)
        }
    },

}

</script> -->