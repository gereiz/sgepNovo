<script setup>
import NavbarApp from '@/Components/Layout/NavbarApp.vue';
</script>

<template>
    <div class="w-full flex flex-col min-h-screen bg-base-200 antialiased">
        <NavbarApp />

        <!-- Spacer no mobile (h-14 = 56px) para o navbar fixo;
             no desktop (sm+), compensa os pt-20/pt-24 das telas legadas do Vue -->
        <div class="w-full flex-1 flex ml-0 bg-base-200 relative z-0 pt-14 sm:pt-0 sm:-mt-6">
            <slot />
        </div>
    </div>
</template>
