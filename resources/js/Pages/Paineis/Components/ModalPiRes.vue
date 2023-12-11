<script setup>
import { ref, reactive, watch } from 'vue'
import { useToastr } from '@/Components/toastr';
import StepOne from './FormPI/StepOne.vue'
import StepTwo from './FormPI/StepTwo.vue';

import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon, XMarkIcon, UserCircleIcon  } from '@heroicons/vue/24/outline'

const toastr = useToastr();

const emit = defineEmits(['closePi'])

const props = defineProps(['painel', 'bisemana', 'openPi', 'cliente', 'campanha', 'painel'])

const st = ref(0)

const step = ref(StepOne)

const open = ref(false)

function closeM() {
    open.value  = false
    emit('closePi', open.value)
}

function naviNext() {
    if(st.value <  1) {
        st.value ++
    }

    if(st.value == 0) {
        step.value = StepOne;

    } else if(st.value == 1) {
        step.value = StepTwo;
    }

}

function naviprevious() {
    if(st.value > 0){
        st.value --
    }
    

    if(st.value == 0) {
        step.value = StepOne;

    } else if(st.value == 1) {
        step.value = StepTwo;
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
                  <!-- <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div> -->
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Pedido de Inserção </DialogTitle>
                    <div class="flex mt-2">
                      <p class="text-sm text-gray-500 mb-4">Preencha os dados para criação do Pedido de Inserção.</p>
                      <button v-if="st === 0" class="w-8 h-8 flex items-center justify-center bg-amber-600 -mt-1 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 sm:ml-3 rounded-full animate-bounce" 
                              title="Editar Cliente">
                        <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    
                  </div>

                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <KeepAlive>
                          <component :is="step" :cliente="cliente" :campanha="campanha" :painel="painel" @nextStep="naviForm"></component>
                      </KeepAlive>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <label class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" @click="naviNext">Avançar</label>
                  <label v-if="st != 0" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="naviprevious">Voltar</label>
                  <label  v-else class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="open = false, closeM()">Cancelar</label>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
    </Dialog>
  </TransitionRoot>
</template>

