<script setup>

import { ref, reactive, onMounted, computed } from 'vue';
import { useToastr } from '@/Components/toastr';
import Multiselect from 'vue-multiselect';

const toastr = useToastr(); 

const props =  defineProps(['clienteSel', 'idBisemana', 'idents'])

const emit = defineEmits(['atualizaPage'])

const enviaEmit = (val) => {
    
    emit('atualizaPage', val)

}
const idents = reactive(props.idents)

const paineisLista = ref([]);
const formReserva = reactive({cliente: '', campanha: '', observ: ''})


const valPi = ref(false)
const confPi = ref(null)
const hidePiModal = ref(false)


function confirmaPI() {

    if(valPi.value) {
        let conf = confPi.value
        hidePiModal.value = true
        conf.showModal()

    }          

}
 
function reservaPainel() {
    
    formReserva.cliente = props.clienteSel.id

    axios.post('/ResPaineisCli', {clienteId: formReserva.cliente,
                                outdoorId: paineisLista.value,
                                bsId: props.idBisemana,
                                campanha: formReserva.campanha,
                                obs: formReserva.observ,
                                checkPi: valPi.value
    })
    .then((res) => {
        if(res.data.cod === 0) {
            toastr.error(res.data.msg)
        } else if(res.data.cod == 1) {
            toastr.success(res.data.msg)


            formReserva.cliente = ''
            formReserva.campanha = ''
            formReserva.observ = ''
            paineisLista.value = []
            valPi.value = false
 
           
        }
    })


}

</script>

<template >
    
    <!-- Inclusão de novos Paineis -->
    <input type="checkbox" id="modal-add-painel" class="modal-toggle" />
    <div class="modal flex items-end md:items-center">
        <div class="modal-box sm:max-w-[90rem] ml-[16.5%] modal-bottom mb-2">

            <!-- Cabeçalho -->
            <div class="flex mb-4">
                <label for="modal-add-painel" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                <h3 class="font-bold sm:text-lg">Incluir Painéis na Bi-semana selecionada</h3>
            </div>

            <!-- Formulário -->
            <div class="w-full flex flex-col h-[80%] space-y-4">

                <!-- Cliente -->
                <div class="w-full flex flex-col">
                    <label for="cliente" class="mb-2">Cliente</label>
                    <input type="text" class="input input-bordered" name="cliente" :value="clienteSel.nome_fantasia ? clienteSel.nome_fantasia : clienteSel.razao_social" id="cliente" disabled>
                </div>
            
                <!-- Painéis -->
                <div class="w-full flex flx-col flex-wrap mt-4">
                    <label for="paineis" class="mb-2">Painéis</label>
                    <multiselect class="w-full "
                        v-model="paineisLista"
                        :options="idents"
                        :multiple="true"
                        :searchable="true"
                        :close-on-select="false"
                        :show-labels="false"
                        :hide-selected="true"
                        open-direction="bottom"
                        placeholder="Todos"
                        name="Paineis"
                    >
                    </multiselect>  
                </div>

                <!-- Campanha -->
                <div class="w-full flex flex-col">
                    <span class="label-text ml-1">Campanha</span>
                    <input v-model="formReserva.campanha" type="text" name="campanha" id="campanha" class="input input-bordered">
                </div>

                <!-- Observação -->
                <div class="w-full flex flex-col">
                    <span class="label-text ml-1">Obseravação</span>
                    <textarea v-model="formReserva.observ" name="obs" id="obs" class="textarea textarea-bordered" :disabled="idBisemana == 0"></textarea>
                </div>


                <!-- Verifica a existência de P. I. -->
                <div class="w-full flex flex-col">
                    <div class="form-control">
                        <label class="cursor-pointer">
                            <span class="label-text text-lg sm:text-xl me-4">Existe P. I. para esta reserva?</span>
                            <input type="checkbox" 
                                    v-model="valPi" 
                                    @click="valPi = !valPi, confirmaPI()" 
                                    class="checkbox checkbox-lg checkbox-success border-2 border-gray-400" 
                            />
                        </label>
                    </div>
                </div>

                <!-- Modal de confirmação de PI -->
                <dialog id="modal_confirm" ref="confPi" class="bg-transparent flex justify-center" :class="{'hidden': !hidePiModal}">
                    <form method="dialog" class="modal-box bg-white">
                        <h3 class="font-black text-2xl text-red-700 animate-pulse duration-200 text-center">ATENÇÃO!</h3>
                        <p class="py-4">Ao Marcar que existe uma P. I. para esta reserva não será mais possível alterá-la!</p>
                        <p class="py-4">Confirme somente se tiver certeza da reserva.</p>
                        <div class="modal-action">

                        <!-- Se houver um botão no formulário, ele fechará o modal -->
                        <div class="w-full flex justify-center space-x-4">
                            <button class="w-5/12 botao-primario" @click="hidePiModal = false">Confirmar</button>
                            <button @click="valPi = false, hidePiModal = false" class="w-5/12 botao-danger">Ainda não !</button>   
                        </div>
                        
                        </div>
                    </form>
                </dialog>
            </div>

            <!-- Botão de Confirmação de Reserva -->
            <div class="modal-action">
                <label for="modal-add-painel" class="w-full botao-modal" @click="reservaPainel(), enviaEmit(1)">Reservar</label>
            </div>
        </div>
    </div>


</template>

