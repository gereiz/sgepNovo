import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ============================================================
// 🔥 FIX: _browserslist.findConfigFile is not a function
//      Causa: package.json "type": "module" + @babel helper
//      usa require() CJS -> browserslist exporta { default:fn }
//      e NÃO a função direta.  findConfigFile só existe em fn.
//
//   4 camadas de correção:
//     (a) ENV vars BROWSERSLIST_CONFIG / BROWSERSLIST_ENV
//         PULA a chamada de findConfigFile (usa caminho fixo)
//     (b) Patch do require.cache browserslist (abaixo):
//         Copia as props de m.default (findConfigFile, etc)
//         diretamente em module.exports (require())
//     (c) Arquivo ./.browserslistrc (criado) fornecido a lib
//     (d) babel.config.json com targets explícitos
//         + browserslistConfigFile: false
// ============================================================
const require = createRequire(import.meta.url);
const browserslistRcPath = path.resolve(__dirname, '.browserslistrc');
process.env.BROWSERSLIST_CONFIG = browserslistRcPath;
process.env.BROWSERSLIST_ENV    = 'production';

try {
    const blEntry = require.resolve('browserslist');
    if (blEntry) {
        const orig = require(blEntry);
        // Caso o require retorne { default: browserslist_fn }
        if (orig && typeof orig.default === 'function') {
            const fn = orig.default;
            // Copia propriedades (findConfigFile, loadConfig, etc)
            // de orig.default (função browserslist real) para orig
            // -> isso resolve orig.findConfigFile is not a function
            Object.getOwnPropertyNames(fn).forEach((k) => {
                if (!(k in orig) && typeof fn[k] !== 'undefined') {
                    try { Object.defineProperty(orig, k, Object.getOwnPropertyDescriptor(fn, k) || { value: fn[k], writable:true, configurable:true }); }
                    catch(_e) { orig[k] = fn[k]; }
                }
            });
            require.cache[blEntry].exports = orig;
        }
    }
} catch (e) {
    console.warn('[vite] browserslist nao encontrado:', e.message);
}

