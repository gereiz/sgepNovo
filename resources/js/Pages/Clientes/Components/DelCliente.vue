<script setup>
import { ref, shallowRef, watch } from 'vue'
import {useToastr} from "@/Components/toastr.js";

const props = defineProps(['openDel', 'clienteDel']);
const emit = defineEmits(['closeDel'])


const openD = ref(false)

const clienteNome = ref('')
const clienteId = ref('')

function closeDel() {
    openD.value = false
    emit('CloseDel', openD.value)

}

function excluirCliente(id) {
    axios.post('/DelCliente', {idCliente: clienteId.value})
        .then((res) =>{
            useToastr('success', 'Cliente excluído com sucesso!')
            location.reload()
        })
        .catch((err) => {
            console.error(err)
        })
}

watch(() => props.clienteDel, (val) => {
    clienteNome.value = props.clienteDel.nome_fantasia ? props.clienteDel.nome_fantasia : props.clienteDel.razao_social
    clienteId.value = props.clienteDel.id
})


watch(() => props.openDel, (val)  =>{
    if(val === true) {
        openD.value = true
    }
})


</script>


<template>
  <div class="modal" :class="{ 'modal-open': openD }">
    <div class="modal-box w-full sm:w-5/12">
      <div class="absolute right-2 top-2">
        <button class="btn btn-sm btn-circle btn-ghost" @click="closeDel">✕</button>
      </div>
      <h3 class="font-bold text-lg text-center">Excluir o Cliente: {{clienteNome}}</h3>
      <div class="mt-6 flex items-center justify-center gap-4">
        <button @click="closeDel" type="button" class="btn btn-info">Cancelar</button>
        <button @click="excluirCliente(clienteDel)" type="button" class="btn btn-error">Excluir</button>
      </div>
    </div>
  </div>
</template>

