<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Head } from '@inertiajs/vue3';
    import { useToastr } from '@/Components/toastr';
    import { ref, reactive, onMounted, computed, watch } from 'vue';

    const toastr = useToastr();
    const props = defineProps(['anos', 'centros_custo']);

    const centrosCusto = ref(props.centros_custo || []);

    // Removido filtro por datas: usaremos apenas Mês/Ano
    const tipoLancamento = ref('T');
    const status = ref('todos'); // todos | pendente | quitado
    const mes = ref(0);
    const ano = ref(0);
    const anos = ref(props.anos || []);
    const anosDesc = computed(() => {
        return [...(anos.value || [])].sort((a,b) => Number(b.ano_bisemana) - Number(a.ano_bisemana))
    })
    onMounted(() => {
        const current = new Date().getFullYear()
        const found = anosDesc.value.find(a => Number(a.ano_bisemana) === current)
        ano.value = found ? found.id : (anosDesc.value[0]?.id || 0)
    })
    const centrosCustoId = ref(999);


    function getRelatorio() {
        let btn = document.getElementById('gera_rel');
        btn.innerHTML = 'Carregando...';

        const params = new URLSearchParams();
        if (mes.value && ano.value) {
            params.set('mes', mes.value);
            params.set('ano', ano.value);
        }
        params.set('tipoLancamento', tipoLancamento.value);
        params.set('centrosCustoId', centrosCustoId.value);
        params.set('status', status.value);

        const url = `/getRelLancamentos?${params.toString()}`;
        console.log('Abrindo URL:', url); // 👈 veja se os parâmetros aparecem corretamente

        setTimeout(() => {
            btn.innerHTML = 'Gerar Relatório';
            window.open(url, '_blank');
        }, 500);
    }


</script>


<template>
    <Head title="Relatórios" />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            <!-- Cabeçalho e barra de Pesquisa -->
            <div class="w-full h-14 flex mb-2"> 
                <div class="sm:w-2/12 h-14 flex items-center">
                    <h1 class="text-2xl font-bold">Relatório de Lançamentos </h1>
                </div>
            </div>

            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body space-y-10">
                    <div class="w-full flex flex-col flex-wrap md:flex-row">
                        <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6">
                            <!-- Ano -->
                            <div class="w-full sm:w-2/12 flex flex-col">
                                <label class="label">
                                    <span class="label-text">Ano</span>
                                </label>
                                <select v-model="ano" class="select select-bordered w-full max-w-xs">
                                    <option value="0" disabled>Selecione</option>
                                    <option v-for="(a, idx) in anosDesc" :key="idx" :value="a.id">{{ a.ano_bisemana }}</option>
                                </select>
                            </div>

                            <!-- Tipo de Lançamento-->
                            <div class="w-full sm:w-2/12 flex flex-col">
                                <label class="label">
                                    <span class="label-text">Tipo</span>
                                </label>
                                <select v-model="tipoLancamento" class="select select-bordered w-full max-w-xs">
                                    <option value="T" selected>Todos</option>
                                    <option value="E">Entrada</option>
                                    <option value="S">Saída</option>
                                </select>
                            </div>

                            <!-- Status -->
                            <div class="w-full sm:w-2/12 flex flex-col">
                                <label class="label">
                                    <span class="label-text">Status</span>
                                </label>
                                <select v-model="status" class="select select-bordered w-full max-w-xs">
                                    <option value="todos" selected>Todos</option>
                                    <option value="pendente">Pendente</option>
                                    <option value="quitado">Quitado</option>
                                </select>
                            </div>

                            <!-- Centros de Custo -->
                            <div class="w-full sm:w-2/12 flex flex-col">
                                <label class="label">
                                    <span class="label-text">Centros de Custo</span>
                                </label>
                                <select v-model="centrosCustoId" class="select select-bordered w-full max-w-xs">
                                    <option value="999" selected>Todos</option>
                                    <option v-for="centro, index in centrosCusto" :key="index" :value="centro.id">{{ centro.centro_custo }}</option>
                                </select>
                            </div>

                            <!-- Mês/Ano -->
                            <div class="w-full sm:w-2/12 flex flex-col">
                                <label class="label">
                                    <span class="label-text">Mês</span>
                                </label>
                                <select v-model="mes" class="select select-bordered w-full max-w-xs">
                                    <option value="0">—</option>
                                    <option value="1">Janeiro</option>
                                    <option value="2">Fevereiro</option>
                                    <option value="3">Março</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Maio</option>
                                    <option value="6">Junho</option>
                                    <option value="7">Julho</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Setembro</option>
                                    <option value="10">Outubro</option>
                                    <option value="11">Novembro</option>
                                    <option value="12">Dezembro</option>
                                </select>
                            </div>
                            
            
                        </div>
                    </div>

                    
                    <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6">

                        <div class="w-full sm:w-4/12 flex flex-wrap sm:space-x-4 space-y-6 sm:space-y-0">
                            <div class="w-full sm:w-5/12 flex flex-col items-center sm:items-start justify-center">
                                <button id="gera_rel" class="btn btn-primary w-11/12 sm:w-fit sm:px-4 -ms-3.5 sm:-ms-0 mt-8" @click="getRelatorio()">Gerar Relatório</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </AuthenticatedLayout>

</template>

