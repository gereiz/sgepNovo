<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import {ref, watch, onMounted} from 'vue';
import axios from 'axios'
import Swal from 'sweetalert2'

const props = defineProps(['ambiente',  'anos', 'bisemanas', 'vendas'])
const page = usePage();

const listaBisemana = ref(0);
const anoAtual = new Date().getFullYear();
const idAno = ref(0);
const idBisemana = ref(0);
const listaOs = ref([])

onMounted(() => {
  const anoEncontrado = props.anos.find(ano => ano.ano_bisemana == anoAtual);
  if (anoEncontrado) { idAno.value = anoEncontrado.id; }
})

watch(idAno, () => { getBisemanas() })
watch(idBisemana, (val) => { getOsBs(val) })

function getBisemanas() {
  axios.post('/getBisemanas', {anoId: idAno.value}).then(res => {
    listaBisemana.value = Object.values(res.data)
    idBisemana.value = 0
  })
}

function getOsBs(val) {
  axios.post('/getOsBs', {idBs: val}).then(res => { listaOs.value = res.data })
}

function openOsGerada(fileName) {
  const pdfPath = `/storage/pdf/os/${fileName}`
  const pdfUrl = window.location.origin + pdfPath
  window.open(pdfUrl, '_blank')
}

function cancelarVenda(os) {
  Swal.fire({
    title: 'Cancelar venda?',
    text: 'Os lançamentos financeiros serão removidos e a OS será marcada como cancelada.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#00935F',
    confirmButtonText: 'Sim, cancelar',
    cancelButtonText: 'Voltar',
    reverseButtons: true
  }).then((res) => {
    if (res.isConfirmed) {
      axios.post('/vendas/cancel', { id: os.id })
        .then(() => {
          Swal.fire({ toast: true, icon: 'success', title: 'Venda cancelada', position: 'top-end', showConfirmButton: false, timer: 3000 })
          getOsBs(idBisemana.value)
        })
        .catch(err => {
          const msg = err?.response?.data?.msg || 'Falha ao cancelar venda'
          Swal.fire({ icon:'error', title:'Erro', text: msg })
        })
    }
  })
}

</script>

<template>
  <Head title="Vendas" />

  <AuthenticatedLayout>
    <div class="w-full h-[90vh] md:pt-20 md:pb-10 mx-2 md:mx-4">
      <div class="w-full h-14 flex mb-4">
        <div class="sm:w-2/12 h-14 flex items-center">
          <h1 class="titulo">Vendas Geradas </h1> <p class="text-red-500 font-bold ml-2">{{ vendas.length }}</p>
        </div>
      </div>

      <div class="w-full flex flex-row flex-wrap items-center lg:mb-4">
        <div class="w-full lg:w-6/12 flex items-center sm:justify-start flex-wrap lg:flex-nowrap">
          <div class="w-[23%] lg:w-[11%] flex flex-col me-4 sm:me-6 -mt-6 mb-2">
            <label for="ano">Ano</label>
            <select class="select select-bordered" name="ano" id="ano" v-model="idAno" @change="getBisemanas()">
              <option value="0" selected>Selecione</option>
              <option v-for="(ano, index) in anos" :key="index" :value="ano.id">{{ ano.ano_bisemana }}</option>
            </select>
          </div>

          <div class="w-[66%] lg:w-[30%] flex flex-col me-4 sm:me-6 -mt-6 mb-2">
            <label for="bi-semana">Bi-Semana</label>
            <select class="select select-bordered" name="bi-semana" id="bi-semama" v-model="idBisemana">
              <option value="0" selected>Selecione</option>
              <option v-for="(bs, index) in listaBisemana" :key="index" :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card w-full h-full max-h-[68vh] md:max-h-[90vh] bg-base-100 shadow-xl overflow-auto rounded-md">
        <div class="card-body flex flex-col">
          <div v-for="(os, index) in listaOs" :key="index" class="w-full justify-center h-[15vh] md:h-[10vh] card flex bg-base-100 border border-gray-200 shadow-xl m-2 p-4">
            <div class="flex">
              <div class="w-full flex flex-col md:flex-row space-y-6 md:space-y-0">
                <div class="md:w-3/12">
                  <p class="text-sm text-gray-600 font-semibold">Cliente: <span class="text-red-500">{{ os.cliente?.nome_fantasia ? os.cliente.nome_fantasia : os.cliente?.razao_social }}</span></p>
                </div>
                <div class="md:w-3/12">
                  <p class="text-sm text-gray-600 font-semibold">Arquivo: <span class="text-red-500">{{ os.arquivo }}</span></p>
                </div>
                <div class="md:w-4/12">
                  <p class="text-sm text-gray-600 font-semibold">Campanha: <span class="text-red-500">{{ os.campanha }}</span></p>
                </div>
                <div class="md:w-2/12 space-x-3">
                  <button tabindex="0" @click="openOsGerada(os.arquivo)" class="btn btn-sm btn-square btn-primary text-white tooltip tooltip-top" data-tip="Abrir OS do Cliente">
                    <i class="fa-regular fa-file-pdf"></i>
                  </button>
                  <button tabindex="0" @click="cancelarVenda(os)" class="btn btn-sm btn-square btn-error text-white tooltip tooltip-top" data-tip="Cancelar Venda">
                    <i class="fa-solid fa-ban"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AuthenticatedLayout>
</template>
