<script setup>

import { ref, onMounted, watch } from 'vue';
import { vMaska } from "maska";
import { useToastr } from '@/Components/toastr';

const props = defineProps(['painel'])
const emit = defineEmits(['step1', 'formOne'])
const toastr = useToastr()

const bairros = ref([]);
const cidades = ref([]);
const ufs = ref([]);


onMounted(() => {
    axios.get('/dtGetUf')
    .then((res) => { 
        ufs.value = res.data

    })

})


const endPain = ref({ender: '',
                    numero: '',
                    referencia: '',
                    uf: 0,
                    cidade: 0,
                    bairro: 0,
                    cep: '',
                    latitude: '',
                    longitude: ''
                });


function getCidades() {
    axios.post('/dtGetCidades', {uf: endPain.value.uf})
        .then((res) => {
            cidades.value = res.data
        })
        .catch((err) => {
            console.log(err)
        })
    
}

function getBairros() {
    axios.post('/dtGetBairros', {cidade: endPain.value.cidade})
        .then((res) => {
            bairros.value = res.data
        })
        .catch((err) =>  {
            console.log(err)
        })
}

function emitStep(val) {
    let btnSendOne = document.getElementById('btnSendOne')
    
    btnSendOne.innerHTML = 'Carregando...'
    setTimeout(() => {
        emit('step1', val)
        btnSendOne.innerHTML = 'Avançar'
    }, 1000);
}

function toSteptwo() {
    if(endPain.value.ender =='') {
        let endereco = document.getElementById('endereco')

        toastr.error('O campo Endereço é obrigatório!')
        endereco.focus()
    
    } else if(endPain.value.numero == '') {
        let numero = document.getElementById('numero')

        toastr.error('O campo Número é obrigatório!')
        numero.focus()

    } else if(endPain.value.uf === 0) {
        let uf = document.getElementById('uf')

        toastr.error('É necessário selecionar uma UF!')
        uf.focus()

    } else if(endPain.value.cidade === 0) {
        let cidade = document.getElementById('cidade')

        toastr.error('É necessário selecionar uma Cidade!')
        cidade.focus()

    } else if(endPain.value.bairro === 0) {
        let bairro = document.getElementById('bairro')

        toastr.error('É necessário selecionar um Bairro!')
        bairro.focus()

    } else if(endPain.value.latitude == '') {
        let latitude = document.getElementById('latitude')

        toastr.error('É necessário informar um latitude!')
        latitude.focus()

    } else if(endPain.value.longitude == '') {
        let longitude = document.getElementById('longitude')

        toastr.error('É necessário informar uma longitude!')
        longitude.focus()

    } else {
        emitStep(2)
    }

}

function sendFormOne() {
    if(endPain.value.ender != '' && endPain.value.numero != '' && endPain.value.uf != 0 && endPain.value.cidade != 0 && endPain.value.bairro != 0 && endPain.value.latitude != '' && endPain.value.longitude != ''){
        emit('formOne', endPain.value)
    }
}

watch(() => props.painel, (val) => {
    endPain.value.ender = val[0].logradouro ? val[0].logradouro : ''
    endPain.value.numero = val[0].numero ? val[0].numero : ''
    endPain.value.referencia = val[0].ponto_referencia ? val[0].ponto_referencia : ''
    endPain.value.bairro = val[0].bairro_id ? val[0].bairro_id : ''
    endPain.value.latitude = val[0].latitude ? val[0].latitude : ''
    endPain.value.longitude = val[0].longitude ? val[0].longitude : ''
    
})


</script>


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8">
        <p class="mt-3 text-sm leading-6 text-gray-600">`Preencha os dados de localizção do Painel.</p>
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full sm:w-6/12">
                <label for="endereco" class="block text-sm font-medium leading-6 text-gray-900">Endereço</label>
                <div class="mt-2">
                    <input type="text" name="endereco" id="endereco" v-model="endPain.ender"
                           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

            <div class="w-full sm:w-1/12">
                <label for="numero" class="block text-sm font-medium leading-6 text-gray-900">Número</label>
                <div class="mt-2">
                    <input type="text" name="numero" id="numero" v-model="endPain.numero"
                           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

            <div class="w-full sm:w-3/12">
                <label for="referencia" class="block text-sm font-medium leading-6 text-gray-900">Ponto de Referência</label>
                <div class="mt-2">
                    <input type="text" name="referencia" id="referencia" v-model="endPain.referencia"
                           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

        </div>

        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">

            <div class="w-full sm:w-3/12">
                <label for="uf" class="block text-sm font-medium leading-6 text-gray-900">UF</label>
                <div class="mt-2">
                    <select id="uf" name="uf" v-model="endPain.uf" @change="getCidades()"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="0" disabled selected>Selecione</option>
                        <option v-for="(uf, index) in ufs" :key="index" :value="uf.id">{{ uf.nome }}</option>
                    </select>
                </div>
            </div>
         
            <div class="w-full sm:w-4/12">
                <label for="cidade" class="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
                <div class="mt-2">
                    <select id="cidade" name="cidade" v-model="endPain.cidade" :disabled="endPain.uf == 0" @change="getBairros()"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="0" disabled selected>Selecione</option>
                        <option v-for="(cid, index) in cidades" :key="index" :value="cid.id">{{ cid.nome }}</option>
                    </select>
                </div>
            </div> 

            <div class="w-full sm:w-3/12">
                <label for="bairro" class="block text-sm font-medium leading-6 text-gray-900">Bairro</label>
                <div class="mt-2">
                    <select id="bairro" name="bairro" v-model="endPain.bairro" :disabled="endPain.cidade == 0" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="0" disabled selected>Selecione</option>
                        <option v-for="(bai, index) in bairros" :key="index" :value="bai.id">{{ bai.nome }}</option>
                    </select>
                </div>
            </div>
        </div>


        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            
        
            <div class="w-full sm:w-4/12">
                <label for="latitude" class="block text-sm font-medium leading-6 text-gray-900">Latitude</label>
                <div class="mt-2">
                    <input type="text" name="latitude" id="latitude" v-model="endPain.latitude"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            <div class="w-full sm:w-4/12">
                <label for="longitude" class="block text-sm font-medium leading-6 text-gray-900">Longitude</label>
                <div class="mt-2">
                    <input type="text" name="longitude" id="longitude" v-model="endPain.longitude"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"   
                    />
                </div>
            </div>

        </div>

        <div class="mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4">
            <label class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="emitStep(0)">Cancelar</label>
            <label id="btnSendOne" class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12" @click="toSteptwo(), sendFormOne()">Avançar</label>
        </div>

    </div>
</template>