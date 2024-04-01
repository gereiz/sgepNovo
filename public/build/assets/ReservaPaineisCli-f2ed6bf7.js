import{j as l,y as M,m as F,o as r,f as u,a as h,u as m,w as Z,F as x,Z as z,b as e,d as b,t as n,k as S,x as D,l as B,B as q,g as E,v as H}from"./app-29e5dc1a.js";import{_ as J}from"./AuthenticatedLayout-e8c6339c.js";import{u as K}from"./toastr-48850662.js";import Q from"./AddReserva-82bcd19a.js";import{s as W}from"./vue-multiselect.esm-321fbcdf.js";import"./XMarkIcon-9d9961ea.js";import"./transition-62370d0d.js";import"./toastr-77ac7471.js";import"./painel_conv-45a82d16.js";import"./regiao-35565801.js";import"./functions-c722538b.js";const X={class:"w-full h-screen pt-20 pb-32 mx-2 md:mx-4"},Y={class:"w-full h-14 flex mb-2"},ee={class:"sm:w-2/12 h-14 flex items-center"},se=e("h1",{class:"titulo"},"Reservas por Cliente ",-1),te={class:"text-red-500 font-bold ml-2"},ae={class:"w-full flex flex-row flex-wrap items-center justify-center mb-20 sm:mb-0"},le={class:"w-full flex items-center sm:justify-center flex-wrap"},oe={class:"w-[30%] sm:w-[8%] flex flex-col me-4 sm:me-6"},ie=e("label",{for:"bi-semana"},"Ano",-1),ne=e("option",{value:"0",selected:""},"Selecione",-1),ce=["value"],de={class:"w-[61%] sm:w-[20%] flex flex-col me-4 sm:me-6"},re=e("label",{for:"bi-semana"},"Bi-Semana",-1),ue=e("option",{value:"0",selected:""},"Selecione",-1),me=["value"],fe={class:"w-full sm:w-[20%] flex flex-col sm:-mt-5 me-4 sm:me-6"},ve=e("label",{for:"status"},"Cliente",-1),pe={class:"w-full sm:w-[20%] flex mt-2 space-x-4"},_e={key:1,for:"modal-canc-res-cli",class:"w-fit botao-danger px-2 transition-all duration-1000"},he={class:"card w-full h-full max-h-[97%] bg-base-100 shadow-xl overflow-auto rounded-md"},xe={class:"card-body flex flex-col sm:flex-row"},be={class:"w-full flex flex-col flex-wrap md:flex-row"},we=["id","onClick"],ge={class:"w-full -mt-6 flex justify-end"},ke={class:"w-full flex"},Ce={class:"w-5/12 mb-4 -ml-6 -mt-4"},ye=["src"],Pe={class:"w-7/12 mb-4 ml-4 -mt-4 space-y-2"},Se=e("span",{class:"font-bold text-sm text-red-500"},"Painel: ",-1),Be={class:"font-extrabold text-xs"},Re=e("br",null,null,-1),Ve=e("span",{class:"font-bold text-sm text-red-500"},"Campanha: ",-1),je={class:"font-extrabold text-xs"},Ae=e("br",null,null,-1),De=e("span",{class:"font-bold text-sm text-red-500"},"Obs.: ",-1),Ee={class:"font-extrabold text-xs"},Oe=e("input",{type:"checkbox",id:"modal-canc-res-cli",class:"modal-toggle"},null,-1),$e={class:"modal flex items-end md:items-center"},Le={method:"dialog",class:"modal-box bg-white"},Te={class:"font-black text-2xl animate-pulse duration-200 text-center mb-2"},Ue=e("h3",{class:"font-black text-2xl text-red-700 animate-pulse duration-200 text-center"},"ATENÇÃO!",-1),Ie=e("p",{class:"py-4"},"Ao cancelar esta reserva, o painel ficará disponível na Bi-semana selecionada, e poderá ser reservado imadiatamente.",-1),Ne=e("p",{class:"py-4 text-center"},"Confirme somente se tiver certeza do cancelamento!",-1),Ge=e("label",{for:"paineis-del"},"Painéis Selecionados",-1),Me={class:"modal-action"},Fe={class:"w-full flex justify-center space-x-4"},Ze=e("label",{for:"modal-canc-res-cli",class:"w-5/12 text-sm botao-modal bg-gray-700 hover:bg-gray-500"},"Manter Painéis",-1),as={__name:"ReservaPaineisCli",props:["ambiente","clientes","anos","bisemanas","paineis"],setup(w){const p=w,_=l(p.paineis),R=K(),f=l([]),g=l([]),c=l([]);l(Object.keys(p.clientes).map(a=>p.clientes[a]));let k=M([]);const v=l([]),V=l(0),C=l(0);let o=l(""),O=l("");const d=l(0),y=l(!1);F(o,a=>{j(d.value),P()});function $({id:a,nome_fantasia:s,razao_social:t}){return`${s||t}`}function L(a){a.forEach(s=>{k.push("Painel: "+s.identificacao+"; End: "+s.logradouro+" - "+s.numero+"; Ref: "+s.ponto_referencia+" - id:   "+s.id)})}function P(){c.value=[],v.value=[],g.value.forEach(s=>{s.checked=!1})}function T(a,s,t){const i=g.value[a];i.classList,Object.values(c.value).includes(s)?(c.value.splice(c.value.indexOf(s),1),v.value.splice(c.value.indexOf(t),1),i.checked=!1):(c.value.push(s),v.value.push(t),i.checked=!0)}function U(a){if(p.ambiente=="local")var s="http://localhost:8000/storage/"+a;else var s="/storage/"+a;return s}function I(){axios.post("/GetBisemanas",{bisemana:C.value}).then(a=>{V.value=Object.values(a.data),d.value=0,f.value=[]})}function N(a){axios.post("/GetPaineisCli",{bsId:a,cliente:o.value}).then(s=>{f.value=s.data.reservas,_.value=s.data.paineis,k.length=0,k.length==0&&L(_.value)})}function j(a){axios.post("/GetPaineisCli",{bsId:a,cliente:o.value}).then(s=>{f.value=s.data.reservas,_.value=s.data.paineis}),axios.post("/GetCliente",{cliente:o}).then(s=>{O.value=s.data})}function G(){axios.post("/DelResCliente",{paineisId:v.value,bs:d.value}).then(a=>{j(d.value),a.data.cod===0?R.error(a.data.msg):a.data.cod==1&&R.success(a.data.msg),P()})}function A(a){a==="t"?y.value=!0:y.value=!1}return(a,s)=>(r(),u(x,null,[h(m(z),{title:"Painéis"}),h(J,null,{default:Z(()=>[e("div",X,[e("div",Y,[e("div",ee,[se,b(),e("p",te,n(f.value.length),1)])]),e("div",ae,[e("div",le,[e("div",oe,[ie,S(e("select",{class:"select-paineis",name:"ano",id:"ano","onUpdate:modelValue":s[0]||(s[0]=t=>C.value=t),onChange:s[1]||(s[1]=t=>I())},[ne,(r(!0),u(x,null,B(w.anos,(t,i)=>(r(),u("option",{key:i,value:t.id},n(t.ano_bisemana),9,ce))),128))],544),[[D,C.value]])]),e("div",de,[re,S(e("select",{class:"select-paineis",name:"bi-semana",id:"bi-semama","onUpdate:modelValue":s[2]||(s[2]=t=>d.value=t),onChange:s[3]||(s[3]=t=>N(d.value))},[ue,(r(!0),u(x,null,B(V.value,(t,i)=>(r(),u("option",{key:i,value:t.id},"BS: "+n(t.num_bisemana)+" "+n(new Date(t.inicio).toLocaleDateString("pt-br",{timeZone:"UTC"}))+" até "+n(new Date(t.fim).toLocaleDateString("pt-br",{timeZone:"UTC"})),9,me))),128))],544),[[D,d.value]])]),e("div",fe,[ve,h(m(W),{disabled:d.value==0,modelValue:m(o),"onUpdate:modelValue":s[4]||(s[4]=t=>q(o)?o.value=t:o=t),options:w.clientes,"custom-label":$,selectLabel:"Enter para selecionar",multiple:!1,"close-on-select":!0,"show-labels":!0,placeholder:"Selecione o Cliente"},null,8,["disabled","modelValue","options"])]),e("div",pe,[m(o)!=0?(r(),u("label",{key:0,onClick:s[5]||(s[5]=t=>(P(),A("t"))),for:"modal-add-painel",class:"w-fit botao-modal px-2 transition-all duration-1000"},"Incluir painéis")):E("",!0),m(o)!=0&&c.value.length>0?(r(),u("label",_e,"Excluir Selecionados")):E("",!0)])])]),e("div",he,[e("div",xe,[e("div",be,[(r(!0),u(x,null,B(f.value,(t,i)=>(r(),u("div",{key:i,class:"card w-full sm:w-[30%] card-reserva-cliente"},[e("div",{class:"card-body flex",id:i,onClick:ze=>T(i,t.identificacao,t.id)},[e("div",ge,[e("input",{type:"checkbox",ref_for:!0,ref_key:"itemRefs",ref:g,class:"border-0 checkbox checkbox-success"},null,512)]),e("div",ke,[e("div",Ce,[e("img",{class:"w-36 h-24",src:U(t.image_url),alt:"Foto-painel"},null,8,ye)]),e("div",Pe,[Se,e("span",Be,n(t.identificacao)+" - "+n(t.nome_fantasia?t.nome_fantasia:t.razao_social),1),Re,Ve,b(),e("span",je,n(t.campanha),1),b(),Ae,De,b(),e("span",Ee,n(t.obs),1)])])],8,we)]))),128))])])]),h(Q,{openAdd:y.value,cliente:m(o),paineis:_.value,bisemana:d.value,onCloseAdd:A},null,8,["openAdd","cliente","paineis","bisemana"]),Oe,e("div",$e,[e("form",Le,[e("h3",Te,"Cancelar Reserva: Painéis "+n(v.value),1),Ue,Ie,Ne,Ge,S(e("textarea",{class:"w-full input input-bordered",type:"text",name:"paineis-del",id:"paineis-del","onUpdate:modelValue":s[6]||(s[6]=t=>c.value=t),disabled:""},null,512),[[H,c.value]]),e("div",Me,[e("div",Fe,[Ze,e("label",{onClick:s[7]||(s[7]=t=>G()),for:"modal-canc-res-cli",class:"w-5/12 text-sm botao-modal bg-red-700 hover:bg-red-500"},"Cancelar Painéis")])])])])])]),_:1})],64))}};export{as as default};