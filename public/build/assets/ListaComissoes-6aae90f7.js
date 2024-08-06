import{j as r,o as a,f as d,a as c,u,w as f,F as p,Z as x,b as s,m as _,y as v,c as h,q as w}from"./app-b79949ba.js";import{_ as g}from"./AuthenticatedLayout-eb636967.js";import"./toastr-f64cb889.js";/* empty css                   */import b from"./GridComissaoServ-07fc281a.js";import y from"./GridComissaoUsu-afbed729.js";/* empty css              */import"./transition-80938efe.js";import"./XMarkIcon-82728262.js";import"./toastr-76f8313c.js";import"./servico-a17c8dc2.js";import"./functions-ab7c0477.js";import"./html2pdf-d3a538d9.js";import"./EditComissaoServ-492cdbc0.js";import"./FormEditComissaoServ-490eca1f.js";import"./maska-1eacf752.js";import"./ClipboardDocumentCheckIcon-131a2274.js";import"./DelComissaoServ-07dd21b5.js";import"./funcionario-b96a7293.js";import"./EditComissaoUsu-2eb3a547.js";import"./FormEditComissaoUsu-01566b14.js";import"./DelComissaoUsu-45baa3a0.js";const C={class:"w-full h-[90vh] pt-8 sm:pt-24 pb-32 mx-2 md:mx-4"},k={class:"w-full h-14 flex flex-col sm:flex-row mb-2 space-y-4"},S=s("div",{class:"w-full sm:w-2/12 h-14 flex items-center justify-center"},[s("h1",{class:"text-xl md:text-4xl font-bold"},"Comissões"),s("h1",{class:"text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4"})],-1),A={class:"w-full sm:w-2/12 flex justify-center items-center space-x-2"},B=s("label",{for:"",class:"block text-lg font-medium leading-6 text-gray-900"},"Tipo:",-1),j=s("option",{value:"cSer"},"Comissões por Serviço",-1),U=s("option",{value:"cUsu"},"Comissões por Usuário",-1),V=[j,U],$=s("div",{class:"w-full md:w-4/12"},null,-1),D={class:"card w-full max-h-[80vh] bg-base-100 shadow-xl rounded-md mt-10"},F={class:"card-body"},N={class:"w-full flex flex-col flex-wrap md:flex-row"},ts={__name:"ListaComissoes",props:["servicos","usuarios","funcoes","comissoes"],setup(o){const e=r(!1),t=r("cSer");function m(i){i==="t"?e.value=!0:(e.value=!1,window.location.reload())}return(i,l)=>(a(),d(p,null,[c(u(x),{title:"Comissões"}),c(g,null,{default:f(()=>[s("div",C,[s("div",k,[S,s("div",A,[B,_(s("select",{"onUpdate:modelValue":l[0]||(l[0]=n=>t.value=n),class:"block w-8/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"},V,512),[[v,t.value]])])]),$,s("div",D,[s("div",F,[s("div",N,[(a(),h(w(t.value=="cSer"?b:y),{servicos:o.servicos,openAdd:e.value,usuarios:o.usuarios,funcoes:o.funcoes,comissoes:o.comissoes,onCloseAdd:m},null,40,["servicos","openAdd","usuarios","funcoes","comissoes"]))])])])])]),_:1})],64))}};export{ts as default};