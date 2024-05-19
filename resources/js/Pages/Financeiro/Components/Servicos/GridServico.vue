<!-- Esse Componente recebe uma lista com todos os servicos, e exibe em um card -->

<script setup>

    import { ref, reactive, computed, onMounted, watch } from 'vue'
    import {cashBR } from '@/functions'
    import { QuestionMarkCircleIcon } from '@heroicons/vue/20/solid'
    import EditServico from './EditServico.vue';
    import DelServico from './DelServico.vue';


    const props = defineProps(['servicos']);
    const servicos = ref(props.servicos)
    const servicoSelecionado = ref('')

    const openE = ref(false)
    const openD = ref(false)


    function openEdit(val, serv) {
        if(val === 't') {
            servicoSelecionado.value = serv
            openE.value = true
        } else {
            openE.value = false

            window.location.reload()
        }
    }

    function openDel(val, serv) {
        if(val === 't') {
            servicoSelecionado.value = serv
            openD.value = true
        } else {
            openD.value = false

            window.location.reload()
        }
    }


</script>



<template>


    <!-- Card Principal -->
    <div class="card w-full h-[28rem] sm:h-[40rem] bg-base-100 border border-base-200 shadow-xl overflow-auto rounded-md">
        <div class="card-body flex flex-col sm:flex-row">
            <!-- Paineis -->
            <div class="w-full flex flex-col flex-wrap md:flex-row">
                
                <!-- Cards dos Paineis -->
                <div v-for="(serv, index) in servicos" :key="index" :id="serv.id" class="card w-full sm:w-[24%] h-[18rem] bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4 hover:scale-[1.1] hover:z-50 transition-all duration-500">
                    <div class="card-body flex" :id="index">
                        <div class="w-full flex-col sm:flex sm:flex-wrap">
                            <div class="w-full flex justify-center">
                                <div class="w-4/12">
                                    <img class="w-[5rem] h-[5rem] hover:scale-150 transition-all duration-1000 rounded-md" 
                                        src="../../../../../../storage/app/public/img/servico.png" 
                                        alt="Foto-painel"
                                    >
                                </div>
                                <div class="w-6/12">
                                    <p class="text-xs sm:text-xl font-extrabold"><span class="text-red-500">Nome:</span>  {{serv.nome}}</p>

                                </div>
                            </div>                            

                            <div class="w-full flex flex-wrap sm:flex-nowrap justify-center my-2 sm:-ml-2 space-x-2">
                                <div class="w-full">
                                    <div class="sm:flex flex-wrap ">   
                                        <div class="w-full flex flex-col items-center space-y-3 mt-4">
                                            
                                            <p class="text-xs sm:text-lg">{{ serv.descricao }}</p>

                                            <p class="text-xs sm:text-xl font-extrabold hover:text-red-700 sm:ml-4">
                                                {{cashBR(serv.valor)}}     
                                            </p>
                                            
                                        </div>

                                        <div class="w-full flex items-center justify-around mt-4 space-x-2">
                                            <label class="inline-flex w-6/12 justify-center rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-amber-300 sm:mt-0 sm:w-5/12" @click="openEdit('t', serv)">Editar</label>
                                            <label class="inline-flex w-6/12 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-300 sm:ml-3 sm:w-5/12" @click="openDel('t', serv)">Excluir</label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        
            <EditServico :openEdit="openE" @closeEdit="openEdit" :servico="servicoSelecionado">
            </EditServico>

            <DelServico :openDel="openD" @closeDel="openDel" :servico="servicoSelecionado">
            </DelServico>
        </div>
    </div>

</template>