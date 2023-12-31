import './bootstrap';
import '../css/app.css';

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m';

// FormKit imports
import { plugin as formKitPlugin, defaultConfig } from '@formkit/vue'
import { createMultiStepPlugin } from '@formkit/addons'

import { createProPlugin, inputs } from '@formkit/pro'
import '@formkit/themes/genesis'
import '@formkit/pro/genesis'
import '@formkit/addons/css/multistep'

const pro = createProPlugin('fk-118c01e3122', inputs)


const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use(formKitPlugin, defaultConfig({
                plugins: [pro, createMultiStepPlugin()]
              }))
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
