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


        <div class="w-full flex flex-wrap space-y-6 sm:space-y-0">

            <!-- Faturar Sobre -->
            <div class="w-5/12 sm:w-full">
                <label class="label">
                    <span class="label-text">Faturar Sobre:</span>
                </label>
                <select v-model="formThree.faturar_sobre"
                        class="select select-bordered w-full"
                        :disabled="edit == false">
                    <option value="0" disabled selected>SELECIONE</option>
                    <option value="1">VALOR BRUTO</option>
                    <option value="2">VALOR LIQUIDO</option>
                </select>
            </div>

            <!-- Faturar Contra -->
            <div class="w-5/12 sm:w-[40%] me-4 pt-6">
                <label class="label">
                    <span class="label-text">Faturar Contra:</span>
                </label>
                <select v-model="formThree.faturar_contra"
                        class="select select-bordered w-full"
                        :disabled="edit == false">
                    <option value="0" disabled selected>SELECIONE</option>
                    <option value="1">CLIENTE</option>
                    <option value="2">AGÊNCIA</option>
                </select>
            </div>

            <!-- Enviar Faturamento -->
            <div class="w-5/12 sm:w-[40%] me-4 pt-6">
                <label class="label">
                    <span class="label-text">Enviar Faturamento:</span>
                </label>
                <select v-model="formThree.enviar_faturamento"
                        class="select select-bordered w-full"
                        :disabled="edit == false">
                    <option value="0" disabled selected>SELECIONE</option>
                    <option value="1">CLIENTE</option>
                    <option value="2">AGÊNCIA</option>
                </select>
            </div>
        </div>


        <!-- Avançar / Voltar -->
        <div class="w-full sm:flex sm:flex-row-reverse">
            <button class="btn btn-success w-full sm:w-auto sm:ml-3" @click="nextStep(4)">Avançar</button>
            <button class="btn btn-outline mt-3 sm:mt-0 w-full sm:w-auto" @click="nextStep(2)">Voltar</button>
        </div>

    </div>
</template>
