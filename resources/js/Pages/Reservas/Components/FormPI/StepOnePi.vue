<script setup>
import { ref, onMounted, watch } from 'vue';
import { vMaska } from "maska"
import { UserCircleIcon } from '@heroicons/vue/24/outline'
import { useForm } from '@inertiajs/vue3';
import toastr from 'toastr'

const props = defineProps(['cliente', 'campanha', 'bisemana', 'getform', 'paineis'])
    
const emit = defineEmits(['closeForm','nextStep', 'formOne']);
const edit = ref(false);
const ufs = ref([]);
const cidades = ref([])
const cliente = ref(props.cliente)
const clienteUf = ref(props.cliente.uf)
const clienteCidade = ref(props.cliente.cidade)

const formOne = useForm({
    clienteId: null,
    clienteNome: null,
    cnpj: null,
    endereco: null,
    cep: null,
    uf: clienteUf,
    cidade: clienteCidade,
    celular: null,
    inscEst: null,
    responsavel: null,
    email: null
})

onMounted(() =>{
  
    axios.get('/dtGetUf')
    .then((res) => { 
        ufs.value = res.data
        
        if(clienteUf.value == null) {
            clienteUf.value = 0
        } else {
            getCidadeCli(clienteUf.value)
        }

        if(clienteCidade.value == null) {
            clienteCidade.value = 0
        }

    })


    if(props.cliente.value != {}) {
        formOne.clienteId = cliente.value.id
        formOne.clienteNome = cliente.value.razao_social ? cliente.value.razao_social : cliente.value.nome_fantasia
        formOne.cnpj = cliente.value.cpf_cnpj ? cliente.value.cpf_cnpj : '00000000000000'
        formOne.endereco = cliente.value.endereco ? cliente.value.endereco + ' - ' + cliente.value.num : 'Não Cadastrado'
        formOne.cep = cliente.value.cep ? cliente.value.cep : '00.000-000'
        formOne.uf = clienteUf.value ? clienteUf.value : 0
        formOne.cidade =clienteCidade.value ? clienteCidade.value : 0
        formOne.celular = cliente.value.tel_responsavel ? cliente.value.tel_responsavel : 'Não Cadastrado'
        formOne.inscEst = cliente.value.nro_insc ? cliente.value.nro_insc : 'Nao Cadastrado' 
        formOne.responsavel = cliente.value.responsavel ? cliente.value.responsavel : 'Não Cadastrado'
        formOne.email = cliente.value.email_responsavel ? cliente.value.email_responsavel : 'Não Cadastrado'
       
    }

})

const nextStep = (val) => {

    
    if(val == 2) {
        if(formOne.uf == 0)  {
        toastr.error('Selecione a UF do Cliente')
        return
    }

    if(formOne.cidade == 0)  {
        toastr.error('Selecione a Cidade do Cliente')
        return
    }

        emit('formOne', formOne);
    } 
    
    emit('nextStep', val);

}


function changeEdit() {
    if(edit.value === false) {
        edit.value = true
    }
}

function getCidadeCli(uf) {
    axios.post('/dtGetCidades', {uf: uf})
        .then((res) => {
            cidades.value = res.data
        })
        .catch((err) => {
            console.log(err)
        })
}


// watch(() => props.getform, (val)  =>{
//     emit('nextStep', val);
    

// })

</script>

<template>
    <div class="space-y-6 transition-all duration-1000">
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
            <p class="text-xs font-bold text-red-500 text-center">Bi-Semana: {{ bisemana.num_bisemana }} {{ new Date(bisemana.inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bisemana.fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}</p>
        </div>
        
        <!--Razão Social / CNPJ -->
        <div class="flex space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Cliente</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            v-model="formOne.clienteNome"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false" />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">CPF / CNPJ</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            v-model="formOne.cnpj"
                            v-maska
                            data-maska="[
                                '###.###.###-##',
                                '##.###.###/####-##'
                            ]"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false" />
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
                            v-model="formOne.endereco"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false" />
                    </div>
                </div>
            </div>
 
            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">CEP</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            v-model="formOne.cep"
                            v-maska
                            data-maska="##.###-###"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false" />
                    </div>
                </div>
            </div>               
        </div>

        <!-- UF / Cidade -->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label for="uf" class="block text-sm font-medium leading-6 text-gray-900">UF</label>
                <div class="mt-2">
                    <select id="uf" name="uf" v-model="formOne.uf" @change="getCidadeCli(formOne.uf)"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            :disabled="edit == false">
                        <option value="0" disabled selected>Selecione</option>
                        <option v-for="(uf, index) in ufs" :key="index" :value="uf.id">{{ uf.nome }}</option>
                    </select>
                </div>
            </div>  

            <div class="sm:col-span-4">
                <label for="cidade" class="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
                <div class="mt-2">
                    <select id="cidade" name="cidade" v-model="formOne.cidade"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            :disabled="edit == false">
                        <option value="0" disabled selected>Selecione</option>
                        <option v-for="(cid, index) in cidades" :key="index" :value="cid.id">{{ cid.nome }}</option>
                    </select>
                </div>
            </div>

                  
        </div>

        <!-- Fone / Insc Est-->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Celular</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            v-model="formOne.celular"
                            v-maska
                            data-maska="(##) #####-####"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false" />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">Insc. Estadual</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            v-model="formOne.inscEst"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false" />
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
                            v-model="formOne.responsavel"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false" />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-4">
                <label class="block text-sm font-medium leading-6 text-gray-900">E-mail</label>
                <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input type="text" 
                            v-model="formOne.email"
                            class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs" 
                            :disabled="edit == false" />
                    </div>
                </div>
            </div>                       
        </div>
    </div>

    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <label class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" @click="nextStep(2)">Avançar</label>
        <label class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="nextStep(0)">Cancelar</label>
    </div>
     
</template>
