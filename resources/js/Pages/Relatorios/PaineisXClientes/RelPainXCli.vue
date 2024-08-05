<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Head } from '@inertiajs/vue3';
    import { useToastr } from '@/Components/toastr';
    import { ref, reactive, onMounted, computed } from 'vue';

    const props = defineProps(['anos'])

    const bisemanas = ref([])

    const anoId = ref(0)
    const bsId = ref(0)
    const orient = ref('P')


    
    function getBs() {

        axios.post('/getBisemanas', {anoId: anoId.value})
            .then((res) => {
                bisemanas.value = res.data
            })
            .catch((err) => {
                console.log(err)
            })

    }


    function getRelatorio() {
        let btn = document.getElementById('gera_rel')

        btn.innerHTML = 'Carregando...'

        axios.post('/setPaineisCliente', {anoId: anoId.value, 
                                        bsId: bsId.value,
                                        orient: orient.value})
            .then((res) => {
                // console.log('pegou os dados')

                axios.get('/getPaineisCliente')
                    .then((res) => {
                        // console.log('Gerou')

                        setTimeout(() => {
                            btn.innerHTML = 'Gerar Relatório'
                            window.open('/getPaineisCliente', '_blank')

                        }, 3000);
                    })
                    .catch((err) => {
                        console.log(err)
                    })


               
            })
            .catch((err) => {
                console.log(err)

                btn.innerHTML = 'Erro ao Gerar!'

                setTimeout(() => {
                    btn.innerHTML = 'Gerar Relatório'
                }, 3000);
            })

    }

</script>


<template>
    <Head title="Relatórios" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="sm:w-2/12 h-14 flex items-center">
                    <h1 class="titulo">Painéis por Cliente</h1>
                </div>
            </div>

            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body space-y-10">
                    <div class="w-full flex flex-col flex-wrap md:flex-row">
                        <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6">
                            <!-- Ano -->
                            <div class="w-full sm:w-1/12 flex flex-col">
                                <label for="cliente">Ano</label>
                                <select class="select select-bordered w-full max-w-xs" v-model="anoId" @change="getBs()">
                                    <option value="0" disabled selected>Selecione</option>
                                    <option v-for="ano, index in anos" :key="index" :value="ano.id">{{ ano.ano_bisemana }}</option>
                                </select>
                            </div>


                            <!-- Bi-semana -->
                            <div class="w-full sm:w-3/12 flex flex-col">
                                <label for="cliente">Bi-semana</label>
                                <select class="select select-bordered w-full max-w-xs" v-model="bsId" :disabled="bisemanas.length === 0">
                                    <option value="0" disabled selected>Selecione</option>
                                    <option v-for="bs, index in bisemanas" :key="index" :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString() }} até {{ new Date(bs.fim).toLocaleDateString() }}</option>
                                  
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Orientação -->
                    <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 space-x-6">
                        <div class="w-full sm:w-6/12 flex flex-wrap sm:space-x-4 space-y-6 sm:space-y-0">
                            <div class="w-full sm:w-5/12 flex flex-col">
                                <label for="cliente">Orientação</label>
                                <select v-model="orient" class="select select-bordered w-full max-w-xs" disabled>
                                    <option value="" disabled selected>Selecione</option>
                                    <option value="R">A4 - Retrato</option>
                                    <option value="P">A4 - Paisagem</option>
                                </select>
                            </div>
                            <div class="w-full sm:w-5/12 flex flex-col items-center sm:items-start justify-center">
                                <button id="gera_rel" class="botao-primario w-11/12 sm:w-fit sm:px-4 -ms-3.5 sm:-ms-0 mt-5" @click="getRelatorio()">Gerar Relatório</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </AuthenticatedLayout>

</template>

