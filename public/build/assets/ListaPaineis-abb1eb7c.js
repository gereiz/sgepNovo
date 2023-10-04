import{j as x,h,o as i,f as r,a as c,u as b,w,F as d,Z as p,b as s,t as o,k as v,v as g,l as y}from"./app-0a599aef.js";import{_ as j}from"./AuthenticatedLayout-dee213d5.js";import"./toastr.min-19b03c78.js";import"./_plugin-vue_export-helper-c27b6911.js";const P={class:"w-full h-screen pt-24 pb-32 mx-2 sm:mx-4"},k={class:"w-full h-14 flex mb-2 pe-3 sm:pe-0"},B={class:"w-2/12 h-14 flex items-center"},F=s("h1",{class:"text-xl sm:text-4xl font-bold"},"Painéis",-1),q={class:"text-lg sm:text-2xl text-red-400 font-bold ml-2 sm:ml-4"},L=s("div",{class:"w-10/12 flex justify-end"},[s("label",{for:"modal-cliente-add",class:"w-28 botao-modal text-sm"},"+ Novo Painel")],-1),C={class:"w-full sm:w-4/12"},D={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},E={class:"card-body"},N={class:"w-full flex flex-col flex-wrap sm:flex-row justify-center"},V={for:"modal-cliente"},I={class:"card-body"},O={class:"w-full flex flex-col items-center"},S={class:"w-full mb-4 -ml-4"},M=["src"],R={class:"w-full sm:w-11/12 flex justify-center flex-wrap mb-4"},T={class:"w-full flex justify-between sm:justify-between"},U={class:"text-xs sm:card-title"},Z={class:"text-xs sm:card-title"},$={class:"text-xs sm:card-title text-red-500"},z=s("div",{class:"w-full sm:w-11/12 flex justify-center flex-wrap space-x-2 mb-4"},[s("button",{class:"botao bg-sky-700"},"Detalhes"),s("button",{class:"botao bg-yellow-700"},"Editar"),s("button",{class:"botao bg-red-700"},"Excluir")],-1),K={__name:"ListaPaineis",props:["paineis"],setup(n){const u=n,a=x(""),m=h(()=>Object.values(u.paineis).filter(e=>String(e.bairro.nome).toLowerCase().indexOf(a.value.toLowerCase())>-1));function f(l){var e="http://localhost:8000/storage/"+l,e="/storage/"+l;return e}return(l,e)=>(i(),r(d,null,[c(b(p),{title:"Painéis"}),c(j,null,{default:w(()=>[s("div",P,[s("div",k,[s("div",B,[F,s("h1",q,o(n.paineis.length),1)]),L]),s("div",C,[v(s("input",{"onUpdate:modelValue":e[0]||(e[0]=t=>a.value=t),placeholder:"Pesquisar Painel",class:"w-full h-10 input input-bordered rounded-none mb-4",type:"text",name:"pesquisar",id:"pesquisar"},null,512),[[g,a.value]])]),s("div",D,[s("div",E,[s("div",N,[(i(!0),r(d,null,y(m.value,(t,_)=>(i(),r("div",{key:_,class:"card w-full sm:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4"},[s("label",V,[s("div",I,[s("div",O,[s("div",S,[s("img",{class:"img-painel",src:f(t.image_url),alt:"Bairro"},null,8,M)]),s("div",R,[s("div",T,[s("h2",U,"Região: "+o(t.bairro.regiao.nome),1),s("h2",Z,"Bairro: "+o(t.bairro.nome),1),s("h2",$,"Identificação.: "+o(t.identificacao),1)])]),z])])])]))),128))])])])])]),_:1})],64))}};export{K as default};
