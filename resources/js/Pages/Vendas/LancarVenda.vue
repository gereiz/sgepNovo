<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import Multiselect from 'vue-multiselect'
import axios from 'axios'
import ModalVenda from './Components/ModalVenda.vue'

const props = defineProps(['clientes','anos'])

const idAno = ref(0)
const listaBisemana = ref([])
const idBisemana = ref(0)
const idCliente = ref('')
const open = ref(false)
const clienteSel = ref(null)

onMounted(() => {
  const anoAtual = new Date().getFullYear()
  const anoEncontrado = (props.anos || []).find(a => a.ano_bisemana == anoAtual)
  if (anoEncontrado) idAno.value = anoEncontrado.id
  if (idAno.value) getBisemanas()
})

function getBisemanas() {
  axios.post('/getBisemanas', { anoId: idAno.value })
    .then(res => {
      listaBisemana.value = Object.values(res.data)
      idBisemana.value = 0
    })
}

function getCliente() {
  axios.post('/GetCliente', { cliente: idCliente.value })
    .then(res => { clienteSel.value = res.data })
}

function openModal(val) {
  if (val === 't') open.value = true
  else open.value = false
}

function clienteLabel({id, nome_fantasia, razao_social}) {
  return `${nome_fantasia ? nome_fantasia : razao_social}`
}

</script>

<template>
  <Head title="Vendas" />
  <AuthenticatedLayout>
    <div class="w-full min-h-screen pt-4 md:pt-20 pb-24 mx-2 md:mx-4">
      <div class="navbar bg-base-100 rounded-box shadow mb-4">
        <div class="flex-1">
          <a class="btn btn-ghost text-xl">Lançar Venda</a>
        </div>
      </div>

      <div class="card w-full bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex flex-wrap items-end gap-4">
            <div class="w-40">
              <label class="label"><span class="label-text">Ano</span></label>
              <select class="select select-bordered w-full" v-model="idAno" @change="getBisemanas()">
                <option value="0" selected>Selecione</option>
                <option v-for="(ano, i) in anos" :key="i" :value="ano.id">{{ ano.ano_bisemana }}</option>
              </select>
            </div>
            <div class="w-60">
              <label class="label"><span class="label-text">Bi-Semana</span></label>
              <select class="select select-bordered w-full" v-model="idBisemana" :disabled="idAno == 0">
                <option value="0" selected>Selecione</option>
                <option v-for="(bs, i) in listaBisemana" :key="i" :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString('pt-br', {timeZone:'UTC'}) }} até {{ new Date(bs.fim).toLocaleDateString('pt-br', {timeZone:'UTC'}) }}</option>
              </select>
            </div>
            <div class="w-96">
              <label class="label"><span class="label-text">Cliente</span></label>
              <multiselect v-model="idCliente" :options="clientes" :custom-label="clienteLabel" @input="getCliente" :multiple="false" :close-on-select="true" placeholder="Selecione o Cliente" />
            </div>
            <div class="flex-1">
              <button class="btn btn-success" :disabled="!idCliente || idBisemana==0" @click="openModal('t')">Nova Venda</button>
            </div>
          </div>
        </div>
      </div>

      <ModalVenda :openVenda="open" :cliente="clienteSel || idCliente" :bisemanaId="idBisemana" @closeVenda="openModal" />
    </div>
  </AuthenticatedLayout>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
