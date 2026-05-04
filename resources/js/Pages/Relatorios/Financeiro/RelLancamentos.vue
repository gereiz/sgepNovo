<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Head } from '@inertiajs/vue3';
    import { useToastr } from '@/Components/toastr';
    import { ref, reactive, onMounted, computed, watch } from 'vue';
    import axios from 'axios';

    const toastr = useToastr();
    const props = defineProps(['anos', 'centros_custo']);

    const centrosCusto = ref(props.centros_custo || []);

    // Removido filtro por datas: usaremos apenas Mês/Ano
    const tipoLancamento = ref('T');
    const status = ref('todos'); // todos | pendente | quitado
    const origem = ref('todos'); // todos | PI | OS | Manual
    const piReceber = ref(false);
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
    const search = ref('');
    const loading = ref(false);
    const pageData = ref({ data: [], current_page: 1, last_page: 1, total: 0, per_page: 25 });
    const debounceHandle = ref(null);

    const canFetch = computed(() => !!(mes.value && ano.value));
    const modoPi = computed(() => piReceber.value === true);

    function getOrigemLabel(desc) {
        const d = String(desc || '');
        if (d.startsWith('PI nº ')) return 'PI'
        if (d.startsWith('OS nº ')) return 'OS'
        return 'Manual'
    }

    function fetchLancamentos(p = 1) {
        if (!canFetch.value) {
            pageData.value = { data: [], current_page: 1, last_page: 1, total: 0, per_page: 25 }
            return
        }
        loading.value = true
        axios.get('/getRelLancamentosData', {
            params: {
                mes: mes.value,
                ano: ano.value,
                tipoLancamento: modoPi.value ? 'E' : tipoLancamento.value,
                centrosCustoId: centrosCustoId.value,
                status: modoPi.value ? 'pendente' : status.value,
                origem: modoPi.value ? 'PI' : origem.value,
                piReceber: modoPi.value ? 1 : 0,
                search: search.value,
                page: p
            }
        }).then((resp) => {
            pageData.value = resp.data
        }).catch((err) => {
            const msg = err?.response?.data?.error || 'Erro ao buscar lançamentos'
            toastr.error(msg)
        }).finally(() => {
            loading.value = false
        })
    }


    function getRelatorio() {
        let btn = document.getElementById('gera_rel');
        if (!mes.value || !ano.value) {
            toastr.error('Parâmetros obrigatórios ausentes')
            return
        }
        btn.innerHTML = 'Carregando...';

        const params = new URLSearchParams();
        if (mes.value && ano.value) {
            params.set('mes', mes.value);
            params.set('ano', ano.value);
        }
        params.set('tipoLancamento', modoPi.value ? 'E' : tipoLancamento.value);
        params.set('centrosCustoId', centrosCustoId.value);
        params.set('status', modoPi.value ? 'pendente' : status.value);
        params.set('origem', modoPi.value ? 'PI' : origem.value);
        params.set('piReceber', modoPi.value ? '1' : '0');
        if (search.value) params.set('search', search.value);

        const url = `/getRelLancamentos?${params.toString()}`;
        console.log('Abrindo URL:', url); // 👈 veja se os parâmetros aparecem corretamente

        setTimeout(() => {
            btn.innerHTML = 'Gerar Relatório';
            window.open(url, '_blank');
        }, 500);
    }

    watch([mes, ano, tipoLancamento, status, centrosCustoId, origem, piReceber], () => {
        fetchLancamentos(1)
    })

    watch(() => search.value, () => {
        if (debounceHandle.value) clearTimeout(debounceHandle.value)
        debounceHandle.value = setTimeout(() => fetchLancamentos(1), 350)
    })

    watch(() => piReceber.value, (val) => {
        if (val) {
            tipoLancamento.value = 'E'
            status.value = 'pendente'
            origem.value = 'PI'
        } else {
            tipoLancamento.value = 'T'
            status.value = 'todos'
            origem.value = 'todos'
        }
    })

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
                        <div class="w-full grid grid-cols-1 sm:grid-cols-7 gap-4">
                            <!-- Ano -->
                            <div class="flex flex-col">
                                <label class="label">
                                    <span class="label-text">Ano</span>
                                </label>
                                <select v-model="ano" class="select select-bordered w-full">
                                    <option value="0" disabled>Selecione</option>
                                    <option v-for="(a, idx) in anosDesc" :key="idx" :value="a.id">{{ a.ano_bisemana }}</option>
                                </select>
                            </div>

                            <!-- Mês -->
                            <div class="flex flex-col">
                                <label class="label">
                                    <span class="label-text">Mês</span>
                                </label>
                                <select v-model="mes" class="select select-bordered w-full">
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

                            <!-- Tipo de Lançamento-->
                            <div class="flex flex-col">
                                <label class="label">
                                    <span class="label-text">Tipo</span>
                                </label>
                                <select v-model="tipoLancamento" class="select select-bordered w-full" :disabled="modoPi">
                                    <option value="T" selected>Todos</option>
                                    <option value="E">Entrada</option>
                                    <option value="S">Saída</option>
                                </select>
                            </div>

                            <!-- Origem -->
                            <div class="flex flex-col">
                                <label class="label">
                                    <span class="label-text">Origem</span>
                                </label>
                                <select v-model="origem" class="select select-bordered w-full" :disabled="modoPi">
                                    <option v-if="modoPi" value="PI">PI</option>
                                    <template v-else>
                                        <option value="todos" selected>Todos</option>
                                        <option value="OS">OS</option>
                                        <option value="Manual">Manual</option>
                                    </template>
                                </select>
                            </div>

                            <!-- Status -->
                            <div class="flex flex-col">
                                <label class="label">
                                    <span class="label-text">Status</span>
                                </label>
                                <select v-model="status" class="select select-bordered w-full" :disabled="modoPi">
                                    <option value="todos" selected>Todos</option>
                                    <option value="pendente">Pendente</option>
                                    <option value="quitado">Quitado</option>
                                </select>
                            </div>

                            <!-- Centros de Custo -->
                            <div class="flex flex-col">
                                <label class="label">
                                    <span class="label-text">Centros de Custo</span>
                                </label>
                                <select v-model="centrosCustoId" class="select select-bordered w-full">
                                    <option value="999" selected>Todos</option>
                                    <option v-for="centro, index in centrosCusto" :key="index" :value="centro.id">{{ centro.centro_custo }}</option>
                                </select>
                            </div>

                            <div class="flex flex-col">
                                <label class="label">
                                    <span class="label-text">PI a Receber</span>
                                </label>
                                <div class="h-12 flex items-center">
                                    <input type="checkbox" class="toggle toggle-primary" v-model="piReceber" />
                                </div>
                            </div>
                            
            
                        </div>
                    </div>

                    <div v-if="modoPi" class="w-full sm:w-10/12">
                        <div class="alert alert-info">
                            <span>Modo PI a Receber ativo: Origem=PI, Tipo=Entrada, Status=Pendente</span>
                        </div>
                    </div>
                    
                    
                    <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6">

                        <div class="w-full sm:w-4/12 flex flex-col">
                            <label class="label">
                            </label>
                            <input v-model="search" type="text" class="input input-bordered w-full max-w-xs" placeholder="Descrição / Observações / Cliente" />
                        </div>

                        <div class="w-full sm:w-4/12 flex flex-wrap sm:space-x-4 space-y-6 sm:space-y-0">
                            <div class="w-full sm:w-5/12 flex flex-col items-center sm:items-start justify-center">
                                <button id="gera_rel" class="btn btn-primary w-11/12 sm:w-fit sm:px-4 -ms-3.5 sm:-ms-0 mt-8" @click="getRelatorio()">Gerar Relatório</button>
                            </div>
                        </div>
                    </div>

                    <div class="w-full">
                        <div v-if="!canFetch" class="text-sm text-base-content/70">
                            Selecione Ano e Mês para visualizar os lançamentos.
                        </div>

                        <div v-else class="card w-full bg-base-100 border border-base-200 shadow-sm overflow-auto rounded-md">
                            <div class="card-body">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-sm text-base-content/70">
                                        Total: {{ pageData.total }}
                                        <span v-if="modoPi"> (Modo PI a Receber)</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button class="btn btn-sm" :disabled="loading || pageData.current_page <= 1" @click="fetchLancamentos(pageData.current_page - 1)">Anterior</button>
                                        <span class="text-sm">{{ pageData.current_page }} / {{ pageData.last_page }}</span>
                                        <button class="btn btn-sm" :disabled="loading || pageData.current_page >= pageData.last_page" @click="fetchLancamentos(pageData.current_page + 1)">Próxima</button>
                                    </div>
                                </div>

                                <div class="overflow-auto">
                                    <table class="table table-xs w-full">
                                        <thead>
                                            <tr v-if="modoPi">
                                                <th>PI</th>
                                                <th>Parcela</th>
                                                <th>Emissão</th>
                                                <th>Cliente</th>
                                                <th>Valor</th>
                                                <th>Vencimento</th>
                                                <th>Status</th>
                                            </tr>
                                            <tr v-else>
                                                <th>Data</th>
                                                <th>Valor</th>
                                                <th>Parcela</th>
                                                <th>Tipo</th>
                                                <th>Status</th>
                                                <th>Centro de Custo</th>
                                                <th>Origem</th>
                                                <th>Descrição</th>
                                                <th>OBS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="loading">
                                                <td :colspan="modoPi ? 7 : 9">Carregando...</td>
                                            </tr>
                                            <tr v-else-if="!pageData.data || pageData.data.length === 0">
                                                <td :colspan="modoPi ? 7 : 9">Nenhum lançamento encontrado.</td>
                                            </tr>

                                            <tr v-else-if="modoPi" v-for="l in pageData.data" :key="l.id">
                                                <td>{{ l.pi_id }}</td>
                                                <td>{{ l.parcelas }}</td>
                                                <td>{{ l.emissao ? new Date(l.emissao).toLocaleDateString() : '' }}</td>
                                                <td>{{ l.cliente }}</td>
                                                <td>R$ {{ Number(l.valor || 0).toFixed(2) }}</td>
                                                <td>{{ l.vencimento ? new Date(l.vencimento).toLocaleDateString() : '' }}</td>
                                                <td><span class="badge badge-warning">A Receber</span></td>
                                            </tr>

                                            <tr v-else v-for="l in pageData.data" :key="l.id">
                                                <td>{{ l.dt_faturamento ? new Date(l.dt_faturamento).toLocaleDateString() : '' }}</td>
                                                <td>R$ {{ Number(l.valor || 0).toFixed(2) }}</td>
                                                <td>{{ l.parcelas }}</td>
                                                <td>{{ l.tipo_lancamento?.tipo || '' }}</td>
                                                <td>
                                                    <span v-if="(l.status_pagamento || 'PENDENTE') === 'QUITADO'" class="badge badge-success">Quitado</span>
                                                    <span v-else class="badge badge-warning">Pendente</span>
                                                </td>
                                                <td>{{ l.centro_custo?.centro_custo || '' }}</td>
                                                <td>{{ getOrigemLabel(l.descricao) }}</td>
                                                <td class="max-w-[420px] truncate" :title="l.descricao">{{ l.descricao }}</td>
                                                <td class="max-w-[320px] truncate" :title="l.observacoes">{{ l.observacoes }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </AuthenticatedLayout>

</template>
