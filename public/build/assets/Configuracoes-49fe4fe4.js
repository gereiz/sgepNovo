import{j as _,o as a,f as n,a as d,u as b,w as h,F as i,Z as x,b as s,k as p,v,l as w,t as g}from"./app-c0191d23.js";import{_ as y}from"./AuthenticatedLayout-349afb90.js";import{u as C}from"./toastr-d9b552d4.js";import"./_plugin-vue_export-helper-c27b6911.js";import"./toastr.min-5509ae66.js";const k={class:"w-full h-screen pt-24 pb-32 mx-2 md:mx-4"},A=s("div",{class:"w-full h-14 flex mb-2"},[s("div",{class:"w-4/12 h-14 flex items-center"},[s("h1",{class:"text-xl md:text-4xl font-bold"},"Configurações Gerais")])],-1),B=s("div",{class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},[s("div",{class:"card-body"},[s("div",{class:"w-full flex flex-col flex-wrap md:flex-row justify-start"},[s("label",{for:"modal-ano",class:"botao-primario w-fit px-2 flex items-center"},"Cadastro de Ano")])])],-1),V=s("input",{type:"checkbox",id:"modal-ano",class:"modal-toggle"},null,-1),j={class:"modal flex items-end md:items-center"},D={class:"modal-box"},F=s("div",{class:"flex mb-4"},[s("label",{for:"modal-ano",class:"btn btn-sm btn-circle btn-ghost absolute right-2 top-2"},"✕"),s("h3",{class:"font-bold text-lg"},"Cadastrar ano")],-1),N={class:"w-full flex"},T={class:"w-7/12 flex flex-col p-1"},$={class:"mb-2 w-10/12"},z={class:"w-10/12"},E={class:"w-5/12"},G={class:"overflow-y-auto h-40"},L={class:"w-full table table-zebra"},M=s("thead",null,[s("tr",null,[s("th",{class:"w-full bg-black text-white text-center rounded-none"},"Ano")])],-1),I={__name:"Configuracoes",props:["anos"],setup(r){const c=r,u=C(),t=_("");function f(){console.log(t.value),axios.post("/AddAno",{ano:t.value}).then(o=>{u.success(o.data)}).catch(o=>{console.log(o)})}return(o,e)=>(a(),n(i,null,[d(b(x),{title:"Configurações"}),d(y,null,{default:h(()=>[s("div",k,[A,B,V,s("div",j,[s("div",D,[F,s("div",N,[s("div",T,[s("div",$,[p(s("input",{"onUpdate:modelValue":e[0]||(e[0]=l=>t.value=l),class:"w-full input input-bordered rounded-none",type:"number",name:"insert_ano",id:"insert_ano"},null,512),[[v,t.value]])]),s("div",z,[s("button",{class:"botao-primario w-full",onClick:e[1]||(e[1]=l=>f())},"Cadastrar")])]),s("div",E,[s("div",G,[s("table",L,[M,s("tbody",null,[(a(!0),n(i,null,w(c.anos,(l,m)=>(a(),n("tr",{key:m,class:"border border-1"},[s("td",null,g(l.ano_bisemana),1)]))),128))])])])])])])])])]),_:1})],64))}};export{I as default};
