<script setup>

const props = defineProps(['title', 'link'])

</script>

<template>
      <a :href="props.link" class="card w-full md:w-[17vw] h-32 md:mx-0 bg-base-200 rounded-xl
                                    border border-gray-300 shadow-xl mt-4 md:mr-4 hover:scale-105 transition-all duration-500 ease-in-out">
            <label for="modal-cliente">
                <div class="card-body">
                    <div class="w-full flex justify-center items-center md:justify-start mb-4 md:mb-0">
                            <img class="w-14" src="../../../../storage/app/public/img/settings.png" alt="Cliente">
                            <p class="flex font-semibold justify-center items-center text-xl md:text-base text-gray-600">{{title}}</p>
                    </div>
                </div>
            </label>
        </a>
</template>