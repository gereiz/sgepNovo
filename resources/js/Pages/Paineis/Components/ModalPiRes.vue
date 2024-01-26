<script setup>
import { ref, onMounted, watch, shallowRef } from 'vue'
import { useToastr } from '@/Components/toastr';
import StepOne from './FormPI/StepOne.vue'
import StepTwo from './FormPI/StepTwo.vue';

import { XMarkIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const toastr = useToastr();

const emit = defineEmits(['closePi'])

const props = defineProps(['painel', 'bisemana', 'openPi', 'cliente', 'campanha', 'painel'])

const step = shallowRef(StepOne)
const open = ref(false)
const getForm = ref(0)

function closeM() {
    open.value  = false
    emit('closePi', open.value)
}


function naviForm(ev) {
  if(ev == 0) {
    
    closeM()
  
  } else if(ev == 1) {

    step.value = StepOne;

  } else if(ev == 2) {

    step.value = StepTwo;
    
  } else if(ev == 3) {

    console.log('enviar')

    } 
}

watch( () => props.openPi, (val) =>  {
    if(val === true) {
        open.value = true
    }
})

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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="open = false, closeM()">
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div class="sm:flex flex-col sm:items-start">
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <KeepAlive>
                          <component :is="step" :cliente="cliente" :campanha="campanha" :painel="painel" :getform="getForm" @nextStep="naviForm"></component>
                      </KeepAlive>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
    </Dialog>
  </TransitionRoot>
</template>

