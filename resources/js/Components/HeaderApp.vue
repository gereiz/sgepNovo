<script setup>
  import { ref, computed } from 'vue'
  import { usePage } from '@inertiajs/vue3'
  import VueAvatar from "@webzlodimir/vue-avatar";
  import "@webzlodimir/vue-avatar/dist/style.css";

  const page = usePage()
  const emit = defineEmits(['MobileOpen']);
  const user = computed(() => page.props.auth.user)

  const openMob = ref(true)

  function openMobile() {
    openMob.value = false
    emit('MobileOpen', openMob.value)

    setTimeout(() => {
      openMob.value = ''
      emit('MobileOpen', openMob.value)
    }, 500);

    
  }


</script>

<template>
  <div class="w-full h-20 flex bg-white shadow-sm">
    <div @click="openMobile" class="w-6/12 md:w-10/12 h-full flex items-center ml-4">
      <i class="fa-solid fa-bars text-3xl"></i>
    </div>

    <div class="w-6/12 md:w-2/12 h-full flex justify-end space-x-4 mr-4 items-center">
        <p class="text-sm sm:text-base text-gray-600 font-bold">{{user.name}}</p>

        <div class="dropdown dropdown-hover">
          <vue-avatar :username="user.name" />
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-fit -ms-4">
            <li><a href="/logout">Sair</a></li>
            <!-- <li><a>Item 2</a></li> -->
          </ul>
        </div>
    </div>
  </div>
</template>


