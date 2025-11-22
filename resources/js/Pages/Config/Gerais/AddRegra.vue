<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, reactive, onMounted, computed } from 'vue';
import TabelaRegras from './TabelaRegras.vue';

const props = defineProps(['permissions'])

const toastr = useToastr();



const permissao = ref({
    nome_permissao: ''
})


const AddPermissao = () => {

    if(permissao.value.nome_permissao == '') {
        toastr.error('Informe o nome da permissão!')
        return
    }

    axios.post('/createRole', {name: permissao.value.nome_permissao})
    .then((res) => {
        permissao.value.nome_permissao = ''
        toastr.success('Permissão cadastrada com sucesso!')

        window.location.reload()
    })
    .catch((err) => {
        console.log(err)
        toastr.error('Erro ao cadastrar permissão!')
    })
}



</script>

<template>
    <Head title="Regras & Permissões" />

    <AuthenticatedLayout>
        <div class="w-full min-h-screen pt-20 mx-2 md:mx-4">
            <div class="navbar bg-base-100 rounded-box shadow mb-4">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl">Funções & Permissões</a>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="col-span-1">
                    <div class="card bg-base-100 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title">Cadastrar Função</h3>
                            <div class="form-control w-full">
                                <label class="label">
                                    <span class="label-text">Nome da função</span>
                                </label>
                                <input type="text" name="nome_permissao" id="nome_permissao" placeholder="Ex.: gerente" v-model="permissao.nome_permissao" class="input input-bordered w-full" />
                            </div>
                            <div class="card-actions justify-end mt-4">
                                <button id="btnAddPermissao" class="btn btn-success" @click="AddPermissao">Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-1 lg:col-span-2">
                    <div class="card bg-base-100 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title">Regras cadastradas</h3>
                            <TabelaRegras :permissions="permissions" />
                        </div>
                    </div>
                </div>
            </div>




        </div>

    </AuthenticatedLayout>
</template>

