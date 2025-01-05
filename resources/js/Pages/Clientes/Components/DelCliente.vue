<script setup>
import { ref, shallowRef, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {useToastr} from "@/Components/toastr.js";

const props = defineProps(['openDel', 'clienteDel']);
const emit = defineEmits(['closeDel'])


const openD = ref(false)

const clienteNome = ref('')
const clienteId = ref('')

function closeDel() {
    openD.value = false
    emit('CloseDel', openD.value)

}

function excluirCliente(id) {
    axios.post('/DelCliente', {idCliente: clienteId.value})
        .then((res) =>{
            useToastr('success', 'Cliente excluído com sucesso!')
            location.reload()
        })
        .catch((err) => {
            console.error(err)
        })
}

watch(() => props.clienteDel, (val) => {
    clienteNome.value = props.clienteDel.nome_fantasia ? props.clienteDel.nome_fantasia : props.clienteDel.razao_social
    clienteId.value = props.clienteDel.id
})


watch(() => props.openDel, (val)  =>{
    if(val === true) {
        openD.value = true
    }
})


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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-5/12 sm:max-w-full sm:p-6">
                <div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Excluir o Cliente: {{clienteNome}}</DialogTitle>



                    <div class="w-full flex items-center justify-center space-x-4 mt-8">
                      <button @click="closeDel" type="button" class="w-4/12 btn btn-info text-white">Cancelar</button>
                      <button @click="excluirCliente(clienteDel)" type="button" class="w-4/12 btn btn-error text-white">Excluir</button>
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

