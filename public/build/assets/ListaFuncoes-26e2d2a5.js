import{_ as d}from"./AuthenticatedLayout-f43d44cd.js";import{j as i,o as c,f as r,a as t,u as f,w as m,F as u,Z as _,b as o,t as p}from"./app-b59ccc57.js";import"./toastr-0e92b8d6.js";import"./toastr-0012676b.js";import x from"./GridFuncao-dc4a55bb.js";import h from"./AddFuncao-c00284a1.js";import"./transition-513be258.js";import"./XMarkIcon-52eff867.js";import"./EditFuncao-1f06a504.js";import"./FormEditFuncao-03953bb3.js";import"./functions-f3a208ff.js";import"./ClipboardDocumentCheckIcon-25d34672.js";import"./DelFuncao-0ac606c5.js";import"./FormAddFuncao-c0e0f55e.js";const w={class:"w-full h-screen pt-24 pb-32 mx-2 md:mx-4"},v={class:"w-full h-14 flex mb-2"},b={class:"w-2/12 h-14 flex items-center"},g=o("h1",{class:"text-xl md:text-4xl font-bold"},"Funções",-1),F={class:"text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4"},y={class:"w-10/12 flex justify-end"},A=o("div",{class:"w-full md:w-4/12"},null,-1),$={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},j={class:"card-body"},k={class:"w-full flex flex-col flex-wrap md:flex-row justify-center"},K={__name:"ListaFuncoes",props:["funcoes"],setup(s){const e=i(!1);function l(n){n==="t"?e.value=!0:(e.value=!1,window.location.reload())}return(n,a)=>(c(),r(u,null,[t(f(_),{title:"Serviços"}),t(d,null,{default:m(()=>[o("div",w,[o("div",v,[o("div",b,[g,o("h1",F,p(s.funcoes.length),1)]),o("div",y,[o("label",{for:"modal-cliente-add",class:"w-32 botao-modal text-sm",onClick:a[0]||(a[0]=B=>l("t"))},"+ Nova Função")])]),A,o("div",$,[o("div",j,[o("div",k,[t(x,{funcoes:s.funcoes},null,8,["funcoes"])])])]),t(h,{openAdd:e.value,onCloseAdd:l},null,8,["openAdd"])])]),_:1})],64))}};export{K as default};