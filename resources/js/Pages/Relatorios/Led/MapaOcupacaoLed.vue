<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useToastr } from '@/Components/toastr';

const props = defineProps(['anos', 'bisemanas', 'clientes', 'leds', 'dadosIniciais', 'diasAlerta']);

const toastr = useToastr();

const loading = ref(false);
const idAno = ref(props.anos?.[0]?.id ?? 0);
const idBsInicial = ref(props.bisemanas?.[0]?.id ?? 0);
const idBsFinal = ref(props.bisemanas?.[props.bisemanas.length - 1]?.id ?? 0);
const idCliente = ref(0);
const idLed = ref(0);
const statusFiltro = ref('T');

const listaBisemanas = ref([...(props.bisemanas ?? [])]);
const mapa = ref(props.dadosIniciais ?? { leds: [], range_bs: [], total_leds: 0 });

watch(idAno, () => {
  getBisemanasAno();
});

function getBisemanasAno() {
  if (!idAno.value) {
    listaBisemanas.value = [];
    idBsInicial.value = 0;
    idBsFinal.value = 0;
    return;
  }
  axios.post('/getBisemanass', { bisemana: idAno.value })
    .then(res => {
      listaBisemanas.value = Object.values(res.data);
      idBsInicial.value = listaBisemanas.value[0]?.id ?? 0;
      idBsFinal.value = listaBisemanas.value[listaBisemanas.value.length - 1]?.id ?? 0;
    })
    .catch(() => toastr.error('Erro ao carregar bi-semanas'));
}

function buscarMapa() {
  if (!idBsInicial.value || !idBsFinal.value) {
    toastr.error('Informe o intervalo de bi-semanas');
    return;
  }
  loading.value = true;
  const data = {
    bisemana_inicial: idBsInicial.value,
    bisemana_final: idBsFinal.value,
    cliente_id: idCliente.value || null,
    outdoor_id: idLed.value || null,
    status: statusFiltro.value === 'T' ? null : statusFiltro.value,
  };
  axios.post('/MapaOcupacaoLed', data)
    .then(res => {
      mapa.value = res.data;
    })
    .catch(() => toastr.error('Erro ao buscar mapa de ocupação'))
    .finally(() => loading.value = false);
}

const rangeBsOrdenado = computed(() => {
  const ids = mapa.value.range_bs?.length ? mapa.value.range_bs : listaBisemanas.value.map(b => b.id);
  return ids.sort((a, b) => a - b);
});

function getBsInfo(bsId) {
  return listaBisemanas.value.find(b => b.id === bsId) || { num_bisemana: '?', inicio: null, fim: null };
}

function temOcupacao(led, bsId) {
  return led.ocupacoes?.find(o => o.bisemana_id === bsId) || null;
}

function badgeStatusClasse(statusKey) {
  const map = {
    normal: 'badge-success',
    proximo: 'badge-warning',
    hoje: 'badge-warning animate-pulse',
    encerrado: 'badge-error',
  };
  return map[statusKey] ?? 'badge-info';
}

function abrirContratosProximos() {
  axios.post('/GetContratosProximosTerminoLed', { dias: props.diasAlerta ?? 5 })
    .then(res => {
      const items = res.data || [];
      if (!items.length) {
        toastr.info('Nenhum contrato de LED próximo do término');
        return;
      }
      const linhas = items.map(i =>
        `- LED ${i.painel_ident} • ${i.cliente_nome} • ${i.status_contrato.label}`
      ).join('\n');
      alert(`⚠ Contratos próximos do término (${items.length}):\n\n${linhas}`);
    })
    .catch(() => toastr.error('Erro ao buscar alertas'));
}

onMounted(() => {
  if (props.anos?.length) {
    idAno.value = props.anos[0].id;
    getBisemanasAno();
  }
});
</script>

