<script setup>
import { ref, reactive, shallowRef, watch, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import { vMaska } from 'maska'
import { usePage } from '@inertiajs/vue3';
import GridPaineis from '../../../Components/Paineis/GridPaineis.vue';
import ModalPiRes from '../ModalPiRes.vue';

const props = defineProps(['openAdd', 'cliente', 'bisemana', 'paineis']);
const emit = defineEmits(['closeAdd']);

import toastr from 'toastr'
import axios from 'axios';

const open = ref(false)
const openPi = ref(false)
const checkedPaineis = ref([]);
const checkedPaineisId = ref([]);
const campanha = ref('')  
const observacoes = ref('')
const bisemana = ref('')

watch(() => props.openAdd, (val)  =>{
    if(val === true) {
        open.value = true
        
        getBisemana()
    }
})

function getChecked(val) {
    checkedPaineis.value = []
    checkedPaineis.value.push(val)
}

function getheCkedId(val) {
    checkedPaineisId.value = []
    checkedPaineisId.value.push(val)
}

function getCampanha(val) {
    campanha.value = val
}

function getBisemana() {
  axios.post('/getBisemana', {idBs: props.bisemana})
    .then(res =>{

      bisemana.value = res.data

      // console.log(bisemana.value)

    })
}

function getObservacoes(val) {
    observacoes.value = val
}

function reservaPaineis() {

  if(campanha.value === '') {
    toastr.error('É obrigatório Informar a campanha!')
    return
  } 

  openAdd('t')

  
}

function openAdd(val) {
    if(val === 't') {
      openPi.value = true
    } 
}

function closeAdd() {
    open.value = false 

    emit('closeAdd', open.value)

}

function closePi() {
    openPi.value = false
}


</script>


<template>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white w-full sm:w-[82.5%] sm:p-6 sm:my-4 pb-4 pt-5 text-left shadow-xl transition-all">
                <div>   
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <ClipboardDocumentCheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                        Reservar painéis para o cliente: <span class="text-red-500 font-extrabold">{{ cliente.nome_fantasia ? cliente.nome_fantasia : cliente.razao_social}}</span>
                    </DialogTitle>
                    <!-- Grid de Painéis -->
                    <GridPaineis tipoPainel="D"
                                 :bisemana="bisemana"
                                 :paineis="paineis"
                                 @checkedPaineis="getChecked($event)"
                                 @checkedPaineisId="getheCkedId($event)"
                                 @campanha="getCampanha($event)"
                                 @observacoes="getObservacoes($event)">
                    </GridPaineis>

                    <div class="mt-5 sm:mt-6 w-full space-y-4 space-x-2 border-t border-gray-200 pt-4">
                        <label class="mt-3 inline-flex w-5/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="closeAdd()">
                            Cancelar
                        </label>
                        <label class="inline-flex w-5/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12" @click="reservaPaineis()">
                            Criar Reserva ou PI
                        </label>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <ModalPiRes :openPi="openPi"
                :paineis="checkedPaineis"
                :campanha="campanha"
                :observacoes="observacoes"
                @closePi="closePi" 
                @closeAdd="closeAdd" 
                :cliente="cliente"
                :bisemana="bisemana"
    
    />
</template>
  
