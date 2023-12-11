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
     <div class="space-y-6 transition-all duration-1000">
      
        <!--Razão Social / CNPJ -->
        <div class="flex space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Cliente</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="cliente.nome_fantasia ? cliente.nome_fantasia : cliente.razao_social"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">CPF / CNPJ</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="cliente.cpf_cnpj ? cliente.cpf_cnpj : '00000000000000'"
                            v-maska
                            data-maska="[
                                '###.###.###-##',
                                '##.###.###/####-##'
                            ]"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>             
        </div>

        <!-- Endereço / CEP -->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Endereço</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="cliente.endereco ? cliente.endereco + ' nº '+ cliente.num : 'Não Cadastrado'"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">CEP</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="cliente.cep ? cliente.cep : '00000000'"
                            v-maska
                            data-maska="##.###-###"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>               
        </div>

        <!-- Cidade / Insc Estadual -->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="cliente.cidade ? cliente.cidade : 'Não Cadastrado'"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Insc. Estadual</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="cliente.nro_insc ? cliente.nro_insc : 'Não Cadastrado'"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>               
        </div>

        <!-- Fone / UF-->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Celular</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="cliente.celular ? cliente.celular : 'Não Cadastrado'"
                            v-maska
                            data-maska="+## (##) #####-####"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">UF</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="cliente.uf ? cliente.uf : 'Não Cadastrado'"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>                       
        </div>

        <!-- Contato / E-mail -->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Responsável</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="cliente.responsavel ? cliente.responsavel : 'Não Cadastrado'"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">E-mail</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            :value="cliente.email ? cliente.email : 'Não Cadastrado'"
                            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            disabled />
                    </div>
                </div>
            </div>                       
        </div>
     </div>
</template>


