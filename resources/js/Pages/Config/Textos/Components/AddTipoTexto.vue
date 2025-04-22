<script setup>
import { ref, watch, shallowRef } from 'vue'
import { useToastr } from '@/Components/toastr.js';
import Swal from 'sweetalert2';


import { XMarkIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'


const toastr = useToastr();

const props = defineProps(['openTipo', 'tipoTexto'])
const emit = defineEmits(['closeAdd'])



const open = ref(false)

const nome = ref('')
const descricao = ref('')
const tipoTexto = ref({})

watch( () => props.openTipo, (val) =>  {
    if(val === true) {
        open.value = true
    } else {
        open.value = false
    }
})

watch( () => props.tipoTexto, (val) =>  {
    if(val !== 0) {
        tipoTexto.value = val
        nome.value = tipoTexto.value.nome
        descricao.value = tipoTexto.value.descricao
        
    } 
})

function closeM() {
    open.value  = false
    emit('closeAdd', open.value)
}

function AddOrEditTipoTexto() {
    // Verifica se é uma atualização (se já existe um ID)
    const isUpdate = tipoTexto.value && tipoTexto.value.id;
    
    // Se for atualização, mostra confirmação
    if (isUpdate) {
        Swal.fire({
            title: 'Confirmação',
            text: 'Já existe um tipo de texto com este nome. O registro será atualizado em vez de criar um novo. Deseja continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, atualizar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                saveData();
            }
        });
    } else {
        // Verifica se já existe um tipo com o mesmo nome
        axios.post('/verificaTipoTexto', {
            nome: nome.value
        })
        .then((response) => {
            if (response.data && response.data.exists) {
                Swal.fire({
                    title: 'Confirmação',
                    text: 'Já existe um tipo de texto com este nome. O registro será atualizado em vez de criar um novo. Deseja continuar?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim, atualizar!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        saveData();
                    }
                });
            } else {
                saveData();
            }
        })
        .catch((error) => {
            console.error(error);
            saveData(); // Em caso de erro na verificação, tenta salvar mesmo assim
        });
    }
}

function saveData() {
    axios.post('/addOrEditTipoTexto', {
        id: tipoTexto.value.id,
        nome: nome.value,
        descricao: descricao.value
    })
    .then((response) => {
        toastr.success('Tipo de texto ' + (tipoTexto.value.id ? 'atualizado' : 'adicionado') + ' com sucesso!')
        nome.value = ''
        descricao.value = ''
        closeM() 
        
        setTimeout(() => {
            window.location.reload()
        }, 2000);
        
    })
   .catch((error) => {
        toastr.error('Erro ao ' + (tipoTexto.value.id ? 'atualizar' : 'adicionar') + ' tipo de texto!')
        nome.value = ''
        descricao.value = ''
        // closeM()
        console.log(error);
   })
}


</script>

<template>

    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="open = false, closeM()">
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div class="sm:flex flex-col sm:items-start">
                  <div class="w-full mt-3 text-center sm:mt-0 sm:text-left">

                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h1 as="h3" class="text-base font-semibold leading-6 text-gray-900">Tipo de texto</h1>
                        <div class="w-full flex mt-2 ">
                            <p class="w-full text-sm text-gray-500 mb-4 text-center">Adicione um novo tipo de texto.</p>
                        </div>
                    </div>
                    <!-- Nome do tipo de texto -->
                    <div class="sm:col-span-4">
                        <div class="mt-2">
                            <div class="flex bg-gray-100 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                                <input type="text" placeholder="Nome do tipo de texto" v-model="nome"
                                    class="h-9 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 
                                         placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                    <!-- Descrição -->
                    <div class="w-full flex mt-10">
                        <textarea v-model="descricao" class="w-full bg-gray-100 textarea textarea-bordered" placeholder="Descrição"></textarea>
                    </div>
                    <!-- Botões -->
                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <label class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" @click="AddOrEditTipoTexto()">Adicionar</label>
                        <label class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="closeM">Cancelar</label>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
    </Dialog>
  </TransitionRoot>
</template>

