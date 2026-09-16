import{R as e}from"./app-react-8c449556.js";import{c as n,C as E,a as o,l as g,m as h,n as y,o as w,f as p,p as v}from"./badge-0b678a58.js";/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]],k=n("arrow-down-right",b);/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],_=n("arrow-up-right",C);/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M5 12h14",key:"1ays0h"}]],R=n("minus",M);function B({title:d,value:x,description:c,icon:l,trend:a=0,trendLabel:f="vs. período anterior",variant:t="default",footer:r,badgeText:s,badgeVariant:u="default",className:N}){const m=a>1e-4,i=a<-1e-4;return e.createElement(E,{className:o("overflow-hidden transition-transform hover:-translate-y-0.5",N)},e.createElement(g,{className:"flex flex-row items-start justify-between space-y-0 pb-2"},e.createElement("div",{className:"space-y-1"},e.createElement(h,{className:"text-xs font-medium uppercase tracking-wider"},d),e.createElement(y,{className:"text-2xl lg:text-3xl font-black tracking-tight"},x)),e.createElement("div",{className:o("h-10 w-10 rounded-lg flex items-center justify-center shrink-0",t==="primary"&&"bg-primary/10 text-primary",t==="success"&&"bg-emerald-100 text-emerald-600",t==="warning"&&"bg-amber-100 text-amber-600",t==="destructive"&&"bg-error/10 text-error",t==="default"&&"bg-primary-container text-primary-on-container")},l&&e.createElement(l,{className:"h-5 w-5"}))),e.createElement(w,{className:"space-y-3"},e.createElement("div",{className:"flex flex-wrap items-center gap-2 text-xs"},m&&e.createElement("span",{className:"inline-flex items-center gap-1 font-bold text-emerald-600"},e.createElement(_,{className:"h-3.5 w-3.5"}),"+",p(a,1),"%"),i&&e.createElement("span",{className:"inline-flex items-center gap-1 font-bold text-error"},e.createElement(k,{className:"h-3.5 w-3.5"}),p(a,1),"%"),!m&&!i&&e.createElement("span",{className:"inline-flex items-center gap-1 font-bold text-on-surface-variant"},e.createElement(R,{className:"h-3.5 w-3.5"})," Estável"),e.createElement("span",{className:"text-on-surface-variant"},f)),c&&e.createElement("p",{className:"text-xs text-on-surface-variant leading-relaxed"},c),(s||r)&&e.createElement("div",{className:"flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/60"},s?e.createElement(v,{variant:u,className:"text-[10px] px-2 py-0.5 font-bold"},s):e.createElement("span",null),r&&e.createElement("div",{className:"text-[11px] text-on-surface-variant"},r))))}export{B as K};
