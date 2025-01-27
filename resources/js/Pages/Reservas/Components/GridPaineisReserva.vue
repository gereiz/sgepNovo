<script setup>
import { Head, usePage } from '@inertiajs/vue3';
import { ref, reactive, watch } from 'vue';
import { useToastr } from '@/Components/toastr';

const props = defineProps(['reservas']);
const emit = defineEmits(['paineisChecked', 'paineisCheckedId', 'itemRefs']);

const itemRefs = ref([])
const checkedPaineis = ref([]);
const checkedPaineisId = ref([]);

function isChecked(val, painelId, id) {
    const cardPainel = itemRefs.value[val];

    let classes = cardPainel.classList

    if(Object.values(checkedPaineis.value).includes(painelId)) {
        checkedPaineis.value.splice(checkedPaineis.value.indexOf(painelId), 1)
        checkedPaineisId.value.splice(checkedPaineis.value.indexOf(id), 1)
        cardPainel.checked = false

        emit('paineisChecked', checkedPaineis.value);
        emit('paineisCheckedId', checkedPaineisId.value);
        emit('itemRefs', itemRefs.value);
        // console.log(checkedPaineis.value)

    } else {
        checkedPaineis.value.push(painelId);
        checkedPaineisId.value.push(id);
        cardPainel.checked = true

        emit('paineisChecked', checkedPaineis.value);
        emit('paineisCheckedId', checkedPaineisId.value);
        emit('itemRefs', itemRefs.value);
        // console.log(checkedPaineis.value)

    }


}

function getImage(i) {

    if(props.ambiente == 'local') {
        // Desenvolvimento
        var image = 'http://localhost:8000/storage/'+ i

    } else {
        // Produção
        var image = '/storage/'+ i
    }

    return image
}

</script>

<template>
    <div class="w-full flex flex-wrap items-center justify-center">
        <!-- Cards dos Paineis -->
        <div v-for="(res, index) in reservas" :key="index"
             class="w-full lg:w-[22vw] h-[38vh] card flex bg-base-100 border border-gray-200 shadow-xl m-2 hover:scale-110 transition-all duration-500">
            <div class="flex" :id="index" @click="isChecked(index, res.identificacao, res.id)">
                <div class="w-full flex flex-col flex-wrap">
                    <div class="relative w-full mb-3">
                        <!-- Checkbox -->
                        <input type="checkbox" ref="itemRefs" class="absolute top-2 left-2 border-0 checkbox checkbox-success z-20" />
                        <!-- Imagem -->
                        <img class="w-full h-[25vh] object-cover rounded-t-xl z-10" :src="getImage(res.image_url)" alt="Foto-painel">
                    </div>
                    <div class="w-full flex justify-around px-2 mb-2">
                        <span class="font-bold text-md text-red-500">Painel:
                            <span class="font-extrabold text-md text-black"> {{ res.identificacao }} </span>
                        </span>
                        <span class="font-extrabold text-md">
                            {{ res.nome_fantasia ? res.nome_fantasia : res.razao_social }}
                        </span>
                    </div>

                    <div class="w-full flex justify-around px-2 mb-3">
                        <span class="font-bold text-md text-red-500">Campanha:
                            <button v-if="res.campanha" class="btn btn-xs btn-square btn-outline text-success tooltip tooltip-left" :data-tip="res.campanha">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </button>
                            <button v-else class="btn btn-xs btn-square btn-outline text-warning tooltip tooltip-left" data-tip="Sem dados de campanha">
                                <i class="fa-solid fa-triangle-exclamation" ></i>
                            </button>
                        </span>
                        <span class="font-bold text-md text-red-500">OBS.:
                           <button v-if="res.obs" class="btn btn-xs btn-square btn-outline text-success tooltip tooltip-left" :data-tip="res.obs">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </button>
                            <button v-else class="btn btn-xs btn-square btn-outline text-warning tooltip tooltip-left" data-tip="Sem Observações">
                                <i class="fa-solid fa-triangle-exclamation" ></i>
                            </button>
                        </span>
                    </div>

                    <div class="w-full flex justify-around px-2 mb-3">
                        <span class="font-bold text-sm ">Reservado por:
                            {{ res.user_name }}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>

</style>
