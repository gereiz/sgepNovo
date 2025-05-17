<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Head } from '@inertiajs/vue3';
    import { useToastr } from '@/Components/toastr';
    import { ref, reactive, onMounted, computed } from 'vue';
    import Multiselect from 'vue-multiselect'

    const toastr = useToastr();
    const props = defineProps(['anos', 'paineis']); // Adicione 'clientes' aos props

    const bisemanas = ref([]);
    const anoId = ref(0);
    const bsId = ref(0);
    const orient = ref('P');
    const idPaineis = ref([]); // Adicione esta linha
    const paineis = ref(props.paineis || []); // Adicione esta linha
    const idPaineisFilter = ref([]); // Array para armazenar apenas os IDs

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

        if(idPaineis.value != 0) {
            axios.post('/setRelPainelBisemana', {
                anoId: anoId.value, 
                idPaineis: idPaineisFilter.value, // Usa o array filtrado com apenas os IDs
                orient: orient.value
            })
                .then(() => {
                    axios.get('/getRelPainelBisemana')
                        .then(() => {
                            setTimeout(() => {
                                btn.innerHTML = 'Gerar Relatório';
                                window.open('/getRelPainelBisemana', '_blank');
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
                    <h1 class="titulo">Painéis por Bisemana</h1>
                </div>
            </div>

            <div class="card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md">
                <div class="card-body space-y-10">
                    <div class="w-full flex flex-col flex-wrap md:flex-row">
                        <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6">
                            <!-- Cliente -->
                            <div class="w-full sm:w-3/12 flex flex-col">
                                <label class="label">
                                    <span class="label-text">Cliente</span>
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
                                >
                                </multiselect>
                            </div>

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
                            <!-- <div class="w-full sm:w-3/12 flex flex-col">
                                <label class="label">
                                    <span class="label-text">Bi-semana</span>
                                </label>
                                <select class="select select-bordered w-full max-w-xs" v-model="bsId" :disabled="bisemanas.length === 0">
                                    <option value="0" disabled selected>Selecione</option>
                                    <option v-for="bs, index in bisemanas" :key="index" :value="bs.id">BS: {{ bs.num_bisemana }} {{ new Date(bs.inicio).toLocaleDateString() }} até {{ new Date(bs.fim).toLocaleDateString() }}</option>
                                </select>
                            </div> -->
                        </div>
                    </div>

                    <!-- Orientação -->
                    <div class="w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 space-x-6">
                        <div class="w-full sm:w-6/12 flex flex-wrap items-center sm:space-x-4 space-y-6 sm:space-y-0">
                            <div class="w-full sm:w-5/12 flex flex-col">
                                <label class="label">
                                    <span class="label-text">Orientação</span>
                                </label>
                                <select v-model="orient" class="select select-bordered w-full max-w-xs">
                                    <option value="" disabled selected>Selecione</option>
                                    <option value="P">A4 - Retrato</option>
                                    <option value="L">A4 - Paisagem</option>
                                </select>
                            </div>
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