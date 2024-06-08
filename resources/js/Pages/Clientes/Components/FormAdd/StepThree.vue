<script setup>
import { ref, onMounted } from 'vue'
import { vMaska } from "maska";
import { useToastr } from '@/Components/toastr';

const props = defineProps(['clienteEdit'])
const emit = defineEmits(['stepSubmit', 'formThree'])
const toastr = useToastr()

const cliente = ref(props.clienteEdit)

const respCli = ref({responsavel: '', 
                     telResp: '',
                     emailResp: '',
                     idCliente: cliente.value.id
                     })

onMounted(() => {

    if(props.clienteEdit.value != {}) {

        respCli.value.responsavel = cliente.value.responsavel.toUpperCase()
        respCli.value.telResp = cliente.value.tel_responsavel.toUpperCase()
        respCli.value.emailResp = cliente.value.email_responsavel.toUpperCase()
    }

    // console.log(cliente.value)
})

function emitStep(val) { 
    let btnSendSubmit = document.getElementById('btnSendSubmit')


    btnSendSubmit.innerHTML = 'Carregando...'
    setTimeout(() => {
        emit('stepSubumit', val)
        btnSendSubmit.innerHTML = 'Salvar'
    }, 1000);
}

function toSubmitStep() {
    if(respCli.value.responsavel == '') {
        let nomeResp = document.getElementById('responsavel')

        toastr.error('O campo Responsável é obrigatório!')
        nomeResp.focus()

    } else if(respCli.value.telResp == '') {
        let telResp = document.getElementById('tel_resp')

        toastr.error('O campo Telefone é obrigatório!')
        telResp.focus()

    } else if(respCli.value.emailResp == '') {
        let emailResp = document.getElementById('email_resp')

        toastr.error('O campo Telefone é obrigatório!')
        emailResp.focus()

    } else {
        emitStep(4)
    }
}

function sendFormThree() {
    if(respCli.value.responsavel != '' && respCli.value.telResp != '' && respCli.value.emailResp != '') {
        emit('formThree', respCli.value)
    }
}

</script>


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8">
       
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full sm:w-4/12">
                <label for="responsavel" class="block text-sm font-medium leading-6 text-gray-900">Contato / Responsável</label>
                <div class="mt-2">
                    <input type="text" name="responsavel" id="responsavel" v-model="respCli.responsavel"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

            <div class="w-full sm:w-3/12">
                <label for="tel_resp" class="block text-sm font-medium leading-6 text-gray-900">Telefone</label>
                <div class="mt-2">
                    <input type="text" name="tel_resp" id="tel_resp" v-model="respCli.telResp"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                        v-maska
                        data-maska="55 (##) # ####-####"
                    />
                </div>
            </div>

            <div class="w-full sm:w-4/12">
                <label for="email_resp" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <div class="mt-2">
                    <input type="email" name="email_resp" id="email_resp" v-model="respCli.emailResp"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            
        </div>

        
        <div class="mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4">
            <label class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="emitStep(2)">Voltar</label>
            <label id="btnSendSubmit" class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12" @click="toSubmitStep(), sendFormThree()">Salvar</label>
        </div>

    </div>
</template>