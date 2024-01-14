<script setup>
import { PhotoIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import { ref, onMounted, watch} from 'vue';
import { useForm } from '@inertiajs/vue3';
import { vMaska } from "maska";
import { useToastr } from '@/Components/toastr';

const props = defineProps(['painel'])
const emit = defineEmits(['step1', 'formOne'])
const toastr = useToastr()

const painelEdit = ref (props.painel)


const form = useForm({ident: null,
                       ident_ant: null,
                       cadan: null,
                       dim: null,
                       dimLona: null,
                       posicao: null,
                       tipo: null,
                       imagem: null,
                       idPainel: null


})

onMounted(() => {
    if(props.painel.value != {}) {
        form.idPainel = painelEdit.value[0].id
        form.ident = painelEdit.value[0].identificacao
        form.ident_ant = painelEdit.value[0].ident_antiga
        form.cadan = painelEdit.value[0].cadan
        form.dim = painelEdit.value[0].dimensao
        form.dimLona = painelEdit.value[0].dimensao_lona
        form.posicao = painelEdit.value[0].posicao
        form.tipo = painelEdit.value[0].tipo
       
} 
})
 

function emitStep(val) {
    let btnSendTwo = document.getElementById('btnSendTwo')
    
    btnSendTwo.innerHTML = 'Carregando...'
    setTimeout(() => {
        emit('step2', val)
        btnSendTwo.innerHTML = 'Avançar'
    }, 1000);
}

function sendFormTwo() {
    if(form.ident != null && form.ident_ant != null && form.cadan != null && form.posicao != null && form.tipo != null && form.imagem != null ){
        emit('formTwo', form)
    }

    console.log(form.idPainel)
}

function toSubmitStep() {
    if(form.ident == null) {
        let ident = document.getElementById('ident')

        toastr.error('O campo Identificação é obrigatório!')
        ident.focus()

    } else if(form.ident_ant == null) {
        let identAnt = document.getElementById('ident_ant')

        toastr.error('O campo Ident. Antiga é obrigatório!')
        identAnt.focus()

    } else if(form.cadan == null) {
        let cadan = document.getElementById('cadan')

        toastr.error('O campo Cadan é obrigatório!')
        cadan.focus()

    } else if(form.dim == null) {
        let dim = document.getElementById('dimensao')

        toastr.error('O campo Dimensão é obrigatório!')
        dim.focus()

    } else if(form.dimLona == null) {
        let dimLona = document.getElementById('dim_lona')

        toastr.error('O campo Dimensão Lona é obrigatório!')
        dimLona.focus()

    } else if(form.posicao == null) {
        let posicao = document.getElementById('posicao')

        toastr.error('O campo Posição é obrigatório!')
        posicao.focus()

    } else if(form.tipo == null) {
        let tipo = document.getElementById('tipo')

        toastr.error('O campo Tipo é obrigatório!')
        tipo.focus()

    } else if(form.imagem == null) {
        let imagem = document.getElementById('imagem')

        toastr.error('O campo Imagem é obrigatório!')
        imagem.focus()

    } else {
        emitStep(4)
    }
}


</script>

<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8">
        <p class="mt-3 text-sm leading-6 text-gray-600">Preencha os dados técnicos do Painel.</p>
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full sm:w-3/12">
                <label for="ident" class="block text-sm font-medium leading-6 text-gray-900">Identificação</label>
                <div class="mt-2">
                    <input type="number" name="ident" id="ident" v-model="form.ident"
                           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

            <div class="w-full sm:w-3/12">
                <label for="ident_ant" class="block text-sm font-medium leading-6 text-gray-900">Ident. Antiga</label>
                <div class="mt-2">
                    <input type="text" name="ident_ant" id="ident_ant" v-model="form.ident_ant"
                           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

            <div class="w-full sm:w-4/12">
                <label for="cadan" class="block text-sm font-medium leading-6 text-gray-900">Cadan</label>
                <div class="mt-2">
                    <input type="text" name="cadan" id="cadan" v-model="form.cadan"
                           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

    
        </div>

        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">

            <div class="w-full sm:w-2/12">
                <label for="dimensao" class="block text-sm font-medium leading-6 text-gray-900">Dimensão</label>
                <div class="mt-2">
                    <input type="text" name="dimensao" id="dimensao" v-model="form.dim"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            <div class="w-full sm:w-2/12">
                <label for="dim_lona" class="block text-sm font-medium leading-6 text-gray-900">Dimensão Lona</label>
                <div class="mt-2">
                    <input type="text" name="dim_lona" id="dim_lona" v-model="form.dimLona"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            <div class="w-full sm:w-2/12">
                <label for="posicao" class="block text-sm font-medium leading-6 text-gray-900">Posição</label>
                <div class="mt-2">
                    <input type="text" name="posicao" id="posicao" v-model="form.posicao"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            <div class="w-full sm:w-3/12">
                <label for="tipo" class="block text-sm font-medium leading-6 text-gray-900">Tipo</label>
                <div class="mt-2">
                    <select id="tipo" name="tipo" v-model="form.tipo"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="0" disabled selected>Selecione</option>
                        <option value="1">Nobre</option>
                        <option value="2">Convencional</option>
                        
                    </select>
                </div>
            </div>
           
        </div>


        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">

            <div class="w-full sm:w-10/12">
                <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">Imagem do Painel</label>
                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div class="text-center">
                        <PhotoIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                        <div class="mt-4 flex text-sm leading-6 text-gray-600">
                            <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                <span>Selecione um arquivo</span>
                                <input id="file-upload" name="file-upload" type="file" class="sr-only" @input="form.imagem = $event.target.files[0]"/>
                            </label>
                            <p class="pl-1">ou arraste e solte aqui</p>
                        </div>
                        <p class="text-xs leading-5 text-gray-600">PNG, JPG. Máx.: 10MB</p>
                    </div>
                </div>
            </div>

        </div>

        <div class="mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4">
            <label class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="emitStep(1)">Voltar</label>
            <label id="btnSendTwo" class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12" @click="toSubmitStep(), sendFormTwo()">Avançar</label>
        </div>

    </div>
</template>
  
