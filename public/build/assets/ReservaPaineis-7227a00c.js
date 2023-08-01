import{j as h,o as t,f as l,a as x,u,w,F as n,Z as p,b as e,t as i,l as c,k as g,q as y}from"./app-1fe0d83e.js";import{_ as k}from"./AuthenticatedLayout-d2417636.js";import"./toastr.min-330bb314.js";import"./_plugin-vue_export-helper-c27b6911.js";const B={class:"w-full h-screen pt-24 pb-32 mx-2 sm:mx-4"},j={class:"w-full h-14 flex mb-2"},R={class:"w-2/12 h-14 flex items-center"},D=e("h1",{class:"text-xl sm:text-4xl font-bold"},"Reservas",-1),P={class:"text-lg sm:text-2xl text-red-400 font-bold ml-2 sm:ml-4"},S={class:"w-full flex flex-row flex-wrap items-center justify-center"},C={class:"w-full sm:w-3/12 flex flex-col me-4 sm:me-6"},E=e("label",{for:"bi-semana"},"Bi-Semana",-1),I={class:"select-paineis",name:"bi-semana",id:"bi-semama"},V=["value"],F={class:"w-full sm:w-3/12 flex flex-col me-4 sm:me-6"},N=e("label",{for:"status"},"Status",-1),$=e("option",{value:"0"},"Todos",-1),q=e("option",{value:"1"},"Disponível",-1),G=e("option",{value:"2"},"Reservado",-1),L=[$,q,G],M={class:"w-full sm:w-3/12 flex flex-col me-4 sm:me-6"},T=e("label",{for:"ident"},"Identificação",-1),U={class:"select-paineis",name:"ident",id:"ident"},Z=["value"],z={class:"w-full sm:w-3/12 flex flex-col me-4 sm:me-6"},A=e("label",{for:"cidades"},"Cidades",-1),H={class:"select-paineis",name:"cidades",id:"cidades"},J={class:"w-full sm:w-3/12 flex flex-col me-4 sm:me-6"},K=e("label",{for:"regioes"},"Regiões",-1),O={class:"select-paineis",name:"regioes",id:"regioes"},Q={class:"w-full sm:w-3/12 flex flex-col me-4 sm:me-6"},W=e("label",{for:"bairros"},"Bairros",-1),X={class:"select-paineis",name:"bairros",id:"bairros"},Y={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},ee={class:"card-body"},se={class:"w-full flex flex-col flex-wrap sm:flex-row justify-center"},te={for:"modal-cliente"},le={class:"card-body"},oe={class:"w-full flex flex-col items-center"},ie={class:"w-full mb-4 -ml-4"},ae=["src"],ne={class:"w-full sm:w-11/12 flex justify-center flex-wrap mb-4"},ce={class:"w-full flex justify-between sm:justify-between"},de={class:"text-xs sm:card-title"},re={class:"text-xs sm:card-title"},me={class:"text-xs sm:card-title text-red-500"},ue=e("div",{class:"w-full sm:w-11/12 flex justify-center flex-wrap space-x-2 mb-4"},[e("button",{class:"botao bg-sky-700"},"Detalhes"),e("button",{class:"botao bg-yellow-700"},"Editar"),e("button",{class:"botao bg-red-700"},"Excluir")],-1),be={__name:"ReservaPaineis",props:["ambiente","reservas","paineis","bisemanas","cidades","regioes","bairros"],setup(d){const f=d,_=h(0);var r=h(f.paineis);function b(m){if(f.ambiente=="local")var a="http://[::1]:5173/storage/app/public/"+m;else var a="/storage/"+m;return a}function v(){axios.post("/GetPaineis",{status:_.value}).then(m=>{r.value=m.data,console.log(r.value)})}return(m,a)=>(t(),l(n,null,[x(u(p),{title:"Reservas"}),x(k,null,{default:w(()=>[e("div",B,[e("div",j,[e("div",R,[D,e("h1",P,i(u(r).length),1)])]),e("div",S,[e("div",C,[E,e("select",I,[(t(!0),l(n,null,c(d.bisemanas,(s,o)=>(t(),l("option",{key:o,value:s.id},"Bi-semana: "+i(s.inicio),9,V))),128))])]),e("div",F,[N,g(e("select",{class:"select-paineis",name:"status",id:"status","onUpdate:modelValue":a[0]||(a[0]=s=>_.value=s),onChange:a[1]||(a[1]=s=>v())},L,544),[[y,_.value]])]),e("div",M,[T,e("select",U,[(t(!0),l(n,null,c(u(r),(s,o)=>(t(),l("option",{key:o,value:s.index},i(s.identificacao),9,Z))),128))])]),e("div",z,[A,e("select",H,[(t(!0),l(n,null,c(d.cidades,(s,o)=>(t(),l("option",{key:o,value:"c.id"},i(s.nome),1))),128))])]),e("div",J,[K,e("select",O,[(t(!0),l(n,null,c(d.regioes,(s,o)=>(t(),l("option",{key:o,value:"r.id"},i(s.nome),1))),128))])]),e("div",Q,[W,e("select",X,[(t(!0),l(n,null,c(d.bairros,(s,o)=>(t(),l("option",{key:o,value:"b.id"},i(s.nome),1))),128))])])]),e("div",Y,[e("div",ee,[e("div",se,[(t(!0),l(n,null,c(u(r),(s,o)=>(t(),l("div",{key:o,class:"card w-full sm:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4"},[e("label",te,[e("div",le,[e("div",oe,[e("div",ie,[e("img",{class:"img-painel",src:b(s.image_url),alt:"Bairro"},null,8,ae)]),e("div",ne,[e("div",ce,[e("h2",de,"Região: "+i(s.bairro.regiao.nome),1),e("h2",re,"Bairro: "+i(s.bairro.nome),1),e("h2",me,"Identificação.: "+i(s.identificacao),1)])]),ue])])])]))),128))])])])])]),_:1})],64))}};export{be as default};
