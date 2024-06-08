<script setup>
import { ref, reactive, shallowRef, watch, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import { vMaska } from 'maska'
import { usePage } from '@inertiajs/vue3';
import FormEditComissaoServ from './FormEditComissaoServ.vue';

const props = defineProps(['openEdit', 'servico']);
const emit = defineEmits(['closeEdit'])


import toastr from 'toastr'
import axios from 'axios';

const openE = ref(false)


function openEdit(val) {
    if(val === 't') {
      openE.value = true
    } else {
      openE.value = false
        emit('closeEdit', val)
    }
}

watch(() => props.openEdit, (val)  =>{
    if(val === true) {
      openE.value = true
        
    }
})

function sendFormComissao(val) {
    axios.post('/GravaComissaoServico', val)
    .then((response) => {
        console.log(response)
        toastr.success('Comissão cadastrada com sucesso!')
        openEdit('f')
    })
    .catch((error) => {
        console.log(error)
        toastr.error(error.response.data.message)
    })
}


</script>


<template>
    <TransitionRoot as="template" :show="openE">
      <Dialog as="div" class="relative z-10">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white w-full sm:w-[45%] sm:p-6 sm:my-4 pb-4 pt-5 text-left shadow-xl transition-all">
                <div>   
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <ClipboardDocumentCheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                        Adicionar/Editar a comissão do serviço: <span class="text-red-500 font-extrabold">{{ servico.nome }}</span>
                    </DialogTitle>
                    
                    <FormEditComissaoServ 
                      @closeEdit="openEdit"
                      @sendFormComissao="sendFormComissao"
                      :servico="props.servico"
                    > 
                    </FormEditComissaoServ>
                
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
</template>
  
