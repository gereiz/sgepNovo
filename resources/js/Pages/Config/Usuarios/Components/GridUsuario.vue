<!-- Esse Componente recebe uma lista com todos os servicos, e exibe em um card -->

<script setup>

    import { ref, reactive, computed, onMounted, watch } from 'vue'
    import { QuestionMarkCircleIcon } from '@heroicons/vue/20/solid'
    import EditUsuario from './EditUsuario.vue';
    import DelUsuario from './DelUsuario.vue';
 

    const props = defineProps(['usuarios', 'funcoes']);

    const usuarioSelecionado = ref('')

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
    <div class="card w-full h-[35rem] sm:h-[38rem] bg-base-100 border border-base-200 shadow-xl overflow-auto rounded-md">
        <div class="card-body flex flex-col sm:flex-row">
            <!-- Paineis -->
            <div class="w-full flex flex-col flex-wrap md:flex-row">
                
                <!-- Cards dos Paineis -->
                <div v-for="(usuario, index) in usuarios" :key="index" :id="usuario.id" class="card w-full sm:w-[24%] h-[16rem] bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4 hover:scale-[1.1] hover:z-50 transition-all duration-500">
                    <div class="card-body flex" :id="index">
                        <div class="w-full flex-col sm:flex sm:flex-wrap">
                            <div class="w-full flex justify-center">
                                <div class="w-4/12">
                                    <img class="w-[5rem] h-[5rem] hover:scale-150 transition-all duration-1000 rounded-md" 
                                        src="../../../../../../storage/app/public/img/funcionario.png" 
                                        alt="Foto-painel"
                                    >
                                </div>
                                <div class="w-6/12">
                                    <p class="text-xs sm:text-xl font-extrabold">
                                        <span class="text-red-500">
                                            {{usuario.name}}
                                        </span>
                                    </p>

                                </div>
                            </div>                            

                            <div class="w-full flex flex-wrap sm:flex-nowrap justify-center my-2 space-x-2">
                                <div class="w-full">
                                    <div class="sm:flex flex-wrap ">   
                                        <div class="w-full flex flex-col items-center space-y-3 mt-4">
                                            
                                            <p class="text-xs sm:text-base">Função: {{ usuario.funcao.cargo }}</p>

                                        </div>

                                        <div class="w-full flex items-center justify-around mt-4 space-x-2">
                                            <label class="inline-flex w-6/12 justify-center rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-amber-300 sm:mt-0 sm:w-5/12" @click="openEdit('t', usuario)">Editar</label>
                                            <label class="inline-flex w-6/12 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-300 sm:ml-3 sm:w-5/12" @click="openDel('t', usuario)">Inativar</label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        
            <EditUsuario :openEdit="openE" @closeEdit="openEdit" :usuario="usuarioSelecionado" :funcoes="props.funcoes">
            </EditUsuario>

            <DelUsuario :openDel="openD" @closeDel="openDel" :usuario="usuarioSelecionado">
            </DelUsuario>
        </div>
    </div>

</template>