<script setup>
import { ref, computed } from 'vue'
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
import MenuApp from '@/Components/MenuApp.vue';


const page = usePage()
const sidebarOpen = ref(false)
const user = computed(() => page.props.auth.user)


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
                <!-- Sidebar component, swap this element with another sidebar if you like -->
                <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-2 pb-2 ring-1 ring-white/10">
                    <div class="flex h-16 shrink-0 items-center justify-center border-b border-gray-500">
                        <a href="/"><img v-if="!closeMenu" class="w-24 h-9" src="../../../storage/app/public/img/logo-black.png" alt=""></a>
                    </div>
                    <nav class="flex flex-1 flex-col">
                        <MenuApp/>
                    </nav>
                </div>
                </DialogPanel>
            </TransitionChild>
            </div>
        </Dialog>
        </TransitionRoot>

        <!-- Static sidebar for desktop -->
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
                <div class="flex h-16 shrink-0 items-center justify-center border-b border-gray-500">
                        <a href="/"><img v-if="!closeMenu" class="w-24 h-9" src="../../../storage/app/public/img/logo-black.png" alt=""></a>
                </div>
                <nav class="flex flex-1 flex-col">
                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                        <MenuApp/>
                    </li>
                    <li class="-mx-6 mt-auto">
                    <a href="#" class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800">
                        <div class="dropdown dropdown-top dropdown-hover">
                            <vue-avatar :username="user.name" background-color="#ef4444" :size="40"/>
                            <ul tabindex="0" class="dropdown-content menu p-2 shadow rounded-box w-fit -ms-4">
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
        <div class="sticky w-screen h-full top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-6 shadow-sm sm:px-6 md:hidden">
            <button type="button" class="-m-2.5 p-2.5 text-gray-400 lg:hidden" @click="sidebarOpen = true">
                <span class="sr-only">Open sidebar</span>
                <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>
            <div class="w-9/12 flex justify-center text-sm font-semibold leading-6 text-white">
                {{ user.name }}
            </div>
            <div class="dropdown dropdown-hover">
                <vue-avatar :username="user.name" background-color="#ef4444" :size="40"/>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-fit -ms-4">
                    <li>
                        <a href="/logout">Sair</a>
                    </li>
                </ul>
            </div>
        </div>

        <main class="sm:pl-[14.1rem]">
        <div class="px-4 sm:px-6 lg:px-8">
            <!-- Your content -->
        </div>
        </main>
    </div>
</template>