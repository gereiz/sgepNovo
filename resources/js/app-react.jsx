import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'SGEP';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // -----------------------------------------------------------
        // Convenção: Controllers React sempre usam Inertia::render('React/NomeDaPagina')
        //            (prefixo "React/" para diferenciar de pages Vue).
        // Aqui retiramos o prefixo, pois a estrutura real é:
        //    resources/js/react/Pages/{NomeDaPagina}.jsx
        //    (sem a subpasta "React" duplicada no path).
        // -----------------------------------------------------------
        const pageName = name.startsWith('React/') ? name.slice(6) : name;
        // Fallback (se não encontrado): tenta o name original,
        // útil caso queiramos usar o prefixo no futuro.
        return resolvePageComponent(
            `./react/Pages/${pageName}.jsx`,
            import.meta.glob('./react/Pages/**/*.jsx')
        ).catch(async (err1) => {
            if (pageName === name) throw err1;
            try {
                return await resolvePageComponent(
                    `./react/Pages/${name}.jsx`,
                    import.meta.glob('./react/Pages/**/*.jsx')
                );
            } catch {
                throw err1;
            }
        });
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#3A5598',
        showSpinner: true,
    },
});