<template>
  <Head title="Mapa de Ocupação de LEDs" />

  <AuthenticatedLayout>
    <div class="w-full md:pt-20 pb-32 mx-2 md:mx-4">

      <!-- Cabeçalho -->
      <div class="w-full flex flex-wrap items-center justify-between mb-4 gap-4">
        <div class="flex items-center gap-4">
          <h1 class="text-xl md:text-4xl font-bold">Mapa de Ocupação • LEDs</h1>
          <span class="badge badge-primary badge-lg text-white font-bold">
            LEDs: {{ mapa.total_leds ?? 0 }}
          </span>
        </div>
        <button class="btn btn-sm btn-warning" @click="abrirContratosProximos()">
          <i class="fa-solid fa-triangle-exclamation"></i> Contratos próximos do término
        </button>
      </div>

      <!-- Filtros -->
      <div class="w-full flex flex-wrap items-end justify-center gap-4 mb-6 bg-base-200 p-4 rounded-lg">
        <div class="w-full sm:w-3/12 flex flex-col">
          <label class="label-text mb-1">Ano</label>
          <select class="select select-bordered" v-model="idAno" @change="getBisemanasAno()">
            <option value="0" disabled>Selecione</option>
            <option v-for="a in props.anos" :key="a.id" :value="a.id">{{ a.ano_bisemana }}</option>
          </select>
        </div>

        <div class="w-full sm:w-3/12 flex flex-col">
          <label class="label-text mb-1">Bi-semana Inicial</label>
          <select class="select select-bordered" v-model="idBsInicial">
            <option value="0" disabled>Selecione</option>
            <option v-for="b in listaBisemanas" :key="b.id" :value="b.id">
              BS {{ b.num_bisemana }} — {{ new Date(b.inicio).toLocaleDateString('pt-br',{timeZone:'UTC'}) }}
            </option>
          </select>
        </div>

        <div class="w-full sm:w-3/12 flex flex-col">
          <label class="label-text mb-1">Bi-semana Final</label>
          <select class="select select-bordered" v-model="idBsFinal">
            <option value="0" disabled>Selecione</option>
            <option v-for="b in listaBisemanas" :key="b.id" :value="b.id">
              BS {{ b.num_bisemana }} — {{ new Date(b.fim).toLocaleDateString('pt-br',{timeZone:'UTC'}) }}
            </option>
          </select>
        </div>

        <div class="w-full sm:w-3/12 flex flex-col">
          <label class="label-text mb-1">LED</label>
          <select class="select select-bordered" v-model="idLed">
            <option value="0">Todos</option>
            <option v-for="l in props.leds" :key="l.id" :value="l.id">{{ l.identificacao }}</option>
          </select>
        </div>

        <div class="w-full sm:w-3/12 flex flex-col">
          <label class="label-text mb-1">Cliente</label>
          <select class="select select-bordered" v-model="idCliente">
            <option value="0">Todos</option>
            <option v-for="c in props.clientes" :key="c.id" :value="c.id">
              {{ c.razao_social ?? c.nome_fantasia }}
            </option>
          </select>
        </div>

        <div class="w-full sm:w-2/12 flex flex-col">
          <label class="label-text mb-1">Status PI</label>
          <select class="select select-bordered" v-model="statusFiltro">
            <option value="T">Todos</option>
            <option value="com_pi">Com PI</option>
            <option value="sem_pi">Sem PI</option>
          </select>
        </div>

        <div class="w-full sm:w-2/12">
          <button class="btn btn-primary w-full" :class="{'btn-disabled': loading}" @click="buscarMapa()">
            <i class="fa-solid fa-magnifying-glass mr-2"></i>
            {{ loading ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>
      </div>

      <!-- Legenda -->
      <div class="flex flex-wrap items-center gap-4 mb-4">
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-sky-500"></span>
          <span class="text-sm">LED Ocupado (reserva ativa)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-base-300 border border-dashed border-gray-400"></span>
          <span class="text-sm">LED Disponível</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="badge badge-success badge-sm">Normal</span>
          <span class="badge badge-warning badge-sm">Próximo</span>
          <span class="badge badge-error badge-sm">Encerrado</span>
        </div>
      </div>

      <!-- Tabela Timeline -->
      <div class="w-full overflow-auto border border-base-300 rounded-lg bg-base-100">
        <table class="table table-xs table-pin-cols">
          <thead>
            <tr class="bg-base-200">
              <th class="text-center sticky left-0 z-10 bg-base-200 border-r">LED</th>
              <th class="text-center sticky left-[120px] z-10 bg-base-200 border-r">Cliente / Status</th>
              <th class="text-center" v-for="bsId in rangeBsOrdenado" :key="bsId">
                <div class="flex flex-col items-center">
                  <span class="font-bold">BS {{ getBsInfo(bsId).num_bisemana }}</span>
                  <span class="text-[10px] text-gray-500">{{ getBsInfo(bsId).inicio ? new Date(getBsInfo(bsId).inicio).toLocaleDateString('pt-br',{timeZone:'UTC'}) : '?' }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!mapa.leds?.length">
              <tr>
                <td :colspan="2 + rangeBsOrdenado.length" class="text-center py-10 text-gray-400">
                  Nenhum LED encontrado. Cadastre um painel marcando "Painel LED = Sim".
                </td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="led in mapa.leds" :key="led.painel_id" class="hover">
                <td class="sticky left-0 z-10 bg-base-100 border-r">
                  <div class="flex items-center gap-2">
                    <span class="badge badge-primary text-white font-bold">LED</span>
                    <span class="font-bold text-sm">{{ led.identificacao }}</span>
                  </div>
                  <div class="text-[10px] text-gray-500 mt-1">{{ led.bairro }}</div>
                </td>
                <td class="sticky left-[120px] z-10 bg-base-100 border-r">
                  <template v-if="led.ocupacoes?.length">
                    <div v-for="(o, i) in led.ocupacoes" :key="i" class="mb-1">
                      <div class="text-xs truncate max-w-[140px]" :title="o.cliente_nome || ''">
                        {{ o.cliente_nome || '—' }}
                      </div>
                      <span
                        class="badge badge-xs"
                        :class="badgeStatusClasse(o.status_contrato?.status)"
                        :title="o.status_contrato?.label || ''"
                      >
                        {{ o.status_contrato?.label || 'Normal' }}
                      </span>
                    </div>
                  </template>
                  <template v-else>
                    <span class="text-xs text-gray-400">Disponível</span>
                  </template>
                </td>
                <td
                  v-for="bsId in rangeBsOrdenado"
                  :key="bsId"
                  class="text-center"
                >
                  <template v-if="temOcupacao(led, bsId)">
                    <div
                      class="h-6 w-full rounded bg-sky-500 text-white text-[10px] flex items-center justify-center font-bold"
                      :title="(temOcupacao(led, bsId)?.cliente_nome || 'Reservado') + ' • BS ' + getBsInfo(bsId).num_bisemana"
                    >
                      {{ temOcupacao(led, bsId)?.pi_ok ? 'PI' : 'R' }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="h-6 w-full rounded bg-base-300 opacity-40"></div>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="text-xs text-gray-500 mt-3">
        Legenda células: <span class="font-bold">R</span> = Reserva sem PI • <span class="font-bold">PI</span> = Reserva com PI emitido.
      </div>

    </div>
  </AuthenticatedLayout>
</template>
