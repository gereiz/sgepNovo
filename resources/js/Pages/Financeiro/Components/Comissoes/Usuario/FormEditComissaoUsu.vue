<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { vMaska } from 'maska';
import { useToastr } from '@/Components/toastr';
import { defineProps, defineEmits } from 'vue';
import { cashBR } from '@/functions';
import DelComissaoUsu from './DelComissaoUsu.vue';

const props = defineProps(['usuario', 'servicos', 'comissoes'])
const emit = defineEmits(['closeEdit', 'sendFormComissao'])
const toastr = useToastr()

const servico = ref(0)
const servicoSelecionado = ref('')
const comissaoSelecionada = ref('')
 
const id_comissao = ref('')
const id_funcionario = ref(props.usuario.id)
const id_servico = ref(0)
const valor_comissao = ref('')
const tipo_comissao = ref('')

const openD = ref(false)

// Computed property para filtrar serviços que ainda não foram selecionados
const servicosDisponiveis = computed(() => {
    // Obter IDs de serviços que já possuem comissão para este funcionário
    const idsServicosComComissao = props.comissoes
        .filter(comissao => comissao.id_funcionario === id_funcionario.value)
        .map(comissao => comissao.servico.id);
    
    // Filtrar a lista de serviços para mostrar apenas os que não têm comissão
    return props.servicos.filter(serv => !idsServicosComComissao.includes(serv.id));
});

function closeAdd(val){
    emit('closeEdit', val)
}

const cadComissao = ref ({  id_funcionario: id_funcionario.value,
                            id_servico: id_servico.value,
                            valor_comissao: valor_comissao.value,
                            tipo_comissao: tipo_comissao.value
                        })    
                     
watch([id_comissao, id_funcionario, id_servico, valor_comissao, tipo_comissao], (val) => {
    cadComissao.value = {id_funcionario: id_funcionario.value,
                        id_servico: id_servico.value,
                        valor_comissao: valor_comissao.value,
                        tipo_comissao: tipo_comissao.value
                    }
})
 
function getServico(val) {
    axios.post('/GetServico', {id_servico: val})
    .then((res) => {
        id_servico.value = res.data.id
        servicoSelecionado.value = res.data
        

    })
    .catch((err) => {
        toastr.error(err)
    })

   
}

function sendFormComissao() {

    if(valor_comissao.value == '') {
        toastr.error('Informe o valor da comissão')
        
        document.getElementById('valor_comissao').focus()
    }

    if(tipo_comissao.value == '') {
        toastr.error('Informe o tipo da comissão')

        document.getElementById('tipo_comissao').focus()
    }

    if(id_funcionario.value != 0 && id_servico.value != 0 && valor_comissao.value != '' && tipo_comissao.value != '') {
        emit('sendFormComissao', cadComissao.value)
        
        let btnSendServ = document.getElementById('btnSendServ')

        btnSendServ.innerHTML = 'Carregando...'

        setTimeout(() => {
            btnSendServ.innerHTML = 'Salvar'
        }, 1000);


    }
}

function openDel(val, comissao) {
    if(val === 't') {
        comissaoSelecionada.value = comissao
        openD.value = true
    } else {
        openD.value = false

        window.location.reload()
    }
}


</script> 


