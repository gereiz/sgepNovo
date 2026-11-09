<template>
    <div class="flex">
        <div class="md:w-8/12 h-screen group md:flex md:flex-row items-center justify-center hidden">
            <div class="z-0 w-8/12 absolute h-screen bg-hero bg-cover  bg-center opacity-30 group-hover:opacity-75 transform transition-all duration-1000">

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

                        <button @click.prevent="submit" type="button" class="w-full btn btn-primary text-white" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
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
    import axios from 'axios';

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

    const submit = async () => {
        console.log('[LOGIN] submit disparado. email=', form.email, 'senha_len=', (form.password||'').length);
        if (form.processing) { console.log('[LOGIN] já em processamento, saindo.'); return; }
        form.processing = true;
        try {
            let token = '';
            const csrfMeta = document.head.querySelector('meta[name="csrf-token"]');
            if (csrfMeta && csrfMeta.content) token = csrfMeta.content;
            if (!token) {
                const csrfCookie = document.cookie.split(';').map(s => s.trim()).find(s => s.startsWith('XSRF-TOKEN='));
                if (csrfCookie) token = decodeURIComponent(csrfCookie.split('=')[1] || '');
            }
            console.log('[LOGIN] csrf token len=', (token||'').length, 'from=', csrfMeta && csrfMeta.content ? 'meta' : (token ? 'cookie' : 'none'));
            const payload = new URLSearchParams();
            if (token) payload.append('_token', token);
            payload.append('email', form.email);
            payload.append('password', form.password);
            payload.append('remember', form.remember ? '1' : '0');
            const resp = await window.axios.post('/login', payload.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true,
                maxRedirects: 0,
                validateStatus: status => (status >= 200 && status < 400) || status === 302 || status === 419 || status === 422
            });
            console.log('[LOGIN] axios status=', resp.status, 'statusText=', resp.statusText, 'headers=', JSON.stringify(Object.keys(resp.headers||{})));
            let redirectTo = resp.headers && (resp.headers['x-inertia-location'] || resp.headers['location'] || (typeof resp.headers.get === 'function' ? (resp.headers.get('x-inertia-location') || resp.headers.get('location')) : null));
            const isInertiaJson = resp.data && (typeof resp.data === 'object') && (resp.data.component || resp.data.url);
            if (isInertiaJson && resp.data.url) redirectTo = resp.data.url;
            console.log('[LOGIN] redirectTo inicial=', redirectTo, 'isInertiaJson=', isInertiaJson, 'data_type=', typeof resp.data);
            if (resp.status === 422 || (resp.data && (resp.data.errors || resp.data.message))) {
                console.log('[LOGIN] erro de validação:', resp.data?.errors || resp.data?.message);
                if (resp.data?.errors) {
                    form.errors = Object.assign({}, form.errors, resp.data.errors || {});
                } else if (resp.data?.message) {
                    form.setError('email', resp.data.message);
                } else if (typeof resp.data === 'string' && resp.status === 422) {
                    form.setError('email', 'Credenciais inválidas. Verifique e-mail e senha.');
                }
            } else if ((resp.status >= 200 && resp.status < 400) || resp.status === 302) {
                if (!redirectTo) redirectTo = '/dashboard?refresh=1';
                if (!String(redirectTo).includes('refresh=')) {
                    redirectTo += (String(redirectTo).indexOf('?') === -1 ? '?' : '&') + 'refresh=1';
                }
                console.log('[LOGIN] SUCCESS. window.location.href=', redirectTo);
                window.location.href = redirectTo;
                return;
            }
        } catch (e) {
            console.error('[LOGIN] catch erro:', e?.message || e, 'status=', e?.response?.status, 'data=', e?.response?.data);
            if (e?.response?.status === 422 && e?.response?.data?.errors) {
                form.errors = Object.assign({}, form.errors, e.response.data.errors);
            } else if (e?.response?.status === 419) {
                form.setError('email', 'Sessão expirou. Atualize a página e tente novamente. (CSRF)');
            } else {
                form.setError('email', 'Falha ao autenticar. Verifique os dados.');
            }
        } finally {
            console.log('[LOGIN] finally. errors=', JSON.stringify(form.errors), 'email=', form.email);
            form.reset('password');
            form.processing = false;
            if (!form.errors.email && !form.errors.password && Object.keys(form.errors || {}).length === 0) {
                console.log('[LOGIN] finally fallback redirect para /dashboard?refresh=1');
                setTimeout(() => { window.location.href = '/dashboard?refresh=1'; }, 300);
            }
        }
    };
</script>
