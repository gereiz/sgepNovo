/*
 * __patch_plugin_swc.cjs
 * ----------------------------------------------------------------------------
 *  Script de pós-instalação PERSISTENTE para remover o
 *   "throw new Error("@vitejs/plugin-react-swc can't detect preamble")"
 *  que existe HARDCODED dentro do @vitejs/plugin-react-swc.
 *
 *  Sem esse patch, o NOSSO frontend React (Inertia + arquivos .jsx) quebrava
 *  em TODOS os arquivos com o erro: "can't detect preamble. Something is wrong."
 *
 *  Com esse patch, o throw é substituído por:
 *   - console.warn (mensagem amigável, NÃO trava a app)
 *   - stubs window.$RefreshReg$ / $RefreshSig$ = no-op
 *   - flag window.__vite_plugin_react_preamble_installed__ = true
 *
 *  Chamado automaticamente pelo `scripts.postinstall` do package.json.
 *  ----------------------------------------------------------------------------
 *  Uso manual:  node __patch_plugin_swc.cjs
 *  Uso automático (recomendado): npm install  (roda postinstall)
 * ----------------------------------------------------------------------------
 * (C) SGEP / Equipe Propaganda - migração Vue → React gradual
 */

const fs   = require('fs');
const path = require('path');

const targets = [
    'node_modules/@vitejs/plugin-react-swc/index.cjs',
    'node_modules/@vitejs/plugin-react-swc/index.js',
];

const OLD_BLOCK_REGEX =
    /if\s*\(\s*!window\.\$RefreshReg\$\s*\)\s*\{[\s\S]{0,400}throw\s+new\s+Error\s*\(\s*"[^"]*can't detect preamble[^"]*"\s*\)\s*;?[\s\S]{0,200}\}/;

const NEW_BLOCK_SOURCE = `
if (!window.$RefreshReg$) {
  // ===== [SGEP PATCH APLICADO via __patch_plugin_swc.cjs] =====
  // Motivo: O macro do React Refresh integrado ao @vitejs/plugin-react-swc
  // (e também ao plugin-react / Babel) tem hardcoded um throw new Error
  // quando não encontra o preamble injetado no head.   Como estamos usando
  // Inertia multi-entrypoint (Vue + React no mesmo projeto Laravel Vite)
  // o preamble só vem no primeiro entrypoint (Vue), o React nunca encontra
  // ele.  Se deixarmos o throw ele quebra TODOS os arquivos .jsx do frontend
  // novo com "can't detect preamble. Something is wrong."
  //
  // Solução: substituímos o throw por um soft warning + stubs das variáveis
  // globais, para o runtime do React Refresh não reclamar.
  //
  // Perdas com esse patch:
  //   - React Fast Refresh (HMR específico do React) pode não ser 100%
  //     automático em componentes .jsx; na prática um F5 resolve e a
  //     experiência de desenvolvimento continua boa.
  console.warn(
    '[SGEP-React] React Refresh preamble nao detectado (não é erro critico;' +
    ' continuando compilação — HMR convencional do Vite continua funcional).'
  );
  if (typeof window !== 'undefined') {
    window.$RefreshReg$ = window.$RefreshReg$ || function() {};
    window.$RefreshSig$ = window.$RefreshSig$ || function() { return function(t) { return t; }; };
  }
  window.__vite_plugin_react_preamble_installed__  = true;
  globalThis.__vite_plugin_react_preamble_installed__ = true;
}
`.trim();

let patches = 0;
for (const relP of targets) {
    const abs = path.resolve(process.cwd(), relP);
    if (!fs.existsSync(abs)) {
        console.log('[skip]', relP, 'não encontrado');
        continue;
    }
    let conteudo = fs.readFileSync(abs, 'utf8');
    if (conteudo.includes('[SGEP PATCH APLICADO')) {
        console.log('[ok]', relP, 'JÁ ESTAVA PACHETEADO (não é necessário modificar)');
        patches++;
        continue;
    }
    const novo = conteudo.replace(OLD_BLOCK_REGEX, NEW_BLOCK_SOURCE);
    if (novo === conteudo) {
        console.log('[warn] ' + relP + ' NAO CONTEM o bloco throw can\'t detect preamble -- nada a fazer');
        continue;
    }
    fs.writeFileSync(abs, novo, 'utf8');
    patches++;
    console.log('[OK]', relP, '→ PATCH APLICADO (throw removido)');
}

console.log('\n=== patches aplicados:', patches, '/', targets.length, '===');
process.exit(0);
