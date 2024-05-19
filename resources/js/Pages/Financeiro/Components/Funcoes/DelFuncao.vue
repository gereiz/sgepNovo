<script setup>
import { ref, reactive, shallowRef, watch, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import { vMaska } from 'maska'
import { usePage } from '@inertiajs/vue3';


const props = defineProps(['openDel', 'funcao']);
const emit = defineEmits(['closeDel'])


import toastr from 'toastr'
import axios from 'axios';

const openD = ref(false)

watch(() => props.openDel, (val)  =>{
    if(val === true) {
      openD.value = true
        
    }
})

function openDel(val) {
    if(val === 't') {
      openD.value = true
    } else {
      openD.value = false
        emit('closeDel', val)
    }
}

function delServico(val) {
    axios.post('/DelFuncao', {id_funcao: val})
    .then((res) => {
        toastr.success('Serviço deletado com sucesso!')
        setTimeout(() => {
          openDel('f')
          window.location.reload()
        }, 1000)
    })
    .catch((err) => {
        toastr.error(res.data.message)
    })
}



</script>


<template>
    <TransitionRoot as="template" :show="openD">
      <Dialog as="div" class="relative z-10">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white w-full -ml-4 sm:w-[45%] sm:p-6 sm:my-4 pb-4 pt-5 text-left shadow-xl transition-all">
                <div>   
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <ClipboardDocumentCheckIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-xl font-semibold leading-6 text-gray-900">
                        Deletar Função: <span class="text-red-500 font-extrabold">{{props.funcao.cargo}}</span>
                    </DialogTitle>
                    
                    <div class="mt-2">
                      <p class="text-lg text-gray-500">
                        Você tem certeza que deseja deletar esta funcão?
                      </p>
                    </div>
                    <div class="mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4 sm:space-x-8">
                        <label id="btnSendServ" class="inline-flex w-10/12 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-5/12" @click="delServico(props.funcao.id)">Deletar</label>
                        <label class="mt-3 inline-flex w-10/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="openDel('f')">Cancelar</label>
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
  
