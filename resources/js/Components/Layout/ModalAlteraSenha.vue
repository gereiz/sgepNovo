<script setup>
import { ref, watch, shallowRef } from 'vue'
import { useToastr } from '@/Components/toastr';
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useForm } from '@inertiajs/vue3'

const toastr = useToastr();

const emit = defineEmits(['closePi'])

const props = defineProps(['openPi', 'user'])
const open = ref(false)

const username = ref(props.user.name)

const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

function sendForm() {
    axios.post('/alteraSenha', {
        current_password: form.current_password,
        new_password: form.password,
        password_confirmation: form.password_confirmation
    })
    .then( res => {
        toastr.success('Senha alterada com sucesso!')
        open.value = false
        closeM()
    })
    .catch( err => {
        toastr.error('Erro ao alterar senha!')
    })
}

function closeM() {
    open.value  = false
    emit('closePi', open.value)

    form.password = ''
    form.password_confirmation = ''
}

watch( () => props.openPi, (val) =>  {
    if(val === true) {
        open.value = true
    }
})





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
                        <DialogTitle class="text-lg font-medium leading-6 text-gray-900">Alterar Senha</DialogTitle>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                            Digite a nova senha e confirme.
                            </p>
                        </div>
                        </div>
                    </div>
                    <DialogPanel class="mt-5">
                        <form action="#" method="POST">
                        <div class="grid grid-cols-1 gap-6">
                            
                            <div class="w-full flex flex-wrap space-y-4 sm:space-y-0 justify-between">
                                <div class="w-full sm:w-5/12">
                                    <label for="password" class="block text-sm font-medium text-gray-700">Usuário</label>
                                    <div class="mt-1">
                                        <input type="text" disabled :value="username" name="username" id="username" autocomplete="username" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                </div>
                                <div class="w-full sm:w-5/12">
                                    <label for="password" class="block text-sm font-medium text-gray-700">Senha Atual</label>
                                    <div class="mt-1">
                                        <input type="password" v-model="form.current_password" name="password" id="password" autocomplete="current-password" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                </div>
                            </div>

                            
                            <div class="w-full flex flex-wrap space-y-4 sm:space-y-0 justify-between">
                                <div class="w-full sm:w-5/12">
                                    <label for="password" class="block text-sm font-medium text-gray-700">Nova Senha</label>
                                    <div class="mt-1">
                                        <input type="password" v-model="form.password"  name="password" id="password" autocomplete="new-password" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                </div>
                                <div class="w-full sm:w-5/12">
                                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirme a Senha</label>
                                    <div class="mt-1">
                                        <input type="password" v-model="form.password_confirmation" name="password_confirmation" id="password_confirmation" autocomplete="new-password" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button type="button" @click="sendForm" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Salvar
                            </button>
                            <button type="button" @click="open = false, closeM()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                                Cancelar
                            </button>
                        </div>
                        </form>
                    </DialogPanel>
                </DialogPanel>
            </TransitionChild>
          </div>
        </div>
    </Dialog>
  </TransitionRoot>
</template>
