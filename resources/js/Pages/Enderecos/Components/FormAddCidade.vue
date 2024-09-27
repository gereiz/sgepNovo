<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useToastr } from '@/Components/toastr';

const props = defineProps(['dados', 'select']);
const emit = defineEmits(['cidadeAdd']);

const toastr = useToastr();

const cidadeAdd = reactive({
    cidade: '',
    uf: 0
});
const uf = ref(0);

const cadastraCidade = () => {

    if(cidadeAdd.nome.length < 3) {
        toastr.error('O nome da Cidade deve ter no mínimo 3 caracteres!')

        cidadeAdd.nome = '';
        cidadeAdd.uf_id = 0;
    } else if(cidadeAdd.uf_id == 0) {
        toastr.error('A Cidade deve pertener a uma UF!')

        cidadeAdd.nome = '';
        cidadeAdd.uf_id = 0;
    } else {
        emit('cidadeAdd', cidadeAdd);

        cidadeAdd.nome = '';
        cidadeAdd.uf_id = 0;
    }

    
   
}

</script>

<template>
    <form >  
        <div class="w-full flex">
                <div class="w-full flex flex-col">
                    <span class="label-text ml-1">Nome</span>
                    <input v-model="cidadeAdd.nome" class="w-11/12 input input-bordered mb-4" type="text" name="nome_add" id="nome_add">
                </div>

                <div class="w-full flex flex-col">
                    <span class="label-text ml-1">UF</span>
                    <select v-model="cidadeAdd.uf_id" name="uf_id" id="uf_id" class="select select-bordered">
                        <option value="0" disabled required>Seleicione a UF</option>
                        <option v-for="u, index in select" :key="index" :value="u.id">{{u.nome}}</option>
                    </select>
                </div>
        </div>

        <div class="modal-action">
            <label @click="cadastraCidade()" for="modal-cidade-add" class="botao-modal">Salvar</label>
        </div>
    </form>
</template>