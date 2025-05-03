<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { vMaska } from "maska"
import { UserCircleIcon  } from '@heroicons/vue/24/outline'
import { usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import axios from 'axios';
import Multiselect from 'vue-multiselect';

const toastr = useToastr()

const props = defineProps(['cliente', 'campanha', 'paineis','bisemana', 'dataReserva', 'agentes'])
const emit = defineEmits(['nextStep','formTwo']); 

const edit = ref(false)
const page = usePage()

const usuario = ref ()
const usuarios = ref()
const servicos = ref()
const quantidade = ref(props.paineis.length)

const servicosPagos = ref([])

const vlrUnit = ref('')
const vlrDesc = ref(0)
const vlrTotal = ref()

const agentesLista = ref([]);

const formTwo = reactive({
    paineis: props.paineis,
    campanha: props.campanha[0],
    vendedorId: '',
    agentesId: [],
    vendedor: ''

})

watch((vlrUnit), (val) => {

    vlrUnit.value = val
    formTwo.vlr_unit = val

    if(parseFloat(vlrDesc.value) > parseFloat(vlrUnit.value)) {
        vlrTotal.value = 0.0

    } else {
        vlrTotal.value = ((parseFloat(vlrUnit.value) - parseFloat(vlrDesc.value)) * parseFloat(quantidade.value)).toFixed(2)
        formTwo.vlr_total =  vlrTotal.value
    }


})

watch((vlrDesc), (val) => {
    vlrDesc.value = val
    formTwo.vlr_desc = val

    if(parseFloat(vlrDesc.value) > parseFloat(vlrUnit.value)) {
        vlrTotal.value = 0.0
    } else {
        vlrTotal.value = ((parseFloat(vlrUnit.value) - parseFloat(vlrDesc.value)) * parseFloat(quantidade.value)).toFixed(2)
        formTwo.vlr_total =  vlrTotal.value
    }

})

watch((quantidade), (val) => {
    quantidade.value = val
    if(parseFloat(vlrDesc.value) > parseFloat(vlrUnit.value)) {
        vlrTotal.value = 0.0
    } else {
        vlrTotal.value = ((parseFloat(vlrUnit.value) - parseFloat(vlrDesc.value)) * parseFloat(quantidade.value)).toFixed(2)
        formTwo.vlr_total =  vlrTotal.value
    }

})

watch(agentesLista, (val) => {
  if (!Array.isArray(formTwo.agentesId)) {
    formTwo.agentesId = [];
  }

  val.forEach((agente) => {
    if (!formTwo.agentesId.includes(agente)) {
      formTwo.agentesId.push(agente);
    }
  });
});

function getUsuarios() {
    axios.get('/getUsuarios')
    .then((response) => {
        usuarios.value = response.data
    })
    .catch((error) => {
        console.log(error)
    })

    return usuarios
}

const getUsuario = (val) => {
    usuario.value = usuarios.value.find((user) => user.id == val)
    formTwo.vendedorId = usuario.value.id
    formTwo.vendedor = usuario.value.name

}

function getServicos() {
    axios.get('/ListaServicos')
    .then((response) => {
        // compara se o id do serviço já está na lista de serviços pagos e exibe somente os que não estão
        servicos.value = response.data.filter((serv) => {
            return !servicosPagos.value.some((sp) => sp.nome === serv.nome)
        })
    })
    .catch((error) => {
        console.log(error)
    })

    return servicos
}

const nextStep = (val) => {

    if(val == 1) {
        emit('nextStep', val)
    }

    if(val == 3) {
        if(formTwo.vendedorId == 0) {
            toastr.error('Selecione o Vendedor')
            return
        }
        
        if(formTwo.agentesId.length === 0) {
            toastr.error('Selecione pelo menos um Agente')
            return
        }

        emit('nextStep', val);
        emit('formTwo', formTwo)
    }

    if(val == 5) {
        emit('formTwo', formTwo)
        emit('nextStep', val);
    }
}

function changeEdit() {
    getServicos()

    getUsuarios()

    if(edit.value === false) {
        edit.value = true
    }

}


</script>

<template>
    <div class="space-y-6">
        <!-- Botão de Editar contato -->
        <div class="mt-3 text-center sm:mt-0 sm:text-left">
            <h1 as="h3" class="text-base font-semibold leading-6 text-gray-900">Pedido de Inserção</h1>
            <div class="flex mt-2">
                <p class="text-sm text-gray-500 mb-4">Confira os dados da reserva do Pedido de Inserção. </p>
                <button class="btn btn-sm btn-warning text-white btn-circle -mt-1 ml-3"
                        v-if="!edit"
                        @click="changeEdit()"
                        title="Ativar Edição">
                <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
                </button>

                <button v-else class="btn btn-sm btn-success text-white btn-circle -mt-1 ml-3"
                        @click="changeEdit()"
                        title="Edição Ativada">
                <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <p class="text-xs font-bold text-red-500 text-center">Bi-Semana: {{ bisemana[0].num_bisemana }} {{ new Date(bisemana[0].inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bisemana[0].fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}</p>
        </div>

        <!--Painéis / Campanha -->
        <div class="flex w-full space-x-6">
            <div class="sm:w-8/12">
                <label class="label">
                    <span class="label-text">Painéis</span>
                </label>
                <input type="text"
                    v-model="formTwo.paineis"
                    class="input input-bordered w-full text-red-500 font-extrabold"
                    disabled />
            </div>

            <div class="w-4/12">
                <label class="label">
                    <span class="label-text">Campanha</span>
                </label>
                <input type="text"
                    v-model="formTwo.campanha"
                    class="input input-bordered w-full"
                    :disabled="edit == false" />
            </div>
        </div>

        <!-- Agente / Vendedor-->
        <div class="flex flex-wrap w-full justify-between">
            <div class="sm:w-[47%]">
                <label class="label">
                    <span class="label-text">Vendedor</span>
                </label>
                <select id="vendedor" name="vendedor"
                        @change="getUsuario($event.target.value)"
                        v-model="formTwo.vendedorId"
                        class="select select-bordered w-full"
                        :disabled="edit == false">
                    <option value="0" disabled selected>SELECIONE</option>
                    <option v-for="user in usuarios" :key="user.id" :value="user.id">{{ user.name }}</option>
                </select>
            </div>

            <div class="sm:w-[47%]">
                <label class="label">
                    <span class="label-text">agentes</span>
                </label>
                <multiselect
                    v-model="agentesLista"
                    :options="props.agentes.map(agente => agente.id)"
                    :custom-label="id => {
                        const agente = props.agentes.find(a => a.id === id);
                        return agente ? (agente.nome_fantasia ? agente.nome_fantasia : agente.razao_social) : '';
                    }"
                    :multiple="true"
                    :searchable="true"
                    :close-on-select="false"
                    :show-labels="false"
                    :hide-selected="true"
                    open-direction="bottom"
                    placeholder="Selecione os agentes"
                    :disabled="edit == false"
                >
                </multiselect>
            </div>
        </div>

        <!-- Avançar / Voltar -->
        <div class="w-full sm:flex sm:flex-row-reverse">
            <button class="btn btn-success w-full sm:w-auto sm:ml-3" @click="nextStep(3)">Avançar</button>
            <button class="btn btn-outline mt-3 sm:mt-0 w-full sm:w-auto" @click="nextStep(1)">Voltar</button>
        </div>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
