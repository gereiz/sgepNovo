<script setup>

import { ref, reactive, onMounted, computed } from 'vue';
import { useToastr } from '@/Components/toastr';
import { enviaWpp } from '@/functions';

const toastr = useToastr(); 

const props = defineProps(['listaClientes', 'whatsapp', 'bisemana', 'linkrel'])

const cliente = ref(0)
const wppMsg = ref(0)

const msgDisabled = ref(true)



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
                        <span class="label-text ml-1">Cliente</span>
                        <select id="sel-cliente" v-model="cliente" class="select select-bordered" @change="msgDisabled = false">
                            <option value="0" disabled>SELECIONE O CLIENTE</option>
                            <option v-for="(cli, index) in listaClientes" :key="index" :value="cli.celular">{{cli.nome_fantasia ? cli.nome_fantasia : cli.razao_social}}</option>
                        </select>
                    </div>

                    <!-- Telefone e Mensagem -->
                    <div class="w-full flex">
                        <div class="w-6/12 flex flex-col me-4">
                            <span class="label-text ml-1">Telefone</span>
                            <input v-model="cliente" class="input input-bordered" disabled />
                              
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
                    <label for="modal-wpp" class="w-6/12 botao-modal" @click="enviaWpp(cliente, wppMsg, props.linkrel)">Enviar por Whatsapp</label>
                    <label class="w-6/12 botao-danger" @click="wppMsg = 0, cliente = 0, msgDisabled = true">Cancelar Envio</label>
                </div>
            </form>
        </div>
    </div>
</template>
