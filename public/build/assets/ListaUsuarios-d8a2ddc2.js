import{_ as r}from"./AuthenticatedLayout-eb636967.js";import{j as d,o as c,f as u,a as t,u as m,w as f,F as p,Z as _,b as o,t as x}from"./app-b79949ba.js";import"./toastr-f64cb889.js";/* empty css                   */import h from"./GridUsuario-9053c8bf.js";import w from"./AddUsuario-5045f82a.js";/* empty css              */import"./transition-80938efe.js";import"./XMarkIcon-82728262.js";import"./toastr-76f8313c.js";import"./funcionario-b96a7293.js";import"./EditUsuario-2091c871.js";import"./FormEditUsuario-cf43f532.js";import"./functions-ab7c0477.js";import"./html2pdf-d3a538d9.js";import"./ClipboardDocumentCheckIcon-131a2274.js";import"./DelUsuario-16fc7447.js";import"./FormAddUsuario-4dee3458.js";const v={class:"w-full h-screen pt-24 pb-32 mx-2 md:mx-4"},b={class:"w-full h-14 flex mb-2"},g={class:"w-2/12 h-14 flex items-center"},y=o("h1",{class:"text-xl md:text-4xl font-bold"},"Usuários",-1),A={class:"text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4"},U={class:"w-10/12 flex justify-end"},$=o("div",{class:"w-full md:w-4/12"},null,-1),j={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},k={class:"card-body"},B={class:"w-full flex flex-col flex-wrap md:flex-row justify-center"},Q={__name:"ListaUsuarios",props:["usuarios","funcoes"],setup(s){const n=s,e=d(!1);function l(i){i==="t"?e.value=!0:(e.value=!1,window.location.reload())}return(i,a)=>(c(),u(p,null,[t(m(_),{title:"Usuários"}),t(r,null,{default:f(()=>[o("div",v,[o("div",b,[o("div",g,[y,o("h1",A,x(s.usuarios.length),1)]),o("div",U,[o("label",{for:"modal-cliente-add",class:"w-32 botao-modal text-sm",onClick:a[0]||(a[0]=C=>l("t"))},"+ Novo Usuário")])]),$,o("div",j,[o("div",k,[o("div",B,[t(h,{usuarios:s.usuarios,funcoes:s.funcoes},null,8,["usuarios","funcoes"])])])]),t(w,{openAdd:e.value,funcoes:n.funcoes,onCloseAdd:l},null,8,["openAdd","funcoes"])])]),_:1})],64))}};export{Q as default};