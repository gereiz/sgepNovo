<script setup>
import HeaderApp from '@/Components/Layout/HeaderApp.vue';
import SideMenu from '@/Components/Layout/SideMenu.vue';

import { ref, watch } from 'vue';

const openM = ref('');

watch(openM, (val) =>{
    // console.log(val)
})


</script>


<template>
    <div class="w-full flex flex-col min-h-screen bg-base-200">
        <div class="w-full sticky z-50 top-0 hidden sm:flex shadow">
            <HeaderApp class="w-full">
            </HeaderApp>
        </div>

        <div class="w-full flex-col sm:flex-row justify-start sm:-mt-16">
            <SideMenu :menuMobile="openM" class="absolute sm:relative z-50">
            </SideMenu>

            <div class="w-full flex ml-0 bg-base-200 relative z-0 space-x-2">
                <slot />
            </div>
        </div>
    </div>
</template>
