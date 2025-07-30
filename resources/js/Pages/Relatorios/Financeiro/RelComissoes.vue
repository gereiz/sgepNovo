<script setup>
import { ref, reactive, shallowRef, watch, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { vMaska } from 'maska'
import { usePage } from '@inertiajs/vue3';

const props = defineProps(['openRelScreen', 'anos', 'pis',  'bisemanas', 'comissoes', 'clientes']);
const emit = defineEmits(['closeRel']);

const anoAtual = new Date().getFullYear(); // Obtém o ano atual
const idAno = ref(0); // Inicializa a variável reativa
const open = ref(false)
const mes = ref(0)
const agenteSel = ref(0)
const anoSelecionado = ref(0)

const pisFiltradas = ref([])
const bisemanasFiltradas = ref([])
const agentesFiltrados = ref([])
const comissoesFiltradas = ref([])


const page = usePage();
const permissions = page.props.user.permissions;


onMounted(() => {
    // Procura o ID do ano atual na lista de anos disponíveis
    const anoEncontrado = props.anos.find(ano => ano.ano_bisemana == anoAtual);
        if (anoEncontrado) {
            idAno.value = anoEncontrado.id;
        }
})


watch(() => props.openRelScreen, (val)  =>{
    if(val === true) {
        open.value = true
    }
})


function closeRel() {
    open.value = false

    emit('closeRel', open.value)

}


function getReservasMes(mes) {
    // Garante que props.pis existe e é um array
    if (!props.pis || !Array.isArray(props.pis)) {
        console.warn('props.pis ainda não está disponível ou não é um array.');
        pisFiltradas.value = []; // ou mantenha o valor anterior, conforme a lógica desejada
        return;
    }

    if (mes === 0) {
        // Se nenhum mês for selecionado, mostrar todas as PIs
        pisFiltradas.value = props.pis;
        // console.log(pisFiltradas.value);
    } else {

        // filtra o ano atual
        anoSelecionado.value = props.anos.find(ano => ano.id == idAno.value)

        // filtra as bisemanas que contem o mês igual ao mes selecionado
        bisemanasFiltradas.value = props.bisemanas.filter(bs => {
            if (!bs.fim) return false;

            const partesData = bs.fim.split('-');
            if (partesData.length < 3) return false;

            const anoData = parseInt(partesData[0]);  // YYYY
            const mesData = parseInt(partesData[1]);  // MM

            return anoData == anoSelecionado.value.ano_bisemana && mesData == mes;
        });

        //filtra as PI's pelos ids
        pisFiltradas.value = props.pis.filter(pi =>
            bisemanasFiltradas.value.some(bs => pi.id_bisemana === bs.id)
        );

        // filtra os agentes que tem comissão no mês selecionado
        agentesFiltrados.value = props.clientes.filter(agente => {
            return props.comissoes.some(comissao => agente.id === comissao.agente_id && pisFiltradas.value.some(pi => pi.id === comissao.pi_id))
        });

        // filtra as comissões por agente e pis
        comissoesFiltradas.value = props.comissoes.filter(comissao => {
            return pisFiltradas.value.some(pi => pi.id === comissao.pi_id) && agentesFiltrados.value.some(agente => agente.id === comissao.agente_id);
        });
        console.warn(comissoesFiltradas.value);

    }
}


function getRelComissoes() {
    let btn = document.getElementById('gera_rel');
    btn.innerHTML = 'Carregando...';

    axios.post('/setRelComissoes', {
        pis: pisFiltradas.value,
        agentes: agentesFiltrados.value,
        bisemanas: bisemanasFiltradas.value,
        comissoes: comissoesFiltradas.value,
        agenteSel: agenteSel.value

    })
    .then(res => {
        console.warn(res)
        setTimeout(() => {
            btn.innerHTML = 'Gerar Relatório';
            window.open('/getRelComissoes', '_blank');
        }, 500);
    })
}

</script>


<template>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto mt-16">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white w-full sm:w-[50%] sm:p-6 sm:my-4 pb-4 pt-5 text-left shadow-xl transition-all">
                <div>
                  <!-- <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <ClipboardDocumentCheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div> -->
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                        Informe os dados abaixo para Gerar o Relatório Mensal<span class="text-red-500 font-extrabold"></span>
                    </DialogTitle>

                    <!-- Dados do Relatório -->
                    <div class="w-full flex h-32 items-center justify-center lg:mb-4 mt-4">
                        <!-- Anos -->
                        <div class="w-[23%] lg:w-[11%] flex flex-col me-4 sm:me-6 mb-2">
                            <label for="bi-semana">Ano</label>
                            <select class="select select-bordered" name="ano" id="ano" v-model="idAno" @change="getBisemanas()">
                                <option value="0" selected>Selecione</option>
                                <option v-for="(ano, index) in anos" :key="index" :value="ano.id">{{ ano.ano_bisemana }}</option>
                            </select>
                        </div>

                        <!-- Mês -->
                        <div class="w-[45%] lg:w-[20%] flex flex-col me-4 sm:me-6 mb-2">
                            <label for="mes">Mês</label>
                            <select class="select select-bordered" name="mes" id="mes" v-model="mes" @change="getReservasMes(mes)">
                                <option value="0" selected disabled>Selecione</option>
                                <option value="1" >Janeiro</option>
                                <option value="2" >Fevereiro</option>
                                <option value="3" >Março</option>
                                <option value="4" >Abril</option>
                                <option value="5" >Maio</option>
                                <option value="6" >Junho</option>
                                <option value="7" >Julho</option>
                                <option value="8" >Agosto</option>
                                <option value="9" >Setembro</option>
                                <option value="10" >Outubro</option>
                                <option value="11" >Novembro</option>
                                <option value="12" >Dezembro</option>
                            </select>
                        </div>

                        <!-- Vendedor -->
                        <div class="w-[66%] lg:w-[30%] flex flex-col me-4 sm:me-6 mb-2">
                            <label for="agentes">Agente</label>
                            <select class="select select-bordered" name="agentes" id="agentes" v-model="agenteSel" disabled>
                                <option value="0" selected>TODOS</option>
                                <option v-for="(agente, index) in agentesFiltrados"
                                    :key="index"
                                    :value="agente.id">{{ agente.nome_fantasia ? agente.nome_fantasia : agente.razao_social }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="mt-5 sm:mt-6 w-full space-y-4 space-x-2 border-t border-gray-200 pt-4">
                        <button class="w-5/12 btn btn-default bg-slate-400 text-white mt-4" @click="closeRel()">
                            Cancelar
                        </button>
                        <button id="gera_rel" class="w-5/12 btn btn-success text-white mt-4" @click="getRelComissoes()" :disabled="mes == 0">
                            Gerar Relatório
                        </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

</template>

