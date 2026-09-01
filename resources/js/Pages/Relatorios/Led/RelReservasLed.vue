<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref, onMounted, watch, computed } from 'vue';
import { useToastr } from '@/Components/toastr';

const props = defineProps(['anos', 'bisemanas', 'clientes', 'leds', 'dadosIniciais']);
const toastr = useToastr();

const loading = ref(false);
const idAno = ref(props.anos?.[0]?.id ?? 0);
const idBsInicial = ref(props.bisemanas?.[0]?.id ?? 0);
const idBsFinal = ref(props.bisemanas?.[props.bisemanas.length - 1]?.id ?? 0);
const idCliente = ref(0);
const idLed = ref(0);
const statusPi = ref('T');
const listaBisemanas = ref([...(props.bisemanas ?? [])]);

const resultado = ref(props.dadosIniciais ?? { reservas: [], total: 0, valor_total: 0 });

watch(idAno, () => getBisemanasAno());

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

function buscar() {
  if (!idBsInicial.value || !idBsFinal.value) {
    toastr.error('Informe o intervalo de bi-semanas');
    return;
  }
  loading.value = true;
  axios.post('/GetReservasLed', {
    bisemana_inicial: idBsInicial.value,
    bisemana_final: idBsFinal.value,
    cliente_id: idCliente.value || null,
    outdoor_id: idLed.value || null,
    status_pi: statusPi.value === 'T' ? null : statusPi.value,
  })
    .then(res => resultado.value = res.data)
    .catch(() => toastr.error('Erro ao buscar reservas de LED'))
    .finally(() => loading.value = false);
}

function gerarPdf() {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/RelReservasLedPdf';
  form.target = '_blank';
  const csrf = document.querySelector('meta[name="csrf-token"]');
  if (csrf) {
    const t = document.createElement('input');
    t.type = 'hidden'; t.name = '_token'; t.value = csrf.content;
    form.appendChild(t);
  }
  const payload = {
    bisemana_inicial: idBsInicial.value,
    bisemana_final: idBsFinal.value,
    cliente_id: idCliente.value,
    outdoor_id: idLed.value,
    status_pi: statusPi.value,
  };
  Object.keys(payload).forEach(k => {
    const i = document.createElement('input');
    i.type = 'hidden'; i.name = k; i.value = payload[k];
    form.appendChild(i);
  });
  document.body.appendChild(form);
  form.submit();
  form.remove();
}

function badgeStatusClasse(k) {
  return {
    normal: 'badge-success',
    proximo: 'badge-warning',
    hoje: 'badge-warning animate-pulse',
    encerrado: 'badge-error',
  }[k] ?? 'badge-info';
}

function formataValor(v) {
  if (v == null) return '—';
  return Number(v).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

function formataData(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('pt-br', { timeZone: 'UTC' }); }
  catch { return d; }
}

onMounted(() => {
  if (props.anos?.length) {
    idAno.value = props.anos[0].id;
    getBisemanasAno();
  }
});
</script>

