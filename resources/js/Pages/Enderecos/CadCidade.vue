<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3'
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';

import CardRegistro from '@/Components/Cards/CardRegistro.vue';
import CardContainer from '@/Components/Cards/CardContainer.vue';
import HeaderCadastro from '@/Components/Layout/HeaderCadastro.vue';
import CardForm from '@/Components/Cards/CardForm.vue';
import FormAddCidade from './Components/FormAddCidade.vue';

const toastr = useToastr();
const props = defineProps(['cidades', 'uf', 'errors']);

const nomeCidade = ref('');
const pesqCidade = ref('');
const formCidadeAdd = reactive({nome: '', uf_id: 0}); 
const formCidadeEdit = reactive({nome_edit: '', id_cidade: ''});

const cidades = ref(props.cidades);

function setRegiaoData(cid,ufid, d) {
    nomeCidade.value = d
    formCidadeEdit.nome_edit = d
    formCidadeEdit.id_cidade = cid
    formCidadeEdit.id_uf = ufid
}

function cadastraCidade(ev) {

    console.log(ev)

    axios.post('/AddCidade', ev)
        .then((res) => {
            toastr.success('Cidade '+ ev.nome +' adicionada com sucesso!')
        })
        .catch((err) => {
            toastr.error('Erro ao adicionar Cidade!')
        })
    router.reload()
   

  
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

const getPesquisa = (pesq) => {
    pesqCidade.value = pesq
}



</script>

<template>
    <Head title="Cidades" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            
            <!-- Cabeçalho e barra de Pesquisa -->
            <HeaderCadastro titulo="Cidades" :dados="cidades" @pesquisa="getPesquisa" />

            <!-- Card das Cidades -->
            <CardContainer>
                <CardRegistro 
                    :selection="cidadesFiltradas"
                    imagem='cidade.png'
                />
            </CardContainer>


            <!-- Inclusão de nova cidade -->
            <CardForm titulo="Adicionar Cidade">
                <FormAddCidade :dados="formCidadeAdd" :select="uf" @cidadeAdd="cadastraCidade"/>
            </CardForm>
            

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
