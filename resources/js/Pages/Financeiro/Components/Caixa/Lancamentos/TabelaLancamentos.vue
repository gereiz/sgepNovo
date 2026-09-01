<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useToastr } from '@/Components/toastr';
import { ref, watch, computed } from 'vue';

import EditLancamento from './EditLancamento.vue';
import DelLancamento from './DelLancamento.vue';

const page = usePage();
const props = defineProps(['centrosCusto', 'lancamentos', 'tipos_lancamento', 'comissoes_por_reserva']);
const toastr = useToastr();


const criaLancamento = page.props.user.permissions.includes('criar lancamento');
const editaLancamento = page.props.user.permissions.includes('editar lancamento');
const excluiLancamento = page.props.user.permissions.includes('excluir lancamento');
const lancamentosL = ref(props.lancamentos)
const lancamento = ref({})

const openEdit = (val) => {
    lancamento.value = val

    const dialog = document.getElementById('edit_lancamento')
    dialog.showModal()

}

const openDelete = (val) => {
    lancamento.value = val

    const dialog = document.getElementById('del_lancamento')
    dialog.showModal()

}

const getLancamentos = () => {
    axios.get('/Lancamentos')
    .then(response => {
        lancamentosL.value = response.data
    }).catch(error => {
        toastr.error('Erro ao buscar Centros de Custo!')
    })
}

watch(() => lancamentosL.value, (val) => {
    getLancamentos()
})


const updateLanc = (val) => {
    lancamentosL.value = lancamentosL.value.filter(lancamento => lancamento.id !== val)
}


const toggleTarget = ref(null)
const confirmOpen = ref(false)
const confirmDtPagamento = ref('')

