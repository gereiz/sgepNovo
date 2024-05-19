<script setup>
import { ref, onMounted, watch } from 'vue';
import { vMaska } from 'maska';
import { useToastr } from '@/Components/toastr';
import { defineProps, defineEmits } from 'vue';
import { cashBR } from '@/functions';

const props = defineProps(['usuario', 'funcoes'])
const emit = defineEmits(['closeEdit', 'sendFormUsu'])
const toastr = useToastr()

const nome_usuario = ref(props.usuario.name)
const email_usuario = ref(props.usuario.email)
const senha_usuario = ref(props.usuario.password)
const funcao_usuario = ref(props.usuario.function)
const id_usuario = ref(props.usuario.id)


function closeAdd(val){
    emit('closeEdit', val)
}

const cadUsu = ref ({nome_usuario: nome_usuario,
                    email_usuario: email_usuario,
                    senha_usuario: senha_usuario,
                    funcao_usuario: funcao_usuario,
                    id_usuario: id_usuario
                    }); 
 

function emitStep(val) {
    let btnSendFunc = document.getElementById('btnSendFunc')

    btnSendFunc.innerHTML = 'Carregando...'
    setTimeout(() => {
        btnSendFunc.innerHTML = 'Salvar'
    }, 1000);
}



function sendFormUsu() {
    if(cadUsu.nome_usuario != '' && cadUsu.email_usuario != '' && cadUsu.senha_usuario != '' && cadUsu.funcao_usuario != '') {
        emit('sendFormUsu', cadUsu.value)
    }
}



</script> 


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8">
       
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-10/12 sm:w-5/12">
                <label for="nome_usuario" class="block text-sm font-medium leading-6 text-gray-900">Nome</label>
                <div class="mt-2">
                    <input type="text" 
                        name="nome_usuario" 
                        id="nome_usuario" 
                        v-model="nome_usuario"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            <div class="w-10/12 sm:w-5/12">
                <label for="email_usuario" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <div class="mt-2">
                    <input type="text" 
                        name="email_usuario" 
                        id="email_usuario" 
                        v-model="email_usuario"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

        </div>

        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-10/12 sm:w-5/12">
                <label for="senha_usuario" class="block text-sm font-medium leading-6 text-gray-900">Senha</label>
                <div class="mt-2">
                    <input type="password" 
                        name="senha_usuario" 
                        id="senha_usuario" 
                        v-model="senha_usuario"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            <div class="w-10/12 sm:w-5/12">
                <label for="desc_servico" class="block text-sm font-medium leading-6 text-gray-900">Função</label>
                <div class="mt-2">
                    <select v-model="funcao_usuario" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="0" disabled selected>Selecione</option>
                        <option v-for="(func, index) in funcoes" :key="index" :value="func.id">{{ func.cargo }}</option>
                    </select>
                </div>
            </div>

        </div>

        <div class="mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4 sm:space-x-8">
            <label id="btnSendFunc" class="inline-flex w-10/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12" @click="sendFormUsu(), emitStep()">Salvar</label>
            <label class="mt-3 inline-flex w-10/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="closeAdd('f')">Cancelar</label>
        </div>

    </div>
</template>