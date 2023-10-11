<template>
    <div class="flex">
        <div class="md:w-8/12 h-screen group md:flex md:flex-row items-center justify-center hidden">
            <div class="z-0 w-8/12 absolute h-screen bg-hero bg-cover opacity-30 group-hover:opacity-75 transform transition-all duration-1000">

            </div>
            <div class="z-10 group-hover:text-white transition-all duration-1000">
                <p class="text-[4rem] text-center font-extrabold">Sistema de Gerenciamento de Espaços Publicitários</p>
            </div>
        </div>

        <div class="w-full md:w-4/12 hover:bg-stone-100 h-screen flex flex-col justify-center items-center transition-all duration-1000">
            <form @submit.prevent="submit" class="w-full h-full flex flex-col justify-center items-center">
                <div class="w-full h-full flex flex-col justify-center items-center">
                    <img src="../../../../storage/app/public/img/logo1.png" class="w-32 mb-10" alt="Logo">
                    <div class="w-11/12 md:w-8/12 flex flex-col items-start">
                        <InputLabel class="float-right" for="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            class="w-full h-[3.5rem] mt-1 block mb-10"
                            v-model="form.email"
                            required
                            autofocus
                            autocomplete="username"
                        />
                        <InputError class="mt-2" :message="form.errors.email" />
                    

                        <InputLabel for="password" value="Senha" />
                        <TextInput
                            id="password"
                            type="password"
                            class="w-full h-[3.5rem] mt-1 block"
                            v-model="form.password"
                            required
                            autocomplete="current-password"
                        />
                        <InputError class="mt-2" :message="form.errors.password" />
                        
                    </div>

                    <!-- <div class="block mt-4">
                        <label class="flex items-center">
                            <Checkbox name="remember" v-model:checked="form.remember" />
                            <span class="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                    </div> -->

                    <div class="w-11/12 md:w-8/12 flex items-end justify-end mt-10">
                        <!-- <Link
                            v-if="canResetPassword"
                            :href="route('password.request')"
                            class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Forgot your password?
                        </Link> -->

                        <button class="w-full btn bg-cor-primaria hover:bg-sky-600 hover:border-white transition-all duration-1000" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                            Entrar
                        </button>
                    </div>
                </div>

            
            </form>
        </div>
    </div>
</template>

<script setup>
    import Checkbox from '@/Components/old/Checkbox.vue';
    import GuestLayout from '@/Layouts/GuestLayout.vue';
    import InputError from '@/Components/old/InputError.vue';
    import InputLabel from '@/Components/old/InputLabel.vue';
    import PrimaryButton from '@/Components/old/PrimaryButton.vue';
    import TextInput from '@/Components/old/TextInput.vue';
    import { Head, Link, useForm } from '@inertiajs/vue3';

    defineProps({
        canResetPassword: {
            type: Boolean,
        },
        status: {
            type: String,
            type: String,
        },
    });

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = () => {
        form.post(route('login'), {
            onFinish: () => form.reset('password'),
        });

        
    };
</script>
