<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { vMaska } from "maska"
import { UserCircleIcon  } from '@heroicons/vue/24/outline'
import { usePage, useForm } from '@inertiajs/vue3';    


const props = defineProps(['cliente', 'campanha', 'painel','bisemana'])
const emit = defineEmits(['nextStep','formTwo']);

const edit = ref(false)
const page = usePage()
const user = computed(() => page.props.auth.user)

const date = new Date();

const dataAtual = date.toLocaleDateString()

const vlrUnit = ref(0)
const vlrDesc = ref(0)
const vlrDescUnmask = ref(0)
const vlrTotal = ref()
const vlrTotalUnmask = ref()

const dtPgto = ref(date.toLocaleDateString())
const dtReserva = ref()

onMounted(() =>{
  
    // setSession()

})


watch((vlrUnit), (val) => {
    
    vlrUnit.value = val
    formTwo.vlr_unit = val

    if(parseFloat(vlrDesc.value) > parseFloat(vlrUnit.value)) {
        vlrTotal.value = 0.0   
        
    } else {
        vlrTotal.value = (parseFloat(vlrUnit.value) - parseFloat(vlrDesc.value)).toFixed(2)
        formTwo.vlr_total =  vlrTotal.value
    }   

    



})

watch((vlrDesc), (val) => {
    vlrDesc.value = val
    formTwo.vlr_desc = val

    if(parseFloat(vlrDesc.value) > parseFloat(vlrUnit.value)) {
        vlrTotal.value = 0.0   
    } else {
        vlrTotal.value = (parseFloat(vlrUnit.value) - parseFloat(vlrDesc.value)).toFixed(2)
        formTwo.vlr_total =  vlrTotal.value
    }


    
})                                                                                          


const formTwo = useForm({
    painelId: props.painel.id,
    painel: props.painel.identificacao,
    campanha: props.campanha,
    vlr_unit: null,
    vlr_desc: vlrDescUnmask.value, 
    vlr_total: vlrTotalUnmask.value,
    formaPgto: 0,
    pgto: 0,
    dtPgto: dtPgto.value,
    dtReserva: dtReserva.value,
    userId: page.props.auth.user.id,
    userNome: page.props.auth.user.name,
    
})

const nextStep = (val) => {

    emit('nextStep', val);

    if(val == 3) {
        emit('formTwo', formTwo)

        setSession()
    }

}


function changeEdit() {
    
    if(edit.value === false) {
        edit.value = true
    }

}

function setSession() {
    axios.post('/sessionData', {
        dtPgto: formTwo.dtPgto,
            
    })
        .then((res) =>{
            
        })
        .catch((err) => {
            console.log(err)
        })
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
            <p class="text-xs font-bold text-red-500">Bi-Semana: {{ bisemana[0].num_bisemana }} {{ new Date(bisemana[0].inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bisemana[0].fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}</p>
        </div>

        <!--Painéis / Campanha -->
        <div class="flex w-full space-x-6">
            <div class="sm:w-5/12">
                <label class="block text-sm font-medium leading-6 text-gray-900">Painéis</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            v-model="formTwo.painel"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
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

        <!--Valor Unitário / Valor total -->
        <div class="w-full flex flex-wrap justify-center">
            <div class="w-5/12 sm:w-3/12 me-6">
                <label class="block text-sm font-medium leading-6 text-gray-900">Valor Unitário</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            v-model="vlrUnit"
                            v-maska
                            data-maska="[
                                '#.##',
                                '##.##',
                                '###.##',
                                '####.##',
                                '#####.##'
                            ]"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false" />
                    </div>
                </div>
            </div>

            <div class="w-5/12 sm:w-3/12 sm:me-6">
                <label class="block text-sm font-medium leading-6 text-gray-900">Valor Desconto</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text"
                            v-model="vlrDesc" 
                            v-maska
                            data-maska="[
                                '#.##',
                                '##.##',
                                '###.##',
                                '####.##',
                                '#####.##'
                            ]"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false"
                        />
                    </div>
                </div>
            </div>

            <div class="w-11/12 sm:w-3/12">
                <label class="block text-sm font-medium leading-6 text-gray-900">Valor Total</label>
                <div class="w-full mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            v-model="vlrTotal"
                            v-maska
                            data-maska="[
                                '#.##',
                                '##.##',
                                '###.##',
                                '####.##',
                                '#####.##'
                            ]"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled
                        />
                    </div>
                </div>
            </div>
                 
        </div>

        <!-- Formade Pagamento / Pago ?-->
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
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
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
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            v-model="formTwo.userNome"
                            disabled
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            
                        />
                    </div>
                </div>
            </div> 
            
           
        </div>

        

        <div class="w-full sm:flex sm:flex-row-reverse">
            <label class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" @click="nextStep(3)">Avançar</label>
            <label class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="nextStep(1)">Voltar</label>

        </div>
    </div>
</template>