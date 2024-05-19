<script setup>
import { ref, onMounted, watch } from 'vue';
import { vMaska } from 'maska';
import { useToastr } from '@/Components/toastr';
import { defineProps, defineEmits } from 'vue';
import { CodeBracketIcon } from '@heroicons/vue/20/solid';

const props = defineProps([])
const emit = defineEmits(['closeAdd', 'sendFormFunc'])
const toastr = useToastr()

function closeAdd(val){
    emit('closeAdd', val)
}

const cadFunc = ref ({cargo_funcao: '',
                     desc_funcao: '',
                    }); 


function emitStep(val) {
    let btnSendOne = document.getElementById('btnSendOne')

    btnSendServ.innerHTML = 'Carregando...'
    setTimeout(() => {
        btnSendServ.innerHTML = 'Salvar'
    }, 1000);
}



function sendFormFunc() {
    if(cadFunc.cargo_funcao != '' && cadFunc.desc_funcao != '') {
        emit('sendFormFunc', cadFunc.value)
    }
}



</script> 


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8 mt-10">
       
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-10/12 sm:w-5/12">
                <label for="nome_servico" class="block text-sm font-medium leading-6 text-gray-900">Nome do Cargo/Função</label>
                <div class="mt-2">
                    <input type="text" 
                        name="nome_servico" 
                        id="nome_servico" 
                        v-model="cadFunc.cargo_funcao"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            <div class="w-10/12 sm:w-5/12">
                <label for="desc_servico" class="block text-sm font-medium leading-6 text-gray-900">Descrição do Cargo/Função</label>
                <div class="mt-2">
                    <input type="text" 
                        name="desc_servico" 
                        id="desc_servico" 
                        v-model="cadFunc.desc_funcao"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>
        </div>

        <div class="mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4 sm:space-x-8">
            <label id="btnSendServ" class="inline-flex w-10/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12" @click="sendFormFunc(), emitStep()">Salvar</label>
            <label class="mt-3 inline-flex w-10/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="closeAdd('f')">Cancelar</label>
        </div>

    </div>
</template>