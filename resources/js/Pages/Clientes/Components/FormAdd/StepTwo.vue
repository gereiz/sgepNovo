<script setup>

import { ref, onMounted } from 'vue';
import { vMaska } from "maska";
import { useToastr } from '@/Components/toastr';

const props = defineProps(['clienteEdit'])
const emit = defineEmits(['step3', 'formTwo'])
const toastr = useToastr()

const bairros = ref([]);
const cidades = ref([]); 
const ufs = ref([]);

const cliente = ref (props.clienteEdit)


const endCli = ref({ender: '',
                    numero: '',
                    uf: 0,
                    cidade: 0,
                    bairro: 0,
                    cep: ''
                });

onMounted(() => {
    axios.get('/dtGetUf')
    .then((res) => { 
        ufs.value = res.data

    })

    // Alimenta os campos deendereço com os dados coletados no stepOne
    if(props.clienteEdit.value != {}) {
        endCli.value.ender = cliente.value.endereco.toUpperCase()
        endCli.value.numero = cliente.value.num.toUpperCase()
        endCli.value.uf = cliente.value.uf.toUpperCase()
        getCidades()
        endCli.value.cidade = cliente.value.cidade.toUpperCase()
        getBairros()
        endCli.value.bairro = cliente.value.bairro.toUpperCase()
        endCli.value.cep = cliente.value.cep.toUpperCase()
    }

})


function getCidades() {
    axios.post('/dtGetCidades', {uf: endCli.value.uf})
        .then((res) => {
            cidades.value = res.data
        })
        .catch((err) => {
            console.log(err)
        })
    
}

function getBairros() {
    axios.post('/dtGetBairros', {cidade: endCli.value.cidade})
        .then((res) => {
            bairros.value = res.data
        })
        .catch((err) =>  {
            console.log(err)
        })
}

function emitStep(val) {
    let btnSendTwo = document.getElementById('btnSendTwo')
    
    btnSendTwo.innerHTML = 'Carregando...'
    setTimeout(() => {
        emit('step3', val)
        btnSendTwo.innerHTML = 'Avançar'
    }, 1000);
}

function toStepTheree() {
    if(endCli.value.ender =='') {
        let endereco = document.getElementById('endereco')

        toastr.error('O campo Endereço é obrigatório!')
        endereco.focus()
    
    } else if(endCli.value.numero == '') {
        let numero = document.getElementById('numero')

        toastr.error('O campo Número é obrigatório!')
        numero.focus()

    } else if(endCli.value.uf === 0) {
        let uf = document.getElementById('uf')

        toastr.error('É necessário selecionar uma UF!')
        uf.focus()

    } else if(endCli.value.cidade === 0) {
        let cidade = document.getElementById('cidade')

        toastr.error('É necessário selecionar uma Cidade!')
        cidade.focus()

    } else if(endCli.value.bairro === 0) {
        let bairro = document.getElementById('bairro')

        toastr.error('É necessário selecionar um Bairro!')
        bairro.focus()

    } else if(endCli.value.cep == '') {
        let cep = document.getElementById('cep')

        toastr.error('É necessário informar um CEP!')
        cep.focus()

    } else {
        emitStep(3)
    }
    


}

function sendFormTwo() {
    if(endCli.value.ender != '' && endCli.value.numero != '' && endCli.value.uf != 0 && endCli.value.cidade != 0 && endCli.value.bairro != 0 && endCli.value.cep != ''){
        emit('formTwo', endCli.value)
    }
}



</script>


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8">
       
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full sm:w-9/12">
                <label for="endereco" class="block text-sm font-medium leading-6 text-gray-900">Endereço</label>
                <div class="mt-2">
                    <input type="text" name="endereco" id="endereco" v-model="endCli.ender"
                           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

            <div class="w-full sm:w-1/12">
                <label for="numero" class="block text-sm font-medium leading-6 text-gray-900">Número</label>
                <div class="mt-2">
                    <input type="text" name="numero" id="numero" v-model="endCli.numero"
                           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

        </div>

        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">

            <div class="w-full sm:w-4/12">
                <label for="uf" class="block text-sm font-medium leading-6 text-gray-900">UF</label>
                <div class="mt-2">
                    <select id="uf" name="uf" v-model="endCli.uf" @change="getCidades()"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="0" disabled selected>Selecione</option>
                        <option v-for="(uf, index) in ufs" :key="index" :value="uf.id">{{ uf.nome }}</option>
                    </select>
                </div>
            </div>
         
            <div class="w-full sm:w-6/12">
                <label for="cidade" class="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
                <div class="mt-2">
                    <select id="cidade" name="cidade" v-model="endCli.cidade" :disabled="endCli.uf == 0" @change="getBairros()"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="0" disabled selected>Selecione</option>
                        <option v-for="(cid, index) in cidades" :key="index" :value="cid.id">{{ cid.nome }}</option>
                    </select>
                </div>
            </div> 
        </div>


        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">

            <div class="w-full sm:w-6/12">
                <label for="bairro" class="block text-sm font-medium leading-6 text-gray-900">Bairro</label>
                <div class="mt-2">
                    <select id="bairro" name="bairro" v-model="endCli.bairro" :disabled="endCli.cidade == 0" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="0" disabled selected>Selecione</option>
                        <option v-for="(bai, index) in bairros" :key="index" :value="bai.id">{{ bai.nome }}</option>
                    </select>
                </div>
            </div>


            <div class="w-full sm:w-4/12">
                <label for="cep" class="block text-sm font-medium leading-6 text-gray-900">CEP</label>
                <div class="mt-2">
                    <input type="text" name="cep" id="cep" v-model="endCli.cep"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                        v-maska
                        data-maska="##.###-###"
                    />
                </div>
            </div>

        </div>

        <div class="mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4">
            <label class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="emitStep(1)">Voltar</label>
            <label id="btnSendTwo" class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12" @click="toStepTheree(), sendFormTwo()">Avançar</label>
        </div>

    </div>
</template>