<template>
    <div class="w-full flex flex-col items-center justify-center space-y-8">
       
        <div class="w-full h-14 flex flex-col sm:flex-row mb-2 space-y-4 items-center justify-center">
                
            <div class="w-full sm:w-4/12 flex justify-center items-center space-x-2 mt-8 font-extrabold"> 
                <label class="label">
                    <span class="label-text text-lg font-medium">Serviço:</span>
                </label>

                <select v-model="servico" 
                        @change=getServico(servico) 
                        class="select select-bordered w-8/12">
                    <option value="0" disabled>Selecione um Serviço</option>
                    <option v-for="serv in servicosDisponiveis" :key="serv.id" :value="serv.id">{{ serv.nome }}</option>
                </select>
            </div>
            
        </div>

        <!-- Campos de lançamento da comissão -->
        <div :class="{'hidden': servico == 0}" class="w-11/12 flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-4 sm:space-y-0 
                                                      border sm:border-0 border-sky-300 rounded-lg py-4 mb-2 sm:mb-0">

            <div class="w-10/12 sm:w-2/12">
                <label class="label">
                    <span class="label-text">Serviço</span>
                </label>
                <input type="text" 
                    disabled
                    name="desc_servico" 
                    id="desc_servico" 
                    v-model="servicoSelecionado.nome"
                    class="input input-bordered w-full font-bold text-center bg-base-200" 
                />
            </div>

            <div class="w-10/12 sm:w-1/12">
                <label class="label">
                    <span class="label-text">Valor</span>
                </label>
                <input type="text" 
                    name="valor_comissao" 
                    id="valor_comissao" 
                    v-model="valor_comissao"
                    class="input input-bordered w-full text-center" 
                    v-maska
                    data-maska=
                    "[
                        '##,##',
                        '###,##',
                        '####,##',
                        '#####,##'
                    ]"
                />
            </div>

            <div class="w-10/12 sm:w-2/12">
                <label class="label">
                    <span class="label-text">Tipo:</span>
                </label>
                <select name="tipo_comissao" 
                        id="tipo_comissao" 
                        v-model="tipo_comissao"
                        class="select select-bordered w-full">
                    <option value="" disabled>Selecione o tipo</option>
                    <option value="0">Valor</option>
                    <option value="1">Porcentagem</option>
                </select>
            </div>
        </div>
        
        <!-- Comissões Já Cadastradas -->
        <div v-for="comissao in comissoes" :key="comissao.id" class="w-10/12 flex items-center justify-around">
            <div v-if="comissao.id_funcionario === id_funcionario" class="w-11/12 flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-4 sm:space-y-0 border sm:border-0 border-sky-300 rounded-lg mb-2 sm:mb-0">

                <div class="w-10/12 sm:w-2/12">
                    <label class="label">
                        <span class="label-text text-red-500">Serviço</span>
                    </label>
                    <input type="text" 
                        disabled
                        name="desc_servico" 
                        id="desc_servico" 
                        v-model="comissao.servico.nome"
                        class="input input-bordered w-full font-bold text-center text-gray-400 bg-base-200" 
                    />
                </div>

                <div class="w-10/12 sm:w-1/12">
                    <label class="label">
                        <span class="label-text text-red-500">Valor</span>
                    </label>
                    <input type="text" 
                        disabled
                        name="valor_comissao" 
                        id="valor_comissao" 
                        v-model="comissao.valor" 
                        class="input input-bordered w-full text-center text-gray-400 bg-base-200" 
                        v-maska
                        data-maska=
                        "[
                            '##,##',
                            '###,##',
                            '####,##',
                            '#####,##'
                        ]"
                    />
                </div>

                <div class="w-10/12 sm:w-[10%]">
                    <label class="label">
                        <span class="label-text text-red-500">Tipo:</span>
                    </label>
                    <select name="tipo_comissao" 
                            id="tipo_comissao" 
                            v-model="comissao.tipo_comissao" 
                            disabled
                            class="select select-bordered w-full text-center text-gray-400 bg-base-200">
                        <option value="" disabled>Selecione o tipo</option>
                        <option value="0">BRL</option>
                        <option value="1">%</option>
                    </select>
                </div>

                <div class="w-10/12 sm:w-3/12 flex justify-center sm:justify-start sm:pt-7 py-2 sm:py-0">
                    <button id="btnSendServ" 
                            class="btn btn-error w-10/12 sm:ml-3"
                            @click="openDel('t', comissao)">
                        Excluir Comissão
                    </button>
                </div>
            </div>
        </div>
            
        <DelComissaoUsu :comissao="comissaoSelecionada" :openDel="openD" @sendFormComissao="sendFormComissao" />

        <div class="mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4 sm:space-x-8">
            <button class="btn btn-ghost w-10/12 sm:w-5/12 mt-3 sm:mt-0 border border-gray-300" 
                    @click="closeAdd('f')">
                Cancelar
            </button>
            <button id="btnSendServ" 
                    class="btn btn-success w-10/12 sm:w-5/12 sm:ml-3" 
                    @click="sendFormComissao()">
                Salvar
            </button>
        </div>
    </div>
</template>