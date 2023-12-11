<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { vMaska } from "maska"
    
const props = defineProps(['cliente', 'campanha', 'painel'])
const emit = defineEmits(['nextStep']);

const nextStep = (val) => {

    emit('nextStep', val);

}

</script>

<template>
     <div class="space-y-6">
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

                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled 
                        />
                    </div>
                </div>
            </div>                       
        </div>

        <!-- Endereço / CEP -->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Campanha</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="campanha"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled
                        />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Período</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>               
        </div>

     </div>
</template>