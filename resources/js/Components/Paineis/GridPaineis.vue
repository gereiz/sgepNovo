<!-- PainelReserva.vue -->
<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { getLink } from '@/functions'
import { QuestionMarkCircleIcon } from '@heroicons/vue/20/solid'
import Multiselect from 'vue-multiselect'
import ConfirmaReserva from './ConfirmaReserva.vue'
import { useToastr } from '@/Components/toastr'
import { usePage } from '@inertiajs/vue3'

const props = defineProps(['tipoPainel', 'cliente', 'bisemana', 'paineis', 'ambiente'])
const emit = defineEmits(['checkedPaineis', 'checkedPaineisId', 'campanha', 'observacoes'])

const page = usePage()
const toastr = useToastr()

const liberaReserva = page.props.user.permissions.includes('liberar reserva')
const liberaReservaPainel04 = page.props.user.permissions.includes('liberar reserva painel 04')

const pesquisaPainel = ref('')
const openCampanha = ref(false)
const campanha = ref('')
const observacoes = ref('')

const paineis = ref(props.paineis) // todos os painéis carregados
const checkedPaineis = ref([]) // identificações selecionadas
const checkedPaineisId = ref([]) // ids selecionados

const paineisNobres = ref([])
const paineisConvencionais = ref([])

onMounted(() => {
  getPaineis()
})

watch(() => campanha.value, () => {
  emit('campanha', campanha.value)
  emit('observacoes', observacoes.value)
})

watch(() => props.bisemana, () => {
  getPaineis()
})

function openCamp(val) {
  openCampanha.value = val === 't'
}

const paineisFiltrados = computed(() => {
  return paineis.value.filter((painel) =>
    String(painel.identificacao)
      .toLowerCase()
      .includes(pesquisaPainel.value.toLowerCase())
  )
})

function togglePainel(painel) {
  const painelId = painel.identificacao
  const id = painel.id
  const already = checkedPaineis.value.includes(painelId)

  if (already) {
    // remover
    checkedPaineis.value = checkedPaineis.value.filter((p) => p !== painelId)
    checkedPaineisId.value = checkedPaineisId.value.filter((p) => p !== id)

    if (painel.tipo === '1') {
      paineisNobres.value = paineisNobres.value.filter((p) => p !== painelId)
    } else {
      paineisConvencionais.value = paineisConvencionais.value.filter(
        (p) => p !== painelId
      )
    }
  } else {
    // validações antes de aceitar
    if (!liberaReservaPainel04 && String(painelId) === '4' && paineisConvencionais.value.length < 4) {
      toastr.error(
        'O painel 04 não pode ser reservado sem no mínimo 4 painéis convencionais'
      )
      return
    }

    if (!liberaReserva) {
      if (painel.tipo === '2') {
        paineisConvencionais.value.push(painelId)
      } else {
        if (paineisNobres.value.length * 2 >= paineisConvencionais.value.length) {
          toastr.error(
            'O número de painéis nobres não pode ser maior que o dobro do número de painéis convencionais'
          )
          return
        } else if (paineisConvencionais.value.length === 1 && painel.tipo === '1') {
          toastr.error('O número de painéis convencionais não pode ser menor que 2')
          return
        } else if (
          paineisNobres.value.length === 1 &&
          paineisConvencionais.value.length === 3 &&
          painel.tipo === '1'
        ) {
          toastr.error(
            'O número de painéis nobres não pode ser maior que o dobro do número de painéis convencionais'
          )
          return
        } else {
          paineisNobres.value.push(painelId)
        }
      }
    }

    // adicionar
    checkedPaineis.value.push(painelId)
    checkedPaineisId.value.push(id)
  }

  emit('checkedPaineis', checkedPaineis.value)
  emit('checkedPaineisId', checkedPaineisId.value)
}

function getPaineis() {
  axios
    .post('/GetPaineis', {
      statusPainel: props.tipoPainel,
      bisemana: props.bisemana
    })
    .then((res) => {
      paineis.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })
}

function getImage(i) {
  if (props.ambiente === 'local') {
    return 'http://localhost:8000/storage/' + i
  }
  return '/storage/' + i
}

function clearChecked() {
  checkedPaineis.value = []
  checkedPaineisId.value = []
  paineisNobres.value = []
  paineisConvencionais.value = []
  campanha.value = ''
}

function getCampanha(ev) {
  campanha.value = ev
}

function getObservacoes(ev) {
  observacoes.value = ev
}
</script>

