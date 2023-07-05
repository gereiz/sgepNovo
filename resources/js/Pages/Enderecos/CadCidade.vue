<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3'
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';

const toastr = useToastr();
const props = defineProps(['cidades', 'uf', 'errors']);

const nomeCidade = ref('');
const pesqCidade = ref('');
const formCidadeAdd = reactive({nome: '', uf_id: 0}); 
const formCidadeEdit = reactive({nome_edit: '', id_cidade: ''});

function setRegiaoData(cid,ufid, d) {
    nomeCidade.value = d
    formCidadeEdit.nome_edit = d
    formCidadeEdit.id_cidade = cid
    formCidadeEdit.id_uf = ufid
}

function cadastraCidade() {

    if(formCidadeAdd.nome.length < 3) {
        toastr.error('O nome da Cidade deve ter no mínimo 3 caracteres!')
    } else if(formCidadeAdd.uf_id == 0) {
        toastr.error('A Cidade deve pertener a uma UF!')
    } else {
        router.post('/AddCidade', this.formCidadeAdd)
        toastr.success('Cidade '+ formCidadeAdd.nome +' cadastrada!')

        formCidadeAdd.nome = ''
        formCidadeAdd.uf_id = 0
    }
  
};

function editaCidade() {

    if(formCidadeEdit.nome_edit.length < 3) {
        toastr.error('O nome da Cidade deve ter no mínimo 3 caracteres!')
    } else {
        router.post('/EditCidade', formCidadeEdit)
        toastr.success('Cidade '+ formCidadeEdit.nome_edit +' editada para '+formCidadeEdit.nome_edit+ ' !')
    }
    

};

function deletaCidade() {
    router.post('/DelCidade', formCidadeEdit)

    toastr.success('Cidade '+ nomeCidade.value +' excluída!')

};

const cidadesFiltradas = computed(() => {
    let cidadesFiltradas = Object.values(props.cidades).filter((cidade) => {
        return (
            cidade.nome.toLowerCase().indexOf(pesqCidade.value.toLowerCase()) > -1
        );
    })

    return cidadesFiltradas;
})

</script>

<template>
    <Head title="Cidades" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-4/12 h-14 flex items-center">
                    <h1 class="text-xl md:text-4xl font-bold">Cidades </h1>
                    <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4">{{ cidades.length }}</h1>
                </div>
                
                <div class="w-10/12 flex justify-end">
                    <label for="modal-cidade-add" class="w-28 botao-modal text-sm ">+ Nova Cidade</label>
                </div>
                
            </div>
            <div class="w-full md:w-4/12">
                <input v-model="pesqCidade" placeholder="Pesquisar Cidade" class="w-full h-10 input input-bordered rounded-none mb-4" type="text" name="pesquisar" id="pesquisar">
            </div>

            <!-- Card dos Regiaos -->
            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap md:flex-row justify-center">
                        <div v-for="(c, index) in cidadesFiltradas" :key="index" class="card w-full md:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 md:mr-4">
                            <div class="card-body">
                                <div class="w-full flex justify-between flex-wrap mb-4">
                                    <div class="w-full flex justify-between">
                                        <h2 class="text-xs md:card-title">Cidade.: {{c.nome}}</h2>
                                        <h2 class="text-xs md:text-base font-bold text-zinc-400">ID: {{c.id}}</h2>
                                    </div>
                                </div>

                                <div class="w-full flex justify-center md:justify-start mb-4 md:mb-0">
                                        <img class="w-20 md:w-32" src="../../../../storage/app/public/img/cidade.png" alt="Regiao">
                                </div>

                                <div class="w-full card-actions justify-center md:justify-end ">
                                    <label for="modal-cidade-edit" @click="setRegiaoData(c.id, c.uf_id, c.nome)" class="w-full md:w-28 botao-modal">Ações</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Inclusão de novo Regiao -->
            <input type="checkbox" id="modal-cidade-add" class="modal-toggle" />
            <label for="modal-cidade-add" class="modal modal-bottom sm:modal-middle cursor-pointer">
                <label class="modal-box relative" for="">
                    <h3 class="font-bold text-lg">Adicionar Nova Cidade</h3>
                    <form @submit.prevent="cadastraCidade">  
                        <div class="w-full flex">
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1">Nome</span>
                                    <input v-model="formCidadeAdd.nome" class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1">UF</span>
                                    <select v-model="formCidadeAdd.uf_id" name="uf_id" id="uf_id" class="select select-bordered">
                                        <option value="0" disabled required>Seleicione a Cidade</option>
                                        <option v-for="u, index in uf" :key="index" :value="u.id">{{u.nome}}</option>
                                    </select>
                                </div>
                        </div>
                        <div class="modal-action">
                            <label @click="cadastraCidade()" for="modal-cidade-add" class="botao-modal">Salvar</label>
                        </div>
                    </form>

                </label>
            </label>

            <!-- Edição / Exclusão de Regiao -->
            <input type="checkbox" id="modal-cidade-edit" class="modal-toggle" />
            <label for="modal-cidade-edit" class="modal modal-bottom sm:modal-middle cursor-pointer">
                <label class="modal-box relative" for="">
                    <div class="h-12 border-b-2 font-bold text-center md:text-start">
                        <h1 class="">Dados da Cidade: {{nomeCidade}}</h1>
                    </div>
                    <div class="h-full flex flex-col border-b-2 font-bold space-x-4 space-y-4 pb-2">
                        <div class="flex space-x-4">
                            <div class="w-full">
                                <form @submit.prevent="editaCidade">
                                    <div class="flex mt-2">
                                      <div class="w-full flex flex-col ">
                                        <span class="label-text ml-1">Nome</span>
                                        <input v-model="formCidadeEdit.nome_edit" class="w-full input input-bordered mb-4" type="text" >
                                      </div>
                                      <!-- <div class="w-full flex flex-col">
                                        <span class="label-text ml-1">Cidade</span>
                                            <select v-model="formCidadeAdd.uf_id" name="uf_id" id="uf_id" class="select select-bordered">
                                            <option value="0" disabled selected>Seleicione a Região</option>
                                            <option v-for="c, index in cidades" :key="index" :value="c.id">{{c.nome}}</option>
                                        </select>
                                      </div> -->
                                    </div>
           
                                    
                                    <label @click="editaCidade()" for="modal-cidade-edit" class="botao-modal w-full bg-amber-500 hover:bg-amber-700 mb-4">Salvar Edição</label>
                                </form>
                                <span class="card-title justify-center mb-4">ou</span>
                                <label @click="deletaCidade()" for="modal-cidade-edit" class="botao-modal w-full bg-red-500 hover:bg-red-800">Excluir Região</label>
                            </div>
                        </div>
                    </div>
                </label>
            </label>
        </div>
    </AuthenticatedLayout>
</template>
