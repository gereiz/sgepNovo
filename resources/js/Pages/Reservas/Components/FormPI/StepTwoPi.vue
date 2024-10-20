<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { vMaska } from "maska"
import { UserCircleIcon  } from '@heroicons/vue/24/outline'
import { usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import axios from 'axios';

const toastr = useToastr()

const props = defineProps(['cliente', 'campanha', 'paineis','bisemana'])
const emit = defineEmits(['nextStep','formTwo']);

const edit = ref(false)
const page = usePage()

const liberaEmissaoPi = page.props.user.permissions.includes('liberar emissao pi');

const usuario = ref ()

const date = new Date();
const dataAtual = date.toLocaleDateString()

const usuarios = ref()

const servicos = ref()
const servico = ref(0)
const quantidade = ref(1)
const id_servico = ref(0)
const servicoSelecionado = ref('')
const servicosPagos = ref([])

const vlrUnit = ref(0)
const vlrDesc = ref(0)
const vlrTotal = ref()
const detalhes = ref('')


const dtPgto = ref(date.toLocaleDateString())
const dtReserva = ref()

// onMounted(() =>{


// })


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
    if(parseInt(quantidade.value) > parseInt(props.paineis[0].length)) {
        toastr.error('Quantidade do serviço é maior que a quantidade de Painéis disponíveis!')
        return
    }

    // verifica se a quantidade é menor que 1
    if(parseInt(quantidade.value) < 1) {
        toastr.error('Quantidade do serviço não pode ser menor que 1 !')
        return
    }

    // verifica se o valor unitário é menor que 1
    if(parseFloat(vlrUnit.value) < 1) {
        toastr.error('Valor Unitário do serviço não pode ser menor que 1.00 !')
        return
    }

    // verifica se o valor unitário é menor que o valor do desconto
    if(parseFloat(vlrDesc.value) > parseFloat(vlrUnit.value)) {
        toastr.error('Valor do Desconto não pode ser maior que o Valor Unitário !')
        return
    }

    // adiciona o serviço na lista de serviços pagos
    servicosPagos.value.push({
        nome: servicoSelecionado.value.nome,
        quantidade: quantidade.value,
        vlr_unit: vlrUnit.value,
        vlr_desc: vlrDesc.value,
        vlr_total: vlrTotal.value,
        detalhes: detalhes.value
    })

    servico.value = 0
    quantidade.value = 1
    vlrUnit.value = 0
    vlrDesc.value = 0

    getServicos()

}

function removeServicoPago(index) {
    servicosPagos.value.splice(index, 1)

    getServicos()
}

const formTwo = reactive({
    paineis: props.paineis,
    campanha: props.campanha,
    servicos: servicosPagos,
    formaPgto: 0,
    pgto: '',
    dtPgto: dtPgto.value,
    dtReserva: dtReserva.value,
    vendedorId: '',
    vendedor: ''

})

