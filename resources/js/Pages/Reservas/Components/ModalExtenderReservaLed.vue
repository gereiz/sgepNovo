<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useToastr } from '@/Components/toastr';

const toastr = useToastr();

const props = defineProps(['reserva', 'bisemanas', 'anos']);
const emit = defineEmits(['atualizaPage']);

const loading = ref(false);
const idAno = ref(props.anos?.[0]?.id ?? 0);
const listaBs = ref([]);
const idNovaBsFim = ref(0);
const idBisemanasOriginais = ref([]);
const bsAtualFim = ref(null);

watch(idAno, () => getBisemanasAno());

watch(() => props.reserva, () => {
  if (props.reserva) {
    idBisemanasOriginais.value = [];
    bsAtualFim.value = null;
  }
}, { deep: true });

function getBisemanasAno() {
  if (!idAno.value) {
    listaBs.value = [];
    idNovaBsFim.value = 0;
    return;
  }
  axios.post('/getBisemanass', { bisemana: idAno.value })
    .then(res => {
      listaBs.value = Object.values(res.data);
      if (props.reserva?.bisemana_id) {
        // encontra a bs atual e define a final atual default
        const bsAtual = listaBs.value.find(b => b.id === props.reserva.bisemana_id);
        if (bsAtual) bsAtualFim.value = bsAtual;
        // opção default: última do ano
        idNovaBsFim.value = listaBs.value[listaBs.value.length - 1]?.id ?? 0;
      }
    })
    .catch(() => toastr.error('Erro ao carregar bi-semanas'));
}

function enviaEmit(val) {
  emit('atualizaPage', val);
}

function formataData(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('pt-br', { timeZone: 'UTC' }); }
  catch { return d; }
}

function confirmarExtensao() {
  if (!props.reserva?.id) {
    toastr.error('Reserva não identificada');
    return;
  }
  if (!idNovaBsFim.value) {
    toastr.error('Selecione a nova bi-semana final');
    return;
  }
  loading.value = true;
  axios.post('/ExtenderReservaLed', {
    reserva_id: props.reserva.id,
    nova_bisemana_fim_id: idNovaBsFim.value,
    reserva_identificacao: props.reserva.painel_ident,
    cliente_id: props.reserva.cliente_id,
  })
  .then(res => {
    if (res.data.sucesso) {
      toastr.success(res.data.msg || 'Extensão realizada com sucesso!');
      enviaEmit(1);
      // fecha modal
      document.getElementById('modal-extender-led')?.click();
    } else {
      const msg = res.data.msg || 'Erro ao estender reserva';
      const conflitos = (res.data.conflitos || []).map(c => `  • LED ${c.painel_ident} • BS ${c.num_bisemana} (${c.cliente_nome || '—'})`).join('\n');
      toastr.error(conflitos ? msg + '\n' + conflitos : msg);
    }
  })
  .catch(err => toastr.error(err?.response?.data?.msg || 'Erro ao processar extensão'))
  .finally(() => loading.value = false);
}

onMounted(() => {
  if (props.anos?.length) {
    idAno.value = props.anos[0].id;
    getBisemanasAno();
  }
});
</script>

<template>
  <!-- Modal de Extensão de Reserva LED -->
  <input type="checkbox" id="modal-extender-led" class="modal-toggle" />
  <div class="modal flex items-end md:items-center">
    <form method="dialog" class="modal-box bg-white max-w-2xl">
      <h3 class="font-black text-xl text-center mb-4 text-sky-700">
        ⇨ Estender Reserva de LED
      </h3>

      <div v-if="reserva" class="bg-sky-50 border border-sky-200 rounded-lg p-3 mb-4 text-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <strong>LED:</strong>
            <span class="badge badge-primary text-white ml-2">LED {{ reserva.painel_ident }}</span>
          </div>
          <div>
            <strong>Cliente:</strong>
            <span class="ml-2 text-xs truncate block" style="max-width: 220px;">{{ reserva.cliente_nome || '—' }}</span>
          </div>
          <div>
            <strong>Bi-semana atual:</strong>
            <span class="ml-2 badge badge-outline badge-sm">BS {{ reserva.num_bisemana }}</span>
          </div>
          <div>
            <strong>Período atual:</strong>
            <span class="ml-2 text-xs">{{ formataData(reserva.bisemana_ini) }} → {{ formataData(reserva.bisemana_fim) }}</span>
          </div>
        </div>
      </div>

      <p class="text-xs text-gray-600 mb-3">
        Selecione a <strong>nova bi-semana FINAL</strong> de vigência da reserva. O sistema criará as novas bi-semanas consecutivas se não houver conflito com outras reservas.
      </p>

      <div class="w-full flex flex-wrap gap-4 items-end justify-center mb-4">
        <div class="w-full sm:w-4/12 flex flex-col">
          <label class="label-text mb-1">Ano</label>
          <select class="select select-bordered" v-model="idAno" @change="getBisemanasAno()">
            <option value="0" disabled>Selecione</option>
            <option v-for="a in (props.anos || [])" :key="a.id" :value="a.id">{{ a.ano_bisemana }}</option>
          </select>
        </div>

        <div class="w-full sm:w-8/12 flex flex-col">
          <label class="label-text mb-1">Nova Bi-semana Final</label>
          <select class="select select-bordered" v-model="idNovaBsFim">
            <option value="0" disabled>Selecione...</option>
            <option
              v-for="b in listaBs"
              :key="b.id"
              :value="b.id"
            >
              BS {{ b.num_bisemana }} — {{ formataData(b.inicio) }} / {{ formataData(b.fim) }}
              <template v-if="bsAtualFim && b.num_bisemana <= bsAtualFim.num_bisemana"> (antes da atual)</template>
            </option>
          </select>
        </div>
      </div>

      <div class="modal-action">
        <div class="w-full flex justify-center space-x-4">
          <label
            for="modal-extender-led"
            class="w-5/12 text-sm botao-modal bg-gray-700 hover:bg-gray-500 cursor-pointer"
          >
            Cancelar
          </label>
          <label
            @click="confirmarExtensao()"
            for="modal-extender-led"
            class="w-5/12 text-sm botao-modal bg-sky-700 hover:bg-sky-500 cursor-pointer"
            :class="{'btn-disabled opacity-50 pointer-events-none': loading}"
          >
            {{ loading ? 'Processando...' : 'Confirmar Extensão' }}
          </label>
        </div>
      </div>
    </form>
  </div>
</template>
