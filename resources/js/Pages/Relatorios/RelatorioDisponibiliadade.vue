<script setup>
    import { ref, reactive, onMounted, computed, watch } from 'vue'
    import html2pdf from 'html2pdf.js'

    const props = defineProps(['ambiente', 'paineisChecked', 'idBisemana', 'disp'])

    let link = ref('')

    const getLink = (lat, lon) => {

        link = 'https://maps.google.com/?q='+lat+','+lon

        return link
    }

    function getImage(i) {

        if(props.ambiente == 'local') {
            // Desenvolvimento
            var image = 'http://[::1]:5173/storage/app/public/'+ i 

        } else {
            // Produção
            var image = '/storage/'+ i 
        }

        return image
    }

    // function getPDF() {

    //     // this.relPDF = true
    //         var element = document.getElementById('pdf-relatorio');
    //         var opt = {
    //             margin:       0,
    //             filename:     'Relatorio_Sintetico.pdf',
    //             image:        { type: 'jpeg', quality: 0.98 },
    //             html2canvas:  { scale: 3},
    //             jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    //             pagebreak: { mode: 'avoid-all', before: '#page2el' }
    //         };
    //         html2pdf().set(opt).from(element).save();
    //         // html2pdf(element, opt);

    //         setTimeout(() => {
    //             // this.relPDF = false
    //         }, 1000);
        
    // }

    watch(()  => props.disp, (val) => {
        getPDF()
        
    })
</script>

<template>
    <input type="checkbox" id="modal-download" class="modal-toggle" />
    <div class="modal flex items-end md:items-center">
        <div class="modal-box modal-big" id="pdf-relatorio">
            <div class="flex mb-4 space-y-4">
                <label for="modal-download" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>

                <!-- cabeçalho -->
                <div class="w-[99%] h-32 flex flex-col bg-slate-300">
                    <div class="w-full h-full text-center mt-8 ml-8">
                        <img class="w-20 sm:w-36" src="../../../../storage/app/public/img/logo.png" alt="Logo">
                    </div>

                    <div class="w-full h-full text-center -mt-20">
                        <span class="font-bold text-lg">Painéis Disponíveis</span>
                    </div>

                    <div class="w-full h-full text-center">
                        <span class="font-bold text-lg">Bi-semana: XX - 01/01/2023  à 31/01/2023</span>
                    </div>
                </div>
            </div>
            <div class="text-center">
                <span class="text-2xl font-bold text-red-700 underline">Esta disponibilidade está sujeita a alteração, sem aviso prévio.</span>
            </div>
            
            <!-- Cards -->
            <div v-for="(pain, index) in paineisChecked"  :key="index" class="card w-full bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4">
                <div class="card-body">
                    <!-- Identificação -->
                    <div class="w-full h-8 flex justify-center items-center bg-slate-200 text-center">
                        <span class="font-bold text-xl">Identificação: {{pain.identificacao}}</span> 
                    </div>

                    <div class="w-full flex flex-col items-center">
                        <div class="w-full flex mb-4 -ml-4">
                            <div class="w-8/12 flex flex-col justify-center space-y-4 ms-10">
                                <span><a class="font-bold text-red-500">Localização:</a>  {{ pain.logradouro }}, nº{{ pain.numero }} - B. {{ pain.bnome }} / {{ pain.cnome }}</span>
                                <span><a class="font-bold text-red-500">Coordenadas </a> <a :href="getLink(pain.latitude, pain.longitude)" target="_blank">Ver localização no mapa</a></span>
                            </div>

                            <div class="w-4/12 flex justify-end mt-4">
                                <img class="max-w-[300px]" :src="getImage(pain.image_url)" alt="Bairro">
                            </div>
                            
                        </div>
                    
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>