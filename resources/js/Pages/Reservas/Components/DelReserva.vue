<script setup>
import { ref, reactive, shallowRef, watch, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import { vMaska } from 'maska'
import { usePage } from '@inertiajs/vue3';
import GridPaineis from '../../../Components/Paineis/GridPaineis.vue';
import ModalPiRes from './ModalPiRes.vue';

const props = defineProps(['openDel', 'cliente', 'bisemana', 'paineis', "paineisId"]);
const emit = defineEmits(['closeDel']);

import toastr from 'toastr'
import axios from 'axios';

const openD = ref(false)
const bisemana = ref('')

watch(() => props.openDel, (val)  =>{
    if(val === true) {
        openD.value = true
    }
})


function cancelaResMulti() {

    axios.post('/DelResCliente',  {
        paineisId: props.paineisId,
        bs: props.bisemana,
        })
        .then((res) => {
            if(res.data.cod === 0) {
                toastr.error(res.data.msg)
            } else if(res.data.cod == 1) {
                toastr.success(res.data.msg)
                closeDel()
            }

        })

}

function closeDel() {
    openD.value = false

    emit('closeDel', openD.value)

}



</script>


<template>
    <TransitionRoot as="template" :show="openD">
      <Dialog as="div" class="relative z-10">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto mt-16">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white w-full sm:w-[60%] sm:p-6 sm:my-4 pb-4 pt-5 text-left shadow-xl transition-all">
                <div>
                  <!-- <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <ClipboardDocumentCheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div> -->
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                        Deletar os painéis: {{paineis}} da Pré-reserva para o cliente: <span class="text-red-500 font-extrabold">{{ cliente.nome_fantasia ? cliente.nome_fantasia : cliente.razao_social}}</span>
                    </DialogTitle>
                      <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                        Essa ação não poderá ser desfeita. Deseja continuar? {{bisemana.id}}
                    </DialogTitle>


                    <div class="mt-5 sm:mt-6 w-full space-y-4 space-x-2 border-t border-gray-200 pt-4">
                        <button class="w-5/12 btn btn-default bg-slate-400 text-white mt-4" @click="closeDel()">
                            Cancelar
                        </button>
                        <button class="w-5/12 btn btn-error text-white mt-4" @click="cancelaResMulti()">
                            Remover Painéis
                        </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

</template>

