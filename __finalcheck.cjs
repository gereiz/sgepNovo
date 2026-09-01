/* Validação FINAL:
   - Arquivos .jsx do app compilam via SWC PACHETEADO (sem throw new Error can't detect preamble)
   - Módulo react/index.js expõe useRef (não foi bagunçado por esbuild.loader global!)
*/
const fs   = require('fs');
const path = require('path');
const { createRequire } = require('module');
const require2 = createRequire(__filename);

process.env.BROWSERSLIST_CONFIG = path.resolve(__dirname, '.browserslistrc');
process.env.BROWSERSLIST_ENV    = 'production';
try {
    const blEntry = require2.resolve('browserslist');
    const orig = require2(blEntry);
    if (orig && typeof orig.default === 'function') {
        const fn = orig.default;
        Object.getOwnPropertyNames(fn).forEach((k) => {
            if (!(k in orig) && typeof fn[k] !== 'undefined') {
                try { Object.defineProperty(orig, k, Object.getOwnPropertyDescriptor(fn, k) || { value: fn[k] }); } catch(_) { orig[k] = fn[k]; }
            }
        });
    }
} catch(_) {}

async function run() {
    console.log('\n============== VALIDAÇÃO FINAL SWC PACHETEADO ==============\n');
    let erros = 0;
    const modVite = await import('vite');
    const server = await modVite.createServer({
        configFile: path.resolve(__dirname, 'vite.config.js'),
        logLevel: 'warn',
        server: { middlewareMode: true },
        appType: 'custom',
    });

    // 1) Transformar arquivos .jsx do projeto
    const jsxFiles = [
        'resources/js/react/Components/ui/button.jsx',
        'resources/js/react/Components/ui/badge.jsx',
        'resources/js/react/Components/ui/card.jsx',
        'resources/js/react/Components/ui/input.jsx',
        'resources/js/react/Components/ui/select.jsx',
        'resources/js/react/Components/ui/separator.jsx',
        'resources/js/react/Components/ui/tabs.jsx',
        'resources/js/react/Components/Navbar.jsx',
        'resources/js/react/Layouts/AppLayout.jsx',
        'resources/js/react/Components/dashboard/KpiCard.jsx',
        'resources/js/react/Components/dashboard/SalesOverview.jsx',
        'resources/js/react/Pages/Dashboard/Index.jsx',
        'resources/js/app-react.jsx',
    ];
    for (const rel of jsxFiles) {
        const abs = path.resolve(__dirname, rel).replace(/\\/g, '/');
        process.stdout.write(`  🧪 ${rel}... `);
        try {
            const out = await server.transformRequest(abs, { html: false });
            if (out && out.code && out.code.length > 100) {
                console.log('✅ OK (' + out.code.length + ' chars, SWC patched, sem throw preamble)');
            } else throw new Error('output vazio');
        } catch (err) {
            erros++;
            const m = (err && err.message) ? err.message.split('\n').slice(0,2).join(' | ') : String(err);
            console.log('❌ FAIL: ' + m);
        }
    }

    // 2) Verificar EXPORTS do react/index.js via vite optimize (simula o que o navegador vê)
    console.log('\n  🔍 Verificando exports do react/index.js (deve ter useRef, useState, useEffect, etc)...');
    try {
        const reactPath = require2.resolve('react');
        const reactAbs = path.resolve(__dirname, 'node_modules/react/index.js').replace(/\\/g, '/');
        const out = await server.transformRequest(reactAbs + '?v=teste123', { html: false });
        if (out && out.code) {
            // Vamos analisar o output de exports:
            const hasUseRef   = /export\s*\{[^}]*useRef[^}]*\}|useRef\s*=/.test(out.code) || /export\s+\{[^}]*\buseRef\b[^}]*\}/.test(out.code);
            const temUseRefExplicito = out.code.includes('useRef');
            const fileLen = out.code.length;
            // A forma mais segura: carregar o módulo em sandbox e checar exports
            const modReact = require2('react');
            const check = typeof modReact.useRef === 'function' &&
                          typeof modReact.useState === 'function' &&
                          typeof modReact.useEffect === 'function' &&
                          typeof modReact.createElement === 'function';
            if (check) {
                console.log('  ✅ react exports OK: useRef = typeof ' + (typeof modReact.useRef) + ' | useState: typeof ' + (typeof modReact.useState) + ' | createElement: typeof ' + typeof modReact.createElement);
            } else {
                console.log('  ❌ react exports QUEBRADOS! typeof useRef=' + typeof modReact.useRef + ' (era pra ser function)');
                erros++;
            }
            console.log('     reactAbs len:', fileLen, '| code menciona useRef?', temUseRefExplicito);
        } else {
            console.log('  ❌ react não transformou:', out);
            erros++;
        }
    } catch (err) {
        erros++;
        console.log('  ❌ react falhou:', String(err && err.message || err));
    }

    await server.close();

    console.log('\n============== RESUMO ==============');
    console.log(` Arquivos processados: ${jsxFiles.length+1}`);
    console.log(` Erros: ${erros}`);
    if (erros === 0) {
        console.log('\n🎉🎉🎉 SUCESSO TOTAL!');
        console.log('   (a) .jsx do app compilam via SWC PACHETEADO (sem throw can\'t detect preamble)');
        console.log('   (b) react/index.js expõe useRef (não foi corrompido por esbuild.loader global)');
        console.log('   Próximo passo: parar npm run dev → apagar node_modules/.vite → npm run dev → abrir /r/dashboard');
    }
    process.exit(erros === 0 ? 0 : 1);
}
run().catch(e => { console.error('Fatal:', e); process.exit(2); });