const nextStep = (val) => {

    if(val == 1) {
        emit('nextStep', val)
    }

    if(val == 3) {
        if(servicosPagos.value.length == 0) {
            toastr.error('Adicione ao menos um Serviço')
            return
        }

        if(formTwo.formaPgto == 0) {
            toastr.error('Selecione a Forma de Pagamento')
            return
        }

        if(formTwo.pgto == '') {
            toastr.error('Informe se o Pedido foi Pago')
            return
        }

        if(formTwo.pgto == 1 && formTwo.dtPgto == '') {
            toastr.error('Informe a Data de Pagamento')
            return
        }

        if(formTwo.pgto == 1 && formTwo.dtPgto.length < 10 || formTwo.dtPgto.length > 10) {
            toastr.error('Data de Pagamento Inválida')
            return
        }

        if(formTwo.pgto == 1 && formTwo.dtPgto.length == 10) {
            let dt = formTwo.dtPgto.split('/')
            let data = new Date(dt[2], dt[1] - 1, dt[0])
            let dataAtual = new Date()
            if(data > dataAtual) {
                toastr.error('Data de Pagamento não pode ser maior que a Data Atual')
                return
            }
        }

        if(formTwo.vendedorId == 0) {
            toastr.error('Selecione o Vendedor')
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
                <p class="text-sm text-gray-500 mb-4">Confira os dados para criação do Pedido de Inserção.</p>
                <button  class="w-8 h-8 flex items-center justify-center bg-amber-700 -mt-1 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 sm:ml-3 rounded-full duration-1000"
                        v-if="!edit"
                        @click="changeEdit()"
                        title="Ativar Edição">
                <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
                </button>

                <button v-else  class="w-8 h-8 flex items-center justify-center bg-green-700 -mt-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 rounded-full duration-1000"
                        @click="changeEdit()"
                        title="Edição Ativada">
                <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <p class="text-xs font-bold text-red-500 text-center">Bi-Semana: {{ bisemana.num_bisemana }} {{ new Date(bisemana.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bisemana.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}</p>
        </div>

        <!--Painéis / Campanha -->
        <div class="flex w-full space-x-6">
            <div class="sm:w-5/12">
                <label class="block text-sm font-medium leading-6 text-gray-900">Painéis</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text"
                            v-model="formTwo.paineis"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-red-500 font-extrabold placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs"
                            disabled />
                    </div>
                </div>
            </div>

            <div class="w-6/12">
                <label class="block text-sm font-medium leading-6 text-gray-900">Campanha</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text"
                            v-model="formTwo.campanha"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs"
                            :disabled="edit == false"
                        />
                    </div>
                </div>
            </div>

        </div>

        <!-- Serviços -->
        <div class="flex w-full space-x-6">

            <div class="w-full">
                <label for="" class="block text-sm font-medium leading-6 text-gray-900">Serviço:</label>
                <select v-model="servico" @change=getServico(servico) class="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                                ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" :disabled="edit == false">
                    <option value="0" disabled>Selecione um Serviço</option>
                    <option v-for="serv in servicos" :key="serv.id" :value="serv.id">{{ serv.nome }}</option>

                </select>
            </div>


        </div>
        <!--Quantidade / Valor Unitário / Desconto / Valor Total -->
        <div :class="{'hidden': servico == 0}" class="flex w-full space-x-6">

            <div class="w-11/12 flex flex-wrap space-x-0 sm:space-x-6 space-y-4 sm:space-y-0
                border sm:border-0 border-sky-300 rounded-lg py-4 mb-2 sm:mb-0"
            >

                <!-- Serviço -->
                <div class="w-10/12 sm:w-8/12">
                    <label for="desc_servico" class="block text-sm font-medium leading-6 text-gray-900">Serviço</label>
                    <div class="mt-2">
                        <input type="text" disabled
                            name="desc_servico"
                            id="desc_servico"
                            v-model="servicoSelecionado.nome"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                                ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:leading-6 text-center"
                        />
                    </div>
                </div>

                <!-- Quantidade -->
                <div class="w-10/12 sm:w-3/12">
                    <label for="quantidade" class="block text-sm font-medium leading-6 text-gray-900">Quantidade</label>
                    <div class="mt-2">
                        <input type="text"
                            name="quantidade"
                            id="quantidade"
                            v-model="quantidade"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                                ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"
                        />
                    </div>
                </div>

                <!-- Valores -->
                <div class="w-full flex justify-center space-x-4">

                    <!-- Valor Unit. -->
                    <div class="w-10/12 sm:w-3/12">
                        <label for="vlr_unit" class="block text-sm font-medium leading-6 text-gray-900">Valor Unit.</label>
                        <div class="mt-2">
                            <input type="text"
                                name="vlr_unit"
                                id="vlr_unit"
                                v-model="vlrUnit"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"
                                v-maska
                                data-maska=
                                "[
                                    '##.##',
                                    '###.##',
                                    '####.##',
                                    '#####.##'
                                ]"
                            />
                        </div>
                    </div>

                    <!-- Descontos -->
                    <div class="w-10/12 sm:w-3/12">
                        <label for="vlr_desc" class="block text-sm font-medium leading-6 text-gray-900">Desc. Unit.</label>
                        <div class="mt-2">
                            <input type="text"
                                name="vlr_desc"
                                id="vlr_desc"
                                v-model="vlrDesc"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"
                                v-maska
                                data-maska=
                                "[
                                    '##.##',
                                    '###.##',
                                    '####.##',
                                    '#####.##'
                                ]"
                            />
                        </div>
                    </div>

                    <!-- Valor Total -->
                    <div class="w-10/12 sm:w-3/12">
                        <label for="vlr_total" class="block text-sm font-medium leading-6 text-gray-900">Valor Total</label>
                        <div class="mt-2">
                            <input type="text" disabled
                                name="vlr_total"
                                id="vlr_total"
                                v-model="vlrTotal"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-gray-200
                                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"
                                v-maska
                                data-maska=
                                "[
                                    '##.##',
                                    '###.##',
                                    '####.##',
                                    '#####.##'
                                ]"
                            />
                        </div>
                    </div>

                    <!-- Botão OK -->
                    <div class="w-10/12 sm:w-1/12 pt-[1.95rem]">
                        <button @click="ListaServicosPagos()" class="flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">OK</button>
                    </div>
                </div>

                <!-- Detalhes -->
                <div class="w-full pt-4">
                    <label for="detalhes" class="block text-sm font-medium leading-6 text-gray-900">Detalhes</label>
                    <div class="mt-2">
                        <textarea name="detalhes" id="detalhes" rows="2" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            :disabled="edit == false"
                            v-model="detalhes"
                        ></textarea>
                    </div>
                </div>

            </div>

        </div>

        <!-- Serviços Já Cadastrados -->
        <div :class="{'hidden': servicosPagos.length  == 0}" class="w-full max-h-40 flex flex-col overflow-auto">

            <div v-for="(sp, index) in servicosPagos" :key="sp.id" class="w-11/12 flex flex-wrap space-x-0 sm:space-x-6 space-y-4 sm:space-y-0
                border sm:border-0 border-sky-300 rounded-lg mb-2 sm:mb-4"
            >

                <!-- Serviço -->
                <div class="w-10/12 sm:w-[28%]">
                    <label for="desc_servico" class="block text-sm font-medium leading-6 text-gray-900">Serviço</label>
                    <div class="">
                        <input type="text" disabled
                            name="desc_servico"
                            id="desc_servico"
                            :value="sp.nome"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-gray-200
                                ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:leading-6 text-center"
                        />
                    </div>
                </div>

                <!-- Quantidade -->
                <div class="w-10/12 sm:w-[15%]">
                    <label for="quantidade" class="block text-sm font-medium leading-6 text-gray-900">Qtde.</label>
                    <div class="">
                        <input type="text" disabled
                            name="quantidade"
                            id="quantidade"
                            :value="sp.quantidade"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-gray-200
                                ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"
                        />
                    </div>
                </div>

                <!-- Valor Total -->
                <div class="w-10/12 sm:w-[20%]">
                    <label for="vlr_total" class="block text-sm font-medium leading-6 text-gray-900">Valor Total</label>
                    <div class="">
                        <input type="text" disabled
                            name="vlr_total"
                            id="vlr_total"
                            :value="sp.vlr_total"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-gray-200
                                ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"
                            v-maska
                            data-maska=
                            "[
                                '##.##',
                                '###.##',
                                '####.##',
                                '#####.##'
                            ]"
                        />
                    </div>
                </div>

                <!-- Botão Excluir -->
                <div class="w-10/12 sm:w-[10%] pt-[1.45rem]">
                    <button @click="removeServicoPago(index)" class="flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">X</button>
                </div>

            </div>


        </div>

        <!-- Forma de Pagamento / Pago ?-->
        <div class="w-full flex flex-wrap justify-center sm:space-x-6 space-y-6 sm:space-y-0">
            <div class="w-full sm:w-5/12">
                <label class="block text-sm font-medium leading-6 text-gray-900">Forma de Pagamento</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <select id="uf" name="uf"
                        v-model="formTwo.formaPgto"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                :disabled="edit == false">
                            <option value="0" disabled selected>SELECIONE</option>
                            <option value="1">A VISTA DINHEIRO</option>
                            <option value="2">A VISTA PIX</option>
                            <option value="3">CARTÃO</option>
                            <option value="4">BOLETO</option>
                            <option value="5">DEPÓSITO</option>

                        </select>
                    </div>
                </div>
            </div>

            <div class="w-5/12 sm:w-[20%] me-6">
                <label class="block text-sm font-medium leading-6 text-gray-900">Pago</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">

                        <select id="pagamento" name="pagamento"
                        v-model="formTwo.pgto"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                :disabled="edit == false">
                            <option value="" disabled selected>SEL...</option>
                            <option value="0">NÃO</option>
                            <option value="1">SIM</option>

                        </select>
                    </div>
                </div>
            </div>

            <div class="w-5/12 sm:w-3/12">
                <label class="block text-sm font-medium leading-6 text-gray-900">Data Pagamento</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text"
                            v-model="formTwo.dtPgto"
                            :disabled="edit == false"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs"
                            v-maska
                            data-maska="##/##/####"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Data da Reserva / Vendedor-->
        <div class="flex flex-wrap w-full space-x-6">

            <div class="sm:w-3/12">
                <label class="block text-sm font-medium leading-6 text-gray-900">Data da Reserva</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 bg-gray-200">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text"
                            v-model="dataAtual"
                            disabled
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs"

                        />
                    </div>
                </div>
            </div>

            <div class="sm:w-4/12">
                <label class="block text-sm font-medium leading-6 text-gray-900">Vendedor</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">

                        <select id="vendedor" name="vendedor"
                                @change="getUsuario($event.target.value)"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                :disabled="edit == false">
                            <option value="0" disabled selected>SELECIONE</option>
                            <option v-for="user in usuarios" :key="user.id" :value="user.id">{{ user.name }}</option>

                        </select>
                    </div>
                </div>
            </div>


        </div>


        <!-- Avançar / Voltar -->
        <div class="w-full sm:flex sm:flex-row-reverse">
            <label class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" @click="nextStep(3)">Avançar</label>
            <label v-if="liberaEmissaoPi" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" @click="nextStep(5)">Reservar sem PI</label>
            <label class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="nextStep(1)">Voltar</label>

        </div>
    </div>
</template>