<template>
  <div class="w-full flex flex-wrap sm:flex-none mt-2 space-y-4 sm:space-y-0">
    <!-- Barra de pesquisa -->
    <div class="sm:w-4/12 w-full justify-center mb-2">
      <div class="w-10/12 ms-10 relative mt-2 rounded-md shadow-sm">
        <input
          type="text"
          v-model="pesquisaPainel"
          name="pesquisa_painel"
          id="pesquisa_painel"
          class="input input-bordered w-full h-11 -mt-1 mb-2"
          placeholder="Pesquisar Painel"
        />
      </div>
    </div>

    <!-- Painéis Selecionados -->
    <div class="sm:w-6/12 w-full justify-center">
      <div class="w-10/12 relative ms-10 sm:ms-0 mt-1 rounded-md shadow-sm">
        <div class="w-full flex">
          <div class="w-9/12 me-4">
            <multiselect
              disabled
              v-model="checkedPaineis"
              :options="[]"
              :multiple="true"
              placeholder="Painéis Selecionados"
            />
          </div>
          <div class="w-2/12">
            <button
              @click="clearChecked()"
              class="w-full h-6 btn btn-error text-white"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Botão de Inclusão de campanha -->
    <div
      v-if="checkedPaineis.length > 0 && campanha === ''"
      class="sm:w-1/12 w-full sm:-ms-20 "
    >
      <button
        title="Preencher Campanha e Observações"
        @click="openCamp('t')"
      >
        <QuestionMarkCircleIcon
          class="-mt-1 w-14 h-14 sm:w-14 sm:h-14 text-red-600 hover:text-red-700 transition-all duration-1000 animate-bounce"
        />
      </button>
    </div>
    <div
      v-else-if="checkedPaineis.length > 0 && campanha !== ''"
      class="sm:w-1/12 w-full sm:-ms-20 "
    >
      <button
        title="Campanha e Observações preenchidos"
        @click="openCamp('t')"
      >
        <QuestionMarkCircleIcon
          class="-mt-1 w-14 h-14 sm:w-14 sm:h-14 text-green-600 hover:text-green-700 transition-all duration-1000 animate-bounce"
        />
      </button>
    </div>
  </div>

  <!-- Card Principal -->
  <div
    class="card w-full h-[28rem] sm:h-[35rem] bg-base-100 border border-base-200 shadow-xl overflow-auto rounded-md"
  >
    <div class="card-body flex flex-col sm:flex-row">
      <!-- Paineis -->
      <div class="w-full flex flex-col flex-wrap md:flex-row">
        <!-- Cards dos Paineis -->
        <div
          v-for="(pain, index) in paineisFiltrados"
          :key="pain.id"
          class="card w-full sm:w-[30%] card-reserva-cliente"
        >
          <div
            class="card-body flex"
            :id="index"
            @click="togglePainel(pain)"
          >
            <div class="w-full flex-col sm:flex sm:flex-wrap">
              <div class="w-full flex justify-between max-h-8 -mt-4">
                <img
                  v-if="pain.tipo === '1'"
                  class="mb-2 w-6 h-6 sm:w-8 sm:h-8 sm:hover:w-10 sm:hover:h-10 transition-all duration-1000"
                  src="../../../../public/storage/img/painel_nobre.png"
                  alt="Painel Nobre"
                  title="Painel Nobre"
                />
                <img
                  v-else
                  class="mb-2 w-6 h-6 sm:w-8 sm:h-8 sm:hover:w-10 sm:hover:h-10 transition-all duration-1000"
                  src="../../../../public/storage/img/painel_conv.png"
                  alt="Painel Convencional"
                  title="Painel Convencional"
                />
                <span
                  class="text-xs sm:text-lg font-bold text-red-500"
                >Identificação.: {{ pain.identificacao }}</span>
              </div>
              <div class="w-full flex justify-end">
                <!-- Checkbox controlado -->
                <input
                  type="checkbox"
                  class="w-8 h-8 border-0 checkbox checkbox-success"
                  :value="pain.identificacao"
                  v-model="checkedPaineis"
                  @click.stop
                />
              </div>
              <div
                class="w-full flex flex-wrap sm:flex-nowrap justify-center my-2 sm:-ml-2 space-x-2"
              >
                <div class="w-full flex justify-center sm:w-6/12">
                  <img
                    class="w-[240px] h-[140px] hover:scale-150 transition-all duration-1000 rounded-md"
                    :src="getImage(pain.image_url)"
                    alt="Foto-painel"
                  />
                </div>

                <div class="w-full sm:w-6/12">
                  <div class="sm:flex flex-wrap ">
                    <div
                      class="w-full flex flex-col items-center space-y-3 mt-4 sm:mt-0"
                    >
                      <p class="text-xs sm:text-md font-extrabold">
                        Bairro: {{ pain.bnome }}
                      </p>

                      <p class="text-xs sm:card-md">
                        {{ pain.logradouro }} - {{ pain.numero }}
                      </p>

                      <p
                        class="text-xs sm:text-md hover:text-red-700 sm:ml-4"
                      >
                        Ver Localização
                      </p>
                      <a
                        :href="getLink(pain.latitude, pain.longitude)"
                        target="_blank"
                      >
                        <img
                          class="w-6 h-6 ms-4 -mt-1 sm:hover:w-10 sm:hover:h-10 transition-all duration-500"
                          src="../../../../public/storage/img/regiao.png"
                          alt="Mapa"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmaReserva
    :open="openCampanha"
    @closeObs="openCamp"
    @campanha="getCampanha($event)"
    @observacoes="getObservacoes($event)"
  />
</template>