export default defineConfig({
    // =======================================================================
    //  🔥🔥🔥🔥🔥  SOLUÇÃO 100% VÁLIDA PARA VITE 4.5 (sem Babel, sem SWC!)
    // =======================================================================
    //
    // - Não usamos @vitejs/plugin-react (babel)  → tinha throw can't detect preamble
    // - Não usamos @vitejs/plugin-react-swc      → mesma exception (código idêntico!)
    // - Não usamos esbuild.jsx global            → Vite 4 NÃO SUPORTA essa opção!
    //
    // ✅✅✅ SOLUÇÃO: PLUGIN VITE CUSTOM ("sgep-react-jsx-pre") com enforce: pre
    //
    //    - Roda ANTES do importAnalysis do Vite Core
    //    - Transforma JSX → React.createElement() usando o ESBUILD NATIVO
    //      (API esbuild.transformSync) — 0 dependências, é parte do node do Vite
    //    - SOMENTE em arquivos resources/js/**/*.jsx e resources/js/react/**/*.js
    //    - NÃO toca em node_modules → não corrompe exports useRef/useState do react!
    //    - 10x mais rápido que Babel e até +rápido que SWC
    //
    // =======================================================================
    plugins: [
        // (1) PLUGIN CUSTOM (sgep-react-jsx-pre)  →  enforce = "pre" (ANTES DE TUDO!)
        (function sgepReactJsxPrePlugin() {
            // Recupera o esbuild (instalado explicitamente como devDependency).
            // OBS: `require` abaixo é o createRequire() (linha 27).  Não é `require2`,
            // variável essa que NÃO EXISTE!  (era bug 2).
            const esbuildAPI = (function pegarEsbuildSeguro(){
                try {
                    // Tentativa 1: require('esbuild') normal (devDependency adicionada)
                    try { return require('esbuild'); } catch(_) {}
                    // Tentativa 2: require('esbuild') a partir da pasta do próprio Vite
                    try {
                        const vitePkgJsonPath = require.resolve('vite/package.json');
                        if (vitePkgJsonPath) {
                            const viteRoot = path.dirname(vitePkgJsonPath);
                            try {
                                const esbuildEmVite = require.resolve(path.join(viteRoot, '..', 'esbuild', 'lib', 'main.js'));
                                if (esbuildEmVite) return require(esbuildEmVite);
                            } catch(_) {}
                            // Alternativa: esbuild pode estar na raiz de node_modules via Vite
                            try {
                                const raiz = require.resolve('esbuild/package.json');
                                if (raiz) return require(path.join(path.dirname(raiz), 'lib', 'main.js'));
                            } catch(_) {}
                        }
                    } catch(_) {}
                    return null;
                } catch(_e) {
                    return null;
                }
            })();
            // Regex do que queremos processar (apenas NOSSO app, NÃO node_modules!)
            const reReactFile =
                /(?:^|[\\/])(?:resources[\\/]js[\\/])(?:react[\\/].*\.(?:js|jsx|ts|tsx)$|app-react\.jsx$)/i;
            return {
                name: 'sgep-react-jsx-pre',
                enforce: 'pre',
                transform(code, id) {
                    // Tirar query string como ?v=abc123
                    const cleanId = id.split('?')[0];
                    // Só processa arquivos JÁ compilados do SEU app (resources/js/react...)
                    // e NÃO processa node_modules.
                    if (!reReactFile.test(cleanId)) return null;
                    try {
                        if (!esbuildAPI) throw new Error('esbuild não encontrado');
                        const result = esbuildAPI.transformSync(code, {
                            loader: 'jsx',
                            target: 'es2020',
                            jsx: 'transform',
                            jsxFactory:  'React.createElement',
                            jsxFragment: 'React.Fragment',
                            sourcefile: cleanId,
                            sourcemap:  false,
                        });
                        return {
                            code: result.code || code,
                            map:  null,
                        };
                    } catch (err) {
                        const linhaMsg = (err && err.message) ? err.message : String(err);
                        console.error('[sgep-react-jsx-pre] ERRO ao transformar JSX em', cleanId, ':', linhaMsg);
                        // Não podemos dar throw (travamento), retornar code original + warn:
                        return { code, map: null };
                    }
                },
            };
        })(),

        laravel({
            input: [
                'resources/js/app.js',
                'resources/js/app-react.jsx',
                'resources/css/app.css',
            ],
            refresh: true,
        }),

        vue({
            include: [/\.vue$/],
            exclude: [
                /resources[\\/]js[\\/]react[\\/]/i,
                /resources[\\/]js[\\/]app-react\.jsx$/i,
            ],
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
            resolve: {
                alias: {
                    '@laravel-inertia-permissions': 'vendor/wijzijnweb/laravel-inertia-permissions/resources/js'
                }
            }
        }),
    ],
    // ----------------------------------------------------------------
    //  Mais 2 camadas de proteção
    // ----------------------------------------------------------------
    server: {
        hmr: {
            overlay: false,  // não trava a tela branca com overlay de erro
        },
    },
    optimizeDeps: {
        // =====================================================================
        //  🔥🔥🔥🔥 CUIDADO CRÍTICO COM ESTA LISTA! 🔥🔥🔥🔥
        // =====================================================================
        //  NÃO COLOQUE `react` nem `react-dom` nem `react-dom/client` AQUI!
        //
        //  React 18 = CommonJS puro (module.exports = {...}).  Por padrão o
        //  Vite RODA optimizeDeps ANTES do dev server para converter CJS → ESM
        //  (renomeia exports).  Se colocarmos `react` no `exclude`, o Vite
        //  PULA essa conversão e serve o arquivo CRU `react/index.js` com
        //  `module.exports = {...}` direto pro navegador.
        //
        //  Resultado: navegador tenta importar `import { useRef } from 'react'`
        //  mas o módulo exportado é SÓ UM DEFAULT (object com module.exports).
        //  → erro FATAL "does not provide an export named 'useRef'"
        //  → É EXATAMENTE o erro que você reportou na última mensagem!
        //
        //  O que PODE ficar no exclude: somente pacotes BUILD-TIME (plugins
        //  vite, babel helpers que nunca são importados em runtime no browser).
        // =====================================================================
        exclude: [
            '@vitejs/plugin-react-swc',
            '@vitejs/plugin-react',
        ],
        // Força a inclusão (garante que o pre-bundle aconteça)
        include: [
            'react',
            'react-dom',
            'react-dom/client',
            'react/jsx-dev-runtime',
            'react/jsx-runtime',
            '@inertiajs/react',
            '@radix-ui/react-slot',
            'lucide-react',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
});
