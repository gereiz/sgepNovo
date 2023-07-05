<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3'
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';

const toastr = useToastr();
const props = defineProps(['regioes', 'cidades', 'errors']);

const nomeRegiao = ref('');
const pesquRegiao = ref('');
const formRegiaoAdd = reactive({nome: '', cidade_id: 0});
const formRegiaoEdit = reactive({nome_edit: '', id_regiao: '', id_cidade: ''});

function setRegiaoData(rid,cid, d) {
    nomeRegiao.value = d
    formRegiaoEdit.nome_edit = d
    formRegiaoEdit.id_regiao = rid
    formRegiaoEdit.id_cidade = cid
}

function cadastraRegiao() {
    
    if(formRegiaoAdd.nome.length < 3) {
        toastr.error('O nome da Região deve ter no mínimo 3 caracteres!')
    } else if(formRegiaoAdd.cidade_id == 0) {
        toastr.error('A Região deve pertencer a uma Cidade!')
    } else {
        router.post('/AddRegiao', this.formRegiaoAdd)
        toastr.success('Região '+ formRegiaoAdd.nome +' cadastrada!')

        formRegiaoAdd.nome = ''
        formRegiaoAdd.cidade_id = 0
    }
    
};

function editaRegiao() {

    if(formRegiaoEdit.nome_edit.length < 3) {
        toastr.error('O nome da Região deve ter no mínimo 3 caracteres!')
    } else {
        router.post('/EditRegiao', formRegiaoEdit)
        toastr.success('Região '+ formRegiaoEdit.nome_edit +' editada para '+formRegiaoEdit.nome_edit+ ' !')
    }
   

};

function deletaRegiao() {
    router.post('/DelRegiao', formRegiaoEdit)

    toastr.success('Região '+ nomeRegiao.value +' excluída!')

};

const regioesFiltradas = computed(() => {
    let regioesFiltradas = Object.values(props.regioes).filter((regiao) => {
        return (
            regiao.nome.toLowerCase().indexOf(pesquRegiao.value.toLowerCase()) > -1
        );
    })

    return regioesFiltradas;
})


</script>

<template>
    <Head title="Regiões" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="w-2/12 h-14 flex items-center">
                    <h1 class="text-xl md:text-4xl font-bold">Regiões</h1>
                    <h1 class="text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4">{{ regioes.length }}</h1>
                </div>
                
                <div class="w-10/12 flex justify-end">
                    <label for="modal-regiao-add" class="w-28 botao-modal text-sm ">+ Nova Região</label>
                </div>
                
            </div>
            <div class="w-full md:w-4/12">
                <input v-model="pesquRegiao" placeholder="Pesquisar Região" class="w-full h-10 input input-bordered rounded-none mb-4" type="text" name="pesquisar" id="pesquisar">
            </div>

            <!-- Card dos Regiaos -->
            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body">
                    <div class="w-full flex flex-col flex-wrap md:flex-row justify-center">
                        <div v-for="(r, index) in regioesFiltradas" :key="index" class="card w-full md:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 md:mr-4">
                            <div class="card-body">
                                <div class="w-full flex justify-between flex-wrap mb-4">
                                    <div class="w-full flex justify-between">
                                        <h2 class="text-xs md:card-title">Região.: {{r.nome}}</h2>
                                        <h2 class="text-xs md:text-base font-bold text-zinc-400">ID: {{r.id}}</h2>
                                    </div>
                                </div>

                                <div class="w-full flex justify-center md:justify-start mb-4 md:mb-0">
                                        <img class="w-20 md:w-32" src="../../../../storage/app/public/img/regiao.png" alt="Regiao">
                                </div>

                                <div class="w-full card-actions justify-center md:justify-end ">
                                    <label for="modal-regiao-edit" @click="setRegiaoData(r.id, r.cidade_id, r.nome)" class="w-full md:w-28 botao-modal">Ações</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Inclusão de novo Regiao -->
            <input type="checkbox" id="modal-regiao-add" class="modal-toggle" />
            <label for="modal-regiao-add" class="modal modal-bottom sm:modal-middle cursor-pointer">
                <label class="modal-box relative" for="">
                    <h3 class="font-bold text-lg">Adicionar Nova Região</h3>
                    <form @submit.prevent="cadastraRegiao">  
                        <div class="w-full flex">
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1">Nome</span>
                                    <input v-model="formRegiaoAdd.nome" class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                                </div>
                                <div class="w-full flex flex-col">
                                    <span class="label-text ml-1">Cidade</span>
                                    <select v-model="formRegiaoAdd.cidade_id" name="cidade_id" id="cidade_id" class="select select-bordered">
                                        <option value="0" disabled selected>Seleicione a Região</option>
                                        <option v-for="c, index in cidades" :key="index" :value="c.id">{{c.nome}}</option>
                                    </select>
                                </div>
                        </div>
                        <div class="modal-action">
                            <label @click="cadastraRegiao()" for="modal-regiao-add" class="botao-modal">Salvar</label>
                        </div>
                    </form>

                </label>
            </label>

            <!-- Edição / Exclusão de Regiao -->
            <input type="checkbox" id="modal-regiao-edit" class="modal-toggle" />
            <label for="modal-regiao-edit" class="modal modal-bottom sm:modal-middle cursor-pointer">
                <label class="modal-box relative" for="">
                    <div class="h-12 border-b-2 font-bold text-center md:text-start">
                        <h1 class="">Dados da Região: {{nomeRegiao}}</h1>
                    </div>
                    <div class="h-full flex flex-col border-b-2 font-bold space-x-4 space-y-4 pb-2">
                        <div class="flex space-x-4">
                            <div class="w-full">
                                <form @submit.prevent="editaRegiao">
                                    <div class="flex mt-2">
                                      <div class="w-full flex flex-col ">
                                        <span class="label-text ml-1">Nome</span>
                                        <input v-model="formRegiaoEdit.nome_edit" class="w-full input input-bordered mb-4" type="text" >
                                      </div>
                                      <!-- <div class="w-full flex flex-col">
                                        <span class="label-text ml-1">Cidade</span>
                                            <select v-model="formRegiaoAdd.cidade_id" name="cidade_id" id="cidade_id" class="select select-bordered">
                                            <option value="0" disabled selected>Seleicione a Região</option>
                                            <option v-for="c, index in cidades" :key="index" :value="c.id">{{c.nome}}</option>
                                        </select>
                                      </div> -->
                                    </div>
           
                                    
                                    <label @click="editaRegiao()" for="modal-regiao-edit" class="botao-modal w-full bg-amber-500 hover:bg-amber-700 mb-4">Salvar Edição</label>
                                </form>
                                <span class="card-title justify-center mb-4">ou</span>
                                <label @click="deletaRegiao()" for="modal-regiao-edit" class="botao-modal w-full bg-red-500 hover:bg-red-800">Excluir Região</label>
                            </div>
                        </div>
                    </div>
                </label>
            </label>
        </div>
    </AuthenticatedLayout>
</template>
