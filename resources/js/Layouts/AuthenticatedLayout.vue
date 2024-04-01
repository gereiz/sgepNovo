<template>
    <div class="w-full flex flex-col h-screen bg-gray-100">
        <!-- <div class="w-full">
            <HeaderApp class="absolute z-10" @MobileOpen="openM = $event">
            </HeaderApp>
        </div> -->

        <div class="w-full flex-col sm:flex-row justify-start">
            <SideMenu :menuMobile="openM" class="absolute sm:relative z-50">
            </SideMenu>
            
            <div class="w-full sm:w-[84.8%] flex ml-0 sm:ml-[15.1%] bg-stone-200 relative z-0 space-x-2">
                <slot />
            </div>
        </div>


    </div>
</template>

<script setup>
import HeaderApp from '@/Components/Layout/HeaderApp.vue';
import SideMenu from '@/Components/Layout/SideMenu.vue';

import { ref, watch } from 'vue';

const openM = ref('');

watch(openM, (val) =>{
    // console.log(val)
})


</script>