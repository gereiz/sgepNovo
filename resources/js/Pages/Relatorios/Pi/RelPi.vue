<script setup>
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import { Head } from '@inertiajs/vue3';
    import { useToastr } from '@/Components/toastr';
    import { ref, reactive, onMounted, computed } from 'vue';
    import { defineProps } from 'vue';
    import html2pdf from 'html2pdf.js';

    const props = defineProps(['clientes', 'anos']);

    onMounted(() => {
        
    });

    function pdf() {
        const element = document.getElementById('rel-pi');
        const opt = {
            // margin: 1,
            filename: 'myfile.pdf',
            // image: { type: 'jpeg', quality: 0.98 },
            // html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        html2pdf().from(element).set(opt).save();
    }

</script>


<template>
    <div id="rel-pi" class="w-full h-screen">
        <header class="bg-white border-b-2">
            <div class="w-full flex px-4 sm:px-6 lg:px-8">
                <div class="w-2/12 flex items-center">
                    <img class="w-[90%]" src="../../../../../storage/app/public/img/logo.png" alt="logo">
                </div>
                <div class="w-8/12 flex flex-col justify-center items-center my-2">
                    <p>EQUIPE COUNICAÇÃO LTDA - RUA OLEGÁRIO MACIEL, 922 - CENTRO</p>
                    <p>TEL (33) 3271-1040 / (33) 98802-0526</p>
                    <p>CEP - 35010-200 - contato@equipepropaganda.com.br - Governador Valadares - MG</p>
                    <p>CNPJ - 02.777.922/0001-35 - Insc Municipal: 038-537-7 - Insc Estadual: Isenta</p>
                    <h2 class="font-bold text-xl mt-2">PEDIDO DE INSERÇÃO</h2>
                </div>
                <div class="w-2/12 flex flex-col items-center justify-center border-l-2">
                    <p class="font-bold text-6xl">PI</p>
                    <p class="font-bold text-6xl">0001</p>
                </div>
            </div>
        </header>

        <div class="w-full flex items-center justify-center mt-10">
            <button class="btn" @click="pdf()">
                Gerar PDF
            </button>
        </div>

    </div>
</template>

