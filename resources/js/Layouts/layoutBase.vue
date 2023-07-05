<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3'
import { useToastr } from '@/Components/toastr';

</script>

<template>
    <Head title=" - " />

    <AuthenticatedLayout>
        <div class="w-full h-screen pt-24 pb-32 mx-2 md:mx-4">
            
        </div>
    </AuthenticatedLayout>
</template>



<!-- <script>
export default {
//   components: { ToastSuccess },
    props: ['bairros', 'regioes', 'teste'],
    data() {
        return{
            nomeBairro: '',
            pesqBairro: '',
            formBairroAdd: {
                nome: null,
                regiao_id: null
            },
            formBairroEdit: {
                nome_edit: null,
                id_bairro: null
            },
            closeToast: false
        }
    },

    methods: {
        setBairroData(id, d) {
            this.nomeBairro = d
            this.formBairroEdit.nome_edit = d
            this.formBairroEdit.id_bairro = id
        },

        cadastraBairro() {
            router.post('/AddBairro', this.formBairroAdd)
            this.formBairroAdd.nome = ''
            this.formBairroAdd.regiao_id = 0
        },
        
        editaBairro() {
            router.post('/EditBairro', this.formBairroEdit)

        },

        deletaBairro() {
            router.post('/DelBairro', this.formBairroEdit)

        },

    },

    computed: {
        bairrosFiltrados() {
            
            let bairrosFiltrados = Object.values(this.bairros).filter((bairro) => {
                return (
                    bairro.nome.toLowerCase().indexOf(this.pesqBairro.toLowerCase()) > -1
                );
            })

            return bairrosFiltrados;
        },
    },
               
    onMounted() {
        toastr.info('Sucesso');
    },

    watch: {
        teste() {
            console.log(this.teste)
        }
    },

}

</script> -->