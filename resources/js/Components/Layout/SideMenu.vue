<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import VueAvatar from "@webzlodimir/vue-avatar";
import "@webzlodimir/vue-avatar/dist/style.css";
import { usePage } from '@inertiajs/vue3'
import MenuApp from '@/Components/Layout/MenuApp.vue';
import ModalAlteraSenha from '@/Components/Layout/ModalAlteraSenha.vue';
import MenuAppMobile from './MenuAppMobile.vue';

const open = ref(false);

const emit = defineEmits(['collapsed'])
const collapsed = ref(false)
const openSection = ref('')

function toggleCollapse() {
    collapsed.value = !collapsed.value
    localStorage.setItem('sidebar_collapsed', collapsed.value ? 'true' : 'false')
    emit('collapsed', collapsed.value)
}

function onExpandTo(section) {
    collapsed.value = false
    localStorage.setItem('sidebar_collapsed', 'false')
    emit('collapsed', false)
    openSection.value = section
}
onMounted(() => {
    const saved = localStorage.getItem('sidebar_collapsed')
    if (saved === 'true') {
        collapsed.value = true
        emit('collapsed', true)
    }
})


const page = usePage()
const sidebarOpen = ref(false)
const user = computed(() => page.props.auth.user)

function openPi(val)  {
    // console.log(val)
        if(val == 't') {
            open.value = true
        } else
        open.value = false

}

</script>


<template>
    <div>
        <TransitionRoot as="template" :show="sidebarOpen">
        <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
            <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div class="fixed inset-0 flex">
            <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
                <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                        <span class="sr-only">Close sidebar</span>
                        <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                    </div>
                </TransitionChild>
                <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-2 pb-2 ring-1 ring-white/10">
                    <div class="flex h-16 shrink-0 items-center justify-center border-b border-gray-500">
                        <a href="/"><img v-if="!closeMenu" class="w-24 h-9" src="../../../../storage/app/public/img/logo-black.png" alt=""></a>
                    </div>
                    <nav class="flex flex-1 flex-col">
                        <MenuAppMobile/>
                    </nav>
                </div>
                </DialogPanel>
            </TransitionChild>
            </div>
        </Dialog>
        </TransitionRoot>

        <!-- Static sidebar for desktop -->
        <div :class="['hidden md:fixed md:inset-y-0 md:z-50 md:flex md:flex-col transition-all duration-300 ease-in-out', collapsed ? 'md:w-16' : 'md:w-72']">
            <div :class="['flex grow flex-col overflow-y-auto bg-gray-900', collapsed ? 'px-0 gap-y-1' : 'px-6 gap-y-5']">
                <div class="flex h-16 shrink-0 items-center justify-between border-b border-gray-500">
                        <a href="/"><img :class="[collapsed ? 'w-10' : 'w-24 h-9']" src="../../../../storage/app/public/img/logo-black.png" alt=""></a>
                        <button class="btn btn-ghost btn-circle text-white" @click="toggleCollapse">
                            <span class="sr-only">Retract sidebar</span>
                            <Bars3Icon v-if="collapsed" class="h-5 w-5" aria-hidden="true" />
                            <XMarkIcon v-else class="h-5 w-5" aria-hidden="true" />
                        </button>
                </div>
                <nav class="flex flex-1 flex-col">
                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                        <MenuAppMobile :collapsed="collapsed" :openSection="openSection" @expandTo="onExpandTo"/>
                    </li>
                    <li class="-mx-6 mt-auto">
                    <a href="#" class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800">
                        <div class="dropdown dropdown-top dropdown-hover">
                            <vue-avatar :username="user.name" background-color="#ef4444" :size="40"/>
                            <ul tabindex="0" class="min-w-[145px] dropdown-content menu p-2 shadow rounded-box -ms-4">
                                <li>
                                    <a href="https://ibitweb.atlassian.net/servicedesk/customer/portal/1/group/1/create/10" target="_blank">Abrir Chamado</a>
                                </li>
                                <li>
                                    <label @click="openPi('t')">Alterar Senha</label>
                                </li>
                                <li>
                                    <a href="/logout">Sair</a>
                                </li>
                            </ul>
                        </div>
                        <span aria-hidden="true">{{ user.name }}</span>
                    </a>
                    </li>
                </ul>
                </nav>
            </div>
        </div>


        <!-- Menu Mobile -->
        <div class="navbar bg-base-100 sticky top-0 z-40 sm:px-6 md:hidden shadow">
            <button type="button" class="btn btn-ghost btn-circle lg:hidden" @click="sidebarOpen = true">
                <span class="sr-only">Open sidebar</span>
                <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>
            <div class="flex-1 flex justify-center">
                <span class="text-sm font-semibold">{{ user.name }}</span>
            </div>
            <div class="dropdown dropdown-hover">
                <vue-avatar :username="user.name" background-color="#ef4444" :size="40"/>
                <ul tabindex="0" class="min-w-[135px] dropdown-content menu p-2 shadow bg-base-100 rounded-box w-fit -ml-[5.1rem]">
                    <li class="text-sm">
                        <a href="https://ibitweb.atlassian.net/servicedesk/customer/portal/1/group/1/create/10" target="_blank">Abrir Chamado</a>
                    </li>
                    <li class="text-sm">
                        <label @click="openPi('t')">Alterar Senha</label>
                    </li>
                    <li class="text-sm">
                        <a href="/logout">Sair</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <ModalAlteraSenha :openPi="open" :user="user" @closePi="openPi"> </ModalAlteraSenha>
</template>