<template>
  <Head title="Relatório de Reservas de LEDs" />

  <AuthenticatedLayout>
    <div class="w-full md:pt-20 pb-32 mx-2 md:mx-4">
      <div class="flex flex-wrap items-center justify-between mb-4 gap-4">
        <h1 class="text-xl md:text-4xl font-bold">Relatório de Reservas • LEDs</h1>
        <button class="btn btn-sm btn-primary" @click="gerarPdf">
          <i class="fa-solid fa-file-pdf mr-2"></i> Gerar PDF
        </button>
      </div>

      <!-- Filtros -->
      <div class="w-full flex flex-wrap items-end justify-center gap-4 mb-6 bg-base-200 p-4 rounded-lg">
        <div class="w-full sm:w-2/12 flex flex-col">
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
              BS {{ b.num_bisemana }} — {{ formataData(b.inicio) }}
            </option>
          </select>
        </div>
        <div class="w-full sm:w-3/12 flex flex-col">
          <label class="label-text mb-1">Bi-semana Final</label>
          <select class="select select-bordered" v-model="idBsFinal">
            <option value="0" disabled>Selecione</option>
            <option v-for="b in listaBisemanas" :key="b.id" :value="b.id">
              BS {{ b.num_bisemana }} — {{ formataData(b.fim) }}
            </option>
          </select>
        </div>
        <div class="w-full sm:w-2/12 flex flex-col">
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
          <select class="select select-bordered" v-model="statusPi">
            <option value="T">Todos</option>
            <option value="com_pi">Com PI</option>
            <option value="sem_pi">Sem PI</option>
          </select>
        </div>
        <div class="w-full sm:w-2/12">
          <button class="btn btn-primary w-full" :class="{'btn-disabled': loading}" @click="buscar()">
            {{ loading ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>
      </div>

      <!-- Totais -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="stat bg-base-200">
          <div class="stat-title">Total de Reservas LED</div>
          <div class="stat-value text-sky-600">{{ resultado.total ?? 0 }}</div>
        </div>
        <div class="stat bg-base-200">
          <div class="stat-title">Valor Total (PI)</div>
          <div class="stat-value text-emerald-600 text-2xl">{{ formataValor(resultado.valor_total) }}</div>
        </div>
        <div class="stat bg-base-200">
          <div class="stat-title">LEDs distintos c/ reserva</div>
          <div class="stat-value text-amber-600">
            {{ [...new Set((resultado.reservas || []).map(r => r.painel_id))].length }}
          </div>
        </div>
      </div>

      <!-- Tabela -->
      <div class="overflow-x-auto border border-base-300 rounded-lg bg-base-100">
        <table class="table table-sm">
          <thead>
            <tr class="bg-base-200">
              <th>LED</th>
              <th>Cliente</th>
              <th>Campanha</th>
              <th>Bi-semana</th>
              <th>Período</th>
              <th>PI</th>
              <th>Valor PI</th>
              <th>Pago</th>
              <th>Status Contrato</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!resultado.reservas?.length">
              <td colspan="9" class="text-center py-10 text-gray-400">
                Nenhuma reserva de LED encontrada no período.
              </td>
            </tr>
            <tr v-for="r in resultado.reservas" :key="r.reserva_id" class="hover">
              <td>
                <span class="badge badge-primary text-white font-bold mr-2">LED</span>
                <span class="font-bold">{{ r.painel_ident }}</span>
              </td>
              <td class="max-w-[180px] truncate" :title="r.cliente_nome">{{ r.cliente_nome ?? '—' }}</td>
              <td class="max-w-[160px] truncate" :title="r.campanha">{{ r.campanha ?? '—' }}</td>
              <td>
                <span class="badge badge-outline badge-sm">BS {{ r.num_bisemana ?? '—' }}</span>
              </td>
              <td>
                <div class="text-xs">
                  <div>Início: {{ formataData(r.bisemana_ini) }}</div>
                  <div>Fim:    {{ formataData(r.bisemana_fim) }}</div>
                </div>
              </td>
              <td>
                <template v-if="r.pi_ok && r.pi_id">
                  <span class="badge badge-success text-white">PI #{{ r.pi_id }}</span>
                </template>
                <template v-else>
                  <span class="badge badge-ghost badge-sm">Sem PI</span>
                </template>
              </td>
              <td class="text-right">{{ formataValor(r.vl_total_pi) }}</td>
              <td class="text-center">
                <span v-if="r.pago" class="badge badge-success text-white">Sim</span>
                <span v-else class="badge badge-ghost badge-sm">Não</span>
              </td>
              <td>
                <span
                  class="badge badge-xs"
                  :class="badgeStatusClasse(r.status_contrato?.status)"
                  :title="r.status_contrato?.data_fim ? 'Data fim: ' + r.status_contrato.data_fim : ''"
                >
                  {{ r.status_contrato?.label ?? 'Normal' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </AuthenticatedLayout>
</template>
