<script setup>
import { ref, shallowRef, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import { vMaska } from 'maska'

import StepOne from './FormAddPainel/StepOnePainel.vue'
import StepTwo from './FormAddPainel/StepTwoPainel.vue'

import toastr from 'toastr'

const props = defineProps(['openAdd', 'clienteEdit', 'painel']);
const emit = defineEmits(['closeAdd'])


const step = shallowRef (StepOne)
const open = ref(false)

const formCliOne = ref ({})
const formCliTwo = ref ({})

const formCliente = ref ({})


function closeAdd() {
    open.value = false
    emit('CloseAdd', open.value)

}

function nextStep(ev) {
  if (ev === 0) {
    step.value = StepOne
    closeAdd()
  } else if (ev === 1) {
    step.value = StepOne
  } else if (ev === 2) {
    step.value = StepTwo
  } else if(ev === 3) {
    step.value =  StepThree
  } else if (ev === 4) {
    step.value = StepOne
    closeAdd()
  }

}


function getFormOne(ev) {

  formCliOne.value.ender = ev.ender
  formCliOne.value.numero = ev.numero
  formCliOne.value.referencia = ev.referencia
  formCliOne.value.uf = ev.uf
  formCliOne.value.cidade = ev.cidade
  formCliOne.value.bairro = ev.bairro
  formCliOne.value.latitude = ev.latitude
  formCliOne.value.longitude = ev.longitude


  localStorage.clear();

  localStorage.setItem('formOnePainel', JSON.stringify(formCliOne.value))

}

function getFormTwo(ev) {

formCliTwo.value.idPainel = ''
formCliTwo.value.ident = ev.ident
formCliTwo.value.ident_ant = ev.ident_ant
formCliTwo.value.cadan = ev.cadan
formCliTwo.value.dim = ev.dim
formCliTwo.value.dimLona = ev.dimLona
formCliTwo.value.posicao = ev.posicao
formCliTwo.value.tipo = ev.tipo
formCliTwo.value.imagem = ev.imagem

formCliente.value.sOne = JSON.parse(localStorage.getItem('formOnePainel'))
formCliente.value.sTwo = formCliTwo.value

addPainel()

}

function addPainel() {

  let config = {
        headers: {
          "content-type": "multipart/form-data"
        }
  }


  axios.post('/addPainel', {dados: formCliente.value}, config)
        .then((res) => {
          location.reload()
        })
        .catch((err) =>{
          console.log(err)
        })

}


watch(() => props.openAdd, (val)  =>{
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-5/12 sm:max-w-full sm:p-6">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Cadastrar Novo Painel</DialogTitle>

                    <keep-alive>
                        <component :is="step"
                                 :painel="props.painel"
                                 @step1="nextStep"
                                 @formOne="getFormOne"
                                 @step2="nextStep"
                                 @formTwo="getFormTwo"
                        > 
                        </component>
                    </keep-alive>
                    
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
