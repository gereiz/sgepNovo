<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  openSection: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['expandTo'])

const openEnderecos = ref(false)
const openClientes = ref(false)
const openPaineis = ref(false)
const openDisp = ref(false)
const openRel = ref(false)
const openFin = ref(false)
const openCfg = ref(false)

function setOpen(section) {
  openEnderecos.value = section === 'enderecos'
  openClientes.value = section === 'clientes'
  openPaineis.value = section === 'paineis'
  openDisp.value = section === 'disponibilidades'
  openRel.value = section === 'relatorios'
  openFin.value = section === 'financeiro'
  openCfg.value = section === 'configuracoes'
}

watch(() => props.openSection, (val) => {
  if (val) setOpen(val)
})
</script>

<template>
  <div v-if="collapsed" class="w-full my-2 flex flex-col space-y-4">
    <div class="w-full flex justify-center" @click="emit('expandTo','enderecos')">
      <div class="tooltip tooltip-right" data-tip="Endereços">
        <i class="fa-solid fa-map-location-dot fa-fw text-white text-xl"></i>
      </div>
    </div>
    <div class="w-full flex justify-center" @click="emit('expandTo','clientes')">
      <div class="tooltip tooltip-right" data-tip="Clientes">
        <i class="fa-solid fa-user-plus fa-fw text-white text-xl"></i>
      </div>
    </div>
    <div class="w-full flex justify-center" @click="emit('expandTo','paineis')">
      <div class="tooltip tooltip-right" data-tip="Painéis">
        <i class="fa-solid fa-table-cells-large fa-fw text-white text-xl"></i>
      </div>
    </div>
    <div class="w-full flex justify-center" @click="emit('expandTo','disponibilidades')">
      <div class="tooltip tooltip-right" data-tip="Disponibilidades">
        <i class="fa-solid fa-envelope fa-fw text-white text-xl"></i>
      </div>
    </div>
    <div class="w-full flex justify-center" @click="emit('expandTo','relatorios')">
      <div class="tooltip tooltip-right" data-tip="Relatórios">
        <i class="fa-solid fa-file-lines fa-fw text-white text-xl"></i>
      </div>
    </div>
    <div class="w-full flex justify-center" @click="emit('expandTo','financeiro')">
      <div class="tooltip tooltip-right" data-tip="Financeiro">
        <i class="fa-solid fa-wallet fa-fw text-white text-xl"></i>
      </div>
    </div>
    <div class="w-full flex justify-center" @click="emit('expandTo','configuracoes')">
      <div class="tooltip tooltip-right" data-tip="Configurações">
        <i class="fa-solid fa-gears fa-fw text-white text-xl"></i>
      </div>
    </div>
  </div>

  <div v-else class="w-full my-2 flex flex-col" :class="['space-y-2']">

    <div :class="['collapse bg-transparent transition-all duration-200', 'collapse-arrow', openEnderecos ? 'collapse-open' : '']">
      <div class="collapse-title text-white flex items-center cursor-pointer px-0 h-12 min-h-0 w-full" :class="[collapsed ? 'justify-center gap-0' : 'justify-start gap-3']" @click="openEnderecos = !openEnderecos">
        <div class="w-8 h-8 flex items-center justify-center shrink-0" :class="[collapsed ? 'tooltip tooltip-right' : '']" :data-tip="collapsed ? 'Endereços' : null">
          <i class="fa-solid fa-map-location-dot fa-fw text-white" :class="[collapsed ? 'text-lg' : 'text-xl']"></i>
        </div>
        <span v-if="!collapsed" class="leading-none">Endereços</span>
      </div>
      <div class="collapse-content">
        <ul class="text-white ml-1 mt-2 space-y-2">
          <li class="hover:text-slate-400"><a href="/CadCidade">Cadastro de Cidades</a></li>
          <li class="hover:text-slate-400"><a href="/CadRegiao">Cadastro de Regiões</a></li>
          <li class="hover:text-slate-400"><a href="/CadBairro">Cadastro de Bairros</a></li>
        </ul>
      </div>
    </div>

    <div :class="['collapse bg-transparent transition-all duration-200', 'collapse-arrow', openClientes ? 'collapse-open' : '']">
      <div class="collapse-title text-white flex items-center cursor-pointer px-0 h-12 min-h-0 w-full" :class="[collapsed ? 'justify-center gap-0' : 'justify-start gap-3']" @click="openClientes = !openClientes">
        <div class="w-8 h-8 flex items-center justify-center shrink-0" :class="[collapsed ? 'tooltip tooltip-right' : '']" :data-tip="collapsed ? 'Clientes' : null">
          <i class="fa-solid fa-user-plus fa-fw text-white" :class="[collapsed ? 'text-lg' : 'text-xl']"></i>
        </div>
        <span v-if="!collapsed" class="leading-none">Clientes</span>
      </div>
      <div class="collapse-content">
        <ul class="text-white ml-1 mt-2 space-y-2">
          <li class="hover:text-slate-400"><a href="/Clientes">Lista de Clientes</a></li>
        </ul>
      </div>
    </div>

    <div :class="['collapse bg-transparent transition-all duration-200', 'collapse-arrow', openPaineis ? 'collapse-open' : '']">
      <div class="collapse-title text-white flex items-center cursor-pointer px-0 h-12 min-h-0 w-full" :class="[collapsed ? 'justify-center gap-0' : 'justify-start gap-3']" @click="openPaineis = !openPaineis">
        <div class="w-8 h-8 flex items-center justify-center shrink-0" :class="[collapsed ? 'tooltip tooltip-right' : '']" :data-tip="collapsed ? 'Painéis' : null">
          <i class="fa-solid fa-table-cells-large fa-fw text-white" :class="[collapsed ? 'text-lg' : 'text-xl']"></i>
        </div>
        <span v-if="!collapsed" class="leading-none">Painéis</span>
      </div>
      <div class="collapse-content">
        <ul class="text-white ml-1 mt-2 space-y-2">
          <li class="hover:text-slate-400"><a href="/Paineis">Lista de Painéis</a></li>
          <li class="hover:text-slate-400"><a href="/ResPaineis">Enviar Disponibilidade</a></li>
          <li class="hover:text-slate-400"><a href="/ResPaineisCli">Reserva de Painéis</a></li>
        </ul>
      </div>
    </div>

    <div :class="['collapse bg-transparent transition-all duration-200', 'collapse-arrow', openDisp ? 'collapse-open' : '']">
      <div class="collapse-title text-white flex items-center cursor-pointer px-0 h-12 min-h-0 w-full" :class="[collapsed ? 'justify-center gap-0' : 'justify-start gap-3']" @click="openDisp = !openDisp">
        <div class="w-8 h-8 flex items-center justify-center shrink-0" :class="[collapsed ? 'tooltip tooltip-right' : '']" :data-tip="collapsed ? 'Disponibilidades' : null">
          <i class="fa-solid fa-envelope fa-fw text-white" :class="[collapsed ? 'text-lg' : 'text-xl']"></i>
        </div>
        <span v-if="!collapsed" class="leading-none">Disponibilidades</span>
      </div>
      <div class="collapse-content">
        <ul class="text-white ml-1 mt-2 space-y-2">
          <li class="hover:text-slate-400"><a>Disp. Enviadas</a></li>
        </ul>
      </div>
    </div>

    <div :class="['collapse bg-transparent transition-all duration-200', 'collapse-arrow', openRel ? 'collapse-open' : '']">
      <div class="collapse-title text-white flex items-center cursor-pointer px-0 h-12 min-h-0 w-full" :class="[collapsed ? 'justify-center gap-0' : 'justify-start gap-3']" @click="openRel = !openRel">
        <div class="w-8 h-8 flex items-center justify-center shrink-0" :class="[collapsed ? 'tooltip tooltip-right' : '']" :data-tip="collapsed ? 'Relatórios' : null">
          <i class="fa-solid fa-file-lines fa-fw text-white" :class="[collapsed ? 'text-lg' : 'text-xl']"></i>
        </div>
        <span v-if="!collapsed" class="leading-none">Relatórios</span>
      </div>
      <div class="collapse-content">
        <ul class="text-white ml-1 mt-2 space-y-2">
          <li class="hover:text-slate-400"><a href="/RelColagem">Relatório de Colagem</a></li>
          <li class="hover:text-slate-400"><a href="/ReservaCliente">Reservas por Cliente</a></li>
          <li class="hover:text-slate-400"><a href="/PaineisCliente">Painéis por Cliente</a></li>
          <li class="hover:text-slate-400"><a href="/RelPainelBisemana">Painéis por Bisemana</a></li>
        </ul>
      </div>
    </div>

    <div :class="['collapse bg-transparent transition-all duration-200', 'collapse-arrow', openFin ? 'collapse-open' : '']">
      <div class="collapse-title text-white flex items-center cursor-pointer px-0 h-12 min-h-0 w-full" :class="[collapsed ? 'justify-center gap-0' : 'justify-start gap-3']" @click="openFin = !openFin">
        <div class="w-8 h-8 flex items-center justify-center shrink-0" :class="[collapsed ? 'tooltip tooltip-right' : '']" :data-tip="collapsed ? 'Financeiro' : null">
          <i class="fa-solid fa-wallet fa-fw text-white" :class="[collapsed ? 'text-lg' : 'text-xl']"></i>
        </div>
        <span v-if="!collapsed" class="leading-none">Financeiro</span>
      </div>
      <div class="collapse-content">
        <ul class="text-white ml-1 mt-2 space-y-2">
          <li class="hover:text-slate-400"><a href="/Servicos">Cadastro de Serviços</a></li>
          <li class="hover:text-slate-400"><a href="/Comissoes">Cadastro de Comissões</a></li>
          <li class="hover:text-slate-400"><a href="/Caixa">Controle de Caixa</a></li>
        </ul>
      </div>
    </div>

    <div :class="['collapse bg-transparent transition-all duration-200', 'collapse-arrow', openCfg ? 'collapse-open' : '']">
      <div class="collapse-title text-white flex items-center gap-3 cursor-pointer px-0 h-12 min-h-0" :class="[collapsed ? 'tooltip tooltip-right justify-center h-10 min-h-0' : '']" :data-tip="collapsed ? 'Configurações' : null" @click="openCfg = !openCfg">
        <div class="w-8 h-8 flex items-center justify-center shrink-0">
          <i class="fa-solid fa-gears fa-fw text-white" :class="[collapsed ? 'text-lg' : 'text-xl']"></i>
        </div>
        <span v-if="!collapsed" class="leading-none">Configurações</span>
      </div>
      <div class="collapse-content">
        <ul class="text-white ml-1 mt-2 space-y-2">
          <li class="hover:text-slate-400"><a href="/configuracoes">Config Gerais</a></li>
        </ul>
      </div>
    </div>

  </div>
</template>
