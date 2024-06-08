<script setup>
import { ref, onMounted, watch } from 'vue';
import { vMaska } from 'maska';
import { useToastr } from '@/Components/toastr';
import { defineProps, defineEmits } from 'vue';
import { cashBR } from '@/functions';

const props = defineProps(['servico'])
const emit = defineEmits(['closeEdit', 'sendFormComissao'])
const toastr = useToastr()

const valor_comissao = ref(props.servico.comissao)
const tipo_comissao = ref(props.servico.tipo_comissao)
const id_servico = ref(props.servico.id)


function closeAdd(val){
    emit('closeEdit', val)
}

const cadComisao = ref ({valor_comissao: valor_comissao,
                         tipo_comissao: tipo_comissao,
                         id_servico: id_servico
                        }); 
 

function emitStep(val) {
    let btnSendOne = document.getElementById('btnSendOne')

    btnSendServ.innerHTML = 'Carregando...'
    setTimeout(() => {
        btnSendServ.innerHTML = 'Salvar'
    }, 1000);
}



function sendFormComissao() {
    if(cadComisao.valor_comissao != '' && cadComisao.tipo_comissao != '') {
        emit('sendFormComissao', cadComisao.value)
    }
}



</script> 


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8 mt-10">
       
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-10/12 sm:w-3/12">
                <label for="valor_comissao" class="block text-sm font-medium leading-6 text-gray-900">Valor</label>
                <div class="mt-2">
                    <input type="text" 
                        name="valor_comissao" 
                        id="valor_comissao" 
                        v-model="cadComisao.valor_comissao"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                        v-maska
                        data-maska=
                        "[
                            '##,##',
                            '###,##',
                            '####,##',
                            '#####,##'
                        ]"
                        />
                </div>
            </div>

            <div class="w-10/12 sm:w-3/12">
                <label for="tipo_comissao" class="block text-sm font-medium leading-6 text-gray-900">Tipo:</label>
                <div class="mt-2">
                    <select v-model="tipo_comissao" name="tipo_comissao" id="tipo_comissao"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="0">Valor</option>
                        <option value="1">Porcentagem</option>
                    </select>
                </div>
            </div>

           
        </div>

        <div class="mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4 sm:space-x-8">
            <label id="btnSendServ" class="inline-flex w-10/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12" @click="sendFormComissao(), emitStep()">Salvar</label>
            <label class="mt-3 inline-flex w-10/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="closeAdd('f')">Cancelar</label>
        </div>

    </div>
</template>