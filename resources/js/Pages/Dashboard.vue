<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import CardRegistro from '@/Components/Cards/CardRegistro.vue';


</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <div class="w-full h-screen flex items-center justify-center">

            {{ $page.props }}

        </div>
    </AuthenticatedLayout>
</template>

