<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Head } from '@inertiajs/vue3';
    import { useToastr } from '@/Components/toastr';
    import { ref, reactive, onMounted, computed } from 'vue';

    const toastr = useToastr();
    const props = defineProps(['anos', 'cidades']);

    const clientes = ref(props.clientes);
    const anos = ref(props.anos);
    const bisemanas = ref('');
    const regioes = ref('');
    const bairros = ref('');

    const cliId = ref(0)
    const anoId = ref(0)
    const bsId = ref(0)

    const cidId = ref(0)
    const regId = ref(0)
    const baiId = ref(0)
    const orient = ref('P')

    function setReservaCliente() {

        axios.post('/setRelReservaCliente', {anoBs: anoId.value })
            .then((res) =>{
                bisemanas.value = res.data
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function setRegioes() {

        axios.post('/setRegioes', {cidId: cidId.value})
            .then((res) =>{
                regioes.value = res.data
            })
            .catch((err) => {
                console.log(err)
            })

    }

    function setBairros() {
        axios.post('/setBairros', {regId: regId.value})
            .then((res) =>{
                bairros.value = res.data
                // console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })

    }

    function getRelColagem() {
        let btn = document.getElementById('gera_rel')

        
        if(bsId.value != 0) {

            axios.post('/setRelColagem', {numBs: bsId.value })
            .then((res) =>{
                axios.get('/getRelColagem')
                    .then(() =>{
                        // console.log(res.data)
                        btn.innerHTML = 'Carregando...'

                        setTimeout(() => {
                            btn.innerHTML = 'Gerar Relatório'
                            window.open('/getRelColagem', '_blank')

                        }, 3000);
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                
            })
            .catch((err) => {
                console.log(err)
            })


        } else {
            toastr.error('É preciso escolhar uma Bi-semana!')
        }



    }

</script>


<template>
    <Head title="Relatórios" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2">
                <div class="sm:w-2/12 h-14 flex items-center">
                    <h1 class="titulo">Relatório de Colagem</h1>
                </div>
            </div>

            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body space-y-10">
                    <div class="w-full flex flex-col flex-wrap md:flex-row">
                        <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6">
                            <!-- Ano -->
                            <div class="w-full sm:w-1/12 flex flex-col">
                                <label for="cliente">Ano</label>
                                <select class="select select-bordered w-full max-w-xs" v-model="anoId" @change="setReservaCliente()">
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

                            <!-- Orientação -->
                            <div class="w-full sm:w-5/12 flex flex-col">
                                <label for="cliente">Orientação</label>
                                <select v-model="orient" class="select select-bordered w-full max-w-xs" disabled>
                                    <option value="" disabled selected>Selecione</option>
                                    <option value="R">A4 - Retrato</option>
                                    <option value="P">A4 - Paisagem</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    
                    <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6">
                        <!-- Cidade -->
                        <div class="w-full sm:w-[20%] flex flex-col">
                            <label for="cidade">Cidade</label>
                            <select class="select select-bordered w-full max-w-xs" v-model="cidId" disabled @change="setRegioes()">
                                <option value="0" disabled selected>Todos</option>
                                <option v-for="cid, index in cidades" :key="index" :value="cid.id">{{ cid.nome }}</option>
                            </select>
                        </div>

                        <!-- Região -->
                        <div class="w-full sm:w-[20%] flex flex-col">
                            <label for="regiao">Região</label>
                            <select class="select select-bordered w-full max-w-xs" v-model="regId" disabled @change="setBairros()">
                                <option value="0" disabled selected>Todos</option>
                                <option v-for="reg, index in regioes" :key="index" :value="reg.id">{{ reg.nome }}</option>
                            </select>
                        </div>

                        <!-- Bairro -->
                        <div class="w-full sm:w-[20%] flex flex-col">
                            <label for="bairro">Bairro</label>
                            <select class="select select-bordered w-full max-w-xs" v-model="baiId" disabled>
                                <option value="0" disabled selected>Todos</option>
                                <option v-for="bai, index in bairros" :key="index" :value="bai.id">{{ bai.nome }}</option>
                            </select>
                        </div>

                        
                        <div class="w-full sm:w-4/12 flex flex-wrap sm:space-x-4 space-y-6 sm:space-y-0">
                            <div class="w-full sm:w-5/12 flex flex-col items-center sm:items-start justify-center">
                                <button id="gera_rel" class="botao-primario w-11/12 sm:w-fit sm:px-4 -ms-3.5 sm:-ms-0 mt-5" @click="getRelColagem()">Gerar Relatório</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </AuthenticatedLayout>

</template>