function formatDateForInput(d) {
    if (!d) return ''
    const date = new Date(d)
    if (isNaN(date.getTime())) return ''
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

function openConfirmToggle(l) {
    toggleTarget.value = l
    const hoje = formatDateForInput(new Date())
    if ((l.status_pagamento || 'PENDENTE') === 'QUITADO') {
        confirmDtPagamento.value = ''
    } else {
        confirmDtPagamento.value = hoje
    }
    confirmOpen.value = true
    setTimeout(() => {
        const dlg = document.getElementById('confirm_toggle_status')
        if (dlg) dlg.showModal()
    }, 10)
}

function closeConfirmToggle() {
    confirmOpen.value = false
    const dlg = document.getElementById('confirm_toggle_status')
    if (dlg) dlg.close()
    toggleTarget.value = null
    confirmDtPagamento.value = ''
}

const isQuitar = computed(() => {
    if (!toggleTarget.value) return false
    return (toggleTarget.value.status_pagamento || 'PENDENTE') !== 'QUITADO'
})

function confirmToggle() {
    if (!toggleTarget.value) return
    const l = toggleTarget.value

    const payload = { id: l.id }
    if (isQuitar.value) {
        if (!confirmDtPagamento.value) {
            toastr.error('Informe a Data Real de Pagamento')
            return
        }
        payload.dt_pagamento_real = confirmDtPagamento.value
    }

    axios.post('/ToggleLancamentoStatus', payload)
        .then((resp) => {
            const novo = resp?.data?.status || ((l.status_pagamento || 'PENDENTE') === 'QUITADO' ? 'PENDENTE' : 'QUITADO')
            l.status_pagamento = novo
            if (resp?.data?.dt_pagamento_real !== undefined) {
                l.dt_pagamento_real = resp.data.dt_pagamento_real
            } else {
                l.dt_pagamento_real = null
            }
            toastr.success('Status atualizado para ' + novo)
            closeConfirmToggle()
        })
        .catch((err) => {
            const msg = err?.response?.data?.msg || 'Falha ao atualizar status'
            toastr.error(msg)
        })
}

function toggleStatus(l) {
    openConfirmToggle(l)
}

</script>


<template>

    <div class="inline-block min-w-full max-h-48 align-middle">
        <table class="min-w-full divide-y divide-gray-300 border table-xs">
            <thead>
            <tr class="divide-x divide-gray-200">
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">ID</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Descrição</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Valor Total</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Valor Liquido</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Vencimento</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Pagamento</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">C. Custo</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Tipo</th>

                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Status</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Obs</th>
                <th scope="col" class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-2">Ações</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
            <tr class="divide-x divide-gray-200" v-for="lancamento in lancamentosL" :key="lancamento.id">
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ lancamento.id }}</td>
                <td class="w-[40%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ lancamento.descricao }}</td>
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">R$ {{ lancamento.valor }}</td>
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">R$ {{ (lancamento.valor - (comissoes_por_reserva[lancamento.id_reserva] || 0)).toFixed(2) }}</td>
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ new Date(lancamento.dt_faturamento).toLocaleDateString() }}</td>
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <span v-if="lancamento.dt_pagamento_real">{{ new Date(lancamento.dt_pagamento_real).toLocaleDateString() }}</span>
                    <span v-else class="opacity-60">—</span>
                </td>
                <td class="w-[10%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-2">{{ lancamento.centro_custo.centro_custo}}</td>

                <td v-if="lancamento.tipo_lancamento.tipo == 'Entrada'" class="w-[5%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <button class="btn btn-sm btn-square btn-success btn-outline text-white tooltip tooltip-left" :data-tip="lancamento.tipo_lancamento.tipo">
                        <i class="fa-solid fa-angles-up"></i>
                    </button>
                </td>
                <td v-else-if="lancamento.tipo_lancamento.tipo == 'Saída'" class="w-[5%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <button class="btn btn-sm btn-square btn-error btn-outline text-white tooltip tooltip-left" :data-tip="lancamento.tipo_lancamento.tipo">
                        <i class="fa-solid fa-angles-down"></i>
                    </button>
                </td>
                <td v-else class="w-[5%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <button class="btn btn-sm btn-square btn-warning btn-outline text-white tooltip tooltip-left" :data-tip="lancamento.tipo_lancamento.tipo">
                        <i class="fa-solid fa-exclamation"></i>
                    </button>
                </td>

                <td class="w-[8%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <span v-if="(lancamento.status_pagamento || 'PENDENTE') === 'QUITADO'" class="badge badge-success">Quitado</span>
                    <span v-else class="badge badge-warning">Pendente</span>
                    <button class="btn btn-xs ml-2" @click="toggleStatus(lancamento)">{{ (lancamento.status_pagamento || 'PENDENTE') === 'QUITADO' ? 'Reabrir' : 'Quitar' }}</button>
                </td>
                <td v-if="lancamento.observacoes" class="w-[5%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <button class="btn btn-sm btn-square btn-success btn-outline text-white tooltip tooltip-left" :data-tip="lancamento.observacoes">
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </button>
                </td>
                <td v-else class="w-[5%] whitespace-nowrap text-center py-4 text-sm font-medium text-gray-900 sm:pl-2">
                    <button class="btn btn-sm btn-square btn-error btn-outline text-white tooltip tooltip-left" data-tip="Nenhuma Observação">
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </button>
                </td>

                <td class="w-[7%] whitespace-nowrap flex p-4 text-sm space-x-2">

                    <button v-if="editaLancamento && lancamento.centro_custo.id != 1" class=" btn btn-sm btn-square btn-warning text-white tooltip tooltip-left" data-tip="Editar" @click="openEdit(lancamento)">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button v-if="excluiLancamento && lancamento.centro_custo.id != 1" class="btn btn-sm btn-square btn-error text-white tooltip tooltip-left" data-tip="Excluir" @click="openDelete(lancamento)">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                    <button v-if="editaLancamento && lancamento.centro_custo.id == 1" class=" btn btn-active btn-sm btn-square btn-default text-white tooltip tooltip-left" data-tip="Lançamentos automáticos de reservas não podem ser editados">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button v-if="excluiLancamento && lancamento.centro_custo.id == 1" class="btn btn-active btn-sm btn-square btn-default text-white tooltip tooltip-left" data-tip="Lançamentos automáticos de reservas não podem ser excluídos">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </td>

            </tr>
            </tbody>
        </table>
    </div>

    <EditLancamento :lancamento="lancamento" :centrosCusto="centrosCusto" :tipos_lancamento="tipos_lancamento" @editLancamento="updateLanc" />

    <DelLancamento :lancamento="lancamento" :centrosCusto="centrosCusto" :tipos_lancamento="tipos_lancamento" @delLancamento="updateLanc" />

    <dialog id="confirm_toggle_status" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div class="w-full flex flex-col items-center p-2">
                <h3 class="text-lg font-bold">
                    {{ isQuitar ? 'Confirmar Quitação' : 'Confirmar Reabertura' }}
                </h3>
                <p class="py-2 text-sm">
                    <template v-if="isQuitar">
                        Informe a Data Real de Pagamento para registrar a quitação deste lançamento.
                    </template>
                    <template v-else>
                        Ao confirmar, o lançamento voltará para o status <b>Pendente</b> e a Data Real de Pagamento será removida.
                    </template>
                </p>
            </div>

            <div class="w-full space-y-4">
                <div v-if="isQuitar" class="w-full">
                    <label class="label">
                        <span class="label-text font-semibold">Data Real de Pagamento</span>
                    </label>
                    <input type="date" v-model="confirmDtPagamento"
                        class="input input-bordered w-full" />
                </div>
            </div>

            <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-2 p-4">
                <button class="w-full sm:w-5/12 btn btn-default bg-slate-400 text-white mt-4" @click="closeConfirmToggle()">
                    Cancelar
                </button>
                <button class="w-full sm:w-5/12 btn" :class="isQuitar ? 'btn-success text-white' : 'btn-warning text-white'" @click="confirmToggle()">
                    {{ isQuitar ? 'Confirmar Quitação' : 'Confirmar Reabertura' }}
                </button>
            </div>
        </div>
    </dialog>

</template>
