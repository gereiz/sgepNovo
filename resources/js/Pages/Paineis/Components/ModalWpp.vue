<script setup>

import { ref, reactive, onMounted, watch } from 'vue';
import { useToastr } from '@/Components/toastr';
import { enviaWpp } from '@/functions';
import Multiselect from 'vue-multiselect'

const toastr = useToastr(); 

const props = defineProps(['listaClientes', 'whatsapp', 'bisemana', 'linkrel'])

const cliente = ref()
const clientes = ref(props.listaClientes)
const wppMsg = ref(0)
const telefone = ref(cliente.value ? cliente.value.celular : '')

const msgDisabled = ref(true)

watch(() => cliente.value, (val) => {
    if(val) {
        telefone.value = val.celular
        msgDisabled.value = false
    } else {
        telefone.value = ''
        msgDisabled.value = true
    }
})

function clienteLista({id, nome_fantasia, razao_social}) {
    return `${nome_fantasia ? nome_fantasia : razao_social}`
}

</script>


<template lang="">
    <!-- Modal Whatsapp -->
    <input type="checkbox" id="modal-wpp" class="modal-toggle" />          
    <div class="modal flex items-end md:items-center">
        <div class="modal-box">
            <div class="flex mb-4">
                <label for="modal-wpp" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                <h3 class="font-bold text-lg">Enviar Disponibilidade:</h3>
                <h3 class="font-bold text-lg ml-2 text-red-500">Bi-semana {{bisemana[0]?.num_bisemana}} {{paineis}}</h3>
            </div>

            <form>  
                <div class="w-full flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-8">

                    <!-- Cliente -->
                    <div class="w-full flex flex-col">
                        <span class="label-text ml-1">Cliente </span>
                        <multiselect
                            v-model="cliente"
                            :options="clientes"
                            :custom-label="clienteLista"
                            selectLabel="Enter para selecionar"
                            :multiple="false"
                            :close-on-select="true"
                            :show-labels="true"
                            placeholder="Selecione o Cliente"
                        >
                        </multiselect>
                    </div>

                    <!-- Telefone e Mensagem -->
                    <div class="w-full flex">
                        <div class="w-6/12 flex flex-col me-4">
                            <span class="label-text ml-1">Telefone</span>
                            <input v-model="telefone" class="input input-bordered" disabled />
                              
                        </div>
                        <div class="w-6/12 flex flex-col">
                            <span class="label-text ml-1">Mensagem</span>
                            <select v-model="wppMsg" class="select select-bordered" :disabled="msgDisabled">
                                <option value="0">SELECIONE A MENSAGEM</option>
                                <option v-for="(wpp, index) in whatsapp" :key="index" :value="wpp.mensagem">{{wpp.titulo}}</option>
                            </select>
                        </div>
                    </div>

                    <!-- Texto Mensagem -->
                    <div class="w-full flex flex-col">
                        <span class="label-text ml-1">Mensagem</span>
                        <textarea name="" id="" class="textarea textarea-bordered textarea-md" rows="5" disabled>{{ (wppMsg ? wppMsg.replaceAll('%20', ' ') : '')   }}</textarea>
                    </div>


                </div>

                <!-- Botão de Confirmação de Reserva -->
                <div class="modal-action">
                    <label class="w-6/12 botao-danger" @click="wppMsg = 0, cliente = 0, msgDisabled = true">Cancelar Envio</label>
                    <!-- <label for="modal-wpp" class="w-6/12 botao-modal" @click="enviaWpp(telefone, wppMsg, props.linkrel)">Enviar por Whatsapp</label> -->
                    <a  class="w-6/12 botao-modal" @click="enviaWpp(telefone, wppMsg, props.linkrel)">Enviar por Whatsapp</a>
                </div>
            </form>
        </div>
    </div>
</template>
