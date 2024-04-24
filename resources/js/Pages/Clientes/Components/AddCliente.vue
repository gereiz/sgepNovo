<script setup>
import { ref, shallowRef, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import { vMaska } from 'maska'
import StepOne from './FormAdd/StepOne.vue'
import StepTwo from './FormAdd/StepTwo.vue'
import StepThree from './FormAdd/StepThree.vue'
import toastr from 'toastr'

const props = defineProps(['openAdd', 'clienteEdit']);
const emit = defineEmits(['closeAdd'])

const open = ref(false)
const step = shallowRef(StepOne)
const formCliOne = ref({})
const formCliTwo = ref({})
const FormCliThree = ref({})
const formCliente = ref({})



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
    // toastr.success('Cliente cdastrado!')
    addCliente()
    closeAdd()
  }

}

function getFormOne(ev) {

  formCliOne.value.r_social = ev.r_social
  formCliOne.value.n_fantasia = ev.n_fantasia  
  formCliOne.value.cpf_cnpj = ev.cpf_cnpj
  formCliOne.value.insc_est = ev.insc_est

  localStorage.setItem('formOne', JSON.stringify(formCliOne.value))

}

function getFormTwo(ev) {

  formCliTwo.value.ender = ev.ender
  formCliTwo.value.numero = ev.numero
  formCliTwo.value.uf = ev.uf
  formCliTwo.value.cidade = ev.cidade
  formCliTwo.value.bairro = ev.bairro
  formCliTwo.value.cep = ev.cep


  localStorage.setItem('formTwo', JSON.stringify(formCliTwo.value))

}

function getFormThree(ev) {

FormCliThree.value.responsavel = ev.responsavel
FormCliThree.value.tel_resp = ev.telResp
FormCliThree.value.email_resp = ev.emailResp
FormCliThree.value.idCliente = ev.idCliente

localStorage.setItem('formThree', JSON.stringify(FormCliThree.value))

formCliente.value.sOne = JSON.parse(localStorage.getItem('formOne'))
formCliente.value.sTwo = JSON.parse(localStorage.getItem('formTwo'))
formCliente.value.sThree = JSON.parse(localStorage.getItem('formThree'))

}

function addCliente() {

  axios.post('/CadCliente', {form: formCliente.value}) 
    .then((res) => {
      console.log(res)
      location.reload()
    })
    .catch((err) => {
      console.error(err)
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
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Cadastrar Novo Cliente</DialogTitle>

                    <form>
                        <div class="space-y-12">

                            <div class="border-b border-gray-900/10 pb-12">
                                <p class="mt-1 text-sm leading-6 text-gray-600">Preencha os dados para incluir um novo cliente.</p>
                                <div class="mt-10 space-y-10">
                                    <keep-alive>
                                      <component :is="step" :clienteEdit="props.clienteEdit"
                                                @step2="nextStep" 
                                                @step3="nextStep"
                                                @stepSubumit="nextStep"
                                                @formOne="getFormOne"
                                                @formTwo="getFormTwo"
                                                @formThree="getFormThree"
                                      > 
                                      </component>
                                    </keep-alive>
                                </div>
                            </div>
                        </div>

                    </form>
                    
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
