<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useToastr } from '@/Components/toastr';

const toastr = useToastr();

const props = defineProps(['painel', 'bisemana'])

const emit = defineEmits(['atualizaPage'])

const enviaEmit = (val) => {
    
    emit('atualizaPage', val)

}

function cancelaReserva() {

    axios.post('/CancelaReserva', {painelReserva: props.painel,
                                   bs: props.bisemana})
         .then((res) => {
            
            if(res.data.cod == 1) {
                toastr.success(res.data.msg)

            } else {
                toastr.error(res.data.msg)
            }

         })

}



</script>

<template>
        <!-- Modal de Reserva Individual -->
        <input type="checkbox" id="modal-canc-reserva" class="modal-toggle" />          
        <div class="modal flex items-end md:items-center">
            <form method="dialog" class="modal-box bg-white">
                <h3 class="font-black text-2xl animate-pulse duration-200 text-center mb-2">Cancelar Reserva: Painel {{painel.identificacao}}</h3>
                <h3 class="font-black text-2xl text-red-700 animate-pulse duration-200 text-center">ATENÇÃO!</h3>
                <p class="py-4">Ao cancelar esta reserva, o painel ficará disponível na Bi-semana selecionada, e poderá ser reservado imadiatamente.</p>
                <p class="py-4">Confirme somente se tiver certeza do cancelamento!</p>
              
                <div class="modal-action">

                    <div class="w-full flex justify-center space-x-4">
                        <label @click="cancelaReserva(painel), enviaEmit(1)" for="modal-canc-reserva" class="w-5/12 text-sm botao-modal bg-red-700 hover:bg-red-500">Cancelar Reserva</label>
                        <label for="modal-canc-reserva" class="w-5/12 text-sm botao-modal bg-gray-700 hover:bg-gray-500">Manter Reserva</label>
                    </div>
                
                </div>
            </form>
        </div>
</template>