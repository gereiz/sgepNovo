<template>
    <div class="open-menu transition-all duration-1000" :class="{close: closeMenu}">
        <div class="w-full h-20 flex border-b border-gray-600 shadow-sm">
            <div  class="w-10/12 flex justify-center items-center">
                <a href="/"><img v-if="!closeMenu" class="w-24 h-9" src="../../../storage/app/public/img/logo-black.png" alt=""></a>
            </div>

            <div @click="closeMenu = !closeMenu" class="w-2/12 flex justify-end items-center mr-3">
                <i class="fa-solid fa-bars text-white text-3xl"></i>
            </div>
        </div>

        <div>
            <menuApp :showText="closeMenu"></menuApp>

        </div>

    </div>

    
</template>

<script>
import MenuApp from '@/Components/MenuApp.vue';
export default {
  components: { MenuApp },
    props: ['menuMobile'],
    data() {
        return {
            closeMenu: true
        }
    },
 
    watch: {
        menuMobile() {
            this.closeMenu = this.menuMobile
        }
    }
}   
</script>
