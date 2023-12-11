<script setup>
import { vMaska } from 'maska';


</script>


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8">
       
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full sm:w-5/12">
                <label for="razao_social" class="block text-sm font-medium leading-6 text-gray-900">Razão Social</label>
                <div class="mt-2">
                    <input type="text" 
                        name="razao_social" 
                        id="razao_social" 
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            <div class="w-full sm:w-5/12">
                <label for="nome_fantasia" class="block text-sm font-medium leading-6 text-gray-900">Nome Fantasia</label>
                <div class="mt-2">
                    <input type="text" name="nome_fantasia" id="nome_fantasia" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>
        </div>
        
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full  sm:w-5/12">
                <label for="cpf_cnpj" class="block text-sm font-medium leading-6 text-gray-900">CPF / CNPJ</label>
                <div class="mt-2">
                    <input type="text" 
                        name="cpf_cnpj" 
                        id="cpf_cnpj" 
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                        v-maska
                        data-maska="[
                                '###.###.###-##',
                                '##.###.###/####-##'
                        ]"
                    />

                    
                </div>
            </div>

            <div class="w-full sm:w-5/12">
                <label for="insc_est" class="block text-sm font-medium leading-6 text-gray-900">Inscrição Estadual</label>
                <div class="mt-2">
                    <input type="text" name="insc_est" id="insc_est" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>
        </div>
       

    </div>
</template>