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

    axios.get('/dtGetUfs')
    .then((res) => {
        ufs.value = res.data

        if(clienteUf.value == null) {
            clienteUf.value = 0
        } else {
            getCidadeCli(clienteUf.value)
            clienteUf.value = cliente.value.uf
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
            <div class="w-full flex mt-2 ">
                <p class="w-full text-sm text-gray-500 mb-4 text-center">Confira os dados do cliente do Pedido de Inserção.</p>
            </div>
            <p class="text-xs font-bold text-red-500 text-center">Bi-Semana: {{ bisemana[0].num_bisemana }} {{ new Date(bisemana[0].inicio).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }} até {{ new Date(bisemana[0].fim).toLocaleDateString('pt-br', {timeZone: 'UTC'}) }}</p>
        </div>

        <!--Razão Social / CNPJ -->
        <div class="flex space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="label">
                    <span class="label-text">Cliente</span>
                </label>
                <input type="text"
                    v-model="formOne.clienteNome"
                    class="input input-bordered w-full"
                    :disabled="edit == false"
                    placeholder="Nome do cliente" />
            </div>

            <div class="sm:col-span-4">
                <label class="label">
                    <span class="label-text">CPF / CNPJ</span>
                </label>
                <input type="text"
                    v-model="formOne.cnpj"
                    v-maska
                    data-maska="[
                        '###.###.###-##',
                        '##.###.###/####-##'
                    ]"
                    class="input input-bordered w-full"
                    :disabled="edit == false"
                    placeholder="CPF/CNPJ" />
            </div>
        </div>

        <!-- Endereço / CEP -->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="label">
                    <span class="label-text">Endereço</span>
                </label>
                <input type="text"
                    v-model="formOne.endereco"
                    class="input input-bordered w-full"
                    :disabled="edit == false"
                    placeholder="Endereço completo" />
            </div>

            <div class="sm:col-span-4">
                <label class="label">
                    <span class="label-text">CEP</span>
                </label>
                <input type="text"
                    v-model="formOne.cep"
                    v-maska
                    data-maska="##.###-###"
                    class="input input-bordered w-full"
                    :disabled="edit == false"
                    placeholder="00.000-000" />
            </div>
        </div>

        <!-- UF / Cidade -->
        <div class="flex w-full justify-center pl-3 space-x-6">
            <div class="sm:col-span-4">
                <label class="label">
                    <span class="label-text">UF</span>
                </label>
                <select id="uf" name="uf" v-model="formOne.uf" @change="getCidadeCli(formOne.uf)"
                        class="select select-bordered w-full"
                        :disabled="edit == false">
                    <option value="0" disabled selected>Selecione</option>
                    <option v-for="(uf, index) in ufs" :key="index" :value="uf.id">{{ uf.nome }}</option>
                </select>
            </div>

            <div class="sm:col-span-4">
                <label class="label">
                    <span class="label-text">Cidade</span>
                </label>
                <select id="cidade" name="cidade" v-model="formOne.cidade"
                        class="select select-bordered w-full"
                        :disabled="edit == false">
                    <option value="0" disabled selected>Selecione</option>
                    <option v-for="(cid, index) in cidades" :key="index" :value="cid.id">{{ cid.nome }}</option>
                </select>
            </div>
        </div>

        <!-- Fone / Insc Est-->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="label">
                    <span class="label-text">Celular</span>
                </label>
                <input type="text"
                    v-model="formOne.celular"
                    v-maska
                    data-maska="(##) #####-####"
                    class="input input-bordered w-full"
                    :disabled="edit == false"
                    placeholder="(00) 00000-0000" />
            </div>

            <div class="sm:col-span-4">
                <label class="label">
                    <span class="label-text">Insc. Estadual</span>
                </label>
                <input type="text"
                    v-model="formOne.inscEst"
                    class="input input-bordered w-full"
                    :disabled="edit == false"
                    placeholder="Inscrição Estadual" />
            </div>
        </div>

        <!-- Contato / E-mail -->
        <div class="flex w-full space-x-6 justify-center">
            <div class="sm:col-span-4">
                <label class="label">
                    <span class="label-text">Responsável</span>
                </label>
                <input type="text"
                    v-model="formOne.responsavel"
                    class="input input-bordered w-full"
                    :disabled="edit == false"
                    placeholder="Nome do responsável" />
            </div>

            <div class="sm:col-span-4">
                <label class="label">
                    <span class="label-text">E-mail</span>
                </label>
                <input type="text"
                    v-model="formOne.email"
                    class="input input-bordered w-full"
                    :disabled="edit == false"
                    placeholder="email@exemplo.com" />
            </div>
        </div>
    </div>

    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button class="btn btn-success w-full sm:w-auto sm:ml-3" @click="nextStep(2)">Avançar</button>
        <!-- <button class="btn btn-error w-full sm:w-auto sm:ml-3" @click="nextStep(5)">Reservar sem PI</button> -->
        <button class="btn btn-outline mt-3 sm:mt-0 w-full sm:w-auto" @click="nextStep(0)">Cancelar</button>
    </div>
</template>
