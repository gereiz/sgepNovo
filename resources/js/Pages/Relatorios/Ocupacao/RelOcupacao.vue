<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Head } from '@inertiajs/vue3';
    import { useToastr } from '@/Components/toastr';
    import { ref, reactive, onMounted, computed, watch, BaseTransitionPropsValidators } from 'vue';
    import Multiselect from 'vue-multiselect'

    const toastr = useToastr();
    const props = defineProps(['anos', 'paineis']);

    const anoId = ref(0);
    const bisemanas = ref([]);
    const bsId = ref(0);
    const idPaineis = ref([]); // Array para armazenar os painéis selecionados
    const paineis = ref(props.paineis || []); // Inicializa com os painéis recebidos via props
    const idPaineisFilter = ref([]); // Array para armazenar apenas os IDs dos painéis
    const todosPaineis = ref(false); // Checkbox para selecionar todos os painéis

    function paineisLista({identificacao}) {
        return `${identificacao ? identificacao : "???"}`
    }

    // Método para extrair apenas os IDs dos painéis selecionados
    function extrairIdsPaineis() {
        // Verifica se idPaineis não está vazio
        if (idPaineis.value && idPaineis.value.length > 0) {
            // Mapeia o array de painéis para extrair apenas os IDs
            idPaineisFilter.value = idPaineis.value.map(painel => painel.id);
        } else {
            // Se não houver painéis selecionados, define como array vazio
            idPaineisFilter.value = [];
        }
        return idPaineisFilter.value;
    }

    // Observa mudanças no checkbox todosPaineis
    watch(todosPaineis, (novoValor) => {
        if (novoValor) {
            // Se o checkbox estiver marcado, seleciona todos os painéis
            idPaineis.value = [...paineis.value];
        } else {
            // Se o checkbox for desmarcado, limpa a seleção
            idPaineis.value = [];
        }
    });

    onMounted(() => {
        // Procura o ID do ano atual na lista de anos disponíveis
        const anoAtual = new Date().getFullYear(); // Obtém o ano atual
        const anoEncontrado = props.anos.find(ano => ano.ano_bisemana == anoAtual);
        if (anoEncontrado) {
            anoId.value = anoEncontrado.id;
            getBs(); // Chama a função para carregar as bisemanas do ano atual
        }
    })

    function getBs() {
        axios.post('/getBisemanas', {anoId: anoId.value})
            .then((res) => {
                bisemanas.value = res.data;
            })
            .catch((err) => {
                console.log(err);
                toastr.error('Erro ao carregar bisemanas!');
            });
    }

    function getRelatorio() {
        let btn = document.getElementById('gera_rel');
        btn.innerHTML = 'Carregando...';
        // Extrai os IDs dos painéis antes de enviar a requisição
        extrairIdsPaineis();

        if(bsId.value == 0) {
            toastr.error('Selecione a Bi-semana!');
            btn.innerHTML = 'Gerar Relatório';
            return;
        }

        if(idPaineis.value != 0) {
            axios.post('/setRelOcupacao', {
                anoId: anoId.value, 
                bsId: bsId.value,
                idPaineis: idPaineisFilter.value, 
                todosPaineis: todosPaineis.value
            })
                .then(() => {
                   axios.get('/getRelOcupacao')
                        .then(() => {
                            setTimeout(() => {
                                btn.innerHTML = 'Gerar Relatório';
                                window.open('/getRelOcupacao', '_blank');
                            }, 3000);
                        })
                        .catch((err) => {
                            console.log(err);
                            toastr.error('Erro ao gerar relatório!');
                            btn.innerHTML = 'Gerar Relatório';
                        });
                    console.log('paineis IDs', idPaineisFilter.value)
                })
                .catch((err) => {
                    console.log(err);
                    toastr.error('Erro ao processar dados!');
                    btn.innerHTML = 'Gerar Relatório';
                });
        } else {
            toastr.error('Selecione os Painéis!');
            btn.innerHTML = 'Gerar Relatório';
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
                    <h1 class="text-2xl font-bold">Relatório de Ocupação</h1>
                </div>
            </div>

            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body space-y-10">
                    <div class="w-full flex flex-col flex-wrap md:flex-row">
                        <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6">
                            <!-- Ano -->
                            <div class="w-full sm:w-1/12 flex flex-col">
                                <label class="label">
                                    <span class="label-text">Ano</span>
                                </label>
                                <select class="select select-bordered w-full max-w-xs" v-model="anoId" @change="getBs()">
                                    <option value="0" disabled selected>Selecione</option>
                                    <option v-for="ano, index in anos" :key="index" :value="ano.id">{{ ano.ano_bisemana }}</option>
                                </select>
                            </div>

                            <!-- Bi-semana -->
                            <div class="w-full sm:w-[20%] flex flex-col">
                                <div class="flex">
                                    <label class="label">
                                    <span class="label-text">Bi-semana Limite</span>
                                </label>
                                <button class="btn btn-xs bg-white hover:bg-white border-0 tooltip tooltip-right" data-tip="Serão mostrados todos os painéis do ano da primeira BS até a BS limite">
                                    <i class="fa-solid fa-question text-red-700"></i>
                                </button>
                                </div>
                                <div class="flex">
                                    <select class="select select-bordered w-full max-w-xs" v-model="bsId" :disabled="bisemanas.length === 0">
                                        <option value="0" disabled selected>Selecione</option>
                                        <option v-for="bs, index in bisemanas" :key="index" :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString() }} até {{ new Date(bs.fim).toLocaleDateString() }}</option>
                                    </select>
                                    
                                </div>
                            </div>

                            <!-- Checkbox Todos os Painéis -->
                            <div class="w-full sm:w-1/12 flex flex-col justify-start">
                                <div class="form-control">
                                    <label class="label cursor-pointer">
                                        <span class="label-text mr-2">Todos os Painéis</span>
                                    </label>
                                    <input type="checkbox" class="checkbox checkbox-primary mt-3" v-model="todosPaineis" />
                                </div>
                            </div>

                            <!-- Painéis (Novo componente multiselect) -->
                            <div v-if="!todosPaineis" class="w-full sm:w-3/12 flex flex-col">
                                <label class="label">
                                    <span class="label-text">Painéis</span>
                                </label>
                                <multiselect
                                    v-model="idPaineis"
                                    :options="paineis"
                                    :custom-label="paineisLista"
                                    track-by="id"
                                    selectLabel="Enter para selecionar"
                                    deselectLabel="Enter para remover"
                                    :multiple="true"
                                    :close-on-select="false"
                                    :show-labels="true"
                                    :preserve-search="true"
                                    placeholder="Selecione os Painéis"
                                    class="multiselect"
                                    :disabled="todosPaineis"
                                >
                                </multiselect>
                            </div>
            
                        </div>
                    </div>

                    
                    <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6">
                        <!-- Cidade -->
                        <!-- <div class="w-full sm:w-[20%] flex flex-col">
                            <label class="label">
                                <span class="label-text">Cidade</span>
                            </label>
                            <select class="select select-bordered w-full max-w-xs">
                                <option value="0" disabled selected>Todos</option>
                            </select>
                        </div> -->

                        <!-- Região -->
                        <!-- <div class="w-full sm:w-[20%] flex flex-col">
                            <label class="label">
                                <span class="label-text">Região</span>
                            </label>
                            <select class="select select-bordered w-full max-w-xs" v-model="regId" disabled >
                                <option value="0" disabled selected>Todos</option>
                               
                            </select>
                        </div> -->

                        <!-- Bairro -->
                        <!-- <div class="w-full sm:w-[20%] flex flex-col">
                            <label class="label">
                                <span class="label-text">Bairro</span>
                            </label>
                            <select class="select select-bordered w-full max-w-xs" v-model="baiId" disabled>
                                <option value="0" disabled selected>Todos</option>
                                
                            </select>
                        </div> -->

                        
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

