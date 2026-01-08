<script setup>
import HeaderApp from '@/Components/Layout/HeaderApp.vue';
import SideMenu from '@/Components/Layout/SideMenu.vue';

import { ref, watch } from 'vue';

const openM = ref('');
const props = defineProps({
    hideHeader: {
        type: Boolean,
        default: false
    }
})
const sidebarCollapsed = ref(false)
function onCollapsed(val){
    sidebarCollapsed.value = val
}

watch(openM, (val) =>{
    // console.log(val)
})


</script>



<template>
    <div class="w-full flex flex-col min-h-screen bg-base-200">
        <div v-if="!props.hideHeader" class="w-full sticky z-50 top-0 hidden sm:flex shadow">
            <HeaderApp class="w-full">
            </HeaderApp>
        </div>

        <div class="w-full flex-col sm:flex-row justify-start" :class="[props.hideHeader ? '' : 'sm:-mt-16']">
            <SideMenu :menuMobile="openM" class="absolute sm:relative z-50" @collapsed="onCollapsed">
            </SideMenu>

            <div class="w-full flex bg-base-200 relative z-0 space-x-2 overflow-x-hidden transition-all duration-300 ease-in-out" :class="[sidebarCollapsed ? 'md:pl-16' : 'md:pl-72']">
                <slot />
            </div>
        </div>
    </div>
</template>
