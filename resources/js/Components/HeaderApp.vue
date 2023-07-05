<template>
  <div class="w-full h-20 flex bg-white shadow-sm">
    <div @click="openMobile" class="w-6/12 md:w-10/12 h-full flex items-center ml-4">
      <i class="fa-solid fa-bars text-3xl"></i>
    </div>

    <div class="w-6/12 md:w-2/12 h-full flex justify-end space-x-4 mr-4 items-center">
        <p class="text-sm">Usuário</p>

        <div class="dropdown dropdown-hover">
          <img tabindex="0" class="w-14 md:w-20" src="../../../storage/app/public/img/user.png" alt="User">
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-fit ">
            <li><a href="/logout">Sair</a></li>
            <!-- <li><a>Item 2</a></li> -->
          </ul>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
        return {
          openMob: true
        }
    },

    methods: {
      openMobile() {
          this.openMob = false
          this.$emit('MobileOpen', this.openMob)

        setTimeout(() => {
          this.openMob = ''
          this.$emit('MobileOpen', this.openMob)
        }, 500);

        
      },
      
    }
  }   

</script>

