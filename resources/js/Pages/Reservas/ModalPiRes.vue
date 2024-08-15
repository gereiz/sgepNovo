<script setup>
import { ref, watch, shallowRef } from 'vue'
import { useToastr } from '@/Components/toastr';
import StepOnePi from './Components/FormPI/StepOnePi.vue'
import StepTwoPi from './Components/FormPI/StepTwoPi.vue';
import StepThreePi from './Components/FormPI/StepThreePi.vue';
import StepFourPi from './Components/FormPI/StepFourPi.vue';


import { XMarkIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'


const toastr = useToastr();

const emit = defineEmits(['closePi', 'closeAdd'])

const props = defineProps(['paineis', 'bisemana', 'openPi', 'cliente', 'campanha', 'observacoes', 'painel'])

const step = shallowRef(StepOnePi)
const open = ref(false)
const getFormPiOne = ref({})
const getFormPiTwo = ref({})
const getFormPiThree = ref({})
const formPi = ref({})

watch( () => props.openPi, (val) =>  {
    if(val === true) {
        open.value = true
    } else {
        open.value = false
    }
})


function saveFormOne(ev) {

  getFormPiOne.value.clienteId = ev.clienteId
  getFormPiOne.value.clienteNome = ev.clienteNome
  getFormPiOne.value.cnpj = ev.cnpj
  getFormPiOne.value.endereco = ev.endereco
  getFormPiOne.value.cep = ev.cep
  getFormPiOne.value.uf = ev.uf
  getFormPiOne.value.cidade = ev.cidade
  getFormPiOne.value.celular = ev.celular
  getFormPiOne.value.inscEst = ev.inscEst
  getFormPiOne.value.responsavel = ev.responsavel
  getFormPiOne.value.email = ev.email

  localStorage.setItem('piFormOne', JSON.stringify(getFormPiOne.value))

  // console.log(JSON.parse(localStorage.getItem('piFormOne')))

}

function saveFormTwo(ev) {
    getFormPiTwo.value.paineis = ev.paineis
    getFormPiTwo.value.bisemanaId = props.bisemana.id
    getFormPiTwo.value.campanha = ev.campanha
    getFormPiTwo.value.observacoes = props.observacoes
    getFormPiTwo.value.servicos = ev.servicos
    getFormPiTwo.value.formaPgto = ev.formaPgto
    getFormPiTwo.value.pgto = ev.pgto
    getFormPiTwo.value.dtPgto = ev.dtPgto
    getFormPiTwo.value.dReserva = ev.dtReserva
    getFormPiTwo.value.vendedorId = ev.vendedorId
    getFormPiTwo.value.vendedor = ev.vendedor


    localStorage.setItem('piFormTwo', JSON.stringify(getFormPiTwo.value))

    formPi.value.One = JSON.parse(localStorage.getItem('piFormOne'))
    formPi.value.Two = JSON.parse(localStorage.getItem('piFormTwo'))

}

function saveFormThree(ev) {
    getFormPiThree.value.faturar_sobre = ev.faturar_sobre
    getFormPiThree.value.faturar_contra = ev.faturar_contra
    getFormPiThree.value.enviar_faturamento = ev.enviar_faturamento

    localStorage.setItem('piFormThree', JSON.stringify(getFormPiThree.value))

    // console.log(JSON.parse(localStorage.getItem('piFormTwo')))

    // formPi.value.One = JSON.parse(localStorage.getItem('piFormOne'))
    // formPi.value.Two = JSON.parse(localStorage.getItem('piFormTwo'))
    formPi.value.Three = JSON.parse(localStorage.getItem('piFormThree'))

}


function submitFormPi() {

  axios.post('/sessionData', {
    formPi: formPi.value
  })
  .then((res) => {
      setTimeout(() => {
        window.open('/storePi', '_blank')
      }, 2000);
  })
  .catch((err) =>{
    console.log(err)
  })
}


function closeM() {
    open.value  = false
    emit('closePi', open.value)
}


function naviForm(ev) {
  if(ev == 0) {
    
    closeM()
  
  } else if(ev == 1) {

    step.value = StepOnePi;

  } else if(ev == 2) {

    step.value = StepTwoPi;
    
  } else if(ev == 3) {

    step.value = StepThreePi;

  } else if(ev == 4) {
    
    step.value = StepFourPi;

  } else if(ev == 5) {
    
    submitFormPi()
    
    setTimeout(() => {
      closeM()
    }, 3000);
    
  }
  
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="open = false, closeM()">
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div class="sm:flex flex-col sm:items-start">
                  <div class="w-full mt-3 text-center sm:mt-0 sm:text-left">
                      <KeepAlive>
                          <component :is="step" 
                                     :cliente="cliente"
                                     :campanha="campanha"
                                     :paineis="paineis"
                                     :bisemana="bisemana"
                                     @nextStep="naviForm" 
                                     @formOne="saveFormOne"
                                     @formTwo="saveFormTwo"
                                     @formThree="saveFormThree">
                          </component>
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

