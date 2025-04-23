<!-- Esse Componente recebe uma lista com todos os servicos, e exibe em um card -->

<script setup>

    import { ref, reactive, computed, onMounted, watch } from 'vue'
    import { usePage } from '@inertiajs/vue3';
    import { QuestionMarkCircleIcon } from '@heroicons/vue/20/solid'
    import EditUsuario from './Edit/EditUsuario.vue';
    import DelUsuario from './Del/DelUsuario.vue';
    import AcessosUsuario from './Permissoes/Permissoes.vue';


    const props = defineProps(['usuarios', 'funcoes']);
    const page = usePage();

    const usuarioSelecionado = ref('')

    const editaUsuario = page.props.user.permissions.includes('editar usuario');
    const inativaUsuario = page.props.user.permissions.includes('editar usuario');

    const can = props.can

    const openE = ref(false)
    const openD = ref(false)
    const openA = ref(false)


    function openEdit(val, usu) {
        if(val === 't') {
            usuarioSelecionado.value = usu
            openE.value = true
        } else {
            openE.value = false

            // window.location.reload()
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

    function openAcessos(val, usu) {
        if(val === 't') {
            usuarioSelecionado.value = usu
            openA.value = true
        } else {
            openA.value = false

            window.location.reload()
        }
    }



</script>



<template>

    <!-- Card Principal -->
    <div class="card w-full h-[35rem] sm:h-[38rem] bg-base-100 border border-base-200 shadow-xl overflow-auto rounded-md">
        <div class="card-body flex flex-col sm:flex-row">
            <!-- Paineis -->
            <div class="w-full flex flex-col flex-wrap md:flex-row items-around justify-center">

                <!-- Cards dos Paineis -->
                <div v-for="(usuario, index) in usuarios" :key="index" :id="usuario.id" 
                        class="card w-full md:w-[20vw] h-[30vh] shadow-xl rounded-xl mb-4 md:mx-3 bg-base-100 hover:bg-emerald-100 transition-all duration-500"
                >
                    <figure class="h-[14vh] flex flex-col">
                        <img class="w-[25%] rounded-md" src="../../../../../../storage/app/public/img/funcionario.png" alt="agente" />
                        <span class="text-red-500 font-bold">
                            {{usuario.name}}
                        </span>
                    </figure>
                    <div class="card-body">
                        
                        <div class="w-full flex items-center justify-center md:justify-around mt-4 space-x-2">
                            <label v-if="editaUsuario" class="w-32 btn btn-warning text-white" @click="openEdit('t', usuario)">Editar</label>
                            <label v-if="inativaUsuario" class="w-32 btn btn-error text-white" @click="openDel('t', usuario)">Inativar</label>
                        </div>
                    </div>
                </div>
            </div>

            <EditUsuario :openEdit="openE" @closeEdit="openEdit" :usuario="usuarioSelecionado" :funcoes="props.funcoes">
            </EditUsuario>

            <DelUsuario :openDel="openD" @closeDel="openDel" :usuario="usuarioSelecionado" :permissions="can" >
            </DelUsuario>

            <AcessosUsuario :opAcessos="openA" @closeAcessos="openAcessos" :usuario="usuarioSelecionado" :permissions="can">
            </AcessosUsuario>
        </div>
    </div>

</template>
