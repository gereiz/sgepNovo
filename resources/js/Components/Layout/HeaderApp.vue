
<script setup>
import { ref, computed } from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import VueAvatar from "@webzlodimir/vue-avatar";
import "@webzlodimir/vue-avatar/dist/style.css";
import { usePage } from '@inertiajs/vue3' 
import MenuApp from '@/Components/Layout/MenuApp.vue';
import ModalAlteraSenha from '@/Components/Layout/ModalAlteraSenha.vue';

const open = ref(false);
const page = usePage()
const user = computed(() => page.props.auth.user)
const searchQuery = ref('')

function openPi(val)  {
    // console.log(val)
        if(val == 't') {
            open.value = true
        } else 
        open.value = false
         
}
</script>



<template>
  <Disclosure as="nav" class="w-full bg-gray-800" v-slot="{ open }">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
          <a href="/"><img class="block h-8 w-auto lg:hidden" src="../../../../storage/app/public/img/logo-black.png" alt="Equipe Comunicação" /></a>  
           <a href="/"><img class="hidden h-8 w-auto lg:block" src="../../../../storage/app/public/img/logo-black.png" alt="Equipe Comunicação" /></a> 
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="menu menu-horizontal">
              <MenuApp/>
            </div>
          </div>
        </div>
        <div class="flex-1 px-4 hidden sm:block">
          <div class="form-control">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar..."
              class="input input-bordered w-full max-w-md"
            />
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex items-center">
            <button type="button" class="btn btn-ghost btn-circle">
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Profile dropdown -->
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton class="flex rounded-full text-sm">
                  <span class="sr-only">Open user menu</span>
                  <vue-avatar :username="user.name" background-color="#ef4444" :size="40"/>
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-base-100 py-1 shadow-lg ring-1 ring-base-300 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                    <a href="https://ibitweb.atlassian.net/servicedesk/customer/portal/1/group/1/create/10" 
                      :class="[active ? 'bg-base-200' : '', 'block px-4 py-2 text-sm']"
                      target="_blank">
                      Abrir Chamado
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <label @click="openPi('t')"
                      :class="[active ? 'bg-base-200' : '', 'block px-4 py-2 text-sm']" >
                      Alterar senha
                  </label>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a href="/logout" :class="[active ? 'bg-base-200' : '', 'block px-4 py-2 text-sm']">Sair</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div class="-mr-2 flex sm:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton class="btn btn-ghost btn-circle">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <DisclosureButton as="a" href="#" class="btn btn-ghost w-full justify-start">Dashboard</DisclosureButton>
        <DisclosureButton as="a" href="#" class="btn btn-ghost w-full justify-start">Team</DisclosureButton>
        <DisclosureButton as="a" href="#" class="btn btn-ghost w-full justify-start">Projects</DisclosureButton>
        <DisclosureButton as="a" href="#" class="btn btn-ghost w-full justify-start">Calendar</DisclosureButton>
      </div>
      <div class="divider pb-3 pt-4">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
          </div>
          <div class="ml-3">
            <div class="text-base">Tom Cook</div>
            <div class="text-sm text-base-content/70">tom@example.com</div>
          </div>
          <button type="button" class="btn btn-ghost btn-circle ml-auto">
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <DisclosureButton as="a" href="#" class="btn btn-ghost w-full justify-start">Your Profile</DisclosureButton>
          <DisclosureButton as="a" href="#" class="btn btn-ghost w-full justify-start">Settings</DisclosureButton>
          <DisclosureButton as="a" href="#" class="btn btn-ghost w-full justify-start">Sign out</DisclosureButton>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>

  <ModalAlteraSenha :openPi="open" :user="user" @closePi="openPi"> </ModalAlteraSenha>
</template>
