<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { vMaska } from "maska"
import { UserCircleIcon  } from '@heroicons/vue/24/outline'
import { usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import axios from 'axios';
import Swal from 'sweetalert2';

const toastr = useToastr()

const props = defineProps(['cliente', 'campanha', 'paineis','bisemana', 'dataReserva', 'agentes'])
const emit = defineEmits(['nextStep','formTwo', 'formFour']); 

const edit = ref(false)
const page = usePage()

const usuarios = ref()

const servicos = ref()
const servico = ref(0)
const quantidade = ref(props.paineis.length)
const id_servico = ref(0)
const servicoSelecionado = ref('')
const servicosPagos = ref([])

const vlrUnit = ref('')
const vlrDesc = ref(0)
const vlrTotal = ref()
const detalhes = ref('')

const dataAtual = new Date().toISOString().slice(0, 10);
const dtPgto = ref(dataAtual)
const dtReserva = ref(dataAtual)

const formFour = reactive({
    servicos: servicosPagos,
    formaPgto: 0,
    pgto: '',
    parcelado: 0,
    qtdParcelas: 1,
    dtPgto: dtPgto.value,
    dtReserva: props.dataReserva,

})

watch((vlrUnit), (val) => {

    vlrUnit.value = val
    formFour.vlr_unit = val

    if(parseFloat(vlrDesc.value) > parseFloat(vlrUnit.value)) {
        vlrTotal.value = 0.0

    } else {
        vlrTotal.value = ((parseFloat(vlrUnit.value) - parseFloat(vlrDesc.value)) * parseFloat(quantidade.value)).toFixed(2)
        formFour.vlr_total =  vlrTotal.value
    }


})

watch((vlrDesc), (val) => {
    vlrDesc.value = val
    formFour.vlr_desc = val

    if(parseFloat(vlrDesc.value) > parseFloat(vlrUnit.value)) {
        vlrTotal.value = 0.0
    } else {
        vlrTotal.value = ((parseFloat(vlrUnit.value) - parseFloat(vlrDesc.value)) * parseFloat(quantidade.value)).toFixed(2)
        formFour.vlr_total =  vlrTotal.value
    }

})

watch((quantidade), (val) => {
    quantidade.value = val
    if(parseFloat(vlrDesc.value) > parseFloat(vlrUnit.value)) {
        vlrTotal.value = 0.0
    } else {
        vlrTotal.value = ((parseFloat(vlrUnit.value) - parseFloat(vlrDesc.value)) * parseFloat(quantidade.value)).toFixed(2)
        formFour.vlr_total =  vlrTotal.value
    }

})

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


function getServico(val) {
    axios.post('/GetServico', {id_servico: val})
    .then((res) => {
        id_servico.value = res.data.id
        servicoSelecionado.value = res.data


    })
    .catch((err) => {
        toastr.error(res.data.message)
    })

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

function ListaServicosPagos() {

    // verifica se a quantidade é maior que a quantidade de painéis
    if(parseInt(quantidade.value) > parseInt(props.paineis.length)) {
        toastr.error('Quantidade do serviço é maior que a quantidade de Painéis disponíveis!')
        return
    }

    // verifica se a quantidade é menor que 1
    if(parseInt(quantidade.value) < 1 || quantidade.value == '') {
        toastr.error('Quantidade do serviço não pode ser menor que 1 !')
        return
    }

    // verifica se o valor unitário é menor que 1
    if(parseFloat(vlrUnit.value) < 1 || vlrUnit.value == '') {
        toastr.error('Valor Unitário do serviço não pode ser menor que R$ 1.00 !')
        return
    }

    // verifica se o valor do desconto é vazio
    if(vlrDesc.value == '') {
        vlrDesc.value = 0
    }

    // verifica se o valor unitário é menor que o valor do desconto
    if(parseFloat(vlrDesc.value) > parseFloat(vlrUnit.value)) {
        toastr.error('Valor do Desconto não pode ser maior que o Valor Unitário !')
        return
    }

    // adiciona o serviço na lista de serviços pagos
    servicosPagos.value.push({
        id: servicoSelecionado.value.id,
        nome: servicoSelecionado.value.nome,
        quantidade: quantidade.value,
        vlr_unit: vlrUnit.value,
        vlr_desc: vlrDesc.value,
        vlr_total: vlrTotal.value,
        detalhes: detalhes.value
    })

    servico.value = 0
    quantidade.value = props.paineis.length
    vlrUnit.value = 0
    vlrDesc.value = 0

    getServicos()

}

function removeServicoPago(index) {
    servicosPagos.value.splice(index, 1)

    getServicos()
}

const nextStep = (val) => {

    if(val == 3) {
        emit('nextStep', val)
    }

    if(val == 5) {
        if(formFour.pgto == '') {
            toastr.error('Informe se o Pedido foi Pago')
            return
        }

        if(servicosPagos.value.length == 0) {
            toastr.error('Adicione ao menos um Serviço')
            return
        }

        if(formFour.formaPgto == 0) {
            toastr.error('Selecione a Forma de Pagamento')
            return
        }

        if(formFour.pgto == 1 && formFour.dtPgto == '') {
            toastr.error('Informe a Data de Pagamento')
            return
        }

        if(formFour.pgto == 1 && formFour.dtPgto.length < 10 || formFour.dtPgto.length > 10) {
            toastr.error('Data de Pagamento Inválida')
            return
        }

        // Verifica se o pedido está sendo realizado sem pagamento
        if(formFour.pgto == 0) {
            Swal.fire({
                title: 'Atenção',
                html: 'Você está realizando uma PI sem pagamento. Deseja continuar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#00935F',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, continuar!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    emit('formFour', formFour)
                    emit('nextStep', val);
                }
            });
        } else {
            emit('nextStep', val);
            emit('formFour', formFour)
        }
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
                <p class="text-sm text-gray-500 mb-4">Confira os dados Finanaceiros do Pedido de Inserção. </p>
                <button class="btn btn-sm btn-warning btn-circle text-white -mt-1 ml-3"
                        v-if="!edit"
                        @click="changeEdit()"
                        title="Ativar Edição">
                <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
                </button>

                <button v-else class="btn btn-sm btn-success btn-circle text-white -mt-1 ml-3"
                        @click="changeEdit()"
                        title="Edição Ativada">
                <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <p class="text-xs font-bold text-red-500 text-center">Bi-Semana: {{ bisemana[0].num_bisemana }} {{ new Date(bisemana[0].inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bisemana[0].fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}</p>
        </div>

  
        <!-- Serviços / Pago? / Data Pgto -->
        <div class="flex space-x-4">
            <div class="w-full md:w-[45%]">
                <label class="label">
                    <span class="label-text">Serviço:</span>
                </label>
                <select v-model="servico" 
                        @change=getServico(servico) 
                        class="select select-bordered w-full" 
                        :disabled="edit == false">
                    <option value="0" disabled>Selecione um Serviço</option>
                    <option v-for="serv in servicos" :key="serv.id" :value="serv.id">{{ serv.nome }}</option>
                </select>
            </div>

            <div class="w-5/12 md:w-[30%]">
                <label class="label">
                    <span class="label-text">Pago</span>
                </label>
                <select id="pagamento" 
                        name="pagamento"
                        v-model="formFour.pgto"
                        class="select select-bordered w-full"
                        :disabled="edit == false">
                    <option value="" disabled selected>SELECIONE</option>
                    <option value="0">NÃO</option>
                    <option value="1">SIM</option>
                </select>
            </div>

        
        </div>

        <!--Quantidade / Valor Unitário / Desconto / Valor Total -->
        <div :class="{'hidden': servico == 0}" class="flex w-full space-x-6">
            <div class="w-11/12 flex flex-wrap space-x-0 sm:space-x-6 space-y-4 sm:space-y-0 border sm:border-0 border-sky-300 rounded-lg mb-2 sm:mb-0">
                <!-- Serviço -->
                <div class="w-10/12 sm:w-8/12">
                    <label class="label">
                        <span class="label-text">Serviço</span>
                    </label>
                    <input type="text" 
                        disabled
                        name="desc_servico"
                        id="desc_servico"
                        v-model="servicoSelecionado.nome"
                        class="input input-bordered w-full bg-base-200 text-center" />
                </div>

                <!-- Quantidade -->
                <div class="w-10/12 sm:w-3/12">
                    <label class="label">
                        <span class="label-text">Quantidade</span>
                    </label>
                    <input type="text"
                        name="quantidade"
                        id="quantidade"
                        v-model="quantidade"
                        class="input input-bordered w-full text-center" />
                </div>

                <!-- Valores -->
                <div class="w-full flex justify-center space-x-4">
                    <!-- Valor Unit. -->
                    <div class="w-10/12 sm:w-3/12">
                        <label class="label">
                            <span class="label-text">Valor Unit.</span>
                        </label>
                        <input type="text" 
                            placeholder="R$ 0.00"
                            name="vlr_unit"
                            id="vlr_unit"
                            v-model="vlrUnit"
                            class="input input-bordered w-full text-center"
                            v-maska
                            data-maska=
                            "[
                                '##.##',
                                '###.##',
                                '####.##',
                                '#####.##'
                            ]" />
                    </div>

                    <!-- Descontos -->
                    <div class="w-10/12 sm:w-3/12">
                        <label class="label">
                            <span class="label-text">Desc. Unit.</span>
                        </label>
                        <input type="text" 
                            placeholder="R$ 0.00"
                            name="vlr_desc"
                            id="vlr_desc"
                            v-model="vlrDesc"
                            class="input input-bordered w-full text-center"
                            v-maska
                            data-maska=
                            "[
                                '##.##',
                                '###.##',
                                '####.##',
                                '#####.##'
                            ]" />
                    </div>

                    <!-- Valor Total -->
                    <div class="w-10/12 sm:w-3/12">
                        <label class="label">
                            <span class="label-text">Valor Total</span>
                        </label>
                        <input type="text" 
                            disabled 
                            placeholder="R$ 0.00"
                            name="vlr_total"
                            id="vlr_total"
                            v-model="vlrTotal"
                            class="input input-bordered w-full bg-base-200 text-center"
                            v-maska
                            data-maska=
                            "[
                                '##.##',
                                '###.##',
                                '####.##',
                                '#####.##'
                            ]" />
                    </div>

                    <!-- Botão OK -->
                    <div class="w-10/12 sm:w-1/12 pt-[2.2rem]">
                        <button @click="ListaServicosPagos()" class="btn btn-success">OK</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Serviços Já Cadastrados -->
        <div :class="{'hidden': servicosPagos.length == 0}" class="w-full max-h-40 flex flex-col overflow-auto">
            <div v-for="(sp, index) in servicosPagos" :key="sp.id" 
                class="w-11/12 flex flex-wrap space-x-0 sm:space-x-6 space-y-4 sm:space-y-0 border sm:border-0 border-sky-300 rounded-lg mb-2 sm:mb-4">
                <!-- Serviço -->
                <div class="w-10/12 sm:w-[28%]">
                    <label class="label">
                        <span class="label-text">Serviço</span>
                    </label>
                    <input type="text" 
                        disabled
                        name="desc_servico"
                        id="desc_servico"
                        :value="sp.nome"
                        class="input input-bordered w-full bg-base-200 text-center" />
                </div>

                <!-- Quantidade -->
                <div class="w-10/12 sm:w-[15%]">
                    <label class="label">
                        <span class="label-text">Qtde.</span>
                    </label>
                    <input type="text" 
                        disabled
                        name="quantidade"
                        id="quantidade"
                        :value="sp.quantidade"
                        class="input input-bordered w-full bg-base-200 text-center" />
                </div>

                <!-- Valor Total -->
                <div class="w-10/12 md:w-3/12">
                    <label class="label">
                        <span class="label-text">Valor Total</span>
                    </label>
                    <input type="text" 
                        disabled
                        name="vlr_total"
                        id="vlr_total"
                        :value="sp.vlr_total"
                        class="input input-bordered w-full bg-base-200 text-center" />
                </div>

                <!-- Botão Remover -->
                <div class="w-10/12 md:w-1/12 pt-[2.5rem]">
                    <button @click="removeServicoPago(index)" class="btn btn-error btn-sm">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Forma de Pagamento / Parcelado / Qtd Parcelas -->
        <div class="flex flex-wrap space-x-0 sm:space-x-6 space-y-4 sm:space-y-0">
            <div class="w-10/12 sm:w-[30%]">
                <label class="label">
                    <span class="label-text">Forma Pagamento</span>
                </label>
                <select id="formaPgto" 
                        name="formaPgto"
                        v-model="formFour.formaPgto"
                        class="select select-bordered w-full"
                        :disabled="edit == false">
                    <option value="0" disabled selected>SELECIONE</option>
                    <option value="1">DINHEIRO</option>
                    <option value="2">PIX</option>
                    <option value="3">CARTÃO</option>
                    <option value="4">BOLETO</option>
                    <option value="5">TRANSFERÊNCIA</option>
                </select>
            </div>

            <div class="w-10/12 sm:w-[30%]">
                <label class="label">
                    <span class="label-text">Parcelado</span>
                </label>
                <select id="parcelado" 
                        name="parcelado"
                        v-model="formFour.parcelado"
                        class="select select-bordered w-full"
                        :disabled="formFour.formaPgto < 3">
                    <option value="0" disabled selected>SELECIONE</option>
                    <option value="1">SIM</option>
                    <option value="2">NÃO</option>
                </select>
            </div>

            <div class="w-5/12 md:w-[20%] ">
                <label class="label"><span class="label-text">Parcelas</span></label>
                    <select id="qtdparcelas" name="qtdparcelas" v-if="formFour.formaPgto > 2 && formFour.parcelado == 1"
                            v-model="formFour.qtdParcelas"
                            class="select select-bordered w-full"
                            :disabled="edit == false">
                        <option value="1" disabled selected>SEL...</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
            </div>

        </div>

        <!-- Data da Reserva / Vendedor / Agente-->
        <div class="flex flex-wrap w-full space-x-4">

            <div class="sm:w-[40%]">
                <label class="label"><span class="label-text">Data Reserva</span></label>
                    <input type="date"
                        v-model="dtReserva"
                        disabled
                        class="input input-bordered w-full bg-base-200 text-center"/>
                    
            </div>

            <div class="w-5/12 md:w-[40%]">
                <label class="label"><span class="label-text">Data Pagamento</span></label>
                <input type="date"
                    v-model="formFour.dtPgto"
                    :disabled="edit == false"
                    class="input input-bordered w-full" />
            </div>
        </div>

        <!-- Avançar / Voltar -->
        <div class="w-full sm:flex sm:flex-row-reverse">
            <button class="btn btn-success w-full sm:w-auto sm:ml-3" @click="nextStep(5)">Avançar</button>
            <button class="btn btn-outline mt-3 sm:mt-0 w-full sm:w-auto" @click="nextStep(3)">Voltar</button>
        </div>
    </div>
</template>
