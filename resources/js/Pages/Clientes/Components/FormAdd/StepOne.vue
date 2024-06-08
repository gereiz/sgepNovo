<script setup>
import { ref, onMounted, watch } from 'vue';
import { vMaska } from 'maska';
import { useToastr } from '@/Components/toastr';
import { CodeBracketIcon } from '@heroicons/vue/20/solid';

const props = defineProps(['clienteEdit'])
const emit = defineEmits(['step2', 'formOne'])
const toastr = useToastr()


const cadCli = ref ({r_social: '',
                     n_fantasia: '',
                     cpf_cnpj: '',
                     insc_est: ''}); 


// Alimenta os campos com informações do cliente para edição
watch(() => props.clienteEdit, (val) => {
    
    cadCli.value.r_social = val.razao_social ? val.razao_social.toUpperCase() : ''
    cadCli.value.n_fantasia = val.nome_fantasia ? val.nome_fantasia.toUpperCase() : ''
    cadCli.value.cpf_cnpj = val.cpf_cnpj ? val.cpf_cnpj.toUpperCase() : ''
    cadCli.value.insc_est = val.nro_insc ? val.nro_insc.toUpperCase() : ''

})

function emitStep(val) {
    let btnSendOne = document.getElementById('btnSendOne')

    btnSendOne.innerHTML = 'Carregando...'
    setTimeout(() => {
        emit('step2', val)
        btnSendOne.innerHTML = 'Avançar'
    }, 1000);
}

function toSteptwo() {
    if(cadCli.value.r_social == '') {
        let rSocial = document.getElementById('razao_social')

        toastr.error('O campo Razão Social é obrigatório!')
        rSocial.focus()
    
    } else if(cadCli.value.n_fantasia == '') {
        let nFantasia = document.getElementById('nome_fantasia')

        toastr.error('O campo Nome Fantasia é obrigatório!')
        nFantasia.focus()

    } else if(cadCli.value.cpf_cnpj ==  '') {
        let cpfCnpj = document.getElementById('cpf_cnpj')

        toastr.error('O campo CPF/CNPJ é obrigatório!')
        cpfCnpj.focus()
    
    } else if(cadCli.value.insc_est == '') {
        let  inscEst = document.getElementById('insc_est')

        toastr.error('O campo Inscrição Estadual é obrigatório!')
        inscEst.focus()

    } else {
        emitStep(2)
    }


}

function sendFormOne() {
    if(cadCli.value.r_social != '' && cadCli.value.n_fantasia != '' && cadCli.value.cpf_cnpj != '' && cadCli.value.insc_est != '') {
        emit('formOne', cadCli.value)
    }
}



</script> 


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8">
       
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full sm:w-5/12">
                <label for="razao_social" class="block text-sm font-medium leading-6 text-gray-900">Razão Social</label>
                <div class="mt-2">
                    <input type="text" 
                        name="razao_social" 
                        id="razao_social" 
                        v-model="cadCli.r_social"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            <div class="w-full sm:w-5/12">
                <label for="nome_fantasia" class="block text-sm font-medium leading-6 text-gray-900">Nome Fantasia</label>
                <div class="mt-2">
                    <input type="text" 
                           name="nome_fantasia" 
                           id="nome_fantasia" 
                           v-model="cadCli.n_fantasia"
                           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>
        </div>
        
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full  sm:w-5/12">
                <label for="cpf_cnpj" class="block text-sm font-medium leading-6 text-gray-900">CPF / CNPJ</label>
                <div class="mt-2">
                    <input type="text" 
                        name="cpf_cnpj" 
                        id="cpf_cnpj" 
                        v-model="cadCli.cpf_cnpj"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                        v-maska
                        data-maska="[
                                '###.###.###-##',
                                '##.###.###/####-##'
                        ]"
                    />
                </div>
            </div>

            <div class="w-full sm:w-5/12">
                <label for="insc_est" class="block text-sm font-medium leading-6 text-gray-900">Inscrição Estadual</label>
                <div class="mt-2">
                    <input type="text" 
                           name="insc_est" 
                           id="insc_est"
                           v-model="cadCli.insc_est"
                           class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>
        </div>
       
        <div class="mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4">
            <label class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="emitStep(0)">Cancelar</label>
            <label id="btnSendOne" class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12" @click="toSteptwo(), sendFormOne()">Avançar</label>
        </div>

    </div>
</template>