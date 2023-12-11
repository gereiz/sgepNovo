<script setup>

import { vMaska } from "maska";

</script>


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8">
       
        <div class="w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0">
            <div class="w-full sm:w-4/12">
                <label for="responsavel" class="block text-sm font-medium leading-6 text-gray-900">Contato / Responsável</label>
                <div class="mt-2">
                    <input type="text" name="responsavel" id="responsavel" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                </div>
            </div>

            <div class="w-full sm:w-3/12">
                <label for="tel_1" class="block text-sm font-medium leading-6 text-gray-900">Telefone</label>
                <div class="mt-2">
                    <input type="text" 
                        name="tel_1" 
                        id="tel_1" 
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                        v-maska
                        data-maska="+## (##) # ####-####"
                    />
                </div>
            </div>

            <div class="w-full sm:w-4/12">
                <label for="email_1" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <div class="mt-2">
                    <input type="text" 
                        name="email_1" 
                        id="email_1" 
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" 
                    />
                </div>
            </div>

            
        </div>

        


    </div>
</template>