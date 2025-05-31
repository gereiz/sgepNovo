<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Head } from '@inertiajs/vue3';
    import { useToastr } from '@/Components/toastr';
    import { ref, reactive, onMounted, computed, watch } from 'vue';

    const toastr = useToastr();
    const props = defineProps(['anos', 'centros_custo']);

    const centrosCusto = ref(props.centros_custo || []);

    const dtInicial = ref('');
    const dtFinal = ref('');
    const tipoLancamento = ref('T');
    const centrosCustoId = ref(999);


    function getRelatorio() {
        let btn = document.getElementById('gera_rel');
        btn.innerHTML = 'Carregando...';

        const params = new URLSearchParams({
            dtInicial: dtInicial.value,
            dtFinal: dtFinal.value,
            tipoLancamento: tipoLancamento.value,
            centrosCustoId: centrosCustoId.value,
        });

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
                         
                            <!-- Bi-semana Inicial -->
                            <div class="w-full sm:w-[12%] flex flex-col">
                                <div class="flex">
                                    <label class="label">
                                        <span class="label-text">Data Inicial</span>
                                    </label>                           
                                </div>
                                <div class="w-full flex items-center space-x-4">
                                        <input type="date"
                                        v-model="dtInicial"
                                        placeholder="Data Iniciaç"
                                        class="input input-bordered"
                                        name="dtInicial"
                                        id="dtInicial"
                                    />
                                </div>
                            </div>

                            <!-- Bi-semana Final -->
                            <div class="w-full sm:w-[12%] flex flex-col">
                                <div class="flex">
                                    <label class="label">
                                        <span class="label-text">Data Final</span>
                                    </label>                           
                                </div>
                                <div class="w-full flex items-center space-x-4">
                                        <input type="date"
                                        v-model="dtFinal"
                                        placeholder="Data Final"
                                        class="input input-bordered"
                                        name="dtFinal"
                                    />
                                </div>
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

