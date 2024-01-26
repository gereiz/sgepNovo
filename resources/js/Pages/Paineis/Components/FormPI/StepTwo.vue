<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { vMaska } from "maska"
import { UserCircleIcon  } from '@heroicons/vue/24/outline'
import { usePage } from '@inertiajs/vue3';    

const props = defineProps(['cliente', 'campanha', 'painel'])
const emit = defineEmits(['nextStep']);

const edit = ref(false)
const page = usePage()
const user = computed(() => page.props.auth.user)

const nextStep = (val) => {

    emit('nextStep', val);

}

function changeEdit() {
    
    if(edit.value === false) {
        edit.value = true
    }

}

</script>

<template>
    <div class="space-y-6">
        <!-- Botão de Editar contato -->
        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
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
        </div>

        <!--Razão Social / CNPJ -->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Painéis</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="painel.identificacao"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Vendedor</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="user.name"
                            disabled
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            
                        />
                    </div>
                </div>
            </div>                       
        </div>

        <!-- Endereço / CEP -->
        <div class="flex w-full space-x-6 justify-center">
            <div class="w-full">
                <label class="block text-sm font-medium leading-6 text-gray-900">Campanha</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="campanha"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false"
                        />
                    </div>
                </div>
            </div>
        
        </div>

        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <label class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" @click="nextStep(3)">Avançar</label>
            <label class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="nextStep(1)">Voltar</label>

        </div>
    </div>
</template>