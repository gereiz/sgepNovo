<!-- Esse Componente recebe uma lista com todos os servicos, e exibe em um card -->

<script setup>

    import { ref, reactive, computed, onMounted, watch } from 'vue'
    import { usePage } from '@inertiajs/vue3';
    import { QuestionMarkCircleIcon } from '@heroicons/vue/20/solid'

    import EditComissaoUsu from './EditComissaoUsu.vue';
    import DelComissaoUsu from './DelComissaoUsu.vue';

    const props = defineProps(['usuarios', 'funcoes', 'servicos', 'comissoes']);

    const usuarioSelecionado = ref('')

    const user = usePage().props.auth.user;
    const openE = ref(false)
    const openD = ref(false)


    function openEdit(val, usu) {
        if(val === 't') {
            usuarioSelecionado.value = usu
            openE.value = true
        } else {
            openE.value = false

            window.location.reload()
        }
    }

    function openDel(val, usu) {
        if(val === 't') {
            usuarioSelecionado.value = usu
            openD.value = true
        } else {
            openD.value = false

            window.location.reload()
        }
    }


</script>



<template>

 
    <!-- Card Principal -->
    <div class="card w-full h-[42rem] bg-base-100 border border-base-200 shadow-xl overflow-auto rounded-md">
        <div class="card-body flex flex-col sm:flex-row">
            <!-- Paineis -->
            <div class="w-full flex flex-col flex-wrap md:flex-row">

                <!-- Cards dos Paineis -->
                <div v-for="(usuario, index) in usuarios" :key="index" :id="usuario.id" class="card w-full sm:w-[24%] h-[18rem] bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4 hover:scale-[1.1] hover:z-50 transition-all duration-500">
                    <div class="card-body flex" :id="index">
                        <div class="w-full flex-col sm:flex sm:flex-wrap">
                            <div class="w-full flex justify-center">
                                <div class="w-4/12">
                                    <img class="w-[5rem] h-[5rem] hover:scale-150 transition-all duration-1000 rounded-md"
                                        src="../../../../../../../storage/app/public/img/funcionario.png"
                                        alt="Foto-painel"
                                    >
                                </div>
                                <div class="w-6/12">
                                    <label class="label">
                                        <span class="label-text text-xs sm:text-xl font-extrabold">
                                            <span class="text-red-500">
                                                {{usuario.nome_fantasia ? usuario.nome_fantasia : usuario.razao_social}}
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div class="w-full flex flex-wrap sm:flex-nowrap justify-center my-2 space-x-2">
                                <div class="w-full">
                                    <div class="sm:flex flex-wrap ">
                                        <div class="w-full flex flex-col items-center space-y-3 mt-4">
                                            <!-- <p class="text-xs sm:text-base">Função: {{ usuario.roles }}</p> -->
                                            <!-- {{ usuario }} -->
                                        </div>

                                        <div class="w-full flex items-center justify-around space-x-2 mt-14">
                                            <button class="btn btn-success btn-md w-full" @click="openEdit('t', usuario)">Comissões</button>
                                            <!-- <button class="btn btn-error btn-md w-6/12" @click="openDel('t', usuario)">Inativar</button> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        <EditComissaoUsu :openEdit="openE"
                         @closeEdit="openEdit"
                         :usuario="usuarioSelecionado"
                         :servicos="props.servicos"
                         :comissoes="props.comissoes">
        </EditComissaoUsu>
        </div>
    </div>
</template>
