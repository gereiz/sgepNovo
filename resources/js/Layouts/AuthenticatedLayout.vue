<template>
    <div class="w-full flex flex-col h-screen bg-gray-100">
        <div class="w-full">
            <HeaderApp class="absolute z-10" @MobileOpen="openM = $event">
            </HeaderApp>
        </div>

        <div class="w-full flex flex-row justify-start">
            <SideMenu :menuMobile="openM" class="absolute md:relative z-50">
            </SideMenu>
            
            <div class="w-full flex ml-0 bg-stone-100 relative z-0 space-x-2">
                <slot />
            </div>
        </div>


    </div>
</template>

<script setup>
import HeaderApp from '@/Components/HeaderApp.vue';
import SideMenu from '@/Components/SideMenu.vue';

import { ref, watch } from 'vue';

const openM = ref('');

watch(openM, (val) =>{
    // console.log(val)
})


</script>