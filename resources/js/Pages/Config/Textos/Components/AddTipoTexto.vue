<script setup>
import { ref, watch, shallowRef } from 'vue'
import { useToastr } from '@/Components/toastr.js';
import Swal from 'sweetalert2';
import AppCard from '@/Components/Cards/AppCard.vue';

const toastr = useToastr();

const props = defineProps(['openTipo', 'tipoTexto'])
const emit = defineEmits(['closeAdd'])



const open = ref(false)

const nome = ref('')
const descricao = ref('')
const tipoTexto = ref({})

watch( () => props.openTipo, (val) =>  {
    if(val === true) {
        open.value = true
    } else {
        open.value = false
    }
    console.log(open.value);
})

watch( () => props.tipoTexto, (val) =>  {
    if(val !== 0) {
        tipoTexto.value = val
        nome.value = tipoTexto.value.nome
        descricao.value = tipoTexto.value.descricao

    }
})

function closeCard() {
    open.value  = false
    emit('closeAdd', open.value)
    console.log(open.value);
}

function AddOrEditTipoTexto() {
    const nomeVal = (nome.value || '').trim();
    if (nomeVal.length === 0) {
        toastr.error('Informe o nome do tipo de texto');
        return;
    }
    const isUpdate = tipoTexto.value && tipoTexto.value.id;

    // Se for atualização, mostra confirmação
    if (isUpdate) {
        Swal.fire({
            title: 'Confirmação',
            text: 'Já existe um tipo de texto com este nome. O registro será atualizado em vez de criar um novo. Deseja continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00935F',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, atualizar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                saveData();
            }
        });
    } else {
        saveData();
    }
}

function saveData() {
    axios.post('/configuracoes/addOrEditTipoTexto', {
        id: tipoTexto.value.id,
        nome: nome.value,
        descricao: descricao.value
    })
    .then((response) => {
        toastr.success('Tipo de texto ' + (tipoTexto.value.id ? 'atualizado' : 'adicionado') + ' com sucesso!')
        nome.value = ''
        descricao.value = ''
        closeCard()

        setTimeout(() => {
            window.location.reload()
        }, 2000);

    })
   .catch((error) => {
        toastr.error('Erro ao ' + (tipoTexto.value.id ? 'atualizar' : 'adicionar') + ' tipo de texto!')
        nome.value = ''
        descricao.value = ''
        // closeM()
        console.log(error);
   })
}


</script>

<template>

    <AppCard :openCard="open" @closeCard="closeCard">
        <template #title> Tipo de Texto</template>
        <template #subtitle>Adicione um novo tipo de texto.</template>
        <div class="space-y-6">
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Nome do tipo de texto</span>
                </label>
                <input type="text" class="input input-bordered" v-model="nome" placeholder="Ex.: Observação" />
            </div>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Descrição</span>
                </label>
                <textarea class="textarea textarea-bordered" v-model="descricao" placeholder="Descrição"></textarea>
            </div>
        </div>
        <template #actions>
            <button class="btn btn-success" @click="AddOrEditTipoTexto()" :disabled="!nome || nome.trim() === ''">Salvar</button>
            <button class="btn" @click="closeCard">Cancelar</button>
        </template>
    </AppCard>

</template>

