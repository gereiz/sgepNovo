<script setup>
import { ref, shallowRef, watch } from 'vue'
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
// FormCliThree.value.ativo = ev.ativo
FormCliThree.value.agent = ev.agent

localStorage.setItem('formThree', JSON.stringify(FormCliThree.value))

formCliente.value.sOne = JSON.parse(localStorage.getItem('formOne'))
formCliente.value.sTwo = JSON.parse(localStorage.getItem('formTwo'))
formCliente.value.sThree = JSON.parse(localStorage.getItem('formThree'))

}

function addCliente() {

  axios.post('/CadCliente', {form: formCliente.value}) 
    .then((res) => {
      // console.log(res)
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
  <div class="modal" :class="{ 'modal-open': open }">
    <div class="modal-box w-full sm:w-5/12">
      <div class="absolute right-2 top-2">
        <button class="btn btn-sm btn-circle btn-ghost" @click="closeAdd">✕</button>
      </div>
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <h3 class="font-bold text-lg text-center mt-2">Cadastrar Novo Cliente</h3>
      <p class="text-sm text-base-content/70 text-center">Preencha os dados para incluir um novo cliente.</p>

      <div class="mt-6">
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

      <!-- <div class="modal-action">
        <button class="btn" @click="closeAdd">Fechar</button>
      </div> -->
    </div>
  </div>
</template>
  
