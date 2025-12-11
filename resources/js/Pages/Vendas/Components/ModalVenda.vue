<script setup>
import { ref, shallowRef } from 'vue'
import StepTwoVenda from '@/Pages/Vendas/Components/StepTwoVenda.vue'
import StepFourVenda from '@/Pages/Vendas/Components/StepFourVenda.vue'
import StepFiveVenda from '@/Pages/Vendas/Components/StepFiveVenda.vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const props = defineProps(['openVenda','cliente','bisemanaId'])
const emit = defineEmits(['closeVenda'])

const step = shallowRef(StepTwoVenda)
const formVenda = ref({ One:{}, Two:{}, Four:{}, Five:{} })

function closeM(val){ emit('closeVenda', val) }

function saveFormTwo(ev){ formVenda.value.Two = ev }
function saveFormFour(ev){ formVenda.value.Four = ev }
function saveFormFive(ev){ formVenda.value.Five = ev }

function next(ev){
  if(ev === 1){ closeM('f') }
  else if(ev === 3){
    if(step.value === StepTwoVenda) step.value = StepFourVenda
    else step.value = StepTwoVenda
  }
  else if(ev === 4){ step.value = StepFourVenda }
  else if(ev === 5){ step.value = StepFiveVenda }
  else if(ev === 6){
    const cli = props.cliente
    const clienteId = typeof cli === 'object' ? (cli?.id ?? (Array.isArray(cli) ? cli[0]?.id : null)) : (typeof cli === 'number' ? cli : null)
    const nomeCli = (typeof cli === 'object' ? (cli?.nome_fantasia || cli?.razao_social || (Array.isArray(cli) ? (cli[0]?.nome_fantasia || cli[0]?.razao_social) : '')) : '')
    const responsavel = (typeof cli === 'object' ? (cli?.responsavel || cli?.contato || '') : '')
    formVenda.value.One = { clienteId: clienteId, clienteObj: cli || null, responsavel: responsavel, clienteNome: nomeCli }
    formVenda.value.Two.bisemanaId = props.bisemanaId
    axios.post('/vendas/sessionData', { formVenda: formVenda.value })
      .then(()=> window.open('/vendas/preview', '_blank'))
      .then(()=> Swal.fire({
        title: 'Confirmar gravação da OS?',
        text: 'A prévia foi aberta. Deseja salvar o PDF e os lançamentos?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#00935F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, salvar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }))
      .then((res)=> {
        if(res?.isConfirmed){
          return axios.post('/vendas/store').then((resp)=> {
            const url = resp?.data?.file_url
            if (url) { window.open(url, '_blank') }
            Swal.fire({ toast: true, icon: 'success', title: 'OS adicionada com sucesso', position: 'top-end', showConfirmButton: false, timer: 3000 })
            closeM('f')
          }).catch(err => {
            const msg = err?.response?.data?.msg || 'Erro ao salvar OS'
            Swal.fire({ icon:'error', title:'Falha', text: msg })
          })
        } else {
          step.value = StepFiveVenda
        }
      })
  }
}

</script>

<template>
  <dialog class="modal" :open="openVenda">
    <div class="modal-box w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[85vh] overflow-y-auto p-4 mt-[8vh]">
      <div class="absolute right-2 top-2">
        <button class="btn btn-sm btn-circle btn-ghost" @click="closeM('f')">✕</button>
      </div>

      <keep-alive>
        <component :is="step"
                   :cliente="[props.cliente]"
                   :campanha="['']"
                   :paineis="['VENDA']"
                   :bisemana="[{ id: props.bisemanaId, num_bisemana: '', inicio: new Date().toISOString().slice(0,10), fim: new Date().toISOString().slice(0,10)}]"
                   :dataReserva="new Date().toISOString().slice(0,10)"
                   :agentes="[]"
                   @nextStep="next"
                   @formTwo="saveFormTwo"
                   @formFour="saveFormFour"
                   @formFive="saveFormFive" />
      </keep-alive>
    </div>
  </dialog>
</template>
