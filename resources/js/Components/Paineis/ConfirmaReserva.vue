<!-- Esse Componente recebe um open (booleano), e retorna
Campanha e Observações par aconfirmação de reservas e um close (booleano) -->

<script setup>
    import { ref, reactive, shallowRef, watch, onMounted } from 'vue'
    import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
    import {ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
    import { vMaska } from 'maska'
    import { usePage } from '@inertiajs/vue3';


    const props = defineProps(['open']);
    const emit = defineEmits(['campanha', 'obsevacoes', 'closeObs']);

    const campanha = ref('')
    const observacoes = ref('')

    import toastr from 'toastr'
    import axios from 'axios';

    const open = ref(false)

    watch(() => props.open, (val)  =>{
        if(val === true) {
            open.value = true
        }
    })

    function limparCampos() {
        campanha.value = ''
        observacoes.value = ''
        emit('campanha', campanha.value)
        emit('observacoes', observacoes.value)
    }

    function closeModal() {
        open.value = false
        emit('closeObs', open.value)


    }



    function setData() {
        emit('campanha', campanha.value)
        emit('observacoes', observacoes.value)
        closeModal()
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white w-full sm:w-[42.5%] sm:p-6 sm:ml-[15%] sm:my-4 pb-4 pt-5 text-left shadow-xl transition-all">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <ClipboardDocumentCheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5 space-y-4">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                        Informe a Campanha e Observações sobre a reserva. <span class="text-red-500 font-extrabold"></span>
                    </DialogTitle>

                    <!-- Campos de texto -->
                    <div class="w-full flex flex-col items-center justify-end">
                        <div class="w-11/12 flex flex-col flex-wrap">
                            <label for="campanha" class="block text-sm font-medium leading-6 text-gray-900">Inclua o Título da Campanha.
                                <span class="text-red-500 italic">
                                    (Obrigatório)
                                </span>
                            </label>
                            <input type="text"
                                v-model="campanha"
                                name="campanha"
                                id="campanha" class="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Informar campanha"
                            />
                        </div>
                    </div>
                    <div class="w-full flex flex-col items-center justify-end">
                        <div class="w-11/12 flex flex-col flex-wrap">
                            <label for="obsevacoes" class="block text-sm font-medium leading-6 text-gray-900">Inclua observações sobre a reseva.
                                <span class="text-red-500 italic">
                                    (opcional)
                                </span>
                            </label>
                            <div class=" w-full mt-2">
                                <textarea rows="4"
                                          name="obsevacoes"
                                          :disabled="campanha == ''"
                                          id="obsevacoes"
                                          v-model="observacoes"
                                          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                    </div>


                    <div class="mt-5 sm:mt-6 w-full space-y-4 space-x-2 border-t border-gray-200 pt-4">
                        <label class="mt-3 inline-flex w-5/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12" @click="closeModal(), limparCampos()">
                            Cancelar
                        </label>
                        <label class="inline-flex w-5/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12" @click="setData()">
                            Confirmar
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
</template>

