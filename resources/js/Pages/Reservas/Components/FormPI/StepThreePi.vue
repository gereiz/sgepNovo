<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { vMaska } from "maska"
import { UserCircleIcon  } from '@heroicons/vue/24/outline'
import { usePage, useForm } from '@inertiajs/vue3';    
import { useToastr } from '@/Components/toastr';

const toastr = useToastr()

const props = defineProps(['cliente', 'campanha', 'painel', 'bisemana'])
const emit = defineEmits(['nextStep','formThree']);

const edit = ref(false) 
const page = usePage()
const user = computed(() => page.props.auth.user)


const formThree = reactive({
    faturar_sobre: 0,
    faturar_contra: 0,
    enviar_faturamento: 0
})

const nextStep = (val) => {

   if(val === 4) {
       if(formThree.faturar_sobre == 0 || formThree.faturar_contra == 0 || formThree.enviar_faturamento == 0) {
           toastr.error('Preencha todos os campos para continuar.')
           return
       } else {
           emit('formThree', formThree)
           
       }

       
   }
    emit('nextStep', val)
}

function changeEdit() {
    if(edit.value === false) {
        edit.value = true
    }

}

</script>

<template>
    <div class="space-y-6 transition-all duration-1000">
        <!-- Botão de Editar contato -->
        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h1 as="h3" class="text-base font-semibold leading-6 text-gray-900">Pedido de Inserção </h1>
            <div class="w-full flex mt-2">
                <p class="text-sm text-gray-500 mb-4">Confira os dados para faturamento do Pedido de Inserção.</p>
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

        
        <div class="w-full flex flex-wrap space-y-6 sm:space-y-0">
            
            <!-- Faturar Sobre -->
            <div class="w-5/12 sm:w-full">
                <label class="block text-sm font-medium leading-6 text-gray-900">Faturar Sobre: </label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                        <select id="uf" name="uf"
                                v-model="formThree.faturar_sobre"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                :disabled="edit == false">
                            <option value="0" disabled selected>SELECIONE</option>
                            <option value="1">VALOR BRUTO</option>
                            <option value="2">VALOR LIQUIDO</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Faturar Contra -->
            <div class="w-5/12 sm:w-[40%] me-4 pt-6">
                <label class="block text-sm font-medium leading-6 text-gray-900">Faturar Contra: </label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">

                        <select id="fat-contra" name="pagamento"
                                v-model="formThree.faturar_contra"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                :disabled="edit == false">
                            <option value="0" disabled selected>SELECIONE</option>
                            <option value="1">CLIENTE</option>
                            <option value="2">AGÊNCIA</option>
                            
                        </select>
                    </div>
                </div>
            </div>

            <!-- Enviar Faturamento -->
            <div class="w-5/12 sm:w-[40%] me-4 pt-6">
                <label class="block text-sm font-medium leading-6 text-gray-900">Enviar Faturamento: </label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">

                        <select id="envia-faturamento" name="envia-faturamento"
                                v-model="formThree.enviar_faturamento"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                :disabled="edit == false">
                            <option value="0" disabled selected>SELECIONE</option>
                            <option value="1">CLIENTE</option>
                            <option value="2">AGÊNCIA</option>
                            
                        </select>
                    </div>
                </div>
            </div>
        </div>  


        <!-- Avançar / Voltar -->
        <div class="w-full sm:flex sm:flex-row-reverse">
            <label class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" @click="nextStep(4)">Avançar</label>
            <label class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="nextStep(2)">Voltar</label>

        </div>
            
    </div>
</template>