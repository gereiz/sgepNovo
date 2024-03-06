<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { vMaska } from "maska"
import { UserCircleIcon  } from '@heroicons/vue/24/outline'
import { usePage, useForm } from '@inertiajs/vue3';    

const props = defineProps(['cliente', 'campanha', 'painel', 'bisemana'])
const emit = defineEmits(['nextStep','formThree']);

const edit = ref(false) 
const page = usePage()
const user = computed(() => page.props.auth.user)


const nextStep = (val) => {

emit('nextStep', val);

}

</script>

<template>
    <div class="space-y-6 transition-all duration-1000">
        <!-- Botão de Editar contato -->
        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h1 as="h3" class="text-base font-semibold leading-6 text-gray-900">Pedido de Inserção </h1>
            <div class="flex mt-2">
                <p class="text-sm text-gray-500 mb-4">Confira os dados para criação do Pedido de Inserção.</p>
                <!-- <button  class="w-8 h-8 flex items-center justify-center bg-amber-700 -mt-1 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 sm:ml-3 rounded-full duration-1000" 
                        v-if="!edit"
                        @click="changeEdit()"
                        title="Ativar Edição">
                <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
                </button>

                <button v-else  class="w-8 h-8 flex items-center justify-center bg-green-700 -mt-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 rounded-full duration-1000" 
                        @click="changeEdit()"
                        title="Edição Ativada">
                <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
                </button> -->
            </div>
            <p class="text-xs font-bold text-red-500">Bi-Semana: {{ bisemana[0].num_bisemana }} {{ new Date(bisemana[0].inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bisemana[0].fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}</p>
        </div>

        <div>
            <h3 class="font-extrabold text-4xl text-red-700 animate-pulse duration-200 text-center">ATENÇÃO!</h3>
            <p class="py-4 font-extrabold">Ao clicar no botão "Gerar PI" será criada uma PI para esta reserva!</p>
            <p class="py-4 font-extrabold">Não será possível editar NENHUM dado desta reserva, ou da PI, somente cancelando e mesma e realizando uma nova reserva.</p>
            <p class="py-4 font-extrabold ">Confirme somente se tiver certeza da reserva.</p>
        </div>


        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <label class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" @click="nextStep(4)">Gerar PI</label>
            <label class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="nextStep(2)">Voltar</label>

        </div>
    </div>
</template>